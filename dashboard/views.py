from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from orders.models import Order
from api.permissions import IsManager
from api.pagination import StandardResultsSetPagination
from orders.services import cancel_order
from .serializers import ManagerOrderSerializer, ManagerOrderUpdateSerializer

class ManagerOrderViewSet(viewsets.ModelViewSet):
    """
    API эндпоинт для менеджеров для управления всеми заказами.
    """
    permission_classes = [permissions.IsAdminUser, IsManager]
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        return Order.objects.all().prefetch_related('items__product', 'customer')

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ManagerOrderUpdateSerializer
        return ManagerOrderSerializer

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        serializer = self.get_serializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data.get('status')
        
        if new_status == Order.OrderStatus.CANCELLED:
            try:
                cancel_order(order=order)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if new_status:
                order.status = new_status
                order.save(update_fields=['status'])

        full_serializer = ManagerOrderSerializer(order)
        return Response(full_serializer.data, status=status.HTTP_200_OK)