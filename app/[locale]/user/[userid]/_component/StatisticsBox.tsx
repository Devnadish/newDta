import { cn } from "@/lib/utils";
import MotionDiv from "@/components/MotionDiv";
import {
  CarbonFavoriteFilled,
  IcRoundPendingActions,
  MdiBellOutline,
  MdiChatQuestionOutline,
  RiQuestionAnswerLine,
  SimpleLineIconsClose,
} from "@/components/icons/EmailIcon";

interface StatItemProps {
  icon: React.ReactNode;
  count: string;
  label: string;
  color?: string;
}

const StatItem = ({ icon, count, label, color = "primary" }: StatItemProps) => (
  <MotionDiv
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "flex flex-col items-center justify-center",
      "p-4 rounded-xl",
      "bg-background/60 backdrop-blur-md",
      "border border-border/50",
      "transition-all duration-300",
      "hover:shadow-lg hover:border-border/80",
      "hover:bg-background/80",
      "group cursor-pointer"
    )}
  >
    <div className={cn(
      "text-2xl mb-2 transition-transform duration-300 group-hover:scale-110", 
      {
        'text-primary/90 group-hover:text-primary': color === 'primary',
        'text-warning/90 group-hover:text-warning': color === 'warning',
        'text-destructive/90 group-hover:text-destructive': color === 'destructive'
      }
    )}>{icon}</div>
    <div className="text-xl font-bold mb-1 transition-colors duration-300 group-hover:text-primary">{count}</div>
    <div className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">{label}</div>
  </MotionDiv>
);

interface StatisticsBoxProps {
  QuestionsWithAnswers: any[];
  PendingQuestions: any[];
  RejectedQuestions: any[];
}

const StatisticsBox: React.FC<StatisticsBoxProps> = ({
  QuestionsWithAnswers,
  PendingQuestions,
  RejectedQuestions,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatItem
        icon={<MdiChatQuestionOutline />}
        count={String(QuestionsWithAnswers.length + PendingQuestions.length + RejectedQuestions.length)}
        label="Total Questions"
      />
      <StatItem
        icon={<RiQuestionAnswerLine />}
        count={String(QuestionsWithAnswers.length)}
        label="Answered"
        color="primary"
      />
      <StatItem
        icon={<IcRoundPendingActions />}
        count={String(PendingQuestions.length)}
        label="Pending"
        color="warning"
      />
      <StatItem
        icon={<SimpleLineIconsClose />}
        count={String(RejectedQuestions.length)}
        label="Rejected"
        color="destructive"
      />
    </div>
  );
};

export default StatisticsBox;