import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiPackage, 
  FiShoppingCart, 
  FiFileText, 
  FiMessageSquare, 
  FiSettings 
} from 'react-icons/fi';
import api from '../utils/api';

const entities = [
  { id: 'users', name: 'Пользователи', icon: <FiUsers className="w-8 h-8" />, color: 'bg-primary' },
  { id: 'products', name: 'Продукты', icon: <FiPackage className="w-8 h-8" />, color: 'bg-secondary' },
  { id: 'orders', name: 'Заказы', icon: <FiShoppingCart className="w-8 h-8" />, color: 'bg-accent' },
  { id: 'posts', name: 'Статьи', icon: <FiFileText className="w-8 h-8" />, color: 'bg-info' },
  { id: 'comments', name: 'Комментарии', icon: <FiMessageSquare className="w-8 h-8" />, color: 'bg-success' },
  { id: 'settings', name: 'Настройки', icon: <FiSettings className="w-8 h-8" />, color: 'bg-warning' }
];

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // В реальном приложении здесь должен быть запрос к API для получения статистики
        // const response = await api.get('/stats');
        // setStats(response.data);
        
        // Имитация загрузки данных
        setTimeout(() => {
          setStats({
            users: 124,
            products: 532,
            orders: 267,
            posts: 89,
            comments: 453,
            settings: 12
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Не удалось загрузить статистику');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Панель управления</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entities.map(entity => (
          <Link 
            key={entity.id}
            to={`/entity/${entity.id}`}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="card-body flex flex-row items-center">
              <div className={`p-4 rounded-box ${entity.color} text-white`}>
                {entity.icon}
              </div>
              <div className="ml-4">
                <h2 className="card-title">{entity.name}</h2>
                <p className="text-3xl font-bold">
                  {stats[entity.id] || 0}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="divider my-8">Последние действия</div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Активность системы</h2>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Действие</th>
                  <th>Сущность</th>
                  <th>Пользователь</th>
                </tr>
              </thead>
              <tbody>
                {/* Тут будет список действий, но пока заглушка */}
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td>{new Date(Date.now() - i * 3600000).toLocaleString()}</td>
                    <td>
                      {['Создание', 'Редактирование', 'Удаление'][Math.floor(Math.random() * 3)]}
                    </td>
                    <td>
                      {entities[Math.floor(Math.random() * entities.length)].name}
                    </td>
                    <td>Администратор</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 