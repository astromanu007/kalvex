import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, inquiryType, message } = body;
    
    // Basic validation
    if (!fullName || !email || !message) {
      return NextResponse.json({ 
        error: 'Please provide name, email, and message.' 
      }, { status: 400 });
    }

    // Create the submission record in the database
    const submission = await prisma.contactSubmission.create({
      data: {
        fullName,
        email,
        inquiryType: inquiryType || 'General Inquiry',
        message,
        status: 'UNREAD'
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been sent successfully.',
      data: { id: submission.id }
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ 
      error: 'Failed to send message. Please try again later.' 
    }, { status: 500 });
  }
}
