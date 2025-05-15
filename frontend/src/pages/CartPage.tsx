import DefaultLayout from "@/layouts/default";
import { useAuth } from "../providers/AuthProvider";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Divider } from "@heroui/react";
import { useCart, CartItem } from "../providers/CartProvider";

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    cartItems, 
    isLoading, 
    error, 
    updateQuantity, 
    removeItem, 
    totalItems, 
    refreshCart 
  } = useCart();

  // Обновляем корзину при монтировании компонента
  useEffect(() => {
    refreshCart();
  }, []);

  // Расчет общей суммы
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (Number(item.product_price) * item.quantity), 0);
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-danger-100 text-danger p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Ошибка</h2>
            <p>{error}</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Корзина</h1>
        
        {cartItems.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-default-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg text-default-600">Ваша корзина пуста</p>
              <p className="text-default-500 mb-4">Добавьте товары, чтобы продолжить покупки</p>
              <Button 
                color="primary" 
                onPress={() => navigate("/catalog")}
              >
                Перейти в каталог
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-default-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-default-600">Товар</th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-default-600">Цена</th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-default-600">Количество</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-default-600">Сумма</th>
                        <th className="py-3 px-4 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item.id} className="hover:bg-default-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-16 h-16 min-w-[4rem] bg-default-100 rounded-md overflow-hidden mr-4">
                                <img 
                                  src={item.image_url || "/placeholder-product.jpg"} 
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <Link
                                  to={`/product/${item.product_id}`}
                                  className="font-medium text-primary hover:text-primary-600"
                                >
                                  {item.product_name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {item.product_price} ₽
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center space-x-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  item.quantity <= 1 
                                    ? 'bg-default-100 text-default-400 cursor-not-allowed' 
                                    : 'bg-default-100 hover:bg-default-200 text-default-700'
                                }`}
                              >
                                <span className="text-lg">-</span>
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-default-100 hover:bg-default-200 text-default-700"
                              >
                                <span className="text-lg">+</span>
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {(Number(item.product_price) * item.quantity)} ₽
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-danger hover:text-danger-600"
                              aria-label="Удалить товар"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-default-600">Товары ({totalItems})</span>
                    <span>{calculateTotal()} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-600">Доставка</span>
                    <span>Бесплатно</span>
                  </div>
                </div>
                
                <Divider className="my-4" />
                
                <div className="flex justify-between items-center font-bold text-lg mb-6">
                  <span>Итого:</span>
                  <span>{calculateTotal()} ₽</span>
                </div>
                
                <Button 
                  color="primary" 
                  size="lg" 
                  className="w-full" 
                  onPress={() => navigate("/checkout")}
                >
                  Оформить заказ
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CartPage; 