#!/bin/sh

set -e
echo "🚀 Nuxt starting..."

# Nếu là file mới copy thành công
if [ -f "/tmp/env_config.js" ]; then
    cp /tmp/env_config.js /usr/share/nginx/html/env_config.js
else
    echo "❌ Không tìm thấy /tmp/env_config.js hoặc không phải là file."
fi

echo "🚀 Khởi động Nuxt App..."
exec nginx -g 'daemon off;'
