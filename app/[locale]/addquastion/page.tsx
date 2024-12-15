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

interface FaqFormData {
    question: string;
    priority: number;
    images: File[];
    voiceRecording?: File;
}

const AddQuestionPage = () => {
    const [formData, setFormData] = useState<FaqFormData>({
        question: "",
        priority: 1,
        images: [],
        voiceRecording: undefined
    });
    const [isMounted, setIsMounted] = useState(false);
    const [showPolicyHint, setShowPolicyHint] = useState(false);
    const [showPriortyHint, setShowPriortyHint] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { toast } = useToast();
    const userPlan = "basic"; // This should come from your user context/authentication
    const t = useTranslations("addFaq"); 
    const locale = useLocale();

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    const planLimits = getPlanLimits();

    return (
        <div className='flex flex-col items-center justify-center gap-4 w-full p-6'>
            <div className='max-w-xl w-full flex flex-col items-center justify-center gap-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <Text variant="h2" locale={locale} >{t("title")}</Text>
                
                <div className="w-full">
                    <PolicyHints 
                        showPolicyHint={showPolicyHint} 
                        setShowPolicyHint={setShowPolicyHint} 
                    />

                    <QuestionInput 
                        question={formData.question}
                        setQuestion={(question) => setFormData(prev => ({ ...prev, question }))}
                        onError={(message) => toast({ title: t("error"), description: message, variant: "destructive" })}
                      
                    />

                    <PrioritySelector 
                        priority={formData.priority} 
                        setPriority={(priority) => setFormData(prev => ({ ...prev, priority }))}
                    />
                    
                    <PriorityHints
                        showPriortyHint={showPriortyHint} 
                        setShowPriortyHint={setShowPriortyHint} 
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

                    <div className="mt-6">
                        <Button 
                            onClick={handleSubmit}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            disabled={isSubmitting || isRecording}
                        >
                            <Text variant="span" locale={locale} >

                            {isSubmitting ? t("uploading") : isRecording ? t('recordingOn') : t('submit')}
                            </Text>
                        </Button>
                        {isSubmitting && (
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div 
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <div className="text-sm text-gray-500 text-center mt-1">
                                    {uploadProgress}% uploaded
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQuestionPage;