const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const pino = require('pino');
const rateLimiter = require('./middleware/rateLimiter');
const { swaggerUi, specs } = require('./config/swagger');
require('dotenv').config();

// Логгер
const logger = pino({ name: "server start" });

// Импорт маршрутов
const indexRoutes = require('./routes/index');

// Инициализация приложения
const app = express();
const PORT = process.env.PORT || 3000;

// Настройка доверия к прокси
app.set("trust proxy", true);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Используем значение из .env или разрешаем все
  credentials: true // Разрешить отправку cookies
}));
app.use(express.json()); // Парсинг JSON-запросов
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded запросов
app.use(cookieParser()); // Парсинг cookies
app.use(helmet()); // Безопасность заголовков
app.use(rateLimiter); // Ограничение скорости запросов

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Маршруты
app.use('/api', indexRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ 
    message: 'Что-то пошло не так!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Запуск сервера
app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
  logger.info(`Документация Swagger доступна по адресу: http://localhost:${PORT}/api-docs`);
}); 