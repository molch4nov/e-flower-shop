import { useState } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Badge } from "@heroui/badge";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  CartIcon,
  Logo,
  UserIcon,
} from "@/components/icons";
import { CategoryDrawer } from "./CategoryDrawer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

export const Navbar = () => {
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <HeroUINavbar className="w-full">
      <NavbarContent>
        <NavbarMenuToggle 
          aria-label={isCategoryDrawerOpen ? "Закрыть меню" : "Открыть меню"} 
          className="sm:hidden" 
        />
        <NavbarBrand className="cursor-pointer" onClick={() => navigate("/")}>
          <Logo />
          <p className="font-bold text-inherit">Цветочный Рай</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavbarItem>
          <Button
            color="primary"
            variant="flat"
            onClick={() => setIsCategoryDrawerOpen(true)}
          >
            Категории
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color="foreground" 
            className={clsx(linkStyles(), "data-[active=true]:font-bold")}
            href="/catalog"
          >
            Каталог
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            className={clsx(linkStyles(), "data-[active=true]:font-bold")}
            href="/about"
          >
            О нас
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            className={clsx(linkStyles(), "data-[active=true]:font-bold")}
            href="/delivery"
          >
            Доставка
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            className={clsx(linkStyles(), "data-[active=true]:font-bold")}
            href="/contacts"
          >
            Контакты
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="flex">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="flex">
          <Button
            isIconOnly
            variant="light"
            aria-label="Корзина"
            onPress={() => navigate("/cart")}
          >
            <Badge content={totalItems} color="primary" placement="top-right" size="sm">
              <CartIcon className="text-2xl text-default-500" />
            </Badge>
          </Button>
        </NavbarItem>
        <NavbarItem className="flex">
          <Button
            isIconOnly
            variant="light"
            aria-label="Профиль"
            onPress={() => navigate("/profile")}
          >
            <UserIcon className="text-2xl text-default-500" />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <Button
          isIconOnly
          variant="light"
          aria-label="Корзина"
          onPress={() => navigate("/cart")}
        >
          <Badge content={totalItems} color="primary" placement="top-right" size="sm">
            <CartIcon className="text-2xl text-default-500" />
          </Badge>
        </Button>
        <Button
          isIconOnly
          variant="light"
          aria-label="Профиль"
          onPress={() => navigate("/profile")}
          className="mr-2"
        >
          <UserIcon className="text-2xl text-default-500" />
        </Button>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Button
            color="primary"
            variant="flat"
            fullWidth
            onClick={() => {
              setIsCategoryDrawerOpen(true);
            }}
          >
            Категории
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            className={clsx(linkStyles(), "w-full", "data-[active=true]:font-bold")}
            href="/catalog"
            size="lg"
          >
            Каталог
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            className={clsx(linkStyles(), "w-full", "data-[active=true]:font-bold")}
            href="/about"
            size="lg"
          >
            О нас
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            className={clsx(linkStyles(), "w-full", "data-[active=true]:font-bold")}
            href="/delivery"
            size="lg"
          >
            Доставка
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            className={clsx(linkStyles(), "w-full", "data-[active=true]:font-bold")}
            href="/contacts"
            size="lg"
          >
            Контакты
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>

      <CategoryDrawer 
        isOpen={isCategoryDrawerOpen} 
        onClose={() => setIsCategoryDrawerOpen(false)} 
      />
    </HeroUINavbar>
  );
};
