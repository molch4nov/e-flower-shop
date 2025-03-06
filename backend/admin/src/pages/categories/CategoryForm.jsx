import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categoriesApi } from '../../services/api';

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getById(id);
      setCategory(response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Ошибка при загрузке категории');
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category.name.trim()) {
      toast.error('Название категории обязательно');
      return;
    }
    
    try {
      setSaving(true);
      if (isEdit) {
        await categoriesApi.update(id, { name: category.name });
        toast.success('Категория успешно обновлена');
      } else {
        await categoriesApi.create({ name: category.name });
        toast.success('Категория успешно создана');
      }
      navigate('/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(`Ошибка при ${isEdit ? 'обновлении' : 'создании'} категории`);
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
          {isEdit ? 'Редактировать категорию' : 'Создать категорию'}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={category.name}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Введите название категории"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/categories')}
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