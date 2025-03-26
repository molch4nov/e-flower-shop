import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Dialog, Tab } from '@headlessui/react';
import axios from 'axios';
import { format, formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [roleValue, setRoleValue] = useState('user');
  const [roleLoading, setRoleLoading] = useState(false);
  
  useEffect(() => {
    fetchUserDetails();
  }, [id]);
  
  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/users/${id}`);
      setUser(response.data.user);
      setHolidays(response.data.holidays || []);
      setAddresses(response.data.addresses || []);
      setOrders(response.data.orders || []);
      setRoleValue(response.data.user.role);
    } catch (error) {
      console.error('Error fetching user details:', error);
      showError('Не удалось загрузить данные пользователя');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRoleChange = async () => {
    setRoleLoading(true);
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role: roleValue });
      showSuccess('Роль пользователя успешно обновлена');
      fetchUserDetails();
      setRoleModalVisible(false);
    } catch (error) {
      console.error('Error updating user role:', error);
      showError('Не удалось обновить роль пользователя');
    } finally {
      setRoleLoading(false);
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
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-8">
          <h2 className="text-xl font-medium mb-2">Пользователь не найден</h2>
          <button 
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate('/users')}
          >
            Вернуться к списку пользователей
          </button>
        </div>
      </div>
    );
  }
  
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
      
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Пользователь: {user.name}
          </h3>
          <div className="flex space-x-2">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => navigate(`/users/${id}/edit`)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Редактировать
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => setRoleModalVisible(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Изменить роль
            </button>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">{user.id}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Роль</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Имя</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">{user.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Телефон</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">{user.phone_number}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Дата рождения</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                {user.birth_date ? format(new Date(user.birth_date), 'dd.MM.yyyy') : 'Не указана'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Дата регистрации</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                {format(new Date(user.created_at), 'dd.MM.yyyy HH:mm')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-200">
            <Tab 
              className={({ selected }) => 
                `py-4 px-6 text-sm font-medium focus:outline-none ${
                  selected 
                    ? 'border-b-2 border-indigo-500 text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Заказы
            </Tab>
            <Tab 
              className={({ selected }) => 
                `py-4 px-6 text-sm font-medium focus:outline-none ${
                  selected 
                    ? 'border-b-2 border-indigo-500 text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Праздники
            </Tab>
            <Tab 
              className={({ selected }) => 
                `py-4 px-6 text-sm font-medium focus:outline-none ${
                  selected 
                    ? 'border-b-2 border-indigo-500 text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Адреса
            </Tab>
          </Tab.List>
          <Tab.Panels className="p-4">
            <Tab.Panel>
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID заказа
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Сумма
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата заказа
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Статус
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="text-xs">{order.id.substring(0, 8)}...</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {parseFloat(order.total_price).toLocaleString()} ₽
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                              order.status === 'delivering' ? 'bg-green-100 text-green-800' :
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status === 'new' ? 'Новый' :
                               order.status === 'processing' ? 'В обработке' :
                               order.status === 'delivering' ? 'Доставляется' :
                               order.status === 'completed' ? 'Выполнен' :
                               order.status === 'cancelled' ? 'Отменен' :
                               order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              to={`/orders/${order.id}`}
                              className="inline-flex justify-center py-2 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              Детали
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Нет заказов
                </div>
              )}
            </Tab.Panel>
            <Tab.Panel>
              {holidays.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Название
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {holidays.map(holiday => (
                        <tr key={holiday.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {holiday.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(holiday.date), 'dd.MM.yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Нет праздников
                </div>
              )}
            </Tab.Panel>
            <Tab.Panel>
              {addresses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Название
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Адрес
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {addresses.map(address => (
                        <tr key={address.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {address.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {address.address}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Нет адресов
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      
      {/* Role Change Modal */}
      <Dialog
        open={roleModalVisible}
        onClose={() => setRoleModalVisible(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-xl p-4">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Изменение роли пользователя
            </Dialog.Title>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-4">
                Выберите новую роль для пользователя {user.name}
              </p>
              
              <div className="mt-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Роль
                </label>
                <select
                  id="role"
                  value={roleValue}
                  onChange={(e) => setRoleValue(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setRoleModalVisible(false)}
              >
                Отмена
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                onClick={handleRoleChange}
                disabled={roleLoading}
              >
                {roleLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Сохранение...
                  </>
                ) : (
                  'Сохранить'
                )}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default UserDetails; 