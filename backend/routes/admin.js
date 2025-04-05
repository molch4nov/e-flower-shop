const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { authenticateUser, isAdmin } = require('../middleware/auth');

// Все маршруты требуют аутентификации и прав администратора
// router.use(authenticateUser);
router.use(isAdmin);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Получение списка всех пользователей
 *     tags: [Администрирование]
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
 *         description: Список пользователей
 *       401:
 *         description: Пользователь не аутентифицирован
 *       403:
 *         description: Доступ запрещен
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Получение информации о конкретном пользователе
 *     tags: [Администрирование]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *       401:
 *         description: Пользователь не аутентифицирован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/users/:id', adminController.getUserDetails);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   put:
 *     summary: Обновление роли пользователя
 *     tags: [Администрирование]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: Новая роль пользователя
 *     responses:
 *       200:
 *         description: Роль пользователя обновлена
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Пользователь не аутентифицирован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/users/:id/role', adminController.updateUserRole);

/**
 * @swagger
 * /admin/active-users:
 *   get:
 *     summary: Получение списка активных пользователей
 *     tags: [Администрирование]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: minutes
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Период активности в минутах (от 5 до 1440)
 *     responses:
 *       200:
 *         description: Список активных пользователей
 *       401:
 *         description: Пользователь не аутентифицирован
 *       403:
 *         description: Доступ запрещен
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/active-users', adminController.getActiveUsers);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Получение статистики для панели администратора
 *     tags: [Администрирование]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Статистика для панели администратора
 *       401:
 *         description: Пользователь не аутентифицирован
 *       403:
 *         description: Доступ запрещен
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;