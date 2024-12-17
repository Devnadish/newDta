'use client';

import { Check, Loader, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Text from "@/components/Text";
import { useLocale } from "next-intl";

interface FAQProps {
  answeredQuestions: number;
  pendingQuestions: number;
  rejectedQuestions: number;
  msgHint?: string;
  linkTitle: {
    pending: string;
    answered: string;
    rejected: string;
  };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    x: -20,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export default function ShowQuastionType({
  answeredQuestions = 0,
  pendingQuestions = 0,
  rejectedQuestions = 0,
  msgHint,
  linkTitle
}: FAQProps) {
  const locale = useLocale();
  const links = [
    {
      href: "/faq/ansewrd",
      icon: <Check className="w-4 h-4 text-emerald-500" />,
      count: answeredQuestions,
      title: linkTitle.answered,
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconBg: "bg-emerald-500/10",
      shadow: "emerald"
    },
    {
      href: "/faq/notanswered",
      icon: <Loader className="w-4 h-4 text-sky-500" />,
      count: pendingQuestions,
      title: linkTitle.pending,
      gradient: "from-sky-500/10 to-blue-500/10",
      iconBg: "bg-sky-500/10",
      shadow: "sky"
    },
    {
      href: "/faq/rejected",
      icon: <X className="w-4 h-4 text-rose-500" />,
      count: rejectedQuestions,
      title: linkTitle.rejected,
      gradient: "from-rose-500/10 to-pink-500/10",
      iconBg: "bg-rose-500/10",
      shadow: "rose"
    }
  ];

  return (
    <div className="flex flex-col items-start justify-between w-full gap-1">
    {msgHint && (
      <Text 
        variant="span" 
        locale={locale}  
        className="block text-xs text-center text-gray-500/80 dark:text-gray-400/80 mt-2"
      >
        {msgHint}
      </Text>
    )}
    <div className="flex flex-row gap-4 w-full justify-between items-center p-2 rounded-lg bg-white/20 backdrop-blur-3xl shadow-lg">
    <motion.div 
      className="w-full space-y-3"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="grid grid-cols-3 gap-2 sm:gap-3 w-full"
        variants={containerVariants}
      >
        <AnimatePresence>
          {links.map((link, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              layout
              className="w-full"
            >
              <Link href={link.href} className="block w-full">
                <motion.div
                  className={cn(
                    "relative overflow-hidden",
                    "bg-gradient-to-r",
                    link.gradient,
                    "backdrop-blur-xl",
                    "rounded-lg",
                    "border border-white/10",
                    "shadow-sm",
                    "py-2 sm:py-2.5 px-2 sm:px-3"
                  )}
                  initial={{ borderRadius: 8 }}
                  whileHover={{ 
                    boxShadow: `0 4px 16px -2px rgba(var(--${link.shadow}-500-rgb), 0.1)`,
                  }}
                >
                  <motion.div 
                    className="w-full"
                    initial={{ background: "none" }}
                    whileHover={{ 
                      background: "linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0))" 
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <motion.div
                          className={cn(
                            "p-1.5 rounded-md",
                            link.iconBg
                          )}
                          whileHover={{ 
                            scale: 1.05,
                            rotate: link.icon.type === Loader ? 360 : 0 
                          }}
                          transition={{ 
                            type: "spring",
                            stiffness: 300,
                            damping: 10
                          }}
                        >
                          {link.icon}
                        </motion.div>

                        <Text 
                          variant="span" 
                          locale={locale} 
                          className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-400 line-clamp-1"
                        >
                          {link.title}
                        </Text>
                      </div>

                      <motion.span
                        className="text-sm sm:text-base font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent"
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {link.count}
                      </motion.span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 opacity-0 bg-gradient-to-r from-white/10 to-transparent"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
    </motion.div>
    </div>
    </div>
  );
}