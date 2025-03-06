import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiShoppingCart,
  FiPackage,
  FiFileText,
  FiSettings,
  FiMessageSquare
} from 'react-icons/fi';

// Предполагаемые сущности (entity)
const entities = [
  { id: 'users', name: 'Пользователи', icon: <FiUsers className="w-5 h-5" /> },
  { id: 'products', name: 'Продукты', icon: <FiPackage className="w-5 h-5" /> },
  { id: 'orders', name: 'Заказы', icon: <FiShoppingCart className="w-5 h-5" /> },
  { id: 'posts', name: 'Статьи', icon: <FiFileText className="w-5 h-5" /> },
  { id: 'comments', name: 'Комментарии', icon: <FiMessageSquare className="w-5 h-5" /> },
  { id: 'settings', name: 'Настройки', icon: <FiSettings className="w-5 h-5" /> }
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  return (
    <aside className={`fixed top-16 left-0 h-screen bg-base-100 shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      <div className="p-4 h-full">
        <ul className="menu p-2 rounded-box">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              <FiHome className="w-5 h-5" />
              Панель управления
            </Link>
          </li>
          
          <li className="menu-title">
            <span>Управление данными</span>
          </li>
          
          {entities.map(entity => (
            <li key={entity.id}>
              <Link 
                to={`/entity/${entity.id}`} 
                className={location.pathname === `/entity/${entity.id}` ? 'active' : ''}
              >
                {entity.icon}
                {entity.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar; 