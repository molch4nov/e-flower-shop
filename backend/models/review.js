const db = require('../config/db');
const File = require('./file');

class Review {
  static async getAll() {
    const query = `
      SELECT r.*, u.name AS user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC;
    `;
    
    try {
      const result = await db.query(query);
      const reviews = result.rows;
      
      // Получение файлов для каждого отзыва
      for (const review of reviews) {
        review.files = await File.getByParent(review.id);
      }
      
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = `
      SELECT r.*, u.name AS user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = $1;
    `;
    
    try {
      const result = await db.query(query, [id]);
      const review = result.rows[0];
      
      if (review) {
        // Получение файлов для отзыва
        review.files = await File.getByParent(review.id);
      }
      
      return review;
    } catch (error) {
      throw error;
    }
  }

  static async getByParent(parentId) {
    const query = `
      SELECT r.*, u.name AS user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.parent_id = $1
      ORDER BY r.created_at DESC;
    `;
    
    try {
      const result = await db.query(query, [parentId]);
      const reviews = result.rows;
      
      // Получение файлов для каждого отзыва
      for (const review of reviews) {
        review.files = await File.getByParent(review.id);
      }
      
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  static async getByUser(userId) {
    const query = `
      SELECT r.*, u.name AS user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      const reviews = result.rows;
      
      // Получение файлов для каждого отзыва
      for (const review of reviews) {
        review.files = await File.getByParent(review.id);
      }
      
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  static async create(reviewData) {
    const { title, description, rating, parent_id, user_id } = reviewData;
    
    // Начинаем транзакцию
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Создаем отзыв
      const reviewQuery = `
        INSERT INTO reviews (title, description, rating, parent_id, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      
      const reviewResult = await client.query(reviewQuery, [title, description, rating, parent_id, user_id]);
      const review = reviewResult.rows[0];
      await client.query('COMMIT');

      await client.query('BEGIN');
      const Product = require('./product');
      await Product.updateRating(parent_id);
      await client.query('COMMIT');
      
      return review;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, reviewData) {
    const { title, description, rating, parent_id, user_id } = reviewData;
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        UPDATE reviews
        SET title = $1, description = $2, rating = $3, 
            parent_id = $4, user_id = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *;
      `;
      
      const result = await client.query(query, [title, description, rating, parent_id, user_id, id]);
      const updatedReview = result.rows[0];
      await client.query('COMMIT');

      await client.query('BEGIN');
      const Product = require('./product');
      await Product.updateRating(parent_id);
      await client.query('COMMIT');
      return updatedReview;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    // Начинаем транзакцию
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Получаем информацию об удаляемом отзыве для обновления рейтинга
      const reviewInfoQuery = `SELECT parent_id FROM reviews WHERE id = $1`;
      const reviewInfoResult = await client.query(reviewInfoQuery, [id]);
      const reviewInfo = reviewInfoResult.rows[0];
      
      // Сначала удаляем связанные файлы
      await File.deleteByParent(id);
      
      // Затем удаляем сам отзыв
      const reviewQuery = `
        DELETE FROM reviews
        WHERE id = $1
        RETURNING *;
      `;
      
      const reviewResult = await client.query(reviewQuery, [id]);
      const deletedReview = reviewResult.rows[0];
      await client.query('COMMIT');
      await client.query('BEGIN');
      // Обновляем рейтинг продукта, если это был отзыв к продукту
      const Product = require('./product');
      await Product.updateRating(reviewInfo.parent_id);
      
      await client.query('COMMIT');
      
      return deletedReview;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Review; 