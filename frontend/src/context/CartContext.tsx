import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/config/api";
import { useAuth } from "./AuthContext";

// Типы данных
interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product_name: string;
  product_price: number;
  product_type: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

// Создаем контекст
const CartContext = createContext<CartContextType | undefined>(undefined);

// Провайдер для контекста
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Загружаем корзину при авторизации
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Если пользователь не авторизован, очищаем корзину
      setItems([]);
      setTotal(0);
    }
  }, [isAuthenticated]);

  // Загрузка корзины
  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await api.cart.get();
      setItems(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление товара в корзину
  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      // Если пользователь не авторизован, перенаправляем на страницу авторизации
      window.location.href = "/login";
      return;
    }
    
    setIsLoading(true);
    try {
      await api.cart.add({ product_id: productId, quantity });
      await loadCart(); // Перезагружаем корзину
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление количества товара
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      await api.cart.update(itemId, quantity);
      await loadCart(); // Перезагружаем корзину
    } catch (error) {
      console.error("Error updating cart item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление товара из корзины
  const removeFromCart = async (itemId: string) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      await api.cart.remove(itemId);
      await loadCart(); // Перезагружаем корзину
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Очистка корзины
  const clearCart = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      await api.cart.clear();
      setItems([]);
      setTotal(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Значение для контекста
  const value = {
    items,
    total,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Хук для использования контекста
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext; 