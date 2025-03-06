import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Squares2X2Icon, 
  TagIcon, 
  ChatBubbleLeftRightIcon, 
  PhotoIcon,
  FlowerIcon,
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Дашборд', href: '/', icon: Squares2X2Icon },
  { name: 'Категории', href: '/categories', icon: TagIcon },
  { name: 'Отзывы', href: '/reviews', icon: ChatBubbleLeftRightIcon },
  { name: 'Файлы', href: '/files', icon: PhotoIcon },
  { name: 'Цветы', href: '/flowers', icon: FlowerIcon },
  { name: 'Товары', href: '/products', icon: ShoppingBagIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-primary-800 text-white w-64">
      <div className="flex items-center justify-center h-16 px-4 border-b border-primary-700">
        <h1 className="text-xl font-bold">Цветочный магазин</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                isActive
                  ? 'bg-primary-900 text-white'
                  : 'text-primary-100 hover:bg-primary-700',
                'group flex items-center px-4 py-2 text-sm font-medium'
              )}
            >
              <item.icon
                className={classNames(
                  isActive ? 'text-white' : 'text-primary-300 group-hover:text-white',
                  'mr-3 flex-shrink-0 h-6 w-6'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 