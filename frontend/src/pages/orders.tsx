import { useState } from "react";
import { Button, Chip, Card, CardBody, CardHeader, CardFooter, Accordion, AccordionItem } from "@heroui/react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const OrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Временные демо-данные для страницы
  const demoOrders = [
    {
      id: "order-123",
      total_price: 4500,
      delivery_address: "г. Москва, ул. Цветочная, д. 1, кв. 10",
      delivery_date: "2024-05-15",
      delivery_time: "12:00-15:00",
      status: "completed",
      created_at: "2024-05-12T10:23:45Z",
      items: [
        {
          id: "item-1",
          product_id: "p1",
          product_name: "Букет 'Весеннее настроение'",
          price: 2500,
          quantity: 1
        },
        {
          id: "item-2",
          product_id: "p2",
          product_name: "Букет роз '5 красных роз'",
          price: 2000,
          quantity: 1
        }
      ]
    },
    {
      id: "order-124",
      total_price: 3200,
      delivery_address: "г. Москва, ул. Цветочная, д. 1, кв. 10",
      delivery_date: "2024-05-01",
      delivery_time: "16:00-19:00",
      status: "canceled",
      created_at: "2024-04-30T15:10:22Z",
      items: [
        {
          id: "item-3",
          product_id: "p3",
          product_name: "Букет роз '11 красных роз'",
          price: 3200,
          quantity: 1
        }
      ]
    }
  ];

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Получение статуса заказа
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "new":
        return { label: "Новый", color: "primary" };
      case "processing":
        return { label: "В обработке", color: "warning" };
      case "delivering":
        return { label: "Доставляется", color: "warning" };
      case "completed":
        return { label: "Выполнен", color: "success" };
      case "canceled":
        return { label: "Отменен", color: "danger" };
      default:
        return { label: "Неизвестный статус", color: "default" };
    }
  };

  // Если пользователь не авторизован или у него нет заказов
  if (!isAuthenticated || demoOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Мои заказы</h1>
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-xl font-medium mb-2">У вас пока нет заказов</h2>
        <p className="text-gray-500 mb-6">Оформите первый заказ, чтобы увидеть его здесь</p>
        <Button as={Link} to="/catalog" color="primary">
          Перейти в каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Мои заказы</h1>
      
      <div className="space-y-4">
        {demoOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          
          return (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-50">
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Заказ №{order.id.split('-')[1]} от {formatDate(order.created_at)}
                  </div>
                  <div className="font-semibold">{formatPrice(order.total_price)}</div>
                </div>
                <Chip color={statusInfo.color as any} variant="flat">
                  {statusInfo.label}
                </Chip>
              </CardHeader>
              
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Адрес доставки:</div>
                    <div>{order.delivery_address}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Дата доставки:</div>
                      <div>{formatDate(order.delivery_date)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Время доставки:</div>
                      <div>{order.delivery_time}</div>
                    </div>
                  </div>
                  
                  <Accordion>
                    <AccordionItem key="1" title="Состав заказа">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between py-2 border-b">
                            <div>
                              <div className="font-medium">
                                {item.product_name} × {item.quantity}
                              </div>
                            </div>
                            <div className="font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardBody>
              
              {order.status === "completed" && (
                <CardFooter>
                  <Button variant="flat" color="primary" className="w-full sm:w-auto">
                    Повторить заказ
                  </Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage; 