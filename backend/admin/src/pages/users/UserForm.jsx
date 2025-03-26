import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    birth_date: '',
    role: 'user',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(id);
  
  useEffect(() => {
    if (isEdit) {
      fetchUserData();
    }
  }, [id]);
  
  const fetchUserData = async () => {
    setInitialLoading(true);
    try {
      const response = await axios.get(`/api/admin/users/${id}`);
      const userData = response.data.user;
      
      setFormData({
        name: userData.name || '',
        phone_number: userData.phone_number || '',
        birth_date: userData.birth_date ? format(new Date(userData.birth_date), 'yyyy-MM-dd') : '',
        role: userData.role || 'user',
        password: ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      showError('Не удалось загрузить данные пользователя');
    } finally {
      setInitialLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const showError = (message) => {
    // Create a simple error notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };
  
  const showSuccess = (message) => {
    // Create a simple success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Пожалуйста, введите имя пользователя';
    if (!formData.phone_number) newErrors.phone_number = 'Пожалуйста, введите номер телефона';
    if (!isEdit && !formData.password) newErrors.password = 'Пожалуйста, введите пароль';
    
    // Phone validation
    if (formData.phone_number && !/^\+?[0-9]{10,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Неверный формат номера телефона';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isEdit) {
        // Update existing user
        await axios.put(`/api/users/${id}`, {
          name: formData.name,
          birth_date: formData.birth_date
        });
        
        // Update role separately if needed
        const userData = await axios.get(`/api/admin/users/${id}`);
        if (userData.data.user.role !== formData.role) {
          await axios.put(`/api/admin/users/${id}/role`, { role: formData.role });
        }
        
        showSuccess('Пользователь успешно обновлен');
      } else {
        // Create new user
        await axios.post('/api/auth/register', {
          name: formData.name,
          phone_number: formData.phone_number,
          password: formData.password,
          birth_date: formData.birth_date
        });
        
        showSuccess('Пользователь успешно создан');
      }
      
      // Redirect back to users list
      navigate('/users');
    } catch (error) {
      console.error('Error saving user:', error);
      showError(error.response?.data?.error || 'Не удалось сохранить пользователя');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className="mb-4">
        <button 
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => navigate('/users')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {isEdit ? 'Редактирование пользователя' : 'Создание пользователя'}
          </h3>
        </div>
        
        {initialLoading ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Имя
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                      placeholder="Введите имя пользователя"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                    Номер телефона
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone_number"
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      disabled={isEdit}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.phone_number ? 'border-red-300' : ''} ${isEdit ? 'bg-gray-100' : ''}`}
                      placeholder="Введите номер телефона"
                    />
                  </div>
                  {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                </div>
                
                {!isEdit && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Пароль
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.password ? 'border-red-300' : ''}`}
                        placeholder="Введите пароль"
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>
                )}
                
                <div>
                  <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                    Дата рождения
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="birth_date"
                      id="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Роль
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {isEdit ? 'Сохранить изменения' : 'Создать пользователя'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default UserForm; 