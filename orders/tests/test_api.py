import pytest
from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from products.models import Product
from orders.models import Order, OrderItem
from orders.services import cancel_order

User = get_user_model()

@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='password')

@pytest.fixture
def another_user():
    return User.objects.create_user(username='anotheruser', password='password')

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def product():
    return Product.objects.create(name="Test Spice", price=Decimal("50.00"), stock=10)

@pytest.mark.django_db
class TestOrderAPI:

    def test_list_orders_unauthorized(self, api_client):
        """Тест: неавторизованный пользователь не может видеть заказы."""
        url = '/api/v1/orders/'
        response = api_client.get(url, format='json')
        assert response.status_code == 401

    def test_list_orders_shows_only_own_orders(self, api_client, user, another_user):
        """Тест: пользователь видит только свои заказы."""
        Order.objects.create(customer=user, total_price=100, address="User 1 Addr")
        Order.objects.create(customer=another_user, total_price=200, address="User 2 Addr")
        
        api_client.force_authenticate(user=user)
        url = '/api/v1/orders/'
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert response.data['count'] == 1
        assert response.data['results'][0]['customer'] == user.username

    def test_retrieve_own_order_success(self, api_client, user):
        """Тест: пользователь может получить детали своего заказа."""
        order = Order.objects.create(customer=user, total_price=150, address="My Home")
        api_client.force_authenticate(user=user)
        url = f'/api/v1/orders/{order.id}/'
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert response.data['id'] == str(order.id)
        assert response.data['address'] == "My Home"

    def test_retrieve_foreign_order_forbidden(self, api_client, user, another_user):
        """Тест: пользователь НЕ может получить детали чужого заказа (получит 404)."""
        order = Order.objects.create(customer=another_user, total_price=100, address="Foreign Home")
        api_client.force_authenticate(user=user)
        url = f'/api/v1/orders/{order.id}/'
        response = api_client.get(url)
        assert response.status_code == 404

    def test_cancel_own_order_success(self, api_client, user, product):
        """Тест: пользователь может успешно отменить свой заказ."""
        order = Order.objects.create(customer=user, total_price=100, address="Addr", status=Order.OrderStatus.PENDING)
        OrderItem.objects.create(order=order, product=product, quantity=2, price_at_order=product.price)
        
        initial_stock = product.stock
        api_client.force_authenticate(user=user)
        url = f'/api/v1/orders/{order.id}/cancel/'
        response = api_client.post(url)
        
        order.refresh_from_db()
        product.refresh_from_db()

        assert response.status_code == 200
        assert order.status == Order.OrderStatus.CANCELLED
        assert product.stock == initial_stock + 2

    def test_cancel_foreign_order_forbidden(self, api_client, user, another_user, product):
        """Тест: пользователь не может отменить чужой заказ."""
        order = Order.objects.create(customer=another_user, total_price=100, address="Addr")
        api_client.force_authenticate(user=user)
        url = f'/api/v1/orders/{order.id}/cancel/'
        response = api_client.post(url)
        
        assert response.status_code == 404