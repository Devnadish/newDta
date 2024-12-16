import ShowQuastion from "@/components/faq/quastion/ShowQuastion";
import FilterResult from "../_component/FilterResult";
import { GetQuestions } from "@/actions/faq/answerFilter";
import NoQuestion from "@/components/icons/FilterIcons";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Loader, Search, AlertCircle, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';
import Text from "@/components/Text";

export default async function FAQ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    tag: string;
    search: string;
    mode: string;
    sort: string;
  }>;
}) {
  const { tag, search, mode, sort } = await searchParams;
  const t = await getTranslations();
  const locale = (await params).locale;
  const { QuestionsWithAnswers, QueryCont, pagesCount } = await GetQuestions(
    tag,
    search,
    mode,
    sort,
    1,
    10
  );

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 p-6 rounded-2xl">
        <div className="space-y-2">
          <Text variant="h1" locale={locale} className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t("Faq.pagetitle")}
          </Text>
          <Text variant="p" locale={locale} className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {t("Faq.pageDescription")}
          </Text>
        </div>
        <Link 
          href="/addquastion" 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 
            text-white rounded-xl transition-all duration-200 transform hover:scale-105
            shadow-lg shadow-indigo-500/20"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <Text variant="span" locale={locale}>{t("Faq.askQuestion")}</Text >
        </Link>
      </div>

      {/* Filter Section */}
      <FilterResult
        tag={tag}
        search={search}
        mode={mode}
        sort={sort}
        queryCount={QueryCont || 0}
        pagesCount={pagesCount || 0}
      />

      {/* Questions List */}
      <div className="space-y-4">
        {QueryCont === 0 ? (
          <NoQuestions t={t} />
        ) : (
          <ShowQuestions QuestionsWithAnswers={QuestionsWithAnswers} />
        )}
      </div>
    </div>
  );
}

const NoQuestions = ({ t }: { t: any }) => {
  return (
    <div className="flex items-center justify-center w-full py-16 flex-col gap-6
      bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed
      border-gray-200 dark:border-gray-700">
      <div className="relative">
        <div className="absolute inset-0 animate-ping opacity-50">
          <Search className="w-16 h-16 text-gray-400" />
        </div>
        <Search className="w-16 h-16 text-gray-400" />
      </div>
      <div className="text-center space-y-2">
        <Text variant="h2" locale={t.locale} className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t("Faq.noQuestions")}
        </Text>
        <Text variant="p" locale={t.locale} className="text-sm text-gray-500 dark:text-gray-400">
          {t("Faq.tryDifferentFilter")}
        </Text>
      </div>
    </div>
  );
};

const ShowQuestions = ({
  QuestionsWithAnswers,
}: {
  QuestionsWithAnswers: any;
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {QuestionsWithAnswers.map((item: any) => (
        <ShowQuastion item={item} key={item.id} />
      ))}
    </div>
  );
};

const NoMoreQuestions = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center p-8 rounded-xl
    bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
    <div className="flex flex-col items-center gap-4">
      <AlertCircle className="w-12 h-12 text-amber-500" />
      <Text variant="h3" locale="en" className="text-lg font-semibold text-amber-700 dark:text-amber-400">
        {title}
      </Text>
      <Loader className="w-8 h-8 text-amber-500 animate-spin" />
    </div>
  </div>
);