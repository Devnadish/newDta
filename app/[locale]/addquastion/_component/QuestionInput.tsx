"use client";

import Text from "@/components/Text";
import { Textarea } from "@/components/ui/textarea";
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X as XIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';

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
        
        if (value.length > MAX_LENGTH) {
            onError(`Question cannot exceed ${MAX_LENGTH} characters`);
            return;
        }
        
        setQuestion(value);
    };

    const getRemainingChars = () => MAX_LENGTH - question.length;
    
    const getCharacterCountColor = () => {
        const remaining = getRemainingChars();
        if (question.length < MIN_LENGTH) return "text-gray-500";
        if (remaining < MAX_LENGTH * 0.2) return "text-red-500";
        return "text-green-500";
    };

    const isValidLength = question.length >= MIN_LENGTH && question.length <= MAX_LENGTH;
    const hasSpecialCharsOnly = /^[^a-zA-Z0-9]+$/.test(question);
    const isValid = isValidLength && !hasSpecialCharsOnly;

    const handleClear = () => {
        setQuestion("");
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-3"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                        <HelpCircle className="w-4 h-4 text-indigo-500" />
                    </div>
                    <Text 
                        variant="span" 
                        locale={locale} 
                        className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100"
                    >
                        {t("question")}
                    </Text>
                </div>
                <motion.div
                    initial={false}
                    animate={{ scale: question.length > 0 ? 1 : 0.8, opacity: question.length > 0 ? 1 : 0.5 }}
                    className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full 
                        ${getCharacterCountColor()} 
                        bg-white dark:bg-gray-800 shadow-sm
                        border border-gray-200 dark:border-gray-700`}
                >
                    {getRemainingChars()} {t("letterRemaining")}
                </motion.div>
            </div>

            <div className="relative">
                <Textarea
                    value={question}
                    onChange={handleChange}
                    placeholder={t("textPlaceholder")}
                    className={`min-h-[120px] bg-white dark:bg-gray-800 rounded-xl
                        border-2 transition-colors duration-200
                        ${!isValid && question.length > 0 
                            ? 'border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5' 
                            : isValid && question.length > 0
                                ? 'border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/5'
                                : 'border-gray-200 dark:border-gray-700'
                        }`}
                    maxLength={MAX_LENGTH}
                />
            </div>

            <AnimatePresence>
                {question.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={handleClear}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm
                            text-red-500 hover:text-red-600
                            bg-red-50 hover:bg-red-100
                            dark:bg-red-500/10 dark:hover:bg-red-500/20
                            rounded-lg transition-colors"
                        title={t("clear")}
                    >
                        <XIcon className="w-4 h-4" />
                        <Text variant="span" locale={locale}>
                            {t("clear")}
                        </Text>
                    </motion.button>
                )}
            </AnimatePresence>
            
            {/* Validation Messages */}
            <AnimatePresence>
                {question.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                    >
                        {/* Error Messages */}
                        <div className="space-y-1.5">
                            {question.length < MIN_LENGTH && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-1.5 text-red-500"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    <Text variant="span" locale={locale} className="text-xs">
                                        {t("questionlength")}
                                    </Text>
                                </motion.div>
                            )}
                            {hasSpecialCharsOnly && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-1.5 text-red-500"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    <Text variant="span" locale={locale} className="text-xs">
                                        {t("hasSpecialCharsOnly")}
                                    </Text>
                                </motion.div>
                            )}
                            {getRemainingChars() < MAX_LENGTH * 0.2 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-1.5 text-orange-500"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    <Text variant="span" locale={locale} className="text-xs">
                                        {t("quastionMaxLength")} {getRemainingChars()} {t("characters")}
                                    </Text>
                                </motion.div>
                            )}
                        </div>

                        {/* Guidelines */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-2"
                        >
                            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <Text variant="span" locale={locale} className="text-xs font-medium">
                                    {t("guidelines")}
                                </Text>
                            </div>
                            <ul className="text-gray-500 dark:text-gray-400 list-disc pl-5 text-xs space-y-1">
                                <li>
                                    <Text variant="span" locale={locale}>
                                        {t("leftSideOfLetter")} {MIN_LENGTH} {t("and")} {MAX_LENGTH} {t("characters")}
                                    </Text>
                                </li>
                                <li>
                                    <Text variant="span" locale={locale}>
                                        {t("quastionGuid2")}
                                    </Text>
                                </li>
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default QuestionInput;