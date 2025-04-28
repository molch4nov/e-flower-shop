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
app.set("trust proxy", 1);

// // Получаем разрешенные источники из переменных окружения
// const allowedOrigins = process.env.CORS_ORIGIN 
//   ? process.env.CORS_ORIGIN.split(',') 
//   : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173'];

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173', 'http://localhost:5174']

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Разрешаем запросы без origin (например, мобильные приложения)
    if (!origin) return callback(null, true);
    
    // Проверяем, разрешен ли источник
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Не разрешено CORS'));
    }
  },
  credentials: true, // Разрешить отправку cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json()); // Парсинг JSON-запросов
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded запросов
app.use(cookieParser()); // Парсинг cookies
app.use(helmet({
  crossOriginResourcePolicy: false // Разрешаем загрузку ресурсов с других источников
})); 
app.use(rateLimiter); // Ограничение скорости запросов

// Периодическая очистка истекших сессий
const User = require('./models/user');
setInterval(async () => {
  try {
    const deletedCount = await User.cleanExpiredSessions();
    if (deletedCount > 0) {
      logger.info(`Очищено ${deletedCount} истекших сессий`);
    }
  } catch (error) {
    logger.error(error, 'Ошибка при очистке истекших сессий');
  }
}, 60 * 60 * 1000); // Запуск каждый час

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Маршруты
app.use('/', indexRoutes);

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