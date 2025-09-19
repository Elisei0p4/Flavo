import os

from django.core.wsgi import get_wsgi_application
from pizza_project.telemetry import setup_telemetry


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pizza_project.settings.local')


setup_telemetry()

application = get_wsgi_application()