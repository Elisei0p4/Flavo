import stripe
from django.conf import settings
from rest_framework import views, status, permissions
import logging
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from core.serializers import ErrorResponseSerializer

from .services import create_stripe_checkout_session, fulfill_order_from_webhook, PaymentServiceError
from .serializers import CreateCheckoutSessionSerializer

class CreateCheckoutSessionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CreateCheckoutSessionSerializer

    @extend_schema(
        summary="Создать сессию оплаты Stripe",
        description="Принимает состав корзины и адрес, возвращает URL для оплаты.",
        request=CreateCheckoutSessionSerializer,
        responses={
            200: {'description': 'URL для редиректа на страницу оплаты Stripe.'},
            400: ErrorResponseSerializer,
            500: ErrorResponseSerializer,
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        try:
            checkout_url = create_stripe_checkout_session(
                user=request.user,
                items_data=validated_data['items'],
                address=validated_data['address'],
                promo_code_str=validated_data.get('promo_code')
            )
            return Response({'url': checkout_url}, status=status.HTTP_200_OK)
        except PaymentServiceError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error in CreateCheckoutSessionView: {e}")
            return Response(
                {'error': 'Внутренняя ошибка сервера при создании платежа.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StripeWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]
    logger = logging.getLogger(__name__)

    @extend_schema(
        summary="Обработчик вебхуков Stripe",
        description="Этот эндпоинт не предназначен для прямого вызова. Он принимает POST-запросы от Stripe.",
        request=None,
        responses={200: {'description': 'Вебхук успешно принят.'}}
    )
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            if session.payment_status == "paid":
                try:
                    fulfill_order_from_webhook(session)
                except Exception as e:
                    self.logger.error("Error processing Stripe webhook: %s", e)
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)