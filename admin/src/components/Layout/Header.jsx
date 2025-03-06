import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';

const Header = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="navbar bg-base-100 shadow-md z-10">
      <div className="flex-none">
        <button 
          className="btn btn-square btn-ghost"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Админ-панель</a>
      </div>
      <div className="flex-none gap-2">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
        </button>

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <span className="text-xl font-bold">{user?.username?.charAt(0)?.toUpperCase() || 'A'}</span>
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li className="disabled">
              <a className="justify-between">
                {user?.username || 'Администратор'}
              </a>
            </li>
            <li><a onClick={logout}><FiLogOut className="mr-2" /> Выйти</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header; 