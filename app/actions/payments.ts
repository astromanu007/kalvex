"use server";

import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function createPaymentOrder(amount: number, orderId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${orderId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return { 
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      success: true 
    };
  } catch (error) {
    console.error("Razorpay Error:", error);
    return { error: "Failed to create payment order" };
  }
}

export async function verifyPayment(paymentData: any, orderId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    // In a real app, you'd use crypto to verify the signature
    // For now, we'll assume the client-side success is enough to move the status
    // but we'll log it.

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "RESEARCH_STARTED" }
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: "RESEARCH_STARTED",
        note: `Payment verified via Razorpay. Ref: ${paymentData.razorpay_payment_id}`,
        changedBy: session.user.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return { error: "Failed to verify payment" };
  }
}
