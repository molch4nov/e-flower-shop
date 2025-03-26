const User = require('../models/user');
const logger = require('../config/logger')('address-controller');

// Получение всех адресов пользователя
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const addresses = await User.getAddresses(userId);
    
    res.json(addresses);
  } catch (error) {
    logger.error(error, 'Ошибка при получении адресов пользователя');
    res.status(500).json({ error: 'Ошибка при получении адресов' });
  }
};

// Добавление нового адреса
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address } = req.body;
    
    // Проверка данных
    if (!name || !address) {
      return res.status(400).json({ error: 'Название и адрес обязательны' });
    }
    
    const newAddress = await User.addAddress(userId, { name, address });
    
    res.status(201).json(newAddress);
  } catch (error) {
    logger.error(error, 'Ошибка при добавлении адреса');
    res.status(500).json({ error: 'Ошибка при добавлении адреса' });
  }
};

// Обновление адреса
exports.updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const { name, address } = req.body;
    
    // Проверка данных
    if (!name || !address) {
      return res.status(400).json({ error: 'Название и адрес обязательны' });
    }
    
    const updatedAddress = await User.updateAddress(addressId, { name, address });
    
    if (!updatedAddress) {
      return res.status(404).json({ error: 'Адрес не найден' });
    }
    
    res.json(updatedAddress);
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении адреса');
    res.status(500).json({ error: 'Ошибка при обновлении адреса' });
  }
};

// Удаление адреса
exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    
    const result = await User.deleteAddress(addressId);
    
    if (!result) {
      return res.status(404).json({ error: 'Адрес не найден' });
    }
    
    res.json({ message: 'Адрес удален' });
  } catch (error) {
    logger.error(error, 'Ошибка при удалении адреса');
    res.status(500).json({ error: 'Ошибка при удалении адреса' });
  }
}; 