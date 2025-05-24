-- Завершение миграции адресов - удаление старых колонок
-- Проверяем, что новые колонки заполнены и можно удалить старые

-- Удаляем старые колонки name и address из таблицы user_addresses
ALTER TABLE user_addresses DROP COLUMN IF EXISTS name;
ALTER TABLE user_addresses DROP COLUMN IF EXISTS address; 