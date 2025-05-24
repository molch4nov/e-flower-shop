const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'flower_shop',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
});

async function completeAddressesMigration() {
  try {
    console.log('Начинаем завершающую миграцию адресов...');
    
    const sqlPath = path.join(__dirname, '../db/complete_addresses_migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    console.log('Завершающая миграция адресов успешно выполнена');
  } catch (error) {
    console.error('Ошибка при выполнении завершающей миграции адресов:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Выполняем миграцию
completeAddressesMigration().catch(console.error); 