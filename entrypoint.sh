#!/bin/sh

set -e
echo "🚀 Nuxt starting..."

mkdir -p /tmp
cp /tmp/env_config.js /usr/share/nginx/html/env_config.js

echo "🚀 Khởi động Nuxt App..."
exec nginx -g 'daemon off;'
