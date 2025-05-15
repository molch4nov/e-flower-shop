const User = require('../models/user');
const logger = require('../config/logger')('auth-middleware');

// Middleware для проверки аутентификации
const authenticateUser = async (req, res, next) => {
  try {
    // Получаем sessionId из куки
    const sessionId = req.cookies.sessionId;
    
    if (!sessionId) {
      logger.info('Попытка доступа без sessionId');
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    // Получаем сессию из базы данных
    const session = await User.getSessionById(sessionId);
    
    if (session?.id.length < 1 || !session.user_id) {
      logger.info(`Сессия не найдена или истекла для sessionId: ${sessionId}`);
      // Удаляем куки, если сессия не найдена или истекла
      res.clearCookie('sessionId', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      return res.status(401).json({ error: 'Сессия истекла. Пожалуйста, войдите снова.' });
    }
    
    // Добавляем данные пользователя к запросу
    req.user = {
      id: session.user_id,
      name: session.name,
      phone_number: session.phone_number,
      birth_date: session.birth_date,
      role: session.role
    };
    
    logger.info(`Успешная аутентификация пользователя: ${session.user_id}`);
    
    // Продолжаем обработку запроса
    next();
  } catch (error) {
    logger.error(error, 'Ошибка при аутентификации');
    res.status(500).json({ error: 'Ошибка при аутентификации' });
  }
};

// Middleware для проверки роли администратора
const isAdmin = async (req, res, next) => {
  try {
    // Проверяем, прошел ли пользователь аутентификацию
    if (!req.user) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    // Проверяем роль пользователя
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }
    
    // Продолжаем обработку запроса
    next();
  } catch (error) {
    console.error('Ошибка при проверке прав доступа:', error);
    res.status(500).json({ error: 'Ошибка при проверке прав доступа' });
  }
};

// Middleware для опциональной аутентификации
const optionalAuthUser = async (req, res, next) => {
  try {
    // Получаем ID сессии из куки или заголовка Authorization
    let sessionId = req.cookies.sessionId;
    
    // Если sessionId нет в cookies, проверяем заголовок Authorization
    if (!sessionId && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      // Формат заголовка "Bearer <sessionId>"
      if (authHeader.startsWith('Bearer ')) {
        sessionId = authHeader.substring(7);
      }
    }
    
    if (sessionId) {
      // Получаем сессию из базы данных
      const session = await User.getSessionById(sessionId);
      
      if (session) {
        logger.info(`Опционально аутентифицирован пользователь: ${session.user_id}`);
        
        // Сохраняем информацию о пользователе в объекте запроса
        req.user = {
          id: session.user_id,
          name: session.name,
          phone_number: session.phone_number,
          birth_date: session.birth_date,
          role: session.role
        };
        
        try {
         
          // Отслеживаем активность пользователя
          await User.trackUserActivity(sessionId, session.user_id, {
            ip: req.ip,
            userAgent: req.headers['user-agent']
          });
        } catch (error) {
          logger.error(error, 'Ошибка при обновлении сессии или отслеживании активности');
          // Продолжаем работу даже при ошибке обновления сессии
        }
      } else {
        logger.info(`Сессия не найдена для sessionId: ${sessionId}`);
      }
    }
    
    // Всегда переходим к следующему middleware
    next();
  } catch (error) {
    logger.error(error, 'Ошибка при опциональной аутентификации');
    // Продолжаем выполнение запроса даже при ошибке аутентификации
    next();
  }
};

module.exports = {
  authenticateUser,
  optionalAuthUser,
  isAdmin
}; 