"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getAffiliateStats() {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id }
    });

    if (!affiliate) {
      // Initialize affiliate if not exists
      const newAffiliate = await prisma.affiliate.create({
        data: {
          userId: session.user.id,
          referralCode: session.user.maskedId, // Use masked ID as default referral code
        }
      });
      return { affiliate: newAffiliate };
    }

    return { affiliate };
  } catch (error) {
    console.error("Affiliate Stats Error:", error);
    return { error: "Failed to fetch affiliate stats" };
  }
}

export async function updateAffiliateUPI(upiId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    await prisma.affiliate.update({
      where: { userId: session.user.id },
      data: { upiId }
    });

    return { success: true };
  } catch (error) {
    console.error("Affiliate Update Error:", error);
    return { error: "Failed to update UPI ID" };
  }
}
