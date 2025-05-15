const Order = require('../models/order');
const logger = require('../config/logger')('order-controller');

// Получение всех заказов пользователя
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.getAll(userId);
    
    res.json({ orders });
  } catch (error) {
    console.error('Ошибка при получении заказов пользователя:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

// Получение информации о конкретном заказе
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Некорректный ID заказа' });
    }
    
    const order = await Order.getById(orderId, userId);
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

// Создание нового заказа
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      delivery_address, 
      delivery_date, 
      delivery_time, 
      payment_method,
      notes 
    } = req.body;
    
    // Проверка обязательных полей
    if (!delivery_address) {
      return res.status(400).json({ error: 'Адрес доставки обязателен' });
    }
    
    const order = await Order.create(userId, {
      delivery_address,
      delivery_date,
      delivery_time,
      payment_method: payment_method || 'Оплата при получении',
      notes: notes || null
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    
    if (error.message === 'Корзина пуста') {
      return res.status(400).json({ error: 'Корзина пуста, невозможно создать заказ' });
    }
    
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

// Отмена заказа пользователем
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Некорректный ID заказа' });
    }
    
    const order = await Order.getById(orderId, userId);
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    // Проверяем, можно ли отменить заказ
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        error: 'Невозможно отменить заказ, который уже в обработке или доставке' 
      });
    }
    
    const updatedOrder = await Order.cancelOrder(orderId, userId);
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при отмене заказа:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

// Админские методы
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await Order.getAllOrders(page, limit);
    
    res.json(result);
  } catch (error) {
    console.error('Ошибка при получении всех заказов:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.getOrderStats();
    res.json(stats);
  } catch (error) {
    console.error('Ошибка при получении статистики заказов:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Некорректный ID заказа' });
    }
    
    if (!status) {
      return res.status(400).json({ error: 'Статус заказа обязателен' });
    }
    
    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Некорректный статус заказа' });
    }
    
    const order = await Order.getById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    const updatedOrder = await Order.updateStatus(orderId, status);
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { payment_status } = req.body;
    
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Некорректный ID заказа' });
    }
    
    if (!payment_status) {
      return res.status(400).json({ error: 'Статус оплаты обязателен' });
    }
    
    const allowedStatuses = ['pending', 'paid', 'failed'];
    
    if (!allowedStatuses.includes(payment_status)) {
      return res.status(400).json({ error: 'Некорректный статус оплаты' });
    }
    
    const order = await Order.getById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    const updatedOrder = await Order.updatePaymentStatus(orderId, payment_status);
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при обновлении статуса оплаты заказа:', error);
    res.status(500).json({ error: 'Произошла ошибка сервера' });
  }
}; 