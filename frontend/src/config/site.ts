// Зависимости для иконок социальных сетей (заглушка)
interface IconComponent {
  className?: string;
}

const InstagramIcon = (props: IconComponent) => null;
const VKIcon = (props: IconComponent) => null;
const TelegramIcon = (props: IconComponent) => null;
const WhatsAppIcon = (props: IconComponent) => null;

interface SiteConfig {
  name: string;
  description: string;
  mainNav: { title: string; href: string }[];
  links: {
    name: string;
    href: string;
    icon: React.FC<IconComponent>;
  }[];
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Цветочный Рай",
  description: "Магазин свежих цветов и букетов с доставкой",
  mainNav: [
    {
      title: "Главная",
      href: "/",
    },
    {
      title: "Каталог",
      href: "/catalog",
    },
    {
      title: "О нас",
      href: "/about",
    },
    {
      title: "Доставка и оплата",
      href: "/delivery",
    },
    {
      title: "Контакты",
      href: "/contact",
    },
  ],
  links: [
    {
      name: "Instagram",
      href: "https://instagram.com/flower-shop",
      icon: InstagramIcon,
    },
    {
      name: "ВКонтакте",
      href: "https://vk.com/flower-shop",
      icon: VKIcon,
    },
    {
      name: "Telegram",
      href: "https://t.me/flower-shop",
      icon: TelegramIcon,
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/79001234567",
      icon: WhatsAppIcon,
    },
  ],
  contactInfo: {
    address: "г. Москва, ул. Цветочная, д. 1",
    phone: "+7 (900) 123-45-67",
    email: "info@flower-shop.ru",
    workingHours: "Ежедневно с 8:00 до 20:00",
  },
};
