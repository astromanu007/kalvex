"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData, orderId: string, folder: string = "orders") {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) return { error: "Order not found" };

    const isClient = order.userId === session.user.id;
    const isExpert = order.assignedToId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isClient && !isExpert && !isAdmin) {
      return { error: "Access denied: Unauthorized to upload files to this order" };
    }

    const file = formData.get("file") as File;
    if (!file) return { error: "No file provided" };

    // File validation checks
    const allowedExtensions = [".pdf", ".docx", ".zip", ".png", ".jpg", ".jpeg", ".txt", ".stl", ".step", ".cad"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return { error: "File type not allowed. Supported formats: PDF, DOCX, ZIP, PNG, JPG, STL, STEP, CAD, TXT." };
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      return { error: "File size exceeds the 15MB limit." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    
    const { data, error } = await supabaseAdmin.storage
      .from("kalvex")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return { error: error.message };
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
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
    const { data, error } = await supabaseAdmin.storage
      .from("kalvex")
      .list(path);

    if (error) throw error;
    return { files: data };
  } catch (error) {
    console.error("Get Files Error:", error);
    return { error: "Failed to fetch files" };
  }
}

export async function deleteFile(fileId: string, orderId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const fileRecord = await prisma.orderFile.findUnique({
      where: { id: fileId }
    });

    if (!fileRecord) return { error: "File not found" };

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    const isUploader = fileRecord.uploadedBy === session.user.id;
    const isOrderOwner = order?.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isUploader && !isOrderOwner && !isAdmin) {
      return { error: "Unauthorized to delete this file" };
    }

    const urlParts = fileRecord.fileUrl.split("/public/kalvex/");
    if (urlParts.length > 1) {
      const storagePath = urlParts[1];
      const { error: storageError } = await supabaseAdmin.storage
        .from("kalvex")
        .remove([storagePath]);

      if (storageError) {
        console.error("Supabase Storage Delete Error:", storageError);
      }
    }

    await prisma.orderFile.delete({
      where: { id: fileId }
    });

    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete File Error:", error);
    return { error: "Failed to delete file" };
  }
}

