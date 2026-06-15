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

    // Secure Email regex validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Basic escaping to block XSS injections
    const escapeHTML = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const cleanName = escapeHTML(fullName);
    const cleanMessage = escapeHTML(message);
    const cleanInquiryType = escapeHTML(inquiryType || 'General Inquiry');

    // Create the submission record in the database
    const submission = await prisma.contactSubmission.create({
      data: {
        fullName: cleanName,
        email,
        inquiryType: cleanInquiryType,
        message: cleanMessage,
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
