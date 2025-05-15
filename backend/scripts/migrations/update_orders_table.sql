-- Добавляем необходимые столбцы в таблицу заказов
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100) DEFAULT 'Оплата при получении';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- Обновляем статусы заказов чтобы соответствовать фронтенду
UPDATE orders SET status = 'pending' WHERE status = 'new';
UPDATE orders SET status = 'shipped' WHERE status = 'delivering';
UPDATE orders SET status = 'delivered' WHERE status = 'completed';

-- Генерируем номера заказов для существующих заказов
UPDATE orders SET order_number = CONCAT(EXTRACT(EPOCH FROM created_at)::TEXT, '-', id::TEXT) WHERE order_number IS NULL; 