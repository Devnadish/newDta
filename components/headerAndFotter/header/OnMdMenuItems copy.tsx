"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Book,
  Briefcase,
  MessageCircle,
  HelpCircle,
  DollarSign,
  ChevronDown,
  Menu
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Typography from "@/components/Text";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

const OnMdMenuItems = React.memo(() => {
  const t = useTranslations("MenuItems");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems = [
    {
      href: `/${locale}/prices`,
      label: t("price"),
      description: t("priceDescription"),
      icon: <DollarSign size={16} className="text-primary" />,
    },
    {
      href: `/${locale}/worksample`,
      label: t("sample"),
      description: t("sampleDescription"),
      icon: <Briefcase size={16} className="text-primary" />,
    },
    {
      href: `/${locale}/blog`,
      label: t("blog"),
      description: t("blogDescription"),
      icon: <Book size={16} className="text-primary" />,
    },
    {
      href: `/${locale}/contactus`,
      label: t("contact"),
      description: t("contactDescription"),
      icon: <MessageCircle size={16} className="text-primary" />,
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <nav className="flex items-center gap-4">
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <button className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
            "hover:bg-primary/10 group"
          )}>
            <Menu size={18} className="text-primary" />
            <Typography
              variant="span"
              locale={locale}
              className="text-sm font-medium text-foreground/80"
            >
              {t("menu")}
            </Typography>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-180" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[280px] p-4 z-50"
          sideOffset={8}
        >
          <div className="grid gap-3">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                  "hover:bg-primary/10",
                  pathname === item.href ? "bg-primary/5" : ""
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-md",
                  pathname === item.href ? "bg-primary/10" : "bg-transparent"
                )}>
                  {item.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <Typography
                    variant="span"
                    locale={locale}
                    className={cn(
                      "text-sm font-medium",
                      pathname === item.href ? "text-primary" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="p"
                    locale={locale}
                    className="text-xs text-muted-foreground line-clamp-1"
                  >
                    {item.description}
                  </Typography>
                </div>
              </Link>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* FAQ Link - Separate from HoverCard menu */}
      <Link
        href={`/${locale}/faq`}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
          "bg-primary/5 hover:bg-primary/10",
          pathname.includes("/faq") ? "bg-primary/20" : "",
          "border border-primary/20"
        )}
      >
        <HelpCircle size={16} className="text-primary" />
        <Typography
          variant="span"
          locale={locale}
          className={cn(
            "text-sm font-medium",
            pathname.includes("/faq") ? "text-primary" : "text-foreground/80"
          )}
        >
          {t("faq")}
        </Typography>
      </Link>
    </nav>
  );
});

OnMdMenuItems.displayName = "OnMdMenuItems";

export default OnMdMenuItems;