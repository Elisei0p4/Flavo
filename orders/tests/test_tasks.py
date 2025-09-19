import pytest
from unittest.mock import patch, MagicMock
from celery import chain
from django.contrib.auth import get_user_model
from orders.models import Order
from orders.tasks import process_order_status, update_order_status_task, send_order_confirmation_email

User = get_user_model()

@pytest.fixture
def user():
    return User.objects.create_user(username='taskuser', password='password')

@pytest.fixture
def order(user):
    return Order.objects.create(customer=user, total_price=100.00, address="123 Main St")

@pytest.mark.django_db
@patch('orders.tasks.update_order_status_task')
@patch('orders.tasks.chain')
def test_process_order_status_starts_chain(mock_chain, mock_update_task, order):
    """
    Проверяем, что создается цепочка из трех вызовов update_order_status_task
    с ожидаемыми аргументами, без жёсткой привязки к позиции аргументов.
    """
    process_order_status(str(order.id))

    mock_chain.assert_called_once()
    mock_chain.return_value.apply_async.assert_called_once()

    expected_statuses = [
        Order.OrderStatus.PREPARING,
        Order.OrderStatus.DELIVERING,
        Order.OrderStatus.COMPLETED,
    ]
    called_statuses = [call.kwargs.get('new_status') or (len(call.args) > 1 and call.args[1])
                       for call in mock_update_task.s.call_args_list]
    assert called_statuses == expected_statuses

@pytest.mark.django_db
@patch('orders.tasks.send_status_update')
def test_update_order_status_task_success(mock_send_update, order):
    """
    Тест: Убеждаемся, что update_order_status_task обновляет статус и отправляет уведомление.
    """
    new_status = Order.OrderStatus.PREPARING
    message = "Заказ готовится"
    
    update_order_status_task(str(order.id), new_status, message)
    
    order.refresh_from_db()
    
    assert order.status == new_status
    
    mock_send_update.assert_called_once_with(str(order.id), new_status, message)

@pytest.mark.django_db
@patch('orders.tasks.process_order_status.delay')
def test_send_order_confirmation_email_triggers_processing(mock_process_order, order):
    """
    Тест: Убеждаемся, что после отправки email запускается задача обработки статусов.
    """
    send_order_confirmation_email(str(order.id))
    
    mock_process_order.assert_called_once_with(str(order.id))