import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.core.exceptions import ValidationError

class PromoCode(models.Model):
    code = models.CharField(max_length=50, unique=True, verbose_name="Промокод")
    discount_percent = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        verbose_name="Процент скидки"
    )
    valid_from = models.DateTimeField(verbose_name="Действителен с")
    valid_to = models.DateTimeField(verbose_name="Действителен до")
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    stripe_coupon_id = models.CharField(max_length=255, blank=True, null=True, verbose_name="ID купона в Stripe")

    def clean(self):
        if self.valid_from and self.valid_to and self.valid_from > self.valid_to:
            raise ValidationError("Дата начала действия не может быть позже даты окончания.")

    def is_valid(self):
        now = timezone.now()
        return self.is_active and self.valid_from <= now <= self.valid_to

    def __str__(self):
        return f"{self.code} ({self.discount_percent}%)"

    class Meta:
        verbose_name = "Промокод"
        verbose_name_plural = "Промокоды"

class Order(models.Model):
    class OrderStatus(models.TextChoices):
        PENDING = 'PENDING', 'Ожидает подтверждения'
        PREPARING = 'PREPARING', 'Готовится'
        DELIVERING = 'DELIVERING', 'Доставляется'
        COMPLETED = 'COMPLETED', 'Доставлен'
        CANCELLED = 'CANCELLED', 'Отменен'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='orders',
        verbose_name='Покупатель'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    address = models.CharField(max_length=255, verbose_name='Адрес доставки')
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        verbose_name='Статус заказа'
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Итоговая цена')
    
    promo_code = models.ForeignKey(
        PromoCode,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name="Примененный промокод"
    )
    discount_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00,
        verbose_name="Сумма скидки"
    )
    stripe_session_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True, unique=True)


    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self):
        return f'Заказ {self.id} от {self.customer}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name='Заказ')
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Продукт'
    )
    quantity = models.PositiveIntegerField(verbose_name='Количество')
    price_at_order = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Цена на момент заказа'
    )

    class Meta:
        verbose_name = 'Позиция заказа'
        verbose_name_plural = 'Позиции заказа'

    def __str__(self):
        return f'{self.product.name if self.product else "Удаленный Продукт"} ({self.quantity} шт.)'