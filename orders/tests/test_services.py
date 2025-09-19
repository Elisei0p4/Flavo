import pytest
from decimal import Decimal
from django.contrib.auth import get_user_model

from orders.models import Order, OrderItem
from products.models import Product
from orders.services import cancel_order

User = get_user_model()

@pytest.fixture
def user():
    return User.objects.create_user(username='serviceuser', password='password')

@pytest.fixture
def product():
    return Product.objects.create(name="Test Product for Service", price=Decimal("25.00"), stock=10)

@pytest.fixture
def order_with_items(user, product):
    order = Order.objects.create(customer=user, total_price=50, address="Test", status=Order.OrderStatus.PENDING)
    OrderItem.objects.create(order=order, product=product, quantity=2, price_at_order=product.price)
    return order

@pytest.mark.django_db
class TestOrderService:

    def test_cancel_order_returns_stock(self, order_with_items, product):
        """Тест: отмена заказа возвращает товары на склад."""
        initial_stock = product.stock
        
        cancel_order(order_with_items)
        
        product.refresh_from_db()
        order_with_items.refresh_from_db()
        
        assert order_with_items.status == Order.OrderStatus.CANCELLED
        assert product.stock == initial_stock + 2

    def test_cancel_completed_order_raises_error(self, order_with_items):
        """Тест: попытка отменить выполненный заказ вызывает исключение."""
        order_with_items.status = Order.OrderStatus.COMPLETED
        order_with_items.save()
        
        with pytest.raises(ValueError, match="Невозможно отменить уже доставленный заказ."):
            cancel_order(order_with_items)

    def test_double_cancel_order_raises_error(self, order_with_items, product):
        """Тест: повторная отмена заказа вызывает исключение и не меняет сток."""
        cancel_order(order_with_items)
        product.refresh_from_db()
        stock_after_first_cancel = product.stock

        with pytest.raises(ValueError, match="Заказ уже отменен."):
            cancel_order(order_with_items)
        
        product.refresh_from_db()
        assert product.stock == stock_after_first_cancel