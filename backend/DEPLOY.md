# Инструкция по деплою

## Требования

- Node.js 18+
- PostgreSQL 13+
- PM2 (глобально установленный: `npm install -g pm2`)

## Шаги для деплоя

1. Клонировать репозиторий
   ```bash
   git clone https://github.com/your-username/flower-shop-api.git
   cd flower-shop-api
   ```

2. Создать файл .env на основе .env.example
   ```bash
   cp .env.example .env
   # Отредактировать файл .env с нужными значениями
   ```

3. Установить зависимости и инициализировать базу данных
   ```bash
   npm run build
   ```

4. Запустить сервер через PM2
   ```bash
   npm run pm2:prod
   ```

5. Проверить статус сервера
   ```bash
   npm run pm2:status
   ```

## Команды для управления сервером

- Мониторинг: `npm run pm2:monit`
- Просмотр логов: `npm run pm2:logs`
- Перезапуск: `npm run pm2:restart`
- Остановка: `npm run pm2:stop`
- Удаление из PM2: `npm run pm2:delete`

## Директория с логами

Логи приложения находятся в директории `logs/`:
- Файлы логов приложения: формат `YYYY-MM-DD_HHh.log` (обновляются каждые 3 часа)
- Логи PM2: `pm2-out.log` и `pm2-error.log` 