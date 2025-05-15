import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Button, Card, CardBody, Input, Textarea, Divider } from "@heroui/react";

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку поля при изменении значения
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      message: ""
    };

    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = "Введите ваше имя";
      isValid = false;
    }

    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = "Введите ваш email";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
      isValid = false;
    }

    // Валидация телефона
    if (!formData.phone.trim()) {
      newErrors.phone = "Введите ваш телефон";
      isValid = false;
    } else if (!/^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(formData.phone)) {
      newErrors.phone = "Введите корректный номер телефона";
      isValid = false;
    }

    // Валидация сообщения
    if (!formData.message.trim()) {
      newErrors.message = "Введите ваше сообщение";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Имитация отправки данных на сервер
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Отправленные данные:", formData);
      setSubmitSuccess(true);
      
      // Сбрасываем форму
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      
      // Через 5 секунд скрываем сообщение об успешной отправке
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="py-8 px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Контакты</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Наши контактные данные</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Телефон</h3>
                  <p className="text-default-600">+7 (812) 123-45-67</p>
                  <p className="text-default-600">+7 (812) 987-65-43</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-default-600">info@flower-paradise.ru</p>
                  <p className="text-default-600">sales@flower-paradise.ru</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Адрес</h3>
                  <p className="text-default-600">г. Санкт-Петербург, ул. Цветочная, д. 7</p>
                  <p className="text-default-600">БЦ "Флора", 1 этаж</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Часы работы</h3>
                  <p className="text-default-600">Понедельник - Пятница: 9:00 - 21:00</p>
                  <p className="text-default-600">Суббота - Воскресенье: 10:00 - 20:00</p>
                </div>
              </div>
            </div>
            
            <Divider className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-6">Мы в социальных сетях</h2>
            
            <div className="flex gap-4">
              <a href="#" className="bg-primary-50 hover:bg-primary-100 p-3 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="bg-primary-50 hover:bg-primary-100 p-3 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="bg-primary-50 hover:bg-primary-100 p-3 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a href="#" className="bg-primary-50 hover:bg-primary-100 p-3 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Обратная связь</h2>
            
            <Card>
              <CardBody>
                {submitSuccess ? (
                  <div className="bg-success-100 text-success-700 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Сообщение отправлено!</h3>
                    <p>Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          label="Имя"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name}
                          errorMessage={errors.name}
                          placeholder="Введите ваше имя"
                          isRequired
                        />
                      </div>
                      
                      <div>
                        <Input
                          type="email"
                          label="Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          errorMessage={errors.email}
                          placeholder="Введите ваш email"
                          isRequired
                        />
                      </div>
                      
                      <div>
                        <Input
                          type="tel"
                          label="Телефон"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          isInvalid={!!errors.phone}
                          errorMessage={errors.phone}
                          placeholder="+7 (___) ___-__-__"
                          isRequired
                        />
                      </div>
                      
                      <div>
                        <Textarea
                          label="Сообщение"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          isInvalid={!!errors.message}
                          errorMessage={errors.message}
                          placeholder="Введите ваше сообщение"
                          minRows={4}
                          isRequired
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        color="primary"
                        isLoading={isSubmitting}
                        className="w-full"
                      >
                        Отправить сообщение
                      </Button>
                    </div>
                  </form>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
        
        <div className="bg-default-50 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Как нас найти</h2>
          
          <div className="w-full h-64 md:h-96 bg-default-200 rounded-lg">
            {/* Здесь можно использовать Google Maps или Яндекс Карты */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-default-600">Карта проезда</p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ContactsPage; 