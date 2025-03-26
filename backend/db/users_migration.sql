-- Users, Sessions, and Cart Migration

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(15) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индекса для быстрого поиска пользователей по номеру телефона
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);

-- Создание таблицы сессий
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Создание индекса для быстрого поиска сессий по идентификатору пользователя
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Создание таблицы праздников пользователя
CREATE TABLE IF NOT EXISTS user_holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Создание индекса для быстрого поиска праздников по пользователю
CREATE INDEX IF NOT EXISTS idx_holidays_user ON user_holidays(user_id);

-- Создание таблицы адресов пользователя
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Создание индекса для быстрого поиска адресов по пользователю
CREATE INDEX IF NOT EXISTS idx_addresses_user ON user_addresses(user_id);

-- Создание таблицы корзины пользователя
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Создание индекса для быстрого поиска элементов корзины по пользователю
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_time VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Создание индекса для быстрого поиска заказов по пользователю
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- Создание таблицы элементов заказа
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Создание индекса для быстрого поиска элементов заказа
CREATE INDEX IF NOT EXISTS idx_order_items ON order_items(order_id);

-- Изменение таблицы отзывов для добавления связи с пользователем
ALTER TABLE reviews ADD COLUMN user_id UUID;
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- Обновление существующих отзывов (может быть выполнено отдельно после создания администратора)
-- UPDATE reviews SET user_id = (SELECT id FROM users WHERE name = 'Admin' LIMIT 1); 