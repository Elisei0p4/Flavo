#!/bin/sh

set -e

echo "Celery Worker: Waiting for PostgreSQL..."
while ! pg_isready -h $POSTGRES_HOST -U $POSTGRES_USER -p $POSTGRES_PORT -q; do
  sleep 2
done
echo "Celery Worker: PostgreSQL started"

echo "Celery Worker: Waiting for RabbitMQ..."
while ! nc -z ${RABBITMQ_HOST:-rabbitmq} ${RABBITMQ_PORT:-5672}; do
  sleep 2
done
echo "Celery Worker: RabbitMQ is up. Starting worker."

exec "$@"