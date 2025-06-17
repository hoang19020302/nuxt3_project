#!/bin/sh

set -e

# Copy env_config.js nếu chưa có hoặc luôn override
if [ ! -f "env_config.js" ]; then
    echo "📦 Không tìm thấy file env_config.js. Đang sao chép từ tmp..."
    cp /tmp/env_config.js /usr/share/nginx/html/env_config.js
fi

exec nginx -g 'daemon off;'
