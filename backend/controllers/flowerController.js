const Flower = require('../models/flower');
const logger = require('pino')({ name: 'flower-controller' });

exports.getAllFlowers = async (req, res) => {
  try {
    const flowers = await Flower.getAll();
    res.json(flowers);
  } catch (error) {
    logger.error(error, 'Ошибка при получении цветов');
    res.status(500).json({ error: 'Ошибка при получении цветов' });
  }
};

exports.getFlowerById = async (req, res) => {
  try {
    const { id } = req.params;
    const flower = await Flower.getById(id);
    
    if (!flower) {
      return res.status(404).json({ error: 'Цветок не найден' });
    }
    
    res.json(flower);
  } catch (error) {
    logger.error(error, 'Ошибка при получении цветка');
    res.status(500).json({ error: 'Ошибка при получении цветка' });
  }
};

exports.createFlower = async (req, res) => {
  try {
    const { name, price } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Название и цена обязательны' });
    }
    
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: 'Цена должна быть положительным числом' });
    }
    
    const flowerData = { name, price: priceNum };
    const newFlower = await Flower.create(flowerData);
    
    res.status(201).json(newFlower);
  } catch (error) {
    logger.error(error, 'Ошибка при создании цветка');
    res.status(500).json({ error: 'Ошибка при создании цветка' });
  }
};

exports.updateFlower = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Название и цена обязательны' });
    }
    
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: 'Цена должна быть положительным числом' });
    }
    
    const flowerData = { name, price: priceNum };
    const updatedFlower = await Flower.update(id, flowerData);
    
    if (!updatedFlower) {
      return res.status(404).json({ error: 'Цветок не найден' });
    }
    
    res.json(updatedFlower);
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении цветка');
    res.status(500).json({ error: 'Ошибка при обновлении цветка' });
  }
};

exports.deleteFlower = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFlower = await Flower.delete(id);
    
    if (!deletedFlower) {
      return res.status(404).json({ error: 'Цветок не найден' });
    }
    
    res.json({
      message: 'Цветок успешно удален',
      flower: deletedFlower
    });
  } catch (error) {
    logger.error(error, 'Ошибка при удалении цветка');
    
    if (error.code === '23503') {  // Нарушение внешнего ключа
      return res.status(400).json({ 
        error: 'Невозможно удалить цветок, так как он используется в букетах' 
      });
    }
    
    res.status(500).json({ error: 'Ошибка при удалении цветка' });
  }
}; 