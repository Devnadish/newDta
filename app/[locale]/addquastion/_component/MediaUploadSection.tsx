'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import ImageDropzone from '@/components/ImageDropzone';
import LoaderComponent from '@/components/Loader';
import { useLocale, useTranslations } from 'next-intl';
import Text from '@/components/Text';

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
    
    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <Text locale={locale} variant="h4" className="block text-sm font-medium">
                        {t('attachImages')}
                    </Text>
                    <Text className="text-sm text-gray-500" locale={locale} variant="span">
                        ({images.length}/{planLimits.images}    {t('imagesallowed')})
                    </Text>
                </div>
                <ImageDropzone 
                    images={images} 
                    setImages={setImages}
                    maxFiles={planLimits.images}
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <Text locale={locale} variant="h4" className="block text-sm font-medium">
                        {t('attachVoice')}
                    </Text>
                    <Text className="text-sm text-gray-500" locale={locale} variant="span">
                        ( {t('voicelength')} {planLimits.voiceMinutes} {t('minutes')}  )
                    </Text>
                </div>
                <AudioRecorder 
                    maxRecordingTime={planLimits.voiceMinutes * 60}
                    onRecordingComplete={onVoiceUpload}
                    onRecordingStateChange={onRecordingStateChange}
                />
            </div>
        </div>
    );
};

export default MediaUploadSection;