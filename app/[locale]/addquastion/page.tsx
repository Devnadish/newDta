'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MediaUploadSection from './_component/MediaUploadSection';
import { submitFaq } from '@/actions/faq/submitFaq';
import { useToast } from '@/hooks/use-toast';
import QuestionInput from './_component/QuestionInput';
import PrioritySelector from './_component/PrioritySelector';
import PolicyHints from './_component/PolicyHints';
import LoadingAddFaq from './_component/LoaderFAQ';
import PriorityHints from './_component/PriorityHints';
import { useLocale, useTranslations } from 'next-intl';
import Text from '@/components/Text';
import PlanInfo from './_component/PlanInfo';
import { useSession } from 'next-auth/react';
import { GetUserByEmail } from '@/actions/user/user';
import MustLogin from '@/components/MustLogin';
import Hints from './_component/Hints';
import { motion, AnimatePresence } from 'framer-motion';
interface FaqFormData {
    question: string;
    priority: number;
    images: File[];
    voiceRecording?: File;
}
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

const AddQuestionPage = () => {
    const [formData, setFormData] = useState<FaqFormData>({
        question: "",
        priority: 5,
        images: [],
        voiceRecording: undefined
    });
    const [isMounted, setIsMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const userPlan = "basic"; // This should come from your user context/authentication
    const t = useTranslations("addFaq"); 
    const locale = useLocale();
    const session = useSession();

  

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            if (session.data?.user?.email) {
                const userData = await GetUserByEmail(session.data.user.email);
                if (userData) {
                    setUser({
                        id: userData.id,
                        name: userData.name || '',
                        email: userData.email || '',
                        image: userData.image || '',
                        role: userData.subscriptionType || 'basic',
                        balance: userData.usedBalance || 5,
                        initailBalance: userData.usedBalance || 5,
                        usedBalance: userData.usedBalance || 5
                    });
                }
            }
            setIsLoading(false);
        };
        
        loadUserData();
        setIsMounted(true);
    }, [session]);
    const getPlanLimits = () => {
        const plans = {
            basic: { images: 1, voiceMinutes: 1 },
            premium: { images: 5, voiceMinutes: 5 },
            enterprise: { images: 10, voiceMinutes: 10 }
        };
        return plans[userPlan as keyof typeof plans];
    };

    const handleSubmit = async () => {
        if (!formData.question.trim()) {
            toast({
                title: t("error"),
                description: t("enterValidQuestion"),
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(0);
        
        try {
            // Start progress animation
            const startTime = Date.now();
            const animateProgress = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(90, elapsed / 100); // Max 90% until complete
                setUploadProgress(progress);
                if (progress < 90) {
                    requestAnimationFrame(animateProgress);
                }
            };
            requestAnimationFrame(animateProgress);

            // Submit FAQ
            const result = await submitFaq({
                question: formData.question,
                priority: formData.priority,
                images: formData.images,
                voiceRecording: formData.voiceRecording,
                userPlan,
                userEmail: "userEmail"
            });

            // Complete progress
            setUploadProgress(100);
            
            toast({
                title: "Success",
                description: "Your question has been submitted successfully",
            });

            // Reset form
            setFormData({
                question: "",
                priority: 1,
                images: [],
                voiceRecording: undefined
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to submit question",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const handleVoiceUpload = (blob: Blob) => {
        const file = new File([blob], 'voice-recording.webm', { type: blob.type });
        setFormData(prev => ({
            ...prev,
            voiceRecording: file
        }));
    };

    if (!isMounted) return <LoadingAddFaq />;
    if (session.status === "loading") {
        return <p>calculating...</p>;
    }


    const planLimits = getPlanLimits();

    return (
        <div className='flex flex-col items-center justify-center gap-4 w-full p-6'>
            <div className='max-w-xl w-full flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                {user ?  <PlanInfo user={user} /> :<MustLogin />}
               
                <Text variant="h2" locale={locale} >{t("title")}</Text>
                
                <div className="w-full flex flex-col items-center justify-center gap-4">
                   
                    <Hints />

                    <QuestionInput 
                        question={formData.question}
                        setQuestion={(question) => setFormData(prev => ({ ...prev, question }))}
                        onError={(message) => toast({ title: t("error"), description: message, variant: "destructive" })}
                      
                    />

                    <PrioritySelector 
                        priority={formData.priority} 
                        setPriority={(priority) => setFormData(prev => ({ ...prev, priority }))}
                    />
                    
                    

                    <MediaUploadSection 
                        images={formData.images}
                        setImages={(imagesOrUpdater) => {
                            if (typeof imagesOrUpdater === 'function') {
                                setFormData(prev => ({
                                    ...prev,
                                    images: imagesOrUpdater(prev.images)
                                }));
                            } else {
                                setFormData(prev => ({
                                    ...prev,
                                    images: imagesOrUpdater
                                }));
                            }
                        }}
                        planLimits={planLimits}
                        onVoiceUpload={handleVoiceUpload}
                        onRecordingStateChange={setIsRecording}
                    />

<div className="w-full mt-6">
                        <motion.div 
                            initial={false}
                            animate={{ 
                                scale: isSubmitting || isRecording ? 0.98 : 1,
                                opacity: !user ? 0.7 : 1 
                            }}
                            className="w-full"
                        >
                            <Button 
                                onClick={handleSubmit}
                                disabled={isSubmitting || isRecording || !user}
                                className={`
                                    w-full relative overflow-hidden group
                                    min-h-[48px] px-6
                                    flex items-center justify-center gap-2
                                    rounded-xl font-medium
                                    transition-all duration-200
                                    ${isSubmitting || isRecording
                                        ? 'bg-indigo-400 dark:bg-indigo-600'
                                        : 'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400'
                                    }
                                    disabled:cursor-not-allowed
                                    text-white shadow-lg shadow-indigo-500/20
                                    dark:shadow-indigo-500/10
                                `}
                            >
                                <motion.div
                                    initial={false}
                                    animate={{ 
                                        scale: isSubmitting ? 0.9 : 1,
                                        rotate: isSubmitting ? 360 : 0 
                                    }}
                                    transition={{ 
                                        rotate: { 
                                            duration: 1, 
                                            repeat: Infinity, 
                                            ease: "linear" 
                                        }
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                            <Text variant="span" locale={locale} className="text-sm sm:text-base">
                                                {t("uploading")}
                                            </Text>
                                        </>
                                    ) : isRecording ? (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <Text variant="span" locale={locale} className="text-sm sm:text-base">
                                                {t("recordingOn")}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text variant="span" locale={locale} className="text-sm sm:text-base">
                                            {t("submit")}
                                        </Text>
                                    )}
                                </motion.div>

                                {/* Gradient overlay */}
                                <div className="
                                    absolute inset-0 opacity-0 group-hover:opacity-100
                                    bg-gradient-to-r from-indigo-400/0 via-white/10 to-indigo-400/0
                                    transition-opacity duration-700 ease-in-out
                                    transform translate-x-[-100%] group-hover:translate-x-[100%]
                                "/>
                            </Button>
                        </motion.div>

                        {/* Upload Progress */}
                        <AnimatePresence>
                            {isSubmitting && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-4 space-y-2"
                                >
                                    <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                                    </div>
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        <span>{t("uploading")}...</span>
                                        <span className="font-medium">{Math.round(uploadProgress)}%</span>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQuestionPage;