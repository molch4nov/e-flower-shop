#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Запуск проекта e-flower-shop в Docker${NC}"

# Переходим в директорию проекта
cd "$(dirname "$0")/.." || exit

# Проверяем наличие Docker и Docker Compose
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker не установлен. Пожалуйста, установите Docker и повторите попытку.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose не установлен. Пожалуйста, установите Docker Compose и повторите попытку.${NC}"
    exit 1
fi

echo -e "${GREEN}Остановка предыдущих контейнеров (если есть)...${NC}"
docker-compose down

echo -e "${GREEN}Сборка и запуск Docker контейнеров...${NC}"
docker-compose up -d --build

echo -e "${GREEN}Проверка статуса контейнеров...${NC}"
docker-compose ps

echo -e "${GREEN}Запуск успешно завершен!${NC}"
echo -e "${GREEN}Бэкенд доступен по адресу: http://localhost:3000${NC}"
echo -e "${GREEN}Документация API: http://localhost:3000/api-docs${NC}"
echo -e "${GREEN}Просмотр логов: docker-compose logs -f${NC}"

# Выводим информацию о подключении к PostgreSQL
echo -e "${YELLOW}Информация о PostgreSQL:${NC}"
echo -e "  Host: localhost"
echo -e "  Port: 5432"
echo -e "  Database: flower_shop"
echo -e "  User: postgres"
echo -e "  Password: postgres" 