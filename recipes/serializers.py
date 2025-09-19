from rest_framework import serializers
from django.conf import settings
from api.fields import EnumChoiceField
from .models import RecipeCategory, RecipeTag, Recipe

class RecipeCategorySerializer(serializers.ModelSerializer):
    """Сериализатор для категорий рецептов."""
    icon = serializers.SerializerMethodField()

    class Meta:
        model = RecipeCategory
        fields = ('id', 'name', 'slug', 'icon')

    def get_icon(self, obj):
        if obj.icon and hasattr(obj.icon, 'url'):
            return f"{settings.BACKEND_BASE_URL}{obj.icon.url}"
        return None

class RecipeTagSerializer(serializers.ModelSerializer):
    """Сериализатор для тегов рецептов."""
    class Meta:
        model = RecipeTag
        fields = ('id', 'name', 'slug')

class RecipeSerializer(serializers.ModelSerializer):
    """Основной сериализатор для рецептов."""
    image = serializers.SerializerMethodField()
    category = RecipeCategorySerializer(read_only=True)
    tags = RecipeTagSerializer(many=True, read_only=True)
    difficulty = EnumChoiceField(Recipe.Difficulty)

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'slug', 'short_description', 'full_description',
            'image', 'prep_time', 'cook_time', 'servings', 'difficulty',
            'category', 'tags', 'created_at', 'updated_at'
        )

    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return f"{settings.BACKEND_BASE_URL}{obj.image.url}"
        return None

class RecipeDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детального просмотра рецепта (может быть расширен в будущем)."""
    image = serializers.SerializerMethodField()
    category = RecipeCategorySerializer(read_only=True)
    tags = RecipeTagSerializer(many=True, read_only=True)
    difficulty = EnumChoiceField(Recipe.Difficulty)

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'slug', 'short_description', 'full_description',
            'image', 'prep_time', 'cook_time', 'servings', 'difficulty',
            'category', 'tags', 'created_at', 'updated_at'
        )

    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return f"{settings.BACKEND_BASE_URL}{obj.image.url}"
        return None