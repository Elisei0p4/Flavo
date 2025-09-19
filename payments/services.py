import stripe
import json
import logging
from decimal import Decimal
from typing import List, Optional, TypedDict
import jsonschema
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from users.models import CustomUser
from products.models import Product
from orders.models import Order, OrderItem, PromoCode
from orders.tasks import send_order_confirmation_email, award_cashback

stripe.api_key = settings.STRIPE_SECRET_KEY
logger = logging.getLogger(__name__)

WEBHOOK_METADATA_SCHEMA = {
    "type": "object",
    "properties": {
        "user_id": {"type": "string", "pattern": r"^\d+$"},
        "address": {"type": "string", "minLength": 1},
        "promo_code": {"type": "string"},
        "items_data": {"type": "string"}
    },
    "required": ["user_id", "address", "items_data"],
    "additionalProperties": False
}

ITEMS_DATA_SCHEMA = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {"type": "string", "pattern": r"^\d+$"},
            "q": {"type": "integer", "minimum": 1}
        },
        "required": ["id", "q"],
        "additionalProperties": False
    },
    "minItems": 1
}

class PaymentServiceError(Exception):
    """Кастомное исключение для ошибок в сервисе платежей."""
    pass

class OrderItemData(TypedDict):
    """DTO для данных позиции заказа."""
    product_id: int
    quantity: int

class WebhookMetadata(TypedDict):
    """DTO для метаданных вебхука Stripe."""
    user: CustomUser
    items_data: List[OrderItemData]
    address: str
    promo_code: Optional[str]

def create_stripe_checkout_session(user: CustomUser, items_data: list[dict], address: str, promo_code_str: str | None) -> str:
    """
    Проверяет корзину, вычисляет цену и создает Stripe Checkout Session.
    Заказ в базе НЕ создается до успешной оплаты.
    """
    if not items_data:
        raise PaymentServiceError("Заказ не может быть пустым.")

    product_ids = [item['product_id'] for item in items_data]
    products = Product.objects.in_bulk(product_ids)
    
    line_items = []
    total_price = Decimal('0.00')

    for item_data in items_data:
        product = products.get(item_data['product_id'])
        if not product:
            raise PaymentServiceError(f"Продукт с ID {item_data['product_id']} не найден.")
        
        quantity = item_data['quantity']
        if product.stock < quantity:
            raise PaymentServiceError(f"Недостаточно товара '{product.name}'. Доступно: {product.stock}.")

        price_in_cents = int(product.price * 100)
        line_items.append({
            'price_data': {
                'currency': 'rub',
                'product_data': {'name': product.name},
                'unit_amount': price_in_cents,
            },
            'quantity': quantity,
        })
        total_price += product.price * quantity

    promo_code_instance = None
    if promo_code_str:
        try:
            promo_code_instance = PromoCode.objects.get(code__iexact=promo_code_str)
            if not promo_code_instance.is_valid():
                raise PaymentServiceError("Промокод недействителен.")
            if not promo_code_instance.stripe_coupon_id:
                logger.warning("Промокод %s не имеет связанного купона в Stripe.", promo_code_str)
                promo_code_instance = None
        except PromoCode.DoesNotExist:
            raise PaymentServiceError("Промокод не найден.")

    metadata = {
        "user_id": user.id,
        "address": address,
        "promo_code": promo_code_str if promo_code_instance else "",
        "items_data": json.dumps([{'id': p.id, 'q': i['quantity']} for p, i in zip(products.values(), items_data)])
    }

    try:
        session_params = {
            'payment_method_types': ['card'],
            'line_items': line_items,
            'metadata': metadata,
            'mode': 'payment',
            'success_url': f"{settings.SITE_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            'cancel_url': f"{settings.SITE_URL}/payment/cancel",
        }
        if promo_code_instance and promo_code_instance.stripe_coupon_id:
            session_params['discounts'] = [{'coupon': promo_code_instance.stripe_coupon_id}]

        checkout_session = stripe.checkout.Session.create(**session_params)
        
        logger.info(
            "Stripe checkout session created for user %s with total %s (items: %d)",
            user.username, total_price, len(line_items)
        )
        
        return checkout_session.url
    except Exception as e:
        logger.error(
            "Failed to create Stripe checkout session for user %s: %s",
            user.username, str(e)
        )
        raise PaymentServiceError(f"Ошибка при создании сессии Stripe: {str(e)}")

def _parse_webhook_metadata(session: stripe.checkout.Session) -> WebhookMetadata:
    """Парсит метаданные из Stripe сессии и возвращает валидированные данные."""
    metadata = session.metadata
    
    try:
        jsonschema.validate(metadata, WEBHOOK_METADATA_SCHEMA)

        try:
            user = CustomUser.objects.get(id=int(metadata["user_id"]))
        except CustomUser.DoesNotExist:
            raise PaymentServiceError(f"User with ID {metadata['user_id']} not found")
        

        try:
            raw_items_data = json.loads(metadata["items_data"])
        except json.JSONDecodeError as e:
            raise PaymentServiceError(f"Invalid JSON in items_data: {e}")
        

        jsonschema.validate(raw_items_data, ITEMS_DATA_SCHEMA)
        

        items_data = [
            OrderItemData(
                product_id=int(item['id']),
                quantity=int(item['q'])
            )
            for item in raw_items_data
        ]
        
        address = metadata["address"]
        promo_code_str = metadata.get("promo_code") or None
        
        return WebhookMetadata(
            user=user,
            items_data=items_data,
            address=address,
            promo_code=promo_code_str
        )
    except jsonschema.ValidationError as e:
        logger.error("Stripe webhook validation error: %s", e.message)
        raise PaymentServiceError(f"Webhook metadata validation failed: {e.message}")
    except Exception as e:
        logger.error("Stripe webhook error: %s", e)
        raise PaymentServiceError(f"Invalid webhook metadata: {e}")

@transaction.atomic
def _validate_and_reserve_stock(items_data: List[OrderItemData], products: dict) -> Decimal:
    """Проверяет наличие товара и резервирует его. Возвращает общую стоимость."""
    total_price = Decimal('0.00')
    
    for item in items_data:
        product = products.get(item.product_id)
        if not product:
            raise PaymentServiceError(f"Product with ID {item.product_id} not found")
        
        if product.stock < item.quantity:
            logger.critical("Out of stock during webhook fulfillment for product '%s'", product.name)
            raise PaymentServiceError("Нехватка товара в момент подтверждения оплаты.")
        
        total_price += product.price * item.quantity
    
    return total_price

@transaction.atomic
def _create_order_with_items(user: CustomUser, address: str, items_data: List[OrderItemData], 
                           products: dict, promo_code_instance, discount_amount: Decimal,
                           final_price: Decimal, session: stripe.checkout.Session) -> Order:
    """Создает заказ и его позиции, списывает товар со склада."""
    order = Order.objects.create(
        customer=user,
        address=address,
        total_price=final_price,
        promo_code=promo_code_instance,
        discount_amount=discount_amount,
        status=Order.OrderStatus.PENDING,
        stripe_session_id=session.id,
        stripe_payment_intent_id=session.payment_intent
    )

    for item_data in items_data:
        product = products[item_data.product_id]
        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=item_data.quantity,
            price_at_order=product.price
        )
        product.stock -= item_data.quantity
        product.save(update_fields=['stock'])
    
    return order

def fulfill_order_from_webhook(session: stripe.checkout.Session):
    """
    Создает заказ в БД после получения успешного вебхука от Stripe,
    используя данные из метаданных сессии.
    """
    payment_intent_id = session.payment_intent

    if Order.objects.filter(stripe_payment_intent_id=payment_intent_id).exists():
        logger.info("Order with payment_intent_id=%s already processed", payment_intent_id)
        return

    metadata = _parse_webhook_metadata(session)
    
    product_ids = [item.product_id for item in metadata.items_data]
    products = Product.objects.select_for_update().in_bulk(product_ids)
    
    total_price = _validate_and_reserve_stock(metadata.items_data, products)

    promo_code_instance = None
    discount_amount = Decimal('0.00')
    if metadata.promo_code:
        promo_code_instance = PromoCode.objects.get(code__iexact=metadata.promo_code)
        discount_amount = total_price * (Decimal(promo_code_instance.discount_percent) / 100)

    final_price = total_price - discount_amount

    amount_paid_cents = int(session.amount_total)
    final_price_cents = int(final_price * 100)
    
    if amount_paid_cents != final_price_cents:
        logger.error("Amount mismatch for order. Paid=%s cents Expected=%s cents", amount_paid_cents, final_price_cents)
        raise PaymentServiceError("Несоответствие суммы оплаты. Обработка заказа остановлена.")

    order = _create_order_with_items(
        metadata.user, metadata.address, metadata.items_data, products, 
        promo_code_instance, discount_amount, final_price, session
    )
    
    logger.info(
        "Order %s created for user %s with total %s (discount: %s, final: %s)",
        order.id, metadata.user.username, total_price, discount_amount, final_price
    )
    
    cache.incr(f"user_orders_count_{metadata.user.id}")
    cache.delete(f"user_orders_{metadata.user.id}")
    
    send_order_confirmation_email.delay(str(order.id))
    
    if promo_code_instance:
        logger.info(
            "Promo code '%s' applied to order %s with discount %s",
            promo_code_instance.code, order.id, discount_amount
        )