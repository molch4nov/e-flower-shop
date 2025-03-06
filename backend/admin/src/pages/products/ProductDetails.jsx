import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productsApi, categoriesApi } from '../../services/api';
import { StarIcon, ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [bouquetFlowers, setBouquetFlowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const productResponse = await productsApi.getById(id);
      setProduct(productResponse.data);
      
      if (productResponse.data.subcategory_id) {
        const subcategoryResponse = await categoriesApi.getSubcategoryById(productResponse.data.subcategory_id);
        setSubcategory(subcategoryResponse.data);
      }
      
      if (productResponse.data.type === 'bouquet') {
        const bouquetFlowersResponse = await productsApi.getBouquetFlowers(id);
        setBouquetFlowers(bouquetFlowersResponse.data);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Ошибка при загрузке информации о товаре');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.')) {
      try {
        await productsApi.delete(id);
        toast.success('Товар успешно удален');
        navigate('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Ошибка при удалении товара');
      }
    }
  };

  // Функция для форматирования цены
  const formatPrice = (price) => {
    if (!price) return 'Цена не указана';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Функция для отображения рейтинга в виде звезд
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon 
            key={star}
            className={`h-5 w-5 ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-red-500">Товар не найден</p>
        <Link to="/products" className="text-primary-600 hover:text-primary-800 mt-4 inline-block">
          Вернуться к списку товаров
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/products" className="text-gray-500 hover:text-gray-700 mr-4">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold">
            {product.name}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/products/${id}/edit`}
            className="btn btn-secondary flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-1" />
            Редактировать
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger flex items-center"
          >
            <TrashIcon className="h-5 w-5 mr-1" />
            Удалить
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">Информация о товаре</h2>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Тип товара</p>
                <p className="mt-1">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.type === 'bouquet' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {product.type === 'bouquet' ? 'Букет' : 'Обычный товар'}
                  </span>
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Подкатегория</p>
                <p className="mt-1 text-sm text-gray-900">{subcategory ? subcategory.name : 'Не указана'}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Цена</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{formatPrice(product.price)}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Рейтинг</p>
                <div className="mt-1">{renderRating(product.rating)}</div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Количество покупок</p>
                <p className="mt-1 text-sm text-gray-900">{product.purchases_count || 0}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Дата создания</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Последнее обновление</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(product.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">Описание</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{product.description}</p>
              
              {product.type === 'bouquet' && bouquetFlowers.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Состав букета</h2>
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
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bouquetFlowers.map((item) => (
                          <tr key={item.id}>
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
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Итого:
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 