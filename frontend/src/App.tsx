import { Route, Routes, Navigate } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider";
import CartProvider from "./providers/CartProvider";
import PrivateRoute from "./components/PrivateRoute";

// Публичные страницы
import IndexPage from "@/pages/index";
import ProductDetailPage from "@/pages/ProductDetailPage";
import AboutPage from "@/pages/AboutPage";
import DeliveryPage from "@/pages/DeliveryPage";
import ContactsPage from "@/pages/ContactsPage";
import CatalogPage from "@/pages/CatalogPage";
import AllProductsCatalogPage from "@/pages/AllProductsCatalogPage";

// Страницы авторизации
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Приватные страницы
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductCatalogPage from "./pages/ProductCatalogPage";
import OrderDetailPage from "./pages/OrderDetailPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/catalog" index element={<CatalogPage />} />
          <Route path="/catalog/all" element={<AllProductsCatalogPage />} />
          <Route path="/catalog/:id" element={<ProductCatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          
          {/* Страницы авторизации */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Защищенные маршруты */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            } 
          />
          <Route path="/cart" element={<CartPage />} />
          <Route 
            path="/checkout" 
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/orders/:id" 
            element={
              <PrivateRoute>
                <OrderDetailPage />
              </PrivateRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/catalog" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
