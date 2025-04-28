FROM node:18-alpine

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Копирование исходного кода
COPY . .

# Открытие порта
EXPOSE 3000

# Запуск сервера
CMD ["npm", "run","start"] 