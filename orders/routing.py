from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/track_order/(?P<order_id>[0-9a-f-]+)/$', consumers.OrderTrackerConsumer.as_asgi()),
]