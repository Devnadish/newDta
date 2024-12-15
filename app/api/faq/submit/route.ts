// app/api/faq/submit/route.ts
import { NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp';
import  db  from '@/lib/prisma';

// Define the expected request body type
interface SubmitFaqRequest {
    question: string;
    companyId: string;
}

export async function POST(request: Request) {
    try {
        // Parse the request body
        const body: SubmitFaqRequest = await request.json();
        const { question, companyId } = body;

        // Validate required fields
        if (!question || !companyId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get company info including WhatsApp number
        const company = await db.company.findUnique({
            where: { id: companyId },
            select: {
                id: true,
                whatsappNumber: true
            }
        });

        if (!company) {
            return NextResponse.json(
                { error: 'Company not found' },
                { status: 404 }
            );
        }

        // Create the question
        const newQuestion = await prisma.question.create({
            data: {
                text: question,
                companyId: companyId,
                status: 'PENDING',
                createdAt: new Date()
            }
        });

        // Generate question link
        const questionLink = `${process.env.NEXT_PUBLIC_APP_URL}/company/${companyId}/question/${newQuestion.id}`;

        // Send WhatsApp notification if company has WhatsApp number
        if (company.whatsappNumber) {
            await WhatsAppService.notifyCompany({
                companyId: company.id,
                companyWhatsApp: company.whatsappNumber,
                questionId: newQuestion.id,
                questionText: question,
                questionLink: questionLink
            });
        }

        // Return success response with question details
        return NextResponse.json({
            success: true,
            data: {
                questionId: newQuestion.id,
                status: 'PENDING',
                createdAt: newQuestion.createdAt
            }
        });

    } catch (error) {
        console.error('Error submitting FAQ:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Optional: Add GET method to fetch questions for a company
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');

        if (!companyId) {
            return NextResponse.json(
                { error: 'Company ID is required' },
                { status: 400 }
            );
        }

        const questions = await prisma.question.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                text: true,
                status: true,
                createdAt: true
            }
        });

        return NextResponse.json({ success: true, data: questions });

    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


// Example API call from mobile app
// const response = await fetch('https://your-domain.com/api/faq/submit', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         question: "How do I reset my password?",
//         companyId: "company_123"
//     })
// });

// const data = await response.json();

// Example API call from mobile app
// const response = await fetch('https://your-domain.com/api/faq/submit?companyId=company_123');
// const data = await response.json();