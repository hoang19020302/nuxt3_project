#!/bin/sh

set -e
echo "🚀 Nuxt starting..."

# Nếu là file mới copy thành công
if [ -f "/env_data/env_config.js" ]; then
    cp /env_data/env_config.js /usr/share/nginx/html/env_config.js
else
    echo "❌ Không tìm thấy /env_data/env_config.js hoặc không phải là file."
fi

echo "🚀 Khởi động Nuxt App..."
exec nginx -g 'daemon off;'
