import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import Sidebar from './Sidebar';
import axios from 'axios';
import Cookies from 'js-cookie';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const location = useLocation();
  const navigate = useNavigate();

  // Check for existing session on mount only, not on every route change
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setAdminUser(userData);
        setLoginModalOpen(false);
      } catch (e) {
        console.error('Error parsing saved user data', e);
        localStorage.removeItem('adminUser');
        checkAuthentication();
      }
    } else {
      checkAuthentication();
    }
  }, []);

  const checkAuthentication = async () => {
    setLoading(true);
    try {
      // Check if we have session ID in cookies
      const sessionId = Cookies.get('sessionId');
      console.log('Current sessionId in cookies:', sessionId);
      
      const response = await axios.get('/api/auth/current', { withCredentials: true });
      
      if (response.data && response.data.user) {
        if (response.data.user.role === 'admin') {
          console.log('User authenticated as admin');
          setAdminUser(response.data.user);
          // Save user data to localStorage for persistence
          localStorage.setItem('adminUser', JSON.stringify(response.data.user));
          setLoginModalOpen(false);
        } else {
          // User is authenticated but not an admin
          console.log('User authenticated but not an admin');
          localStorage.removeItem('adminUser');
          setLoginError('У вас нет прав администратора для доступа к этой странице');
          setLoginModalOpen(true);
        }
      } else {
        // User is not authenticated
        console.log('User not authenticated');
        localStorage.removeItem('adminUser');
        setLoginModalOpen(true);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      localStorage.removeItem('adminUser');
      setLoginModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    
    try {
      const response = await axios.post('/api/auth/login', {
        phone_number: credentials.username,
        password: credentials.password
      }, {
        withCredentials: true
      });

      console.log('Login response:', response.data);
      console.log('Document cookies:', document.cookie);
      
      // Check for sessionId in response data and manually set it if needed
      if (response.data.sessionId) {
        console.log('Setting cookie manually:', response.data.sessionId);
        Cookies.set('sessionId', response.data.sessionId, { path: '/' });
      }
      
      console.log('Cookies after login:', Cookies.get());

      if (response.data && response.data.user) {
        if (response.data.user.role === 'admin') {
          // Save user data to localStorage for persistence
          localStorage.setItem('adminUser', JSON.stringify(response.data.user));
          setAdminUser(response.data.user);
          setLoginModalOpen(false);
          // Display success message
          alert('Вход выполнен успешно');
        } else {
          localStorage.removeItem('adminUser');
          setLoginError('У вас нет прав администратора');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('adminUser');
      setLoginError('Ошибка входа. Проверьте учетные данные');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setAdminUser(null);
      localStorage.removeItem('adminUser');
      Cookies.remove('sessionId');
      setLoginModalOpen(true);
      alert('Выход выполнен успешно');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Ошибка при выходе из системы');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3">Загрузка...</span>
      </div>
    );
  }

  // If we have admin user but login modal is open, close it
  if (adminUser && loginModalOpen) {
    setLoginModalOpen(false);
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out z-10`}>
          <div className="h-16 flex items-center justify-center bg-primary-600 text-white font-bold text-xl">
            {collapsed ? 'ЦМ' : 'Цветочный Магазин'}
          </div>
          <Sidebar />
        </div>

        {/* Main content */}
        <div className={`flex-1 flex flex-col ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out`}>
          {/* Header */}
          <header className="bg-white shadow h-16 flex items-center justify-between px-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {collapsed ? 'Развернуть меню' : 'Свернуть меню'}
            </button>
            
            {adminUser && (
              <div className="flex items-center">
                <span className="mr-4">
                  {adminUser.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Выйти
                </button>
              </div>
            )}
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-6 bg-gray-100">
            {children}
          </main>
        </div>
      </div>

      {/* Login Modal */}
      <Transition show={loginModalOpen} as={React.Fragment}>
        <Dialog 
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => {}}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Вход в административную панель
              </Dialog.Title>
              
              {loginError && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                  {loginError}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="mt-4">
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Логин
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="admin"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Пароль"
                    required
                  />
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Выполняется вход...' : 'Войти'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Layout; 