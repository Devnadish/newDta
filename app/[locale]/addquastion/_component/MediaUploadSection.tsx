'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import ImageDropzone from '@/components/ImageDropzone';
import LoaderComponent from '@/components/Loader';
import { useLocale, useTranslations } from 'next-intl';
import Text from '@/components/Text';
import { Image as ImageIcon, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const AudioRecorder = dynamic(
    () => import('@/components/MicRecored'),
    { 
        ssr: false,
        loading: () => <LoaderComponent />
    }
);

interface MediaUploadSectionProps {
    images: File[];
    setImages: React.Dispatch<React.SetStateAction<File[]>>;
    planLimits: {
        images: number;
        voiceMinutes: number;
    };
    onVoiceUpload: (blob: Blob) => void;
    onRecordingStateChange: (isRecording: boolean) => void;
}

const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
    images,
    setImages,
    planLimits,
    onVoiceUpload,
    onRecordingStateChange
}) => {
    const locale = useLocale();
    const t = useTranslations("addFaq");
    
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };
    
    return (
        <motion.div 
            className="space-y-6 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                            <ImageIcon className="w-4 h-4 text-blue-500" />
                        </div>
                        <Text 
                            locale={locale} 
                            variant="h4" 
                            className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100"
                        >
                            {t('attachImages')}
                        </Text>
                    </div>
                    <Text 
                        className="text-xs sm:text-sm text-gray-500 dark:text-gray-400" 
                        locale={locale} 
                        variant="span"
                    >
                        <span className="font-medium">{images.length}</span>/{planLimits.images} {t('imagesallowed')}
                    </Text>
                </div>
                <ImageDropzone 
                    images={images} 
                    setImages={setImages}
                    maxFiles={planLimits.images}
                />
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10">
                            <Mic className="w-4 h-4 text-purple-500" />
                        </div>
                        <Text 
                            locale={locale} 
                            variant="h4" 
                            className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100"
                        >
                            {t('attachVoice')}
                        </Text>
                    </div>
                    <Text 
                        className="text-xs sm:text-sm text-gray-500 dark:text-gray-400" 
                        locale={locale} 
                        variant="span"
                    >
                        {t('voicelength')} <span className="font-medium">{planLimits.voiceMinutes}</span> {t('minutes')}
                    </Text>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <AudioRecorder 
                        maxRecordingTime={planLimits.voiceMinutes * 60}
                        onRecordingComplete={onVoiceUpload}
                        onRecordingStateChange={onRecordingStateChange}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MediaUploadSection;