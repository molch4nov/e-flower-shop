import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from "@heroui/react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Здесь будет получение данных о пользователе из контекста
  const isAuthenticated = false;
  const user = null;

  const menuItems = [
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
    { name: "Букеты", path: "/bouquets" },
    { name: "О нас", path: "/about" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className="border-b">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link to="/" className="font-bold text-xl text-primary">
            E-Flower Shop
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.path} isActive={isActive(item.path)}>
            <Link to={item.path} className={isActive(item.path) ? "text-primary" : ""}>
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link to="/cart">
            <Button 
              isIconOnly 
              variant="light" 
              aria-label="Корзина"
              className="text-default-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
            </Button>
          </Link>
        </NavbarItem>
        {isAuthenticated ? (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  size="sm"
                  name={user?.name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Профиль">
                <DropdownItem key="profile" as={Link} to="/profile">
                  Профиль
                </DropdownItem>
                <DropdownItem key="orders" as={Link} to="/orders">
                  Мои заказы
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Выйти
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button as={Link} to="/login" color="primary" variant="flat">
              Войти
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.path}>
            <Link 
              to={item.path}
              className={`w-full ${isActive(item.path) ? "text-primary" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header; 