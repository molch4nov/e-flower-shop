const db = require('../config/db');
const Cart = require('./cart');
const Product = require('./product');

class Order {
  static async getAll(userId) {
    const query = `
      SELECT id, user_id, order_number, total_price as total_amount, delivery_address, 
             delivery_date, delivery_time, status, payment_method, payment_status,
             notes, created_at, updated_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      const orders = result.rows;
      
      // Получаем товары для каждого заказа
      for (const order of orders) {
        order.items = await this.getOrderItems(order.id);
      }
      
      return orders;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id, userId = null) {
    let query = `
      SELECT id, user_id, order_number, total_price as total_amount, delivery_address, 
             delivery_date, delivery_time, status, payment_method, payment_status,
             notes, created_at, updated_at
      FROM orders
      WHERE id = $1
    `;
    
    // Если указан userId, то проверяем, что заказ принадлежит пользователю
    if (userId) {
      query += ` AND user_id = $2`;
    }
    
    try {
      const result = userId 
        ? await db.query(query, [id, userId])
        : await db.query(query, [id]);
      
      const order = result.rows[0];
      
      if (order) {
        order.items = await this.getOrderItems(order.id);
      }
      
      return order;
    } catch (error) {
      throw error;
    }
  }

  static async getOrderItems(orderId) {
    const query = `
      SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price,
             p.name AS product_name, p.type AS product_type,
             COALESCE(
               (SELECT url FROM product_images WHERE product_id = p.id ORDER BY is_main DESC, created_at LIMIT 1),
               '/images/default-product.jpg'
             ) AS image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1;
    `;
    
    try {
      const result = await db.query(query, [orderId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(userId, orderData) {
    const { delivery_address, delivery_date, delivery_time, payment_method, notes } = orderData;
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Получаем корзину пользователя
      const cartItems = await Cart.getCartItems(userId);
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Корзина пуста');
      }
      
      // Рассчитываем общую стоимость заказа
      const total = await Cart.getCartTotal(userId);
      
      // Генерируем номер заказа (текущая дата + случайное число)
      const orderNumber = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Создаем заказ
      const orderQuery = `
        INSERT INTO orders (
          user_id, order_number, total_price, delivery_address, 
          delivery_date, delivery_time, status, payment_method, 
          payment_status, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7, 'pending', $8)
        RETURNING id, user_id, order_number, total_price as total_amount, 
                  delivery_address, delivery_date, delivery_time, 
                  status, payment_method, payment_status, notes, 
                  created_at, updated_at;
      `;
      
      const orderResult = await client.query(orderQuery, [
        userId, orderNumber, total, delivery_address, delivery_date, 
        delivery_time, payment_method, notes
      ]);
      const order = orderResult.rows[0];
      
      // Добавляем товары из корзины в заказ
      for (const item of cartItems) {
        const orderItemQuery = `
          INSERT INTO order_items (order_id, product_id, price, quantity)
          VALUES ($1, $2, $3, $4)
          RETURNING id;
        `;
        
        await client.query(orderItemQuery, [
          order.id, item.product_id, item.product_price, item.quantity
        ]);
        
        // Увеличиваем счетчик покупок товара
        const updateProductQuery = `
          UPDATE products
          SET purchases_count = purchases_count + $1
          WHERE id = $2;
        `;
        
        await client.query(updateProductQuery, [item.quantity, item.product_id]);
      }
      
      // Очищаем корзину
      await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
      
      await client.query('COMMIT');
      
      // Получаем созданный заказ с товарами
      order.items = await this.getOrderItems(order.id);
      
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateStatus(id, status, userId = null) {
    let query = `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    
    // Если указан userId, то проверяем, что заказ принадлежит пользователю
    if (userId) {
      query += ` AND user_id = $3`;
    }
    
    query += `
      RETURNING id, user_id, order_number, total_price as total_amount, 
                delivery_address, delivery_date, delivery_time, status, 
                payment_method, payment_status, notes, created_at, updated_at;
    `;
    
    try {
      const result = userId
        ? await db.query(query, [status, id, userId])
        : await db.query(query, [status, id]);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async cancelOrder(id, userId) {
    return this.updateStatus(id, 'cancelled', userId);
  }

  static async updatePaymentStatus(id, paymentStatus, userId = null) {
    let query = `
      UPDATE orders
      SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    
    // Если указан userId, то проверяем, что заказ принадлежит пользователю
    if (userId) {
      query += ` AND user_id = $3`;
    }
    
    query += `
      RETURNING id, user_id, order_number, total_price as total_amount, 
                delivery_address, delivery_date, delivery_time, status, 
                payment_method, payment_status, notes, created_at, updated_at;
    `;
    
    try {
      const result = userId
        ? await db.query(query, [paymentStatus, id, userId])
        : await db.query(query, [paymentStatus, id]);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAllOrders(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT o.id, o.user_id, o.order_number, o.total_price, o.delivery_address, 
             o.delivery_date, o.delivery_time, o.status, o.payment_method,
             o.payment_status, o.notes, o.created_at, o.updated_at,
             u.name AS user_name, u.phone_number
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    
    const countQuery = `SELECT COUNT(*) FROM orders;`;
    
    try {
      const [result, countResult] = await Promise.all([
        db.query(query, [limit, offset]),
        db.query(countQuery)
      ]);
      
      const orders = result.rows;
      const totalCount = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalCount / limit);
      
      // Получаем товары для каждого заказа
      for (const order of orders) {
        order.items = await this.getOrderItems(order.id);
      }
      
      return {
        orders,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async getOrderStats() {
    // Получаем даты для фильтрации
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Запрос на получение статистики по заказам
    const query = `
      SELECT 
        COUNT(*) AS total_orders,
        COUNT(*) FILTER (WHERE created_at >= $1) AS orders_today,
        COUNT(*) FILTER (WHERE created_at >= $2 AND created_at < $1) AS orders_yesterday,
        COUNT(*) FILTER (WHERE created_at >= $3) AS orders_this_week,
        COUNT(*) FILTER (WHERE created_at >= $4) AS orders_this_month,
        COUNT(*) FILTER (WHERE status = 'new') AS new_orders,
        COUNT(*) FILTER (WHERE status = 'processing') AS processing_orders,
        COUNT(*) FILTER (WHERE status = 'delivering') AS delivering_orders,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed_orders,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_orders,
        SUM(total_price) AS total_revenue,
        SUM(total_price) FILTER (WHERE created_at >= $1) AS today_revenue,
        SUM(total_price) FILTER (WHERE created_at >= $2 AND created_at < $1) AS yesterday_revenue,
        SUM(total_price) FILTER (WHERE created_at >= $3) AS week_revenue,
        SUM(total_price) FILTER (WHERE created_at >= $4) AS month_revenue
      FROM orders;
    `;
    
    try {
      const result = await db.query(query, [today, yesterday, lastWeek, lastMonth]);
      
      // Преобразуем строковые значения в числовые
      const stats = result.rows[0];
      for (const key in stats) {
        if (stats[key] === null) {
          stats[key] = 0;
        } else if (!isNaN(Number(stats[key]))) {
          stats[key] = Number(stats[key]);
        }
      }
      
      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Order; 