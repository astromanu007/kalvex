"use server";

import prisma from "@/lib/prisma";
import { ServiceType, BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
