"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";

export async function getAdminStats() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const [totalOrders, totalRevenue, totalUsers, activeExperts] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { amount: true },
        where: { status: { notIn: [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED] } }
      }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: { in: ["WRITER", "DEVELOPER"] } } })
    ]);

    return {
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalUsers,
        activeExperts
      }
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { error: "Failed to fetch stats" };
  }
}

export async function getAllOrders() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, maskedId: true } },
        assignedTo: { select: { name: true, maskedId: true } }
      }
    });

    return { orders };
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return { error: "Failed to fetch orders" };
  }
}

export async function forceUpdateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" };

    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        note: `Force updated by Admin: ${session.user.name}`,
        changedBy: session.user.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }
}
