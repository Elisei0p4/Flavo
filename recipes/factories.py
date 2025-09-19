import factory
from factory.django import DjangoModelFactory
from .models import Recipe, RecipeCategory, RecipeTag
from slugify import slugify
import random

class RecipeCategoryFactory(DjangoModelFactory):
    """Factory for creating RecipeCategory instances."""
    class Meta:
        model = RecipeCategory
        django_get_or_create = ('name',) 

    name = factory.Sequence(lambda n: f"Категория Рецептов {n}")
    slug = factory.LazyAttribute(lambda obj: slugify(obj.name))
    icon = factory.django.ImageField(filename='test_recipe_category_icon.png')

class RecipeTagFactory(DjangoModelFactory):
    """Factory for creating RecipeTag instances."""
    class Meta:
        model = RecipeTag
        django_get_or_create = ('name',)

    name = factory.Sequence(lambda n: f"Тег Рецепта {n}")
    slug = factory.LazyAttribute(lambda obj: slugify(obj.name))

class RecipeFactory(DjangoModelFactory):
    """Factory for creating Recipe instances."""
    class Meta:
        model = Recipe

    title = factory.Sequence(lambda n: f"Изысканный Рецепт #{n}")
    slug = factory.LazyAttribute(lambda obj: slugify(obj.title))
    short_description = factory.Faker('paragraph', nb_sentences=3)
    full_description = factory.Faker('paragraph', nb_sentences=10)
    image = factory.django.ImageField(filename='test_recipe_image.png')
    prep_time = factory.Faker('random_int', min=10, max=60)
    cook_time = factory.Faker('random_int', min=20, max=180)
    servings = factory.Faker('random_int', min=1, max=8)
    difficulty = factory.Faker('random_element', elements=[c[0] for c in Recipe.Difficulty.choices])
    category = factory.SubFactory(RecipeCategoryFactory)

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for tag in extracted:
                self.tags.add(tag)
        else:
            num_tags = random.randint(1, 3)
            for _ in range(num_tags):
                self.tags.add(RecipeTagFactory())