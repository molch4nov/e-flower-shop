import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productsApi, categoriesApi, flowersApi } from '../../services/api';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    type: 'normal',
    subcategory_id: ''
  });
  const [bouquetFlowers, setBouquetFlowers] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [selectedFlower, setSelectedFlower] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = !!id;
  const isBouquet = product.type === 'bouquet';

  useEffect(() => {
    fetchSubcategories();
    fetchFlowers();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchSubcategories = async () => {
    try {
      setDataLoading(true);
      const response = await categoriesApi.getAllSubcategories();
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Ошибка при загрузке подкатегорий');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchFlowers = async () => {
    try {
      setDataLoading(true);
      const response = await flowersApi.getAll();
      setFlowers(response.data);
    } catch (error) {
      console.error('Error fetching flowers:', error);
      toast.error('Ошибка при загрузке цветов');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getById(id);
      setProduct(response.data);
      
      if (response.data.type === 'bouquet') {
        const bouquetFlowersResponse = await productsApi.getBouquetFlowers(id);
        setBouquetFlowers(bouquetFlowersResponse.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Ошибка при загрузке товара');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      // Если меняем тип на обычный товар, то очищаем список цветов букета
      if (value === 'normal') {
        setBouquetFlowers([]);
      }
    }
    
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFlower = () => {
    if (!selectedFlower) {
      toast.error('Выберите цветок');
      return;
    }
    
    if (quantity <= 0) {
      toast.error('Количество должно быть больше 0');
      return;
    }
    
    const flowerToAdd = flowers.find(f => f.id === selectedFlower);
    if (!flowerToAdd) {
      toast.error('Цветок не найден');
      return;
    }
    
    // Проверяем, есть ли уже такой цветок в букете
    const existingFlowerIndex = bouquetFlowers.findIndex(
      bf => bf.flower_id === selectedFlower
    );
    
    if (existingFlowerIndex !== -1) {
      // Обновляем количество существующего цветка
      const updatedFlowers = [...bouquetFlowers];
      updatedFlowers[existingFlowerIndex].quantity += Number(quantity);
      setBouquetFlowers(updatedFlowers);
    } else {
      // Добавляем новый цветок в букет
      setBouquetFlowers(prev => [
        ...prev,
        {
          temp_id: Date.now(), // Временный ID для новых записей
          flower_id: flowerToAdd.id,
          flower_name: flowerToAdd.name,
          price: flowerToAdd.price,
          quantity: Number(quantity)
        }
      ]);
    }
    
    // Сбрасываем выбор
    setSelectedFlower('');
    setQuantity(1);
  };

  const handleRemoveFlower = (index) => {
    setBouquetFlowers(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalPrice = () => {
    return bouquetFlowers.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product.name.trim() || !product.description.trim() || !product.subcategory_id) {
      toast.error('Заполните обязательные поля');
      return;
    }
    
    // Для букета проверяем наличие цветов
    if (product.type === 'bouquet' && bouquetFlowers.length === 0) {
      toast.error('Добавьте хотя бы один цветок в букет');
      return;
    }
    
    try {
      setSaving(true);
      
      // Формируем данные для отправки
      const productData = { ...product };
      
      if (product.type === 'bouquet') {
        // Для букета устанавливаем вычисленную цену
        productData.price = calculateTotalPrice();
      }
      
      let savedProduct;
      
      if (isEdit) {
        // Обновляем существующий товар
        const response = await productsApi.update(id, productData);
        savedProduct = response.data;
        toast.success('Товар успешно обновлен');
      } else {
        // Создаем новый товар
        const response = await productsApi.create(productData);
        savedProduct = response.data;
        toast.success('Товар успешно создан');
      }
      
      // Если это букет, обновляем связи с цветами
      if (product.type === 'bouquet') {
        const productId = savedProduct.id || id;
        
        // Если редактируем существующий букет, сначала удаляем все связи
        if (isEdit) {
          const existingFlowers = await productsApi.getBouquetFlowers(productId);
          for (const flower of existingFlowers.data) {
            await productsApi.removeFlowerFromBouquet(flower.id);
          }
        }
        
        // Добавляем новые связи
        for (const flower of bouquetFlowers) {
          await productsApi.addFlowerToBouquet({
            bouquet_id: productId,
            flower_id: flower.flower_id,
            quantity: flower.quantity
          });
        }
      }
      
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`Ошибка при ${isEdit ? 'обновлении' : 'создании'} товара`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {isEdit ? 'Редактировать товар' : 'Добавить товар'}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Название товара
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Название товара"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Описание товара"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Тип товара
            </label>
            <select
              id="type"
              name="type"
              value={product.type}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="normal">Обычный товар</option>
              <option value="bouquet">Букет</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">
              Подкатегория
            </label>
            <select
              id="subcategory_id"
              name="subcategory_id"
              value={product.subcategory_id}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Выберите подкатегорию</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          {!isBouquet && (
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Цена (₽)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                required
              />
            </div>
          )}

          {isBouquet && (
            <div className="mt-6 mb-4 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Состав букета</h3>
              
              <div className="flex items-end space-x-4 mb-4">
                <div className="flex-1">
                  <label htmlFor="flower" className="block text-sm font-medium text-gray-700 mb-1">
                    Цветок
                  </label>
                  <select
                    id="flower"
                    value={selectedFlower}
                    onChange={(e) => setSelectedFlower(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Выберите цветок</option>
                    {flowers.map((flower) => (
                      <option key={flower.id} value={flower.id}>
                        {flower.name} - {formatPrice(flower.price)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Кол-во
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleAddFlower}
                    className="btn btn-secondary flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Добавить
                  </button>
                </div>
              </div>
              
              {bouquetFlowers.length > 0 ? (
                <div>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Цветок
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Цена
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Количество
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Сумма
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bouquetFlowers.map((item, index) => (
                          <tr key={item.id || item.temp_id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.flower_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatPrice(item.price)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatPrice(item.price * item.quantity)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => handleRemoveFlower(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Итого:
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                            {formatPrice(calculateTotalPrice())}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-500">Добавьте цветы в букет</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/products')}
              disabled={saving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </span>
              ) : (
                'Сохранить'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 