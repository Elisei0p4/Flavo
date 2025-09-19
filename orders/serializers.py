from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Order, OrderItem, PromoCode
from products.serializers import ProductSerializer
from api.fields import EnumChoiceField

class PromoCodeSerializer(serializers.ModelSerializer):
    is_valid = serializers.SerializerMethodField()

    class Meta:
        model = PromoCode
        fields = ('code', 'discount_percent', 'is_valid')
    
    def get_is_valid(self, obj: PromoCode) -> bool:
        return obj.is_valid()

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'quantity', 'price_at_order')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer = serializers.StringRelatedField()
    status = EnumChoiceField(Order.OrderStatus)
    promo_code = serializers.StringRelatedField()

    class Meta:
        model = Order
        fields = ('id', 'customer', 'created_at', 'total_price', 'status', 'address', 'items', 'promo_code', 'discount_amount')