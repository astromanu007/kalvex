"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createNotification({
  userId,
  title,
  body,
  type,
  link
}: {
  userId: string;
  title: string;
  body: string;
  type: string;
  link?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        type,
        link
      }
    });

    // Optional: Send Email if configured
    if (process.env.RESEND_API_KEY) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await resend.emails.send({
          from: 'Kalvex Labs <notifications@kalvex.com>',
          to: user.email,
          subject: title,
          html: `<p>${body}</p>${link ? `<a href="${process.env.NEXTAUTH_URL}${link}">View Details</a>` : ""}`
        });
      }
    }

    return { success: true, notification };
  } catch (error) {
    console.error("Notification Error:", error);
    return { error: "Failed to create notification" };
  }
}

export async function getNotifications() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: "Unauthorized" };

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return { notifications };
  } catch (error) {
    console.error("Fetch Notifications Error:", error);
    return { error: "Failed to fetch notifications" };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: "Unauthorized" };

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    return { success: true };
  } catch (error) {
    console.error("Mark Read Error:", error);
    return { error: "Failed to mark as read" };
  }
}
