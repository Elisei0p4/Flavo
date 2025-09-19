import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from orders.routing import websocket_urlpatterns
from api.middleware import JwtAuthMiddleware
from pizza_project.telemetry import setup_telemetry

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pizza_project.settings.local')

setup_telemetry()

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JwtAuthMiddleware(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})