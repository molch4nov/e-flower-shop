import DefaultLayout from "@/layouts/default";
import { useAuth } from "../providers/AuthProvider";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Divider } from "@heroui/react";
import { useCart } from "../providers/CartProvider";

// Компонент для асинхронной загрузки изображения товара
const ProductImage = ({ productId, productName }: { productId: string; productName: string }) => {
  const [imageSrc, setImageSrc] = useState<string>("/placeholder-product.jpg");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/files/parent/${productId}`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const images = await response.json();
          if (images && images.length > 0) {
            setImageSrc(`http://localhost:3000/api/files/${images[0].id}`);
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-default-200 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc}
      alt={productName}
      className="w-full h-full object-cover"
      onError={() => setImageSrc("/placeholder-product.jpg")}
    />
  );
};

// Компонент элемента корзины для мобильных устройств
const MobileCartItem = ({ item, updateQuantity, removeItem }: { 
  item: any, 
  updateQuantity: (id: string, quantity: number) => void,
  removeItem: (productId: string) => void
}) => {
  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col space-y-3">
        {/* Верхняя часть - изображение и основная информация */}
        <div className="flex items-start space-x-3">
          <div className="w-20 h-20 min-w-[5rem] bg-default-100 rounded-lg overflow-hidden">
            <ProductImage productId={item.product_id} productName={item.product_name} />
          </div>
          <div className="flex-1 min-w-0">
            <Link
              to={`/product/${item.product_id}`}
              className="font-medium text-primary hover:text-primary-600 text-sm leading-5 line-clamp-2"
            >
              {item.product_name}
            </Link>
            <div className="text-lg font-semibold text-default-900 mt-1">
              {item.product_price} ₽
            </div>
          </div>
          <button 
            onClick={() => removeItem(item.product_id)}
            className="text-danger hover:text-danger-600 p-1"
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
        </div>

        {/* Нижняя часть - количество и итоговая сумма */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-default-600">Количество:</span>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                  item.quantity <= 1 
                    ? 'bg-default-100 text-default-400 cursor-not-allowed' 
                    : 'bg-default-100 hover:bg-default-200 text-default-700 active:bg-default-300'
                }`}
              >
                -
              </button>
              <span className="w-10 text-center font-medium text-base">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-default-100 hover:bg-default-200 text-default-700 active:bg-default-300 text-lg"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-default-600">Сумма:</div>
            <div className="font-bold text-lg text-default-900">
              {(Number(item.product_price) * item.quantity)} ₽
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Компонент элемента корзины для десктопных устройств
const DesktopCartItem = ({ item, updateQuantity, removeItem }: { 
  item: any, 
  updateQuantity: (id: string, quantity: number) => void,
  removeItem: (productId: string) => void
}) => {
  return (
    <tr key={item.id} className="hover:bg-default-50">
      <td className="py-4 px-4">
        <div className="flex items-center">
          <div className="w-16 h-16 min-w-[4rem] bg-default-100 rounded-md overflow-hidden mr-4">
            <ProductImage productId={item.product_id} productName={item.product_name} />
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
          onClick={() => removeItem(item.product_id)}
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
  );
};

const CartPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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

  // Обновляем корзину при монтировании компонента (только для авторизованных)
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);

  // Показываем загрузку, пока проверяем авторизацию
  if (authLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  // Если пользователь не авторизован, показываем сообщение
  if (!isAuthenticated) {
    return (
      <DefaultLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Корзина</h1>
          <Card className="p-6 sm:p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 sm:h-16 sm:w-16 text-default-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-base sm:text-lg text-default-600">Для просмотра корзины необходимо авторизоваться</p>
              <p className="text-sm sm:text-base text-default-500 mb-4">Войдите в свой аккаунт, чтобы увидеть добавленные товары</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <Button 
                  color="primary" 
                  size="lg"
                  className="w-full sm:w-auto"
                  onPress={() => navigate("/login", { state: { from: { pathname: "/cart" } } })}
                >
                  Войти
                </Button>
                <Button 
                  variant="bordered" 
                  size="lg"
                  className="w-full sm:w-auto"
                  onPress={() => navigate("/register")}
                >
                  Зарегистрироваться
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </DefaultLayout>
    );
  }

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
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Корзина</h1>
        
        {cartItems.length === 0 ? (
          <Card className="p-6 sm:p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 sm:h-16 sm:w-16 text-default-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-base sm:text-lg text-default-600">Ваша корзина пуста</p>
              <p className="text-sm sm:text-base text-default-500 mb-4">Добавьте товары, чтобы продолжить покупки</p>
              <Button 
                color="primary" 
                size="lg"
                className="w-full sm:w-auto"
                onPress={() => navigate("/catalog")}
              >
                Перейти в каталог
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Список товаров */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              {/* Мобильная версия - карточки */}
              <div className="block lg:hidden">
                {cartItems.map(item => (
                  <MobileCartItem 
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </div>

              {/* Десктопная версия - таблица */}
              <Card className="p-0 overflow-hidden hidden lg:block">
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
                        <DesktopCartItem 
                          key={item.id}
                          item={item}
                          updateQuantity={updateQuantity}
                          removeItem={removeItem}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
            
            {/* Сводка заказа */}
            <div className="order-1 lg:order-2 lg:col-span-1">
              <Card className="p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Ваш заказ</h2>
                
                <div className="space-y-2 text-sm sm:text-base">
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
                
                <div className="flex justify-between items-center font-bold text-base sm:text-lg mb-4 sm:mb-6">
                  <span>Итого:</span>
                  <span>{calculateTotal()} ₽</span>
                </div>
                
                <Button 
                  color="primary" 
                  size="lg" 
                  className="w-full text-base" 
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