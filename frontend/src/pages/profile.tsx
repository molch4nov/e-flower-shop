import { useState } from "react";
import { Button, Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";

interface ProfileFormData {
  name: string;
  phone_number: string;
  birth_date?: string;
}

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Временные данные для случая, когда пользователь не загружен
  const demoUser = {
    id: "1",
    name: "Иванов Иван",
    phone_number: "+7 (999) 123-45-67",
    birth_date: "1990-01-01"
  };
  
  // Используем данные пользователя, если они загружены, иначе демо-данные
  const userData = user || demoUser;
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: userData.name,
      phone_number: userData.phone_number,
      birth_date: userData.birth_date
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    // Здесь будет обновление профиля через API
    console.log("Данные формы:", data);
    // Имитация задержки запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Профиль обновлен");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Личный кабинет</h1>
      
      <Tabs 
        aria-label="Разделы профиля" 
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="mb-6"
      >
        <Tab key="profile" title="Профиль" />
        <Tab key="orders" title="Мои заказы" />
        <Tab key="addresses" title="Адреса доставки" />
      </Tabs>
      
      {activeTab === "profile" && (
        <Card>
          <CardBody className="p-6">
            <h2 className="text-xl font-semibold mb-4">Личные данные</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input
                  label="Имя"
                  placeholder="Ваше имя"
                  {...register("name", { 
                    required: "Имя обязательно",
                    minLength: {
                      value: 2,
                      message: "Имя должно содержать минимум 2 символа"
                    }
                  })}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              </div>
              
              <div>
                <Input
                  label="Номер телефона"
                  placeholder="+7 (XXX) XXX-XX-XX"
                  {...register("phone_number", { 
                    required: "Номер телефона обязателен",
                    pattern: {
                      value: /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
                      message: "Введите корректный номер телефона"
                    }
                  })}
                  isInvalid={!!errors.phone_number}
                  errorMessage={errors.phone_number?.message}
                />
              </div>
              
              <div>
                <Input
                  label="Дата рождения"
                  type="date"
                  placeholder="ГГГГ-ММ-ДД"
                  {...register("birth_date")}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  color="primary"
                  isLoading={isSubmitting}
                >
                  Сохранить изменения
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
      
      {activeTab === "orders" && (
        <div className="bg-gray-50 p-6 rounded-lg text-center py-12">
          <h2 className="text-xl font-medium mb-2">У вас пока нет заказов</h2>
          <p className="text-gray-500 mb-6">Оформите первый заказ, чтобы увидеть его здесь</p>
          <Button as="a" href="/catalog" color="primary">
            Перейти в каталог
          </Button>
        </div>
      )}
      
      {activeTab === "addresses" && (
        <div className="bg-gray-50 p-6 rounded-lg text-center py-12">
          <h2 className="text-xl font-medium mb-2">У вас пока нет сохраненных адресов</h2>
          <p className="text-gray-500 mb-6">Добавьте адрес доставки для быстрого оформления заказов</p>
          <Button color="primary">
            Добавить адрес
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 