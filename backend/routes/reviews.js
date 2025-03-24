const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API для управления отзывами
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required: [title, description, rating, parent_id]
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Уникальный идентификатор отзыва
 *         title:
 *           type: string
 *           description: Заголовок отзыва
 *         description:
 *           type: string
 *           description: Описание отзыва
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Рейтинг (от 1 до 5)
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: ID родительской сущности
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Дата создания
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Дата обновления
 *         files:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FileInfo'
 *           description: Список прикрепленных файлов к отзыву
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Получить все отзывы
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Список отзывов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', reviewController.getAllReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Получить отзыв по ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID отзыва
 *     responses:
 *       200:
 *         description: Отзыв
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Отзыв не найден
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
router.get('/:id', reviewController.getReviewById);

/**
 * @swagger
 * /reviews/parent/{parent_id}:
 *   get:
 *     summary: Получить отзывы по родительской сущности
 *     description: Возвращает все отзывы, прикрепленные к указанной сущности
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: parent_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID родительской сущности
 *     responses:
 *       200:
 *         description: Список отзывов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/parent/:parent_id', reviewController.getReviewsByParent);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Создать новый отзыв
 *     description: Создает новый отзыв, прикрепленный к указанной сущности
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, rating, parent_id, parent_type]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Заголовок отзыва
 *               description:
 *                 type: string
 *                 description: Описание отзыва
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Рейтинг (от 1 до 5)
 *               parent_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID родительской сущности
 *               parent_type:
 *                 type: string
 *                 description: Тип родительской сущности (category, subcategory и т.д.)
 *     responses:
 *       201:
 *         description: Отзыв создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
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
router.post('/', reviewController.createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Обновить отзыв
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID отзыва
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, rating, parent_id, parent_type]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Заголовок отзыва
 *               description:
 *                 type: string
 *                 description: Описание отзыва
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Рейтинг (от 1 до 5)
 *               parent_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID родительской сущности
 *     responses:
 *       200:
 *         description: Отзыв обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Неверные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Отзыв не найден
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
router.put('/:id', reviewController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Удалить отзыв
 *     description: Удаляет отзыв и все прикрепленные к нему файлы
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID отзыва
 *     responses:
 *       200:
 *         description: Отзыв удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Отзыв не найден
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
router.delete('/:id', reviewController.deleteReview);

module.exports = router; 