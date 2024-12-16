import ShowQuastion from "@/components/faq/quastion/ShowQuastion";
import FilterResult from "../_component/FilterResult";
import { GetQuestions } from "@/actions/faq/answerFilter";
import NoQuestion from "@/components/icons/FilterIcons";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Loader } from "lucide-react";

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
  const t = await getTranslations()
  const { QuestionsWithAnswers, QueryCont, pagesCount } = await GetQuestions(
    tag,
    search,
    mode,
    sort,
    1,
    10
  );
  return (
    <div className="flex flex-col gap-2 w-full  ">
      {/* <FaqSkelton /> */}
      {/* <FakFaq /> */}
      {/* <Link href="/faq/addquastion" className="fixed bottom-16 left-5 size-12 rounded-full flex items-center justify-center bg-blueColor text-foreground hover:bg-orangeColor hover:text-white animate-pulse">  <FluentChatAdd16Regular />
      </Link>
      <div className="flex flex-col  md:flex-row items-center justify-between w-full gap-4" >
        <WelcomeMessage />
        <NavLinks msgHint={t("Faq.notPerfect")} />
      </div> */}
      <FilterResult
        tag={tag}
        search={search}
        mode={mode}
        sort={sort}
        queryCount={QueryCont || 0}
        pagesCount={pagesCount || 0}
      />


      {QueryCont === 0 ? (
        <NoQuestions />
      ) : (
        <ShowQuestions QuestionsWithAnswers={QuestionsWithAnswers} />
      )}
    </div>
  );
}

const NoQuestions = () => {
  return (
    <div className="flex items-center justify-center w-full h-[50vh] flex-col gap-4">
      <NoQuestion width={100} height={100} />
      <p className="text-xl font-bold">No Quastion With Same Filter</p>
    </div>
  );
};

const ShowQuestions = ({
  QuestionsWithAnswers,
}: {
  QuestionsWithAnswers: any;
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* <VoiceRecorder /> */}
      {QuestionsWithAnswers.map((item: any) => {
        return <ShowQuastion item={item} key={item.id} />;
      })}
    </div>
  );
};




const NoMoreQuestions = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center  text-xl font-cairo font-bold w-full h-32 bg-yellowColor rounded-lg text-blueColor  flex-col gap-4">
    {title}
    <Loader className="text-4xl animate-spin" size={50} />
  </div>
);
