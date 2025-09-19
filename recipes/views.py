from rest_framework import viewsets, permissions
from .models import Recipe, RecipeCategory, RecipeTag
from .serializers import (
    RecipeSerializer, RecipeDetailSerializer, RecipeCategorySerializer, RecipeTagSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class RecipeFilter(DjangoFilterBackend):
    """Кастомный фильтр для рецептов."""
    class Meta:
        model = Recipe
        fields = {
            'category__slug': ['exact'],
            'tags__slug': ['exact'],
            'difficulty': ['exact'],
            'prep_time': ['lte', 'gte'],
            'cook_time': ['lte', 'gte'],
            'servings': ['exact', 'lte', 'gte'],
        }

class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра рецептов."""
    queryset = Recipe.objects.all().prefetch_related('tags', 'category').order_by('-created_at')
    serializer_class = RecipeSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [RecipeFilter, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'short_description', 'full_description', 'tags__name', 'category__name']
    ordering_fields = ['title', 'created_at', 'prep_time', 'cook_time', 'difficulty']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RecipeDetailSerializer
        return RecipeSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class RecipeCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для категорий рецептов."""
    queryset = RecipeCategory.objects.all().order_by('name')
    serializer_class = RecipeCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class RecipeTagViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для тегов рецептов."""
    queryset = RecipeTag.objects.all().order_by('name')
    serializer_class = RecipeTagSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'