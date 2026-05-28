"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";

export async function generatePatentDraft({
  productTitle,
  description,
  locarnoClass
}: {
  productTitle: string;
  description: string;
  locarnoClass?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    // 1. Call OpenRouter for AI Drafting
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    let aiResponse;

    if (openRouterKey && openRouterKey !== "your_openrouter_api_key_here") {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://kalvex.com",
          "X-Title": "KALVEX"
        },
        body: JSON.stringify({
          model: "google/gemini-pro-1.5",
          messages: [
            {
              role: "system",
              content: "You are a Patent Attorney specializing in Design Patents. Analyze the product and provide 4 novelty points and a formal Claim text."
            },
            {
              role: "user",
              content: `Product: ${productTitle}\nDescription: ${description}\nLocarno Class: ${locarnoClass || "Auto"}`
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      aiResponse = {
        noveltyPoints: content.noveltyPoints || [],
        claimText: content.claimText || ""
      };
    } else {
      // Fallback to simulated if no key
      aiResponse = {
        noveltyPoints: [
          `Unique ergonomic profile optimized for ${productTitle}`,
          "Novel surface texture pattern reducing aerodynamic drag",
          "Integrated modular component architecture",
          "Distinctive silhouette as described"
        ],
        claimText: `The ornamental design for a ${productTitle}, as shown and described.`
      };
    }

    const draft = await prisma.patentDraft.create({
      data: {
        userId: session.user.id,
        productTitle,
        disclosureText: description,
        locarnoClass: locarnoClass || "Class 15",
        views: {}, 
        authors: [],
        aiTitleOptions: [
          `${productTitle} Apparatus`,
          `Ornamental ${productTitle} Case`,
          `Integrated ${productTitle} Housing`
        ],
        paymentStatus: "UNPAID",
        paymentAmount: 300
      }
    });

    return { 
      success: true, 
      draftId: draft.id,
      noveltyPoints: aiResponse.noveltyPoints,
      claimText: aiResponse.claimText,
      suggestedClass: locarnoClass || "Class 15"
    };
  } catch (error) {
    console.error("AI Drafting Error:", error);
    return { error: "Failed to generate AI draft" };
  }
}

export async function createPatentDraft({
  productTitle,
  locarnoClass,
  locarnoSubclass,
  views,
  authors,
  paymentAmount
}: {
  productTitle: string;
  locarnoClass: string;
  locarnoSubclass: string;
  views: any;
  authors: any;
  paymentAmount: number;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const draft = await prisma.patentDraft.create({
      data: {
        userId: session.user.id,
        productTitle,
        locarnoClass,
        locarnoSubclass,
        views: views || {},
        authors: authors || [],
        paymentStatus: "UNPAID",
        paymentAmount
      }
    });

    return { success: true, draftId: draft.id };
  } catch (error) {
    console.error("Error creating patent draft:", error);
    return { error: "Failed to create patent draft" };
  }
}

export async function createPatentPaymentOrder(amount: number, draftId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `patent_receipt_${draftId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return { 
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      success: true 
    };
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return { error: "Failed to create payment order" };
  }
}

import crypto from "crypto";

export async function verifyPatentPayment(paymentData: any, draftId: string, amount: number) {
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
      console.error("Razorpay patent payment verification failed: signature mismatch.");
      return { error: "Security validation failed. Signature mismatch." };
    }

    await prisma.patentDraft.update({
      where: { id: draftId },
      data: {
        paymentStatus: "PAID",
        paymentAmount: amount
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return { error: "Failed to verify payment" };
  }
}


