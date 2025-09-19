import os
from celery import Celery
from pizza_project.telemetry import setup_telemetry

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pizza_project.settings.production')

setup_telemetry()

app = Celery('pizza_project')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()