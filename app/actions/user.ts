"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name?: string;
  phone?: string;
  city?: string;
  college?: string;
  branch?: string;
  year?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const { id: userId } = session.user;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city,
        college: data.college,
        branch: data.branch,
        year: data.year ? parseInt(data.year.toString()) : undefined,
      }
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}
