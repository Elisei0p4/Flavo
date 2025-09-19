from rest_framework import viewsets, permissions
from .models import Product, Collection, Tag, Category
from .serializers import (
    ProductSerializer, CollectionSerializer, CollectionDetailSerializer, 
    TagSerializer, CategorySerializer
)
from .filters import ProductFilter


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для категорий. Теперь всегда отдает свежие данные из БД.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для продуктов. Теперь всегда отдает свежие данные из БД.
    """
    queryset = Product.objects.all().prefetch_related('tags', 'collections', 'category').order_by('id')
    serializer_class = ProductSerializer
    filterset_class = ProductFilter
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для коллекций. Теперь всегда отдает свежие данные из БД.
    """
    queryset = Collection.objects.all().prefetch_related('products__tags')
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CollectionDetailSerializer
        return CollectionSerializer

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для тегов. Теперь всегда отдает свежие данные из БД.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'