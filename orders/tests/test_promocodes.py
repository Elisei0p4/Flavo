import pytest
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from orders.models import PromoCode

User = get_user_model()

@pytest.fixture
def user():
    return User.objects.create_user(username='promouser', password='password')

@pytest.fixture
def valid_promo():
    return PromoCode.objects.create(
        code='SALE10',
        discount_percent=10,
        valid_from=timezone.now() - timedelta(days=1),
        valid_to=timezone.now() + timedelta(days=1),
        is_active=True
    )

@pytest.fixture
def expired_promo():
    return PromoCode.objects.create(
        code='OLD20',
        discount_percent=20,
        valid_from=timezone.now() - timedelta(days=10),
        valid_to=timezone.now() - timedelta(days=1),
        is_active=True
    )

@pytest.fixture
def inactive_promo():
    return PromoCode.objects.create(
        code='OFF30',
        discount_percent=30,
        valid_from=timezone.now() - timedelta(days=1),
        valid_to=timezone.now() + timedelta(days=1),
        is_active=False
    )

@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestPromoCodeAPI:
    def test_validate_promo_unauthorized(self, api_client, valid_promo):
        """Тест: неавторизованный пользователь не может валидировать промокод."""
        url = '/api/v1/promocodes/validate/'
        response = api_client.post(url, {'code': valid_promo.code}, format='json')
        assert response.status_code == 401

    def test_validate_promo_success(self, api_client, user, valid_promo):
        """Тест: успешная валидация промокода."""
        api_client.force_authenticate(user=user)
        url = '/api/v1/promocodes/validate/'
        response = api_client.post(url, {'code': 'SALE10'}, format='json')
        
        assert response.status_code == 200
        assert response.data['code'] == 'SALE10'
        assert response.data['discount_percent'] == 10
        assert response.data['is_valid'] is True

    def test_validate_promo_expired(self, api_client, user, expired_promo):
        """Тест: валидация просроченного промокода."""
        api_client.force_authenticate(user=user)
        url = '/api/v1/promocodes/validate/'
        response = api_client.post(url, {'code': 'OLD20'}, format='json')
        
        assert response.status_code == 400
        assert response.data['detail'] == 'Промокод недействителен.'

    def test_validate_promo_inactive(self, api_client, user, inactive_promo):
        """Тест: валидация неактивного промокода."""
        api_client.force_authenticate(user=user)
        url = '/api/v1/promocodes/validate/'
        response = api_client.post(url, {'code': 'OFF30'}, format='json')
        
        assert response.status_code == 400
        assert response.data['detail'] == 'Промокод недействителен.'

    def test_validate_promo_not_found(self, api_client, user):
        """Тест: валидация несуществующего промокода."""
        api_client.force_authenticate(user=user)
        url = '/api/v1/promocodes/validate/'
        response = api_client.post(url, {'code': 'NOTREAL'}, format='json')
        
        assert response.status_code == 404
        assert response.data['detail'] == 'Промокод не найден.'