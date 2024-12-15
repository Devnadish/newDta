import React from "react";
import { SheetClose } from "@/components/ui/sheet";
import Link from "next/link";


import {
  Book,
  Briefcase,
  MessageCircle,
  HelpCircle,
  DollarSign,
} from "lucide-react";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import Typography from "@/components/Text";

const MenuItems = React.memo(() => {
  const t = useTranslations("MenuItems");
  const locale = useLocale();

  // Define menu items with their corresponding icons
  const menuItems = [
    {
      href: `/${locale}/prices`,
      label: t("price"),
      icon: <DollarSign size={20} className="text-primary" />,
    },
    {
      href: `/${locale}/worksample`,
      label: t("sample"),
      icon: <Briefcase size={20} className="text-primary" />,
    },
    {
      href: `/${locale}/blog`,
      label: t("blog"),
      icon: <Book size={20} className="text-primary" />,
    },
    {
      href: `/${locale}/faq/ansewrd`,
      label: t("faq"),
      icon: <HelpCircle size={20} className="text-primary" />,
    },
    {
      href: `/${locale}/contactus`,
      label: t("contactUs"),
      icon: <MessageCircle size={20} className="text-primary" />,
    },
  ];

  return (
    <div className="w-full flex flex-col items-start justify-center gap-4">
      {menuItems.map((item) => (
        <SheetClose asChild key={item.label}>
          <Link
            href={item.href}
            className="flex items-center gap-2 hover:text-primary hover:bg-primary/10 p-2 rounded-md w-full"
          >
            {item.icon}
            <Typography variant="span" className="text-base font-semibold" locale={locale}>
              {item.label}
            </Typography>
          </Link>
        </SheetClose>
      ))}
    </div>
  );
});

MenuItems.displayName = "MenuItems";
export default MenuItems;
