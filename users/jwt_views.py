"""
Custom JWT views with rate limiting.
"""
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator


@method_decorator(ratelimit(key='ip', rate='10/m', method='POST'), name='post')
class RateLimitedTokenObtainPairView(TokenObtainPairView):
    """
    JWT token obtain view with rate limiting.
    Максимум 10 попыток в минуту с одного IP.
    """
    pass


@method_decorator(ratelimit(key='ip', rate='20/m', method='POST'), name='post')
class RateLimitedTokenRefreshView(TokenRefreshView):
    """
    JWT token refresh view with rate limiting.
    Максимум 20 попыток в минуту с одного IP.
    """
    pass
