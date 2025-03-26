const db = require('../config/db');
const Product = require('./product');

class Cart {
  static async getCartItems(userId) {
    const query = `
      SELECT ci.id, ci.user_id, ci.product_id, ci.quantity, 
             ci.created_at, ci.updated_at,
             p.name AS product_name, p.price AS product_price, p.type AS product_type
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      ORDER BY ci.created_at;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getCartTotal(userId) {
    const query = `
      SELECT SUM(p.price * ci.quantity) as total
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows[0].total || 0;
    } catch (error) {
      throw error;
    }
  }

  static async addToCart(userId, productId, quantity = 1) {
    // Проверяем, существует ли товар
    const product = await Product.getById(productId);
    if (!product) {
      throw new Error('Товар не найден');
    }
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingQuery = `
      SELECT id, quantity FROM cart_items
      WHERE user_id = $1 AND product_id = $2;
    `;
    
    try {
      const existingResult = await db.query(existingQuery, [userId, productId]);
      const existingItem = existingResult.rows[0];
      
      if (existingItem) {
        // Обновляем количество, если товар уже в корзине
        const newQuantity = existingItem.quantity + quantity;
        
        const updateQuery = `
          UPDATE cart_items
          SET quantity = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          RETURNING id, user_id, product_id, quantity, created_at, updated_at;
        `;
        
        const updateResult = await db.query(updateQuery, [newQuantity, existingItem.id]);
        return updateResult.rows[0];
      } else {
        // Добавляем новый товар в корзину
        const insertQuery = `
          INSERT INTO cart_items (user_id, product_id, quantity)
          VALUES ($1, $2, $3)
          RETURNING id, user_id, product_id, quantity, created_at, updated_at;
        `;
        
        const insertResult = await db.query(insertQuery, [userId, productId, quantity]);
        return insertResult.rows[0];
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateCartItem(id, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(id);
    }
    
    const query = `
      UPDATE cart_items
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, user_id, product_id, quantity, created_at, updated_at;
    `;
    
    try {
      const result = await db.query(query, [quantity, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async removeFromCart(id) {
    const query = `
      DELETE FROM cart_items
      WHERE id = $1
      RETURNING id;
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async clearCart(userId) {
    const query = `
      DELETE FROM cart_items
      WHERE user_id = $1
      RETURNING id;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rowCount;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cart; 