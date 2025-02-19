# Stage 1: Сборка React-приложения
FROM node:16-alpine as builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код и собираем приложение
COPY . .
RUN npm run build

# Stage 2: Раздача через Nginx
FROM nginx:stable-alpine

# Копируем собранное приложение в директорию, откуда Nginx раздаёт статику
COPY --from=builder /app/build /usr/share/nginx/html

# Копируем наш кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
