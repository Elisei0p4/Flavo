.PHONY: help up-dev up-prod down migrate test-backend test-frontend test-e2e clean logs shell-backend shell-frontend

# Показать справку
help:
	@echo "Доступные команды:"
	@echo "  up-dev        - Запустить проект в режиме разработки"
	@echo "  up-prod       - Запустить проект в продакшене"
	@echo "  down          - Остановить все контейнеры"
	@echo "  migrate       - Выполнить миграции базы данных"
	@echo "  test-backend  - Запустить тесты бэкенда"
	@echo "  test-frontend - Запустить тесты фронтенда"
	@echo "  test-e2e      - Запустить E2E тесты"
	@echo "  clean         - Очистить контейнеры и образы"
	@echo "  logs          - Показать логи всех сервисов"
	@echo "  shell-backend - Подключиться к контейнеру бэкенда"
	@echo "  shell-frontend- Подключиться к контейнеру фронтенда"

# Запуск в режиме разработки
up-dev:
	docker-compose -f docker-compose.yml up --build -d

# Запуск в продакшене
up-prod:
	docker-compose -f docker-compose.prod.yml up --build -d

# Остановка всех контейнеров
down:
	docker-compose down

# Выполнение миграций
migrate:
	docker-compose exec backend python manage.py migrate

# Создание миграций
makemigrations:
	docker-compose exec backend python manage.py makemigrations

# Проверка миграций (для CI)
check-migrations:
	docker-compose exec backend python manage.py makemigrations --check --dry-run

# Тесты бэкенда
test-backend:
	docker-compose exec backend pytest

# Тесты фронтенда
test-frontend:
	docker-compose exec frontend npm test

# E2E тесты
test-e2e:
	docker-compose exec frontend npm run test:e2e

# Очистка контейнеров и образов
clean:
	docker-compose down --volumes --remove-orphans
	docker system prune -f

# Просмотр логов
logs:
	docker-compose logs -f

# Логи конкретного сервиса
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

# Подключение к контейнеру бэкенда
shell-backend:
	docker-compose exec backend bash

# Подключение к контейнеру фронтенда
shell-frontend:
	docker-compose exec frontend sh

# Сборка статических файлов
collectstatic:
	docker-compose exec backend python manage.py collectstatic --noinput

# Создание суперпользователя
createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

# Запуск Celery worker
celery-worker:
	docker-compose exec backend celery -A pizza_project worker -l info

# Запуск Celery beat
celery-beat:
	docker-compose exec backend celery -A pizza_project beat -l info

# Проверка состояния сервисов
status:
	docker-compose ps
