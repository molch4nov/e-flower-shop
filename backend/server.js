require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const logger = require('./config/logger')('server');
const routes = require('./routes');
const { swaggerUi, specs } = require('./config/swagger');
const cookieParser = require('cookie-parser');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка доверия к прокси
app.set("trust proxy", true);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Отключаем CSP для простоты разработки
})); // Безопасность
app.use(cors({
  origin: true, // Allow requests from any origin in development
  credentials: true, // Разрешить отправку cookies
  exposedHeaders: ['Set-Cookie'], // Expose Set-Cookie header
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json()); // Парсинг JSON
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded данных
app.use(cookieParser()); // Парсинг cookies
// app.use(rateLimiter); // Ограничение скорости запросов

// Логирование запросов
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  }, 'Incoming request');
  
  // Логирование времени ответа
  const startTime = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`
    }, 'Request completed');
  });
  
  next();
});

// API документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// API маршруты
app.use('/api', routes);

// Статические файлы для фронтенда
app.use(express.static(path.join(__dirname, '../frontend')));

// Маршрут для обслуживания React/SPA приложения
app.get('*', (req, res, next) => {
  // Если запрос к API или админке, передаем управление следующему обработчику
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs') || req.path.startsWith('/admin')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  logger.error({
    err: {
      message: err.message,
      stack: err.stack
    },
    req: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    }
  }, 'Error occurred');
  
  res.status(500).json({
    error: 'Ошибка сервера',
    message: process.env.NODE_ENV === 'production' ? 'Произошла ошибка' : err.message
  });
});

// Запуск сервера только если файл запущен напрямую, а не через импорт
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Сервер запущен на порту ${PORT}`);
    logger.info(`Документация Swagger доступна по адресу: http://localhost:${PORT}/api-docs`);
    logger.info(`Фронтенд доступен по адресу: http://localhost:${PORT}`);
  });
}

// Обработка необработанных исключений и отклонений промисов
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason }, 'Unhandled rejection');
  process.exit(1);
});

module.exports = app; 