-- Добавление email в таблицу пользователей
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255); 