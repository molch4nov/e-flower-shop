const Product = require('../models/product');
const logger = require('../config/logger')('product-controller');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    logger.error({ err: error }, 'Ошибка при получении товаров');
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Обработка специальных запросов
    if (id === 'popular') {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const products = await Product.getPopular(limit, offset);
      return res.status(200).json(products);
    }
    
    if (id === 'top-rated') {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const products = await Product.getTopRated(limit, offset);
      return res.json(products);
    }
    
    // Проверка на валидный UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Недопустимый ID товара. ID должен быть в формате UUID.' });
    }
    
    // Стандартная обработка - получение товара по ID
    if (id !== 'popular' && id !== 'top-rated') {
      const product = await Product.getById(id);

      if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
      }
      return res.status(200).json(product);
    }
  } catch (error) {
    console.log(error, 'its error')
    logger.error(error, 'Ошибка при получении товара');
    res.status(500).json({ error: 'Ошибка при получении товара' });
  }
};

exports.getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const products = await Product.getBySubcategory(subcategoryId);
    res.json(products);
  } catch (error) {
    logger.error(error, 'Ошибка при получении товаров по подкатегории');
    res.status(500).json({ error: 'Ошибка при получении товаров по подкатегории' });
  }
};

exports.createNormalProduct = async (req, res) => {
  try {
    const { name, description, price, subcategory_id } = req.body;
    
    if (!name || !description || price === undefined || !subcategory_id) {
      return res.status(400).json({ 
        error: 'Название, описание, цена и ID подкатегории обязательны' 
      });
    }
    
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: 'Цена должна быть положительным числом' });
    }
    
    const productData = { 
      name, 
      description, 
      price: priceNum, 
      subcategory_id 
    };
    
    const newProduct = await Product.createNormalProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    logger.error(error, 'Ошибка при создании товара');
    res.status(500).json({ error: 'Ошибка при создании товара' });
  }
};

exports.createBouquet = async (req, res) => {
  try {
    const { name, description, subcategory_id, flowers, price } = req.body;
    
    if (!name || !description || !subcategory_id || !flowers || !Array.isArray(flowers) || flowers.length === 0) {
      return res.status(400).json({ 
        error: 'Название, описание, ID подкатегории и массив цветов обязательны' 
      });
    }
    
    for (const flowerItem of flowers) {
      if (!flowerItem.flower_id || !flowerItem.quantity || flowerItem.quantity <= 0) {
        return res.status(400).json({ 
          error: 'Каждый цветок должен иметь flower_id и положительное количество quantity' 
        });
      }
    }
    
    const bouquetData = { 
      name, 
      description, 
      subcategory_id,
      flowers,
      price
    };
    
    const newBouquet = await Product.createBouquet(bouquetData);
    res.status(201).json(newBouquet);
  } catch (error) {
    logger.error(error, 'Ошибка при создании букета');
    res.status(500).json({ error: 'Ошибка при создании букета' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Тип товара обязателен' });
    }
    
    let updatedProduct;
    
    if (type === 'normal') {
      const { name, description, price, subcategory_id } = req.body;
      
      if (!name || !description || price === undefined || !subcategory_id) {
        return res.status(400).json({ 
          error: 'Название, описание, цена и ID подкатегории обязательны' 
        });
      }
      
      const priceNum = Number(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: 'Цена должна быть положительным числом' });
      }
      
      const productData = { 
        name, 
        description, 
        price: priceNum, 
        subcategory_id 
      };
      
      updatedProduct = await Product.updateNormalProduct(id, productData);
    } else if (type === 'bouquet') {
      const { name, description, subcategory_id, flowers, price } = req.body;
      
      if (!name || !description || !subcategory_id || !flowers || !Array.isArray(flowers) || flowers.length === 0) {
        return res.status(400).json({ 
          error: 'Название, описание, ID подкатегории и массив цветов обязательны' 
        });
      }
      
      for (const flowerItem of flowers) {
        if (!flowerItem.flower_id || !flowerItem.quantity || flowerItem.quantity <= 0) {
          return res.status(400).json({ 
            error: 'Каждый цветок должен иметь flower_id и положительное количество quantity' 
          });
        }
      }
      
      const bouquetData = { 
        name, 
        description, 
        subcategory_id,
        flowers,
        price
      };
      
      updatedProduct = await Product.updateBouquet(id, bouquetData);
    } else {
      return res.status(400).json({ error: 'Недопустимый тип товара. Допустимые значения: normal, bouquet' });
    }
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении товара');
    res.status(500).json({ error: 'Ошибка при обновлении товара' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.delete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json({
      message: 'Товар успешно удален',
      product: deletedProduct
    });
  } catch (error) {
    logger.error(error, 'Ошибка при удалении товара');
    res.status(500).json({ error: 'Ошибка при удалении товара' });
  }
};

exports.incrementPurchasesCount = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.incrementPurchasesCount(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(result);
  } catch (error) {
    logger.error(error, 'Ошибка при увеличении счетчика покупок');
    res.status(500).json({ error: 'Ошибка при увеличении счетчика покупок' });
  }
}; 