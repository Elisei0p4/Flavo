#!/bin/sh

set -e

echo "Entrypoint script is running..."
echo "Waiting for other services is handled by docker-compose depends_on."
echo "Migrations and collectstatic are handled by a separate service."
echo "Starting main command..."

exec "$@"