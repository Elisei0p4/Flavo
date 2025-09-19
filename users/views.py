from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer

# --- НОВЫЙ VIEWSET ---
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для просмотра информации о пользователях.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """
        Возвращает данные о текущем аутентифицированном пользователе.
        """
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)


@method_decorator(ratelimit(key='ip', rate='5/m', method='POST'), name='post')
class RegisterView(generics.CreateAPIView):
    """
    API эндпоинт для регистрации нового пользователя.
    Защищен от брутфорса: максимум 5 попыток в минуту с одного IP.
    """
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer