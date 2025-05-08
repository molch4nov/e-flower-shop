import { FormEvent, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { AuthContextType, AuthErrorType, RegisterCredentials } from "../types/auth";
import DefaultLayout from "@/layouts/default";
import { Button, Input, Form, Link, DatePicker, Card } from "@heroui/react";
import { Icon } from "@iconify/react";

const RegisterPage = () => {
  // Стейт для хранения данных формы
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: "",
    phone_number: "+7",
    password: "",
    birth_date: "",
  });

  // Получаем функции и состояние из контекста авторизации
  const { register, isLoading, error, clearError } =
    useAuth() as AuthContextType;

  // Для перенаправления после регистрации
  const navigate = useNavigate();

  // Состояние для видимости пароля
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Функция для отображения ошибки с соответствующей иконкой
  const renderError = () => {
    if (!error) return null;
    
    let iconName = "solar:danger-triangle-bold";
    let colorClass = "text-danger";
    
    switch (error.type) {
      case AuthErrorType.USER_EXISTS:
        iconName = "solar:user-block-bold";
        break;
      case AuthErrorType.NETWORK_ERROR:
        iconName = "solar:wifi-problem-bold";
        break;
      case AuthErrorType.MISSING_REQUIRED_FIELDS:
        iconName = "solar:document-missing-bold";
        break;
      case AuthErrorType.INVALID_PHONE_FORMAT:
        iconName = "solar:phone-bold";
        break;
      case AuthErrorType.SESSION_EXPIRED:
        iconName = "solar:clock-circle-bold";
        break;
      case AuthErrorType.AUTH_ERROR:
        iconName = "solar:user-cross-bold";
        break;
      default:
        iconName = "solar:danger-triangle-bold";
    }
    
    return (
      <Card className={`${colorClass} p-3 mb-2`}>
        <div className="flex items-center gap-2">
          <Icon className="text-xl" icon={iconName} />
          <span>{error.message}</span>
        </div>
      </Card>
    );
  };

  // Обработчик изменения полей ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Специальная обработка для номера телефона
    if (name === "phone_number") {
      // Удаляем все нецифровые символы, кроме плюса в начале
      let formattedValue = value.replace(/[^\d+]/g, "");
      
      // Если номер пустой, добавляем +7
      if (formattedValue === "") {
        formattedValue = "+7";
      } 
      // Если пользователь вводит номер без +7 в начале, добавляем его
      else if (!formattedValue.startsWith("+")) {
        formattedValue = "+" + formattedValue;
      } 
      // Если пользователь вводит номер без 7 после +, добавляем его
      else if (formattedValue === "+") {
        formattedValue = "+7";
      }
      
      // Ограничиваем длину номера (включая +7) до 12 символов
      formattedValue = formattedValue.substring(0, 12);
      
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    clearError(); // Очищаем ошибку при изменении данных
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await register(formData);
      // После успешной регистрации перенаправляем на главную
      navigate("/");
    } catch (err) {
      // Ошибка обрабатывается внутри register
    }
  };

  return (
    <DefaultLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
          <p className="pb-4 text-left text-3xl font-semibold">
            Регистрация
            <span aria-label="emoji" className="ml-2" role="img">
              ✨
            </span>
          </p>
          {renderError()}
          <Form
            className="flex flex-col gap-4"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label="Имя"
              labelPlacement="outside"
              name="name"
              placeholder="Введите ваше имя"
              type="text"
              variant="bordered"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!error && error.type === AuthErrorType.MISSING_REQUIRED_FIELDS}
            />
            <Input
              isRequired
              label="Номер телефона"
              labelPlacement="outside"
              name="phone_number"
              placeholder="+7XXXXXXXXXX"
              type="tel"
              variant="bordered"
              value={formData.phone_number}
              onChange={handleChange}
              isInvalid={!!error && (error.type === AuthErrorType.INVALID_PHONE_FORMAT || error.type === AuthErrorType.USER_EXISTS)}
            />
            <Input
              isRequired
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label="Пароль"
              labelPlacement="outside"
              name="password"
              placeholder="Введите ваш пароль"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!error && error.type === AuthErrorType.MISSING_REQUIRED_FIELDS}
            />
            <Input
              label="Дата рождения (необязательно)"
              labelPlacement="outside"
              name="birth_date"
              placeholder="Выберите дату рождения"
              type="date"
              variant="bordered"
              value={formData.birth_date}
              onChange={handleChange}
            />
            <Button
              className="w-full"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </Form>
          <p className="text-center text-small">
            <Link href="/login" size="sm">
              Уже есть аккаунт? Войти
            </Link>
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RegisterPage;
