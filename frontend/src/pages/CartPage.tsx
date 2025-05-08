import { useAuth } from "../providers/AuthProvider";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Типы для корзины
interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
}

const CartPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка содержимого корзины
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch("/api/cart", {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Не удалось загрузить корзину");
        }
        
        const data = await response.json();
        setCartItems(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        console.error("Ошибка при загрузке корзины:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCart();
  }, []);

  // Обновление количества товара
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      if (quantity < 1) return;
      
      const response = await fetch(`/api/cart/item/${itemId}`, {
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
      
      // Обновляем состояние
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("Ошибка при обновлении количества:", err);
    }
  };

  // Удаление товара из корзины
  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart/item/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось удалить товар из корзины");
      }
      
      // Обновляем состояние
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Ошибка при удалении товара:", err);
    }
  };

  // Расчет общей суммы
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (isLoading) {
    return <div className="loading">Загрузка корзины...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Ваша корзина пуста</p>
          <Link to="/catalog" className="button">Перейти в каталог</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image_url} 
                  alt={item.product_name} 
                  className="item-image"
                />
                
                <div className="item-details">
                  <h3>{item.product_name}</h3>
                  <p className="item-price">{item.price.toLocaleString()} ₽</p>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  {(item.price * item.quantity).toLocaleString()} ₽
                </div>
                
                <button 
                  className="remove-button"
                  onClick={() => removeItem(item.id)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="total-amount">
              <span>Итого:</span>
              <span>{calculateTotal().toLocaleString()} ₽</span>
            </div>
            
            <Link to="/checkout" className="checkout-button">
              Оформить заказ
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 