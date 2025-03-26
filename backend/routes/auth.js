const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticateUser } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Аутентификация]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone_number
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя
 *               phone_number:
 *                 type: string
 *                 description: Номер телефона пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 description: Дата рождения пользователя
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *       400:
 *         description: Некорректные данные
 *       409:
 *         description: Пользователь с таким номером телефона уже существует
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Аутентификация]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - password
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: Номер телефона пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешный вход
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Неверный номер телефона или пароль
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход пользователя
 *     tags: [Аутентификация]
 *     responses:
 *       200:
 *         description: Успешный выход
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получение информации о текущем пользователе
 *     tags: [Аутентификация]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/me', authenticateUser, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/update:
 *   put:
 *     summary: Обновление информации пользователя
 *     tags: [Аутентификация]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 description: Дата рождения пользователя
 *     responses:
 *       200:
 *         description: Информация обновлена
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/update', authenticateUser, authController.updateUser);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Изменение пароля пользователя
 *     tags: [Аутентификация]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *                 description: Текущий пароль пользователя
 *               new_password:
 *                 type: string
 *                 description: Новый пароль пользователя
 *     responses:
 *       200:
 *         description: Пароль изменен
 *       401:
 *         description: Пользователь не аутентифицирован или неверный текущий пароль
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/change-password', authenticateUser, authController.changePassword);

module.exports = router; 