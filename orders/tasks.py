from celery import shared_task, chain
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging
from django.conf import settings
from django.core.cache import cache
from .models import Order
from users.models import CustomUser
from decimal import Decimal

logger = logging.getLogger(__name__)

@shared_task
def award_cashback(order_id: str):
    """
    Начисляет кэшбек пользователю за заказ.
    """
    try:
        order = Order.objects.get(id=order_id)
        cashback_percent = getattr(settings, "CASHBACK_PERCENT", 10)
        cashback_amount = order.total_price * (Decimal(cashback_percent) / 100)
        
        order.customer.flavo_coins += cashback_amount
        order.customer.save(update_fields=['flavo_coins'])
        
        cache.delete(f"user_{order.customer.id}")
        cache.delete(f"user_profile_{order.customer.id}")
        
        logger.info(
            "Cashback %s awarded to user %s for order %s (total: %s, percent: %s%%)",
            cashback_amount, order.customer.username, order_id, order.total_price, cashback_percent
        )
        
        print(f"Начислен кэшбек {cashback_amount} пользователю {order.customer.id} за заказ {order_id}")
        return f"Кэшбек {cashback_amount} начислен за заказ {order_id}"
    except Order.DoesNotExist:
        logger.error("Order %s not found for cashback award", order_id)
        print(f"Заказ {order_id} не найден для начисления кэшбека")
        return f"Заказ {order_id} не найден"

@shared_task
def send_order_confirmation_email(order_id: str):
    """
    Отправляет email-подтверждение о создании и оплате заказа.
    """
    print(f"Отправка подтверждения для заказа {order_id}...")

    process_order_status.delay(order_id)
    return f"Подтверждение для заказа {order_id} отправлено, обработка запущена."

def send_status_update(order_id, status, message):
    """Вспомогательная функция для отправки обновления через WebSocket."""
    channel_layer = get_channel_layer()
    order_group_name = f'order_{order_id}'
    async_to_sync(channel_layer.group_send)(
        order_group_name,
        {
            'type': 'order_status_update',
            'status': status,
            'message': message,
        }
    )

@shared_task(bind=True)
def update_order_status_task(self, order_id, new_status, message):
    """
    Обновляет статус заказа и отправляет уведомление.
    """
    try:
        order = Order.objects.get(id=order_id)
        order.status = new_status
        order.save(update_fields=['status'])
        send_status_update(str(order.id), new_status, message)
        return f"Статус заказа {order_id} обновлен на {new_status}"
    except Order.DoesNotExist:
        logger.critical("КРИТИЧЕСКАЯ ОШИБКА: Заказ %s не найден при обновлении статуса", order_id)

        try:
            import sentry_sdk
            sentry_sdk.capture_exception()
        except ImportError:
            pass
        return f"Заказ {order_id} не найден"
    except Exception as exc:
        logger.error("Ошибка при обновлении статуса заказа %s: %s", order_id, exc)
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries), max_retries=3)

@shared_task
def process_order_status(order_id: str):
    """
    Запускает полную цепочку обработки статуса заказа с имитацией задержек.
    """
    try:
        order = Order.objects.select_related('customer').get(id=order_id)
        if order.status != Order.OrderStatus.PENDING:
            logger.warning(f"Заказ {order_id} не в статусе PENDING. Обработка пропущена.")
            return f"Заказ {order_id} уже обработан"
    except Order.DoesNotExist:
        logger.error(f"Заказ с id={order_id} не найден для обработки. Обработка пропущена.")
        return f"Заказ {order_id} не найден"

    workflow = chain(
        update_order_status_task.s(order_id, Order.OrderStatus.PREPARING, "Ваш заказ отправлен на кухню...").set(countdown=10),
        update_order_status_task.s(order_id, Order.OrderStatus.DELIVERING, "Ваш кулинарный шедевр передан в службу доставки. Курьер уже в пути!").set(countdown=20),
        update_order_status_task.s(order_id, Order.OrderStatus.COMPLETED, "Ваш заказ доставлен. Приятного аппетита!"),
        award_cashback.s(order_id)
    )
    workflow.apply_async()
    return f"Цепочка обработки для заказа {order_id} запущена."