import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { login as apiLogin, verifyToken } from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = Cookies.get('authToken');
      
      if (token) {
        try {
          const userData = await verifyToken(token);
          setUser(userData);
        } catch (error) {
          Cookies.remove('authToken');
        }
      }
      
      setLoading(false);
    };
    
    checkUser();
  }, []);

  const login = async (username, password) => {
    const { token, user: userData } = await apiLogin(username, password);
    Cookies.set('authToken', token, { expires: 7 });
    setUser(userData);
    return userData;
  };

  const logout = () => {
    Cookies.remove('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 