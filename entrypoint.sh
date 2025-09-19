#!/bin/sh

set -e

echo "Waiting for PostgreSQL..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

case "$*" in
  *makemigrations*|*createsuperuser*|*shell*)
    echo "Executing management command directly: $*"
    exec "$@"
    ;;
esac


echo "Applying migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Executing main command: $*"
exec "$@"