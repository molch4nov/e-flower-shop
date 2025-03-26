const Cart = require('../models/cart');
const logger = require('../config/logger')('cart-controller');

// Получение содержимого корзины пользователя
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cartItems = await Cart.getCartItems(userId);
    const total = await Cart.getCartTotal(userId);
    
    res.json({
      items: cartItems,
      total
    });
  } catch (error) {
    logger.error(error, 'Ошибка при получении корзины пользователя');
    res.status(500).json({ error: 'Ошибка при получении корзины' });
  }
};

// Добавление товара в корзину
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;
    
    // Проверка данных
    if (!product_id) {
      return res.status(400).json({ error: 'ID товара обязателен' });
    }
    
    // Преобразуем quantity в число, по умолчанию 1
    const parsedQuantity = parseInt(quantity) || 1;
    if (parsedQuantity <= 0) {
      return res.status(400).json({ error: 'Количество товара должно быть положительным числом' });
    }
    
    const cartItem = await Cart.addToCart(userId, product_id, parsedQuantity);
    
    res.status(201).json(cartItem);
  } catch (error) {
    logger.error(error, 'Ошибка при добавлении товара в корзину');
    
    if (error.message === 'Товар не найден') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Ошибка при добавлении товара в корзину' });
  }
};

// Обновление количества товара в корзине
exports.updateCartItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { quantity } = req.body;
    
    // Проверка данных
    if (quantity === undefined) {
      return res.status(400).json({ error: 'Количество товара обязательно' });
    }
    
    // Преобразуем quantity в число
    const parsedQuantity = parseInt(quantity);
    
    let result;
    if (parsedQuantity <= 0) {
      // Если количество меньше или равно 0, удаляем товар из корзины
      result = await Cart.removeFromCart(itemId);
      if (result) {
        return res.json({ message: 'Товар удален из корзины' });
      }
    } else {
      // Иначе обновляем количество
      result = await Cart.updateCartItem(itemId, parsedQuantity);
    }
    
    if (!result) {
      return res.status(404).json({ error: 'Товар в корзине не найден' });
    }
    
    res.json(result);
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении товара в корзине');
    res.status(500).json({ error: 'Ошибка при обновлении товара в корзине' });
  }
};

// Удаление товара из корзины
exports.removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    const result = await Cart.removeFromCart(itemId);
    
    if (!result) {
      return res.status(404).json({ error: 'Товар в корзине не найден' });
    }
    
    res.json({ message: 'Товар удален из корзины' });
  } catch (error) {
    logger.error(error, 'Ошибка при удалении товара из корзины');
    res.status(500).json({ error: 'Ошибка при удалении товара из корзины' });
  }
};

// Очистка корзины
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Cart.clearCart(userId);
    
    res.json({ 
      message: 'Корзина очищена',
      removed_items: count
    });
  } catch (error) {
    logger.error(error, 'Ошибка при очистке корзины');
    res.status(500).json({ error: 'Ошибка при очистке корзины' });
  }
}; 