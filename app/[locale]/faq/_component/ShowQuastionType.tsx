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
    <motion.div 
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex flex-row justify-between gap-2 w-full"
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
              className="flex-1"
            >
              <Link href={link.href}>
                <motion.div
                  className={cn(
                    "relative overflow-hidden",
                    "bg-gradient-to-r",
                    link.gradient,
                    "backdrop-blur-xl",
                    "rounded-lg",
                    "border border-white/10",
                    "shadow-sm"
                  )}
                  initial={{ borderRadius: 8 }}
                  whileHover={{ 
                    boxShadow: `0 4px 16px -2px rgba(var(--${link.shadow}-500-rgb), 0.2)`,
                  }}
                >
                  <motion.div 
                    className="p-2"
                    initial={{ background: "none" }}
                    whileHover={{ 
                      background: "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))" 
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {/* Icon and Count Row */}
                      <div className="flex items-center gap-2">
                        <motion.div
                          className={cn(
                            "p-1.5 rounded-md",
                            link.iconBg
                          )}
                          whileHover={{ 
                            scale: 1.1,
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

                        <motion.span
                          className="text-base font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent"
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {link.count}
                        </motion.span>
                      </div>

                      {/* Title - Hidden on Mobile */}
                      <Text variant="span" locale= {locale} className="hidden md:block text-[16px] text-center font-medium text-gray-600 dark:text-gray-400">
                        {link.title}
                      </Text>
                        

                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 opacity-0 bg-gradient-to-r from-white/20 to-transparent"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {msgHint && (
        <Text variant="span" locale= {locale}  className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          {msgHint}
          </Text>
        
      )}
    </motion.div>
  );
}