import pytest
import json
from decimal import Decimal
from unittest.mock import patch, MagicMock

from celery import chain
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from users.factories import UserFactory
from products.models import Product
from orders.models import Order
from .services import fulfill_order_from_webhook, PaymentServiceError, create_stripe_checkout_session

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return UserFactory(username='testuser', password='password123', flavo_coins=0)

@pytest.fixture
def product1():
    return Product.objects.create(name='Spice A', price=Decimal('100.00'), stock=10)

@pytest.fixture
def product2():
    return Product.objects.create(name='Spice B', price=Decimal('50.00'), stock=0)

@pytest.mark.django_db
class TestCreateCheckoutSessionAPI:
    
    @patch('payments.services.stripe.checkout.Session.create')
    def test_create_session_success(self, mock_stripe_create, api_client, user, product1):
        """Тест: успешное создание сессии оплаты Stripe с передачей всей инфы в metadata."""
        mock_stripe_create.return_value = MagicMock(url='http://fake-stripe-url.com')
        
        api_client.force_authenticate(user=user)
        url = reverse('create-checkout-session')
        data = {
            "items": [{"product_id": product1.id, "quantity": 2}],
            "address": "123 Test St",
            "promo_code": None
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['url'] == 'http://fake-stripe-url.com'
        
        mock_stripe_create.assert_called_once()
        _, call_kwargs = mock_stripe_create.call_args
        assert call_kwargs['line_items'][0]['price_data']['unit_amount'] == 10000
        assert call_kwargs['metadata']['user_id'] == user.id
        assert call_kwargs['metadata']['address'] == "123 Test St"
        assert Order.objects.count() == 0

    def test_create_session_with_out_of_stock_product(self, api_client, user, product2):
        """Тест: попытка создать сессию с товаром, которого нет в наличии."""
        api_client.force_authenticate(user=user)
        url = reverse('create-checkout-session')
        data = {
            "items": [{"product_id": product2.id, "quantity": 1}],
            "address": "123 Test St"
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'Недостаточно товара' in response.data['error']


@pytest.mark.django_db
class TestStripeWebhookFulfillment:
    
    @patch('payments.services.send_order_confirmation_email.delay')
    def test_fulfill_order_from_webhook_success(self, mock_send_email_delay, user, product1):
        """Тест: вебхук корректно создает заказ, списывает товары и запускает таску подтверждения."""
        initial_stock = product1.stock
        fake_session = MagicMock(
            payment_intent="pi_12345",
            id="cs_12345",
            amount_total=20000, # 2 * 100.00 * 100
            metadata={
                "user_id": user.id,
                "address": "123 Webhook St",
                "promo_code": "",
                "items_data": json.dumps([{'id': product1.id, 'q': 2}])
            }
        )
        
        fulfill_order_from_webhook(fake_session)
        
        assert Order.objects.count() == 1
        order = Order.objects.first()
        assert order.customer == user
        assert order.status == Order.OrderStatus.PENDING
        assert order.total_price == Decimal('200.00')
        assert order.stripe_payment_intent_id == "pi_12345"
        
        product1.refresh_from_db()
        assert product1.stock == initial_stock - 2

        mock_send_email_delay.assert_called_once_with(str(order.id))

    def test_fulfill_order_idempotency(self, user, product1):
        """Тест: повторный вызов вебхука с тем же payment_intent не создает дубликат заказа."""
        fake_session = MagicMock(
            payment_intent="pi_idempotent_abc",
            id="cs_idempotent",
            amount_total=10000,
            metadata={
                "user_id": user.id, "address": "Addr", "promo_code": "",
                "items_data": json.dumps([{'id': product1.id, 'q': 1}])
            }
        )
        
        # Первый вызов
        fulfill_order_from_webhook(fake_session)
        assert Order.objects.count() == 1
        
        # Второй вызов
        fulfill_order_from_webhook(fake_session)
        assert Order.objects.count() == 1
    
    def test_fulfill_order_race_condition_out_of_stock(self, user, product1):
        """Тест: вебхук падает, если товара не хватило в момент подтверждения (гонка)."""
        product1.stock = 1
        product1.save()

        fake_session = MagicMock(
            payment_intent="pi_race_condition",
            id="cs_race",
            amount_total=20000,
            metadata={
                "user_id": user.id, "address": "Race Addr", "promo_code": "",
                "items_data": json.dumps([{'id': product1.id, 'q': 2}])
            }
        )

        with pytest.raises(PaymentServiceError, match="Нехватка товара в момент подтверждения оплаты."):
            fulfill_order_from_webhook(fake_session)

        assert Order.objects.count() == 0