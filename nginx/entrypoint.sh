#!/bin/sh

# Заменяем переменные окружения в nginx конфиге
envsubst '${DOMAIN_NAME}' < /etc/nginx/conf.d/nginx.prod.conf > /etc/nginx/conf.d/nginx.prod.conf.tmp
mv /etc/nginx/conf.d/nginx.prod.conf.tmp /etc/nginx/conf.d/nginx.prod.conf

# Запускаем nginx
exec nginx -g 'daemon off;'
