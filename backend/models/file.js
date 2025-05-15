const db = require('../config/db');

class File {
  static async getAll() {
    const query = `
      SELECT * FROM files
      ORDER BY created_at DESC;
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
      SELECT * FROM files
      WHERE id = $1;
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByParent(parentId) {
    const query = `
      SELECT id, filename, mimetype, parent_id, created_at, updated_at
      FROM files
      WHERE parent_id = $1
      ORDER BY created_at;
    `;
    
    try {
      const result = await db.query(query, [parentId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(fileData) {
    const { filename, mimetype, file, parent_id } = fileData;
    const query = `
      INSERT INTO files (filename, mimetype, file, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, filename, mimetype, parent_id, created_at, updated_at;
    `;
    
    try {
      const result = await db.query(query, [filename, mimetype, file, parent_id]);
      return result.rows[0];
    } catch (error) {
      console.log('FILE ERROR', error)
      throw error;
    }
  }

  static async delete(id) {
    const query = `
      DELETE FROM files
      WHERE id = $1
      RETURNING id, filename, mimetype, parent_id;
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteByParent(parentId) {
    const query = `
      DELETE FROM files
      WHERE parent_id = $1
      RETURNING id;
    `;
    
    try {
      const result = await db.query(query, [parentId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = File; 