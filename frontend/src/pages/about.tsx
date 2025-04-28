import { Button, Card, CardBody } from "@heroui/react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="space-y-12">
      <div className="text-center py-12 bg-primary-50 rounded-xl">
        <h1 className="text-3xl font-bold mb-4">О компании E-Flower Shop</h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          Мы любим цветы и знаем, как с их помощью создать настроение и порадовать близких людей.
          Наш магазин предлагает свежие цветы и уникальные букеты с доставкой по городу.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Наша история</h2>
          <p className="text-gray-600 mb-4">
            E-Flower Shop был основан в 2020 году командой энтузиастов, влюбленных в флористику.
            Мы начинали с небольшого магазина в центре города, а сегодня развиваем онлайн-направление,
            чтобы сделать процесс заказа цветов максимально удобным для наших клиентов.
          </p>
          <p className="text-gray-600">
            Наша миссия — приносить радость и красоту в жизнь людей с помощью цветочных композиций,
            созданных с любовью и вниманием к деталям.
          </p>
        </div>
        
        <div className="bg-gray-100 rounded-lg h-60 flex items-center justify-center">
          <span className="text-gray-500">Фото магазина</span>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-6">Наши преимущества</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="text-primary text-3xl mb-4">🌹</div>
              <h3 className="text-xl font-medium mb-2">Свежие цветы</h3>
              <p className="text-gray-600">
                Мы работаем только с проверенными поставщиками и обновляем ассортимент каждый день.
              </p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="p-6">
              <div className="text-primary text-3xl mb-4">🚚</div>
              <h3 className="text-xl font-medium mb-2">Быстрая доставка</h3>
              <p className="text-gray-600">
                Доставляем букеты в течение 2-3 часов после оформления заказа.
              </p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="p-6">
              <div className="text-primary text-3xl mb-4">💐</div>
              <h3 className="text-xl font-medium mb-2">Уникальные букеты</h3>
              <p className="text-gray-600">
                Наши флористы создают авторские композиции для любого события.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Свяжитесь с нами</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Адрес</h3>
              <p className="text-gray-600">г. Москва, ул. Цветочная, 123</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Телефон</h3>
              <p className="text-gray-600">+7 (999) 123-45-67</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <p className="text-gray-600">info@eflowershop.ru</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Режим работы</h3>
              <p className="text-gray-600">Ежедневно с 9:00 до 21:00</p>
            </div>
          </div>
          
          <div className="bg-gray-200 rounded-lg h-60 flex items-center justify-center">
            <span className="text-gray-500">Карта проезда</span>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Button as={Link} to="/catalog" color="primary" size="lg">
          Перейти в каталог
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;
