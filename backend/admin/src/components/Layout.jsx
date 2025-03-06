import React from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Простая навигация
const navigation = [
  { name: 'Дашборд', href: '/' },
  { name: 'Категории', href: '/categories' },
  { name: 'Подкатегории', href: '/subcategories' },
  { name: 'Отзывы', href: '/reviews' },
  { name: 'Файлы', href: '/files' },
  { name: 'Цветы', href: '/flowers' },
  { name: 'Товары', href: '/products' },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary-700 text-white p-4 shadow">
        <h1 className="text-xl font-bold">Цветочный магазин - Админ-панель</h1>
      </header>
      
      <div className="flex">
        {/* Боковое меню */}
        <nav className="w-64 bg-white p-4 shadow-md min-h-screen">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.href} 
                  className="block p-2 rounded hover:bg-primary-50 text-gray-700 hover:text-primary-700"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Основное содержимое */}
        <main className="flex-1 p-6">
          {children}
          <ToastContainer position="bottom-right" />
        </main>
      </div>
    </div>
  );
} 