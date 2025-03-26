const User = require('../models/user');
const Order = require('../models/order');
const logger = require('../config/logger')('admin-controller');

// Получение списка всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await User.getAllUsers(page, limit);
    
    res.json(result);
  } catch (error) {
    logger.error(error, 'Ошибка при получении списка пользователей');
    res.status(500).json({ error: 'Ошибка при получении списка пользователей' });
  }
};

// Получение информации о конкретном пользователе
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Получаем информацию о пользователе
    const user = await User.getById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    // Получаем праздники пользователя
    const holidays = await User.getHolidays(userId);
    
    // Получаем адреса пользователя
    const addresses = await User.getAddresses(userId);
    
    // Получаем заказы пользователя
    const orders = await Order.getAll(userId);
    
    res.json({
      user,
      holidays,
      addresses,
      orders
    });
  } catch (error) {
    logger.error(error, 'Ошибка при получении информации о пользователе');
    res.status(500).json({ error: 'Ошибка при получении информации о пользователе' });
  }
};

// Обновление роли пользователя
exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    // Проверяем корректность роли
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Некорректное значение роли' });
    }
    
    // Обновляем роль пользователя
    const user = await User.update(userId, { 
      name: req.body.name || '', 
      birth_date: req.body.birth_date || null,
      role 
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json({
      message: 'Роль пользователя обновлена',
      user
    });
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении роли пользователя');
    res.status(500).json({ error: 'Ошибка при обновлении роли пользователя' });
  }
};

// Получение списка активных пользователей
exports.getActiveUsers = async (req, res) => {
  try {
    const minutes = parseInt(req.query.minutes) || 15;
    
    // Ограничиваем диапазон отслеживания (от 5 минут до 24 часов)
    const validMinutes = Math.min(Math.max(minutes, 5), 1440);
    
    const activeUsers = await User.getActiveUsers(validMinutes);
    
    res.json({
      activeUsers,
      trackingPeriod: `${validMinutes} minutes`
    });
  } catch (error) {
    logger.error(error, 'Ошибка при получении списка активных пользователей');
    res.status(500).json({ error: 'Ошибка при получении списка активных пользователей' });
  }
};

// Получение статистики для панели администратора
exports.getDashboardStats = async (req, res) => {
  try {
    // Получаем даты для фильтрации
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    
    // Получаем статистику заказов
    const orderStats = await Order.getOrderStats();
    
    // Получаем количество активных пользователей за последние 15 минут
    const activeUsers = await User.getActiveUsers(15);
    
    // Получаем количество зарегистрированных пользователей
    const userCountQuery = `SELECT COUNT(*) FROM users;`;
    const userCountResult = await require('../config/db').query(userCountQuery);
    const totalUsers = parseInt(userCountResult.rows[0].count);
    
    // Получаем количество новых пользователей за сегодня
    const newUsersQuery = `
      SELECT COUNT(*) 
      FROM users 
      WHERE created_at >= $1;
    `;
    const newUsersResult = await require('../config/db').query(newUsersQuery, [startOfToday]);
    const newUsers = parseInt(newUsersResult.rows[0].count);
    
    // Формируем объект со статистикой
    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers.length,
        new: newUsers
      },
      orders: orderStats
    };
    
    res.json(stats);
  } catch (error) {
    logger.error(error, 'Ошибка при получении статистики');
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
};