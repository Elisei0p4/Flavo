from django.db import models

class FAQ(models.Model):
    """Модель для хранения вопросов и ответов (FAQ)."""
    question = models.CharField(max_length=255, verbose_name='Вопрос')
    answer = models.TextField(verbose_name='Ответ')
    order = models.PositiveIntegerField(default=0, blank=False, null=False, verbose_name='Порядок')

    class Meta:
        verbose_name = 'Вопрос и ответ (FAQ)'
        verbose_name_plural = 'Вопросы и ответы (FAQ)'
        ordering = ['order']

    def __str__(self):
        return self.question