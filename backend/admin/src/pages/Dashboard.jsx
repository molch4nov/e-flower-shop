import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios'; // Удаляем импорт axios
import api from '../services/api'; // Импортируем api (путь относительный)

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch admin dashboard stats
      // const statsResponse = await axios.get('/api/admin/dashboard'); // Заменяем axios на api и корректируем путь
      const statsResponse = await api.get('/admin/dashboard');
      setStats(statsResponse.data);
      
      // Fetch recent orders
      // const ordersResponse = await axios.get('/api/orders/admin/all?limit=5'); // Заменяем axios на api и корректируем путь
      const ordersResponse = await api.get('/orders/admin/all?limit=5');
      setRecentOrders(ordersResponse.data.orders || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };
  
  const getStatusBadge = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      delivering: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const text = {
      new: 'Новый',
      processing: 'В обработке',
      delivering: 'Доставляется',
      completed: 'Выполнен',
      cancelled: 'Отменен'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
        {text[status] || status}
      </span>
    );
  };
  
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3">Загрузка данных...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Ошибка!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          onClick={fetchDashboardData}
          className="mt-3 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Повторить
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Панель управления</h1>
      
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="font-medium text-gray-500 mb-2">Всего заказов</div>
              <div className="text-3xl font-bold">{stats.orders.total_orders}</div>
              <div className="mt-2 text-sm text-blue-500">
                {stats.orders.orders_today} новых сегодня
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <div className="font-medium text-gray-500 mb-2">Активные пользователи</div>
              <div className="text-3xl font-bold">{stats.users.active}</div>
              <div className="mt-2 text-sm text-green-500">
                из {stats.users.total} зарегистрированных
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <div className="font-medium text-gray-500 mb-2">Новые пользователи</div>
              <div className="text-3xl font-bold">{stats.users.new}</div>
              <div className="mt-2 text-sm text-gray-500">
                Зарегистрировались сегодня
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <div className="font-medium text-gray-500 mb-2">Выручка всего</div>
              <div className="text-3xl font-bold">
                {parseFloat(stats.orders.total_revenue).toLocaleString()} ₽
              </div>
              <div className="mt-2 text-sm text-green-500">
                {parseFloat(stats.orders.today_revenue).toLocaleString()} ₽ сегодня
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="font-medium text-gray-500 mb-2">Новые заказы</div>
              <div className="text-3xl font-bold text-blue-500">{stats.orders.new_orders}</div>
              <div className="mt-2">
                <Link to="/orders?status=new">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm">
                    Перейти к новым заказам
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <div className="font-medium text-gray-500 mb-2">В обработке</div>
              <div className="text-3xl font-bold text-yellow-500">{stats.orders.processing_orders}</div>
              <div className="mt-2">
                <Link to="/orders?status=processing">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded text-sm">
                    Перейти к заказам
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <div className="font-medium text-gray-500 mb-2">Доставляются</div>
              <div className="text-3xl font-bold text-green-500">{stats.orders.delivering_orders}</div>
              <div className="mt-2">
                <Link to="/orders?status=delivering">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded text-sm">
                    Перейти к заказам
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <div className="font-medium text-gray-500 mb-2">Выручка за неделю</div>
              <div className="text-3xl font-bold">
                {parseFloat(stats.orders.week_revenue).toLocaleString()} ₽
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {stats.orders.orders_this_week} заказов
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Последние заказы</h2>
          <Link to="/orders">
            <button className="text-primary-600 hover:text-primary-700">
              Все заказы
            </button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Нет данных
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(order.total_price).toLocaleString()} ₽
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/orders/${order.id}`}>
                        <button className="bg-primary-500 hover:bg-primary-600 text-white py-1 px-3 rounded text-xs">
                          Подробнее
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 