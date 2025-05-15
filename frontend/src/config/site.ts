export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Flower Shop",
  description: "Интернет-магазин цветов и букетов с функциями онлайн-заказа и доставки.",
  navItems: [
    {
      label: "Главная",
      href: "/",
    },
    {
      label: "Каталог",
      href: "/catalog",
    },
    {
      label: "Доставка",
      href: "/delivery",
    },
    {
      label: "Контакты",
      href: "/contacts",
    },
  ],
  navMenuItems: [
    {
      label: "Главная",
      href: "/",
    },
    {
      label: "Каталог",
      href: "/catalog",
    },
    {
      label: "Доставка",
      href: "/delivery",
    },
    {
      label: "Профиль",
      href: "/profile",
    },
    {
      label: "Мои заказы",
      href: "/orders",
    },
    {
      label: "Контакты",
      href: "/contacts",
    },
    {
      label: "Выйти",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
