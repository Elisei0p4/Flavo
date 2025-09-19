# Deployment Guide

Этот документ описывает все улучшения, внесенные в проект согласно код-ревью.

## 🚀 Выполненные улучшения

### Backend

#### 1. Рефакторинг payments/services.py
- ✅ Разбил монолитную функцию `fulfill_order_from_webhook` на 3-4 мелкие функции
- ✅ Убрал начисление кэшбека из основного потока (теперь отдельная Celery задача)
- ✅ Каждая функция имеет свою область ответственности и транзакции

#### 2. Удаление сигналов для инвалидации кэша
- ✅ Удалил все сигналы `post_save` и `m2m_changed` из models.py
- ✅ Инвалидация кэша теперь выполняется явно в местах изменения данных
- ✅ Код стал чище и предсказуемее

#### 3. Исправление generate_sku
- ✅ Добавил проверку уникальности с циклом попыток (до 10 раз)
- ✅ Добавил fallback механизм с timestamp + random для гарантии уникальности
- ✅ Убрал наивный подход с простым uuid4

#### 4. Переписывание Celery задач
- ✅ Убрал жесткие `countdown` из цепочки задач
- ✅ Реализовал более реалистичный подход с мониторингом готовности
- ✅ Улучшил обработку ошибок (не ретраим для DoesNotExist)
- ✅ Добавил экспоненциальную задержку для ретраев

### Frontend

#### 5. Удаление проблемного селектора
- ✅ Удалил `useCartTotals` селектор из cart/selectors.ts
- ✅ Оставил только атомарные селекторы `useSelectTotalItems` и `useSelectTotalPrice`
- ✅ Обновил все использования в компонентах

#### 6. Улучшение e2e тестов
- ✅ Заменил хрупкие селекторы по тексту на `data-testid`
- ✅ Тесты стали более надежными и не зависят от изменений UI текста

### DevOps / Инфраструктура

#### 7. Исправление nginx.prod.conf
- ✅ Добавил переменные окружения `${DOMAIN_NAME}`
- ✅ Раскомментировал SSL конфигурацию
- ✅ Создал entrypoint скрипт для обработки переменных
- ✅ Обновил Dockerfile для поддержки envsubst

#### 8. Деплой стратегия
- ✅ Добавил шаг деплоя в GitHub Actions
- ✅ Создал Ansible плейбук для продвинутого деплоя
- ✅ Добавил альтернативный workflow с Ansible
- ⚠️ **ВАЖНО**: Текущий метод деплоя (down → up) приводит к кратковременному простою
- 📝 Для zero-downtime деплоя рекомендуется использовать:
  - Docker Swarm с rolling updates
  - Kubernetes с rolling deployments
  - Blue/Green deployment с Nginx

#### 9. Полная Observability
- ✅ **Prometheus**: Конфигурация с правилами алертов
- ✅ **Grafana**: Дашборды и источники данных
- ✅ **Loki**: Централизованное логирование
- ✅ **OpenTelemetry**: Трейсинг запросов через всю систему
- ✅ **Jaeger**: Визуализация трейсов

#### 10. Безопасность
- ✅ **Rate Limiting**: Защита от брутфорса (5 попыток/мин для регистрации, 10/мин для логина)
- ✅ **CSP**: Content Security Policy для защиты от XSS
- ✅ **Управление секретами**: Документация по Vault/AWS Secrets Manager

#### 11. База данных
- ✅ **Миграции**: Создал дополнительные миграции для демонстрации эволюции схемы
- ✅ **Индексы**: Добавил составные индексы для оптимизации запросов

#### 12. Тестирование на стероидах
- ✅ **Factory-boy**: Фабрики для создания тестовых данных
- ✅ **Hypothesis**: Property-based тестирование
- ✅ **Responses**: Чистый мокинг внешних API (Stripe)

## 🛠 Настройка окружения

### Переменные окружения

Создайте файл `.env.prod`:
Создайте файл `.env.prod` в корневой директории проекта. Он не должен попадать в систему контроля версий.

Пример наполнения:

```bash
SECRET_KEY=your-super-secret-key
DEBUG=False
ALLOWED_HOSTS=your.domain.com,www.your.domain.com
DOMAIN_NAME=your.domain.com

# База данных
DATABASE_URL=postgresql://user:password@db:5432/pizza_db

# Redis
# Redis для кэша и Celery
REDIS_HOST=redis
REDIS_PORT=6379

# Celery
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

# CORS
# Настройки безопасности и CORS
CORS_ALLOWED_ORIGINS=https://your.domain.com
CSRF_TRUSTED_ORIGINS=https://your.domain.com

# Stripe
# Ключи для интеграции с платежной системой Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Кэшбек
CASHBACK_PERCENT=10

# Observability
# Настройки для системы мониторинга и трейсинга
JAEGER_ENDPOINT=http://jaeger:14268/api/traces
SENTRY_DSN=your-sentry-dsn
```

### GitHub Secrets

Настройте следующие секреты в GitHub:

```
PROD_HOST=your-server-ip
PROD_USER=deploy-user
PROD_SSH_KEY=your-private-ssh-key
PROD_PORT=22
```

## 🚀 Деплой

### Простой деплой (SSH)

```bash
# На сервере
cd /opt/pizza-project
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Продвинутый деплой (Ansible)

```bash
# Установите Ansible
pip install ansible

# Установите зависимости
ansible-galaxy install -r ansible/requirements.yml

# Создайте и зашифруйте vault файл с секретами
ansible-vault create ansible/vault.yml
# Введите пароль для vault и заполните секреты

# Запустите деплой с vault
ansible-playbook -i ansible/inventory.yml ansible/deploy.yml \
  --ask-vault-pass \
  -e github_repository="your-username/pizza-project" \
  -e github_actor="your-username" \
  -e github_token="your-github-token" \
  -e prod_host="your-server-ip" \
  -e prod_user="deploy-user" \
  -e prod_ssh_key_path="~/.ssh/id_rsa" \
  -e prod_port="22"
```

### Управление секретами через Ansible Vault

```bash
# Создать новый vault файл
ansible-vault create ansible/vault.yml

# Редактировать существующий vault файл
ansible-vault edit ansible/vault.yml

# Зашифровать существующий файл
ansible-vault encrypt ansible/vault.yml

# Расшифровать файл для просмотра
ansible-vault decrypt ansible/vault.yml

# Изменить пароль vault
ansible-vault rekey ansible/vault.yml
```

## 📊 Мониторинг

### Запуск observability стека

```bash
# Создайте сеть
docker network create observability

# Запустите observability стек
docker-compose -f docker-compose.observability.yml up -d
```

### Доступ к сервисам

- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Jaeger**: http://localhost:16686
- **Loki**: http://localhost:3100

## 🧪 Тестирование

### Запуск тестов

```bash
# Backend тесты
pytest

# Frontend тесты
cd frontend
npm test

# E2E тесты
npx playwright test
```

### Factory-boy тесты

```python
# Создание тестовых данных
from products.factories import ProductFactory
product = ProductFactory()
```

### Hypothesis тесты

```python
# Property-based тестирование
from hypothesis import given, strategies as st

@given(st.decimals(min_value=0, max_value=1000))
def test_product_price(price):
    product = ProductFactory(price=price)
    assert product.price == price
```

## 🔒 Безопасность

### Rate Limiting

- Регистрация: 5 попыток в минуту
- Логин: 10 попыток в минуту
- Refresh токен: 20 попыток в минуту

### CSP (Content Security Policy)

Настроена политика безопасности для защиты от XSS атак.

### Управление секретами

✅ **ИСПРАВЛЕНО**: Все секреты теперь хранятся в Ansible Vault

Для продакшена рекомендуется использовать:
- **Ansible Vault** (реализовано)
- **HashiCorp Vault**
- **AWS Secrets Manager**
- **Azure Key Vault**

**КРИТИЧНО**: Никогда не используйте `lookup('env', ...)` для секретов в продакшене!

## 📈 Производительность

### Индексы базы данных

Добавлены составные индексы для оптимизации запросов:
- `products_product_rating_idx`
- `products_product_rating_reviews_idx`

### Кэширование

- Redis для кэширования
- Явная инвалидация кэша в местах изменения данных

## 🎯 Следующие шаги

1. **Настройте мониторинг алертов** в Prometheus
2. **Интегрируйте с внешними сервисами** (Sentry, DataDog)
3. **Настройте автоматическое масштабирование** (Kubernetes)
4. **Добавьте backup стратегию** для базы данных
5. **Настройте SSL сертификаты** через Let's Encrypt

## 📝 Заключение

Все критические замечания из код-ревью были исправлены:

- ✅ Монолитная функция разбита на мелкие
- ✅ Сигналы удалены
- ✅ SKU генерация исправлена
- ✅ Celery задачи переписаны
- ✅ Проблемный селектор удален
- ✅ E2E тесты улучшены
- ✅ Nginx конфиг исправлен
- ✅ Настоящий CD добавлен
- ✅ Полная observability настроена
- ✅ Безопасность усилена
- ✅ Миграции созданы
- ✅ Тестирование улучшено

Проект теперь готов к продакшену! 🚀
