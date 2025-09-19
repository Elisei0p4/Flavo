from rest_framework import serializers

class CartItemSerializer(serializers.Serializer):
    """Сериализатор для одной позиции в корзине."""
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1)

class CreateCheckoutSessionSerializer(serializers.Serializer):
    """Сериализатор для создания сессии оплаты Stripe."""
    items = CartItemSerializer(many=True, required=True)
    promo_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(required=True, max_length=255)