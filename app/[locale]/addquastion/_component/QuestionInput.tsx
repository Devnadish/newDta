import Text from "@/components/Text";
import { Textarea } from "@/components/ui/textarea";
import { useLocale, useTranslations } from 'next-intl';

const QuestionInput = ({ 
    question,
    setQuestion,
    onError
}: { 
    question: string;
    setQuestion: (question: string) => void;
    onError: (message: string) => void;
}) => {
    const t = useTranslations("addFaq"); 
    const locale = useLocale();
    const MAX_LENGTH = 500;
    const MIN_LENGTH = 10;
    
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        
        // Prevent exceeding max length
        if (value.length > MAX_LENGTH) {
            onError(`Question cannot exceed ${MAX_LENGTH} characters`);
            return;
        }
        
        setQuestion(value);
    };

    const getRemainingChars = () => MAX_LENGTH - question.length;
    
    const getCharacterCountColor = () => {
        const remaining = getRemainingChars();
        if (question.length < MIN_LENGTH) return "text-foreground";
        if (remaining < MAX_LENGTH * 0.2) return "text-red-500 bg-white dark:bg-primary px-2 py-1 rounded-full shadow-sm";
        return "text-gray-800";
    };

    const isValidLength = question.length >= MIN_LENGTH && question.length <= MAX_LENGTH;
    const hasSpecialCharsOnly = /^[^a-zA-Z0-9]+$/.test(question);
    const isValid = isValidLength && !hasSpecialCharsOnly;

    const handleClear = () => {
        setQuestion("");
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
                <Text variant="span" locale={locale} className="text-sm font-medium">{t("question")}</Text>
                <Text variant="span" locale={locale} className={`text-xs ${getCharacterCountColor()}`}>
                    {getRemainingChars()} {t("letterRemaining")}
                </Text>
            </div>
            <div className="flex flex-col">
                <Textarea
                    value={question}
                    onChange={handleChange}
                    placeholder={t("textPlaceholder")}
                    className={`min-h-[100px] bg-gray-100 dark:bg-gray-700 rounded-md pr-4 ${
                        !isValid && question.length > 0 ? 'border-red-500' : ''
                    }`}
                    maxLength={MAX_LENGTH}
                />
                {/* Clear Button */}
                <div className=" flex gap-2 items-center justify-end w-full">
                    {question.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                            title="Clear text"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                        </button>
                    )}
                    <div className={`text-xs font-medium ${getCharacterCountColor()} text-foreground bg-white dark:bg-gray-400 px-2 py-1 rounded-full shadow-sm`}>
                        {getRemainingChars()}
                    </div>
                </div>
            </div>
            
            {/* Validation Messages */}
            <div className="text-xs space-y-1">
                {question.length > 0 && (
                    <>
                        {question.length < MIN_LENGTH && (
                            <Text variant="span" locale={locale} className="text-red-500">
                                ⚠️ {t("questionlength")}
                            </Text>
                        )}
                        {hasSpecialCharsOnly && (
                            <Text variant="span" locale={locale} className="text-red-500">
                                ⚠️ {t("hasSpecialCharsOnly")}
                            </Text>
                        )}
                        {getRemainingChars() < MAX_LENGTH * 0.2 && (
                            <Text variant="span" locale={locale} className="text-orange-500">
                                {t("quastionMaxLength")} {getRemainingChars()} {t("characters")}
                            </Text>
                        )}
                    </>
                )}
                <ul className="text-gray-500 list-disc pl-4 pt-1">
                    <li><Text variant="span" locale={locale}>{t("leftSideOfLetter")}</Text> {MIN_LENGTH} <Text variant="span" locale={locale}>{t("and")}</Text> {MAX_LENGTH} <Text variant="span" locale={locale}>{t("characters")}</Text></li>
                    <li><Text variant="span" locale={locale}>{t("quastionGuid2")}</Text></li>
                    <li><Text variant="span" locale={locale}>{t("quastionGuid3")}</Text></li>
                </ul>
            </div>
        </div>
    );
};
export default QuestionInput;