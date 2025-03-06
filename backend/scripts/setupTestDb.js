/**
 * Скрипт для создания тестовой базы данных
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupTestDb() {
  // Подключение к postgres для создания тестовой БД
  const pgPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    // Сначала удаляем БД, если она существует
    await pgPool.query(`
      DROP DATABASE IF EXISTS flower_shop_test
    `);
    
    // Создаем новую тестовую БД
    await pgPool.query(`
      CREATE DATABASE flower_shop_test
    `);
    
    console.log('Тестовая база данных создана');
    await pgPool.end();
    
    // Подключаемся к тестовой базе и выполняем скрипт инициализации
    const testPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: 'flower_shop_test',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    
    // Чтение SQL файла
    const sqlScript = fs.readFileSync(path.join(__dirname, '../db/init.sql'), 'utf8');
    
    // Выполнение SQL скрипта
    await testPool.query(sqlScript);
    
    console.log('Структура тестовой базы данных создана');
    await testPool.end();
    
  } catch (error) {
    console.error('Ошибка при настройке тестовой базы данных:', error);
    throw error;
  } finally {
    await pgPool.end().catch(console.error);
  }
}

setupTestDb().catch(err => {
  console.error('Критическая ошибка:', err);
  process.exit(1);
}); 