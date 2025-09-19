from django.contrib import admin
from .models import RecipeCategory, RecipeTag, Recipe

@admin.register(RecipeCategory)
class RecipeCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(RecipeTag)
class RecipeTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'difficulty', 'prep_time', 'cook_time', 'servings', 'created_at')
    list_filter = ('category', 'difficulty', 'tags')
    search_fields = ('title', 'short_description', 'full_description')
    prepopulated_fields = {'slug': ('title',)}
    autocomplete_fields = ('tags', 'category')
    
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'short_description', 'full_description', 'image')}),
        ('Детали рецепта', {'fields': ('prep_time', 'cook_time', 'servings', 'difficulty')}),
        ('Категоризация', {'fields': ('category', 'tags')}),
        ('Временные метки', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_at', 'updated_at')