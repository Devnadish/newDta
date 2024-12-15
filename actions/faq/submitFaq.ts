'use server';

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadToS3 } from "@/lib/s3";

interface SubmitFaqParams {
    question: string;
    priority: number;
    images: File[];
    voiceRecording?: File;
    userPlan: string;
    userEmail: string;
}

const PLAN_LIMITS = {
    basic: { images: 1, voiceMinutes: 1 },
    premium: { images: 5, voiceMinutes: 5 },
    enterprise: { images: 10, voiceMinutes: 10 }
} as const;

const FILE_LIMITS = {
    image: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/']
    },
    audio: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['audio/']
    }
};

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

const validateQuestion = (question: string): void => {
    if (!question || question.length < 10) {
        throw new ValidationError("Question must be at least 10 characters long");
    }
    if (question.length > 500) {
        throw new ValidationError("Question cannot exceed 500 characters");
    }
    if (/^[^a-zA-Z0-9]+$/.test(question)) {
        throw new ValidationError("Question cannot contain only special characters");
    }
};

const validatePriority = (priority: number): void => {
    if (priority < 1 || priority > 5) {
        throw new ValidationError("Priority must be between 1 and 5");
    }
};

const validatePlanLimits = (params: SubmitFaqParams): void => {
    const limit = PLAN_LIMITS[params.userPlan as keyof typeof PLAN_LIMITS];
    if (!limit) {
        throw new ValidationError("Invalid user plan");
    }
    if (params.images.length > limit.images) {
        throw new ValidationError(`Your plan allows maximum of ${limit.images} images`);
    }
};

const validateFile = async (file: File, type: 'image' | 'audio'): Promise<void> => {
    const limits = FILE_LIMITS[type];
    const isValidType = limits.allowedTypes.some(allowedType => file.type.startsWith(allowedType));
    
    if (!isValidType) {
        throw new ValidationError(`Invalid ${type} file type`);
    }
    if (file.size > limits.maxSize) {
        throw new ValidationError(`${type} file size exceeds ${limits.maxSize / (1024 * 1024)}MB limit`);
    }
};

const createSlug = (question: string): string => {
    return question
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};

const checkDuplicateQuestion = async (slug: string): Promise<void> => {
    const existingFaq = await db.faq.findFirst({ where: { slug } });
    if (existingFaq) {
        throw new ValidationError("A similar question already exists");
    }
};

const createFaqEntry = async (params: SubmitFaqParams, slug: string) => {
    return await db.faq.create({
        data: {
            question: params.question,
            slug,
            priority: params.priority,
            userPlan: params.userPlan,
            userEmail: params.userEmail,
            published: true,
            rejected: false,
            gotAnswer: false,
            viewerCount: 0,
            loveCount: 0,
            dislovCount: 0,
            rejectedReason: "",
        },
    });
};

const handleFileUploads = async (
    faqId: string,
    params: SubmitFaqParams
): Promise<string[]> => {
    const urls: string[] = [];
    
    // Upload images
    if (params.images.length > 0) {
        for (const image of params.images) {
            await validateFile(image, 'image');
            const imageUrl = await uploadToS3(image, "images", "khalidnadish");
            await db.faqImage.create({
                data: { url: imageUrl, faqId }
            });
            urls.push(imageUrl);
        }
    }

    // Upload voice recording
    if (params.voiceRecording) {
        await validateFile(params.voiceRecording, 'audio');
        const voiceUrl = await uploadToS3(params.voiceRecording, "audio","khalidnadish");
        await db.faqVoiceRecording.create({
            data: { url: voiceUrl, faqId }
        });
        urls.push(voiceUrl);
    }

    return urls;
};

export async function submitFaq(params: SubmitFaqParams) {
    try {
        // Initial validation
        validateQuestion(params.question);
        validatePriority(params.priority);
        validatePlanLimits(params);

        // Create slug and check for duplicates
        const slug = createSlug(params.question);
        await checkDuplicateQuestion(slug);

        // Create FAQ entry
        const faq = await createFaqEntry(params, slug);

        // Handle file uploads
        const urls = await handleFileUploads(faq.id, params);

        revalidatePath("/");
        return { success: true, faqId: faq.id, urls };
    } catch (error) {
        if (error instanceof ValidationError) {
            throw new Error(error.message);
        }
        throw new Error("Error submitting FAQ");
    }
}