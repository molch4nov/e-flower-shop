import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categoriesApi } from '../../services/api';

export default function SubcategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState({ name: '', category_id: '' });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchSubcategory();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Ошибка при загрузке категорий');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchSubcategory = async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getSubcategoryById(id);
      setSubcategory(response.data);
    } catch (error) {
      console.error('Error fetching subcategory:', error);
      toast.error('Ошибка при загрузке подкатегории');
      navigate('/subcategories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubcategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subcategory.name.trim() || !subcategory.category_id) {
      toast.error('Все поля обязательны для заполнения');
      return;
    }
    
    try {
      setSaving(true);
      if (isEdit) {
        await categoriesApi.updateSubcategory(id, subcategory);
        toast.success('Подкатегория успешно обновлена');
      } else {
        await categoriesApi.createSubcategory(subcategory);
        toast.success('Подкатегория успешно создана');
      }
      navigate('/subcategories');
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast.error(`Ошибка при ${isEdit ? 'обновлении' : 'создании'} подкатегории`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || categoriesLoading) {
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
          {isEdit ? 'Редактировать подкатегорию' : 'Создать подкатегорию'}
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
              value={subcategory.name}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Введите название подкатегории"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Родительская категория
            </label>
            <select
              id="category_id"
              name="category_id"
              value={subcategory.category_id}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/subcategories')}
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