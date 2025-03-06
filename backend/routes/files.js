const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: API для управления файлами
 */

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Загрузить новый файл
 *     description: Загружает файл и прикрепляет его к указанной сущности (отзыву, категории и т.д.)
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, parent_id, parent_type]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Файл (до 5MB)
 *               parent_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID родительской сущности (отзыва, категории и т.д.)
 *               parent_type:
 *                 type: string
 *                 description: Тип родительской сущности (review, category, subcategory и т.д.)
 *     responses:
 *       201:
 *         description: Файл успешно загружен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileInfo'
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
router.post('/', fileController.uploadMiddleware, fileController.uploadFile);

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Получить файл по ID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID файла
 *     responses:
 *       200:
 *         description: Файл
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Файл не найден
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
router.get('/:id', fileController.getFileById);

/**
 * @swagger
 * /files/{id}/info:
 *   get:
 *     summary: Получить информацию о файле
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID файла
 *     responses:
 *       200:
 *         description: Информация о файле
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileInfo'
 *       404:
 *         description: Файл не найден
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
router.get('/:id/info', fileController.getFileInfo);

/**
 * @swagger
 * /files/parent/{parent_id}:
 *   get:
 *     summary: Получить файлы по родительской сущности
 *     description: Возвращает все файлы, прикрепленные к указанной сущности
 *     tags: [Files]
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
 *         description: Список файлов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FileInfo'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/parent/:parent_id', fileController.getFilesByParent);

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: Удалить файл
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID файла
 *     responses:
 *       200:
 *         description: Файл удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     filename:
 *                       type: string
 *                     parent_id:
 *                       type: string
 *                       format: uuid
 *                     parent_type:
 *                       type: string
 *       404:
 *         description: Файл не найден
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
router.delete('/:id', fileController.deleteFile);

module.exports = router; 