# Stage 1: Build application
FROM node:20-alpine AS build

# Cài git nếu bạn clone submodule hoặc install private repo
RUN apk add --no-cache git

WORKDIR /app

# Copy package và cài đặt dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ source
COPY . .

# Build SSR app
RUN npm run build

# Stage 2: Run with Nitro server (no nginx)
FROM node:20-alpine AS runner

WORKDIR /app

# Copy output từ bước build
COPY --from=build /app/.output .output

# Port Nuxt SSR mặc định là 3000
EXPOSE 3000

# Khởi chạy ứng dụng Nuxt SSR
CMD ["node", ".output/server/index.mjs"]
