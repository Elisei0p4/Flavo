from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views import ProductViewSet, CollectionViewSet, TagViewSet, CategoryViewSet
from orders.views import OrderViewSet, PromoCodeViewSet
from users.views import UserViewSet, RegisterView
from core.views import health_check
from dashboard.views import ManagerOrderViewSet
from core.api_views import FAQViewSet
from payments.views import StripeWebhookView, CreateCheckoutSessionView
from recipes.views import RecipeViewSet, RecipeCategoryViewSet, RecipeTagViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'collections', CollectionViewSet)
router.register(r'tags', TagViewSet)
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'users', UserViewSet, basename='user')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'promocodes', PromoCodeViewSet, basename='promocode')
router.register(r'dashboard/orders', ManagerOrderViewSet, basename='manager-order')
router.register(r'recipes', RecipeViewSet, basename='recipe')
router.register(r'recipe-categories', RecipeCategoryViewSet, basename='recipe-category')
router.register(r'recipe-tags', RecipeTagViewSet, basename='recipe-tag')

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('auth/register/', RegisterView.as_view(), name='user-register'),
    path('payments/create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('payments/stripe-webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
    path('', include(router.urls)),
]