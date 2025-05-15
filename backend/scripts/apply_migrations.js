const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function applyMigrations() {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
  });

  const client = await pool.connect();
  
  try {
    console.log('Applying migrations...');
    
    // 1. Add email column to users table
    console.log('1. Adding email column to users table...');
    const addEmailSQL = fs.readFileSync(path.join(__dirname, 'migrations/add_email_to_users.sql'), 'utf8');
    await client.query(addEmailSQL);
    console.log('Email column added successfully!');
    
    // 2. Create user_addresses and user_holidays tables
    console.log('2. Creating user_addresses and user_holidays tables...');
    const createTablesSQL = fs.readFileSync(path.join(__dirname, 'migrations/create_addresses_holidays_tables.sql'), 'utf8');
    await client.query(createTablesSQL);
    console.log('Tables created successfully!');
    
    // 3. Update orders table
    console.log('3. Updating orders table...');
    const updateOrdersSQL = fs.readFileSync(path.join(__dirname, 'migrations/update_orders_table.sql'), 'utf8');
    await client.query(updateOrdersSQL);
    console.log('Orders table updated successfully!');
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Error applying migrations:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

applyMigrations(); 