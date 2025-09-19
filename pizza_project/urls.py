from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from users.jwt_views import (
    RateLimitedTokenObtainPairView,
    RateLimitedTokenRefreshView,
)
from core import views as core_views

urlpatterns = [
    path('admin/', admin.site.urls),
    

    path('api/v1/', include('api.urls')),
    path('api/v1/health/', core_views.health_check, name='health'),
    

    path('api/v1/auth/token/', RateLimitedTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', RateLimitedTokenRefreshView.as_view(), name='token_refresh'),
    

    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),


    path('metrics/', include('django_prometheus.urls')),
]


handler404 = 'django.views.defaults.page_not_found'
handler500 = 'django.views.defaults.server_error'
handler403 = 'django.views.defaults.permission_denied'

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)