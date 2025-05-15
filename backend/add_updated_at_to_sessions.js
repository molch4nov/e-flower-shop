const db = require('./config/db');
const logger = require('./config/logger')('db-migration');

async function addUpdatedAtToSessions() {
  try {
    // Добавление поля updated_at в таблицу sessions
    await db.query(`
      ALTER TABLE sessions 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `);
    logger.info('Поле updated_at успешно добавлено в таблицу sessions');
    
    // Проверяем, существует ли уже функция update_modified_column
    const functionExists = await db.query(`
      SELECT 1 FROM pg_proc 
      WHERE proname = 'update_modified_column';
    `);
    
    if (functionExists.rowCount === 0) {
      // Создание триггерной функции, если она не существует
      await db.query(`
        CREATE OR REPLACE FUNCTION update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
      logger.info('Триггерная функция update_modified_column успешно создана');
    } else {
      logger.info('Триггерная функция update_modified_column уже существует');
    }
    
    // Удаляем старый триггер, если он существует
    await db.query(`
      DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
    `);
    
    // Создаем триггер для автоматического обновления поля updated_at
    await db.query(`
      CREATE TRIGGER update_sessions_updated_at
      BEFORE UPDATE ON sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_modified_column();
    `);
    
    logger.info('Триггер update_sessions_updated_at успешно создан');
    logger.info('Миграция завершена успешно');
    
    // Закрываем соединение с базой данных
    await db.pool.end();
    
  } catch (error) {
    logger.error(error, 'Ошибка при выполнении миграции');
    console.error('Ошибка при выполнении миграции:', error);
    process.exit(1);
  }
}

// Запускаем миграцию
addUpdatedAtToSessions(); 