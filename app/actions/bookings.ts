"use server";

import prisma from "@/lib/prisma";
import { ServiceType, BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

/**
 * Create a new booking record.
 * @param userId - ID of the user creating the booking.
 * @param serviceId - ID of the service (or product) being booked.
 * @param serviceType - Enum value from ServiceType.
 * @param requirements - Free‑form description of the request.
 */
export async function createBooking({
  userId,
  serviceId,
  serviceType,
  requirements,
}: {
  userId: string;
  serviceId: string;
  serviceType: ServiceType;
  requirements: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    // Enforce that a user can only create bookings for themselves unless they are admin
    if (session.user.id !== userId && session.user.role !== "ADMIN") {
      return { success: false, error: "Access denied" };
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        serviceType,
        requirements,
      },
    });
    console.log('Booking created:', { bookingId: booking.id, userId });
    revalidatePath("/admin/bookings");
    return { success: true, booking };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return { success: false, error: (error as Error).message };
  }
}

/** Assign a developer (or admin) to a booking */
export async function assignBooking({
  bookingId,
  assignedToId,
}: {
  bookingId: string;
  assignedToId: string;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { assignedToId },
    });
    revalidatePath("/admin/bookings");
    return { success: true, booking };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/** Update the status of a booking */
export async function updateBookingStatus({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const bookingRecord = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!bookingRecord) return { success: false, error: "Booking not found" };

    const isAdmin = session.user.role === "ADMIN";
    const isAssignedDeveloper = bookingRecord.assignedToId === session.user.id;
    const isOwner = bookingRecord.userId === session.user.id;

    if (!isAdmin && !isAssignedDeveloper && !isOwner) {
      return { success: false, error: "Access denied" };
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    revalidatePath("/admin/bookings");
    return { success: true, booking };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/** Get all bookings for admin dashboard */
export async function getAllBookings() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "WRITER")) {
      return { success: false, error: "Unauthorized. Staff access required." };
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, bookings };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
