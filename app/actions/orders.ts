"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { OrderStatus, ServiceType } from "@prisma/client";

// Get all orders for the current user (if client) or assigned orders (if expert)
export async function getOrders() {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId, role } = session.user;

    if (role === "USER" || role === "STUDENT") {
      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          statusHistory: { orderBy: { createdAt: "desc" }, take: 1 },
          orderFiles: true
        }
      });
      return { orders };
    }

    if (role === "WRITER" || role === "DEVELOPER") {
      const orders = await prisma.order.findMany({
        where: { assignedToId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          statusHistory: { orderBy: { createdAt: "desc" }, take: 1 },
          orderFiles: true
        }
      });
      return { orders };
    }

    return { error: "Invalid role for fetching orders" };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { error: "Failed to fetch orders" };
  }
}

// Create a new order (e.g., from checkout or service quotation)
export async function createOrder({
  serviceType,
  requirements,
  amount,
  deadline
}: {
  serviceType: ServiceType;
  requirements: string;
  amount: number;
  deadline?: Date;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        maskedClientId: session.user.maskedId,
        serviceType,
        requirements,
        amount,
        deadline,
        status: OrderStatus.PENDING_PAYMENT,
      }
    });

    // Add initial status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: OrderStatus.PENDING_PAYMENT,
        note: "Order created, waiting for payment",
        changedBy: session.user.id
      }
    });

    revalidatePath("/dashboard/orders");
    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: "Failed to create order" };
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        note: note || `Status updated to ${status}`,
        changedBy: session.user.id
      }
    });

    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }
}

// Get available orders for experts to pick up
export async function getAvailableOrders() {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const orders = await prisma.order.findMany({
      where: {
        assignedToId: null,
        status: OrderStatus.RESEARCH_STARTED
      },
      orderBy: { createdAt: "desc" }
    });

    return { orders };
  } catch (error) {
    console.error("Error fetching available orders:", error);
    return { error: "Failed to fetch available orders" };
  }
}

// Accept an order (for experts)
export async function acceptOrder(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };
    if (session.user.role !== "WRITER" && session.user.role !== "DEVELOPER") {
      return { error: "Only experts can accept orders" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        assignedToId: session.user.id,
        maskedAssigneeId: session.user.maskedId,
      }
    });

    revalidatePath("/dashboard/expert");
    return { success: true };
  } catch (error) {
    console.error("Error accepting order:", error);
    return { error: "Failed to accept order" };
  }
}
