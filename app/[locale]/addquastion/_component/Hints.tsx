import Text from "@/components/Text";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Info, AlertCircle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface HintsProps {
    className?: string;
    initialState?: boolean;
    onStateChange?: (isOpen: boolean) => void;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

const Hints = ({ className = "", initialState = false, onStateChange }: HintsProps) => {
    const t = useTranslations("addFaq");
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(initialState);

    const hints = [
        { icon: Info, text: t("pcHint1"), color: "text-blue-500" },
        { icon: AlertCircle, text: t("pcHint2"), color: "text-yellow-500" },
        { icon: CheckCircle2, text: t("pcHint3"), color: "text-green-500" },
        { icon: XCircle, text: t("pcHint4"), color: "text-red-500" },
        { icon: HelpCircle, text: t("pcHint5"), color: "text-purple-500" }
    ];

    const toggleOpen = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        onStateChange?.(newState);
    };

    return (
        <div className={`${className} relative w-full`}>
            <motion.button
                onClick={toggleOpen}
                className="group flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`${isOpen ? 'text-blue-500' : 'text-gray-400'} transition-colors`}
                >
                    <Info size={20} />
                </motion.div>
                <Text 
                    locale={locale} 
                    variant='span' 
                    className={`text-sm font-medium ${isOpen ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'} group-hover:text-blue-500 transition-colors`}
                >
                    {isOpen ? t('hide') + " " + t("Hint") : t('show') + " " + t("Hint")}
                </Text>
            </motion.button>

            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0, 
                            height: "auto",
                            transition: {
                                height: { type: "spring", stiffness: 500, damping: 30 },
                                opacity: { duration: 0.2 }
                            }
                        }}
                        exit={{ 
                            opacity: 0, 
                            y: -10, 
                            height: 0,
                            transition: {
                                height: { type: "spring", stiffness: 500, damping: 30 },
                                opacity: { duration: 0.2 }
                            }
                        }}
                        className="overflow-hidden mt-2"
                    >
                        <motion.div 
                            variants={container}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 rounded-lg p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                        >
                            <motion.h3
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100"
                            >
                                <Text locale={locale} variant='span'>{t("policyHint")}</Text>
                            </motion.h3>

                            <motion.div 
                                variants={container}
                                className="space-y-3"
                            >
                                {hints.map(({ icon: Icon, text, color }, index) => (
                                    <motion.div
                                        key={index}
                                        variants={item}
                                        className="flex items-start gap-3 group"
                                    >
                                        <div className={`p-2 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 ${color}`}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <Text 
                                                locale={locale} 
                                                variant='span' 
                                                className="text-sm text-gray-600 dark:text-gray-300"
                                            >
                                                {text}
                                            </Text>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Hints;