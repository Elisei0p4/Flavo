from django.contrib import admin
from django.core.cache import cache
from .models import Product, Tag, Collection, Category

def invalidate_cache(version_key):
    """Увеличивает версию кэша, чтобы сделать его невалидным."""
    try:
        cache.incr(version_key)
    except ValueError:
        cache.set(version_key, 1)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        invalidate_cache('categories_version')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        invalidate_cache('tags_version')
        invalidate_cache('products_version')

@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        invalidate_cache('collections_version')
        invalidate_cache('products_version')
        
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'sku', 'is_featured')
    list_editable = ('price', 'stock', 'is_featured')
    list_filter = ('is_featured', 'collections', 'tags', 'category')
    search_fields = ('name', 'sku', 'description')
    autocomplete_fields = ('tags', 'collections')
    readonly_fields = ('sku',)
    
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'description', 'price', 'stock', 'image', 'is_featured')}),
        ('Детализация', {'fields': ('ingredients', 'chef_recommendation')}),
        ('Категоризация', {'fields': ('category', 'tags', 'collections')}),
        ('Служебная информация', {'fields': ('sku',), 'classes': ('collapse',)}),
    )
    prepopulated_fields = {'slug': ('name',)}

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        invalidate_cache('products_version')

    def delete_model(self, request, obj):
        super().delete_model(request, obj)
        invalidate_cache('products_version')

    def delete_queryset(self, request, queryset):
        super().delete_queryset(request, queryset)
        invalidate_cache('products_version')