from rest_framework import viewsets, permissions
from .models import FAQ
from .serializers import FAQSerializer

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    """API эндпоинт для получения списка FAQ."""
    queryset = FAQ.objects.all().order_by('order')
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]