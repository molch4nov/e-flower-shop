const express = require('express');
const router = express.Router();
const flowerController = require('../controllers/flowerController');

/**
 * @swagger
 * tags:
 *   name: Flowers
 *   description: API для управления цветами
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Flower:
 *       type: object
 *       required: [name, price]
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Уникальный идентификатор цветка
 *         name:
 *           type: string
 *           description: Название цветка
 *         price:
 *           type: number
 *           format: float
 *           description: Цена цветка
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Дата создания
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Дата обновления
 */

/**
 * @swagger
 * /flowers:
 *   get:
 *     summary: Получить все цветы
 *     tags: [Flowers]
 *     responses:
 *       200:
 *         description: Список цветов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flower'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', flowerController.getAllFlowers);

/**
 * @swagger
 * /flowers/{id}:
 *   get:
 *     summary: Получить цветок по ID
 *     tags: [Flowers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID цветка
 *     responses:
 *       200:
 *         description: Данные цветка
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flower'
 *       404:
 *         description: Цветок не найден
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
router.get('/:id', flowerController.getFlowerById);

/**
 * @swagger
 * /flowers:
 *   post:
 *     summary: Создать новый цветок
 *     tags: [Flowers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название цветка
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Цена цветка
 *     responses:
 *       201:
 *         description: Цветок успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flower'
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
router.post('/', flowerController.createFlower);

/**
 * @swagger
 * /flowers/{id}:
 *   put:
 *     summary: Обновить цветок
 *     description: Обновление данных цветка. При изменении цены автоматически пересчитываются цены всех букетов, в которых используется этот цветок.
 *     tags: [Flowers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID цветка
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название цветка
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Цена цветка
 *     responses:
 *       200:
 *         description: Цветок успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flower'
 *       400:
 *         description: Неверные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Цветок не найден
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
router.put('/:id', flowerController.updateFlower);

/**
 * @swagger
 * /flowers/{id}:
 *   delete:
 *     summary: Удалить цветок
 *     description: Удаляет цветок. Невозможно удалить цветок, если он используется в букетах.
 *     tags: [Flowers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID цветка
 *     responses:
 *       200:
 *         description: Цветок удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 flower:
 *                   $ref: '#/components/schemas/Flower'
 *       400:
 *         description: Невозможно удалить цветок, так как он используется в букетах
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Цветок не найден
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
router.delete('/:id', flowerController.deleteFlower);

module.exports = router; 