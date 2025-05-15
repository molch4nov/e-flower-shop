const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const logger = require('../config/logger')('migration');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'flower_shop',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function migrateAddresses() {
  try {
    const sqlPath = path.join(__dirname, '../db/addresses_migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    logger.info('Миграция адресов успешно выполнена');
  } catch (error) {
    logger.error('Ошибка при выполнении миграции адресов:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrateAddresses(); 