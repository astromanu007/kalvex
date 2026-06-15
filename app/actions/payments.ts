"use server";

import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function createPaymentOrder(amount: number, orderId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) return { error: "Order not found" };
    if (order.userId !== session.user.id) return { error: "Unauthorized access to this order" };

    const secureAmount = order.amount;

    const options = {
      amount: Math.round(secureAmount * 100), // Razorpay expects amount in paise
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

    // Check if this is a hardware/electronics order (no expert needed)
    const orderRecord = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true, serviceType: true }
    });

    if (!orderRecord) return { error: "Order not found" };
    if (orderRecord.userId !== session.user.id) return { error: "Unauthorized access to this order" };

    const isHardwareOrder = orderRecord.serviceType === "HARDWARE_COMPONENTS";

    // Hardware/electronics orders → PAYMENT_CONFIRMED (admin handles shipping)
    // All other orders → RESEARCH_STARTED (routes to expert assignment queue)
    const newStatus = isHardwareOrder ? "PAYMENT_CONFIRMED" : "RESEARCH_STARTED";
    const statusNote = isHardwareOrder
      ? `Payment verified. Order confirmed for processing & dispatch. Ref: ${paymentData.razorpay_payment_id}`
      : `Payment successfully verified via Razorpay. Ref: ${paymentData.razorpay_payment_id}`;

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: newStatus,
        note: statusNote,
        changedBy: session.user.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return { error: "Failed to verify payment" };
  }
}
