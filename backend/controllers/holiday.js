const User = require('../models/user');
const logger = require('../config/logger')('holiday-controller');

// Получение всех праздников пользователя
exports.getHolidays = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const holidays = await User.getHolidays(userId);
    
    res.json(holidays);
  } catch (error) {
    logger.error(error, 'Ошибка при получении праздников пользователя');
    res.status(500).json({ error: 'Ошибка при получении праздников' });
  }
};

// Добавление нового праздника
exports.addHoliday = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, date } = req.body;
    
    // Проверка данных
    if (!name || !date) {
      return res.status(400).json({ error: 'Название и дата праздника обязательны' });
    }
    
    // Валидация даты
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Неверный формат даты' });
    }
    
    const holiday = await User.addHoliday(userId, { name, date });
    
    res.status(201).json(holiday);
  } catch (error) {
    logger.error(error, 'Ошибка при добавлении праздника');
    res.status(500).json({ error: 'Ошибка при добавлении праздника' });
  }
};

// Обновление праздника
exports.updateHoliday = async (req, res) => {
  try {
    const holidayId = req.params.id;
    const { name, date } = req.body;
    
    // Проверка данных
    if (!name || !date) {
      return res.status(400).json({ error: 'Название и дата праздника обязательны' });
    }
    
    // Валидация даты
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Неверный формат даты' });
    }
    
    const holiday = await User.updateHoliday(holidayId, { name, date });
    
    if (!holiday) {
      return res.status(404).json({ error: 'Праздник не найден' });
    }
    
    res.json(holiday);
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении праздника');
    res.status(500).json({ error: 'Ошибка при обновлении праздника' });
  }
};

// Удаление праздника
exports.deleteHoliday = async (req, res) => {
  try {
    const holidayId = req.params.id;
    
    const result = await User.deleteHoliday(holidayId);
    
    if (!result) {
      return res.status(404).json({ error: 'Праздник не найден' });
    }
    
    res.json({ message: 'Праздник удален' });
  } catch (error) {
    logger.error(error, 'Ошибка при удалении праздника');
    res.status(500).json({ error: 'Ошибка при удалении праздника' });
  }
}; 