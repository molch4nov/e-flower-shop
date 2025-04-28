import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Страница не найдена</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Извините, страница, которую вы ищете, не существует или была перемещена.
      </p>
      
      <div className="flex gap-4">
        <Button
          as={Link}
          to="/"
          color="primary"
          variant="flat"
        >
          Вернуться на главную
        </Button>
        
        <Button
          as={Link}
          to="/catalog"
          color="primary"
        >
          Перейти в каталог
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage; 