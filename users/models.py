from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    """
    Кастомная модель пользователя.
    Добавляем поле для баланса "Flavo Coins" и роли.
    """
    class Role(models.TextChoices):
        CUSTOMER = 'CUSTOMER', _('Customer')
        MANAGER = 'MANAGER', _('Manager')

    flavo_coins = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=1000.00,
        verbose_name='Flavo Coins'
    )
    role = models.CharField(
        max_length=50,
        choices=Role.choices,
        default=Role.CUSTOMER,
        verbose_name='Роль'
    )

    def __str__(self):
        return self.username