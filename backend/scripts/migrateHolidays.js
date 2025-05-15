const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const logger = require('../config/logger')('migrate-holidays');

async function migrateHolidays() {
  try {
    // Читаем SQL файл
    const sqlPath = path.join(__dirname, '../db/holidays_migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Выполняем миграцию
    await db.query(sql);
    
    logger.info('Миграция праздников успешно выполнена');
  } catch (error) {
    logger.error(error, 'Ошибка при выполнении миграции праздников');
    process.exit(1);
  } finally {
    // Закрываем соединение с базой данных
    await db.end();
  }
}

// Запускаем миграцию
migrateHolidays(); 