"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// STORE (Products)
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, products };
  } catch (error) {
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function upsertProduct(data: any) {
  try {
    const { id, ...payload } = data;
    
    // Generate slug if not present
    if (!payload.slug) {
      payload.slug = payload.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }

    if (id) {
      await prisma.product.update({ where: { id }, data: payload });
    } else {
      await prisma.product.create({ data: payload });
    }
    
    revalidatePath("/admin/store");
    revalidatePath("/electronics");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to save product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/store");
    revalidatePath("/electronics");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product" };
  }
}

// PROJECTS
export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, projects };
  } catch (error) {
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function upsertProject(data: any) {
  try {
    const { id, ...payload } = data;
    if (!payload.slug) {
      payload.slug = payload.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }
    if (id) {
      await prisma.project.update({ where: { id }, data: payload });
    } else {
      await prisma.project.create({ data: payload });
    }
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to save project" };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete project" };
  }
}

// SERVICES
export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, services };
  } catch (error) {
    return { success: false, error: "Failed to fetch services" };
  }
}

export async function upsertService(data: any) {
  try {
    const { id, ...payload } = data;
    if (!payload.slug && payload.title) {
      payload.slug = payload.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }
    if (id) {
      await prisma.service.update({ where: { id }, data: payload });
    } else {
      await prisma.service.create({ data: payload });
    }
    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to save service" };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete service" };
  }
}
