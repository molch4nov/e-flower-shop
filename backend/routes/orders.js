const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const { authenticateUser, isAdmin } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(authenticateUser);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Получение всех заказов пользователя
 *     tags: [Заказы]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список заказов пользователя
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/', orderController.getUserOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Создание нового заказа
 *     tags: [Заказы]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - delivery_address
 *               - delivery_date
 *               - delivery_time
 *             properties:
 *               delivery_address:
 *                 type: string
 *                 description: Адрес доставки
 *               delivery_date:
 *                 type: string
 *                 format: date
 *                 description: Дата доставки
 *               delivery_time:
 *                 type: string
 *                 description: Время доставки
 *     responses:
 *       201:
 *         description: Заказ создан
 *       400:
 *         description: Некорректные данные или пустая корзина
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Получение информации о заказе пользователя
 *     tags: [Заказы]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Информация о заказе
 *       401:
 *         description: Пользователь не аутентифицирован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Заказ не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/:id', orderController.getUserOrder);

// Маршруты для админа
/**
 * @swagger
 * /orders/admin/all:
 *   get:
 *     summary: Получение всех заказов (для администратора)
 *     tags: [Заказы]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Список всех заказов
 *       401:
 *         description: Пользователь не аутентифицирован
 *       403:
 *         description: Доступ запрещен
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/admin/all', isAdmin, orderController.getAllOrders);

/**
 * @swagger
 * /orders/admin/{id}:
 *   get:
 *     summary: Получение информации о заказе (для администратора)
 *     tags: [Заказы]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Информация о заказе
 *       401:
 *         description: Пользователь не аутентифицирован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Заказ не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/admin/:id', isAdmin, orderController.getOrder);

/**
 * @swagger
 * /orders/admin/{id}/status:
 *   put:
 *     summary: Обновление статуса заказа (для администратора)
 *     tags: [Заказы]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID заказа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, processing, delivering, completed, cancelled]
 *                 description: Новый статус заказа
 *     responses:
 *       200:
 *         description: Статус заказа обновлен
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Пользователь не аутентифицирован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Заказ не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/admin/:id/status', isAdmin, orderController.updateOrderStatus);

module.exports = router; 