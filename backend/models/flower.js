const db = require('../config/db');

class Flower {
  static async getAll() {
    const query = `
      SELECT * FROM flowers
      ORDER BY name;
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
      SELECT * FROM flowers
      WHERE id = $1;
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(flowerData) {
    const { name, price } = flowerData;
    const query = `
      INSERT INTO flowers (name, price)
      VALUES ($1, $2)
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [name, price]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, flowerData) {
    const { name, price } = flowerData;
    const query = `
      UPDATE flowers
      SET name = $1, price = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [name, price, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = `
      DELETE FROM flowers
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

module.exports = Flower; 