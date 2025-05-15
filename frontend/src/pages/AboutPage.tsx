import React from "react";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader, Divider, Image } from "@heroui/react";

const AboutPage = () => {
  return (
    <DefaultLayout>
      <div className="py-8 px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">О нашем магазине</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Цветочный Рай - лучшие цветы и букеты в городе</h2>
            <p className="text-default-700 mb-4">
              Наш магазин работает с 2010 года и за это время мы заслужили репутацию надежного поставщика свежих цветов 
              и красивейших букетов для любого случая.
            </p>
            <p className="text-default-700">
              Мы тщательно отбираем каждый цветок, следим за условиями доставки и хранения,
              чтобы вы получали только самое лучшее качество. Наши флористы создают уникальные композиции,
              которые будут радовать вас и ваших близких.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/about-shop.jpg"
              alt="Наш магазин"
              className="w-full h-full object-cover"
              fallbackSrc="https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=1000"
            />
          </div>
        </div>
        
        <Divider className="my-10" />
        
        <h2 className="text-2xl font-semibold text-center mb-8">Почему выбирают нас</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-default-50">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md font-semibold text-primary">Всегда свежие цветы</p>
              </div>
            </CardHeader>
            <CardBody>
              <p>Мы работаем напрямую с поставщиками и обновляем ассортимент каждый день, чтобы предложить вам только самые свежие цветы.</p>
            </CardBody>
          </Card>
          
          <Card className="bg-default-50">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md font-semibold text-primary">Команда профессионалов</p>
              </div>
            </CardHeader>
            <CardBody>
              <p>Наши флористы — настоящие мастера своего дела, обладающие многолетним опытом и художественным вкусом.</p>
            </CardBody>
          </Card>
          
          <Card className="bg-default-50">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md font-semibold text-primary">Быстрая доставка</p>
              </div>
            </CardHeader>
            <CardBody>
              <p>Мы доставляем букеты в день заказа по всему городу и гарантируем их сохранность и презентабельный вид.</p>
            </CardBody>
          </Card>
        </div>
        
        <div className="bg-primary-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Наша миссия</h2>
          <p className="text-lg text-center max-w-3xl mx-auto">
            Мы стремимся делать мир ярче и радостнее, создавая уникальные цветочные композиции,
            которые помогают людям выражать свои чувства и делать особенные моменты в жизни
            еще более запоминающимися.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold text-center mb-8">Наша история</h2>
        
        <div className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold">2010</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Открытие первого магазина</h3>
              <p>Маленький цветочный бутик в центре города стал началом нашей истории</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold">2015</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Расширение ассортимента</h3>
              <p>Мы добавили в каталог эксклюзивные экзотические цветы и начали создавать авторские букеты</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold">2018</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Запуск онлайн-магазина</h3>
              <p>Мы сделали заказ цветов еще удобнее и запустили доставку по всему городу</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold">2023</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Сегодняшний день</h3>
              <p>Сейчас мы – один из ведущих цветочных магазинов города с сотнями благодарных клиентов</p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AboutPage; 