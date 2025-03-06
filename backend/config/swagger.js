const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API категорий и подкатегорий',
      version: '1.0.0',
      description: 'API для управления категориями и подкатегориями',
    },
    servers: [
      {
        url: '/api',
        description: 'API сервер',
      },
    ],
    components: {
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
            parent_type: {
              type: 'string',
              description: 'Тип родительской сущности (например, review)',
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
            parent_type: {
              type: 'string',
              description: 'Тип родительской сущности (review, category, subcategory и т.д.)',
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