"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

// ─── Auth guard ──────────────────────────────────────────────────
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin only");
  }
  return session;
}

// ─── Bootstrap ───────────────────────────────────────────────────
export async function createAdminAccount() {
  try {
    const email = "manishdhatrak1121@gmail.com";
    const password = "Manish@1717";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword, role: "ADMIN", name: "Manish Dhatrak" },
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
    return { success: false, message: error.message };
  }
}

// ─── Stats ───────────────────────────────────────────────────────
export async function getAdminStats() {
  try {
    await requireAdmin();
    const [totalUsers, totalOrders, totalRevenue, experts, clients, recentOrders] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { amount: true } }),
      prisma.user.count({ where: { role: { in: ["WRITER", "DEVELOPER"] } } }),
      prisma.user.count({ where: { role: { in: ["USER", "STUDENT"] } } }),
      prisma.order.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
      })
    ]);

    return {
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeExperts: experts,
        totalClients: clients,
        recentOrders
      }
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ─── Orders ──────────────────────────────────────────────────────
export async function getAllOrders() {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, maskedId: true, role: true } },
        assignedTo: { select: { name: true, email: true, maskedId: true } },
        statusHistory: { orderBy: { createdAt: "desc" }, take: 3 }
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, orders };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function forceUpdateOrderStatus(orderId: string, status: any, note?: string) {
  try {
    await requireAdmin();
    const session = await auth();
    await prisma.order.update({ where: { id: orderId }, data: { status } });
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        note: note || `Status updated to ${status} by Admin`,
        changedBy: session!.user.id
      }
    });
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function assignOrderToExpert(orderId: string, expertId: string | null) {
  try {
    await requireAdmin();
    const session = await auth();

    const expert = expertId ? await prisma.user.findUnique({ where: { id: expertId } }) : null;

    await prisma.order.update({
      where: { id: orderId },
      data: {
        assignedToId: expertId,
        maskedAssigneeId: expert?.maskedId || null,
      }
    });

    if (expertId) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: "RESEARCH_STARTED",
          note: `Assigned to expert: ${expert?.name || expertId}`,
          changedBy: session!.user.id
        }
      });
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function setOrderDeadline(orderId: string, deadline: string) {
  try {
    await requireAdmin();
    await prisma.order.update({
      where: { id: orderId },
      data: { deadline: new Date(deadline) }
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await requireAdmin();
    // Delete related records first
    await prisma.orderStatusHistory.deleteMany({ where: { orderId } });
    await prisma.orderFile.deleteMany({ where: { orderId } });
    await prisma.order.delete({ where: { id: orderId } });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ─── Users ───────────────────────────────────────────────────────
export async function getUsers() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        maskedId: true,
        createdAt: true,
        _count: { select: { orders: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, users };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getExperts() {
  try {
    await requireAdmin();
    const experts = await prisma.user.findMany({
      where: { role: { in: ["WRITER", "DEVELOPER"] } },
      select: {
        id: true,
        name: true,
        email: true,
        maskedId: true,
        role: true,
        _count: { select: { assignedOrders: true } }
      }
    });
    return { success: true, experts };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateUserRole(userId: string, role: any) {
  try {
    await requireAdmin();
    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    await requireAdmin();
    // Soft delete — just demote or remove from system
    // First check it's not the current admin
    const session = await auth();
    if (session!.user.id === userId) {
      return { success: false, message: "Cannot delete your own account." };
    }
    // Delete related records
    await prisma.orderStatusHistory.deleteMany({
      where: { order: { userId } }
    });
    await prisma.orderFile.deleteMany({ where: { order: { userId } } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ─── Submissions ─────────────────────────────────────────────────
export async function getSubmissions() {
  try {
    await requireAdmin();
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, submissions };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getNewsletterSubscribers() {
  try {
    await requireAdmin();
    const subscribers = await prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, subscribers };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateSubmissionStatus(id: string, status: string) {
  try {
    await requireAdmin();
    await prisma.contactSubmission.update({ where: { id }, data: { status } });
    revalidatePath("/admin/submissions");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteSubmission(id: string) {
  try {
    await requireAdmin();
    await prisma.contactSubmission.delete({ where: { id } });
    revalidatePath("/admin/submissions");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
