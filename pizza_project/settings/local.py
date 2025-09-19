from .base import INSTALLED_APPS as BASE_INSTALLED_APPS
from .base import MIDDLEWARE as BASE_MIDDLEWARE
from .base import *

DEBUG = True
SECRET_KEY = env('SECRET_KEY', default='django-insecure-local-dev-key-replace-me')

INSTALLED_APPS = BASE_INSTALLED_APPS + [
    'debug_toolbar',
]

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
] + BASE_MIDDLEWARE

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

INTERNAL_IPS = [
    "127.0.0.1",
]