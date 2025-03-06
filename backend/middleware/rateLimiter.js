const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // ограничение каждого IP до 100 запросов за windowMs
  standardHeaders: true, // Возвращает стандартные заголовки ограничения скорости
  legacyHeaders: false, // Отключает заголовки `X-RateLimit-*`
  message: 'Слишком много запросов с этого IP, пожалуйста, повторите попытку через 15 минут'
});

module.exports = rateLimiter; 