"use server";

import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData, orderId: string, folder: string = "orders") {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) return { error: "No file provided" };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    
    const { data, error } = await supabase.storage
      .from("kalvex")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return { error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("kalvex")
      .getPublicUrl(fileName);

    // Save to DB
    await prisma.orderFile.create({
      data: {
        orderId,
        fileUrl: publicUrl,
        fileName: file.name,
        fileType: file.type,
        uploadedBy: session.user.id
      }
    });

    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true, url: publicUrl, fileName: file.name };
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Failed to upload file" };
  }
}

export async function getFiles(path: string) {
  try {
    const { data, error } = await supabase.storage
      .from("kalvex")
      .list(path);

    if (error) throw error;
    return { files: data };
  } catch (error) {
    console.error("Get Files Error:", error);
    return { error: "Failed to fetch files" };
  }
}
