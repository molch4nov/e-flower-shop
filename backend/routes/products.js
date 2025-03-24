const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API для управления товарами
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required: [name, description, subcategory_id, type]
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Уникальный идентификатор товара
 *         name:
 *           type: string
 *           description: Название товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           format: float
 *           description: Цена товара
 *         purchases_count:
 *           type: integer
 *           description: Количество покупок
 *         rating:
 *           type: number
 *           format: float
 *           description: Рейтинг товара (от 0 до 5)
 *         type:
 *           type: string
 *           enum: [normal, bouquet]
 *           description: Тип товара (обычный товар или букет)
 *         subcategory_id:
 *           type: string
 *           format: uuid
 *           description: ID подкатегории
 *         subcategory_name:
 *           type: string
 *           description: Название подкатегории
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Дата создания
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Дата обновления
 *     BouquetFlower:
 *       type: object
 *       required: [flower_id, quantity]
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID связи
 *         flower_id:
 *           type: string
 *           format: uuid
 *           description: ID цветка
 *         name:
 *           type: string
 *           description: Название цветка
 *         price:
 *           type: number
 *           format: float
 *           description: Цена цветка
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Количество цветков в букете
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить все товары
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /products/subcategory/{subcategoryId}:
 *   get:
 *     summary: Получить товары по подкатегории
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: subcategoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID подкатегории
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/subcategory/:subcategoryId', productController.getProductsBySubcategory);

/**
 * @swagger
 * /products/popular:
 *   get:
 *     summary: Получить популярные товары
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество товаров
 *     responses:
 *       200:
 *         description: Список популярных товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/popular', productController.getPopularProducts);

/**
 * @swagger
 * /products/top-rated:
 *   get:
 *     summary: Получить товары с высоким рейтингом
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество товаров
 *     responses:
 *       200:
 *         description: Список товаров с высоким рейтингом
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/top-rated', productController.getTopRatedProducts);

/**
 * @swagger
 * /products/normal:
 *   post:
 *     summary: Создать обычный товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, subcategory_id]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название товара
 *               description:
 *                 type: string
 *                 description: Описание товара
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Цена товара
 *               subcategory_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID подкатегории
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Неверные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/normal', productController.createNormalProduct);

/**
 * @swagger
 * /products/bouquet:
 *   post:
 *     summary: Создать букет
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, subcategory_id, flowers]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название букета
 *               description:
 *                 type: string
 *                 description: Описание букета
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Цена букета
 *               subcategory_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID подкатегории
 *               flowers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [flower_id, quantity]
 *                   properties:
 *                     flower_id:
 *                       type: string
 *                       format: uuid
 *                       description: ID цветка
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: Количество цветков
 *     responses:
 *       201:
 *         description: Букет успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Неверные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/bouquet', productController.createBouquet);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [type, name, description, price, subcategory_id]
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [normal]
 *                     description: Тип товара
 *                   name:
 *                     type: string
 *                     description: Название товара
 *                   description:
 *                     type: string
 *                     description: Описание товара
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: Цена товара
 *                   subcategory_id:
 *                     type: string
 *                     format: uuid
 *                     description: ID подкатегории
 *               - type: object
 *                 required: [type, name, description, subcategory_id, flowers]
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [bouquet]
 *                     description: Тип товара
 *                   name:
 *                     type: string
 *                     description: Название букета
 *                   description:
 *                     type: string
 *                     description: Описание букета
 *                   subcategory_id:
 *                     type: string
 *                     format: uuid
 *                     description: ID подкатегории
 *                   flowers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required: [flower_id, quantity]
 *                       properties:
 *                         flower_id:
 *                           type: string
 *                           format: uuid
 *                           description: ID цветка
 *                         quantity:
 *                           type: integer
 *                           minimum: 1
 *                           description: Количество цветков
 *     responses:
 *       200:
 *         description: Товар успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Неверные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', productController.deleteProduct);

/**
 * @swagger
 * /products/{id}/purchase:
 *   post:
 *     summary: Увеличить счетчик покупок товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Счетчик покупок увеличен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 purchases_count:
 *                   type: integer
 *                   description: Новое значение счетчика покупок
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/purchase', productController.incrementPurchasesCount);

module.exports = router; 