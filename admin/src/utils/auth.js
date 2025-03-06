import api from './api';

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await api.get('/auth/verify');
    return response.data;
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
}; 