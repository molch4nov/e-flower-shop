import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/config/api";

// Типы данных
interface User {
  id: string;
  name: string;
  phone_number: string;
  birth_date?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone_number: string, password: string) => Promise<void>;
  register: (name: string, phone_number: string, password: string, birth_date?: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер для контекста
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await api.auth.getMe();
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Авторизация
  const login = async (phone_number: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login({ phone_number, password });
      setUser(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация
  const register = async (name: string, phone_number: string, password: string, birth_date?: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.register({ name, phone_number, password, birth_date });
      setUser(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  // Выход
  const logout = async () => {
    setIsLoading(true);
    try {
      await api.auth.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Значение для контекста
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext; 