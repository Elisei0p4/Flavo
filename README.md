## О проекте
FLAVO — это полнофункциональное веб-приложение для заказа уникальных блюд и специй, разработанное с использованием современных технологий бэкенда и фронтенда. Проект демонстрирует принципы модульной архитектуры, масштабируемости и эффективного взаимодействия компонентов.

---

## 📸 Галерея проекта FLAVO

Представляем вашему вниманию скриншоты основных экранов и функционала приложения:

<p align="center">
  <img src="https://sun9-49.userapi.com/s/v1/if2/f9-b9PPambBcF3_gwj-zF3gtCZziqmEI3QicD6shcZNhSHDhSgU4ud_7KU3U6k77BZux6QnQLc-y75CTtRVuXyvQ.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,1920x1080&from=bu&cs=1920x0" alt="Главная страница FLAVO" width="700"/>
  <br>
  <em>Главная страница: витрина изысканных блюд и спецпредложений.</em>
</p>

<p align="center">
  <img src="[docs/screenshots/screenshot_2_menu_page.png](https://sun9-82.userapi.com/s/v1/if2/_jM2m0Kibb308Ho7Sxb1y6t-PI992XNt-HDan7tWrePCyRYsLSn1619lM9EbiGBRJwSy-blzEzUlemyzaa1ING8t.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,1920x1080&from=bu&cs=1920x0)" alt="Блок "почему мы?" width="700"/>
  <br>
  <em>Блок "Почему выбирают нас?": Интригующие вопросы, почему Вам следуюет пользоваться нашим проектом.</em>
</p>

<p align="center">
  <img src="[docs/screenshots/screenshot_3_product_detail.png](https://sun9-1.userapi.com/s/v1/if2/7Zf3IxPmma4196Nfu4-TadX8aVYf_WTUxcjHp96KrInqNr0s7tQodWwEiuh-mPe1oKxreLXNX1eVWl07gS5cLNEx.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,1920x1080&from=bu&cs=1920x0)" alt="Ответы на вопросы" width="700"/>
  <br>
  <em>Часто задаваемые вопросы для нас</em>
</p>

<p align="center">
  <img src="[docs/screenshots/screenshot_4_cart_checkout.png](https://sun9-2.userapi.com/s/v1/if2/dZ6G5go81rpi451fKzKSf4fful5oLaRlJlohddmoDgi8COScS4vivkw2Pdg2gqWCgIGAyxggl0UKan9F5BKfkLvD.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,1920x1080&from=bu&cs=1920x0)" alt="Корзина и оформление заказа FLAVO" width="700"/>
  <br>
  <em>Корзина и оформление заказа: удобный процесс покупки с применением промокодов.</em>
</p>

<p align="center">
  <img src="[docs/screenshots/screenshot_5_recipes.png](https://sun9-33.userapi.com/s/v1/if2/k0aTfo-TKHtt9RbGcTs_iTAjoEvhi8ieAsei3A1P5MirAa5iJaE0G-7jDEqOw5lYzNOavdN9zCiyYpwSoa4Bb3YR.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,1920x1080&from=bu&cs=1920x0)" alt="Страница "модерации"" width="700"/>
  <br>
  <em>Страница для модерации.</em>
</p>

---

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

4.  **Загрузить весь контент:**
    ```bash
    docker-compose exec backend python manage.py seed_db
    ```

5.  **Создайте суперпользователя (при необходимости):**
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```

6.  **Доступ к приложениям:**
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
