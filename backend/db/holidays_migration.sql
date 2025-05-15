-- Добавление колонки notes в таблицу user_holidays
ALTER TABLE user_holidays ADD COLUMN IF NOT EXISTS notes TEXT;

-- Обновление существующих записей
UPDATE user_holidays SET notes = '' WHERE notes IS NULL; 