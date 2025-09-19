import os
import shutil
import subprocess
from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.cache import cache

class Command(BaseCommand):
    help = 'Dumps all relevant app data and archives the media folder for FLAVO project.'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("= НАЧАЛО ПРОЦЕССА СОЗДАНИЯ 'СНИМКА' FLAVO САЙТА ="))

        DUMP_PATH = settings.BASE_DIR / 'seed_data' / 'dump'
        os.makedirs(DUMP_PATH, exist_ok=True)

        MODELS_TO_DUMP = [
            'users.CustomUser',
            'products.Category',
            'products.Tag',
            'products.Collection',
            'products.Product',
            'orders.PromoCode',
            'orders.Order', 
            'orders.OrderItem', 
            'recipes.RecipeCategory',
            'recipes.RecipeTag',
            'recipes.Recipe',
            'core.FAQ',
        ]
        
        self.stdout.write("--> Шаг 1: Создание JSON-фикстур...")
        for model_name in MODELS_TO_DUMP:
            app_label, model_file_name = model_name.split('.')
            output_file = DUMP_PATH / f"{model_file_name.lower()}.json"
            
            self.stdout.write(f"    - Выгрузка {model_name} в {output_file}...")
            
            try:
                command = [
                    'python', 'manage.py', 'dumpdata', model_name,
                    '--indent=2',
                    '--natural-foreign', 
                    '--natural-primary', 
                    f'--output={output_file}'
                ]
                if 'dumpdata' in command: # Проверяем, что это команда dumpdata
                    command.append('--skip-checks') 
                
                subprocess.run(command, check=True, capture_output=True, text=True)
                self.stdout.write(self.style.SUCCESS(f"    Успешно выгружено: {model_name}"))
            except subprocess.CalledProcessError as e:
                self.stdout.write(self.style.ERROR(f"Ошибка при выгрузке {model_name}: {e.stderr}"))
                return

        self.stdout.write(self.style.SUCCESS("--> Шаг 1 завершен: Все JSON-фикстуры созданы."))

        self.stdout.write("--> Шаг 2: Архивирование папки media...")
        
        media_root_path = Path(settings.MEDIA_ROOT)
        archive_name = DUMP_PATH / 'media_dump'
        
        os.makedirs(media_root_path, exist_ok=True)

        if os.listdir(media_root_path):
            try:
                shutil.make_archive(str(archive_name), 'gztar', root_dir=str(media_root_path.parent), base_dir=media_root_path.name)
                self.stdout.write(self.style.SUCCESS(f"    Папка media успешно заархивирована в {archive_name}.tar.gz"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"    Ошибка при архивировании media: {e}"))
        else:
            self.stdout.write(self.style.WARNING("    Папка media пуста или не существует. Архив не создан."))

        self.stdout.write("--> Шаг 3: Очистка кэша...")
        cache.clear()
        self.stdout.write(self.style.SUCCESS("    Кэш успешно очищен."))

        self.stdout.write(self.style.SUCCESS("= 'СНИМОК' FLAVO САЙТА УСПЕШНО СОЗДАН! ="))
        self.stdout.write(self.style.NOTICE("ВАЖНО: Не забудьте закоммитить изменения в папке 'seed_data/dump/'!"))