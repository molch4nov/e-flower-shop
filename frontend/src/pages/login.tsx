import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

interface LoginFormData {
  phone_number: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage("");
      await login(data.phone_number, data.password);
      navigate("/"); // Перенаправляем на главную после успешной авторизации
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error || 
        "Произошла ошибка при авторизации. Пожалуйста, попробуйте снова."
      );
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-center">Вход в аккаунт</h1>
          <p className="text-center text-gray-500">
            Войдите в свой аккаунт для доступа к заказам и корзине
          </p>
        </CardHeader>
        
        <CardBody>
          {errorMessage && (
            <div className="bg-danger-50 text-danger p-3 rounded-lg mb-4">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                label="Пароль"
                type="password"
                placeholder="Введите пароль"
                {...register("password", { 
                  required: "Пароль обязателен",
                  minLength: {
                    value: 6,
                    message: "Пароль должен содержать минимум 6 символов"
                  }
                })}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
            </div>
            
            <Button 
              type="submit" 
              color="primary" 
              fullWidth
              isLoading={isSubmitting}
            >
              Войти
            </Button>
          </form>
        </CardBody>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Еще нет аккаунта?{" "}
            <Link to="/register" className="text-primary">
              Зарегистрироваться
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage; 