import { Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

import IndexPage from "@/pages/index";
import CatalogPage from "@/pages/catalog";
import BouquetsPage from "@/pages/bouquets";
import ProductPage from "@/pages/product";
import CartPage from "@/pages/cart";
import ProfilePage from "@/pages/profile";
import OrdersPage from "@/pages/orders";
import AboutPage from "@/pages/about";
import NotFoundPage from "@/pages/404";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout><IndexPage /></MainLayout>} path="/" />
      <Route element={<MainLayout><CatalogPage /></MainLayout>} path="/catalog" />
      <Route element={<MainLayout><BouquetsPage /></MainLayout>} path="/bouquets" />
      <Route element={<MainLayout><ProductPage /></MainLayout>} path="/product/:id" />
      <Route element={<MainLayout><CartPage /></MainLayout>} path="/cart" />
      <Route element={<MainLayout><ProfilePage /></MainLayout>} path="/profile" />
      <Route element={<MainLayout><OrdersPage /></MainLayout>} path="/orders" />
      <Route element={<MainLayout><AboutPage /></MainLayout>} path="/about" />
      <Route element={<MainLayout><LoginPage /></MainLayout>} path="/login" />
      <Route element={<MainLayout><RegisterPage /></MainLayout>} path="/register" />
      <Route element={<MainLayout><NotFoundPage /></MainLayout>} path="*" />
    </Routes>
  );
}

export default App;
