import React from "react";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, Card, CardBody, Divider, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

const DeliveryPage = () => {
  return (
    <DefaultLayout>
      <div className="py-8 px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Доставка цветов</h1>
        
        <div className="text-center mb-8">
          <p className="text-lg">
            Мы предлагаем быструю и надежную доставку цветов по всему городу
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 shadow-md">
            <div className="text-center mb-4">
              <div className="mx-auto bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary">Курьерская доставка</h3>
            </div>
            <p className="text-default-700 text-center">
              Доставка букетов и цветочных композиций по указанному адресу нашим курьером
            </p>
          </Card>
          
          <Card className="p-6 shadow-md">
            <div className="text-center mb-4">
              <div className="mx-auto bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary">Самовывоз</h3>
            </div>
            <p className="text-default-700 text-center">
              Вы можете самостоятельно забрать свой заказ из нашего магазина
            </p>
          </Card>
          
          <Card className="p-6 shadow-md">
            <div className="text-center mb-4">
              <div className="mx-auto bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary">Анонимная доставка</h3>
            </div>
            <p className="text-default-700 text-center">
              Доставим букет без указания отправителя, если вы хотите сделать сюрприз
            </p>
          </Card>
        </div>
        
        <Divider className="my-10" />
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">Зоны и стоимость доставки</h2>
          
          <Card>
            <CardBody>
              <Table aria-label="Зоны доставки">
                <TableHeader>
                  <TableColumn>Зона доставки</TableColumn>
                  <TableColumn>Стоимость доставки</TableColumn>
                  <TableColumn>Сроки доставки</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>Центральный район</TableCell>
                    <TableCell>300 ₽</TableCell>
                    <TableCell>1-2 часа</TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>В пределах КАД</TableCell>
                    <TableCell>500 ₽</TableCell>
                    <TableCell>2-3 часа</TableCell>
                  </TableRow>
                  <TableRow key="3">
                    <TableCell>За пределами КАД (до 30 км)</TableCell>
                    <TableCell>800 ₽</TableCell>
                    <TableCell>3-4 часа</TableCell>
                  </TableRow>
                  <TableRow key="4">
                    <TableCell>Срочная доставка (любая зона)</TableCell>
                    <TableCell>+300 ₽ к базовой стоимости</TableCell>
                    <TableCell>от 40 минут</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">Часто задаваемые вопросы</h2>
          
          <Accordion>
            <AccordionItem key="1" aria-label="Когда осуществляется доставка?" title="Когда осуществляется доставка?">
              <p className="text-default-700">
                Доставка осуществляется ежедневно с 9:00 до 21:00. Вы можете выбрать удобный 
                временной интервал при оформлении заказа.
              </p>
            </AccordionItem>
            <AccordionItem key="2" aria-label="Можно ли заказать доставку на определенное время?" title="Можно ли заказать доставку на определенное время?">
              <p className="text-default-700">
                Да, при оформлении заказа вы можете выбрать один из доступных временных интервалов 
                для доставки. Также доступна опция срочной доставки к определенному времени.
              </p>
            </AccordionItem>
            <AccordionItem key="3" aria-label="Как сохраняется свежесть букета при доставке?" title="Как сохраняется свежесть букета при доставке?">
              <p className="text-default-700">
                Все наши букеты доставляются в специальных термосумках или контейнерах, 
                которые защищают цветы от перепадов температуры. Также мы используем 
                специальные увлажняющие составы для сохранения свежести.
              </p>
            </AccordionItem>
            <AccordionItem key="4" aria-label="Можно ли доставить цветы без присутствия получателя?" title="Можно ли доставить цветы без присутствия получателя?">
              <p className="text-default-700">
                Да, мы можем оставить букет консьержу, соседям или у двери, по предварительной 
                договоренности. Однако в этом случае мы не можем гарантировать сохранность 
                букета после передачи.
              </p>
            </AccordionItem>
            <AccordionItem key="5" aria-label="Что делать, если получателя нет дома?" title="Что делать, если получателя нет дома?">
              <p className="text-default-700">
                Если получателя нет дома, наш курьер свяжется с вами для согласования 
                дальнейших действий. Мы можем оставить букет у соседей или консьержа, 
                доставить в другое время или в другое место по вашему указанию.
              </p>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="bg-default-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Наш магазин</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Адрес магазина:</h3>
              <p className="mb-2">г. Санкт-Петербург, ул. Цветочная, д. 7</p>
              <p className="mb-4">БЦ "Флора", 1 этаж</p>
              
              <h3 className="text-lg font-semibold mb-4">Часы работы:</h3>
              <p className="mb-1">Понедельник - Пятница: 9:00 - 21:00</p>
              <p className="mb-1">Суббота - Воскресенье: 10:00 - 20:00</p>
              
              <h3 className="text-lg font-semibold mb-4 mt-6">Контакты:</h3>
              <p className="mb-1">Телефон: +7 (812) 123-45-67</p>
              <p>Email: info@flower-paradise.ru</p>
            </div>
            
            <div className="h-64 md:h-auto bg-default-200 rounded-lg">
              {/* Здесь можно использовать Google Maps или Яндекс Карты */}
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-default-600">Карта проезда</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DeliveryPage; 