const User = require('../models/user');

// Контроллер для профиля пользователя
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.getById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone_number, email, birth_date } = req.body;
    
    // Проверка обязательных полей
    if (!name || !phone_number) {
      return res.status(400).json({ error: 'Имя и номер телефона обязательны' });
    }
    
    const updatedUser = await User.update(userId, { name, phone_number, email, birth_date });
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Ошибка при обновлении профиля пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

// Контроллер для адресов пользователя
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await User.getAddresses(userId);
    
    res.json(addresses);
  } catch (error) {
    console.error('Ошибка при получении адресов пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);
    
    if (isNaN(addressId)) {
      return res.status(400).json({ error: 'Некорректный ID адреса' });
    }
    
    const address = await User.getAddressById(addressId, userId);
    
    if (!address) {
      return res.status(404).json({ error: 'Адрес не найден' });
    }
    
    res.json(address);
  } catch (error) {
    console.error('Ошибка при получении адреса пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, street, house, apartment, entrance, floor, is_default, notes } = req.body;
    
    // Проверка обязательных полей
    if (!title || !street || !house || !apartment) {
      return res.status(400).json({ error: 'Название, улица, дом и квартира обязательны' });
    }
    
    const newAddress = await User.addAddress(userId, {
      title, 
      street, 
      house, 
      apartment, 
      entrance: entrance || null,
      floor: floor || null,
      is_default: is_default || false,
      notes: notes || null
    });
    
    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Ошибка при создании адреса пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);
    
    if (isNaN(addressId)) {
      return res.status(400).json({ error: 'Некорректный ID адреса' });
    }
    
    const { title, street, house, apartment, entrance, floor, is_default, notes } = req.body;
    
    // Проверка обязательных полей
    if (!title || !street || !house || !apartment) {
      return res.status(400).json({ error: 'Название, улица, дом и квартира обязательны' });
    }
    
    const address = await User.getAddressById(addressId, userId);
    
    if (!address) {
      return res.status(404).json({ error: 'Адрес не найден' });
    }
    
    const updatedAddress = await User.updateAddress(addressId, userId, {
      title, 
      street, 
      house, 
      apartment, 
      entrance: entrance || null,
      floor: floor || null,
      is_default: is_default || false,
      notes: notes || null
    });
    
    res.json(updatedAddress);
  } catch (error) {
    console.error('Ошибка при обновлении адреса пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);
    
    if (isNaN(addressId)) {
      return res.status(400).json({ error: 'Некорректный ID адреса' });
    }
    
    const address = await User.getAddressById(addressId, userId);
    
    if (!address) {
      return res.status(404).json({ error: 'Адрес не найден' });
    }
    
    await User.deleteAddress(addressId, userId);
    
    res.json({ message: 'Адрес успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении адреса пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.setAddressAsDefault = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);
    
    if (isNaN(addressId)) {
      return res.status(400).json({ error: 'Некорректный ID адреса' });
    }
    
    const address = await User.getAddressById(addressId, userId);
    
    if (!address) {
      return res.status(404).json({ error: 'Адрес не найден' });
    }
    
    const updatedAddress = await User.setAddressAsDefault(addressId, userId);
    
    res.json(updatedAddress);
  } catch (error) {
    console.error('Ошибка при установке адреса по умолчанию:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

// Контроллер для праздников пользователя
exports.getHolidays = async (req, res) => {
  try {
    const userId = req.user.id;
    const holidays = await User.getHolidays(userId);
    
    res.json(holidays);
  } catch (error) {
    console.error('Ошибка при получении праздников пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.getHolidayById = async (req, res) => {
  try {
    const userId = req.user.id;
    const holidayId = parseInt(req.params.id);
    
    if (isNaN(holidayId)) {
      return res.status(400).json({ error: 'Некорректный ID праздника' });
    }
    
    const holiday = await User.getHolidayById(holidayId, userId);
    
    if (!holiday) {
      return res.status(404).json({ error: 'Праздник не найден' });
    }
    
    res.json(holiday);
  } catch (error) {
    console.error('Ошибка при получении праздника пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.createHoliday = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, date, notes } = req.body;
    
    // Проверка обязательных полей
    if (!name || !date) {
      return res.status(400).json({ error: 'Название и дата праздника обязательны' });
    }
    
    const newHoliday = await User.addHoliday(userId, {
      name,
      date,
      notes: notes || null
    });
    
    res.status(201).json(newHoliday);
  } catch (error) {
    console.error('Ошибка при создании праздника пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.updateHoliday = async (req, res) => {
  try {
    const userId = req.user.id;
    const holidayId = parseInt(req.params.id);
    
    if (isNaN(holidayId)) {
      return res.status(400).json({ error: 'Некорректный ID праздника' });
    }
    
    const { name, date, notes } = req.body;
    
    // Проверка обязательных полей
    if (!name || !date) {
      return res.status(400).json({ error: 'Название и дата праздника обязательны' });
    }
    
    const holiday = await User.getHolidayById(holidayId, userId);
    
    if (!holiday) {
      return res.status(404).json({ error: 'Праздник не найден' });
    }
    
    const updatedHoliday = await User.updateHoliday(holidayId, userId, {
      name,
      date,
      notes: notes || null
    });
    
    res.json(updatedHoliday);
  } catch (error) {
    console.error('Ошибка при обновлении праздника пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    const userId = req.user.id;
    const holidayId = parseInt(req.params.id);
    
    if (isNaN(holidayId)) {
      return res.status(400).json({ error: 'Некорректный ID праздника' });
    }
    
    const holiday = await User.getHolidayById(holidayId, userId);
    
    if (!holiday) {
      return res.status(404).json({ error: 'Праздник не найден' });
    }
    
    await User.deleteHoliday(holidayId, userId);
    
    res.json({ message: 'Праздник успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении праздника пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
}; 