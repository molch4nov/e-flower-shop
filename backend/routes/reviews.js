const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalAuthUser, authenticateUser } = require('../middleware/auth');

// Применяем опциональную аутентификацию для всех маршрутов
// Это позволит использовать информацию о пользователе, если он авторизован
router.use(optionalAuthUser);

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
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: ID пользователя, оставившего отзыв
 *         user_name:
 *           type: string
 *           description: Имя пользователя, оставившего отзыв
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
 * /reviews/user/{user_id}:
 *   get:
 *     summary: Получить отзывы пользователя
 *     description: Возвращает все отзывы, созданные указанным пользователем
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Список отзывов пользователя
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
router.get('/user/:user_id', reviewController.getReviewsByUser);

/**
 * @swagger
 * /reviews/my:
 *   get:
 *     summary: Получить отзывы текущего пользователя
 *     description: Возвращает все отзывы, созданные текущим авторизованным пользователем
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список отзывов пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: Пользователь не аутентифицирован
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
router.get('/my', authenticateUser, reviewController.getReviewsByUser);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Создать новый отзыв
 *     description: Создает новый отзыв, прикрепленный к указанной сущности
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, rating, parent_id]
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
 *       401:
 *         description: Пользователь не аутентифицирован (если требуется)
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateUser, reviewController.createReview);

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
 *             required: [title, description, rating, parent_id]
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
 *       403:
 *         description: Нет доступа для редактирования
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
 *       403:
 *         description: Нет доступа для удаления
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