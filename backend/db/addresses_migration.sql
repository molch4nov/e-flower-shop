-- Миграция для обновления таблицы адресов пользователя
ALTER TABLE user_addresses ADD COLUMN title VARCHAR(255);
ALTER TABLE user_addresses ADD COLUMN street VARCHAR(255);
ALTER TABLE user_addresses ADD COLUMN house VARCHAR(20);
ALTER TABLE user_addresses ADD COLUMN apartment VARCHAR(20);
ALTER TABLE user_addresses ADD COLUMN entrance VARCHAR(20);
ALTER TABLE user_addresses ADD COLUMN floor VARCHAR(20);
ALTER TABLE user_addresses ADD COLUMN is_default BOOLEAN DEFAULT false;
ALTER TABLE user_addresses ADD COLUMN notes TEXT;

-- Обновляем существующие записи
UPDATE user_addresses 
SET title = name,
    street = SPLIT_PART(address, ',', 1),
    house = SPLIT_PART(SPLIT_PART(address, ',', 2), ' ', 2),
    apartment = SPLIT_PART(SPLIT_PART(address, ',', 2), ' ', 3),
    notes = ''
WHERE title IS NULL;

-- Устанавливаем первый адрес как адрес по умолчанию для каждого пользователя
WITH first_addresses AS (
  SELECT id FROM (
    SELECT id, user_id, created_at,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS rn
    FROM user_addresses
  ) t WHERE rn = 1
)
UPDATE user_addresses
SET is_default = true
WHERE id IN (SELECT id FROM first_addresses); 