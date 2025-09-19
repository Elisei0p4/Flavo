import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

from .models import Order

User = get_user_model()


class OrderTrackerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.order_id = self.scope['url_route']['kwargs']['order_id']
        self.order_group_name = f'order_{self.order_id}'
        self.user = self.scope.get('user')

        if not (self.user and self.user.is_authenticated):
            await self.close()
            return

        has_permission = await self.check_order_permission()
        if not has_permission:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.order_group_name,
            self.channel_name
        )

        await self.accept()

    @database_sync_to_async
    def check_order_permission(self):
        """
        Проверяет право пользователя на подключение к трекингу заказа:
         - владелец заказа,
         - или менеджер/стаж (role == User.Role.MANAGER) / is_staff
        """
        try:
            order = Order.objects.get(pk=self.order_id)
        except Order.DoesNotExist:
            return False

        if self.user.is_staff or self.user.role == User.Role.MANAGER:
            return True

        if order.customer == self.user:
            return True

        return False

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.order_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def order_status_update(self, event):
        status = event.get('status')
        message = event.get('message')

        await self.send(text_data=json.dumps({
            'status': status,
            'message': message
        }))
