const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const { authenticateUser } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(authenticateUser);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Получение содержимого корзины пользователя
 *     tags: [Корзина]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Содержимое корзины
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Добавление товара в корзину
 *     tags: [Корзина]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID товара
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 description: Количество товара
 *     responses:
 *       201:
 *         description: Товар добавлен в корзину
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Пользователь не аутентифицирован
 *       404:
 *         description: Товар не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/', cartController.addToCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Обновление количества товара в корзине
 *     tags: [Корзина]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID элемента корзины
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Новое количество товара (0 для удаления)
 *     responses:
 *       200:
 *         description: Количество товара обновлено или товар удален
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Пользователь не аутентифицирован
 *       404:
 *         description: Товар в корзине не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/:id', cartController.updateCartItem);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Удаление товара из корзины
 *     tags: [Корзина]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID элемента корзины
 *     responses:
 *       200:
 *         description: Товар удален из корзины
 *       401:
 *         description: Пользователь не аутентифицирован
 *       404:
 *         description: Товар в корзине не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/:id', cartController.removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Очистка корзины
 *     tags: [Корзина]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Корзина очищена
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/clear', cartController.clearCart);

module.exports = router; 