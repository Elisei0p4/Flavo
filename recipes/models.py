from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _

class RecipeCategory(models.Model):
    """Модель для категорий рецептов (например, "Основные блюда", "Десерты")."""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название категории')
    slug = models.SlugField(max_length=120, unique=True, blank=True, db_index=True)
    icon = models.ImageField(upload_to='recipe_category_icons/', blank=True, null=True, verbose_name='Иконка')

    class Meta:
        verbose_name = 'Категория рецепта'
        verbose_name_plural = 'Категории рецептов'
        ordering = ['name']

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class RecipeTag(models.Model):
    """Модель для тегов рецептов (например, "Веганский", "Быстро", "Французская кухня")."""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название тега')
    slug = models.SlugField(max_length=120, unique=True, blank=True, db_index=True)

    class Meta:
        verbose_name = 'Тег рецепта'
        verbose_name_plural = 'Теги рецептов'

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Recipe(models.Model):
    """Модель для рецептов."""

    class Difficulty(models.TextChoices):
        EASY = 'EASY', _('Легкий')
        MEDIUM = 'MEDIUM', _('Средний')
        HARD = 'HARD', _('Сложный')

    title = models.CharField(max_length=200, verbose_name='Название рецепта')
    slug = models.SlugField(max_length=220, unique=True, blank=True, db_index=True, verbose_name='URL Slug')
    short_description = models.TextField(verbose_name='Краткое описание', help_text='Короткое описание для списка рецептов')
    full_description = models.TextField(verbose_name='Полное описание', help_text='Подробное пошаговое описание приготовления')
    
    image = models.ImageField(upload_to='recipes/', verbose_name='Изображение рецепта')
    prep_time = models.PositiveIntegerField(verbose_name='Время подготовки (мин)')
    cook_time = models.PositiveIntegerField(verbose_name='Время приготовления (мин)')
    servings = models.PositiveIntegerField(default=1, verbose_name='Количество порций', validators=[MinValueValidator(1)])
    
    difficulty = models.CharField(
        max_length=10,
        choices=Difficulty.choices,
        default=Difficulty.MEDIUM,
        verbose_name='Сложность'
    )
    
    category = models.ForeignKey(
        RecipeCategory,
        related_name='recipes',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Категория'
    )
    tags = models.ManyToManyField(RecipeTag, related_name='recipes', blank=True, verbose_name='Теги')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Рецепт'
        verbose_name_plural = 'Рецепты'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['difficulty']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            original_slug = slugify(self.title)
            self.slug = original_slug
            queryset = Recipe.objects.filter(slug=self.slug).exclude(pk=self.pk)
            counter = 1
            while queryset.exists():
                self.slug = f'{original_slug}-{counter}'
                queryset = Recipe.objects.filter(slug=self.slug).exclude(pk=self.pk)
                counter += 1
        super().save(*args, **kwargs)