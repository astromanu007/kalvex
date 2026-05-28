"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOTPEmail(to: string, name: string, otp: string, isClient = false) {
  const subject = isClient
    ? "Institutional Verification — Kalvex Labs"
    : "Verify Your Kalvex Account";

  const html = isClient
    ? `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px; letter-spacing: -0.5px;">KALVEX LABS</h1>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Institutional Access Protocol</p>
        </div>
        <p style="color: #334155;">Welcome, <strong>${name}</strong>,</p>
        <p style="color: #334155;">Authorize your institutional account using the synchronization token below:</p>
        <div style="background: #f1f5f9; padding: 28px; border-radius: 12px; text-align: center; font-size: 44px; font-weight: 900; letter-spacing: 14px; color: #1e293b; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">This token expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #cbd5e1; font-size: 11px; text-align: center;">© Kalvex Labs — If you didn't request this, ignore this email.</p>
      </div>
    `
    : `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px; letter-spacing: -0.5px;">KALVEX LABS</h1>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Student Verification</p>
        </div>
        <p style="color: #334155;">Hi <strong>${name}</strong>,</p>
        <p style="color: #334155;">Welcome! Please verify your email using the 6-digit code below:</p>
        <div style="background: #eff6ff; padding: 28px; border-radius: 12px; text-align: center; font-size: 44px; font-weight: 900; letter-spacing: 14px; color: #1e40af; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">This code expires in <strong>10 minutes</strong>.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #cbd5e1; font-size: 11px; text-align: center;">© Kalvex Labs — If you didn't register, ignore this email.</p>
      </div>
    `;

  try {
    await resend.emails.send({
      from: `"Kalvex Labs" <${process.env.RESEND_FROM || "no-reply@kalvexlabs.com"}>`,
      to,
      subject,
      html,
    });
    console.log(`[MAIL] OTP sent to ${to}: ${otp}`);
  } catch (err) {
    console.error(`[MAIL ERROR] Failed to send to ${to}:`, err);
    throw err; // Re-throw so caller knows it failed
  }
}

// ─── Register Student ────────────────────────────────────────────────────────

export async function registerStudent(formData: any) {
  try {
    const { email, password, name, phone, college, branch, year, city, referralCode } = formData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "An account with this email already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP — delete any previous one for this email first
    await prisma.verificationCode.deleteMany({ where: { email } });
    await prisma.verificationCode.create({ data: { email, code: otp, expiresAt } });

    // Create user (unverified)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        college,
        branch,
        year: parseInt(year),
        city,
        referralCode: referralCode || "KV-" + Math.floor(100000 + Math.random() * 900000),
        role: "STUDENT",
      },
    });

    // Fire email in background — don't block the response
    sendOTPEmail(email, name, otp, false).catch((e) =>
      console.error("[MAIL ERROR] Student OTP:", e)
    );

    return { success: true };
  } catch (error: any) {
    console.error("Student Registration Error:", error);
    return { error: error.message || "Registration failed. Please try again." };
  }
}

// ─── Register Client ─────────────────────────────────────────────────────────

export async function registerClient(formData: any) {
  try {
    const { email, password, name, organization, industry, website } = formData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "An account with this email already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.deleteMany({ where: { email } });
    await prisma.verificationCode.create({ data: { email, code: otp, expiresAt } });

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        organization,
        industry,
        website,
        role: "USER",
        referralCode: "CL-" + Math.floor(100000 + Math.random() * 900000),
      },
    });

    // Fire email in background — don't block the response
    sendOTPEmail(email, name, otp, true).catch((e) =>
      console.error("[MAIL ERROR] Client OTP:", e)
    );

    return { success: true };
  } catch (error: any) {
    console.error("Client Registration Error:", error);
    return { error: error.message || "Registration failed. Please try again." };
  }
}

// ─── Verify OTP ──────────────────────────────────────────────────────────────

export async function verifyOTP(email: string, code: string) {
  try {
    const verification = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) return { error: "Invalid or expired verification code" };

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationCode.delete({ where: { id: verification.id } });

    return { success: true };
  } catch (error: any) {
    console.error("Verification Error:", error);
    return { error: "Verification failed. Please try again." };
  }
}
