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
import api from "../config/api";

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
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Функция для очистки ошибок
  const clearError = () => setError(null);

  // Функция для входа пользователя
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();

      const data = await api.post('/auth/login', credentials);

      setUser(data.user);
      setIsAuthenticated(true);
      
      // Сохраняем sessionId в состоянии
      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('sessionId', data.sessionId);
      }
      
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

      const data = await api.post('/auth/register', credentials);

      setUser(data.user);
      setIsAuthenticated(true);
      
      // Сохраняем sessionId в состоянии, если он пришел в ответе
      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('sessionId', data.sessionId);
      }
      
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

      await api.post('/auth/logout');

      // Очищаем данные пользователя даже если запрос не удался
      setUser(null);
      setIsAuthenticated(false);
      setSessionId(null);
      setHolidays([]);
      setAddresses([]);
      localStorage.removeItem('sessionId');
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
      
      // Получаем sessionId из localStorage, если он там есть
      const storedSessionId = localStorage.getItem('sessionId');
      if (storedSessionId && !sessionId) {
        setSessionId(storedSessionId);
      }

      try {
        const data = await api.get('/auth/me');
        
        if (data && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          
          // Обновляем дополнительные данные
          if (data.holidays) setHolidays(data.holidays);
          if (data.addresses) setAddresses(data.addresses);
        }
      } catch (err: any) {
        if (err.status === 401) {
          // Не авторизован - очищаем данные
          setUser(null);
          setIsAuthenticated(false);
          setSessionId(null);
          setHolidays([]);
          setAddresses([]);
          localStorage.removeItem('sessionId');
          return;
        }
        
        // Другие ошибки - пробрасываем дальше
        throw err;
      }
    } catch (err) {
      const authError = handleApiError(err, "Ошибка при получении данных пользователя");
      setError(authError);
      setUser(null);
      setIsAuthenticated(false);
      setSessionId(null);
      setHolidays([]);
      setAddresses([]);
      localStorage.removeItem('sessionId');
    } finally {
      setIsLoading(false);
    }
  };

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    getCurrentUser();
  }, []);

  // Предоставляем контекст авторизации
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        clearError,
        login,
        register,
        logout,
        holidays,
        addresses,
        getCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста авторизации
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};

export default AuthProvider; 