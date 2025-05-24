import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { 
  Card, 
  Button, 
  Divider, 
  Badge, 
  Spinner,
  Progress,
  Image
} from "@heroui/react";
import api from "@/config/api";

// Типы для заказа
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
  delivery_time: string | null;
  payment_method: string;
  payment_status: "paid" | "pending" | "failed";
  notes: string | null;
  items: OrderItem[];
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Загрузка данных заказа
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        
        const data = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        console.error("Ошибка при загрузке заказа:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchOrder();
    }
  }, [id]);
  
  // Отмена заказа
  const cancelOrder = async () => {
    try {
      await api.post(`/orders/${id}/cancel`);
      
      // Обновляем статус заказа
      setOrder(prev => prev ? { ...prev, status: "cancelled" } : null);
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
  
  // Получение прогресса заказа
  const getOrderProgress = (status: Order["status"]) => {
    const progressMap = {
      pending: 25,
      processing: 50,
      shipped: 75,
      delivered: 100,
      cancelled: 0,
    };
    
    return progressMap[status];
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
  
  // Форматирование даты без времени
  const formatShortDate = (dateString: string) => {
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
  
  if (error || !order) {
    return (
      <DefaultLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold text-danger mb-4">
              {error || "Заказ не найден"}
            </h2>
            <p className="mb-6">Не удалось загрузить информацию о заказе.</p>
            <Button 
              color="primary" 
              onPress={() => navigate("/profile")}
            >
              Вернуться в профиль
            </Button>
          </Card>
        </div>
      </DefaultLayout>
    );
  }
  
  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Заказ #{order.order_number}</h1>
          <Button 
            variant="light" 
            onPress={() => navigate("/profile")}
          >
            Назад к списку заказов
          </Button>
        </div>
        
        {/* Статус заказа и прогресс */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-default-500 mb-1">Статус заказа</p>
              <div className="flex items-center gap-2">
                {getStatusBadge(order.status)}
                <span className="text-sm">
                  от {formatDate(order.created_at)}
                </span>
              </div>
            </div>
            
            {order.status === "pending" && (
              <Button 
                color="danger" 
                variant="flat" 
                onPress={cancelOrder}
              >
                Отменить заказ
              </Button>
            )}
          </div>
          
          {order.status !== "cancelled" && (
            <div className="mt-4">
              <Progress 
                value={getOrderProgress(order.status)} 
                color="primary"
                showValueLabel={false}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-default-500">
                <span>Оформлен</span>
                <span>В обработке</span>
                <span>Отправлен</span>
                <span>Доставлен</span>
              </div>
            </div>
          )}
        </Card>
        
        {/* Информация о доставке */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Информация о доставке</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-default-500 mb-1">Адрес доставки</p>
              <p className="font-medium">{order.delivery_address}</p>
            </div>
            
            {order.delivery_date && (
              <div>
                <p className="text-sm text-default-500 mb-1">Дата доставки</p>
                <p className="font-medium">
                  {formatShortDate(order.delivery_date)}
                  {order.delivery_time && `, ${order.delivery_time}`}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-default-500 mb-1">Способ оплаты</p>
              <p className="font-medium">{order.payment_method}</p>
            </div>
            
            <div>
              <p className="text-sm text-default-500 mb-1">Статус оплаты</p>
              <Badge 
                color={order.payment_status === "paid" ? "success" : 
                      order.payment_status === "pending" ? "warning" : "danger"}
              >
                {order.payment_status === "paid" ? "Оплачен" : 
                 order.payment_status === "pending" ? "Ожидает оплаты" : "Ошибка оплаты"}
              </Badge>
            </div>
          </div>
          
          {order.notes && (
            <div className="mt-4">
              <p className="text-sm text-default-500 mb-1">Примечание к заказу</p>
              <p>{order.notes}</p>
            </div>
          )}
        </Card>
        
        {/* Товары в заказе */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Товары в заказе</h2>
          
          <div className="divide-y divide-default-200">
            {order.items.map(item => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                <img 
                  src={item.image_url} 
                  alt={item.product_name} 
                  className="w-16 h-16 object-cover rounded-md"
                />
                
                <div className="flex-grow">
                  <h3 className="font-medium">{item.product_name}</h3>
                  <p className="text-sm text-default-500">
                    {item.price.toLocaleString()} ₽ × {item.quantity} шт.
                  </p>
                </div>
                
                <div className="font-semibold">
                  {(item.price * item.quantity).toLocaleString()} ₽
                </div>
              </div>
            ))}
          </div>
          
          <Divider className="my-4" />
          
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Итого:</span>
            <span>{order.total_amount.toLocaleString()} ₽</span>
          </div>
        </Card>
        
        {/* Кнопки действий */}
        <div className="flex justify-between">
          <Button 
            variant="flat" 
            onPress={() => navigate("/profile")}
          >
            Назад в профиль
          </Button>
          
          {order.status === "delivered" && (
            <Button 
              color="primary" 
              onPress={() => navigate("/catalog")}
            >
              Заказать снова
            </Button>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrderDetailPage; 