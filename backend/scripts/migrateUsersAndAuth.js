const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});

async function applyMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Применяем миграцию пользователей и аутентификации...');
    
    // Чтение SQL-файла миграции
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../db/users_migration.sql'),
      'utf8'
    );
    
    // Начинаем транзакцию
    await client.query('BEGIN');
    
    // Выполняем SQL-команды миграции
    await client.query(migrationSQL);
    
    // Подтверждаем транзакцию
    await client.query('COMMIT');
    
    console.log('Миграция успешно применена');
    
  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await client.query('ROLLBACK');
    console.error('Ошибка при применении миграции:', error);
    process.exit(1);
  } finally {
    // Освобождаем клиента
    client.release();
    // Закрываем пул соединений
    await pool.end();
  }
}

// Запускаем миграцию
applyMigration(); 