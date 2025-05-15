const db = require('../config/db');
const Review = require('./review');
const File = require('./file');

class Product {
  static async getAll() {
    const query = `
      SELECT p.*, s.name as subcategory_name
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      ORDER BY p.name;
    `;
    
    try {
      const result = await db.query(query);
      const products = result.rows;
      
      // Получение файлов и отзывов для каждого товара
      for (const product of products) {
        product.files = await File.getByParent(product.id, 'product');
        product.reviews = await Review.getByParent(product.id, 'product');
        
        // Для букетов получаем состав
        if (product.type === 'bouquet') {
          product.flowers = await this.getBouquetFlowers(product.id);
        }
      }
      
      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    // Проверка на специальные значения
    if (id === 'popular' || id === 'top-rated') {
      throw new Error(`Невозможно получить товар по ID: '${id}' - используйте специальные методы getPopular или getTopRated`);
    }
    
    const query = `
      SELECT p.*, s.name as subcategory_name
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE p.id = $1;
    `;
    
    try {
      const result = await db.query(query, [id]);
      const product = result.rows[0];
      console.log('product', product);
      
      if (product) {
        // Получение отзывов
        product.reviews = await Review.getByParent(id, 'product');
        // Получение файлов
        product['files'] = await File.getByParent(id, 'product');
        // Для букетов получаем состав
        if (product.type === 'bouquet') {
          product.flowers = await this.getBouquetFlowers(product.id);
        }
      }
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async getBySubcategory(subcategoryId) {
    const query = `
      SELECT p.*, s.name as subcategory_name
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE p.subcategory_id = $1
      ORDER BY p.name;
    `;
    
    try {
      const result = await db.query(query, [subcategoryId]);
      const products = result.rows;
      
      // Получение файлов и отзывов для каждого товара
      for (const product of products) {
        product.files = await File.getByParent(product.id, 'product');
        product.reviews = await Review.getByParent(product.id, 'product');
        
        // Для букетов получаем состав
        if (product.type === 'bouquet') {
          product.flowers = await this.getBouquetFlowers(product.id);
        }
      }
      
      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getBouquetFlowers(bouquetId) {
    const query = `
      SELECT bf.id, bf.quantity, f.id as flower_id, f.name, f.price
      FROM bouquet_flowers bf
      JOIN flowers f ON bf.flower_id = f.id
      WHERE bf.bouquet_id = $1;
    `;
    
    try {
      const result = await db.query(query, [bouquetId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async createNormalProduct(productData) {
    const { name, description, price, subcategory_id } = productData;
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO products (name, description, price, type, subcategory_id)
        VALUES ($1, $2, $3, 'normal', $4)
        RETURNING *;
      `;
      
      const result = await client.query(query, [name, description, price, subcategory_id]);
      const product = result.rows[0];
      
      await client.query('COMMIT');
      return product;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async createBouquet(bouquetData) {
    console.log('Bouquet data:', bouquetData);
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Создаем запись продукта (букета)
      const productQuery = `
        INSERT INTO products (name, description, subcategory_id, type)
        VALUES ($1, $2, $3, 'bouquet')
        RETURNING id, name, description, type, subcategory_id, created_at, updated_at;
      `;
      
      const productResult = await client.query(productQuery, [
        bouquetData.name, 
        bouquetData.description, 
        bouquetData.subcategory_id,
      ]);
      
      const bouquetId = productResult.rows[0].id;
      
      // Добавляем цветы в букет
      for (const flower of bouquetData.flowers) {
        const bouquetFlowerQuery = `
          INSERT INTO bouquet_flowers (bouquet_id, flower_id, quantity)
          VALUES ($1, $2, $3);
        `;
        
        await client.query(bouquetFlowerQuery, [
          bouquetId,
          flower.flower_id,
          flower.quantity
        ]);
      }
      
      // Пересчитываем цену букета, если цена не была передана
      if (!bouquetData.price) {
        await client.query(`
          UPDATE products p
          SET price = (
            SELECT SUM(f.price * bf.quantity)
            FROM bouquet_flowers bf
            JOIN flowers f ON bf.flower_id = f.id
            WHERE bf.bouquet_id = p.id
          )
          WHERE id = $1
        `, [bouquetId]);
      }
      
      // Получаем обновленные данные букета
      const bouquetQuery = `
        SELECT p.*, json_agg(
          json_build_object(
            'id', bf.id,
            'flower_id', f.id, 
            'name', f.name,
            'price', f.price,
            'quantity', bf.quantity
          )
        ) AS flowers
        FROM products p
        LEFT JOIN bouquet_flowers bf ON p.id = bf.bouquet_id
        LEFT JOIN flowers f ON bf.flower_id = f.id
        WHERE p.id = $1
        GROUP BY p.id;
      `;
      
      const bouquetResult = await client.query(bouquetQuery, [bouquetId]);
      
      await client.query('COMMIT');
      return bouquetResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateNormalProduct(id, productData) {
    const { name, description, price, subcategory_id } = productData;
    const query = `
      UPDATE products
      SET name = $1, description = $2, price = $3, subcategory_id = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND type = 'normal'
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [name, description, price, subcategory_id, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateBouquet(id, bouquetData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Обновляем основную информацию о букете
      const bouquetQuery = `
        UPDATE products
        SET name = $1, description = $2, subcategory_id = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4 AND type = 'bouquet'
        RETURNING *;
      `;
      
      const bouquetResult = await client.query(bouquetQuery, [
        bouquetData.name,
        bouquetData.description,
        bouquetData.subcategory_id,
        id
      ]);
      
      if (bouquetResult.rows.length === 0) {
        throw new Error('Букет не найден');
      }
      
      // Удаляем старые связи
      await client.query('DELETE FROM bouquet_flowers WHERE bouquet_id = $1', [id]);
      
      // Добавляем новые цветы в букет
      let totalPrice = 0;
      for (const flowerItem of bouquetData.flowers) {
        const { flower_id, quantity } = flowerItem;
        
        // Получаем цену цветка
        const flowerQuery = `SELECT price FROM flowers WHERE id = $1;`;
        const flowerResult = await client.query(flowerQuery, [flower_id]);
        const flowerPrice = flowerResult.rows[0].price;
        
        // Добавляем связь цветка и букета
        const linkQuery = `
          INSERT INTO bouquet_flowers (bouquet_id, flower_id, quantity)
          VALUES ($1, $2, $3);
        `;
        await client.query(linkQuery, [id, flower_id, quantity]);
        
        totalPrice += flowerPrice * quantity;
      }
      
      // Обновляем цену букета если она не указана в запросе
      if (bouquetData.price) {
        totalPrice = bouquetData.price;
      }
      
      const updatePriceQuery = `
        UPDATE products
        SET price = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
      `;
      
      const updatedResult = await client.query(updatePriceQuery, [totalPrice, id]);
      const updatedBouquet = updatedResult.rows[0];
      
      // Получаем информацию о цветах в букете
      updatedBouquet.flowers = await this.getBouquetFlowers(id);
      
      await client.query('COMMIT');
      return updatedBouquet;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const query = `
      DELETE FROM products
      WHERE id = $1
      RETURNING *;
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateRating(productId) {
    // Обновляем рейтинг товара на основе отзывов
    const query = `
      UPDATE products
      SET rating = (
        SELECT AVG(rating)
        FROM reviews
        WHERE parent_id = $1
      )
      WHERE id = $1
      RETURNING rating;
    `;
    
    try {
      const result = await db.query(query, [productId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async incrementPurchasesCount(productId) {
    const query = `
      UPDATE products
      SET purchases_count = purchases_count + 1
      WHERE id = $1
      RETURNING purchases_count;
    `;
    
    try {
      const result = await db.query(query, [productId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getPopular(limit = 10, offset = 0) {
    const query = `
      SELECT p.*, s.name as subcategory_name
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      ORDER BY p.purchases_count DESC
      LIMIT $1 OFFSET $2;
    `;
    
    try {
      const result = await db.query(query, [limit, offset]);
      const products = result.rows;
      
      // Получение файлов и отзывов для каждого товара
      for (const product of products) {
        product.files = await File.getByParent(product.id, 'product');
        product.reviews = await Review.getByParent(product.id, 'product');
        
        // Для букетов получаем состав
        if (product.type === 'bouquet') {
          product.flowers = await this.getBouquetFlowers(product.id);
        }
      }
      
      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getTopRated(limit = 10, offset = 0) {
    const query = `
      SELECT p.*, s.name as subcategory_name
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      ORDER BY p.rating DESC
      LIMIT $1 OFFSET $2;
    `;
    
    try {
      const result = await db.query(query, [limit, offset]);
      const products = result.rows;
      
      // Получение файлов и отзывов для каждого товара
      for (const product of products) {
        product.files = await File.getByParent(product.id, 'product');
        product.reviews = await Review.getByParent(product.id, 'product');
        
        // Для букетов получаем состав
        if (product.type === 'bouquet') {
          product.flowers = await this.getBouquetFlowers(product.id);
        }
      }
      
      return products;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product; 