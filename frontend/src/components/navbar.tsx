import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
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
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import clsx from "clsx";
import { useAppContext } from "@/contexts/AppContext";
import { SearchIcon, ShoppingCartIcon, UserIcon } from "@/components/icons";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const { isAuthenticated, user, cart, logout } = useAppContext();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  useEffect(() => {
    // Подсчитываем общее количество товаров в корзине
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemsCount(count);
  }, [cart]);

  const searchInput = (
    <Input
      aria-label="Поиск"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Найти цветы..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C10.6868 22 9.38642 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2Z" fill="#FF7AC6"/>
              <path d="M12 7C12.5523 7 13 7.44772 13 8V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V8C11 7.44772 11.4477 7 12 7Z" fill="white"/>
              <path d="M7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z" fill="white"/>
            </svg>
            <p className="font-bold text-inherit">E-Flower Shop</p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        
        <NavbarItem>
          <Link href="/cart" aria-label="Корзина" color="foreground">
            <div className="relative">
              <ShoppingCartIcon className="text-default-500 w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </div>
          </Link>
        </NavbarItem>
        
        <NavbarItem>
          {isAuthenticated ? (
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="light" 
                  className="p-0 bg-transparent"
                  startContent={<UserIcon className="text-default-500 w-6 h-6" />}
                >
                  {user?.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Меню пользователя">
                <DropdownItem key="profile" href="/profile">Профиль</DropdownItem>
                <DropdownItem key="orders" href="/orders">Мои заказы</DropdownItem>
                <DropdownItem key="logout" onClick={() => logout()}>Выйти</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button 
              as={Link} 
              href="/login" 
              variant="flat" 
              className="text-primary"
            >
              Войти
            </Button>
          )}
        </NavbarItem>
        
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link href="/cart" aria-label="Корзина" color="foreground">
          <div className="relative">
            <ShoppingCartIcon className="text-default-500 w-6 h-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </div>
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <Link
                color={index === siteConfig.navMenuItems.length - 1 ? "danger" : "foreground"}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
