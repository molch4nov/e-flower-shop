import { FormEvent, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContextType, AuthErrorType, LoginCredentials } from "../types/auth";
import DefaultLayout from "@/layouts/default";
import { Button, Input, Checkbox, Link, Form, Card } from "@heroui/react";
import { Icon } from "@iconify/react";

const LoginPage = () => {
  // Стейт для хранения данных формы
  const [formData, setFormData] = useState<LoginCredentials>({
    phone_number: "",
    password: "",
  });

  // Получаем функции и состояние из контекста авторизации
  const { login, isLoading, error, clearError } = useAuth() as AuthContextType;

  // Для перенаправления после входа
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Состояние для видимости пароля
  const [isVisible, setIsVisible] = useState(false);

  // Состояние для отслеживания попыток входа
  const [hasTriedLogin, setHasTriedLogin] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Функция для отображения ошибки с соответствующей иконкой
  const renderError = () => {
    if (!error || !hasTriedLogin) return null;
    
    let iconName = "solar:danger-triangle-bold";
    let colorClass = "text-danger";
    
    switch (error.type) {
      case AuthErrorType.INVALID_CREDENTIALS:
        iconName = "solar:lock-unlocked-bold";
        break;
      case AuthErrorType.NETWORK_ERROR:
        iconName = "solar:wifi-problem-bold";
        break;
      case AuthErrorType.MISSING_CREDENTIALS:
        iconName = "solar:document-missing-bold";
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
    setHasTriedLogin(false); // Сбрасываем флаг попытки входа
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setHasTriedLogin(true);
    
    try {
      await login(formData);
      // После успешного входа перенаправляем на предыдущую страницу или на главную
      navigate(from, { replace: true });
    } catch (err) {
      // Ошибка обрабатывается внутри login
    }
  };

  return (
    <DefaultLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
          <p className="pb-4 text-left text-3xl font-semibold">
            Добро пожаловать
            <span aria-label="emoji" className="ml-2" role="img">
              👋
            </span>
          </p>
          {renderError()}
          <Form className="flex flex-col gap-4" validationBehavior="native" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Номер телефона"
              labelPlacement="outside"
              name="phone_number"
              placeholder="+7XXXXXXXXXX"
              type="tel"
              variant="bordered"
              value={formData.phone_number || "+7"}
              onChange={handleChange}
              isInvalid={!!error && (error.type === AuthErrorType.INVALID_PHONE_FORMAT || error.type === AuthErrorType.INVALID_CREDENTIALS)}
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
              isInvalid={!!error && error.type === AuthErrorType.INVALID_CREDENTIALS}
            />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Checkbox defaultSelected name="remember" size="sm">
                Запомнить меня
              </Checkbox>
              <Link className="text-default-500" href="#" size="sm">
                Забыли пароль?
              </Link>
            </div>
            <Button className="w-full" color="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Выполняется вход..." : "Войти"}
            </Button>
          </Form>
          <p className="text-center text-small">
            <Link href="/register" size="sm">
              Создать аккаунт
            </Link>
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage; 