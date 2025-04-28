import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, CardHeader, CardFooter, Checkbox } from "@heroui/react";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

interface RegisterFormData {
  name: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
  birth_date?: string;
  acceptTerms: boolean;
}

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    if (!data.acceptTerms) {
      setErrorMessage("Необходимо принять условия пользовательского соглашения");
      return;
    }

    try {
      setErrorMessage("");
      await registerUser(
        data.name, 
        data.phone_number, 
        data.password,
        data.birth_date
      );
      navigate("/"); // Перенаправляем на главную после успешной регистрации
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error || 
        "Произошла ошибка при регистрации. Пожалуйста, попробуйте снова."
      );
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-center">Регистрация</h1>
          <p className="text-center text-gray-500">
            Создайте аккаунт для совершения покупок
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
                label="Пароль"
                type="password"
                placeholder="Минимум 6 символов"
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
            
            <div>
              <Input
                label="Подтверждение пароля"
                type="password"
                placeholder="Повторите пароль"
                {...register("confirmPassword", { 
                  required: "Подтвердите пароль",
                  validate: value => 
                    value === password || "Пароли не совпадают"
                })}
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
              />
            </div>
            
            <div>
              <Input
                label="Дата рождения (необязательно)"
                type="date"
                placeholder="ГГГГ-ММ-ДД"
                {...register("birth_date")}
                description="Мы будем поздравлять вас со скидками"
              />
            </div>
            
            <div>
              <Checkbox
                {...register("acceptTerms", { 
                  required: "Необходимо принять условия"
                })}
                isInvalid={!!errors.acceptTerms}
              >
                Я согласен с{" "}
                <Link to="/terms" className="text-primary">
                  условиями пользовательского соглашения
                </Link>
              </Checkbox>
              {errors.acceptTerms && (
                <p className="text-danger text-xs mt-1">{errors.acceptTerms.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              color="primary" 
              fullWidth
              isLoading={isSubmitting}
            >
              Зарегистрироваться
            </Button>
          </form>
        </CardBody>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-primary">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage; 