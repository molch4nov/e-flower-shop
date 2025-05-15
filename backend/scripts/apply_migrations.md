# Инструкции по применению миграций

Для применения всех миграций и обновления базы данных выполните следующие SQL-скрипты в указанном порядке:

1. Добавление email в таблицу пользователей:
```sql
-- scripts/migrations/add_email_to_users.sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
```

2. Создание таблиц адресов и праздников пользователя:
```sql
-- scripts/migrations/create_addresses_holidays_tables.sql
CREATE TABLE IF NOT EXISTS user_addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  street VARCHAR(255) NOT NULL,
  house VARCHAR(50) NOT NULL,
  apartment VARCHAR(50) NOT NULL,
  entrance VARCHAR(50),
  floor VARCHAR(50),
  is_default BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_holidays (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Обновление таблицы заказов:
```sql
-- scripts/migrations/update_orders_table.sql
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
```

## Добавление новых маршрутов

Проверьте, что в файле `server.js` добавлены следующие маршруты:

```javascript
// Регистрируем маршруты
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/flowers', flowerRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
```

## Перезапуск сервера

После применения всех миграций не забудьте перезапустить сервер:

```bash
npm run dev
```

или

```bash
pm2 restart all
``` 