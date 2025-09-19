import stripe
from django.conf import settings
from django.contrib import admin
from .models import Order, OrderItem, PromoCode

stripe.api_key = settings.STRIPE_SECRET_KEY

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price_at_order')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'status', 'created_at', 'total_price', 'promo_code')
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'customer__username', 'customer__email')
    inlines = [OrderItemInline]
    readonly_fields = ('created_at', 'id', 'customer', 'total_price', 'promo_code', 'discount_amount')

    def has_add_permission(self, request):
        return False

@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percent', 'valid_from', 'valid_to', 'is_active', 'stripe_coupon_id')
    list_filter = ('is_active',)
    search_fields = ('code',)

    def save_model(self, request, obj: PromoCode, form, change):
        if not obj.stripe_coupon_id:
            try:
                coupon = stripe.Coupon.create(
                    percent_off=float(obj.discount_percent),
                    duration="once",
                    name=f"Скидка {obj.discount_percent}% по коду {obj.code}"
                )
                obj.stripe_coupon_id = coupon.id
            except Exception as e:
                self.message_user(request, f"Не удалось создать купон в Stripe: {e}", level='error')
        super().save_model(request, obj, form, change)