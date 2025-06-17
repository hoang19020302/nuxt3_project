#!/bin/sh

set -e
echo "🚀 Nuxt starting..."

if [ -f /tmp_env/env_config.js ]; then
  cp /tmp_env/env_config.js /usr/share/nginx/html/env_config.js
  echo "✅ Đã copy env_config.js thành công"
else
  echo "❌ /tmp_env/env_config.js không phải là file hoặc không tồn tại"
fi

echo "🚀 Khởi động Nuxt App..."
exec nginx -g 'daemon off;'

