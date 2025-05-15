import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import DefaultLayout from "@/layouts/default";
import { DateValue, parseDate } from "@internationalized/date";

// Импортируем компоненты из библиотеки UI
import { 
  Card, 
  Divider, 
  RadioGroup, 
  Radio, 
  Input, 
  Button, 
  Textarea, 
  Select, 
  SelectItem, 
  DatePicker
} from "@heroui/react";

// Типы для данных заказа
interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface Address {
  id: number;
  street: string;
  house: string;
  apartment: string;
  floor?: string;
  entrance?: string;
  is_default: boolean;
}

interface OrderData {
  delivery_address_id?: number;
  delivery_address?: {
    street: string;
    house: string;
    apartment: string;
    floor?: string;
    entrance?: string;
  };
  delivery_date: string;
  delivery_time: string;
  payment_method: string;
  recipient_name: string;
  recipient_phone: string;
  comment?: string;
  save_address: boolean;
}

// Компонент страницы оформления заказа
const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Состояния для данных формы
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  
  // Состояние для данных заказа
  const [orderData, setOrderData] = useState<OrderData>({
    delivery_date: '',
    delivery_time: '',
    payment_method: 'cash',
    recipient_name: user?.name || '',
    recipient_phone: user?.phone_number || '',
    comment: '',
    save_address: true
  });
  
  // Состояние для валидации формы
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [useExistingAddress, setUseExistingAddress] = useState(true);
  
  // Загрузка товаров корзины и адресов пользователя
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Получаем товары корзины
        const cartResponse = await fetch("http://localhost:3000/api/cart", {
          credentials: "include",
        });
        
        if (!cartResponse.ok) {
          throw new Error("Не удалось загрузить корзину");
        }
        
        const cartData = await cartResponse.json();
        setCartItems(cartData.items || []);
        
        // Получаем адреса пользователя
        const addressesResponse = await fetch("http://localhost:3000/api/user/addresses", {
          credentials: "include",
        });
        
        if (addressesResponse.ok) {
          const addressesData = await addressesResponse.json();
          setUserAddresses(addressesData || []);
          
          // Если есть адрес по умолчанию, выбираем его
          const defaultAddress = addressesData.find((address: Address) => address.is_default);
          if (defaultAddress) {
            setOrderData(prev => ({
              ...prev,
              delivery_address_id: defaultAddress.id
            }));
          } else if (addressesData.length > 0) {
            setOrderData(prev => ({
              ...prev,
              delivery_address_id: addressesData[0].id
            }));
          } else {
            // Если адресов нет, предлагаем ввести новый
            setUseExistingAddress(false);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        console.error("Ошибка при загрузке данных:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Проверка, если корзина пуста - редирект
  useEffect(() => {
    if (!isLoading && cartItems.length === 0 && !orderSuccess) {
      navigate("/cart");
    }
  }, [cartItems, isLoading, navigate, orderSuccess]);

  // Расчет общей суммы заказа
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Обработчик изменения полей формы
  const handleChange = (field: string, value: any) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Сброс ошибки для поля, если она была
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Обработчик переключения между существующим и новым адресом
  const toggleAddressType = (useExisting: boolean) => {
    setUseExistingAddress(useExisting);
    
    // Сброс предыдущих данных адреса
    if (useExisting) {
      const defaultAddress = userAddresses.find(addr => addr.is_default);
      setOrderData(prev => ({
        ...prev,
        delivery_address_id: defaultAddress?.id || userAddresses[0]?.id,
        delivery_address: undefined
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        delivery_address_id: undefined,
        delivery_address: {
          street: '',
          house: '',
          apartment: '',
          floor: '',
          entrance: ''
        }
      }));
    }
  };

  // Валидация формы для каждого шага
  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 0) {
      // Валидация адреса доставки
      if (useExistingAddress) {
        if (!orderData.delivery_address_id) {
          errors.delivery_address_id = "Выберите адрес доставки";
        }
      } else {
        if (!orderData.delivery_address?.street) {
          errors.street = "Укажите улицу";
        }
        if (!orderData.delivery_address?.house) {
          errors.house = "Укажите дом";
        }
        if (!orderData.delivery_address?.apartment) {
          errors.apartment = "Укажите квартиру/офис";
        }
      }
    } else if (currentStep === 1) {
      // Валидация даты и времени доставки
      if (!orderData.delivery_date) {
        errors.delivery_date = "Выберите дату доставки";
      }
      if (!orderData.delivery_time) {
        errors.delivery_time = "Выберите время доставки";
      }
    } else if (currentStep === 2) {
      // Валидация данных получателя
      if (!orderData.recipient_name) {
        errors.recipient_name = "Укажите имя получателя";
      }
      if (!orderData.recipient_phone) {
        errors.recipient_phone = "Укажите телефон получателя";
      } else if (!/^\+?\d{10,12}$/.test(orderData.recipient_phone)) {
        errors.recipient_phone = "Укажите корректный номер телефона";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Переход к следующему шагу формы
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Переход к предыдущему шагу формы
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Отправка заказа
  const submitOrder = async () => {
    if (!validateStep()) return;
    
    try {
      setIsLoading(true);
      
      const orderPayload = {
        ...orderData,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };
      
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload),
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Не удалось создать заказ");
      }
      
      const result = await response.json();
      setOrderSuccess(true);
      setOrderNumber(result.order_id);
      
      // Очищаем корзину после успешного заказа
      await fetch("http://localhost:3000/api/cart/clear", {
        method: "DELETE",
        credentials: "include"
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      console.error("Ошибка при оформлении заказа:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Возврат в каталог после успешного заказа
  const backToCatalog = () => {
    navigate("/catalog");
  };

  // Генерация временных слотов для выбора времени доставки
  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 9; hour <= 20; hour++) {
      timeSlots.push(`${hour}:00`);
      if (hour < 20) {
        timeSlots.push(`${hour}:30`);
      }
    }
    return timeSlots;
  };

  // Массив шагов оформления заказа
  const steps = ["Адрес", "Дата доставки", "Получатель", "Подтверждение"];

  // Рендеринг содержимого в зависимости от состояния
  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">Загрузка...</div>
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
            <Button color="primary" className="mt-4" onPress={() => navigate("/cart")}>
              Вернуться в корзину
            </Button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  // Если заказ успешно оформлен
  if (orderSuccess) {
    return (
      <DefaultLayout>
        <div className="max-w-4xl mx-auto p-4">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-success text-5xl mb-4">✓</div>
              <h1 className="text-2xl font-bold mb-2">Заказ успешно оформлен!</h1>
              <p className="mb-4">Номер вашего заказа: <span className="font-semibold">{orderNumber}</span></p>
              <p className="mb-6">Мы отправили детали заказа на вашу электронную почту. Вы также можете отслеживать статус заказа в разделе "Мои заказы".</p>
              <Button color="primary" onPress={backToCatalog}>
                Продолжить покупки
              </Button>
            </div>
          </Card>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Оформление заказа</h1>
        
        {/* Кастомный индикатор шагов */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : 'text-default-400'}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      index < currentStep ? 'bg-primary text-white' : 
                      index === currentStep ? 'border-2 border-primary' : 
                      'border border-default-200'
                    }`}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="text-xs sm:text-sm">{step}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-3 mx-4">
              <div className="absolute top-0 h-1 bg-default-200 w-full"></div>
              <div 
                className="absolute top-0 h-1 bg-primary" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              {currentStep === 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Адрес доставки</h2>
                  
                  {userAddresses.length > 0 && (
                    <div className="mb-4">
                      <RadioGroup 
                        value={useExistingAddress ? "existing" : "new"}
                        onValueChange={(value) => toggleAddressType(value === "existing")}
                      >
                        <Radio value="existing">Выбрать из сохраненных адресов</Radio>
                        <Radio value="new">Указать новый адрес</Radio>
                      </RadioGroup>
                    </div>
                  )}
                  
                  {useExistingAddress && userAddresses.length > 0 ? (
                    <div>
                      <Select 
                        label="Выберите адрес" 
                        value={orderData.delivery_address_id?.toString() || ""}
                        onChange={(e) => handleChange("delivery_address_id", parseInt(e.target.value))}
                        errorMessage={formErrors.delivery_address_id}
                        isInvalid={!!formErrors.delivery_address_id}
                      >
                        {userAddresses.map(address => (
                          <SelectItem key={address.id}>
                            {address.street}, д. {address.house}, кв. {address.apartment} 
                            {address.is_default && " (По умолчанию)"}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Input 
                        label="Улица" 
                        placeholder="Введите название улицы"
                        value={orderData.delivery_address?.street || ""}
                        onChange={(e) => handleChange("delivery_address", {
                          ...orderData.delivery_address,
                          street: e.target.value
                        })}
                        errorMessage={formErrors.street}
                        isInvalid={!!formErrors.street}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          label="Дом" 
                          placeholder="Номер дома"
                          value={orderData.delivery_address?.house || ""}
                          onChange={(e) => handleChange("delivery_address", {
                            ...orderData.delivery_address,
                            house: e.target.value
                          })}
                          errorMessage={formErrors.house}
                          isInvalid={!!formErrors.house}
                        />
                        
                        <Input 
                          label="Квартира/офис" 
                          placeholder="Номер квартиры"
                          value={orderData.delivery_address?.apartment || ""}
                          onChange={(e) => handleChange("delivery_address", {
                            ...orderData.delivery_address,
                            apartment: e.target.value
                          })}
                          errorMessage={formErrors.apartment}
                          isInvalid={!!formErrors.apartment}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          label="Подъезд" 
                          placeholder="Номер подъезда"
                          value={orderData.delivery_address?.entrance || ""}
                          onChange={(e) => handleChange("delivery_address", {
                            ...orderData.delivery_address,
                            entrance: e.target.value
                          })}
                        />
                        
                        <Input 
                          label="Этаж" 
                          placeholder="Номер этажа"
                          value={orderData.delivery_address?.floor || ""}
                          onChange={(e) => handleChange("delivery_address", {
                            ...orderData.delivery_address,
                            floor: e.target.value
                          })}
                        />
                      </div>
                      
                      {!useExistingAddress && (
                        <div className="mt-2">
                          <RadioGroup 
                            orientation="horizontal"
                            value={orderData.save_address ? "yes" : "no"}
                            onValueChange={(value) => handleChange("save_address", value === "yes")}
                          >
                            <Radio value="yes">Сохранить адрес</Radio>
                            <Radio value="no">Не сохранять</Radio>
                          </RadioGroup>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Дата и время доставки</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <DatePicker 
                        label="Дата доставки"
                        minValue={parseDate(new Date().toISOString().split('T')[0])}
                        value={orderData.delivery_date ? parseDate(orderData.delivery_date) : undefined}
                        onChange={(date) => {
                          if (date) {
                            const formattedDate = date.toString();
                            handleChange("delivery_date", formattedDate);
                          }
                        }}
                        errorMessage={formErrors.delivery_date}
                        isInvalid={!!formErrors.delivery_date}
                      />
                      <p className="text-sm text-default-500 mt-1">Доставка возможна начиная со следующего дня</p>
                    </div>
                    
                    <div>
                      <Select 
                        label="Время доставки"
                        placeholder="Выберите время"
                        value={orderData.delivery_time}
                        onChange={(e) => handleChange("delivery_time", e.target.value)}
                        errorMessage={formErrors.delivery_time}
                        isInvalid={!!formErrors.delivery_time}
                      >
                        {generateTimeSlots().map((time) => (
                          <SelectItem key={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </Select>
                      <p className="text-sm text-default-500 mt-1">Доставка осуществляется с 9:00 до 21:00</p>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Данные получателя</h2>
                  
                  <div className="space-y-4">
                    <Input 
                      label="Имя получателя" 
                      placeholder="Введите имя"
                      value={orderData.recipient_name}
                      onChange={(e) => handleChange("recipient_name", e.target.value)}
                      errorMessage={formErrors.recipient_name}
                      isInvalid={!!formErrors.recipient_name}
                    />
                    
                    <Input 
                      label="Телефон получателя" 
                      placeholder="+7XXXXXXXXXX"
                      value={orderData.recipient_phone}
                      onChange={(e) => handleChange("recipient_phone", e.target.value)}
                      errorMessage={formErrors.recipient_phone}
                      isInvalid={!!formErrors.recipient_phone}
                    />
                    
                    <div>
                      <h3 className="font-semibold mb-2">Способ оплаты</h3>
                      <RadioGroup 
                        orientation="vertical"
                        value={orderData.payment_method}
                        onValueChange={(value) => handleChange("payment_method", value)}
                      >
                        <Radio value="cash">Наличными при получении</Radio>
                        <Radio value="card">Картой при получении</Radio>
                        <Radio value="online">Оплата онлайн</Radio>
                      </RadioGroup>
                    </div>
                    
                    <Textarea 
                      label="Комментарий к заказу" 
                      placeholder="Дополнительная информация для курьера"
                      value={orderData.comment || ""}
                      onChange={(e) => handleChange("comment", e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Подтверждение заказа</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Адрес доставки</h3>
                      {useExistingAddress && orderData.delivery_address_id ? (
                        <p>
                          {(() => {
                            const address = userAddresses.find(a => a.id === orderData.delivery_address_id);
                            return address ? `${address.street}, д. ${address.house}, кв. ${address.apartment}${address.entrance ? `, подъезд ${address.entrance}` : ''}${address.floor ? `, этаж ${address.floor}` : ''}` : '';
                          })()}
                        </p>
                      ) : (
                        <p>
                          {orderData.delivery_address?.street}, д. {orderData.delivery_address?.house}, кв. {orderData.delivery_address?.apartment}
                          {orderData.delivery_address?.entrance ? `, подъезд ${orderData.delivery_address?.entrance}` : ''}
                          {orderData.delivery_address?.floor ? `, этаж ${orderData.delivery_address?.floor}` : ''}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Дата и время доставки</h3>
                      <p>{new Date(orderData.delivery_date).toLocaleDateString('ru-RU')} в {orderData.delivery_time}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Получатель</h3>
                      <p>{orderData.recipient_name}, тел: {orderData.recipient_phone}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Способ оплаты</h3>
                      <p>
                        {orderData.payment_method === 'cash' && 'Наличными при получении'}
                        {orderData.payment_method === 'card' && 'Картой при получении'}
                        {orderData.payment_method === 'online' && 'Оплата онлайн'}
                      </p>
                    </div>
                    
                    {orderData.comment && (
                      <div>
                        <h3 className="font-semibold">Комментарий</h3>
                        <p>{orderData.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                {currentStep > 0 && (
                  <Button 
                    variant="flat" 
                    color="default" 
                    onPress={prevStep}
                  >
                    Назад
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button 
                    color="primary" 
                    onPress={nextStep}
                    className={currentStep === 0 ? "ml-auto" : ""}
                  >
                    Далее
                  </Button>
                ) : (
                  <Button 
                    color="primary" 
                    onPress={submitOrder}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                  >
                    Оформить заказ
                  </Button>
                )}
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
              
              <div className="max-h-80 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 mb-3">
                    <img 
                      src={item.image_url} 
                      alt={item.product_name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <div className="flex justify-between text-sm mt-1">
                        <span>{item.quantity} шт.</span>
                        <span>{(item.price * item.quantity).toLocaleString()} ₽</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Divider className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>{calculateTotal().toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка</span>
                  <span>Бесплатно</span>
                </div>
              </div>
              
              <Divider className="my-4" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Итого</span>
                <span>{calculateTotal().toLocaleString()} ₽</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CheckoutPage; 