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

// Импортируем маршруты
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const categoryRoutes = require('./routes/category');
const subcategoryRoutes = require('./routes/subcategory');
const productRoutes = require('./routes/product');
const flowerRoutes = require('./routes/flower');
const fileRoutes = require('./routes/file');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка доверия к прокси
app.set("trust proxy", true);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Отключаем CSP для простоты разработки
  crossOriginResourcePolicy: false, // Разрешаем загрузку ресурсов с других источников
  crossOriginEmbedderPolicy: false // Разрешаем встраивание ресурсов
})); // Безопасность
app.use(cors({
  origin: function(origin, callback) {
    // Разрешаем запросы без origin (например, мобильные приложения)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173', 'http://localhost:5174'];
    
    // Проверяем, разрешен ли источник
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Не разрешено CORS'));
    }
  },
  credentials: true, // Разрешить отправку cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
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

// Регистрируем маршруты
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/flowers', flowerRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

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