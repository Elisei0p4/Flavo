import factory
from factory.django import DjangoModelFactory
from django.contrib.auth import get_user_model
from .models import Product, Tag, Collection, Category
from decimal import Decimal
from slugify import slugify
import random

User = get_user_model()

class CategoryFactory(DjangoModelFactory):
    """Factory for creating Category instances."""
    
    class Meta:
        model = Category
        django_get_or_create = ('name',) 
    
    name = factory.Sequence(lambda n: f"Категория {n}")
    slug = factory.LazyAttribute(lambda obj: slugify(obj.name))
    icon = factory.django.ImageField(filename='test_category_icon.png')


class TagFactory(DjangoModelFactory):
    """Factory for creating Tag instances."""
    
    class Meta:
        model = Tag
        django_get_or_create = ('name',)
    
    name = factory.Sequence(lambda n: f"Тег {n}")
    slug = factory.LazyAttribute(lambda obj: slugify(obj.name))


class CollectionFactory(DjangoModelFactory):
    """Factory for creating Collection instances."""
    
    class Meta:
        model = Collection
        django_get_or_create = ('name',)
    
    name = factory.Sequence(lambda n: f"Коллекция {n}")
    description = factory.Faker('paragraph', nb_sentences=3)
    image = factory.django.ImageField(filename='test_collection_image.png')
    slug = factory.LazyAttribute(lambda obj: slugify(obj.name))


class ProductFactory(DjangoModelFactory):
    """Factory for creating Product instances."""
    
    class Meta:
        model = Product
    
    name = factory.Sequence(lambda n: f"Продукт {n}")
    slug = factory.LazyAttribute(lambda obj: slugify(obj.name))
    description = factory.Faker('paragraph', nb_sentences=5)
    ingredients = factory.Faker('text', max_nb_chars=100) 
    chef_recommendation = factory.Faker('sentence') 
    price = factory.Faker('pydecimal', left_digits=3, right_digits=2, positive=True, min_value=100, max_value=1000)
    image = factory.django.ImageField(filename='test_product_image.png')
    stock = factory.Faker('random_int', min=0, max=100)
    is_featured = factory.Faker('boolean', chance_of_getting_true=25)
    
    category = factory.SubFactory(CategoryFactory)

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return
        
        if extracted:
            for tag in extracted:
                self.tags.add(tag)
        else:
            tags = TagFactory.create_batch(random.randint(1, 3))
            for tag in tags:
                self.tags.add(tag)
    
    @factory.post_generation
    def collections(self, create, extracted, **kwargs):
        if not create:
            return
        
        if extracted:
            for collection in extracted:
                self.collections.add(collection)
        else:
            collections = CollectionFactory.create_batch(random.randint(0, 1))
            for collection in collections:
                self.collections.add(collection)