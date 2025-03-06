import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Данные для отображения разделов
  const sections = [
    { name: 'Категории', href: '/categories', count: '0', color: 'bg-blue-100 text-blue-800' },
    { name: 'Подкатегории', href: '/subcategories', count: '0', color: 'bg-green-100 text-green-800' },
    { name: 'Отзывы', href: '/reviews', count: '0', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Файлы', href: '/files', count: '0', color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Цветы', href: '/flowers', count: '0', color: 'bg-pink-100 text-pink-800' },
    { name: 'Товары', href: '/products', count: '0', color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Панель управления</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sections.map((section) => (
          <div key={section.name} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${section.color}`}>
                  <span className="text-xl font-bold">{section.count}</span>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">{section.name}</h3>
                  <p className="text-sm text-gray-500">Всего записей</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <Link
                to={section.href}
                className="text-sm font-medium text-primary-600 hover:text-primary-900"
              >
                Перейти к управлению
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Добро пожаловать в админ-панель</h2>
        <p className="text-gray-600 mb-4">
          Эта панель позволяет управлять всеми аспектами магазина цветов. Выберите раздел из меню слева.
        </p>
        <p className="text-sm text-gray-500">
          Текущая версия: 0.1.0 | Разработка
        </p>
      </div>
    </div>
  );
} 