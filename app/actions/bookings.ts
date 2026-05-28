import { PrismaClient, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();

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
