import uuid
from django.db import models, IntegrityError
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from django.conf import settings

SKU_PREFIX = getattr(settings, 'PRODUCT_SKU_PREFIX', 'FLV-')

def generate_sku():
    return f'{SKU_PREFIX}{uuid.uuid4().hex.upper()}'

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название категории')
    slug = models.SlugField(max_length=120, unique=True, blank=True, db_index=True)
    icon = models.ImageField(upload_to='category_icons/', blank=True, null=True, verbose_name='Иконка')

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название тега')
    slug = models.SlugField(max_length=120, unique=True, blank=True, db_index=True)

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Collection(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название коллекции')
    description = models.TextField(verbose_name='Описание')
    image = models.ImageField(upload_to='collections/', verbose_name='Изображение')
    slug = models.SlugField(max_length=120, unique=True, blank=True, db_index=True)

    class Meta:
        verbose_name = 'Коллекция'
        verbose_name_plural = 'Коллекции'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Product(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')
    slug = models.SlugField(max_length=120, unique=True, blank=True, db_index=True, verbose_name='URL Slug')
    description = models.TextField(verbose_name='Описание')
    
    # НОВЫЕ ПОЛЯ
    ingredients = models.TextField(blank=True, verbose_name='Состав и аллергены')
    chef_recommendation = models.TextField(blank=True, verbose_name='Рекомендация от шефа')

    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    image = models.ImageField(upload_to='products/', verbose_name='Изображение')
    sku = models.CharField(max_length=50, unique=True, blank=True, verbose_name='Артикул')
    stock = models.PositiveIntegerField(default=0, verbose_name='Остаток на складе', validators=[MinValueValidator(0)])
    is_featured = models.BooleanField(default=False, verbose_name='Рекомендуемый продукт', db_index=True)
    
    category = models.ForeignKey(
        Category, 
        related_name='products', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        verbose_name='Категория'
    )

    tags = models.ManyToManyField(Tag, related_name='products', blank=True, verbose_name='Теги')
    collections = models.ManyToManyField(Collection, related_name='products', blank=True, verbose_name='Коллекции')

    class Meta:
        verbose_name = 'Продукт'
        verbose_name_plural = 'Продукты'
        indexes = [models.Index(fields=['price'])]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.sku:
            max_attempts = 3
            for attempt in range(max_attempts):
                try:
                    self.sku = generate_sku()
                    break 
                except IntegrityError:
                    if attempt == max_attempts - 1:
                        import time
                        self.sku = f'{generate_sku()}-{int(time.time_ns())}'
                        break
        
        original_slug = self.slug
        queryset = Product.objects.filter(slug=self.slug).exclude(pk=self.pk)
        counter = 1
        while queryset.exists():
            self.slug = f'{original_slug}-{counter}'
            queryset = Product.objects.filter(slug=self.slug).exclude(pk=self.pk)
            counter += 1

        super().save(*args, **kwargs)