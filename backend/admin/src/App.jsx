import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Импортируем страницы
import Dashboard from './pages/Dashboard';
import Categories from './pages/categories/Categories';
import CategoryForm from './pages/categories/CategoryForm';
import Subcategories from './pages/categories/Subcategories';
import SubcategoryForm from './pages/categories/SubcategoryForm';
import Reviews from './pages/reviews/Reviews';
import ReviewForm from './pages/reviews/ReviewForm';
import Files from './pages/files/Files';
import FileUpload from './pages/files/FileUpload';
import Flowers from './pages/flowers/Flowers';
import FlowerForm from './pages/flowers/FlowerForm';
import Products from './pages/products/Products';
import ProductForm from './pages/products/ProductForm';

// Импортируем новые страницы для управления пользователями
import Users from './pages/users/Users';
import UserDetails from './pages/users/UserDetails';
import UserForm from './pages/users/UserForm';
import ActiveUsers from './pages/users/ActiveUsers';

// Импортируем страницы для управления заказами
import Orders from './pages/orders/Orders';
import OrderDetails from './pages/orders/OrderDetails';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* Категории */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/new" element={<CategoryForm />} />
        <Route path="/categories/:id" element={<CategoryForm />} />
        <Route path="/subcategories" element={<Subcategories />} />
        <Route path="/subcategories/new" element={<SubcategoryForm />} />
        <Route path="/subcategories/:id" element={<SubcategoryForm />} />
        
        {/* Отзывы */}
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reviews/new" element={<ReviewForm />} />
        <Route path="/reviews/:id" element={<ReviewForm />} />
        
        {/* Файлы */}
        <Route path="/files" element={<Files />} />
        <Route path="/files/upload" element={<FileUpload />} />
        
        {/* Цветы */}
        <Route path="/flowers" element={<Flowers />} />
        <Route path="/flowers/new" element={<FlowerForm />} />
        <Route path="/flowers/:id" element={<FlowerForm />} />
        
        {/* Товары */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id" element={<ProductForm />} />

        {/* Пользователи */}
        <Route path="/users" element={<Users />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/users/:id/edit" element={<UserForm />} />
        <Route path="/active-users" element={<ActiveUsers />} />
        
        {/* Заказы */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

        {/* Страница 404 */}
        <Route path="*" element={
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-red-600">Страница не найдена</h1>
            <p className="mt-2">Запрашиваемая страница не существует.</p>
          </div>
        } />
      </Routes>
    </Layout>
  );
}

export default App; 