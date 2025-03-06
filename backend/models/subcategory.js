const db = require('../config/db');

class Subcategory {
  static async getAll() {
    const query = `
      SELECT s.id, s.name, s.category_id, s.created_at, s.updated_at,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) AS category
      FROM subcategories s
      JOIN categories c ON s.category_id = c.id
      ORDER BY s.name;
    `;
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = `
      SELECT s.id, s.name, s.category_id, s.created_at, s.updated_at,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) AS category
      FROM subcategories s
      JOIN categories c ON s.category_id = c.id
      WHERE s.id = $1;
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByCategoryId(categoryId) {
    const query = `
      SELECT * FROM subcategories
      WHERE category_id = $1
      ORDER BY name;
    `;
    
    try {
      const result = await db.query(query, [categoryId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(name, categoryId) {
    const query = `
      INSERT INTO subcategories (name, category_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [name, categoryId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, name, categoryId) {
    const query = `
      UPDATE subcategories
      SET name = $1, category_id = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [name, categoryId, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = `
      DELETE FROM subcategories
      WHERE id = $1
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Subcategory; 