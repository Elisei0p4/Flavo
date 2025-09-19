from rest_framework import serializers
from django.conf import settings
from .models import Product, Tag, Collection, Category

class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор для категорий."""
    icon = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'icon')
        
    def get_icon(self, obj):
        if obj.icon and hasattr(obj.icon, 'url'):
            return f"{settings.BACKEND_BASE_URL}{obj.icon.url}"
        return None

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'slug')

class ProductSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'price', 'image', 'sku', 
            'stock', 'tags', 'is_featured', 'category', 'ingredients', 'chef_recommendation'
        )

    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return f"{settings.BACKEND_BASE_URL}{obj.image.url}"
        return None

class CollectionSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Collection
        fields = ('id', 'name', 'description', 'image', 'slug')
    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return f"{settings.BACKEND_BASE_URL}{obj.image.url}"
        return None

class CollectionDetailSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    class Meta:
        model = Collection
        fields = ('id', 'name', 'description', 'image', 'slug', 'products')
    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return f"{settings.BACKEND_BASE_URL}{obj.image.url}"
        return None