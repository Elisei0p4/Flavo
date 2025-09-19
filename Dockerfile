FROM python:3.11-slim as builder

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app


RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \ 
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.lock /app/

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.lock

COPY . /app

RUN python manage.py collectstatic --noinput


FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y libpq-dev curl gettext-base && rm -rf /var/lib/apt/lists/*

RUN addgroup --system app && adduser --system --group app

WORKDIR /app

COPY --from=builder --chown=app:app /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

COPY --from=builder --chown=app:app /app /app

COPY --chown=app:app ./entrypoint.prod.sh /app/entrypoint.prod.sh
COPY --chown=app:app ./entrypoint-celery.sh /app/entrypoint-celery.sh
RUN chmod +x /app/entrypoint.prod.sh
RUN chmod +x /app/entrypoint-celery.sh

USER app

EXPOSE 8000

CMD ["/app/entrypoint.prod.sh", "gunicorn", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "pizza_project.asgi:application"]
