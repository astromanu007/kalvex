"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

