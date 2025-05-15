import { useAuth } from "../providers/AuthProvider";
import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { 
  Card, 
  Button, 
  Input, 
  Tabs, 
  Tab, 
  Divider, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Badge,
  Textarea,
  DatePicker
} from "@heroui/react";

// Интерфейсы для типизации данных
interface Address {
  id: number;
  title: string;
  street: string;
  house: string;
  apartment: string;
  entrance?: string;
  floor?: string;
  is_default: boolean;
  notes?: string;
}

interface Holiday {
  id: number;
  name: string;
  date: string;
  notes?: string;
}

interface Order {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  delivery_date: string;
  delivery_time?: string;
}

const ProfilePage = () => {
  const { user, getCurrentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Состояния для данных
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Состояние для редактирования профиля
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone_number: user?.phone_number || "",
    birth_date: user?.birth_date || "",
    email: user?.email || ""
  });
  
  // Состояния для модальных окон
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  
  // Состояния для формы адреса
  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    title: "",
    street: "",
    house: "",
    apartment: "",
    entrance: "",
    floor: "",
    is_default: false,
    notes: ""
  });
  
  // Состояния для формы праздника
  const [holidayForm, setHolidayForm] = useState<Partial<Holiday>>({
    name: "",
    date: "",
    notes: ""
  });
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState({
    profile: false,
    addresses: false,
    holidays: false,
    orders: false
  });
  
  // Состояние ошибок
  const [errors, setErrors] = useState({
    profile: "",
    addresses: "",
    holidays: "",
    orders: ""
  });

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchAddresses();
    fetchHolidays();
    fetchOrders();
  }, []);

  // Загрузка адресов пользователя
  const fetchAddresses = async () => {
    try {
      setIsLoading(prev => ({ ...prev, addresses: true }));
      
      const response = await fetch("http://localhost:3000/api/user/addresses", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось загрузить адреса");
      }
      
      const data = await response.json();
      setAddresses(data || []);
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        addresses: err instanceof Error ? err.message : "Произошла ошибка при загрузке адресов" 
      }));
      console.error("Ошибка при загрузке адресов:", err);
    } finally {
      setIsLoading(prev => ({ ...prev, addresses: false }));
    }
  };

  // Загрузка праздников пользователя
  const fetchHolidays = async () => {
    try {
      setIsLoading(prev => ({ ...prev, holidays: true }));
      
      const response = await fetch("http://localhost:3000/api/user/holidays", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось загрузить праздники");
      }
      
      const data = await response.json();
      setHolidays(data || []);
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        holidays: err instanceof Error ? err.message : "Произошла ошибка при загрузке праздников" 
      }));
      console.error("Ошибка при загрузке праздников:", err);
    } finally {
      setIsLoading(prev => ({ ...prev, holidays: false }));
    }
  };

  // Загрузка заказов пользователя
  const fetchOrders = async () => {
    try {
      setIsLoading(prev => ({ ...prev, orders: true }));
      
      const response = await fetch("http://localhost:3000/api/orders", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось загрузить заказы");
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        orders: err instanceof Error ? err.message : "Произошла ошибка при загрузке заказов" 
      }));
      console.error("Ошибка при загрузке заказов:", err);
    } finally {
      setIsLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Обработчик изменения полей ввода для профиля
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик изменения полей ввода для адреса
  const handleAddressChange = (field: string, value: string | boolean) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  // Обработчик изменения полей ввода для праздника
  const handleHolidayChange = (field: string, value: string) => {
    setHolidayForm((prev) => ({ ...prev, [field]: value }));
  };

  // Обработчик отправки формы профиля
  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsLoading(prev => ({ ...prev, profile: true }));
      
      const response = await fetch("http://localhost:3000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Ошибка при обновлении профиля");
      }
      
      // Обновляем данные пользователя
      await getCurrentUser();
      
      // Выходим из режима редактирования
      setIsEditMode(false);
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        profile: err instanceof Error ? err.message : "Произошла ошибка при обновлении профиля" 
      }));
      console.error("Ошибка при обновлении профиля:", err);
    } finally {
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Обработчик отправки формы адреса
  const handleAddressSubmit = async () => {
    try {
      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress 
        ? `http://localhost:3000/api/user/addresses/${editingAddress.id}` 
        : "http://localhost:3000/api/user/addresses";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressForm),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Не удалось ${editingAddress ? "обновить" : "добавить"} адрес`);
      }
      
      // Обновляем список адресов
      await fetchAddresses();
      
      // Закрываем модальное окно и сбрасываем форму
      setIsAddressModalOpen(false);
      setEditingAddress(null);
      setAddressForm({
        title: "",
        street: "",
        house: "",
        apartment: "",
        entrance: "",
        floor: "",
        is_default: false,
        notes: ""
      });
    } catch (err) {
      console.error("Ошибка при работе с адресом:", err);
    }
  };

  // Обработчик отправки формы праздника
  const handleHolidaySubmit = async () => {
    try {
      const method = editingHoliday ? "PUT" : "POST";
      const url = editingHoliday 
        ? `http://localhost:3000/api/user/holidays/${editingHoliday.id}` 
        : "http://localhost:3000/api/user/holidays";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(holidayForm),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Не удалось ${editingHoliday ? "обновить" : "добавить"} праздник`);
      }
      
      // Обновляем список праздников
      await fetchHolidays();
      
      // Закрываем модальное окно и сбрасываем форму
      setIsHolidayModalOpen(false);
      setEditingHoliday(null);
      setHolidayForm({
        name: "",
        date: "",
        notes: ""
      });
    } catch (err) {
      console.error("Ошибка при работе с праздником:", err);
    }
  };

  // Установка адреса по умолчанию
  const setDefaultAddress = async (addressId: number) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}/default`, {
        method: "PUT",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось установить адрес по умолчанию");
      }
      
      // Обновляем список адресов
      await fetchAddresses();
    } catch (err) {
      console.error("Ошибка при установке адреса по умолчанию:", err);
    }
  };

  // Удаление адреса
  const deleteAddress = async (addressId: number) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось удалить адрес");
      }
      
      // Обновляем список адресов
      await fetchAddresses();
    } catch (err) {
      console.error("Ошибка при удалении адреса:", err);
    }
  };

  // Удаление праздника
  const deleteHoliday = async (holidayId: number) => {
    try {
      const response = await fetch(`/api/user/holidays/${holidayId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Не удалось удалить праздник");
      }
      
      // Обновляем список праздников
      await fetchHolidays();
    } catch (err) {
      console.error("Ошибка при удалении праздника:", err);
    }
  };

  // Редактирование адреса
  const editAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      title: address.title,
      street: address.street,
      house: address.house,
      apartment: address.apartment,
      entrance: address.entrance || "",
      floor: address.floor || "",
      is_default: address.is_default,
      notes: address.notes || ""
    });
    setIsAddressModalOpen(true);
  };

  // Редактирование праздника
  const editHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setHolidayForm({
      name: holiday.name,
      date: holiday.date,
      notes: holiday.notes || ""
    });
    setIsHolidayModalOpen(true);
  };

  // Обработчик выхода из аккаунта
  const handleLogout = async () => {
    await logout();
  };

  // Получение статуса заказа
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge color="warning">Ожидает обработки</Badge>;
      case 'processing':
        return <Badge color="primary">В обработке</Badge>;
      case 'shipped':
        return <Badge color="success">Отправлен</Badge>;
      case 'delivered':
        return <Badge color="success">Доставлен</Badge>;
      case 'cancelled':
        return <Badge color="danger">Отменен</Badge>;
      default:
        return <Badge color="default">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Личный кабинет</h1>
        
        <Tabs aria-label="Профиль" color="primary" variant="underlined" className="mb-6">
          <Tab key="profile" title="Мой профиль">
            <Card className="p-6">
              {!isEditMode ? (
                <div>
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Личные данные</h2>
                    <Button 
                      variant="flat" 
                      color="primary" 
                      onPress={() => setIsEditMode(true)}
                    >
                      Редактировать
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-default-500 mb-1">Имя</p>
                      <p className="font-medium">{user.name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500 mb-1">Электронная почта</p>
                      <p className="font-medium">{user.email || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500 mb-1">Телефон</p>
                      <p className="font-medium">{user.phone_number || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500 mb-1">Дата рождения</p>
                      <p className="font-medium">{user.birth_date ? new Date(user.birth_date).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>

                  <Divider className="my-6" />

                  <Button 
                    color="danger" 
                    variant="flat" 
                    onPress={handleLogout}
                  >
                    Выйти из аккаунта
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit}>
                  <h2 className="text-xl font-semibold mb-4">Редактирование профиля</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input
                      label="Имя"
                      name="name"
                      value={formData.name}
                      onChange={handleProfileChange}
                      isRequired
                    />
                    <Input
                      label="Электронная почта"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                    />
                    <Input
                      label="Телефон"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleProfileChange}
                      isRequired
                    />
                    <Input
                      label="Дата рождения"
                      name="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  {errors.profile && (
                    <div className="text-danger mb-4">{errors.profile}</div>
                  )}
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="flat" 
                      color="default" 
                      onPress={() => setIsEditMode(false)}
                    >
                      Отмена
                    </Button>
                    <Button 
                      color="primary" 
                      type="submit"
                      isLoading={isLoading.profile}
                    >
                      Сохранить
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </Tab>
          
          <Tab key="addresses" title="Мои адреса">
            <Card className="p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Адреса доставки</h2>
                <Button 
                  color="primary" 
                  onPress={() => {
                    setEditingAddress(null);
                    setAddressForm({
                      title: "",
                      street: "",
                      house: "",
                      apartment: "",
                      entrance: "",
                      floor: "",
                      is_default: false,
                      notes: ""
                    });
                    setIsAddressModalOpen(true);
                  }}
                >
                  Добавить адрес
                </Button>
              </div>
              
              {isLoading.addresses ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map(address => (
                    <Card key={address.id} className="p-4 border border-default-200">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{address.title}</h3>
                        {address.is_default && (
                          <Badge color="primary">По умолчанию</Badge>
                        )}
                      </div>
                      
                      <p className="mb-2">{address.street}, д. {address.house}, кв. {address.apartment}</p>
                      
                      {(address.entrance || address.floor) && (
                        <p className="text-sm text-default-500 mb-2">
                          {address.entrance && `Подъезд: ${address.entrance}`}
                          {address.entrance && address.floor && ', '}
                          {address.floor && `Этаж: ${address.floor}`}
                        </p>
                      )}
                      
                      {address.notes && (
                        <p className="text-sm text-default-500 mb-3">Примечание: {address.notes}</p>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="flat" 
                          onPress={() => editAddress(address)}
                        >
                          Редактировать
                        </Button>
                        
                        {!address.is_default && (
                          <Button 
                            size="sm" 
                            variant="flat" 
                            color="primary"
                            onPress={() => setDefaultAddress(address.id)}
                          >
                            Сделать основным
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="danger"
                          onPress={() => deleteAddress(address.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-default-500">
                  <p>У вас пока нет сохраненных адресов</p>
                  <p className="text-sm">Добавьте адрес для более быстрого оформления заказа</p>
                </div>
              )}
              
              {errors.addresses && (
                <div className="text-danger mt-4">{errors.addresses}</div>
              )}
            </Card>
          </Tab>
          
          <Tab key="holidays" title="Мои праздники">
            <Card className="p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Важные даты и праздники</h2>
                <Button 
                  color="primary" 
                  onPress={() => {
                    setEditingHoliday(null);
                    setHolidayForm({
                      name: "",
                      date: "",
                      notes: ""
                    });
                    setIsHolidayModalOpen(true);
                  }}
                >
                  Добавить праздник
                </Button>
              </div>
              
              {isLoading.holidays ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : holidays.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {holidays.map(holiday => (
                    <Card key={holiday.id} className="p-4 border border-default-200">
                      <h3 className="font-semibold">{holiday.name}</h3>
                      <p className="text-primary mb-2">
                        {new Date(holiday.date).toLocaleDateString()}
                      </p>
                      
                      {holiday.notes && (
                        <p className="text-sm text-default-500 mb-3">{holiday.notes}</p>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="flat" 
                          onPress={() => editHoliday(holiday)}
                        >
                          Редактировать
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="danger"
                          onPress={() => deleteHoliday(holiday.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-default-500">
                  <p>У вас пока нет сохраненных праздников</p>
                  <p className="text-sm">Добавьте важные для вас даты, чтобы не пропустить поздравления</p>
                </div>
              )}
              
              {errors.holidays && (
                <div className="text-danger mt-4">{errors.holidays}</div>
              )}
            </Card>
          </Tab>
          
          <Tab key="orders" title="Мои заказы">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">История заказов</h2>
              
              {isLoading.orders ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-default-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-default-600">№ Заказа</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-default-600">Дата</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-default-600">Сумма</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-default-600">Статус</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-default-600">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-default-200">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-default-50">
                          <td className="py-4 px-4 font-medium">#{order.id}</td>
                          <td className="py-4 px-4">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            {order.total_price.toLocaleString()} ₽
                          </td>
                          <td className="py-4 px-4">
                            {getOrderStatusBadge(order.status)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button 
                              size="sm" 
                              variant="flat" 
                              color="primary"
                              onPress={() => navigate(`/orders/${order.id}`)}
                            >
                              Детали
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-default-500">
                  <p>У вас пока нет заказов</p>
                  <p className="text-sm">Здесь будет отображаться история ваших заказов</p>
                  <Button 
                    color="primary" 
                    className="mt-4"
                    onPress={() => navigate("/catalog")}
                  >
                    Перейти в каталог
                  </Button>
                </div>
              )}
              
              {errors.orders && (
                <div className="text-danger mt-4">{errors.orders}</div>
              )}
            </Card>
          </Tab>
        </Tabs>
      </div>
      
      {/* Модальное окно для адреса */}
      <Modal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>
            {editingAddress ? "Редактирование адреса" : "Добавление нового адреса"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Название адреса"
                placeholder="Например: Дом, Работа"
                value={addressForm.title}
                onChange={(e) => handleAddressChange("title", e.target.value)}
                isRequired
              />
              
              <Input
                label="Улица"
                placeholder="Название улицы"
                value={addressForm.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                isRequired
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Дом"
                  placeholder="Номер дома"
                  value={addressForm.house}
                  onChange={(e) => handleAddressChange("house", e.target.value)}
                  isRequired
                />
                
                <Input
                  label="Квартира/офис"
                  placeholder="Номер квартиры"
                  value={addressForm.apartment}
                  onChange={(e) => handleAddressChange("apartment", e.target.value)}
                  isRequired
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Подъезд"
                  placeholder="Номер подъезда"
                  value={addressForm.entrance}
                  onChange={(e) => handleAddressChange("entrance", e.target.value)}
                />
                
                <Input
                  label="Этаж"
                  placeholder="Номер этажа"
                  value={addressForm.floor}
                  onChange={(e) => handleAddressChange("floor", e.target.value)}
                />
              </div>
              
              <Textarea
                label="Примечание к адресу"
                placeholder="Дополнительная информация для курьера"
                value={addressForm.notes}
                onChange={(e) => handleAddressChange("notes", e.target.value)}
              />
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.is_default}
                  onChange={(e) => handleAddressChange("is_default", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isDefault">Использовать как адрес по умолчанию</label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="flat" 
              color="default"
              onPress={() => setIsAddressModalOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              color="primary" 
              onPress={handleAddressSubmit}
            >
              {editingAddress ? "Сохранить" : "Добавить"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Модальное окно для праздника */}
      <Modal 
        isOpen={isHolidayModalOpen} 
        onClose={() => setIsHolidayModalOpen(false)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>
            {editingHoliday ? "Редактирование праздника" : "Добавление нового праздника"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Название праздника"
                placeholder="Например: День рождения мамы"
                value={holidayForm.name}
                onChange={(e) => handleHolidayChange("name", e.target.value)}
                isRequired
              />
              
              <Input
                label="Дата"
                type="date"
                value={holidayForm.date}
                onChange={(e) => handleHolidayChange("date", e.target.value)}
                isRequired
              />
              
              <Textarea
                label="Примечание"
                placeholder="Дополнительная информация"
                value={holidayForm.notes}
                onChange={(e) => handleHolidayChange("notes", e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="flat" 
              color="default"
              onPress={() => setIsHolidayModalOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              color="primary" 
              onPress={handleHolidaySubmit}
            >
              {editingHoliday ? "Сохранить" : "Добавить"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
};

export default ProfilePage; 