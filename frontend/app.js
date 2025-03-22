/**
 * Основной файл приложения
 */
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация приложения
    initApp();
    
    // Обработчики навигации
    attachNavigationHandlers();
    
    // Обработчики событий форм
    attachFormHandlers();
});

/**
 * Инициализация приложения
 */
async function initApp() {
    try {
        // Получаем спецификацию OpenAPI
        await api.getApiSpec();
        
        // По умолчанию показываем домашнюю страницу
        showSection('home-section');
        
        // Проверяем соединение с сервером
        await api.request('GET', '/');
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        showError('Не удалось подключиться к серверу. Пожалуйста, проверьте подключение.');
    }
}

/**
 * Прикрепляет обработчики для навигации
 */
function attachNavigationHandlers() {
    // Навигация по основному меню
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home-section');
    });
    
    document.getElementById('products-link').addEventListener('click', async (e) => {
        e.preventDefault();
        await loadProducts();
        showSection('products-section');
    });
    
    document.getElementById('categories-link').addEventListener('click', async (e) => {
        e.preventDefault();
        await loadCategories();
        showSection('categories-section');
    });
    
    document.getElementById('reviews-link').addEventListener('click', async (e) => {
        e.preventDefault();
        await loadReviews();
        showSection('reviews-section');
    });
}

/**
 * Прикрепляет обработчики для форм
 */
function attachFormHandlers() {
    // Форма добавления отзыва
    document.getElementById('add-review-btn').addEventListener('click', () => {
        document.getElementById('review-form-container').classList.remove('hidden');
    });
    
    document.getElementById('cancel-review-btn').addEventListener('click', () => {
        document.getElementById('review-form-container').classList.add('hidden');
        document.getElementById('review-form').reset();
    });
    
    document.getElementById('review-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('review-title').value;
        const description = document.getElementById('review-description').value;
        const rating = parseInt(document.getElementById('review-rating').value);
        
        try {
            await api.createReview({
                title,
                description,
                rating
            });
            
            // Очищаем форму и скрываем её
            document.getElementById('review-form').reset();
            document.getElementById('review-form-container').classList.add('hidden');
            
            // Перезагружаем список отзывов
            await loadReviews();
        } catch (error) {
            showError('Не удалось отправить отзыв: ' + (error.message || 'Ошибка сервера'));
        }
    });
}

/**
 * Отображает только выбранную секцию, скрывает остальные
 */
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }
}

/**
 * Загружает и отображает список товаров
 */
async function loadProducts() {
    try {
        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = ''; // Очищаем контейнер
        
        const products = await api.getProducts();
        
        if (products.length === 0) {
            productsContainer.innerHTML = '<p>Товары не найдены.</p>';
            return;
        }
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'card';
            
            // Изображение, если есть
            let imageHtml = '';
            if (product.files && product.files.length > 0) {
                const imageUrl = api.getFileUrl(product.files[0].id);
                imageHtml = `
                    <div class="card-image">
                        <img src="${imageUrl}" alt="${product.name}">
                    </div>
                `;
            }
            
            // Формируем карточку товара
            productCard.innerHTML = `
                ${imageHtml}
                <div class="card-content">
                    <h3 class="card-title">${product.name}</h3>
                    <p class="card-price">${product.price} ₽</p>
                    <p>${product.description || 'Нет описания'}</p>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        showError('Не удалось загрузить товары: ' + (error.message || 'Ошибка сервера'));
    }
}

/**
 * Загружает и отображает список категорий
 */
async function loadCategories() {
    try {
        const categoriesContainer = document.getElementById('categories-container');
        categoriesContainer.innerHTML = ''; // Очищаем контейнер
        
        const categories = await api.getCategories();
        
        if (categories.length === 0) {
            categoriesContainer.innerHTML = '<p>Категории не найдены.</p>';
            return;
        }
        
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            
            let subcategoriesHtml = '';
            if (category.subcategories && category.subcategories.length > 0) {
                const subcategoryItems = category.subcategories.map(subcategory => 
                    `<div class="subcategory-item">${subcategory.name}</div>`
                ).join('');
                
                subcategoriesHtml = `
                    <div class="subcategory-list">
                        ${subcategoryItems}
                    </div>
                `;
            }
            
            categoryItem.innerHTML = `
                <h3>${category.name}</h3>
                ${subcategoriesHtml}
            `;
            
            categoriesContainer.appendChild(categoryItem);
        });
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        showError('Не удалось загрузить категории: ' + (error.message || 'Ошибка сервера'));
    }
}

/**
 * Загружает и отображает список отзывов
 */
async function loadReviews() {
    try {
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = ''; // Очищаем контейнер
        
        const reviews = await api.getReviews();
        
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>Отзывы не найдены.</p>';
            return;
        }
        
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            // Форматируем дату
            const createdDate = new Date(review.created_at);
            const formattedDate = createdDate.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            // Создаем звездочки для рейтинга
            const starsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
            reviewItem.innerHTML = `
                <div class="review-header">
                    <h3 class="review-title">${review.title}</h3>
                    <span class="review-rating">${starsHtml}</span>
                </div>
                <div class="review-description">${review.description}</div>
                <div class="review-date">${formattedDate}</div>
            `;
            
            reviewsContainer.appendChild(reviewItem);
        });
    } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        showError('Не удалось загрузить отзывы: ' + (error.message || 'Ошибка сервера'));
    }
} 