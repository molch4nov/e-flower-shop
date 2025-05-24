# Backend Info: Структура проекта E-Flower Shop

## 1. Общая информация о проекте

**Название проекта:** E-Flower Shop Backend API  
**Версия:** 1.0.0  
**Описание:** REST API сервер для интернет-магазина цветов и букетов  
**Основной файл:** index.js  
**Порт по умолчанию:** 3000  

## 2. Технологический стек

### 2.1 Основные технологии
- **Платформа:** Node.js (версия 18+)
- **Фреймворк:** Express.js v4.18.2
- **База данных:** PostgreSQL (v13+)
- **Язык:** JavaScript (ES6+)
- **Менеджер процессов:** PM2

### 2.2 Ключевые зависимости
```json
{
  "bcrypt": "^5.1.1",           // Хеширование паролей
  "cookie-parser": "^1.4.7",   // Парсинг cookies
  "cors": "^2.8.5",            // Управление CORS
  "dotenv": "^16.3.1",         // Переменные окружения
  "express": "^4.18.2",        // Веб-фреймворк
  "express-rate-limit": "^7.5.0", // Ограничение запросов
  "helmet": "^7.0.0",          // Безопасность HTTP
  "multer": "^1.4.5-lts.1",    // Загрузка файлов
  "pg": "^8.11.3",             // PostgreSQL драйвер
  "pino": "^8.15.1",           // Логирование
  "swagger-jsdoc": "^6.2.8",   // Генерация Swagger
  "swagger-ui-express": "^5.0.0", // UI для Swagger
  "uuid": "^9.0.0"             // Генерация UUID
}
```

## 3. Архитектура проекта

### 3.1 Структура директорий
```
backend/
├── admin/                    # Панель администратора (отдельное React приложение)
│   ├── src/                  # Исходный код админ панели
│   ├── build/                # Собранное приложение
│   ├── package.json          # Зависимости админ панели
│   └── vite.config.js        # Конфигурация Vite
├── config/                   # Конфигурационные файлы
│   ├── db.js                 # Конфигурация PostgreSQL
│   ├── swagger.js            # Конфигурация Swagger документации
│   └── logger.js             # Конфигурация логирования (Pino)
├── controllers/              # Контроллеры (бизнес-логика)
│   ├── auth.js               # Аутентификация и авторизация
│   ├── userController.js     # Управление пользователями
│   ├── productController.js  # Управление товарами
│   ├── categoryController.js # Управление категориями
│   ├── subcategoryController.js # Управление подкатегориями
│   ├── flowerController.js   # Управление цветами
│   ├── reviewController.js   # Управление отзывами
│   ├── cart.js               # Управление корзиной
│   ├── order.js              # Управление заказами
│   ├── fileController.js     # Управление файлами
│   ├── admin.js              # Административные функции
│   ├── holiday.js            # Управление праздниками
│   └── address.js            # Управление адресами
├── db/                       # SQL схемы и миграции
│   ├── init.sql              # Основная схема БД
│   ├── users_migration.sql   # Миграция пользователей
│   ├── admin_migration.sql   # Миграция админ функций
│   ├── sessions_migration.sql # Миграция сессий
│   ├── holidays_migration.sql # Миграция праздников
│   ├── addresses_migration.sql # Миграция адресов
│   └── complete_addresses_migration.sql
├── logs/                     # Логи приложения
├── middleware/               # Промежуточные обработчики
│   ├── auth.js               # Middleware аутентификации
│   └── rateLimiter.js        # Ограничение скорости запросов
├── models/                   # Модели данных (ORM-like)
│   ├── user.js               # Модель пользователя
│   ├── product.js            # Модель товара
│   ├── category.js           # Модель категории
│   ├── subcategory.js        # Модель подкатегории
│   ├── flower.js             # Модель цветка
│   ├── review.js             # Модель отзыва
│   ├── cart.js               # Модель корзины
│   ├── order.js              # Модель заказа
│   └── file.js               # Модель файла
├── public/                   # Статические файлы
├── routes/                   # Маршруты API
│   ├── index.js              # Основные маршруты
│   ├── auth.js               # Маршруты аутентификации
│   ├── user.js               # Маршруты пользователей
│   ├── products.js           # Маршруты товаров
│   ├── categories.js         # Маршруты категорий
│   ├── flowers.js            # Маршруты цветов
│   ├── reviews.js            # Маршруты отзывов
│   ├── cart.js               # Маршруты корзины
│   ├── orders.js             # Маршруты заказов
│   ├── files.js              # Маршруты файлов
│   └── admin.js              # Административные маршруты
├── scripts/                  # Скрипты инициализации и миграций
│   ├── initDb.js             # Инициализация базы данных
│   ├── migrateUsersAndAuth.js # Миграция пользователей
│   ├── migrateAdmin.js       # Миграция админ функций
│   ├── migrateHolidays.js    # Миграция праздников
│   ├── migrateAddresses.js   # Миграция адресов
│   ├── apply_migrations.js   # Применение миграций
│   ├── buildAdmin.js         # Сборка админ панели
│   └── initAdminPanel.js     # Инициализация админ панели
├── node_modules/             # Зависимости
├── index.js                  # Основная точка входа
├── server.js                 # Альтернативная точка входа
├── package.json              # Метаданные и зависимости
├── package-lock.json         # Версии зависимостей
├── Dockerfile                # Docker контейнер
├── docker-compose.yml        # Docker композиция
├── ecosystem.config.js       # Конфигурация PM2
├── .dockerignore             # Исключения для Docker
├── .gitignore                # Исключения для Git
├── README.md                 # Документация
├── documentation.md          # Подробная документация
├── DEPLOY.md                 # Инструкции по развертыванию
└── kursovaya_rabota.md       # Материалы курсовой работы
```

### 3.2 Паттерн архитектуры
Проект использует **MVC (Model-View-Controller)** архитектуру:
- **Models** (`/models/`) - работа с данными и бизнес-логика
- **Views** - JSON ответы API (без отдельных файлов)
- **Controllers** (`/controllers/`) - обработка HTTP запросов
- **Routes** (`/routes/`) - маршрутизация запросов

## 4. База данных (PostgreSQL)

### 4.1 Основные таблицы

#### 4.1.1 Пользователи и аутентификация
```sql
-- Пользователи
users (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  password_hash VARCHAR(255),
  birth_date DATE,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Сессии пользователей
sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  expires_at TIMESTAMP,
  user_role VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Адреса пользователей
user_addresses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  address TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Праздники пользователей
user_holidays (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 4.1.2 Товары и категории
```sql
-- Категории
categories (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Подкатегории
subcategories (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Цветы (для букетов)
flowers (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10, 2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Товары
products (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  purchases_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  type VARCHAR(50), -- 'normal' или 'bouquet'
  subcategory_id UUID REFERENCES subcategories(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Связь букетов и цветов
bouquet_flowers (
  id UUID PRIMARY KEY,
  bouquet_id UUID REFERENCES products(id),
  flower_id UUID REFERENCES flowers(id),
  quantity INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 4.1.3 Торговые операции
```sql
-- Корзина
cart_items (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Заказы
orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total_amount DECIMAL(10, 2),
  status VARCHAR(50),
  delivery_address TEXT,
  delivery_date DATE,
  delivery_time TIME,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Элементы заказа
order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  price DECIMAL(10, 2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### 4.1.4 Контент и файлы
```sql
-- Отзывы
reviews (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  parent_id UUID, -- ID товара
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Файлы и изображения
files (
  id UUID PRIMARY KEY,
  filename VARCHAR(255),
  mimetype VARCHAR(100),
  file BYTEA,
  parent_id UUID, -- ID связанной сущности
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### 4.2 Индексы и оптимизация
```sql
-- Индексы для быстрого поиска
CREATE INDEX idx_reviews_parent ON reviews(parent_id);
CREATE INDEX idx_files_parent ON files(parent_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_bouquet_flowers ON bouquet_flowers(bouquet_id, flower_id);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
```

### 4.3 Триггеры и функции
```sql
-- Автоматический пересчет цены букетов
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

CREATE TRIGGER update_bouquet_prices
AFTER UPDATE OF price ON flowers
FOR EACH ROW
EXECUTE FUNCTION recalculate_bouquet_price();
```

## 5. API Эндпоинты

### 5.1 Аутентификация (`/api/auth`)
- `POST /register` - Регистрация пользователя
- `POST /login` - Вход в систему
- `POST /logout` - Выход из системы
- `GET /me` - Получение информации о текущем пользователе

### 5.2 Пользователи (`/api/user`)
- `GET /profile` - Получение профиля пользователя
- `PUT /profile` - Обновление профиля
- `GET /addresses` - Получение адресов пользователя
- `POST /addresses` - Добавление нового адреса
- `PUT /addresses/:id` - Обновление адреса
- `DELETE /addresses/:id` - Удаление адреса
- `GET /holidays` - Получение праздников пользователя
- `POST /holidays` - Добавление праздника
- `PUT /holidays/:id` - Обновление праздника
- `DELETE /holidays/:id` - Удаление праздника

### 5.3 Категории (`/api/categories`)
- `GET /` - Получение всех категорий
- `GET /:id` - Получение категории по ID
- `GET /:id/subcategories` - Получение подкатегорий
- `POST /` - Создание новой категории (admin)
- `PUT /:id` - Обновление категории (admin)
- `DELETE /:id` - Удаление категории (admin)

### 5.4 Товары (`/api/products`)
- `GET /` - Получение списка товаров с фильтрацией
- `GET /:id` - Получение товара по ID
- `GET /subcategory/:subcategoryId` - Товары по подкатегории
- `GET /popular` - Популярные товары
- `GET /top-rated` - Товары с высоким рейтингом
- `POST /` - Создание товара (admin)
- `PUT /:id` - Обновление товара (admin)
- `DELETE /:id` - Удаление товара (admin)

### 5.5 Цветы (`/api/flowers`)
- `GET /` - Получение всех цветов
- `GET /:id` - Получение цветка по ID
- `POST /` - Создание цветка (admin)
- `PUT /:id` - Обновление цветка (admin)
- `DELETE /:id` - Удаление цветка (admin)

### 5.6 Корзина (`/api/cart`)
- `GET /` - Получение содержимого корзины
- `POST /` - Добавление товара в корзину
- `PUT /:id` - Обновление количества товара
- `DELETE /:id` - Удаление товара из корзины
- `DELETE /clear` - Очистка корзины

### 5.7 Заказы (`/api/orders`)
- `GET /` - Получение истории заказов пользователя
- `GET /:id` - Получение детальной информации о заказе
- `POST /` - Создание нового заказа
- `PUT /:id/status` - Обновление статуса заказа (admin)

### 5.8 Отзывы (`/api/reviews`)
- `GET /product/:productId` - Отзывы о товаре
- `POST /` - Создание отзыва
- `PUT /:id` - Обновление отзыва
- `DELETE /:id` - Удаление отзыва

### 5.9 Файлы (`/api/files`)
- `POST /upload` - Загрузка файла
- `GET /:id` - Получение файла по ID
- `DELETE /:id` - Удаление файла

### 5.10 Администрирование (`/api/admin`)
- `GET /users` - Получение списка пользователей
- `GET /statistics` - Статистика системы
- `GET /orders` - Все заказы в системе
- `PUT /orders/:id/status` - Изменение статуса заказа

## 6. Модели данных

### 6.1 Структура моделей
Каждая модель реализует стандартные CRUD операции:
- `getById(id)` - получение по ID
- `getAll(options)` - получение списка с опциями
- `create(data)` - создание новой записи
- `update(id, data)` - обновление записи
- `delete(id)` - удаление записи

### 6.2 Особенности реализации
- Все модели используют статические методы
- Поддержка транзакций через `getClient()`
- Автоматическое логирование всех запросов
- Валидация данных на уровне модели
- Обработка ошибок с детальным логированием

## 7. Безопасность

### 7.1 Аутентификация
- **Тип:** Session-based с cookies
- **Хеширование паролей:** bcrypt (10 rounds)
- **Сессии:** UUID с автоматическим истечением (24 часа)
- **Роли:** user, admin

### 7.2 Авторизация
```javascript
// Middleware для проверки аутентификации
const requireAuth = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(401).json({ message: 'Требуется аутентификация' });
  }
  
  const session = await User.getSessionById(sessionId);
  if (!session) {
    return res.status(401).json({ message: 'Недействительная сессия' });
  }
  
  req.user = session;
  next();
};

// Middleware для проверки роли администратора
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Недостаточно прав' });
  }
  next();
};
```

### 7.3 Защита от атак
- **CORS:** Настроенные разрешенные домены
- **Helmet:** Безопасные HTTP заголовки
- **Rate Limiting:** Ограничение запросов в минуту
- **SQL Injection:** Параметризованные запросы
- **XSS:** Валидация и очистка входных данных

## 8. Логирование и мониторинг

### 8.1 Система логирования (Pino)
```javascript
// Уровни логирования
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  }
});

// Типы логов
logger.info('Информационное сообщение');
logger.warn('Предупреждение');
logger.error('Ошибка');
logger.fatal('Критическая ошибка');
logger.debug('Отладочная информация');
```

### 8.2 Мониторинг производительности
- Логирование времени выполнения запросов
- Мониторинг использования памяти
- Отслеживание количества активных соединений
- Периодическая очистка истекших сессий

## 9. Развертывание

### 9.1 Docker контейнеризация
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
  
  postgres:
    image: postgres:13-alpine
    environment:
      POSTGRES_DB: flower_shop
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### 9.2 PM2 конфигурация
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'flower-shop-api',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

### 9.3 Скрипты управления
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "init-db": "node scripts/initDb.js",
    "build": "npm ci --production && npm run init-db",
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop ecosystem.config.js",
    "pm2:restart": "pm2 restart ecosystem.config.js",
    "pm2:prod": "NODE_ENV=production npm run pm2:start"
  }
}
```

## 10. Административная панель

### 10.1 Технологии админ панели
- **Фреймворк:** React + Vite
- **Стилизация:** Tailwind CSS
- **Сборка:** Vite bundler
- **Размещение:** `/admin` endpoint

### 10.2 Функционал админ панели
- Управление пользователями
- Управление товарами и категориями
- Просмотр и управление заказами
- Аналитика и статистика
- Управление контентом

## 11. Дополнительные функции

### 11.1 Система букетов
- Автоматический расчет цены букета
- Управление составом букета
- Связь многие-ко-многим между букетами и цветами

### 11.2 Персонализация
- Сохранение адресов доставки
- Календарь праздников пользователя
- История заказов и предпочтений

### 11.3 Система отзывов
- Рейтинговая система (1-5 звезд)
- Загрузка изображений к отзывам
- Модерация отзывов

## 12. Производительность

### 12.1 Оптимизация БД
- Индексы для часто используемых запросов
- Пагинация для больших выборок
- Кэширование популярных товаров

### 12.2 Кэширование
- In-memory кэширование категорий
- Кэширование сессий пользователей
- Статические файлы с заголовками кэширования

## 13. Тестирование и отладка

### 13.1 Инструменты разработки
- **Swagger UI:** `/api-docs` - интерактивная документация API
- **Логирование:** Детальные логи всех операций
- **Error Handling:** Централизованная обработка ошибок

### 13.2 Валидация данных
- Валидация входных параметров на уровне маршрутов
- Проверка типов данных в моделях
- Санитизация пользовательского ввода

## 14. Заключение

Проект представляет собой современный, масштабируемый REST API сервер для интернет-магазина цветов с полным набором функций:

**Основные достоинства архитектуры:**
- Четкое разделение ответственности (MVC)
- Модульная структура кода
- Комплексная система безопасности
- Подробное логирование и мониторинг
- Контейнеризация и автоматизация развертывания
- Интерактивная API документация

**Масштабируемость:**
- Поддержка кластеризации через PM2
- Оптимизированные запросы к БД
- Система кэширования
- Модульная архитектура для легкого расширения

Проект готов для использования в продакшене и может служить основой для дальнейшего развития функционала интернет-магазина. 