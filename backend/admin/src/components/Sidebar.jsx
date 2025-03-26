import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    return currentPath === path ? 'bg-primary-700 text-white' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <div className="h-full bg-white shadow-md">
      <nav className="flex flex-col h-full">
        <div className="p-4">
          <Link to="/" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/')}`}>
            Панель управления
          </Link>

          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 mt-2">
                  <div className="flex justify-between items-center">
                    <span>Каталог</span>
                    <span>{open ? '▼' : '►'}</span>
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="pl-6">
                  <Link to="/categories" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/categories')}`}>
                    Категории
                  </Link>
                  <Link to="/subcategories" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/subcategories')}`}>
                    Подкатегории
                  </Link>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Link to="/products" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/products')} mt-2`}>
            Товары
          </Link>
          
          <Link to="/flowers" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/flowers')} mt-2`}>
            Цветы
          </Link>
          
          <Link to="/orders" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/orders')} mt-2`}>
            Заказы
          </Link>

          <Link to="/reviews" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/reviews')} mt-2`}>
            Отзывы
          </Link>

          <Link to="/files" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/files')} mt-2`}>
            Файлы
          </Link>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <Link to="/users" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/users')} mt-2`}>
            Пользователи
          </Link>
          
          <Link to="/active-users" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/active-users')} mt-2`}>
            Активность пользователей
          </Link>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <Link to="/test-cookie" className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive('/test-cookie')} mt-2 text-blue-600`}>
            Тест Cookie
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 