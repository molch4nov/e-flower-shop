const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API цветочного магазина',
      version: '1.0.0',
      description: 'API для управления категориями, товарами, отзывами, пользователями и заказами',
    },
    servers: [
      {
        url: '/api',
        description: 'API сервер',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sessionId',
          description: 'Аутентификация через cookie. Используйте маршрут /auth/login для получения cookie сессии'
        }
      },
      schemas: {
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор категории',
            },
            name: {
              type: 'string',
              description: 'Название категории',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
            subcategories: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Subcategory',
              },
              description: 'Список подкатегорий',
            },
          },
        },
        Subcategory: {
          type: 'object',
          required: ['name', 'category_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор подкатегории',
            },
            name: {
              type: 'string',
              description: 'Название подкатегории',
            },
            category_id: {
              type: 'string',
              format: 'uuid',
              description: 'Идентификатор родительской категории',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
            category: {
              $ref: '#/components/schemas/CategorySimple',
              description: 'Родительская категория',
            },
          },
        },
        CategorySimple: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор категории',
            },
            name: {
              type: 'string',
              description: 'Название категории',
            },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'phone_number'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор пользователя',
            },
            name: {
              type: 'string',
              description: 'Имя пользователя',
            },
            phone_number: {
              type: 'string',
              description: 'Номер телефона пользователя',
            },
            birth_date: {
              type: 'string',
              format: 'date',
              description: 'Дата рождения',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
          },
        },
        Holiday: {
          type: 'object',
          required: ['name', 'date'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор праздника',
            },
            name: {
              type: 'string',
              description: 'Название праздника',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Дата праздника',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
          },
        },
        Address: {
          type: 'object',
          required: ['name', 'address'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор адреса',
            },
            name: {
              type: 'string',
              description: 'Название адреса',
            },
            address: {
              type: 'string',
              description: 'Адрес доставки',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор элемента корзины',
            },
            product_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID товара',
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              description: 'Количество товара',
            },
            product_name: {
              type: 'string',
              description: 'Название товара',
            },
            product_price: {
              type: 'number',
              format: 'float',
              description: 'Цена товара',
            },
            product_type: {
              type: 'string',
              enum: ['normal', 'bouquet'],
              description: 'Тип товара',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
          },
        },
        Order: {
          type: 'object',
          required: ['delivery_address', 'delivery_date', 'delivery_time'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор заказа',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID пользователя',
            },
            total_price: {
              type: 'number',
              format: 'float',
              description: 'Общая стоимость заказа',
            },
            delivery_address: {
              type: 'string',
              description: 'Адрес доставки',
            },
            delivery_date: {
              type: 'string',
              format: 'date',
              description: 'Дата доставки',
            },
            delivery_time: {
              type: 'string',
              description: 'Время доставки',
            },
            status: {
              type: 'string',
              enum: ['new', 'processing', 'delivering', 'completed', 'cancelled'],
              description: 'Статус заказа',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem',
              },
              description: 'Товары в заказе',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор элемента заказа',
            },
            order_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID заказа',
            },
            product_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID товара',
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              description: 'Количество товара',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Цена товара',
            },
            product_name: {
              type: 'string',
              description: 'Название товара',
            },
            product_type: {
              type: 'string',
              enum: ['normal', 'bouquet'],
              description: 'Тип товара',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
          },
        },
        Review: {
          type: 'object',
          required: ['title', 'description', 'rating'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор отзыва',
            },
            title: {
              type: 'string',
              description: 'Заголовок отзыва',
            },
            description: {
              type: 'string',
              description: 'Полное описание отзыва',
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Рейтинг от 1 до 5',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID пользователя, оставившего отзыв',
            },
            user_name: {
              type: 'string',
              description: 'Имя пользователя, оставившего отзыв',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
            files: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/FileInfo',
              },
              description: 'Список прикрепленных файлов',
            },
          },
        },
        File: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор файла',
            },
            filename: {
              type: 'string',
              description: 'Имя файла',
            },
            mimetype: {
              type: 'string',
              description: 'MIME-тип файла',
            },
            file: {
              type: 'string',
              format: 'binary',
              description: 'Содержимое файла',
            },
            parent_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID родительской сущности',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
          },
        },
        FileInfo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор файла',
            },
            filename: {
              type: 'string',
              description: 'Имя файла',
            },
            mimetype: {
              type: 'string',
              description: 'MIME-тип файла',
            },
            parent_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID родительской сущности (отзыва, категории и т.д.)',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Сообщение об ошибке',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Путь к файлам с маршрутами
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs }; 