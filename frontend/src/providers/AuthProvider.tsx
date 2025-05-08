import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { 
  Address, 
  AuthContextType, 
  AuthError,
  AuthErrorType,
  Holiday, 
  LoginCredentials, 
  RegisterCredentials, 
  User 
} from "../types/auth";

// API base URL
const API_URL = "http://localhost:3000/api";

// Создаем контекст авторизации с типизацией
const AuthContext = createContext<AuthContextType | null>(null);

// Типизация пропсов провайдера
interface AuthProviderProps {
  children: ReactNode;
}

// Функция для обработки ошибок API
const handleApiError = (error: any, defaultMessage: string, statusCode?: number): AuthError => {
  // Если это ошибка сети
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      type: AuthErrorType.NETWORK_ERROR,
      message: 'Ошибка соединения с сервером. Проверьте интернет-подключение.',
      statusCode
    };
  }
  
  // Если это ошибка с сообщением
  if (error instanceof Error) {
    // Ошибки авторизации
    if (error.message === 'Неверный номер телефона или пароль') {
      return {
        type: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Неверный номер телефона или пароль',
        statusCode
      };
    }
    if (error.message === 'Номер телефона и пароль обязательны') {
      return {
        type: AuthErrorType.MISSING_CREDENTIALS,
        message: 'Введите номер телефона и пароль',
        statusCode
      };
    }
    
    // Ошибки регистрации
    if (error.message === 'Пользователь с таким номером телефона уже существует') {
      return {
        type: AuthErrorType.USER_EXISTS,
        message: 'Пользователь с таким номером телефона уже зарегистрирован',
        statusCode
      };
    }
    if (error.message === 'Неверный формат номера телефона') {
      return {
        type: AuthErrorType.INVALID_PHONE_FORMAT,
        message: 'Введите корректный номер телефона в формате +7XXXXXXXXXX',
        statusCode
      };
    }
    if (error.message === 'Имя, номер телефона и пароль обязательны') {
      return {
        type: AuthErrorType.MISSING_REQUIRED_FIELDS,
        message: 'Заполните все обязательные поля',
        statusCode
      };
    }
    
    // Ошибки сессии
    if (error.message === 'Сессия истекла. Пожалуйста, войдите снова.') {
      return {
        type: AuthErrorType.SESSION_EXPIRED,
        message: 'Срок действия сессии истек. Пожалуйста, войдите снова.',
        statusCode
      };
    }
    if (error.message === 'Ошибка при аутентификации') {
      return {
        type: AuthErrorType.AUTH_ERROR,
        message: 'Ошибка аутентификации. Пожалуйста, войдите снова.',
        statusCode
      };
    }
    
    // Любая другая ошибка с сообщением
    return {
      type: AuthErrorType.UNKNOWN_ERROR,
      message: error.message,
      statusCode
    };
  }
  
  // Если ничего не подошло
  return {
    type: AuthErrorType.UNKNOWN_ERROR,
    message: defaultMessage,
    statusCode
  };
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  // Состояние для хранения данных авторизации
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Функция для очистки ошибок
  const clearError = () => setError(null);

  // Функция для входа пользователя
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Важно для получения куки
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при входе");
      }

      setUser(data.user);
      setIsAuthenticated(true);
      
      // Получаем дополнительные данные пользователя
      await getCurrentUser();
    } catch (err) {
      const authError = handleApiError(err, "Ошибка при входе");
      setError(authError);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для регистрации нового пользователя
  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Важно для получения куки
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при регистрации");
      }

      setUser(data.user);
      setIsAuthenticated(true);
      
      // Получаем дополнительные данные пользователя
      await getCurrentUser();
    } catch (err) {
      const authError = handleApiError(err, "Ошибка при регистрации");
      setError(authError);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для выхода из аккаунта
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Очищаем данные пользователя даже если запрос не удался
      setUser(null);
      setIsAuthenticated(false);
      setHolidays([]);
      setAddresses([]);
    } catch (err) {
      console.error("Ошибка при выходе:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для получения данных текущего пользователя
  const getCurrentUser = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Важно для получения куки
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Не авторизован - очищаем данные
          setUser(null);
          setIsAuthenticated(false);
          setHolidays([]);
          setAddresses([]);
          return;
        }
        
        if (data.error) {
          console.error("Ошибка API:", data.error);
          throw new Error(data.error);
        }
        
        throw new Error("Ошибка при получении данных пользователя");
      }

      // Проверка структуры ответа
      if (!data.user) {
        console.error("Некорректный формат ответа:", data);
        throw new Error("Ответ сервера не содержит данных пользователя");
      }
      
      setUser(data.user);
      setHolidays(data.holidays || []);
      setAddresses(data.addresses || []);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Ошибка при получении данных пользователя:", err);
      
      // Добавляем подробное логирование ошибки
      if (err instanceof Error) {
        const authError = handleApiError(err, "Ошибка при получении данных пользователя");
        setError(authError);
      }
      
      setUser(null);
      setIsAuthenticated(false);
      setHolidays([]);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    getCurrentUser();
  }, []);

  // Создаем значение контекста
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    holidays,
    addresses,
    login,
    register,
    logout,
    getCurrentUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Хук для использования контекста авторизации
export const useAuth = (): AuthContextType => {
  const context = useContext<AuthContextType | null>(AuthContext);
  
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  
  return context;
}; 