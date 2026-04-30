"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Fetch messages for a specific order
export async function getMessages(orderId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId, role } = session.user;

    // Verify access to this order (must be owner or assignee)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true, assignedToId: true }
    });

    if (!order) return { error: "Order not found" };
    if (order.userId !== userId && order.assignedToId !== userId && role !== "ADMIN") {
      return { error: "Access denied" };
    }

    const messages = await prisma.message.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { maskedId: true, role: true }
        }
      }
    });

    return { messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { error: "Failed to fetch messages" };
  }
}

// Send a new message
export async function sendMessage(orderId: string, content: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId, role } = session.user;

    // Verify access
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) return { error: "Order not found" };
    if (order.userId !== userId && order.assignedToId !== userId) {
      return { error: "Access denied" };
    }

    // Basic PII Filter Check (Naive implementation - ideally use a better regex or AI)
    const piiRegex = /\b(\d{10}|\S+@\S+\.\S+)\b/g;
    const isBlocked = piiRegex.test(content);
    const blockReason = isBlocked ? "Contains potential email or phone number" : null;

    const message = await prisma.message.create({
      data: {
        orderId,
        senderId: userId,
        senderRole: role as any,
        content: isBlocked ? "[MESSAGE BLOCKED DUE TO PII]" : content,
        isBlocked,
        blockReason
      }
    });

    revalidatePath(`/dashboard/messages`);
    
    return { success: true, messageId: message.id, isBlocked };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}
