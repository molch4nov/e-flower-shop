require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

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
    console.log('Applying admin migration...');
    
    // Reading the migration SQL file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../db/admin_migration.sql'),
      'utf8'
    );
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Execute the migration SQL commands
    await client.query(migrationSQL);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Admin migration successfully applied');
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error applying admin migration:', error);
    process.exit(1);
  } finally {
    // Release client
    client.release();
    // Close connection pool
    await pool.end();
  }
}

applyMigration();