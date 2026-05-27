"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createAdminAccount() {
  try {
    const email = "manishdhatrak1121@gmail.com";
    const password = "Manish@1717";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        name: "Manish Dhatrak"
      },
      create: {
        email,
        password: hashedPassword,
        role: "ADMIN",
        name: "Manish Dhatrak",
        maskedId: `ADM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        referralCode: `REF-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      }
    });

    return { success: true, message: `Admin account ${user.email} created/updated!` };
  } catch (error: any) {
    console.error("Admin creation error:", error);
    return { success: false, message: error.message };
  }
}

export async function getAdminStats() {
  try {
    const [totalUsers, totalOrders, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { amount: true }
      })
    ]);

    return {
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeExperts: 0 // Placeholder
      }
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            maskedId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, orders };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function forceUpdateOrderStatus(orderId: string, status: any) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getSubmissions() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, submissions };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getNewsletterSubscribers() {
  try {
    const subscribers = await prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, subscribers };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateSubmissionStatus(id: string, status: string) {
  try {
    await prisma.contactSubmission.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/submissions");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteSubmission(id: string) {
  try {
    await prisma.contactSubmission.delete({ where: { id } });
    revalidatePath("/admin/submissions");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        maskedId: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, users };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateUserRole(userId: string, role: any) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
