import { useAuth } from "../providers/AuthProvider";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import api from "@/config/api";
import { 
  Card, 
  Button, 
  Badge, 
  Spinner,
  Accordion,
  AccordionItem,
  Divider
} from "@heroui/react";

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
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка заказов
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        const data = await api.get("/orders");
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
  const cancelOrder = async (orderId: number, e: any) => {
    e.stopPropagation(); // Останавливаем всплытие события
    
    try {
      await api.post(`/orders/${orderId}/cancel`);
      
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
      alert("Не удалось отменить заказ. Пожалуйста, попробуйте позже.");
    }
  };

  // Преобразование статуса в русский текст и цвет
  const getStatusBadge = (status: Order["status"]) => {
    const statusMap = {
      pending: { text: "Ожидает обработки", color: "warning" as const },
      processing: { text: "В обработке", color: "primary" as const },
      shipped: { text: "Отправлен", color: "success" as const },
      delivered: { text: "Доставлен", color: "success" as const },
      cancelled: { text: "Отменен", color: "danger" as const },
    };
    
    const statusInfo = statusMap[status];
    return <Badge color={statusInfo.color}>{statusInfo.text}</Badge>;
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">
          <Spinner size="lg" color="primary" />
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold text-danger mb-4">{error}</h2>
            <p className="mb-6">Не удалось загрузить историю заказов.</p>
            <Button 
              color="primary" 
              onPress={() => navigate("/")}
            >
              На главную
            </Button>
          </Card>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">История заказов</h1>
        
        {orders.length === 0 ? (
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">У вас пока нет заказов</h2>
            <p className="text-default-500 mb-6">
              Здесь будет отображаться история ваших заказов после их оформления
            </p>
            <Button 
              color="primary" 
              onPress={() => navigate("/catalog")}
            >
              Перейти в каталог
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <Accordion variant="splitted">
              {orders.map(order => (
                <AccordionItem 
                  key={order.id} 
                  aria-label={`Заказ №${order.order_number}`}
                  title={
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex-1">
                        <p className="font-semibold">
                          Заказ #{order.order_number}
                        </p>
                        <p className="text-sm text-default-500">
                          от {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-right font-semibold">
                          {order.total_amount.toLocaleString()} ₽
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="pt-2 pb-4">
                    <div className="mb-4">
                      <p className="text-sm text-default-500 mb-1">Адрес доставки</p>
                      <p>{order.delivery_address}</p>
                    </div>
                    
                    {order.delivery_date && (
                      <div className="mb-4">
                        <p className="text-sm text-default-500 mb-1">Дата доставки</p>
                        <p>{formatDate(order.delivery_date)}</p>
                      </div>
                    )}
                    
                    <Divider className="my-4" />
                    
                    <h3 className="font-semibold mb-2">Товары в заказе</h3>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img 
                            src={item.image_url} 
                            alt={item.product_name} 
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{item.product_name}</p>
                            <p className="text-xs text-default-500">
                              {item.price.toLocaleString()} ₽ × {item.quantity} шт.
                            </p>
                          </div>
                          <div className="font-medium text-sm">
                            {(item.price * item.quantity).toLocaleString()} ₽
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <div className="flex gap-2">
                        {order.status === "pending" && (
                          <Button 
                            size="sm"
                            color="danger" 
                            variant="flat"
                            onPress={(e) => cancelOrder(order.id, e)}
                          >
                            Отменить
                          </Button>
                        )}
                      </div>
                      <Button 
                        size="sm"
                        color="primary" 
                        onPress={() => navigate(`/orders/${order.id}`)}
                      >
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default OrdersPage; 