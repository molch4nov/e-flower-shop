import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для обработки ответов
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(new Error(error.response.data.error));
    }
    return Promise.reject(error);
  }
);

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  
  // Подкатегории
  getAllSubcategories: () => api.get('/categories/subcategories'),
  getSubcategoryById: (id) => api.get(`/categories/subcategories/${id}`),
  createSubcategory: (data) => api.post('/categories/subcategories', data),
  updateSubcategory: (id, data) => api.put(`/categories/subcategories/${id}`, data),
  deleteSubcategory: (id) => api.delete(`/categories/subcategories/${id}`)
};

export const reviewsApi = {
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`)
};

export const filesApi = {
  getAll: () => api.get('/files'),
  getById: (id) => api.get(`/files/${id}`),
  upload: (formData) => api.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  delete: (id) => api.delete(`/files/${id}`)
};

export const flowersApi = {
  getAll: () => api.get('/flowers'),
  getById: (id) => api.get(`/flowers/${id}`),
  create: (data) => api.post('/flowers', data),
  update: (id, data) => api.put(`/flowers/${id}`, data),
  delete: (id) => api.delete(`/flowers/${id}`)
};

export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products/normal', data),
  createBouquet: (data) => api.post('/products/bouquet', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  
  // Для товаров типа "букет"
  getBouquetFlowers: (bouquetId) => api.get(`/bouquet-flowers/${bouquetId}`),
  addFlowerToBouquet: (data) => api.post('/bouquet-flowers', data),
  updateBouquetFlower: (id, data) => api.put(`/bouquet-flowers/${id}`, data),
  removeFlowerFromBouquet: (id) => api.delete(`/bouquet-flowers/${id}`)
};

export default api; 