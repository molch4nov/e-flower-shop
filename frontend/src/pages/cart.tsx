import { Button, Divider } from "@heroui/react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const { items, total, updateQuantity, removeFromCart, isLoading } = useCart();

  // Временные демо-данные для страницы (будут заменены реальными из useCart)
  const demoItems = [
    {
      id: "1",
      product_id: "p1",
      product_name: "Букет 'Весеннее настроение'",
      product_price: 2500,
      product_type: "bouquet",
      quantity: 1
    },
    {
      id: "2",
      product_id: "p2",
      product_name: "Букет роз '11 красных роз'",
      product_price: 3200,
      product_type: "bouquet",
      quantity: 1
    }
  ];
  
  const demoTotal = 5700;

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Используем либо реальные данные, либо демо
  const cartItems = items.length > 0 ? items : demoItems;
  const cartTotal = items.length > 0 ? total : demoTotal;

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Корзина</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-medium mb-2">Ваша корзина пуста</h2>
          <p className="text-gray-500 mb-6">Добавьте товары в корзину, чтобы оформить заказ</p>
          <Button as={Link} to="/catalog" color="primary">
            Перейти в каталог
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg"
              >
                <div className="h-24 w-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-500">Фото</span>
                </div>
                
                <div className="flex-grow">
                  <Link 
                    to={`/product/${item.product_id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {item.product_name}
                  </Link>
                  
                  <div className="mt-2 flex flex-wrap gap-4 justify-between items-center">
                    <div className="font-semibold">
                      {formatPrice(item.product_price * item.quantity)}
                    </div>
                    
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <Button 
                          isIconOnly 
                          variant="light" 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          aria-label="Уменьшить количество"
                        >
                          -
                        </Button>
                        <span className="px-4">{item.quantity}</span>
                        <Button 
                          isIconOnly 
                          variant="light" 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label="Увеличить количество"
                        >
                          +
                        </Button>
                      </div>
                      
                      <Button 
                        isIconOnly 
                        variant="light" 
                        color="danger"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Удалить товар"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-lg font-semibold mb-4">Ваш заказ</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Товары ({cartItems.length})</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Доставка</span>
                <span>{formatPrice(0)}</span>
              </div>
              
              <Divider />
              
              <div className="flex justify-between font-bold">
                <span>Итого</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              
              <Button 
                as={Link} 
                to="/checkout" 
                color="primary" 
                className="w-full mt-4"
                isLoading={isLoading}
              >
                Оформить заказ
              </Button>
              
              <div className="text-xs text-gray-500 text-center mt-2">
                Нажимая на кнопку, вы соглашаетесь с условиями доставки и оплаты
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 