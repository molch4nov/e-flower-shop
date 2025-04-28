import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

const IndexPage = () => {
  return (
    <div className="space-y-12">
      <section className="py-16 text-center bg-gray-50 rounded-xl">
        <h1 className="text-4xl font-bold mb-4">E-Flower Shop</h1>
        <p className="text-xl text-gray-600 mb-8">
          Свежие цветы и букеты с доставкой
        </p>
        <Button 
          as={Link} 
          to="/catalog"
          color="primary"
          size="lg"
          className="font-semibold"
        >
          Посмотреть каталог
        </Button>
      </section>
      
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Популярные категории</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Здесь будут карточки категорий */}
          <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center">
            Категория 1
          </div>
          <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center">
            Категория 2
          </div>
          <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center">
            Категория 3
          </div>
          <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center">
            Категория 4
          </div>
        </div>
      </section>
      
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Популярные товары</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Здесь будут карточки товаров */}
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            Товар 1
          </div>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            Товар 2
          </div>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            Товар 3
          </div>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            Товар 4
          </div>
        </div>
      </section>
      
      <section className="py-8 text-center bg-primary-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Доставка цветов в день заказа</h2>
        <p className="text-gray-600 mb-6">
          Мы доставляем свежие цветы и букеты в течение 2-3 часов после оформления заказа
        </p>
        <Button 
          as={Link} 
          to="/about"
          color="primary"
          variant="flat"
          className="font-semibold"
        >
          Узнать больше
        </Button>
      </section>
    </div>
  );
};

export default IndexPage;
