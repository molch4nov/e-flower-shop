require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger')('setup-admin');

// Check if .env file exists
if (!fs.existsSync(path.join(__dirname, '../../.env'))) {
  logger.error('No .env file found. Please create one based on .env.example');
  process.exit(1);
}

logger.info('🚀 Starting admin setup process...');

try {
  // Step 1: Run user and auth migration
  logger.info('Step 1: Running users and authentication migration...');
  execSync('node backend/scripts/migrateUsersAndAuth.js', { stdio: 'inherit' });
  logger.info('✅ Users and authentication migration complete!');

  // Step 2: Run admin migration
  logger.info('Step 2: Running admin migration...');
  execSync('node backend/scripts/migrateAdmin.js', { stdio: 'inherit' });
  logger.info('✅ Admin migration complete!');

  // Step 3: Install required dependencies for admin panel
  logger.info('Step 3: Installing required dependencies for admin panel...');
  
  // Check if admin directory exists
  const adminDir = path.join(__dirname, '../admin');
  if (fs.existsSync(adminDir)) {
    logger.info('Installing dependencies for admin panel...');
    try {
      execSync('cd backend/admin && npm install @headlessui/react', { stdio: 'inherit' });
      logger.info('✅ Admin panel dependencies installed!');
    } catch (error) {
      logger.warn('Warning: Failed to install admin panel dependencies. You may need to install them manually.');
      logger.warn('Run the following command: cd backend/admin && npm install @headlessui/react');
    }
  } else {
    logger.warn('Warning: Admin directory not found. Skipping dependency installation.');
  }

  // Success message
  logger.info(`
🎉 Admin setup complete! 

Admin panel is now available at http://localhost:${process.env.PORT || 3000}/admin
  
Login credentials:
- Username: admin
- Password: abacaba

Start the server with:
- Development: npm run dev
- Production: npm start

Notes:
- If you encounter dependency issues in the admin panel, manually install them with:
  cd backend/admin && npm install @headlessui/react

Have a nice day! 🌸
  `);
} catch (error) {
  logger.error(`Setup failed: ${error.message}`);
  process.exit(1);
} 