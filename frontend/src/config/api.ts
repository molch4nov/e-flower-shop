import axios from "axios";

// Базовый URL для API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Создаем экземпляр axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Для передачи cookies при кросс-доменных запросах
});

// Интерцептор для обработки ответов
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка 401 ошибки (не авторизован)
    if (error.response?.status === 401) {
      // Здесь можно добавить редирект на страницу логина или другую логику
      console.error("Unauthorized access");
    }
    
    // Обработка 500 ошибки
    if (error.response?.status === 500) {
      console.error("Server error:", error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// Типы для API запросов
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// API сервисы
const api = {
  // Товары
  products: {
    getAll: () => axiosInstance.get("/products"),
    getById: (id: string) => axiosInstance.get(`/products/${id}`),
    getBySubcategory: (subcategoryId: string) => axiosInstance.get(`/products/subcategory/${subcategoryId}`),
    getPopular: () => axiosInstance.get("/products/popular"),
    getTopRated: () => axiosInstance.get("/products/top-rated"),
  },

  // Категории
  categories: {
    getAll: () => axiosInstance.get("/categories"),
    getById: (id: string) => axiosInstance.get(`/categories/${id}`),
    getSubcategories: (categoryId: string) => axiosInstance.get(`/categories/${categoryId}/subcategories`),
    getAllSubcategories: () => axiosInstance.get("/categories/subcategories"),
  },

  // Авторизация
  auth: {
    register: (data: { name: string; phone_number: string; password: string; birth_date?: string }) => 
      axiosInstance.post("/auth/register", data),
    login: (data: { phone_number: string; password: string }) => 
      axiosInstance.post("/auth/login", data),
    logout: () => axiosInstance.post("/auth/logout"),
    getMe: () => axiosInstance.get("/auth/me"),
  },

  // Корзина
  cart: {
    get: () => axiosInstance.get("/cart"),
    add: (data: { product_id: string; quantity?: number }) => axiosInstance.post("/cart", data),
    update: (id: string, quantity: number) => axiosInstance.put(`/cart/${id}`, { quantity }),
    remove: (id: string) => axiosInstance.delete(`/cart/${id}`),
    clear: () => axiosInstance.delete("/cart"),
  },

  // Заказы
  orders: {
    getAll: () => axiosInstance.get("/orders"),
    getById: (id: string) => axiosInstance.get(`/orders/${id}`),
    create: (data: { delivery_address: string; delivery_date: string; delivery_time: string }) => 
      axiosInstance.post("/orders", data),
  },
};

export default api;