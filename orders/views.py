from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from core.serializers import ErrorResponseSerializer
from .models import Order, PromoCode
from .serializers import OrderSerializer, PromoCodeSerializer
from api.permissions import IsOwnerOrReadOnly
from .services import cancel_order

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для просмотра заказов пользователя.
    Создание и изменение заказов происходит через систему оплаты.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
             return Order.objects.none()
        return Order.objects.filter(customer=self.request.user).prefetch_related('items__product')
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Отмена заказа пользователем.
        """
        order = self.get_object()
        try:

            cancel_order(order=order)
            return Response({'status': 'Заказ успешно отменен'}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PromoCodeViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PromoCodeSerializer

    @extend_schema(
        summary="Validate a promo code",
        request={"application/json": {"type": "object", "properties": {"code": {"type": "string"}}}},
        responses={
            200: PromoCodeSerializer,
            400: ErrorResponseSerializer,
            404: ErrorResponseSerializer,
        }
    )
    @action(detail=False, methods=['post'])
    def validate(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'detail': 'Промокод не предоставлен.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            promo = PromoCode.objects.get(code__iexact=code)
            if promo.is_valid():
                serializer = self.serializer_class(promo)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Промокод недействителен.'}, status=status.HTTP_400_BAD_REQUEST)
        except PromoCode.DoesNotExist:
            return Response({'detail': 'Промокод не найден.'}, status=status.HTTP_404_NOT_FOUND)