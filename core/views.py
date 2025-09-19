from django.http import JsonResponse, HttpResponse
from django.db import connections
from django_redis import get_redis_connection
from celery import current_app

def health_check(request):
    """
    Расширенный healthcheck: проверяет Django, БД, Redis и Celery broker.
    Возвращает 200, если все компоненты в норме, иначе 503.
    """
    # DB
    try:
        with connections['default'].cursor() as cursor:
            cursor.execute('SELECT 1')
            db_ok = True
    except Exception:
        db_ok = False

    # Redis
    try:
        conn = get_redis_connection('default')
        conn.ping()
        redis_ok = True
    except Exception:
        redis_ok = False

    # Celery broker
    try:
        inspect = current_app.control.inspect()
        stats = inspect.stats()
        celery_ok = stats is not None
    except Exception:
        celery_ok = False

    status = 200 if (db_ok and redis_ok and celery_ok) else 503
    payload = {
        'app': True,
        'db': db_ok,
        'redis': redis_ok,
        'celery': celery_ok,
        'status': 'ok' if status == 200 else 'degraded'
    }
    return JsonResponse(payload, status=status)