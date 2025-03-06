const express = require('express');
const router = express.Router();
const db = require('../config/db');
const categoryRoutes = require('./categories');
const reviewRoutes = require('./reviews');
const fileRoutes = require('./files');
const flowerRoutes = require('./flowers');
const productRoutes = require('./products');
const path = require('path');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Проверка соединения
 *     description: Проверка соединения с сервером и базой данных
 *     responses:
 *       200:
 *         description: Соединение установлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 dbStatus:
 *                   type: string
 *       500:
 *         description: Ошибка соединения с базой данных
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT 1');
    res.json({
      message: 'API работает',
      dbStatus: 'Соединение с базой данных установлено'
    });
  } catch (error) {
    console.error('Ошибка соединения с базой данных:', error);
    res.status(500).json({
      error: 'Ошибка соединения с базой данных'
    });
  }
});

/**
 * @swagger
 * /test-db:
 *   get:
 *     summary: Проверить подключение к базе данных
 *     responses:
 *       200:
 *         description: Подключение работает
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Подключение к базе данных работает!
 *                 time:
 *                   type: object
 *       500:
 *         description: Ошибка подключения к базе данных
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      message: 'Подключение к базе данных работает!',
      time: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка запроса к базе данных:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Подключение маршрутов категорий
router.use('/categories', categoryRoutes);

// Подключение маршрутов отзывов
router.use('/reviews', reviewRoutes);

// Подключение маршрутов файлов
router.use('/files', fileRoutes);

// Подключение маршрутов цветов
router.use('/flowers', flowerRoutes);

// Подключение маршрутов товаров
router.use('/products', productRoutes);

// Обслуживание admin-панели
router.use('/admin', express.static(path.join(__dirname, '../public/admin')));
router.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

module.exports = router; 