import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Компонент для защиты приватных маршрутов.
 * Перенаправляет на страницу входа, если пользователь не авторизован.
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Показываем загрузку, пока проверяем авторизацию
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  // и сохраняем текущий путь, чтобы вернуться после входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если пользователь авторизован, показываем защищенный контент
  return <>{children}</>;
};

export default PrivateRoute; 