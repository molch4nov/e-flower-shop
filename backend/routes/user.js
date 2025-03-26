const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holiday');
const addressController = require('../controllers/address');
const { authenticateUser } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(authenticateUser);

/**
 * @swagger
 * /api/user/holidays:
 *   get:
 *     summary: Получение всех праздников пользователя
 *     tags: [Пользователь]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список праздников
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/holidays', holidayController.getHolidays);

/**
 * @swagger
 * /api/user/holidays:
 *   post:
 *     summary: Добавление нового праздника
 *     tags: [Пользователь]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название праздника
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Дата праздника
 *     responses:
 *       201:
 *         description: Праздник добавлен
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/holidays', holidayController.addHoliday);

/**
 * @swagger
 * /api/user/holidays/{id}:
 *   put:
 *     summary: Обновление праздника
 *     tags: [Пользователь]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID праздника
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название праздника
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Дата праздника
 *     responses:
 *       200:
 *         description: Праздник обновлен
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Пользователь не аутентифицирован
 *       404:
 *         description: Праздник не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/holidays/:id', holidayController.updateHoliday);

/**
 * @swagger
 * /api/user/holidays/{id}:
 *   delete:
 *     summary: Удаление праздника
 *     tags: [Пользователь]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID праздника
 *     responses:
 *       200:
 *         description: Праздник удален
 *       401:
 *         description: Пользователь не аутентифицирован
 *       404:
 *         description: Праздник не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/holidays/:id', holidayController.deleteHoliday);

/**
 * @swagger
 * /api/user/addresses:
 *   get:
 *     summary: Получение всех адресов пользователя
 *     tags: [Пользователь]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список адресов
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/addresses', addressController.getAddresses);

/**
 * @swagger
 * /api/user/addresses:
 *   post:
 *     summary: Добавление нового адреса
 *     tags: [Пользователь]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название адреса
 *               address:
 *                 type: string
 *                 description: Адрес
 *     responses:
 *       201:
 *         description: Адрес добавлен
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/addresses', addressController.addAddress);

/**
 * @swagger
 * /api/user/addresses/{id}:
 *   put:
 *     summary: Обновление адреса
 *     tags: [Пользователь]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID адреса
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название адреса
 *               address:
 *                 type: string
 *                 description: Адрес
 *     responses:
 *       200:
 *         description: Адрес обновлен
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Пользователь не аутентифицирован
 *       404:
 *         description: Адрес не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/addresses/:id', addressController.updateAddress);

/**
 * @swagger
 * /api/user/addresses/{id}:
 *   delete:
 *     summary: Удаление адреса
 *     tags: [Пользователь]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID адреса
 *     responses:
 *       200:
 *         description: Адрес удален
 *       401:
 *         description: Пользователь не аутентифицирован
 *       404:
 *         description: Адрес не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/addresses/:id', addressController.deleteAddress);

module.exports = router; 