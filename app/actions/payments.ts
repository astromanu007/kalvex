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

import crypto from "crypto";

export async function verifyPayment(paymentData: any, orderId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is missing from environment variables!");
      return { error: "Payment verification configuration error" };
    }

    // Cryptographically verify Razorpay signature
    const payload = paymentData.razorpay_order_id + "|" + paymentData.razorpay_payment_id;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (generatedSignature !== paymentData.razorpay_signature) {
      console.error("Razorpay payment verification failed: signature mismatch.");
      return { error: "Security validation failed. Signature mismatch." };
    }

    // Order status transitions to PAYMENT_CONFIRMED first, then to RESEARCH_STARTED for expert queue
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "RESEARCH_STARTED" }
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: "RESEARCH_STARTED",
        note: `Payment successfully verified via Razorpay. Ref: ${paymentData.razorpay_payment_id}`,
        changedBy: session.user.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return { error: "Failed to verify payment" };
  }
}
