import dynamic from "next/dynamic";
import { SimpleIconsDm } from "@/components/icons/Dm";
import { SimpleIconsNextui } from "@/components/icons/UI";
import { GuidanceVisualImpairment } from "@/components/icons/Videntity";
import { TeenyiconsSignOutline } from "@/components/icons/SignBoard";
import { GameIconsCharcuterie } from "@/components/icons/Char";
import { GameIconsCircularSawblade } from "@/components/icons/Saw";
import { GisLandcoverMap } from "@/components/icons/CoverPage";
import { FluentMdl2PythonLogoYellow } from "@/components/icons/LogoD";
import { CodiconFileMedia } from "@/components/icons/Flyer";
import { TablerChartInfographic } from "@/components/icons/InfoGraph";
import { IcSharpRestaurantMenu } from "@/components/icons/FoodMenu";
import { HugeiconsPackage } from "@/components/icons/Package";
import { GameIconsTargetPoster } from "@/components/icons/Poster";
import Image from "next/image";
import Link from "next/link";
import TaskCounter from "@/components/TaskCounter";
import { convertToSlug } from "@/lib/nadish";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import Text from "@/components/Text";


export const metadata = {
  title: "Our Work",
};

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale;
  const t = await getTranslations("workSample");
  const data = [
    {
      id: "sm",
      title: t("smMenuTilte"),
      icon: <SimpleIconsDm />,
      prefix: "sm",
    },
    {
      id: "uiux",
      title: t("uiUxMenuTitle"),
      icon: <SimpleIconsNextui />,
      prefix: "ui",
    },
    {
      id: "identity",
      title: t("identityMenuTitle"),
      icon: <GuidanceVisualImpairment />,
      prefix: "Identity",
    },
    {
      id: "signboard",
      title: t("singBoardMEnuTitle"),
      icon: <TeenyiconsSignOutline />,
      prefix: "sinboard",
    },
    {
      id: "cnc",
      title: t("cncMenuTitle"),
      icon: <GameIconsCircularSawblade />,
      prefix: "cnc",
    },
    {
      id: "Character",
      title: t("Character"),
      icon: <GameIconsCharcuterie />,
      prefix: "character",
    },
    {
      id: "Coverpage",
      title: t("Coverpage"),
      icon: <GisLandcoverMap />,
      prefix: "coverage",
    },
    {
      id: "Logo",
      title: t("Logo"),
      icon: <FluentMdl2PythonLogoYellow />,
      prefix: "logo",
    },
    {
      id: "flyer",
      title: t("flyer"),
      icon: <CodiconFileMedia />,
      prefix: "flyer",
    },
    {
      id: "infograph",
      title: t("infograph"),
      icon: <TablerChartInfographic />,
      prefix: "infograph",
    },
    {
      id: "menu",
      title: t("menu"),
      icon: <IcSharpRestaurantMenu />,
      prefix: "menu",
    },
    {
      id: "package",
      title: t("package"),
      icon: <HugeiconsPackage />,
      prefix: "package",
    },
    {
      id: "poster",
      title: t("poster"),
      icon: <GameIconsTargetPoster />,
      prefix: "poster",
    },
  ];

  return (
    <div className={cn(
      "min-h-screen w-full",
      "py-4 sm:py-6 md:py-8",
      "px-2 sm:px-4 md:px-6",
      "bg-gradient-to-br from-background via-background/98 to-background/95"
    )}>
      <div className="max-w-[1400px] mx-auto">
        <div className={cn(
          "mb-6 sm:mb-8 md:mb-12 text-center",
          "px-2 sm:px-4",
          "animate-in slide-in-from-bottom-4 duration-700"
        )}>
          <Text variant="h1" locale={locale} className={cn(
            "text-2xl sm:text-3xl md:text-4xl font-bold",
            "bg-gradient-to-r from-primary via-primary/80 to-primary/60",
            "bg-clip-text text-transparent",
            "mb-2 sm:mb-4"
          )}>
            {t("pageTitle")}
          </Text>
          <Text variant="p" locale={locale} className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t("pageDescription")}
          </Text>
        </div>

        <div className={cn(
          "grid gap-2 sm:gap-3 md:gap-4",
          "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
          "p-2 sm:p-4",
          "place-items-center"
        )}>
          {data.map((el) => {
            return (
              <Link
              href={`/${locale}/worksample/${convertToSlug(el.title)}`}
              className={cn(
                "relative flex items-center justify-center",
                "w-full max-w-[200px] min-h-[120px]",
                "rounded-xl",
                "bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80",
                "border border-border/30",
                "flex-col gap-1.5 sm:gap-2",
                "p-3 sm:p-4",
                "group",
                "transition-all duration-300 ease-in-out",
                "hover:scale-[1.02] sm:hover:scale-105",
                "hover:bg-gradient-to-br hover:from-primary/30 hover:via-primary/20 hover:to-primary/10",
                "hover:border-primary/30",
                "hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]"
              )}
              key={el.id}
            >
              <TaskCounter prefix={el.prefix} />
              
              <div className={cn(
                "absolute inset-0",
                "bg-gradient-to-br from-primary/5 via-primary/3 to-transparent",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-500",
                "rounded-xl"
              )} />
              
              <div className={cn(
                "relative z-10",
                "flex flex-col items-center",
                "gap-1.5 sm:gap-2",
                "transition-transform duration-300",
                "group-hover:translate-y-[-2px]"
              )}>
                <div className={cn(
                  "transition-transform duration-300",
                  "group-hover:scale-110",
                  "text-primary/80 group-hover:text-primary",
                  "scale-90 sm:scale-100"
                )}>
                  {el.icon}
                </div>
                <Text locale={locale} variant="span" className={cn(
                  "text-xs sm:text-sm font-medium text-center",
                  "text-foreground/80 group-hover:text-primary",
                  "transition-colors duration-300",
                  "line-clamp-2"
                )}>
                  {el.title}
                </Text>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default page;

const TitleHeader = ({ title }: { title: string }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-start",
      "min-h-[50vh] sm:min-h-[70vh]",
      "py-4 sm:py-6 md:py-8",
      "px-2 sm:px-4 md:px-6",
      "font-lateef"
    )}>
      <div className={cn(
        "text-lg sm:text-xl md:text-2xl",
        "w-full max-w-[500px]",
        "bg-gradient-to-br from-card via-card/95 to-card/90",
        "border border-white/10",
        "rounded-xl",
        "p-4 sm:p-5 md:p-6",
        "leading-relaxed sm:leading-loose",
        "text-pretty text-justify",
        "shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]",
        "animate-in slide-in-from-bottom-4 duration-700"
      )}>
        {title}
      </div>
      <div className={cn(
        "mt-6 sm:mt-8",
        "border border-white/10",
        "bg-gradient-to-br from-card via-card/95 to-card/90",
        "rounded-full",
        "p-3 sm:p-4",
        "shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]",
        "animate-bounce"
      )}>
        <svg
          className={cn(
            "w-6 h-6 sm:w-8 sm:h-8",
            "text-primary",
            "transition-colors duration-300"
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m0 0l-4-4m4 4l4-4"
          />
        </svg>
      </div>
    </div>
  );
};