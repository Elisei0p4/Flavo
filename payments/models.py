from django.db import models
from django.conf import settings

class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'В ожидании'
        SUCCEEDED = 'SUCCEEDED', 'Успешно'
        FAILED = 'FAILED', 'Ошибка'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='payments'
    )
    order = models.OneToOneField(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payment'
    )
    stripe_charge_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.id} for {self.amount}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Платеж"
        verbose_name_plural = "Платежи"