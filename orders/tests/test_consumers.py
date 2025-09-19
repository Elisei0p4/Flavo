import pytest
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from orders.models import Order
from pizza_project.asgi import application

User = get_user_model()

@pytest.fixture
def customer_user():
    return User.objects.create_user(username='customer', password='password')

@pytest.fixture
def other_user():
    return User.objects.create_user(username='other', password='password')
    
@pytest.fixture
def manager_user():
    return User.objects.create_user(username='manager', password='password', role=User.Role.MANAGER, is_staff=True)

@pytest.fixture
def order(customer_user):
    return Order.objects.create(customer=customer_user, total_price=100, address='Test Address')

@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
class TestOrderTrackerConsumer:
    
    async def test_customer_can_connect_to_own_order(self, customer_user, order):
        """Тест: Владелец заказа может подключиться к вебсокету."""
        token = AccessToken.for_user(customer_user)
        communicator = WebsocketCommunicator(application, f"/ws/track_order/{order.id}/?token={token}")
        
        connected, _ = await communicator.connect()
        assert connected, "Соединение должно было быть установлено для владельца заказа"
        await communicator.disconnect()

    async def test_customer_cannot_connect_to_foreign_order(self, other_user, order):
        """Тест: Пользователь не может подключиться к чужому заказу."""
        token = AccessToken.for_user(other_user)
        communicator = WebsocketCommunicator(application, f"/ws/track_order/{order.id}/?token={token}")
        
        connected, close_code = await communicator.connect()
        assert not connected, "Соединение с чужим заказом должно быть отклонено"

    async def test_manager_can_connect_to_any_order(self, manager_user, order):
        """Тест: Менеджер может подключиться к любому заказу."""
        token = AccessToken.for_user(manager_user)
        communicator = WebsocketCommunicator(application, f"/ws/track_order/{order.id}/?token={token}")
        
        connected, _ = await communicator.connect()
        assert connected, "Соединение для менеджера должно быть установлено"
        await communicator.disconnect()

    async def test_unauthenticated_user_cannot_connect(self, order):
        """Тест: Анонимный пользователь не может подключиться."""
        communicator = WebsocketCommunicator(application, f"/ws/track_order/{order.id}/")
        
        connected, _ = await communicator.connect()
        assert not connected, "Анонимное соединение должно быть отклонено"