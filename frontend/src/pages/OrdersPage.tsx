import { useAuth } from "../providers/AuthProvider";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Типы для заказов
interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface Order {
  id: number;
  order_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  total_amount: number;
  delivery_address: string;
  delivery_date: string | null;
  items: OrderItem[];
}

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Загрузка заказов
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch("/api/orders", {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Не удалось загрузить заказы");
        }
        
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        console.error("Ошибка при загрузке заказов:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Отмена заказа
  const cancelOrder = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось отменить заказ");
      }
      
      // Обновляем состояние
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "cancelled" as const } 
            : order
        )
      );
    } catch (err) {
      console.error("Ошибка при отмене заказа:", err);
    }
  };

  // Преобразование статуса в русский текст
  const getStatusText = (status: Order["status"]) => {
    const statusMap = {
      pending: "Ожидает обработки",
      processing: "В обработке",
      shipped: "Отправлен",
      delivered: "Доставлен",
      cancelled: "Отменен",
    };
    return statusMap[status];
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Расчет общей суммы заказа
  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Переключение расширенного просмотра заказа
  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (isLoading) {
    return <div className="loading">Загрузка заказов...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="orders-page">
      <h1>Мои заказы</h1>
      
      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>У вас пока нет заказов</p>
          <Link to="/catalog" className="button">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                <div className="order-info">
                  <span className="order-number">Заказ №{order.order_number}</span>
                  <span className="order-date">{formatDate(order.created_at)}</span>
                </div>
                
                <div className="order-status">
                  <span className={`status-badge status-${order.status}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                
                <div className="order-total">
                  <span>{order.total_amount.toLocaleString()} ₽</span>
                </div>
                
                <button className="toggle-details">
                  {expandedOrderId === order.id ? "Свернуть" : "Подробнее"}
                </button>
              </div>
              
              {expandedOrderId === order.id && (
                <div className="order-details">
                  <div className="delivery-info">
                    <h3>Информация о доставке</h3>
                    <p><strong>Адрес:</strong> {order.delivery_address}</p>
                    {order.delivery_date && (
                      <p><strong>Дата доставки:</strong> {formatDate(order.delivery_date)}</p>
                    )}
                  </div>
                  
                  <div className="order-items">
                    <h3>Товары в заказе</h3>
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <img 
                          src={item.image_url} 
                          alt={item.product_name} 
                          className="item-image"
                        />
                        
                        <div className="item-details">
                          <h4>{item.product_name}</h4>
                          <div className="item-quantity">Количество: {item.quantity}</div>
                          <div className="item-price">{item.price.toLocaleString()} ₽</div>
                        </div>
                        
                        <div className="item-total">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {order.status === "pending" && (
                    <button 
                      className="cancel-order-button"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Отменить заказ
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 