import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  
  useEffect(() => {
    fetchOrderDetails();
  }, [id]);
  
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/orders/admin/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      showError('Не удалось загрузить данные заказа');
    } finally {
      setLoading(false);
    }
  };
  
  const updateOrderStatus = async (newStatus) => {
    setStatusLoading(true);
    try {
      await axios.put(`/api/orders/admin/${id}/status`, { status: newStatus });
      showSuccess('Статус заказа успешно обновлен');
      fetchOrderDetails(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
      showError('Не удалось обновить статус заказа');
    } finally {
      setStatusLoading(false);
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
  
  const getStatusStep = (status) => {
    switch (status) {
      case 'new': return 0;
      case 'processing': return 1;
      case 'delivering': return 2;
      case 'completed': return 3;
      case 'cancelled': return 4;
      default: return 0;
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-8">
          <h2 className="text-xl font-medium mb-2">Заказ не найден</h2>
          <button 
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate('/orders')}
          >
            Вернуться к списку заказов
          </button>
        </div>
      </div>
    );
  }
  
  const getStatusTag = (status) => {
    const statusClasses = {
      new: 'bg-blue-100 text-blue-800',
      processing: 'bg-orange-100 text-orange-800',
      delivering: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      new: 'Новый',
      processing: 'В обработке',
      delivering: 'Доставляется',
      completed: 'Выполнен',
      cancelled: 'Отменен'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusText[status] || status}
      </span>
    );
  };
  
  return (
    <>
      <div className="mb-4">
        <button 
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => navigate('/orders')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Заказ #{order.id.substring(0, 8)}
          </h3>
          <div className="flex items-center space-x-3">
            <div className="text-sm font-medium text-gray-500">Статус: {getStatusTag(order.status)}</div>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={statusLoading}
              className="block w-40 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="new">Новый</option>
              <option value="processing">В обработке</option>
              <option value="delivering">Доставляется</option>
              <option value="completed">Выполнен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
        </div>
        
        <div className="p-6">
          {/* Status Steps */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-between">
                <div className={`flex flex-col items-center ${getStatusStep(order.status) >= 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <span className={`h-10 w-10 flex items-center justify-center rounded-full ${getStatusStep(order.status) >= 0 ? 'bg-indigo-100 border-2 border-indigo-600' : 'bg-white border border-gray-300'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </span>
                  <span className="mt-2 text-xs">Новый</span>
                </div>
                <div className={`flex flex-col items-center ${getStatusStep(order.status) >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <span className={`h-10 w-10 flex items-center justify-center rounded-full ${getStatusStep(order.status) >= 1 ? 'bg-indigo-100 border-2 border-indigo-600' : 'bg-white border border-gray-300'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="mt-2 text-xs">В обработке</span>
                </div>
                <div className={`flex flex-col items-center ${getStatusStep(order.status) >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <span className={`h-10 w-10 flex items-center justify-center rounded-full ${getStatusStep(order.status) >= 2 ? 'bg-indigo-100 border-2 border-indigo-600' : 'bg-white border border-gray-300'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </span>
                  <span className="mt-2 text-xs">Доставляется</span>
                </div>
                <div className={`flex flex-col items-center ${getStatusStep(order.status) >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <span className={`h-10 w-10 flex items-center justify-center rounded-full ${getStatusStep(order.status) >= 3 ? 'bg-indigo-100 border-2 border-indigo-600' : 'bg-white border border-gray-300'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="mt-2 text-xs">Выполнен</span>
                </div>
                {order.status === 'cancelled' && (
                  <div className="flex flex-col items-center text-red-600">
                    <span className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100 border-2 border-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="mt-2 text-xs">Отменен</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <hr className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Информация о заказе</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="py-3 px-4 bg-gray-100 font-medium text-sm text-gray-500">ID заказа</div>
                  <div className="py-3 px-4 text-sm text-gray-900 col-span-2">{order.id}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="py-3 px-4 bg-gray-100 font-medium text-sm text-gray-500">Дата создания</div>
                  <div className="py-3 px-4 text-sm text-gray-900 col-span-2">
                    {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="py-3 px-4 bg-gray-100 font-medium text-sm text-gray-500">Последнее обновление</div>
                  <div className="py-3 px-4 text-sm text-gray-900 col-span-2">
                    {format(new Date(order.updated_at), 'dd.MM.yyyy HH:mm')}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="py-3 px-4 bg-gray-100 font-medium text-sm text-gray-500">Статус</div>
                  <div className="py-3 px-4 text-sm text-gray-900 col-span-2">{getStatusTag(order.status)}</div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="py-3 px-4 bg-gray-100 font-medium text-sm text-gray-500">Сумма заказа</div>
                  <div className="py-3 px-4 text-sm font-bold text-gray-900 col-span-2">
                    {parseFloat(order.total_price).toLocaleString()} ₽
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Информация о доставке</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="py-3 px-4 bg-gray-100 font-medium text-sm text-gray-500">Адрес доставки</div>
                  <div className="py-3 px-4 text-sm text-gray-900 col-span-2 break-words">{order.delivery_address}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="py-3 px-4 bg-gray-100 font-medium text-sm text-gray-500">Дата доставки</div>
                  <div className="py-3 px-4 text-sm text-gray-900 col-span-2">
                    {format(new Date(order.delivery_date), 'dd.MM.yyyy')}
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="py-3 px-4 bg-gray-100 font-medium text-sm text-gray-500">Время доставки</div>
                  <div className="py-3 px-4 text-sm text-gray-900 col-span-2">
                    {order.delivery_time}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <hr className="my-6" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Товары в заказе</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Фото</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Итого</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items && order.items.map((item, index) => (
                    <tr key={`${item.product_id}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                          {item.product_image ? (
                            <img 
                              src={item.product_image} 
                              alt={item.product_name} 
                              className="max-w-full max-h-full object-contain" 
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.product_name}</div>
                        <div className="text-xs text-gray-500">ID: {item.product_id.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.product_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {parseFloat(item.price).toLocaleString()} ₽
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(parseFloat(item.price) * item.quantity).toLocaleString()} ₽
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-right font-medium">Итого:</td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                      {parseFloat(order.total_price).toLocaleString()} ₽
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {order.customer_comment && (
            <>
              <hr className="my-6" />
              <div>
                <h3 className="text-lg font-medium mb-2">Комментарий к заказу</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">{order.customer_comment}</p>
                </div>
              </div>
            </>
          )}
          
          {order.user_id && (
            <>
              <hr className="my-6" />
              <div className="flex justify-end">
                <Link to={`/users/${order.user_id}`}>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Профиль пользователя
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetails; 