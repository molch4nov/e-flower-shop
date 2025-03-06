const db = require('../config/db');
const File = require('./file');

class Review {
  static async getAll() {
    const query = `
      SELECT * FROM reviews
      ORDER BY created_at DESC;
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
      SELECT * FROM reviews
      WHERE id = $1;
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
      SELECT * FROM reviews
      WHERE parent_id = $1
      ORDER BY created_at DESC;
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

  static async create(reviewData) {
    const { title, description, rating, parent_id } = reviewData;
    
    // Начинаем транзакцию
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Создаем отзыв
      const reviewQuery = `
        INSERT INTO reviews (title, description, rating, parent_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      
      const reviewResult = await client.query(reviewQuery, [title, description, rating, parent_id]);
      const review = reviewResult.rows[0];
      
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
    const { title, description, rating, parent_id } = reviewData;
    
    const query = `
      UPDATE reviews
      SET title = $1, description = $2, rating = $3, 
          parent_id = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [title, description, rating, parent_id, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    // Начинаем транзакцию
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
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