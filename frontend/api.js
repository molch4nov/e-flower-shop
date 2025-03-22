/**
 * API клиент для взаимодействия с бэкендом
 */
class ApiClient {
    constructor() {
        // Базовый URL API
        this.baseUrl = '/api';
        // Кэш для OpenAPI спецификации
        this.apiSpec = null;
    }

    /**
     * Получить OpenAPI спецификацию
     */
    async getApiSpec() {
        if (this.apiSpec) {
            return this.apiSpec;
        }

        try {
            const response = await fetch('/api-docs/swagger.json');
            if (!response.ok) {
                throw new Error('Не удалось получить спецификацию API');
            }
            this.apiSpec = await response.json();
            return this.apiSpec;
        } catch (error) {
            console.error('Ошибка при получении спецификации API:', error);
            throw error;
        }
    }

    /**
     * Отправка запроса к API
     */
    async request(method, endpoint, data = null, params = {}) {
        const url = new URL(this.baseUrl + endpoint, window.location.origin);
        
        // Добавляем параметры запроса, если они есть
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, params[key]);
                }
            });
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            showLoading(true);
            const response = await fetch(url, options);
            const contentType = response.headers.get('content-type');
            
            let responseData;
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            if (!response.ok) {
                const error = new Error(responseData.error || 'Ошибка при запросе к API');
                error.status = response.status;
                error.data = responseData;
                throw error;
            }

            return responseData;
        } catch (error) {
            console.error(`Ошибка при ${method} запросе к ${endpoint}:`, error);
            throw error;
        } finally {
            showLoading(false);
        }
    }

    /**
     * API методы для работы с категориями
     */
    async getCategories() {
        return this.request('GET', '/categories');
    }

    async getCategoryById(id) {
        return this.request('GET', `/categories/${id}`);
    }

    /**
     * API методы для работы с цветами/товарами
     */
    async getProducts(params = {}) {
        return this.request('GET', '/products', null, params);
    }

    async getProductById(id) {
        return this.request('GET', `/products/${id}`);
    }

    /**
     * API методы для работы с отзывами
     */
    async getReviews() {
        return this.request('GET', '/reviews');
    }

    async getReviewById(id) {
        return this.request('GET', `/reviews/${id}`);
    }

    async createReview(reviewData) {
        return this.request('POST', '/reviews', reviewData);
    }

    /**
     * API методы для работы с файлами
     */
    async uploadFile(file, parentId, parentType) {
        const formData = new FormData();
        formData.append('file', file);
        if (parentId) formData.append('parent_id', parentId);
        if (parentType) formData.append('parent_type', parentType);

        const url = new URL(this.baseUrl + '/files', window.location.origin);
        
        try {
            showLoading(true);
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const error = new Error(errorData.error || 'Ошибка при загрузке файла');
                error.status = response.status;
                error.data = errorData;
                throw error;
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            throw error;
        } finally {
            showLoading(false);
        }
    }

    /**
     * Получение URL для файла
     */
    getFileUrl(fileId) {
        return `${this.baseUrl}/files/${fileId}`;
    }
}

// Функция для отображения индикатора загрузки
function showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.toggle('hidden', !isLoading);
    }
}

// Функция для отображения сообщения об ошибке
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Скрыть сообщение через 5 секунд
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
}

// Создаем глобальный экземпляр API клиента
const api = new ApiClient(); 