import logging
from django.db import transaction, models
from .models import Order

logger = logging.getLogger(__name__)

@transaction.atomic
def cancel_order(order: Order):
    """Отменяет заказ и возвращает зарезервированный товар на склад."""
    if order.status == Order.OrderStatus.COMPLETED:
        raise ValueError("Невозможно отменить уже доставленный заказ.")
        
    if order.status == Order.OrderStatus.CANCELLED:
        raise ValueError("Заказ уже отменен.")

    for item in order.items.all():
        if item.product:
            item.product.stock = models.F('stock') + item.quantity
            item.product.save(update_fields=['stock'])

    order.status = Order.OrderStatus.CANCELLED
    order.save(update_fields=['status'])
    
    logger.info(
        "Order %s cancelled for user %s (total: %s, items returned: %d)",
        order.id, order.customer.username if order.customer else 'Unknown', 
        order.total_price, order.items.count()
    )
    