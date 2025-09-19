import json
import pytest
import responses
from decimal import Decimal
from unittest.mock import patch, MagicMock

from django.test import TestCase
from django.contrib.auth import get_user_model

from payments.services import create_stripe_checkout_session, PaymentServiceError
from products.factories import ProductFactory
from orders.factories import PromoCodeFactory
from orders.models import PromoCode

User = get_user_model()


class StripeResponsesTestCase(TestCase):    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.product = ProductFactory(price=Decimal('100.00'), stock=10)
        self.items_data = [{'product_id': self.product.id, 'quantity': 2}]
        self.address = "Test Address 123"
    
    @responses.activate
    def test_create_checkout_session_success(self):
        """Test successful checkout session creation."""

        responses.add(
            responses.POST,
            'https://api.stripe.com/v1/checkout/sessions',
            json={
                'id': 'cs_test_123',
                'url': 'https://checkout.stripe.com/pay/cs_test_123'
            },
            status=200
        )
        

        checkout_url = create_stripe_checkout_session(
            user=self.user,
            items_data=self.items_data,
            address=self.address,
            promo_code_str=None
        )
        
        self.assertEqual(checkout_url, 'https://checkout.stripe.com/pay/cs_test_123')
        

        self.assertEqual(len(responses.calls), 1)
        request = responses.calls[0].request
        self.assertEqual(request.method, 'POST')
        self.assertIn('line_items', json.loads(request.body))
    
    @responses.activate
    def test_create_checkout_session_with_promo_code(self):
        """Test checkout session creation with promo code."""

        promo_code = PromoCodeFactory(
            code="SALE20",
            discount_percent=20,
            stripe_coupon_id="coupon_test_123"
        )
        responses.add(
            responses.POST,
            'https://api.stripe.com/v1/checkout/sessions',
            json={
                'id': 'cs_test_123',
                'url': 'https://checkout.stripe.com/pay/cs_test_123'
            },
            status=200
        )
        

        checkout_url = create_stripe_checkout_session(
            user=self.user,
            items_data=self.items_data,
            address=self.address,
            promo_code_str=promo_code.code
        )
        
        self.assertEqual(checkout_url, 'https://checkout.stripe.com/pay/cs_test_123')
        

        self.assertEqual(len(responses.calls), 1)
        request = responses.calls[0].request
        self.assertEqual(request.method, 'POST')
        
        request_body = request.body.decode('utf-8')

        self.assertIn('discounts[0][coupon]=coupon_test_123', request_body)
    
    @responses.activate
    def test_create_checkout_session_stripe_error(self):
        """Test handling of Stripe API errors."""

        responses.add(
            responses.POST,
            'https://api.stripe.com/v1/checkout/sessions',
            json={'error': {'message': 'Invalid request'}},
            status=400
        )
        

        with self.assertRaises(PaymentServiceError):
            create_stripe_checkout_session(
                user=self.user,
                items_data=self.items_data,
                address=self.address,
                promo_code_str=None
            )
    
    @responses.activate
    def test_create_checkout_session_insufficient_stock(self):
        """Test handling of insufficient stock."""

        product_no_stock = ProductFactory(price=Decimal('100.00'), stock=0)
        items_data = [{'product_id': product_no_stock.id, 'quantity': 1}]
        

        with self.assertRaises(PaymentServiceError) as context:
            create_stripe_checkout_session(
                user=self.user,
                items_data=items_data,
                address=self.address,
                promo_code_str=None
            )
        
        self.assertIn('Недостаточно товара', str(context.exception))
    
    @responses.activate
    def test_create_checkout_session_invalid_promo_code(self):
        """Test handling of invalid promo code."""

        with self.assertRaises(PaymentServiceError) as context:
            create_stripe_checkout_session(
                user=self.user,
                items_data=self.items_data,
                address=self.address,
                promo_code_str='INVALID_CODE'
            )
        
        self.assertIn('Промокод не найден', str(context.exception))
    
    @responses.activate
    def test_create_checkout_session_with_promo_without_stripe_id(self):

        promo_code = PromoCodeFactory(code="NOSTRIPEID", stripe_coupon_id=None)
        

        responses.add(
            responses.POST,
            'https://api.stripe.com/v1/checkout/sessions',
            json={
                'id': 'cs_test_no_discount',
                'url': 'https://checkout.stripe.com/pay/cs_test_no_discount'
            },
            status=200
        )
        
        checkout_url = create_stripe_checkout_session(
            user=self.user,
            items_data=self.items_data,
            address=self.address,
            promo_code_str=promo_code.code
        )
        
        self.assertEqual(checkout_url, 'https://checkout.stripe.com/pay/cs_test_no_discount')
        

        request_body = responses.calls[0].request.body.decode('utf-8')
        self.assertNotIn('discounts', request_body)
    
    @responses.activate
    def test_create_checkout_session_empty_cart(self):
        with self.assertRaises(PaymentServiceError) as context:
            create_stripe_checkout_session(
                user=self.user,
                items_data=[],
                address=self.address,
                promo_code_str=None
            )
        
        self.assertIn('Корзина не может быть пустой', str(context.exception))
