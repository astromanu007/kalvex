"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { OrderStatus, ServiceType } from "@prisma/client";

// Get all orders for the current user (if client) or assigned orders (if expert)
export async function getOrders() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId, role } = session.user;

    if (role === "USER" || role === "STUDENT") {
      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          statusHistory: { orderBy: { createdAt: "desc" }, take: 1 }
        }
      });
      return { orders };
    }

    if (role === "WRITER" || role === "DEVELOPER") {
      const orders = await prisma.order.findMany({
        where: { assignedToId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          statusHistory: { orderBy: { createdAt: "desc" }, take: 1 }
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
    const session = await getServerSession(authOptions);
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
