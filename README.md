# FLAVO - Мир изысканных вкусов

## О проекте
FLAVO — это полнофункциональное веб-приложение для заказа уникальных блюд и специй, разработанное с использованием современных технологий бэкенда и фронтенда. Проект демонстрирует принципы модульной архитектуры, масштабируемости и эффективного взаимодействия компонентов.

### Стек технологий

**Бэкенд:**
*   **Django 5.2 & Django REST Framework (DRF):** Мощный и гибкий фреймворк для быстрой разработки API.
*   **PostgreSQL:** Надежная реляционная база данных.
*   **Celery, Redis, RabbitMQ:** Для асинхронных задач и фоновой обработки (отправка email, обновление статусов заказов).
*   **Django Channels:** Для работы с WebSockets (отслеживание статусов заказов в реальном времени).
*   **JWT (Simple JWT):** Безопасная аутентификация на основе токенов.
*   **DRF Spectacular:** Автоматическая генерация интерактивной документации API (Swagger/Redoc).
*   **Stripe API:** Интеграция с платежной системой для обработки заказов.
*   **Django Prometheus:** Для сбора метрик и мониторинга состояния бэкенда.
*   **Pre-commit hooks:** Black, Ruff, MyPy для поддержания качества кода и статического анализа.
*   **Pytest:** Для юнит- и интеграционных тестов бэкенда с покрытием 80%+.

**Фронтенд:**
*   **React 19 & Vite & TypeScript:** Современный стек для быстрой и надежной разработки пользовательского интерфейса.
*   **Zustand:** Легковесный и мощный стейт-менеджер для React.
*   **React Query (TanStack Query):** Для управления серверным состоянием, кеширования и синхронизации данных.
*   **Tailwind CSS:** Утилитарный CSS-фреймворк для гибкой стилизации.
*   **Framer Motion:** Для сложных и плавных анимаций UI.
*   **ESLint, Jest, Playwright:** Для линтинга, юнит-тестов и E2E тестов фронтенда.

**Инфраструктура:**
*   **Docker & Docker Compose:** Контейнеризация всех сервисов. Разделение dev/prod окружений.
*   **Nginx:** Прокси-сервер для балансировки нагрузки и раздачи статики/медиа.
*   **GitHub Actions:** CI/CD пайплайн для автоматического тестирования и сборки Docker-образов.

## Как запустить проект (Development)

Для локальной разработки используйте `docker-compose.yml`.

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/your-username/pizza-project.git
    cd pizza-project
    ```

2.  **Настройте переменные окружения:**
    Создайте файл `.env` в корне проекта на основе `.env.example`.
    ```bash
    copy .env.example .env
    ```
    Отредактируйте `.env`, заменив заполнители на свои значения. Особое внимание уделите `SECRET_KEY` и Stripe ключам.

3.  **Запустите Docker Compose:**
    ```bash
    docker-compose up --build -d
    ```
    Это соберет и запустит все необходимые сервисы. Скрипт `entrypoint.sh` автоматически применит миграции и соберет статику.

4.  **Создайте суперпользователя (при необходимости):**
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```

5.  **Доступ к приложениям:**
    *   **Фронтенд:** `http://localhost:5173` (прямой доступ к Vite dev server)
    *   **Проект через Nginx:** `http://localhost:8080`
    *   **Бэкенд API:** `http://localhost:8080/api/v1/`
    *   **Django Admin:** `http://localhost:8080/admin/`
    *   **Swagger API Docs:** `http://localhost:8080/api/v1/schema/swagger-ui/`
    *   **RabbitMQ Management:** `http://localhost:15672` (учетные данные из `.env`)

## Как запустить проект (Production)

Для продакшен окружения используйте `docker-compose.prod.yml`.

1.  **Создайте файл `.env.prod`** на основе `.env.prod.example`.
    ```bash
    copy .env.prod.example .env.prod
    ```
    **ОЧЕНЬ ВАЖНО:** Замените все значения-заполнители на **реальные, надежные и уникальные**. `SECRET_KEY` можно сгенерировать командой:
    ```bash
    python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
    ```

2.  **Запустите Docker Compose для продакшена:**
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    ```
    Сервис `backend-migrate` автоматически выполнит миграции и соберет статику.

3.  **Настройте Nginx для SSL (Certbot):**
    В `nginx.prod.conf` закомментированы строки, связанные с SSL. Вам нужно будет настроить Certbot для получения сертификатов.

## Тестирование

### Бэкенд тесты (Pytest)
Запустите тесты из корня проекта:
```bash
docker-compose exec backend pytest