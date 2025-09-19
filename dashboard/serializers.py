from rest_framework import serializers
from api.fields import EnumChoiceField
from orders.models import Order
from orders.serializers import OrderSerializer

class ManagerOrderSerializer(OrderSerializer):
    """
    Сериализатор заказа для дашборда менеджера.
    Может включать дополнительную информацию, если потребуется.
    """
    status = EnumChoiceField(Order.OrderStatus)
    
    class Meta(OrderSerializer.Meta):
        pass


class ManagerOrderUpdateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для обновления статуса заказа менеджером.
    """
    class Meta:
        model = Order
        fields = ['status']