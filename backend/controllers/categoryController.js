const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const logger = require('pino')({ name: 'category-controller' });

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    logger.error(error, 'Ошибка при получении категорий');
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);
    
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    res.json(category);
  } catch (error) {
    logger.error(error, 'Ошибка при получении категории');
    res.status(500).json({ error: 'Ошибка при получении категории' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Имя категории обязательно' });
    }
    
    const newCategory = await Category.create(name);
    res.status(201).json(newCategory);
  } catch (error) {
    logger.error(error, 'Ошибка при создании категории');
    res.status(500).json({ error: 'Ошибка при создании категории' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Имя категории обязательно' });
    }
    
    const updatedCategory = await Category.update(id, name);
    
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    res.json(updatedCategory);
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении категории');
    res.status(500).json({ error: 'Ошибка при обновлении категории' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.delete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    res.json({
      message: 'Категория успешно удалена',
      category: deletedCategory
    });
  } catch (error) {
    logger.error(error, 'Ошибка при удалении категории');
    res.status(500).json({ error: 'Ошибка при удалении категории' });
  }
}; 