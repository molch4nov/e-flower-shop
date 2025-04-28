import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">E-Flower Shop</h3>
            <p className="text-gray-600 text-sm">
              Магазин цветов и букетов с доставкой на дом.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary text-sm">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-600 hover:text-primary text-sm">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/bouquets" className="text-gray-600 hover:text-primary text-sm">
                  Букеты
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary text-sm">
                  О нас
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Клиентам</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary text-sm">
                  Личный кабинет
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-primary text-sm">
                  Мои заказы
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-primary text-sm">
                  Корзина
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Контакты</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">
                <span className="font-medium">Телефон:</span> +7 (999) 123-45-67
              </li>
              <li className="text-gray-600 text-sm">
                <span className="font-medium">Email:</span> info@eflowershop.ru
              </li>
              <li className="text-gray-600 text-sm">
                <span className="font-medium">Адрес:</span> г. Москва, ул. Цветочная, 123
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-4 text-center text-gray-500 text-sm">
          <p>© {currentYear} E-Flower Shop. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 