# Frontend Info: Структура проекта E-Flower Shop

## 1. Общая информация о проекте

**Название проекта:** E-Flower Shop Frontend  
**Версия:** 0.0.0  
**Описание:** Клиентское веб-приложение для интернет-магазина цветов и букетов  
**Основной файл:** src/main.tsx  
**Порт разработки:** 5173 (Vite)  
**Прокси API:** http://localhost:3000  

## 2. Технологический стек

### 2.1 Основные технологии
- **Фреймворк:** React 18.3.1
- **Язык:** TypeScript 5.6.3
- **Сборщик:** Vite 5.2.0
- **Маршрутизация:** React Router DOM 6.23.0
- **UI Библиотека:** HeroUI (NextUI fork) v2.7.8
- **Стилизация:** Tailwind CSS 3.4.16
- **Анимации:** Framer Motion 11.15.0

### 2.2 Ключевые зависимости
```json
{
  "@heroui/react": "^2.7.8",         // UI компоненты
  "@iconify/react": "^6.0.0",        // Иконки
  "react": "18.3.1",                 // Основной фреймворк
  "react-dom": "18.3.1",             // DOM рендеринг
  "react-router-dom": "6.23.0",      // Маршрутизация
  "framer-motion": "11.15.0",        // Анимации
  "tailwindcss": "3.4.16",           // CSS фреймворк
  "tailwind-variants": "0.3.0",      // Варианты стилей
  "js-cookie": "^3.0.5",             // Работа с cookies
  "clsx": "2.1.1"                    // Условные CSS классы
}
```

### 2.3 DevDependencies
```json
{
  "@vitejs/plugin-react": "4.4.1",   // Vite плагин для React
  "@types/react": "18.3.3",          // TypeScript типы
  "@types/react-dom": "18.3.0",      // TypeScript типы
  "typescript": "5.6.3",             // TypeScript компилятор
  "eslint": "9.25.1",                // Линтер
  "prettier": "3.5.3",               // Форматтер кода
  "autoprefixer": "10.4.21",         // PostCSS плагин
  "postcss": "8.5.3"                 // CSS обработчик
}
```

## 3. Архитектура проекта

### 3.1 Структура директорий
```
frontend/
├── public/                         # Статические файлы
│   └── favicon.ico
├── src/                           # Исходный код приложения
│   ├── components/                # Переиспользуемые компоненты
│   │   ├── navbar.tsx             # Навигационная панель
│   │   ├── CategoryDrawer.tsx     # Боковое меню категорий
│   │   ├── ReviewForm.tsx         # Форма отзывов
│   │   ├── PrivateRoute.tsx       # Защищенные маршруты
│   │   ├── theme-switch.tsx       # Переключатель темы
│   │   ├── icons.tsx              # SVG иконки
│   │   └── primitives.ts          # CSS утилиты
│   ├── config/                    # Конфигурационные файлы
│   │   ├── api.ts                 # API клиент
│   │   └── site.ts                # Настройки сайта
│   ├── layouts/                   # Макеты страниц
│   │   └── default.tsx            # Основной макет с header/footer
│   ├── modules/                   # Модульные компоненты
│   │   ├── product-list-grid/     # Сетка товаров
│   │   │   ├── index.tsx
│   │   │   ├── products-grid.tsx
│   │   │   ├── products-list-item.tsx
│   │   │   ├── rating-radio-group.tsx
│   │   │   ├── rating-radio-item.tsx
│   │   │   ├── products.ts
│   │   │   └── components/
│   │   └── base-line-products/    # Базовые компоненты товаров
│   ├── pages/                     # Страницы приложения
│   │   ├── index.tsx              # Главная страница
│   │   ├── AboutPage.tsx          # О компании
│   │   ├── ContactsPage.tsx       # Контакты
│   │   ├── DeliveryPage.tsx       # Доставка
│   │   ├── LoginPage.tsx          # Вход
│   │   ├── RegisterPage.tsx       # Регистрация
│   │   ├── CatalogPage.tsx        # Каталог категорий
│   │   ├── AllProductsCatalogPage.tsx  # Все товары
│   │   ├── ProductCatalogPage.tsx # Товары категории
│   │   ├── ProductDetailPage.tsx  # Детали товара
│   │   ├── CartPage.tsx           # Корзина
│   │   ├── CheckoutPage.tsx       # Оформление заказа
│   │   ├── ProfilePage.tsx        # Профиль пользователя
│   │   ├── OrdersPage.tsx         # История заказов
│   │   └── OrderDetailPage.tsx    # Детали заказа
│   ├── providers/                 # React Context провайдеры
│   │   ├── AuthProvider.tsx       # Аутентификация
│   │   └── CartProvider.tsx       # Корзина покупок
│   ├── styles/                    # Стили
│   │   └── globals.css            # Глобальные стили
│   ├── types/                     # TypeScript типы
│   │   ├── auth.ts                # Типы аутентификации
│   │   └── index.ts               # Экспорт типов
│   ├── App.tsx                    # Основной компонент
│   ├── main.tsx                   # Точка входа
│   ├── provider.tsx               # HeroUI провайдер
│   └── vite-env.d.ts              # Vite типы
├── index.html                     # HTML шаблон
├── package.json                   # Метаданные и зависимости
├── package-lock.json              # Версии зависимостей
├── vite.config.ts                 # Конфигурация Vite
├── tsconfig.json                  # Конфигурация TypeScript
├── tsconfig.node.json             # TypeScript для Node.js
├── tailwind.config.js             # Конфигурация Tailwind CSS
├── postcss.config.js              # Конфигурация PostCSS
├── eslint.config.mjs              # Конфигурация ESLint
├── .npmrc                         # Настройки npm
├── .gitignore                     # Исключения для Git
├── vercel.json                    # Конфигурация для Vercel
├── README.md                      # Документация
└── LICENSE                        # Лицензия
```

### 3.2 Архитектурные паттерны

#### 3.2.1 Component-Based Architecture
Приложение построено на основе компонентной архитектуры React:
- **Атомарные компоненты** - кнопки, иконки, инпуты
- **Молекулярные компоненты** - формы, карточки товаров
- **Организмы** - навбар, списки товаров, секции страниц
- **Шаблоны** - layouts для страниц
- **Страницы** - полные экраны приложения

#### 3.2.2 Context API Pattern
Используется для глобального состояния:
- `AuthProvider` - управление аутентификацией
- `CartProvider` - управление корзиной покупок
- `HeroUIProvider` - настройки UI библиотеки

#### 3.2.3 Custom Hooks Pattern
Извлечение логики в переиспользуемые хуки:
- `useAuth()` - работа с аутентификацией
- `useCart()` - работа с корзиной

## 4. Маршрутизация (React Router)

### 4.1 Структура маршрутов
```typescript
// Публичные маршруты
"/catalog"              // Каталог категорий
"/catalog/all"          // Все товары
"/catalog/:id"          // Товары категории
"/product/:id"          // Детали товара
"/about"                // О компании
"/delivery"             // Доставка
"/contacts"             // Контакты
"/login"                // Вход
"/register"             // Регистрация

// Защищенные маршруты (требуют аутентификации)
"/profile"              // Профиль пользователя
"/orders"               // История заказов
"/orders/:id"           // Детали заказа
"/checkout"             // Оформление заказа

// Полузащищенные маршруты
"/cart"                 // Корзина (доступна всем, но функционал ограничен)

// Редирект
"*" → "/catalog"        // Редирект на каталог для несуществующих страниц
```

### 4.2 Защищенные маршруты
Компонент `PrivateRoute` проверяет аутентификацию:
```typescript
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Загрузка...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

## 5. Система управления состоянием

### 5.1 AuthProvider (Аутентификация)

#### Состояние:
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  holidays: Holiday[];
  addresses: Address[];
}
```

#### Методы:
- `login(credentials)` - вход в систему
- `register(credentials)` - регистрация
- `logout()` - выход из системы
- `getCurrentUser()` - получение данных текущего пользователя
- `clearError()` - очистка ошибок

#### Типы ошибок:
```typescript
enum AuthErrorType {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  MISSING_CREDENTIALS = 'MISSING_CREDENTIALS',
  USER_EXISTS = 'USER_EXISTS',
  INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  AUTH_ERROR = 'AUTH_ERROR'
}
```

### 5.2 CartProvider (Корзина)

#### Состояние:
```typescript
interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}
```

#### Методы:
- `addToCart(productId, quantity)` - добавление товара
- `updateQuantity(itemId, quantity)` - изменение количества
- `removeItem(productId)` - удаление товара
- `clearCart()` - очистка корзины
- `refreshCart()` - обновление корзины
- `isProductInCart(productId)` - проверка наличия товара
- `getProductQuantity(productId)` - получение количества товара

## 6. API Интеграция

### 6.1 API Клиент (src/config/api.ts)

#### Основные методы:
```typescript
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => Promise<T>,
  post: <T>(endpoint: string, data?: any, options?: FetchOptions) => Promise<T>,
  put: <T>(endpoint: string, data?: any, options?: FetchOptions) => Promise<T>,
  delete: <T>(endpoint: string, options?: FetchOptions) => Promise<T>,
  upload: <T>(endpoint: string, formData: FormData, options?: FetchOptions) => Promise<T>
}
```

#### Особенности:
- Автоматическое добавление авторизации (Bearer token)
- Поддержка cookies (`credentials: 'include'`)
- Централизованная обработка ошибок
- Автоматическое парсирование JSON
- Поддержка загрузки файлов (FormData)

### 6.2 Проксирование API запросов

#### Vite конфигурация:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

#### Базовый URL:
```typescript
const API_URL = 'http://localhost:3000/api';
```

## 7. UI Компоненты и стилизация

### 7.1 HeroUI (UI Библиотека)
Основные компоненты:
- `Navbar` - навигационная панель
- `Button` - кнопки разных стилей
- `Input` - поля ввода
- `Card` - карточки
- `Modal` - модальные окна
- `Badge` - значки уведомлений
- `Dropdown` - выпадающие меню
- `Switch` - переключатели

### 7.2 Tailwind CSS
Конфигурация включает:
- HeroUI плагин
- Поддержка темной темы (`darkMode: "class"`)
- Кастомные пути контента для компонентов

### 7.3 Framer Motion
Используется для:
- Анимации переходов между страницами
- Анимации появления элементов
- Интерактивные анимации кнопок и карточек

### 7.4 Адаптивный дизайн
Breakpoints:
- `sm:` - от 640px
- `md:` - от 768px
- `lg:` - от 1024px
- `xl:` - от 1280px

## 8. Основные страницы и функциональность

### 8.1 Публичные страницы

#### 8.1.1 Главная страница (`/`)
- Отображает placeholder контент
- Ссылки на документацию и GitHub
- Использует `DefaultLayout`

#### 8.1.2 Каталог (`/catalog`)
- Отображение категорий товаров
- Интеграция с `CategoryDrawer`
- Навигация по категориям

#### 8.1.3 Все товары (`/catalog/all`)
- Список всех товаров с пагинацией
- Сортировка и фильтрация
- Infinite scroll загрузка
- Поиск товаров

#### 8.1.4 Товары категории (`/catalog/:id`)
- Товары конкретной подкатегории
- Фильтрация и сортировка
- Пагинация

#### 8.1.5 Детали товара (`/product/:id`)
- Полная информация о товаре
- Галерея изображений
- Секция отзывов
- Добавление в корзину
- Отображение состава букетов

#### 8.1.6 Информационные страницы
- `/about` - О компании
- `/delivery` - Условия доставки
- `/contacts` - Контактная информация

### 8.2 Аутентификация

#### 8.2.1 Вход (`/login`)
- Форма входа по номеру телефона и паролю
- Валидация полей
- Обработка ошибок
- Автоматический редирект после входа

#### 8.2.2 Регистрация (`/register`)
- Форма регистрации с обязательными полями
- Валидация номера телефона
- Проверка паролей
- Обработка ошибок существующих пользователей

### 8.3 Защищенные страницы

#### 8.3.1 Профиль пользователя (`/profile`)
Функциональность:
- Просмотр и редактирование профиля
- Управление адресами доставки
- Управление праздниками
- История заказов

Секции:
```typescript
// Основная информация
- Имя, телефон, email, дата рождения
- Редактирование профиля

// Адреса доставки
- Список адресов
- Добавление/редактирование/удаление
- Установка адреса по умолчанию

// Праздники
- Список важных дат
- Добавление/редактирование/удаление

// История заказов
- Последние заказы с кратким описанием
```

#### 8.3.2 История заказов (`/orders`)
- Список всех заказов пользователя
- Фильтрация по статусу
- Детальная информация о каждом заказе
- Переход к деталям заказа

#### 8.3.3 Детали заказа (`/orders/:id`)
- Полная информация о заказе
- Список товаров с изображениями
- Адрес доставки
- Дата и время доставки
- Статус заказа

#### 8.3.4 Оформление заказа (`/checkout`)
Многошаговая форма:
1. **Подтверждение состава** - список товаров из корзины
2. **Выбор адреса** - существующий или новый адрес
3. **Дата и время доставки** - календарь и временные слоты
4. **Подтверждение заказа** - итоговая информация

### 8.4 Корзина (`/cart`)
Функциональность:
- Просмотр добавленных товаров
- Изменение количества (+/- кнопки)
- Удаление товаров
- Расчет общей стоимости
- Переход к оформлению заказа
- Очистка корзины

## 9. Компоненты

### 9.1 Навигация

#### 9.1.1 Navbar (`components/navbar.tsx`)
Особенности:
- Адаптивный дизайн (desktop/mobile)
- Логотип с переходом на главную
- Кнопка категорий
- Навигационные ссылки
- Корзина с badge счетчиком
- Профиль пользователя
- Переключатель темы

#### 9.1.2 CategoryDrawer (`components/CategoryDrawer.tsx`)
- Боковая панель с категориями
- Анимированное появление
- Закрытие по клику вне области
- Кнопка закрытия

### 9.2 Формы и взаимодействие

#### 9.2.1 ReviewForm (`components/ReviewForm.tsx`)
- Форма добавления отзыва
- Рейтинг звездочками
- Загрузка изображений
- Валидация полей
- Интеграция с API

#### 9.2.2 PrivateRoute (`components/PrivateRoute.tsx`)
- Проверка аутентификации
- Редирект на страницу входа
- Индикатор загрузки

### 9.3 Модули товаров

#### 9.3.1 Product List Grid (`modules/product-list-grid/`)
Компоненты:
- `products-grid.tsx` - сетка товаров
- `products-list-item.tsx` - карточка товара
- `rating-radio-group.tsx` - группа рейтинга
- `rating-radio-item.tsx` - элемент рейтинга
- `products.ts` - типы и данные товаров

## 10. TypeScript типизация

### 10.1 Основные типы

#### Пользователь:
```typescript
interface User {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  birth_date: string | null;
  role: 'user' | 'admin';
}
```

#### Адрес:
```typescript
interface Address {
  id: number;
  title: string;
  street: string;
  house: string;
  apartment: string;
  entrance?: string;
  floor?: string;
  is_default: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

#### Праздник:
```typescript
interface Holiday {
  id: number;
  name: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

#### Товар корзины:
```typescript
interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: string;
  quantity: number;
  image_url: string;
}
```

### 10.2 TypeScript конфигурация

#### Основные настройки:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 11. Сборка и развертывание

### 11.1 Vite конфигурация
```typescript
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

### 11.2 Скрипты сборки
```json
{
  "scripts": {
    "dev": "vite",                    // Запуск dev сервера
    "build": "tsc && vite build",     // Сборка для продакшена
    "lint": "eslint --fix",           // Линтинг и исправление
    "preview": "vite preview"         // Предпросмотр сборки
  }
}
```

### 11.3 Vercel развертывание
Файл `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 12. Качество кода

### 12.1 ESLint конфигурация
Настроенные правила:
- React hooks правила
- TypeScript правила
- Accessibility правила
- Import/export правила
- Prettier интеграция

### 12.2 Prettier
- Автоматическое форматирование кода
- Единообразный стиль
- Интеграция с ESLint

## 13. Производительность

### 13.1 Оптимизации
- **Code Splitting** - автоматическое через Vite
- **Tree Shaking** - удаление неиспользуемого кода
- **Bundle Size** - оптимизация размера бандла
- **Image Optimization** - ленивая загрузка изображений

### 13.2 React оптимизации
- `useCallback` для функций
- `useMemo` для вычислений
- `React.memo` для компонентов
- Ленивая загрузка компонентов

## 14. Безопасность

### 14.1 Аутентификация
- Session-based с cookies
- Автоматическое добавление авторизации к запросам
- Защищенные маршруты
- Проверка сессий

### 14.2 Защита от XSS
- Автоматическое экранирование React
- Валидация пользовательского ввода
- Санитизация данных

### 14.3 CSRF защита
- Включение credentials в запросы
- Проверка origin заголовков
- Использование secure cookies

## 15. Мобильная адаптация

### 15.1 Responsive Design
- Mobile-first подход
- Адаптивная навигация
- Мобильные меню
- Touch-friendly интерфейсы

### 15.2 Адаптивные компоненты
- Navbar с мобильным меню
- Адаптивные сетки товаров
- Мобильные формы
- Touch жесты

## 16. Особенности UX

### 16.1 Индикаторы состояния
- Loading спиннеры
- Skeleton загрузка
- Уведомления об ошибках
- Индикаторы прогресса

### 16.2 Интерактивность
- Hover эффекты
- Анимации переходов
- Feedback на действия пользователя
- Плавные переходы между страницами

## 17. Интеграция с Backend

### 17.1 API эндпоинты
Используемые эндпоинты:
- `/api/auth/*` - аутентификация
- `/api/user/*` - профиль пользователя
- `/api/products/*` - товары
- `/api/categories/*` - категории
- `/api/cart/*` - корзина
- `/api/orders/*` - заказы
- `/api/reviews/*` - отзывы
- `/api/files/*` - файлы

### 17.2 Обработка ошибок
- Централизованная обработка в API клиенте
- Пользовательские сообщения об ошибках
- Retry логика для сетевых ошибок
- Graceful degradation

## 18. Заключение

Проект представляет собой современное React приложение с TypeScript, построенное по лучшим практикам:

**Основные достоинства архитектуры:**
- Модульная компонентная структура
- Строгая типизация TypeScript
- Централизованное управление состоянием
- Адаптивный дизайн
- Современные инструменты разработки
- Качественная UX/UI

**Технические особенности:**
- Использование современного React 18
- HeroUI для консистентного дизайна
- Vite для быстрой разработки
- Tailwind CSS для эффективной стилизации
- Framer Motion для плавных анимаций

**Масштабируемость:**
- Модульная архитектура
- Переиспользуемые компоненты
- Централизованный API клиент
- Типизация для предотвращения ошибок

Приложение готово для продакшен использования и может служить основой для дальнейшего развития функционала интернет-магазина. 