require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger')('init-db');

async function initDb() {
  logger.info('Начало инициализации базы данных');
  
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

  // Функция для попыток подключения
  async function connectWithRetry(maxRetries = 5, delay = 5000) {
    let retries = maxRetries;
    
    while (retries > 0) {
      try {
        const client = await pool.connect();
        logger.info(`Успешное подключение к базе данных ${process.env.POSTGRES_DB} на ${process.env.POSTGRES_HOST}`);
        client.release();
        return true;
      } catch (err) {
        retries -= 1;
        logger.warn(`Не удалось подключиться к базе данных. Осталось попыток: ${retries}`);
        if (retries === 0) {
          logger.error({ err }, 'Не удалось подключиться к базе данных после всех попыток');
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  try {
    // Пытаемся подключиться к базе данных
    await connectWithRetry();
    
    // Чтение SQL файла
    const sqlFilePath = path.join(__dirname, '../db/init.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    logger.info('Выполнение SQL скрипта...');
    await pool.query(sqlScript);
    logger.info('База данных успешно инициализирована');

    // Закрытие соединения с базой данных
    await pool.end();
    logger.info('Соединение с базой данных закрыто');
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Ошибка при инициализации базы данных');
    throw error;
  }
}

// Если файл запущен напрямую, выполняем инициализацию
// if (require.main === module) {
//   initDb().catch(err => {
//     logger.fatal({ err }, 'Критическая ошибка при инициализации базы данных');
//     process.exit(1);
//   });
// }

module.exports = initDb; 