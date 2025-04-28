import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

const BouquetsPage = () => {
  return (
    <div className="space-y-8">
      <div className="text-center py-12 bg-primary-50 rounded-xl mb-8">
        <h1 className="text-3xl font-bold mb-4">Букеты цветов</h1>
        <p className="max-w-2xl mx-auto text-gray-600 mb-6">
          Наши флористы создают уникальные букеты для любого события. От скромных моно-букетов до роскошных цветочных композиций.
        </p>
        <Button color="primary" size="lg">
          Подобрать букет
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Заглушки для карточек букетов */}
        {Array(6).fill(0).map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-100 p-4 rounded-lg flex flex-col h-80 justify-center items-center text-gray-500"
          >
            Букет {index + 1}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="flat" color="primary">
          Показать больше букетов
        </Button>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mt-12">
        <h2 className="text-xl font-semibold mb-4">Заказ букета на любой праздник</h2>
        <p className="text-gray-600 mb-6">
          Мы предлагаем букеты для любого события: дни рождения, юбилеи, свадьбы, корпоративные мероприятия. 
          Наши флористы помогут подобрать идеальный букет, который выразит ваши чувства и порадует получателя.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Свадебные букеты</h3>
            <p className="text-sm text-gray-600">Элегантные и нежные композиции для невесты</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Букеты на день рождения</h3>
            <p className="text-sm text-gray-600">Яркие и праздничные композиции для именинника</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Букеты для романтики</h3>
            <p className="text-sm text-gray-600">Чувственные букеты для выражения ваших чувств</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BouquetsPage; 