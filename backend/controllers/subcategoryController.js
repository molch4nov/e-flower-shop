const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const logger = require('pino')({ name: 'subcategory-controller' });

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.getAll();
    res.json(subcategories);
  } catch (error) {
    logger.error(error, 'Ошибка при получении подкатегорий');
    res.status(500).json({ error: 'Ошибка при получении подкатегорий' });
  }
};

exports.getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.getById(id);
    
    if (!subcategory) {
      return res.status(404).json({ error: 'Подкатегория не найдена' });
    }
    
    res.json(subcategory);
  } catch (error) {
    logger.error(error, 'Ошибка при получении подкатегории');
    res.status(500).json({ error: 'Ошибка при получении подкатегории' });
  }
};

exports.getSubcategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // Проверяем, существует ли категория
    const category = await Category.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    const subcategories = await Subcategory.getByCategoryId(categoryId);
    res.json(subcategories);
  } catch (error) {
    logger.error(error, 'Ошибка при получении подкатегорий категории');
    res.status(500).json({ error: 'Ошибка при получении подкатегорий категории' });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { name, category_id } = req.body;
    
    if (!name || !category_id) {
      return res.status(400).json({ error: 'Имя и ID категории обязательны' });
    }
    
    // Проверяем, существует ли категория
    const category = await Category.getById(category_id);
    
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    const newSubcategory = await Subcategory.create(name, category_id);
    res.status(201).json(newSubcategory);
  } catch (error) {
    logger.error(error, 'Ошибка при создании подкатегории');
    res.status(500).json({ error: 'Ошибка при создании подкатегории' });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;
    
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Имя и ID категории обязательны' });
    }
    
    // Проверяем, существует ли категория
    const category = await Category.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    const updatedSubcategory = await Subcategory.update(id, name, categoryId);
    
    if (!updatedSubcategory) {
      return res.status(404).json({ error: 'Подкатегория не найдена' });
    }
    
    res.json(updatedSubcategory);
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении подкатегории');
    res.status(500).json({ error: 'Ошибка при обновлении подкатегории' });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubcategory = await Subcategory.delete(id);
    
    if (!deletedSubcategory) {
      return res.status(404).json({ error: 'Подкатегория не найдена' });
    }
    
    res.json({
      message: 'Подкатегория успешно удалена',
      subcategory: deletedSubcategory
    });
  } catch (error) {
    logger.error(error, 'Ошибка при удалении подкатегории');
    res.status(500).json({ error: 'Ошибка при удалении подкатегории' });
  }
}; 