"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Fetch messages for a specific order (with middleman routing applied)
export async function getMessages(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId, role } = session.user;

    // Verify access to this order (must be owner, assignee, or admin)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true, assignedToId: true }
    });

    if (!order) return { error: "Order not found" };
    if (order.userId !== userId && order.assignedToId !== userId && role !== "ADMIN") {
      return { error: "Access denied" };
    }

    const allMessages = await prisma.message.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { name: true, maskedId: true, role: true }
        }
      }
    });

    // Apply middleman approval filters:
    // 1. Admins see all messages.
    // 2. Senders see their own messages (even if not approved yet, showing "pending review").
    // 3. Receivers only see messages that are approvedByAdmin === true OR sent by an ADMIN.
    const filteredMessages = allMessages.filter(msg => {
      if (role === "ADMIN") return true;
      if (msg.senderId === userId) return true;
      if (msg.senderRole === "ADMIN") return true;
      return msg.approvedByAdmin === true;
    });

    return { messages: filteredMessages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { error: "Failed to fetch messages" };
  }
}

// Send a new message (routes through admin approval middleman)
export async function sendMessage(orderId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId, role } = session.user;

    // Verify access
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) return { error: "Order not found" };
    if (order.userId !== userId && order.assignedToId !== userId && role !== "ADMIN") {
      return { error: "Access denied" };
    }

    // Basic PII Filter Check
    const piiRegex = /\b(\d{10}|\S+@\S+\.\S+)\b/g;
    const isBlocked = piiRegex.test(content);
    const blockReason = isBlocked ? "Contains potential email or phone number" : null;

    // Admin messages are automatically approved. Student & Developer messages require Admin approval.
    const approvedByAdmin = role === "ADMIN";

    const message = await prisma.message.create({
      data: {
        orderId,
        senderId: userId,
        senderRole: role as any,
        content: isBlocked ? "[MESSAGE BLOCKED DUE TO PII]" : content,
        isBlocked,
        blockReason,
        approvedByAdmin
      }
    });

    revalidatePath(`/dashboard/messages`);
    
    return { success: true, messageId: message.id, isBlocked, approvedByAdmin };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}

// Admin action: Approve a pending message
export async function approveMessage(messageId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { approvedByAdmin: true }
    });

    revalidatePath(`/dashboard/messages`);
    return { success: true };
  } catch (error) {
    console.error("Error approving message:", error);
    return { error: "Failed to approve message" };
  }
}

// Admin action: Reject/Block a message
export async function rejectMessage(messageId: string, reason: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await prisma.message.update({
      where: { id: messageId },
      data: {
        isBlocked: true,
        blockReason: reason || "Rejected by Admin"
      }
    });

    revalidatePath(`/dashboard/messages`);
    return { success: true };
  } catch (error) {
    console.error("Error rejecting message:", error);
    return { error: "Failed to reject message" };
  }
}

// Mark messages in order as read
export async function markAsRead(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };
    const { id: userId } = session.user;

    await prisma.message.updateMany({
      where: {
        orderId,
        senderId: { not: userId },
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });

    revalidatePath(`/dashboard/messages`);
    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { error: "Failed to mark as read" };
  }
}

// Fetch all pending messages in the system for Admin approval
export async function getPendingMessages() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { approvedByAdmin: false },
          { isBlocked: true }
        ]
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: { name: true, email: true, role: true, maskedId: true }
        },
        order: {
          select: { orderNumber: true, serviceType: true }
        }
      }
    });

    return { messages };
  } catch (error) {
    console.error("Error fetching pending messages:", error);
    return { error: "Failed to fetch pending messages" };
  }
}
