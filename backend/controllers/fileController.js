const File = require('../models/file');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('pino')({ name: 'file-controller' });

// Настройка хранилища для multer
const storage = multer.memoryStorage();

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла. Разрешены только изображения (JPEG, PNG, GIF)'), false);
  }
};

// Настройка загрузки
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Ограничение размера файла: 5MB
  },
  fileFilter: fileFilter
});

exports.uploadMiddleware = upload.single('file');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const { parent_id } = req.body;
    
    if (!parent_id) {
      return res.status(400).json({ error: 'parent_id обязателен' });
    }

    console.log('req.file', req.file);
    console.log('req.body', req.body);

    const fileData = {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      file: req.file.buffer,
      parent_id
    };

    const savedFile = await File.create(fileData);
    res.status(201).json({
      id: savedFile.id,
      filename: savedFile.filename,
      mimetype: savedFile.mimetype,
      parent_id: savedFile.parent_id,
      created_at: savedFile.created_at,
      updated_at: savedFile.updated_at
    });
  } catch (error) {
    logger.error(error, 'Ошибка при загрузке файла');
    res.status(500).json({ error: 'Ошибка при загрузке файла' });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.getById(id);

    if (!file) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    res.set('Content-Type', file.mimetype);
    
    // Для изображений используем inline для отображения в браузере
    if (file.mimetype.startsWith('image/')) {
      res.set('Content-Disposition', `inline; filename="${encodeURIComponent(file.filename)}"`);
    } else {
      res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(file.filename)}"`);
    }
    
    return res.send(file.file);
  } catch (error) {
    logger.error(error, 'Ошибка при получении файла');
    res.status(500).json({ error: 'Ошибка при получении файла' });
  }
};

exports.getFileInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.getById(id);

    if (!file) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    const fileInfo = {
      id: file.id,
      filename: file.filename,
      mimetype: file.mimetype,
      parent_id: file.parent_id,
      created_at: file.created_at,
      updated_at: file.updated_at
    };

    res.json(fileInfo);
  } catch (error) {
    logger.error(error, 'Ошибка при получении информации о файле');
    res.status(500).json({ error: 'Ошибка при получении информации о файле' });
  }
};

exports.getFilesByParent = async (req, res) => {
  try {
    const { parent_id } = req.params;
    const files = await File.getByParent(parent_id);
    res.json(files);
  } catch (error) {
    logger.error(error, 'Ошибка при получении файлов');
    res.status(500).json({ error: 'Ошибка при получении файлов' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFile = await File.delete(id);

    if (!deletedFile) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    res.json({
      message: 'Файл успешно удален',
      file: {
        id: deletedFile.id,
        filename: deletedFile.filename,
        parent_id: deletedFile.parent_id
      }
    });
  } catch (error) {
    logger.error(error, 'Ошибка при удалении файла');
    res.status(500).json({ error: 'Ошибка при удалении файла' });
  }
}; 