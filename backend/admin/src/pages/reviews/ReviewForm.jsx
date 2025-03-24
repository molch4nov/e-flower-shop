import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reviewsApi, productsApi } from '../../services/api';
import { StarIcon } from '@heroicons/react/24/solid';

export default function ReviewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState({
    title: '',
    description: '',
    rating: 5,
    parent_id: ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    fetchProducts();
    if (isEdit) {
      fetchReview();
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productsApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Ошибка при загрузке товаров');
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchReview = async () => {
    try {
      setLoading(true);
      const response = await reviewsApi.getById(id);
      setReview(response.data);
    } catch (error) {
      console.error('Error fetching review:', error);
      toast.error('Ошибка при загрузке отзыва');
      navigate('/reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({ ...prev, [name]: value }));
  };

  const setRating = (rating) => {
    setReview(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!review.title.trim() || !review.description.trim() || !review.parent_id) {
      toast.error('Все поля обязательны для заполнения');
      return;
    }
    
    try {
      setSaving(true);
      if (isEdit) {
        await reviewsApi.update(id, review);
        toast.success('Отзыв успешно обновлен');
      } else {
        await reviewsApi.create(review);
        toast.success('Отзыв успешно создан');
      }
      navigate('/reviews');
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error(`Ошибка при ${isEdit ? 'обновлении' : 'создании'} отзыва`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || productsLoading) {
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
          {isEdit ? 'Редактировать отзыв' : 'Создать отзыв'}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Заголовок
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={review.title}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Введите заголовок отзыва"
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
              value={review.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Введите текст отзыва"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Рейтинг
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">
              Товар
            </label>
            <select
              id="parent_id"
              name="parent_id"
              value={review.parent_id}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Выберите товар</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/reviews')}
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