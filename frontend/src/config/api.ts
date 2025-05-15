/**
 * API клиент для работы с бэкендом
 */

const API_URL = 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Выполняет запрос к API с автоматическим добавлением авторизации
 * @param endpoint - эндпоинт API (без базового URL)
 * @param options - опции fetch
 * @returns результат запроса
 */
export async function apiRequest<T = any>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  
  // Формируем URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Настраиваем заголовки
  const headers = new Headers(fetchOptions.headers || {});
  
  if (!headers.has('Content-Type') && !options.body?.toString().includes('FormData')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Добавляем авторизацию, если нужно
  if (!skipAuth) {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      headers.set('Authorization', `Bearer ${sessionId}`);
    }
  }
  
  // Выполняем запрос
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include', // Всегда включаем куки
  });
  
  // Если ответ успешный и это не DELETE запрос, возвращаем JSON
  if (response.ok) {
    // Для DELETE запросов или запросов без тела, возвращаем пустой объект
    if (response.status === 204 || options.method === 'DELETE') {
      return {} as T;
    }
    
    // Для всех остальных успешных запросов пробуем распарсить JSON
    try {
      return await response.json();
    } catch (e) {
      return {} as T;
    }
  }
  
  // Обрабатываем ошибки
  let error: any = new Error('API request failed');
  
  try {
    const errorData = await response.json();
    error = new Error(errorData.error || 'Ошибка API');
    error.status = response.status;
    error.data = errorData;
  } catch (e) {
    error.message = response.statusText;
    error.status = response.status;
  }
  
  throw error;
}

/**
 * API методы
 */
export const api = {
  /**
   * GET запрос
   */
  get: <T = any>(endpoint: string, options: FetchOptions = {}) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  /**
   * POST запрос
   */
  post: <T = any>(endpoint: string, data?: any, options: FetchOptions = {}) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    }),
  
  /**
   * PUT запрос
   */
  put: <T = any>(endpoint: string, data?: any, options: FetchOptions = {}) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined 
    }),
  
  /**
   * DELETE запрос
   */
  delete: <T = any>(endpoint: string, options: FetchOptions = {}) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
  
  /**
   * POST запрос с FormData (для загрузки файлов)
   */
  upload: <T = any>(endpoint: string, formData: FormData, options: FetchOptions = {}) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: formData
    }),
};

export default api; 