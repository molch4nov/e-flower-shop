-- Включение расширения для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы подкатегорий
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Создание таблицы отзывов
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  parent_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска отзывов по родительскому ID
CREATE INDEX IF NOT EXISTS idx_reviews_parent ON reviews(parent_id);

-- Создание таблицы файлов
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  file BYTEA NOT NULL,
  parent_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска файлов по родительскому ID
CREATE INDEX IF NOT EXISTS idx_files_parent ON files(parent_id);

-- Создание таблицы цветов
CREATE TABLE IF NOT EXISTS flowers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2),
  purchases_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  type VARCHAR(50) NOT NULL, -- 'normal' или 'bouquet'
  subcategory_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
);

-- Создание связующей таблицы для букетов и цветов
CREATE TABLE IF NOT EXISTS bouquet_flowers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bouquet_id UUID NOT NULL,
  flower_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bouquet_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (flower_id) REFERENCES flowers(id) ON DELETE RESTRICT
);

-- Функция для пересчета цены букета
CREATE OR REPLACE FUNCTION recalculate_bouquet_price()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET price = (
    SELECT SUM(f.price * bf.quantity)
    FROM bouquet_flowers bf
    JOIN flowers f ON bf.flower_id = f.id
    WHERE bf.bouquet_id = products.id
  ),
  updated_at = CURRENT_TIMESTAMP
  WHERE id IN (
    SELECT bouquet_id 
    FROM bouquet_flowers 
    WHERE flower_id = NEW.id
  )
  AND type = 'bouquet';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического пересчета цены букетов при изменении цены цветка
CREATE TRIGGER update_bouquet_prices
AFTER UPDATE OF price ON flowers
FOR EACH ROW
EXECUTE FUNCTION recalculate_bouquet_price();

-- Индекс для быстрого поиска товаров по подкатегории
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);

-- Индекс для связи букетов и цветов
CREATE INDEX IF NOT EXISTS idx_bouquet_flowers ON bouquet_flowers(bouquet_id, flower_id); 