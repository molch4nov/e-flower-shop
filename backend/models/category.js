const db = require('../config/db');

class Category {
  static async getAll() {
    const query = `
      SELECT c.id, c.name, c.created_at, c.updated_at,
        json_agg(
          json_build_object(
            'id', s.id,
            'name', s.name,
            'created_at', s.created_at,
            'updated_at', s.updated_at
          )
        ) FILTER (WHERE s.id IS NOT NULL) AS subcategories
      FROM categories c
      LEFT JOIN subcategories s ON c.id = s.category_id
      GROUP BY c.id
      ORDER BY c.name;
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
      SELECT c.id, c.name, c.created_at, c.updated_at,
        json_agg(
          json_build_object(
            'id', s.id,
            'name', s.name,
            'created_at', s.created_at,
            'updated_at', s.updated_at
          )
        ) FILTER (WHERE s.id IS NOT NULL) AS subcategories
      FROM categories c
      LEFT JOIN subcategories s ON c.id = s.category_id
      WHERE c.id = $1
      GROUP BY c.id;
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(name) {
    const query = `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [name]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, name) {
    const query = `
      UPDATE categories
      SET name = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [name, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = `
      DELETE FROM categories
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

module.exports = Category; 