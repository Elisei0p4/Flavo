import os
import random
import shutil
import subprocess
from pathlib import Path
from django.conf import settings
from django.core.files import File
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction
from django.core.cache import cache
from django.contrib.auth import get_user_model
from slugify import slugify 
import factory


from users.factories import UserFactory, AdminUserFactory
from products.factories import CategoryFactory, TagFactory, CollectionFactory, ProductFactory
from orders.factories import PromoCodeFactory, OrderFactory
from recipes.factories import RecipeCategoryFactory, RecipeTagFactory, RecipeFactory
from core.models import FAQ 

from products.models import Product, Tag, Collection, Category
from orders.models import Order, OrderItem, PromoCode
from recipes.models import RecipeCategory, RecipeTag, Recipe
from core.models import FAQ

User = get_user_model()

NUM_USERS = 15
NUM_CATEGORIES = 8 
NUM_TAGS = 10 
NUM_COLLECTIONS = 5
NUM_PRODUCTS_PER_CATEGORY = 5
NUM_PROMO_CODES = 5

NUM_RECIPE_CATEGORIES = 6
NUM_RECIPE_TAGS = 10
NUM_RECIPES_PER_CATEGORY = 5

NUM_ORDERS_PER_USER = 3
NUM_FAQS = 5

PRODUCT_NAMES_TEMPLATES = {
    "Основные блюда": [
        "Курица по-французски с картофелем", "Говядина Бургиньон", "Утиная грудка с вишневым соусом",
        "Рыба в соусе Нантуа", "Рататуй по-провансальски", "Креветки по-парижски"
    ],
    "Салаты": [
        "Салат Нисуаз", "Зеленый салат с козьим сыром", "Салат с уткой конфи",
        "Салат Цезарь по-французски"
    ],
    "Десерты": [
        "Крем-брюле", "Шоколадный фондан", "Тарт Татен",
        "Мильфей с ягодами", "Профитроли со сливками"
    ],
    "Закуски": [
        "Фуа-гра с джемом", "Устрицы с соусом миньонет", "Сырная тарелка",
        "Тартар из лосося"
    ],
    "Супы": [
        "Французский луковый суп", "Крем-суп из шампиньонов", "Буйабес",
        "Суп-пюре из брокколи"
    ]
}

RECIPE_TITLES_TEMPLATES = {
    "Завтраки": [
        "Французские тосты с ягодами", "Омлет Пуляр", "Круассаны с ветчиной и сыром",
        "Яичница-болтунья с трюфелем"
    ],
    "Первые блюда": [
        "Крем-суп из тыквы с имбирем", "Суп Вишисуаз", "Рыбный суп по-марсельски"
    ],
    "Вторые блюда": [
        "Утиная ножка конфи", "Котлеты по-киевски", "Лазанья болоньезе",
        "Филе миньон с перечным соусом"
    ],
    "Десерты и выпечка": [
        "Макаронс ассорти", "Эклеры с ванильным кремом", "Яблочный пирог",
        "Лимонный тарт"
    ],
    "Напитки": [
        "Домашний лимонад с мятой", "Ягодный компот", "Глинтвейн по-французски"
    ]
}

PRODUCT_DESCRIPTIONS = [
    "Изысканное блюдо, приготовленное по традиционным рецептам с использованием только свежайших ингредиентов. Насыщенный вкус и нежная текстура порадуют даже самых взыскательных гурманов.",
    "Легкий и освежающий вариант для обеда или ужина. Сочетание хрустящих овощей и ароматных трав придаст энергии на весь день.",
    "Классический французский десерт, который растопит ваше сердце. Нежная текстура и богатый вкус делают его идеальным завершением трапезы.",
    "Отличный выбор для быстрого перекуса или как дополнение к основному блюду. Простой в приготовлении, но насыщенный вкус.",
    "Авторское блюдо от нашего шеф-повара. Уникальное сочетание ингредиентов и оригинальная подача сделают ваш ужин незабываемым.",
]

RECIPE_SHORT_DESCRIPTIONS = [
    "Быстрый и вкусный рецепт для ужина в кругу семьи.",
    "Идеально подходит для праздничного стола.",
    "Простой рецепт, который освоит даже начинающий кулинар.",
    "Настоящий кулинарный шедевр, который удивит ваших гостей.",
    "Полезный и питательный завтрак для бодрого утра."
]

RECIPE_FULL_DESCRIPTIONS = [
    """Шаг 1: Подготовьте ингредиенты. Нарежьте овощи соломкой, мясо небольшими кубиками.
Шаг 2: Обжарьте мясо до золотистой корочки, затем добавьте овощи и тушите 10 минут.
Шаг 3: Влейте бульон, доведите до кипения и готовьте на медленном огне 30 минут до готовности.""",
    """Шаг 1: Приготовьте тесто. Смешайте муку, яйца, молоко и сахар. Оставьте на 15 минут.
Шаг 2: Выпекайте тонкие блинчики на раскаленной сковороде.
Шаг 3: Смажьте каждый блинчик кремом и украсьте ягодами.""",
    """Шаг 1: Отварите макароны аль денте.
Шаг 2: Приготовьте соус: обжарьте бекон, добавьте сливки, сыр и специи.
Шаг 3: Смешайте макароны с соусом и подавайте горячими."""
]


class Command(BaseCommand):
    help = 'Seeds the database for FLAVO project. Prioritizes loading from a dump if available, otherwise generates procedurally.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("= НАЧАЛО ПРОЦЕССА НАПОЛНЕНИЯ БАЗЫ ДАННЫХ FLAVO ="))
        
        DUMP_PATH = settings.BASE_DIR / 'seed_data' / 'dump'
        MEDIA_ARCHIVE = DUMP_PATH / 'media_dump.tar.gz'
        
        if os.path.exists(MEDIA_ARCHIVE):
            self.stdout.write(self.style.NOTICE("--> Обнаружен 'снимок' сайта. Загрузка из него..."))
            self.load_from_dump(DUMP_PATH, MEDIA_ARCHIVE)
        else:
            self.stdout.write(self.style.NOTICE("--> 'Снимок' сайта не найден. Запуск процедурной генерации..."))
            self.run_procedural_seeding()
            
        self.stdout.write(self.style.SUCCESS("= БАЗА ДАННЫХ FLAVO УСПЕШНО НАПОЛНЕНА! ="))

    def _clear_all_data(self):
        """Очищает все данные и медиа-файлы."""
        self.stdout.write("    - Очистка базы данных и папки media...")
        
        # Удаляем данные
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Tag.objects.all().delete()
        Collection.objects.all().delete()
        PromoCode.objects.all().delete()
        Recipe.objects.all().delete()
        RecipeCategory.objects.all().delete()
        RecipeTag.objects.all().delete()
        FAQ.objects.all().delete()
        

        User.objects.filter(is_superuser=False, is_staff=False).delete() 
        User.objects.filter(username__startswith='user').delete() 
        User.objects.filter(username='root').delete()


        media_path = settings.MEDIA_ROOT
        if os.path.exists(media_path):
            for filename in os.listdir(media_path):
                file_path = os.path.join(media_path, filename)
                try:
                    if os.path.isfile(file_path) or os.path.islink(file_path):
                        os.unlink(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Не удалось удалить {file_path}. Причина: {e}'))
        

        os.makedirs(media_path, exist_ok=True)

        self.stdout.write(self.style.SUCCESS("      Старые данные успешно удалены."))

    def load_from_dump(self, dump_path, media_archive):
        self._clear_all_data()

        self.stdout.write(f"    - Шаг 2: Распаковка архива {media_archive}...")
        try:
            media_root_path = Path(settings.MEDIA_ROOT)
            shutil.unpack_archive(str(media_archive), extract_dir=str(media_root_path.parent))
            self.stdout.write(self.style.SUCCESS(f"    Папка media успешно распакована в {settings.MEDIA_ROOT}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"    Ошибка при распаковке media: {e}"))
            return

        self.stdout.write("    - Шаг 3: Загрузка данных из JSON-фикстур...")
        FIXTURES_ORDER = [
            'customuser.json', 
            'category.json', 
            'tag.json', 
            'collection.json',
            'product.json', 
            'promocode.json',
            'order.json', 
            'orderitem.json', 
            'recipecategory.json',
            'recipetag.json',
            'recipe.json',
            'faq.json', 
        ]
        
        for fixture_file in FIXTURES_ORDER:
            fixture_path = dump_path / fixture_file
            if os.path.exists(fixture_path):
                self.stdout.write(f"      - Загрузка {fixture_file}...")
                try:
                    call_command('loaddata', str(fixture_path))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"      Ошибка загрузки {fixture_file}: {e}"))
            else:
                 self.stdout.write(self.style.WARNING(f"      - Файл фикстуры {fixture_file} не найден, пропуск."))

        self.stdout.write("    - Шаг 4: Очистка кэша...")
        cache.clear()
        self.stdout.write(self.style.SUCCESS("--> Загрузка из 'снимка' завершена."))

    def run_procedural_seeding(self):
        self._clear_all_data() 

        self.stdout.write("    - Шаг 2: Создание новых данных...")
        

        AdminUserFactory()
        self.stdout.write(self.style.SUCCESS("      Суперпользователь 'root/admin' создан."))

        users = UserFactory.create_batch(NUM_USERS)
        self.stdout.write(self.style.SUCCESS(f"      Создано {NUM_USERS} обычных пользователей."))


        product_categories = []
        base_seed_images_dir = settings.BASE_DIR / 'seed_data' / 'images'


        for name in PRODUCT_NAMES_TEMPLATES.keys():
            category = CategoryFactory(name=name, slug=slugify(name))
            product_categories.append(category)
            icon_dir = base_seed_images_dir / 'category_icons'
            if os.path.exists(icon_dir) and os.listdir(icon_dir):
                icon_file = random.choice(os.listdir(icon_dir))
                with open(icon_dir / icon_file, 'rb') as f:
                    category.icon.save(f"category_icons/{category.slug}-icon.png", File(f), save=True)
        self.stdout.write(self.style.SUCCESS(f"      Создано {len(product_categories)} категорий продуктов."))

        tags = TagFactory.create_batch(NUM_TAGS)
        collections = CollectionFactory.create_batch(NUM_COLLECTIONS)
        self.stdout.write(self.style.SUCCESS(f"      Создано {NUM_TAGS} тегов продуктов и {NUM_COLLECTIONS} коллекций."))
        
        products_pool = []
        for category_obj in product_categories:
            product_names_in_category = PRODUCT_NAMES_TEMPLATES.get(category_obj.name, [])
            for i in range(min(NUM_PRODUCTS_PER_CATEGORY, len(product_names_in_category))):
                product_name_base = product_names_in_category[i]
                unique_product_name = f"{product_name_base} {random.randint(100, 999)}"

                product_image_dir = base_seed_images_dir / 'products'
                product_image_file = None
                if os.path.exists(product_image_dir) and os.listdir(product_image_dir):
                    product_image_file = random.choice(os.listdir(product_image_dir))
                
                product = ProductFactory(
                    name=unique_product_name,
                    slug=slugify(unique_product_name), 
                    category=category_obj,
                    description=random.choice(PRODUCT_DESCRIPTIONS),
                    ingredients=factory.Faker('sentence'), 
                    chef_recommendation=factory.Faker('sentence'), 
                    tags=random.sample(tags, k=random.randint(1, min(3, len(tags)))),
                    collections=random.sample(collections, k=random.randint(0, min(1, len(collections)))),
                )
                
                if product_image_file:
                    with open(product_image_dir / product_image_file, 'rb') as f:
                        product.image.save(f"products/{product.slug}.jpg", File(f), save=True)
                
                products_pool.append(product)
        self.stdout.write(self.style.SUCCESS(f"      Создано {len(products_pool)} продуктов."))


        recipe_categories = []
        for name in RECIPE_TITLES_TEMPLATES.keys():
            category = RecipeCategoryFactory(name=name, slug=slugify(name))
            recipe_categories.append(category)
            icon_dir = base_seed_images_dir / 'recipe_category_icons'
            if os.path.exists(icon_dir) and os.listdir(icon_dir):
                icon_file = random.choice(os.listdir(icon_dir))
                with open(icon_dir / icon_file, 'rb') as f:
                    category.icon.save(f"recipe_category_icons/{category.slug}-icon.png", File(f), save=True)
        self.stdout.write(self.style.SUCCESS(f"      Создано {len(recipe_categories)} категорий рецептов."))

        recipe_tags = RecipeTagFactory.create_batch(NUM_RECIPE_TAGS)
        self.stdout.write(self.style.SUCCESS(f"      Создано {NUM_RECIPE_TAGS} тегов рецептов."))

        recipes_pool = []
        for category_obj in recipe_categories:
            recipe_titles_in_category = RECIPE_TITLES_TEMPLATES.get(category_obj.name, [])
            for i in range(min(NUM_RECIPES_PER_CATEGORY, len(recipe_titles_in_category))):
                recipe_title_base = recipe_titles_in_category[i]
                unique_recipe_title = f"{recipe_title_base} {random.randint(100, 999)}"

                recipe_image_dir = base_seed_images_dir / 'recipes'
                recipe_image_file = None
                if os.path.exists(recipe_image_dir) and os.listdir(recipe_image_dir):
                    recipe_image_file = random.choice(os.listdir(recipe_image_dir))
                
                recipe = RecipeFactory(
                    title=unique_recipe_title,
                    slug=slugify(unique_recipe_title),
                    category=category_obj,
                    short_description=random.choice(RECIPE_SHORT_DESCRIPTIONS),
                    full_description=random.choice(RECIPE_FULL_DESCRIPTIONS),
                    tags=random.sample(recipe_tags, k=random.randint(1, min(3, len(recipe_tags)))),
                )
                if recipe_image_file:
                    with open(recipe_image_dir / recipe_image_file, 'rb') as f:
                        recipe.image.save(f"recipes/{recipe.slug}.jpg", File(f), save=True)
                
                recipes_pool.append(recipe)
        self.stdout.write(self.style.SUCCESS(f"      Создано {len(recipes_pool)} рецептов."))


        promo_codes = PromoCodeFactory.create_batch(NUM_PROMO_CODES)
        self.stdout.write(self.style.SUCCESS(f"      Создано {NUM_PROMO_CODES} промокодов."))

        # FAQ
        for i in range(NUM_FAQS):
            FAQ.objects.create(
                question=f"Вопрос {i+1} о FLAVO?",
                answer=f"Ответ на вопрос {i+1}. Здесь содержится полезная информация о нашем сервисе, продуктах и доставке.",
                order=i
            )
        self.stdout.write(self.style.SUCCESS(f"      Создано {NUM_FAQS} FAQ."))


        for user_obj in users:
            OrderFactory(
                customer=user_obj, 
                promo_code=random.choice(promo_codes) if random.random() < 0.5 else None 
            )
        self.stdout.write(self.style.SUCCESS(f"      Создано {len(users)} заказов (по 1 на пользователя для простоты)."))

        self.stdout.write("    - Шаг 3: Очистка кэша...")
        cache.clear()
        self.stdout.write(self.style.SUCCESS("      Кэш успешно очищен."))