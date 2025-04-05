const db = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
  static async getById(id) {
    const query = `
      SELECT id, name, phone_number, birth_date, role, created_at, updated_at 
      FROM users
      WHERE id = $1;
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByPhoneNumber(phoneNumber) {
    const query = `
      SELECT id, name, phone_number, password_hash, birth_date, role, created_at, updated_at 
      FROM users
      WHERE phone_number = $1;
    `;
    
    try {
      const result = await db.query(query, [phoneNumber]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    const { name, phone_number, password, birth_date, role = 'user' } = userData;
    
    // Проверяем, существует ли пользователь с таким телефоном
    const existingUser = await this.getByPhoneNumber(phone_number);
    if (existingUser) {
      throw new Error('Пользователь с таким номером телефона уже существует');
    }
    
    // Хешируем пароль
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (name, phone_number, password_hash, birth_date, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, phone_number, birth_date, role, created_at, updated_at;
    `;
    
    try {
      const result = await db.query(query, [name, phone_number, passwordHash, birth_date, role]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userData) {
    const { name, birth_date, role } = userData;
    
    let query;
    let params;
    
    if (role) {
      // Если указана роль, обновляем ее
      query = `
        UPDATE users
        SET name = $1, birth_date = $2, role = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, name, phone_number, birth_date, role, created_at, updated_at;
      `;
      params = [name, birth_date, role, id];
    } else {
      // Без роли
      query = `
        UPDATE users
        SET name = $1, birth_date = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, name, phone_number, birth_date, role, created_at, updated_at;
      `;
      params = [name, birth_date, id];
    }
    
    try {
      const result = await db.query(query, params);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(id, newPassword) {
    // Хешируем новый пароль
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id;
    `;
    
    try {
      const result = await db.query(query, [passwordHash, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async authenticate(phoneNumber, password) {
    // Находим пользователя по номеру телефона
    const user = await this.getByPhoneNumber(phoneNumber);
    if (!user) {
      return null; // Пользователь не найден
    }
    
    // Проверяем соответствие пароля
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return null; // Пароль неверный
    }
    
    // Удаляем хеш пароля из объекта перед возвратом
    delete user.password_hash;
    
    return user;
  }

  static async createSession(userId) {
    // Устанавливаем срок действия сессии на 24 часа
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // Получаем роль пользователя
    const user = await this.getById(userId);
    const userRole = user ? user.role : 'user';
    
    const query = `
      INSERT INTO sessions (id, user_id, expires_at, user_role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, expires_at, user_role, created_at;
    `;
    
    const sessionId = uuidv4();
    
    try {   
      const result = await db.query(query, [sessionId, userId, expiresAt, userRole]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getSessionById(sessionId) {
    const query = `
      SELECT s.id, s.user_id, s.expires_at, s.created_at,
             u.name, u.phone_number, u.birth_date, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1 AND s.expires_at > CURRENT_TIMESTAMP;
    `;
    
    try {
      const result = await db.query(query, [sessionId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteSession(sessionId) {
    const query = `
      DELETE FROM sessions
      WHERE id = $1
      RETURNING id;
    `;
    
    try {
      const result = await db.query(query, [sessionId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async cleanExpiredSessions() {
    const query = `
      DELETE FROM sessions
      WHERE expires_at <= CURRENT_TIMESTAMP
      RETURNING id;
    `;
    
    try {
      const result = await db.query(query);
      return result.rowCount;
    } catch (error) {
      throw error;
    }
  }

  // Методы для управления праздниками пользователя
  static async getHolidays(userId) {
    const query = `
      SELECT id, name, date, created_at, updated_at
      FROM user_holidays
      WHERE user_id = $1
      ORDER BY date;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async addHoliday(userId, holidayData) {
    const { name, date } = holidayData;
    
    const query = `
      INSERT INTO user_holidays (user_id, name, date)
      VALUES ($1, $2, $3)
      RETURNING id, name, date, created_at, updated_at;
    `;
    
    try {
      const result = await db.query(query, [userId, name, date]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateHoliday(id, holidayData) {
    const { name, date } = holidayData;
    
    const query = `
      UPDATE user_holidays
      SET name = $1, date = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, date, created_at, updated_at;
    `;
    
    try {
      const result = await db.query(query, [name, date, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteHoliday(id) {
    const query = `
      DELETE FROM user_holidays
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

  // Методы для управления адресами пользователя
  static async getAddresses(userId) {
    const query = `
      SELECT id, name, address, created_at, updated_at
      FROM user_addresses
      WHERE user_id = $1
      ORDER BY created_at;
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async addAddress(userId, addressData) {
    const { name, address } = addressData;
    
    const query = `
      INSERT INTO user_addresses (user_id, name, address)
      VALUES ($1, $2, $3)
      RETURNING id, name, address, created_at, updated_at;
    `;
    
    try {
      const result = await db.query(query, [userId, name, address]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateAddress(id, addressData) {
    const { name, address } = addressData;
    
    const query = `
      UPDATE user_addresses
      SET name = $1, address = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, address, created_at, updated_at;
    `;
    
    try {
      const result = await db.query(query, [name, address, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteAddress(id) {
    const query = `
      DELETE FROM user_addresses
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

  // Методы для управления активными пользователями
  static async trackUserActivity(sessionId, userId, requestData = {}) {
    const { ip, userAgent } = requestData;
    
    const query = `
      INSERT INTO active_users (session_id, user_id, ip_address, user_agent, last_activity)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id, session_id, user_id, last_activity;
    `;
    
    try {
      const result = await db.query(query, [sessionId, userId, ip, userAgent]);
      console.log('result', result)
      return result.rows[0];
    } catch (error) {
      console.log('error', error)
      throw error;
    }
  }
  
  static async getActiveUsers(minutes = 15) {
    const query = `
      SELECT a.id, a.session_id, a.user_id, a.last_activity, a.ip_address, a.user_agent,
             u.name, u.phone_number, u.role
      FROM active_users a
      JOIN users u ON a.user_id = u.id
      WHERE a.last_activity > NOW() - INTERVAL '${minutes} minutes'
      ORDER BY a.last_activity DESC;
    `;
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  
  static async getAllUsers(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT id, name, phone_number, birth_date, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    
    const countQuery = `SELECT COUNT(*) FROM users;`;
    
    try {
      const [result, countResult] = await Promise.all([
        db.query(query, [limit, offset]),
        db.query(countQuery)
      ]);
      
      const users = result.rows;
      const totalCount = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        users,
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
  
  static async isAdmin(userId) {
    try {
      const user = await this.getById(userId);
      return user && user.role === 'admin';
    } catch (error) {
      throw error;
    }
  }

  // Обновление срока действия сессии
  static async refreshSession(sessionId) {
    const query = `
      UPDATE sessions
      SET expires_at = NOW() + INTERVAL '30 days'
      WHERE id = $1
      RETURNING id;
    `;
    
    try {
      const result = await db.query(query, [sessionId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User; 