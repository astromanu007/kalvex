import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Upsert to handle existing subscriptions that might want to reactivate
    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription successful',
      data: subscription 
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ 
      error: 'Failed to process subscription. Please try again later.' 
    }, { status: 500 });
  }
}
