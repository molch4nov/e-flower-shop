import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import axios from 'axios';
import { format, formatDistance, formatRelative, differenceInMinutes } from 'date-fns';
import { ru } from 'date-fns/locale';

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(15); // Default 15 minutes
  
  const fetchActiveUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/active-users?minutes=${timeRange}`);
      setActiveUsers(response.data.activeUsers || []);
    } catch (error) {
      console.error('Error fetching active users:', error);
      showError('Не удалось загрузить активных пользователей');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchActiveUsers();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchActiveUsers();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [timeRange]);
  
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
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
  
  const getUserBrowser = (userAgent) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';
    
    return 'Other';
  };
  
  const getUserOS = (userAgent) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    
    return 'Other';
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex flex-wrap justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Активные пользователи
        </h3>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(parseInt(e.target.value))}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value={5}>За 5 минут</option>
            <option value={15}>За 15 минут</option>
            <option value={30}>За 30 минут</option>
            <option value={60}>За 1 час</option>
            <option value={360}>За 6 часов</option>
            <option value={720}>За 12 часов</option>
            <option value={1440}>За 24 часа</option>
          </select>
          <button
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={fetchActiveUsers}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            Обновить
          </button>
        </div>
      </div>
      
      <div className="px-4 py-3 sm:px-6">
        <p className="text-sm text-gray-500">
          Показано {activeUsers.length} активных пользователей за последние {timeRange} минут. 
          Данные обновляются автоматически каждые 30 секунд.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        {loading && activeUsers.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="inline-block animate-spin h-8 w-8 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-2 text-sm text-gray-500">Загрузка данных...</p>
          </div>
        ) : activeUsers.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-500">
            Нет активных пользователей
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Контакт
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Последняя активность
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP адрес
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Устройство
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeUsers.map((user, index) => {
                const activityDate = new Date(user.last_activity);
                const now = new Date();
                const diffMinutes = differenceInMinutes(now, activityDate);
                
                let statusColor = 'bg-green-400';
                if (diffMinutes > 5) statusColor = 'bg-yellow-400';
                if (diffMinutes > 10) statusColor = 'bg-red-400';
                
                return (
                  <tr key={`${user.user_id}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Link to={`/users/${user.user_id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                          {user.name}
                        </Link>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center group relative">
                        <div className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${statusColor} mr-2`}></div>
                        <div className="text-sm text-gray-900">
                          {formatDistance(activityDate, now, { locale: ru, addSuffix: true })} ({diffMinutes} мин.)
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 bottom-full left-0 transform mb-2 px-3 py-1 text-xs font-medium text-white bg-gray-700 rounded shadow-lg">
                          {format(activityDate, 'dd.MM.yyyy HH:mm:ss')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">{user.ip_address || 'Н/Д'}</span>
                        <button 
                          className="ml-2 text-gray-400 hover:text-gray-500"
                          onClick={() => navigator.clipboard.writeText(user.ip_address)}
                          title="Копировать IP"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="group relative">
                        <div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            {getUserBrowser(user.user_agent)}
                          </div>
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {getUserOS(user.user_agent)}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 bottom-full left-0 transform mb-2 px-3 py-1 text-xs font-medium text-white bg-gray-700 rounded shadow-lg max-w-xs break-all">
                          {user.user_agent || 'Неизвестно'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/users/${user.user_id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Профиль
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ActiveUsers; 