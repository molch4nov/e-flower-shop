const Order = require('../models/order');
const logger = require('../config/logger')('order-controller');

// Получение всех заказов пользователя
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.getAll(userId);
    
    res.json(orders);
  } catch (error) {
    logger.error(error, 'Ошибка при получении заказов пользователя');
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
};

// Получение конкретного заказа пользователя
exports.getUserOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const order = await Order.getById(orderId, userId);
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    res.json(order);
  } catch (error) {
    logger.error(error, 'Ошибка при получении заказа');
    res.status(500).json({ error: 'Ошибка при получении заказа' });
  }
};

// Создание нового заказа
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { delivery_address, delivery_date, delivery_time } = req.body;
    
    // Проверка данных
    if (!delivery_address || !delivery_date || !delivery_time) {
      return res.status(400).json({ 
        error: 'Адрес доставки, дата и время обязательны'
      });
    }
    
    // Валидация даты
    if (isNaN(Date.parse(delivery_date))) {
      return res.status(400).json({ error: 'Неверный формат даты' });
    }
    
    // Проверяем, что дата не в прошлом
    const orderDate = new Date(delivery_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (orderDate < today) {
      return res.status(400).json({ error: 'Дата доставки не может быть в прошлом' });
    }
    
    const order = await Order.create(userId, {
      delivery_address,
      delivery_date,
      delivery_time
    });
    
    res.status(201).json(order);
  } catch (error) {
    logger.error(error, 'Ошибка при создании заказа');
    
    if (error.message === 'Корзина пуста') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  }
};

// Получение всех заказов (для админа)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await Order.getAllOrders(page, limit);
    
    res.json(result);
  } catch (error) {
    logger.error(error, 'Ошибка при получении всех заказов');
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
};

// Получение конкретного заказа (для админа)
exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    const order = await Order.getById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    res.json(order);
  } catch (error) {
    logger.error(error, 'Ошибка при получении заказа');
    res.status(500).json({ error: 'Ошибка при получении заказа' });
  }
};

// Обновление статуса заказа (для админа)
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    // Проверка данных
    if (!status) {
      return res.status(400).json({ error: 'Статус заказа обязателен' });
    }
    
    // Проверка допустимых значений статуса
    const validStatuses = ['new', 'processing', 'delivering', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Недопустимый статус. Допустимые значения: ${validStatuses.join(', ')}`
      });
    }
    
    const order = await Order.updateStatus(orderId, status);
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    res.json(order);
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении статуса заказа');
    res.status(500).json({ error: 'Ошибка при обновлении статуса заказа' });
  }
}; 