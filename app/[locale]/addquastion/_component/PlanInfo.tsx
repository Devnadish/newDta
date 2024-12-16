import { useLocale, useTranslations } from 'next-intl';
import Text from '@/components/Text';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Star, Clock, Zap, Crown, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    balance: number;
    image: string;
    initailBalance: number;
    usedBalance: number;
}

// User Profile Component
const UserProfile = ({ name, image }: { name: string; image: string }) => (
    <div className='flex items-center gap-3'>
        <Avatar className="border-2 border-gray-400 w-12 h-12">
            <Image src={image} alt={name} width={48} height={48} className="rounded-full object-cover" priority />
            <AvatarFallback className="bg-primary/10 text-lg">{name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
            <Text variant="h3" className="text-xs md:text-lg font-semibold">{name}</Text>
            <Text variant="span" className="text-xs md:text-sm text-gray-400">@{name.toLowerCase().replace(/\s+/g, '')}</Text>
        </div>
    </div>
);

// Questions Balance Component
const QuestionsBalance = ({ remainingQuestions, initailBalance, locale, t }: { 
    remainingQuestions: number; 
    initailBalance: number;
    locale: string; 
    t: any 
}) => (
    <div className='grid grid-cols-2 gap-4 w-full'>
        <div className='bg-gray-800/50 rounded-lg p-4 border border-gray-700'>
            <Text variant="span" locale={locale} className='text-xs md:text-sm text-gray-400 block mb-1'>{t('remainingQuestions')}</Text>
            <div className={`text-2xl font-bold flex items-center flex-col md:flex-row ${remainingQuestions === 0 ? 'text-red-400' : 'text-green-400'}`}>
                {remainingQuestions || 0}
                <span className="text-xs md:text-sm text-gray-500 ml-1">/ {initailBalance}</span>
            </div>
        </div>
        <div className='bg-gray-800/50 rounded-lg p-4 border border-gray-700'>
            <Text variant="span" locale={locale} className='text-xs md:text-sm text-gray-400 block mb-1'>{t('currcentBalance')}</Text>
            <div className="text-2xl font-bold text-blue-400 flex items-center flex-col md:flex-row">
                {initailBalance || 0}
                <span className="text-xs md:text-sm text-gray-500 ml-1">questions</span>
            </div>
        </div>
    </div>
);

// Mini Balance Display Component
const MiniBalance = ({ remainingQuestions, locale, t }: { remainingQuestions: number; locale: string; t: any }) => (
    <div className={`px-3 py-1.5 rounded-lg ${remainingQuestions === 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
        <Text variant="span" locale={locale} className="font-medium flex text-xs md:text-sm items-center flex-col md:flex-row">
            {remainingQuestions || 0} {t('remainingQuestions')}
        </Text>
    </div>
);

// Plan Feature Item
const PlanFeatureItem = ({ icon: Icon, text }: { icon: any; text: string }) => (
    <div className="flex items-center gap-3 bg-gray-800/30 p-3 rounded-lg">
        <div className="bg-gray-700 p-2 rounded-lg">
            <Icon size={18} className="text-green-400" />
        </div>
        <Text variant="span" className="text-sm text-gray-200">{text}</Text>
    </div>
);

// Plan Details Component
const PlanDetails = ({ role, locale, t }: { role: string; locale: string; t: any }) => {
    let plan = role === 'free' ? t('freePlan') : t('proPlan');
    !role && (plan = t('basicPlan'));

    const features = role === 'free' ? [
        { icon: Clock, text: t('freePlanFeature1') },
        { icon: Star, text: t('freePlanFeature2') },
        { icon: Zap, text: t('freePlanFeature3') }
    ] : [
        { icon: Crown, text: t('proPlanFeature1') },
        { icon: Star, text: t('proPlanFeature2') },
        { icon: Zap, text: t('proPlanFeature3') }
    ];

    return (
        <div className='space-y-4 w-full'>
            <div className='bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-3 rounded-lg border border-gray-600 flex items-center justify-between flex-col md:flex-row text-xs md:text-sm'>
                <div className="flex items-center gap-3">
                    {role === 'free' ? 
                        <Star className="text-yellow-400" size={24} /> : 
                        <Crown className="text-purple-400" size={24} />
                    }
                    <div>
                        <Text variant="h4" locale={locale} className="text-lg font-medium">{plan}</Text>
                        <Text variant="span" locale={locale} className="text-sm text-gray-400">
                            {role === 'free' ? t('freePlanFeature1') : t('proPlanFeature1')}
                        </Text>
                    </div>
                </div>
                <Link
                    href="/pricing"
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 
                    hover:to-emerald-700 rounded-lg text-white text-sm font-medium transition-all 
                    hover:shadow-lg hover:shadow-green-500/20"
                >
                    <Text variant="span" locale={locale}>{t('upgradePlan')}</Text>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {features.map((feature, index) => (
                    <PlanFeatureItem key={index} {...feature} />
                ))}
            </div>
        </div>
    );
};

const PlanInfo = ({ user }: { user: User }) => {
    const t = useTranslations('addFaq');
    const locale = useLocale();
    const remainingQuestions = (user.initailBalance - user.usedBalance);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="rounded-xl shadow-xl w-full bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
            <div 
                className="p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className='flex justify-between items-center gap-4 flex-col md:flex-row'>
                    <UserProfile name={user.name} image={user.image} />
                    <div className="flex items-center gap-3">
                        <MiniBalance remainingQuestions={remainingQuestions} locale={locale} t={t} />
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="text-gray-400" />
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 space-y-6">
                            <QuestionsBalance 
                                remainingQuestions={remainingQuestions} 
                                initailBalance={user.initailBalance}
                                locale={locale} 
                                t={t} 
                            />
                            <PlanDetails role={user.role} locale={locale} t={t} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlanInfo;