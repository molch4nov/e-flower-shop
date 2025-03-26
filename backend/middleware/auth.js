const User = require('../models/user');
const logger = require('../config/logger')('auth-middleware');

// Middleware для проверки аутентификации
const authenticateUser = async (req, res, next) => {
  try {
    // Получаем ID сессии из куки
    const sessionId = req.cookies.sessionId;
    
    if (!sessionId) {
      logger.info('Нет sessionId в cookies');
      return res.status(401).json({ error: 'Не авторизован', details: 'Отсутствует sessionId' });
    }
    
    logger.info(`Получен sessionId: ${sessionId}`);
    
    // Получаем сессию из базы данных
    const session = await User.getSessionById(sessionId);
    
    if (!session) {
      // Очищаем куки, если сессия не найдена или истекла
      logger.info(`Сессия не найдена для sessionId: ${sessionId}`);
      res.clearCookie('sessionId', {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        path: '/'
      });
      return res.status(401).json({ error: 'Сессия истекла. Пожалуйста, войдите снова.' });
    }
    
    logger.info(`Аутентифицирован пользователь: ${session.user_id}`);
    
    // Сохраняем информацию о пользователе в объекте запроса
    req.user = {
      id: session.user_id,
      name: session.name,
      phone_number: session.phone_number,
      birth_date: session.birth_date,
      role: session.role
    };
    
    // Обновляем срок действия сессии при каждом запросе
    await User.refreshSession(sessionId);
    
    // Отслеживаем активность пользователя
    await User.trackUserActivity(sessionId, session.user_id, {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    // Переходим к следующему middleware
    next();
  } catch (error) {
    logger.error(error, 'Ошибка при аутентификации пользователя');
    res.status(500).json({ error: 'Ошибка при аутентификации' });
  }
};

// Middleware для опциональной аутентификации
const optionalAuthUser = async (req, res, next) => {
  try {
    // Получаем ID сессии из куки
    const sessionId = req.cookies.sessionId;
    
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
        
        // Обновляем срок действия сессии при каждом запросе
        await User.refreshSession(sessionId);
        
        // Отслеживаем активность пользователя
        await User.trackUserActivity(sessionId, session.user_id, {
          ip: req.ip,
          userAgent: req.headers['user-agent']
        });
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

// Middleware для проверки прав администратора
const isAdmin = async (req, res, next) => {
  try {
    // Сначала проверяем, аутентифицирован ли пользователь
    if (!req.user) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    // Проверяем, является ли пользователь администратором
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен, требуются права администратора' });
    }
    
    // Если пользователь администратор, продолжаем
    next();
  } catch (error) {
    logger.error(error, 'Ошибка при проверке прав администратора');
    res.status(500).json({ error: 'Ошибка при проверке прав доступа' });
  }
};

module.exports = {
  authenticateUser,
  optionalAuthUser,
  isAdmin
}; 