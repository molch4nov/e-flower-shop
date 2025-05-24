import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from "react";

// Типы для корзины
export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: string;
  quantity: number;
  image_url: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isProductInCart: (productId: number | string) => boolean;
  getProductQuantity: (productId: number | string) => number;
}

// Создаем контекст корзины
const CartContext = createContext<CartContextType | null>(null);

// Типизация пропсов провайдера
interface CartProviderProps {
  children: ReactNode;
}

// Провайдер корзины
const CartProvider = ({ children }: CartProviderProps) => {
  // Состояние для хранения данных корзины
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения содержимого корзины (обёрнутая в useCallback)
  const fetchCart = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:3000/api/cart", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось загрузить корзину");
      }
      
      const data = await response.json();
      setCartItems(data.items || []);
      calculateTotalItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка при загрузке корзины");
      console.error("Ошибка при загрузке корзины:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Расчет общего количества товаров
  const calculateTotalItems = useCallback((items: CartItem[]): void => {
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(total);
  }, []);

  // Обновление количества товара
  const updateQuantity = useCallback(async (itemId: string, quantity: number): Promise<void> => {
    try {
      if (quantity < 1) return;
      
      const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось обновить количество товара");
      }
      
      // Обновляем локальное состояние
      setCartItems(prevItems => {
        const updatedItems = prevItems.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        );
        calculateTotalItems(updatedItems);
        return updatedItems;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка при обновлении количества");
      console.error("Ошибка при обновлении количества:", err);
    }
  }, [calculateTotalItems]);

  // Добавление товара в корзину
  const addToCart = useCallback(async (productId: number | string, quantity: number): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity
        }),
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Не удалось добавить товар в корзину");
      }
      
      // Обновляем корзину после добавления
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка при добавлении товара");
      console.error("Ошибка при добавлении в корзину:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart]);

  // Удаление товара из корзины
  const removeItem = useCallback(async (productId: string): Promise<void> => {
    console.log(cartItems, productId);
    try {
      const itemId = cartItems.find(item => item.product_id === productId)?.id;
      if (!itemId) {
        throw new Error("Товар не найден в корзине");
      }
      const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось удалить товар из корзины");
      }
      
      // Обновляем локальное состояние
      setCartItems(prevItems => {
        const updatedItems = prevItems.filter(item => item.id !== itemId);
        calculateTotalItems(updatedItems);
        return updatedItems;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка при удалении товара");
      console.error("Ошибка при удалении товара:", err);
    }
  }, [cartItems]);

  // Очистка корзины
  const clearCart = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось очистить корзину");
      }
      
      // Очищаем локальное состояние
      setCartItems([]);
      setTotalItems(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка при очистке корзины");
      console.error("Ошибка при очистке корзины:", err);
    }
  }, []);

  // Проверка, есть ли товар в корзине
  const isProductInCart = useCallback((productId: number | string): boolean => {
    return cartItems.some(item => item.product_id === productId);
  }, [cartItems]);

  // Получение количества товара в корзине
  const getProductQuantity = useCallback((productId: number | string): number => {
    const item = cartItems.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  // Обновление корзины
  const refreshCart = useCallback(async (): Promise<void> => {
    await fetchCart();
  }, [fetchCart]);

  // Загружаем содержимое корзины при инициализации
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Предоставляем контекст корзины
  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        isLoading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        isProductInCart,
        getProductQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Хук для использования контекста корзины
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart должен использоваться внутри CartProvider");
  }
  return context;
};

export default CartProvider; 