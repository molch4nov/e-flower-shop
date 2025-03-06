require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger')('init-db');

async function initDb() {
  logger.info('Начало инициализации базы данных');
  
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    // Чтение SQL файла
    const sqlFilePath = path.join(__dirname, '../db/init.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    logger.info('Выполнение SQL скрипта...');
    await pool.query(sqlScript);
    logger.info('База данных успешно инициализирована');

    // Закрытие соединения с базой данных
    await pool.end();
    logger.info('Соединение с базой данных закрыто');
  } catch (error) {
    logger.error({ err: error }, 'Ошибка при инициализации базы данных');
    throw error;
  }
}

// Запуск инициализации базы данных
initDb().catch(err => {
  logger.fatal({ err }, 'Критическая ошибка при инициализации базы данных');
  process.exit(1);
});

module.exports = initDb; 