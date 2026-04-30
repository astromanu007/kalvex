"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createPatentDraftRequest({
  productTitle,
  views
}: {
  productTitle: string;
  views: any;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId } = session.user;

    const draft = await prisma.patentDraft.create({
      data: {
        userId,
        productTitle,
        views,
        paymentStatus: "UNPAID",
        paymentAmount: 300,
        // Mock data from "AI" processing:
        locarnoClass: "Class 14",
        locarnoSubclass: "14-02",
        locarnoExplanation: "Data processing equipment and peripheral apparatus and devices.",
        aiTitleOptions: [
          "Data Processing Apparatus",
          "Computing Device Enclosure",
          "Electronic Processing Unit"
        ]
      }
    });

    return { success: true, draftId: draft.id, draft };
  } catch (error) {
    console.error("Error creating patent draft:", error);
    return { error: "Failed to create draft" };
  }
}
