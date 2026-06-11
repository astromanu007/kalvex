"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(data: {
  name?: string;
  phone?: string;
  city?: string;
  college?: string;
  branch?: string;
  year?: number;
  skills?: string[];
  githubUrl?: string;
  portfolioUrl?: string;
  website?: string;
  experienceYears?: number;
  linkedinUrl?: string;
  specializations?: string[];
  domainExpertise?: string[];
  sampleWorkUrl?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId } = session.user;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city,
        college: data.college,
        branch: data.branch,
        year: data.year ? parseInt(data.year.toString()) : undefined,
        skills: data.skills,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        website: data.website,
        experienceYears: data.experienceYears ? parseInt(data.experienceYears.toString()) : undefined,
        linkedinUrl: data.linkedinUrl,
        specializations: data.specializations,
        domainExpertise: data.domainExpertise,
        sampleWorkUrl: data.sampleWorkUrl,
      }
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(data: {
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId } = session.user;

    if (!data.currentPassword || !data.newPassword) {
      return { error: "Missing required password fields." };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.password) {
      return { error: "User not found or password not initialized." };
    }

    const passwordsMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!passwordsMatch) {
      return { error: "Incorrect current password." };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error changing password:", error);
    return { error: error.message || "Failed to update password." };
  }
}

export async function getProfileDetails() {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };
    const { id: userId } = session.user;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return { error: "User not found" };

    return {
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        city: user.city || "",
        college: user.college || "",
        branch: user.branch || "",
        year: user.year || "",
        skills: user.skills || [],
        githubUrl: user.githubUrl || "",
        portfolioUrl: user.portfolioUrl || "",
        website: user.website || "",
        experienceYears: user.experienceYears || "",
        linkedinUrl: user.linkedinUrl || "",
        specializations: user.specializations || [],
        domainExpertise: user.domainExpertise || [],
        sampleWorkUrl: user.sampleWorkUrl || "",
      }
    };
  } catch (error: any) {
    console.error("Error in getProfileDetails:", error);
    return { error: error.message || "Failed to fetch profile details" };
  }
}

export async function getWalletDetails() {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };
    const { id: userId, role } = session.user;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) return { error: "User not found" };

    const isExpert = role === "WRITER" || role === "DEVELOPER";

    if (isExpert) {
      // Find all completed orders
      const completedOrders = await prisma.order.findMany({
        where: {
          assignedToId: userId,
          status: { in: ["COMPLETED", "DELIVERED", "FINAL_APPROVED"] }
        }
      });

      // Find active escrow orders
      const escrowOrders = await prisma.order.findMany({
        where: {
          assignedToId: userId,
          status: {
            in: [
              "PAYMENT_CONFIRMED",
              "TOPIC_CONFIRMED",
              "RESEARCH_STARTED",
              "DRAFT_IN_PROGRESS",
              "DRAFT_SUBMITTED",
              "UNDER_REVIEW",
              "REVISION_REQUESTED",
              "REVISION_SUBMITTED"
            ]
          }
        }
      });

      // Fetch all withdrawals requested by this user
      const withdrawalLogs = await prisma.auditLog.findMany({
        where: {
          userId,
          action: "WITHDRAWAL_REQUEST"
        },
        orderBy: { createdAt: "desc" }
      });

      // Calculate totals
      const initialEarnings = completedOrders.reduce((sum, o) => sum + (o.amount * 0.85), 0);
      const totalWithdrawn = withdrawalLogs.reduce((sum, log) => {
        const amt = (log.metadata as any)?.amount ?? 0;
        return sum + amt;
      }, 0);

      const cleared = Math.max(0, initialEarnings - totalWithdrawn);
      const escrow = escrowOrders.reduce((sum, o) => sum + (o.amount * 0.85), 0);

      // Map transactions from completed orders
      const transactions = completedOrders.map(o => ({
        id: `TXN-${o.orderNumber}`,
        title: `Project Payout (${o.orderNumber})`,
        type: "credit",
        amount: Math.floor(o.amount * 0.85),
        date: o.deliveredAt ? o.deliveredAt.toISOString().split("T")[0] : o.updatedAt.toISOString().split("T")[0],
        status: "Completed"
      }));

      // Map active tasks to show in ledger
      const pendingTrans = escrowOrders.map(o => ({
        id: `TXN-${o.orderNumber}`,
        title: `Pending Milestone (${o.orderNumber})`,
        type: "credit",
        amount: Math.floor(o.amount * 0.85),
        date: o.createdAt.toISOString().split("T")[0],
        status: "In Progress"
      }));

      // Map withdrawal requested transactions
      const withdrawalTrans = withdrawalLogs.map(log => {
        const metadata = log.metadata as any;
        return {
          id: `TXN-${log.id.substring(log.id.length - 8).toUpperCase()}`,
          title: `Withdrawal Settlement to ${(metadata?.payoutMethod || 'UPI').toUpperCase()}`,
          type: "debit",
          amount: metadata?.amount ?? 0,
          date: log.createdAt.toISOString().split("T")[0],
          status: metadata?.status || "Processing"
        };
      });

      // Combine and sort all transactions by date descending
      const allTransactions = [...transactions, ...pendingTrans, ...withdrawalTrans].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      // Calculate dynamic weekly earnings timeline graph data
      const now = new Date();
      const msPerDay = 24 * 60 * 60 * 1000;
      const w4Start = new Date(now.getTime() - 7 * msPerDay);
      const w3Start = new Date(now.getTime() - 14 * msPerDay);
      const w2Start = new Date(now.getTime() - 21 * msPerDay);
      const w1Start = new Date(now.getTime() - 28 * msPerDay);

      let w1Sum = 0, w2Sum = 0, w3Sum = 0, w4Sum = 0;
      completedOrders.forEach(o => {
        const date = o.deliveredAt || o.updatedAt;
        if (date >= w4Start) {
          w4Sum += o.amount * 0.85;
        } else if (date >= w3Start) {
          w3Sum += o.amount * 0.85;
        } else if (date >= w2Start) {
          w2Sum += o.amount * 0.85;
        } else if (date >= w1Start) {
          w1Sum += o.amount * 0.85;
        }
      });

      const chartData = [
        { label: "Week 1", amount: Math.floor(w1Sum) },
        { label: "Week 2", amount: Math.floor(w2Sum) },
        { label: "Week 3", amount: Math.floor(w3Sum) },
        { label: "Week 4", amount: Math.floor(w4Sum) },
      ];

      // Get real referral count from User table
      const referralsCount = await prisma.user.count({
        where: { referredBy: user.referralCode }
      });

      return {
        success: true,
        clearedBalance: Math.floor(cleared),
        escrowBalance: Math.floor(escrow),
        transactions: allTransactions,
        chartData,
        referralsCount
      };
    } else {
      // Client Wallet
      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });

      const transactions = orders.map(o => ({
        id: `TXN-${o.orderNumber}`,
        title: `Order Payment (${o.orderNumber})`,
        type: "debit",
        amount: o.amount,
        date: o.createdAt.toISOString().split("T")[0],
        status: o.status === "PENDING_PAYMENT" ? "Unpaid" : "Completed"
      }));

      // Get real referral count from User table
      const referralsCount = await prisma.user.count({
        where: { referredBy: user.referralCode }
      });

      return {
        success: true,
        clearedBalance: user.credits,
        escrowBalance: 0,
        transactions,
        chartData: [],
        referralsCount
      };
    }
  } catch (error: any) {
    console.error("Error in getWalletDetails:", error);
    return { error: error.message || "Failed to fetch wallet details" };
  }
}

export async function getReviewsDetails() {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };
    const { id: userId, role } = session.user;

    const isExpert = role === "WRITER" || role === "DEVELOPER";

    if (isExpert) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { applicationStatus: true }
      });

      // Fetch reviews received by expert
      const dbReviews = await prisma.review.findMany({
        where: {
          order: {
            assignedToId: userId
          }
        },
        include: {
          order: true,
          user: {
            select: {
              name: true,
              maskedId: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      const reviews = dbReviews.map(r => ({
        id: r.id,
        client: r.user.name ? `Client ${r.user.maskedId}` : `Client`,
        service: r.order?.serviceType ? r.order.serviceType.replace(/_/g, " ") : "Academic Consultation",
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt.toISOString().split("T")[0],
        verified: r.verified
      }));

      // Calculate rating count and breakdown
      const totalCount = reviews.length;
      const avg = totalCount > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1) : "5.0";

      const distribution = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => r.rating === stars).length;
        const percentage = totalCount > 0 ? Math.floor((count / totalCount) * 100) : 0;
        return { stars, count, percentage };
      });

      return {
        success: true,
        reviews,
        averageRating: avg,
        totalCount,
        distribution,
        applicationStatus: user?.applicationStatus
      };
    } else {
      // Client/Student: reviews written
      const dbReviews = await prisma.review.findMany({
        where: { userId },
        include: {
          order: true
        },
        orderBy: { createdAt: "desc" }
      });

      const reviews = dbReviews.map(r => ({
        id: r.id,
        service: r.order?.serviceType ? r.order.serviceType.replace(/_/g, " ") : "Consultation",
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt.toISOString().split("T")[0],
        verified: r.verified
      }));

      const totalCount = reviews.length;
      const avg = totalCount > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1) : "5.0";

      return {
        success: true,
        reviews,
        averageRating: avg,
        totalCount,
        distribution: [5, 4, 3, 2, 1].map(stars => ({ stars, count: 0, percentage: 0 })),
        applicationStatus: null
      };
    }
  } catch (error: any) {
    console.error("Error in getReviewsDetails:", error);
    return { error: error.message || "Failed to fetch reviews" };
  }
}

export async function requestWithdrawal(data: {
  amount: number;
  payoutMethod: "upi" | "bank";
  payoutDetails: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };
    const { id: userId, role } = session.user;

    const isExpert = role === "WRITER" || role === "DEVELOPER";
    if (!isExpert) return { error: "Only experts can request withdrawals." };

    if (!data.amount || data.amount <= 0) {
      return { error: "Invalid withdrawal amount." };
    }

    // Calculate current cleared balance
    const walletRes = await getWalletDetails();
    if (!walletRes.success || walletRes.clearedBalance === undefined) {
      return { error: "Failed to calculate current wallet balance." };
    }

    if (data.amount > walletRes.clearedBalance) {
      return { error: "Insufficient cleared balance." };
    }

    // Log the withdrawal request in AuditLog
    await prisma.auditLog.create({
      data: {
        userId,
        role: role as any,
        action: "WITHDRAWAL_REQUEST",
        metadata: {
          amount: data.amount,
          payoutMethod: data.payoutMethod,
          payoutDetails: data.payoutDetails,
          status: "Processing"
        }
      }
    });

    revalidatePath("/dashboard/wallet");
    return { success: true };
  } catch (error: any) {
    console.error("Error requesting withdrawal:", error);
    return { error: error.message || "Failed to process withdrawal request." };
  }
}
