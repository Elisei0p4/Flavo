import pytest
from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from orders.models import Order

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def customer_user():
    return User.objects.create_user(username='customer', password='password', role=User.Role.CUSTOMER)

@pytest.fixture
def manager_user():
    return User.objects.create_user(username='manager', password='password', role=User.Role.MANAGER, is_staff=True)

@pytest.fixture
def sample_order(customer_user):
    return Order.objects.create(customer=customer_user, total_price=Decimal('100.00'), address="Test Address")

@pytest.mark.django_db
class TestManagerDashboardAPI:

    def test_customer_cannot_access_dashboard(self, api_client, customer_user, sample_order):
        """Тест: обычный пользователь не может получить доступ к списку заказов в дашборде."""
        api_client.force_authenticate(user=customer_user)
        url = '/api/v1/dashboard/orders/'
        response = api_client.get(url)
        assert response.status_code == 403

    def test_manager_can_access_dashboard(self, api_client, manager_user, sample_order):
        """Тест: менеджер может получить доступ к списку всех заказов."""
        api_client.force_authenticate(user=manager_user)
        url = '/api/v1/dashboard/orders/'
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data['count'] == 1
        assert response.data['results'][0]['id'] == str(sample_order.id)

    def test_manager_can_update_order_status(self, api_client, manager_user, sample_order):
        """Тест: менеджер может изменить статус заказа."""
        api_client.force_authenticate(user=manager_user)
        url = f'/api/v1/dashboard/orders/{sample_order.id}/'
        data = {'status': Order.OrderStatus.CANCELLED}
        response = api_client.patch(url, data, format='json')
        
        assert response.status_code == 200
        assert response.data['status'] == Order.OrderStatus.CANCELLED
        
        sample_order.refresh_from_db()
        assert sample_order.status == Order.OrderStatus.CANCELLED

    def test_manager_cannot_update_other_fields(self, api_client, manager_user, sample_order):
        """Тест: менеджер не может изменить другие поля заказа через эндпоинт обновления."""
        api_client.force_authenticate(user=manager_user)
        url = f'/api/v1/dashboard/orders/{sample_order.id}/'
        data = {'address': 'New Fake Address'}
        response = api_client.patch(url, data, format='json')
        
        assert response.status_code == 200
        
        sample_order.refresh_from_db()
        assert sample_order.address == "Test Address"