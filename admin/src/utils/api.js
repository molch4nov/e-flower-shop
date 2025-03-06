import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api'; // Замените на ваш URL бэкенда

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для добавления токена авторизации к запросам
api.interceptors.request.use((config) => {
  const token = Cookies.get('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Добавляем интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchEntities = async (entityType, params = {}) => {
  try {
    const response = await api.get(`/${entityType}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType}:`, error);
    throw error;
  }
};

export const fetchEntityById = async (entityType, id) => {
  try {
    const response = await api.get(`/${entityType}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} with id ${id}:`, error);
    throw error;
  }
};

export const createEntity = async (entityType, data) => {
  try {
    const response = await api.post(`/${entityType}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating ${entityType}:`, error);
    throw error;
  }
};

export const updateEntity = async (entityType, id, data) => {
  try {
    const response = await api.put(`/${entityType}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${entityType} with id ${id}:`, error);
    throw error;
  }
};

export const deleteEntity = async (entityType, id) => {
  try {
    const response = await api.delete(`/${entityType}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ${entityType} with id ${id}:`, error);
    throw error;
  }
};

export default api; 