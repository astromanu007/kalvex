import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🚀 API Seeding Demo Data...");

    // 1. Create/Update Demo User
    const demoUser = await prisma.user.upsert({
      where: { email: "demo@kalvex.com" },
      update: {},
      create: {
        name: "Manish Kumar",
        email: "demo@kalvex.com",
        role: "USER",
        maskedId: "KV-0042",
        referralCode: "MANISH42",
        credits: 500,
      },
    });

    // 2. Create an Active Order
    const order = await prisma.order.upsert({
      where: { orderNumber: "ORD-2026-TEST" },
      update: {},
      create: {
        orderNumber: "ORD-2026-TEST",
        userId: demoUser.id,
        serviceType: "DESIGN_PATENT_DRAFTING",
        status: "RESEARCH_STARTED",
        amount: 14500,
        maskedClientId: "KV-0042",
        requirements: "Design a modular drone chassis for agricultural spraying.",
      },
    });

    // 3. Create an Expert (Writer)
    const expert = await prisma.user.upsert({
      where: { email: "expert@kalvex.com" },
      update: {},
      create: {
        name: "Dr. Arun Varma",
        email: "expert@kalvex.com",
        role: "WRITER",
        maskedId: "KV-E901",
        referralCode: "ARUN901",
        domainExpertise: ["Aerospace", "Mechanical Design"],
      },
    });

    // 4. Create Affiliate Data
    await prisma.affiliate.upsert({
      where: { userId: demoUser.id },
      update: {},
      create: {
        userId: demoUser.id,
        referralCode: "MANISH42",
        clicks: 124,
        conversions: 8,
        totalEarnings: 4250,
        pendingPayout: 1200,
        tier: "SILVER",
        upiId: "manish@okaxis"
      }
    });

    // 5. Create Notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: demoUser.id,
          title: "Order Research Started",
          body: "Our expert Dr. Arun Varma has started research on your drone patent.",
          type: "ORDER_UPDATE",
          link: `/dashboard/orders/${order.id}`,
        },
        {
          userId: demoUser.id,
          title: "New Message",
          body: "You have a new message from your assigned expert.",
          type: "MESSAGE",
          link: `/dashboard/messages`,
        },
      ],
      skipDuplicates: true
    });

    return NextResponse.json({ 
      success: true, 
      message: "Demo seeding complete!",
      user: "demo@kalvex.com",
      orderId: order.id
    });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
