const User = require('../models/user');
const logger = require('../config/logger')('auth-controller');

// Регистрация нового пользователя
exports.register = async (req, res) => {
  try {
    const { name, phone_number, password, birth_date } = req.body;
    
    // Проверяем обязательные поля
    if (!name || !phone_number || !password) {
      return res.status(400).json({ error: 'Имя, номер телефона и пароль обязательны' });
    }
    
    // Проверяем корректность номера телефона (простая проверка)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ error: 'Неверный формат номера телефона' });
    }
    
    // Создаем нового пользователя
    const user = await User.create({
      name,
      phone_number,
      password,
      birth_date: birth_date || null
    });
    
    // Создаем сессию
    const session = await User.createSession(user.id);
    
    // Устанавливаем куки для сессии (httpOnly для безопасности)
    res.cookie('sessionId', session.id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Отправляем информацию о пользователе без конфиденциальных данных
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        birth_date: user.birth_date
      }
    });
  } catch (error) {
    logger.error(error, 'Ошибка при регистрации пользователя');
    
    if (error.message === 'Пользователь с таким номером телефона уже существует') {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    
    // Проверяем обязательные поля
    if (!phone_number || !password) {
      return res.status(400).json({ error: 'Номер телефона и пароль обязательны' });
    }
    
    // Аутентифицируем пользователя
    const user = await User.authenticate(phone_number, password);
    
    if (!user.id) {
      return res.status(401).json({ error: 'Неверный номер телефона или пароль' });
    }
    
    // Создаем сессию
    const session = await User.createSession(user.id);
    
    // Устанавливаем куки для сессии
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.clearCookie('sessionId');
    res.cookie('sessionId', session.id, {
      httpOnly: isProduction, // В production включаем httpOnly
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      secure: isProduction, // В production включаем secure
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
    });
    
    logger.info(`Успешный вход пользователя: ${user.id}`);
    
    res.json({
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        birth_date: user.birth_date,
        role: user.role
      },
      sessionId: session.id
    });
  } catch (error) {
    logger.error(error, 'Ошибка при входе пользователя');
    res.status(500).json({ error: 'Ошибка при входе' });
  }
};

// Выход пользователя
exports.logout = async (req, res) => {
  try {
    // Получаем ID сессии из куки
    const sessionId = req.cookies.sessionId;
    
    if (sessionId) {
      // Удаляем сессию из базы данных
      await User.deleteSession(sessionId);
      
      const isProduction = process.env.NODE_ENV === 'production';
      
      // Очищаем куки с правильными опциями
      res.clearCookie('sessionId', {
        httpOnly: isProduction,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
      });
    }
    
    logger.info('Успешный выход пользователя');
    res.json({ message: 'Выход выполнен успешно' });
  } catch (error) {
    logger.error(error, 'Ошибка при выходе пользователя');
    res.status(500).json({ error: 'Ошибка при выходе' });
  }
};

// Получение информации о текущем пользователе
exports.getCurrentUser = async (req, res) => {
  try {
    // Информация о пользователе должна быть доступна из middleware аутентификации
    const user = req.user;
    
    // Получаем праздники пользователя
    const holidays = await User.getHolidays(user.id);
    
    // Получаем адреса пользователя
    const addresses = await User.getAddresses(user.id);
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        birth_date: user.birth_date,
        role: user.role
      },
      holidays,
      addresses
    });
  } catch (error) {
    logger.error(error, 'Ошибка при получении информации о пользователе');
    res.status(500).json({ error: 'Ошибка при получении информации о пользователе' });
  }
};

// Обновление информации пользователя
exports.updateUser = async (req, res) => {
  try {
    const { name, birth_date } = req.body;
    const userId = req.user.id;
    
    // Обновляем информацию о пользователе
    const updatedUser = await User.update(userId, { name, birth_date });
    
    res.json({
      message: 'Информация обновлена',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        phone_number: updatedUser.phone_number,
        birth_date: updatedUser.birth_date
      }
    });
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении информации о пользователе');
    res.status(500).json({ error: 'Ошибка при обновлении информации' });
  }
};

// Изменение пароля
exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = req.user;
    
    // Проверяем текущий пароль
    const authenticated = await User.authenticate(user.phone_number, current_password);
    
    if (!authenticated) {
      return res.status(401).json({ error: 'Неверный текущий пароль' });
    }
    
    // Обновляем пароль
    await User.updatePassword(user.id, new_password);
    
    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    logger.error(error, 'Ошибка при изменении пароля');
    res.status(500).json({ error: 'Ошибка при изменении пароля' });
  }
};

// Тестовый эндпоинт для установки cookie
exports.testCookie = async (req, res) => {
  try {
    // Устанавливаем тестовую куку
    res.cookie('testCookie', 'hello-world', {
      maxAge: 900000, // 15 минут
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/'
    });
    
    console.log('Set test cookie header:', res.getHeader('Set-Cookie'));
    
    res.json({ 
      message: 'Тестовый cookie установлен',
      cookieValue: 'hello-world'
    });
  } catch (error) {
    console.error('Error setting test cookie:', error);
    res.status(500).json({ error: 'Ошибка при установке тестового cookie' });
  }
}; 