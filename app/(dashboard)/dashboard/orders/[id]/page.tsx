"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Clock, FileText, CheckCircle, AlertCircle, 
  MessageSquare, Download, CreditCard, Loader2, Paperclip, ShieldCheck,
  Sparkles, Palette, Layers, Calendar, CheckCircle2,
  Bookmark, Clipboard, BookOpen, PenTool, Printer, Award,
  Package, Truck, PackageCheck, MapPin, Cpu, Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/app/actions/orders";
import { uploadFile } from "@/app/actions/storage";
import { motion } from "framer-motion";
import { parseRequirements, getServiceTitle, isElectronicsOrder } from "@/lib/utils";

const STATUS_MAP: Record<string, { color: string; icon: any, desc: string }> = {
  PENDING_PAYMENT:    { color: "text-amber-600 bg-amber-50", icon: AlertCircle, desc: "Awaiting your payment to begin." },
  PAYMENT_CONFIRMED:  { color: "text-blue-600 bg-blue-50", icon: CheckCircle, desc: "Payment received, order is being assigned." },
  TOPIC_CONFIRMED:    { color: "text-indigo-600 bg-indigo-50", icon: CheckCircle, desc: "Topic has been confirmed by the expert." },
  RESEARCH_STARTED:   { color: "text-violet-600 bg-violet-50", icon: Clock, desc: "Expert is actively working on this order." },
  DRAFT_IN_PROGRESS:  { color: "text-sky-600 bg-sky-50", icon: Clock, desc: "Initial draft is being written." },
  DRAFT_SUBMITTED:    { color: "text-cyan-600 bg-cyan-50", icon: CheckCircle, desc: "Draft submitted for internal review." },
  UNDER_REVIEW:       { color: "text-orange-600 bg-orange-50", icon: Clock, desc: "Undergoing quality and plagiarism checks." },
  REVISION_REQUESTED: { color: "text-rose-600 bg-rose-50", icon: AlertCircle, desc: "Revision requested by you." },
  REVISION_SUBMITTED: { color: "text-pink-600 bg-pink-50", icon: CheckCircle, desc: "Revised work submitted by expert." },
  FINAL_APPROVED:     { color: "text-teal-600 bg-teal-50", icon: CheckCircle, desc: "Final version approved." },
  DELIVERED:          { color: "text-emerald-600 bg-emerald-50", icon: CheckCircle, desc: "Your order has been delivered." },
  COMPLETED:          { color: "text-green-600 bg-green-50", icon: CheckCircle, desc: "Order finalized and closed." },
  CANCELLED:          { color: "text-red-600 bg-red-50", icon: AlertCircle, desc: "Order was cancelled." },
  REFUNDED:           { color: "text-gray-600 bg-gray-50", icon: AlertCircle, desc: "Order was refunded." },
};

// E-commerce status labels for hardware orders
const HW_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT:   "Awaiting Payment",
  PAYMENT_CONFIRMED: "Order Confirmed",
  RESEARCH_STARTED:  "Processing",
  DRAFT_IN_PROGRESS: "Shipped",
  DELIVERED:         "Delivered",
  COMPLETED:         "Completed",
  CANCELLED:         "Cancelled",
  REFUNDED:          "Refunded",
};

// E-commerce tracking steps
const HW_TRACKING_STEPS = [
  { key: "PENDING_PAYMENT",   label: "Order Placed",      icon: Box,          desc: "Your order has been received." },
  { key: "PAYMENT_CONFIRMED", label: "Payment Confirmed", icon: CheckCircle2, desc: "Payment verified. Order confirmed." },
  { key: "RESEARCH_STARTED",  label: "Processing",        icon: Package,      desc: "Your items are being packed." },
  { key: "DRAFT_IN_PROGRESS", label: "Shipped",           icon: Truck,        desc: "Your order is on the way." },
  { key: "DELIVERED",         label: "Delivered",         icon: PackageCheck, desc: "Package delivered successfully." },
];

const HW_STEP_ORDER = ["PENDING_PAYMENT","PAYMENT_CONFIRMED","RESEARCH_STARTED","DRAFT_IN_PROGRESS","DELIVERED","COMPLETED"];

const getIconForLabel = (label: string) => {
  const lbl = label.toLowerCase();
  if (lbl.includes("page")) return BookOpen;
  if (lbl.includes("type") || lbl.includes("priority") || lbl.includes("deadline")) return Clock;
  if (lbl.includes("topic") || lbl.includes("domain") || lbl.includes("subject")) return Bookmark;
  if (lbl.includes("style") || lbl.includes("font")) return PenTool;
  if (lbl.includes("paper")) return FileText;
  if (lbl.includes("ink") || lbl.includes("color")) return Palette;
  if (lbl.includes("diagram") || lbl.includes("figure")) return Layers;
  if (lbl.includes("instruction") || lbl.includes("guideline")) return Clipboard;
  if (lbl.includes("name") || lbl.includes("client") || lbl.includes("details")) return ShieldCheck;
  return Sparkles;
};

const RequirementCard = ({ label, value, index }: { label: string; value: string; index: number }) => {
  const Icon = getIconForLabel(label);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
      }}
      className="relative p-[1.5px] rounded-2xl bg-gradient-to-br from-border/50 to-border/30 hover:from-indigo-500/50 hover:via-purple-500/50 hover:to-pink-500/50 transition-all duration-300 group overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-500/5"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(130px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99,102,241,0.25), transparent 80%)`,
        }} />
      <div className="bg-bg-card rounded-[14.5px] p-5 flex items-start gap-4 h-full relative z-10 backdrop-blur-sm">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1 group-hover:text-indigo-500 transition-colors">{label}</p>
          <p className="text-sm font-semibold text-text-primary leading-normal">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const getComponentResources = (itemName: string) => {
  const name = itemName.toLowerCase();
  if (name.includes("arduino")) {
    return [
      { label: "Arduino Datasheet", href: "https://docs.arduino.cc/resources/datasheets/ABX00087-datasheet.pdf" },
      { label: "Getting Started Guide", href: "https://docs.arduino.cc/hardware/uno-r4-wifi" }
    ];
  }
  if (name.includes("robot")) {
    return [
      { label: "Assembly Instructions", href: "#" },
      { label: "Control Library GitHub", href: "#" }
    ];
  }
  if (name.includes("cable") || name.includes("acquisition")) {
    return [
      { label: "Pinout Diagram", href: "#" }
    ];
  }
  return [
    { label: "User Manual", href: "#" }
  ];
};

const downloadInvoice = (order: any) => {
  const invoiceWindow = window.open("", "_blank");
  if (!invoiceWindow) return;

  const isHardware = isElectronicsOrder(order);
  const clientName = order.user?.name || "Manish Student";
  const clientEmail = order.user?.email || "manish@kalvex.com";
  const clientPhone = order.user?.phone || "";
  const clientCollege = order.user?.college || "";

  // Dynamic details list for service orders
  const { parsed: parsedReqs } = parseRequirements(order.requirements);
  const serviceDetailsList = parsedReqs
    .map(r => `<span style="font-size: 11px; color: #475569; margin-right: 15px; display: inline-block;">• <strong>${r.label}:</strong> ${r.value}</span>`)
    .join("");

  const itemsHTML = isHardware
    ? (order.requirements?.split("ITEMS PURCHASED:")[1]
        ?.split("SHIPPING DESTINATION")[0]
        ?.trim()
        .split("\n")
        .filter(Boolean)
        .map((line: string) => {
          const cleanLine = line.replace(/^- /, "");
          const parts = cleanLine.split(" — ");
          const name = parts[0] || "Component Item";
          const priceStr = parts[1] || ("₹" + order.amount?.toLocaleString());
          return `
            <tr>
              <td>
                <div style="font-weight: 600; color: #0F172A; font-size: 13px;">${name}</div>
                <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Hardware Component Item</div>
              </td>
              <td class="text-center">1</td>
              <td class="text-right">${priceStr}</td>
              <td class="text-right" style="font-weight: 700; color: #0F172A;">${priceStr}</td>
            </tr>
          `;
        })
        .join("") || "")
    : `
      <tr>
        <td>
          <div style="font-weight: 700; color: #0F172A; font-size: 14px; text-transform: capitalize;">${getServiceTitle(order.serviceType, order.requirements).toLowerCase()}</div>
          ${serviceDetailsList ? `<div style="margin-top: 6px; display: flex; flex-wrap: wrap;">${serviceDetailsList}</div>` : ""}
        </td>
        <td class="text-center">1</td>
        <td class="text-right">₹${order.amount?.toLocaleString()}</td>
        <td class="text-right" style="font-weight: 700; color: #0F172A;">₹${order.amount?.toLocaleString()}</td>
      </tr>
    `;

  const shippingDetails = order.requirements?.split("SHIPPING DESTINATION DETAILS:")[1]?.trim() || "N/A";

  invoiceWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          /* Document Root & Print Reset */
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
            color: #0F172A; 
            margin: 0; 
            padding: 40px; 
            background: #F8FAFC;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Elegant Card Framing with Professional Borders */
          .invoice-card {
            max-width: 850px;
            margin: 0 auto;
            background: #ffffff;
            border: 2px solid #0F172A;
            border-radius: 12px;
            padding: 45px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            position: relative;
          }

          /* Header Layout */
          .invoice-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            border-bottom: 2px solid #0F172A; 
            padding-bottom: 25px; 
            margin-bottom: 30px;
          }
          .logo-area {
            display: flex;
            flex-direction: column;
          }
          .logo { 
            font-size: 32px; 
            font-weight: 950; 
            color: #1E40AF; 
            letter-spacing: -0.05em; 
            margin: 0;
            line-height: 1.0;
          }
          .tagline {
            font-size: 10px;
            font-weight: 800;
            color: #475569;
            margin: 6px 0 0 0;
            text-transform: uppercase;
            letter-spacing: 0.12em;
          }
          .company-details {
            font-size: 11px;
            color: #475569;
            margin-top: 12px;
            line-height: 1.6;
            font-weight: 500;
          }
          .company-details strong {
            color: #0F172A;
          }
          .title-area {
            text-align: right;
          }
          .invoice-title { 
            font-size: 36px; 
            font-weight: 950; 
            margin: 0; 
            color: #0F172A;
            letter-spacing: -0.03em; 
            line-height: 1.0;
          }
          .invoice-number { 
            font-size: 15px; 
            font-weight: 800; 
            color: #1E40AF; 
            margin: 8px 0 0 0; 
            font-family: monospace;
            letter-spacing: 0.05em;
          }

          /* Grid and Side-by-Side Bordered Panels */
          .invoice-grid { 
            display: grid; 
            grid-template-columns: 1.2fr 1fr; 
            gap: 24px; 
            margin-bottom: 25px;
          }
          .details-panel {
            border: 1.5px solid #0F172A;
            border-radius: 8px;
            padding: 20px;
            background-color: #F8FAFC;
          }
          .details-panel h3 { 
            font-size: 11px; 
            text-transform: uppercase; 
            letter-spacing: 0.1em; 
            color: #475569; 
            margin-bottom: 12px; 
            margin-top: 0; 
            border-bottom: 1.5px solid #0F172A;
            padding-bottom: 6px;
            font-weight: 900;
          }
          .details-panel p { 
            font-size: 13px; 
            font-weight: 600; 
            line-height: 1.6; 
            margin: 0; 
            color: #334155;
          }
          .details-panel strong {
            color: #0F172A;
            font-weight: 700;
          }

          /* Shipping Panel with Professional Box-Border Styling */
          .shipping-panel {
            border: 1.5px solid #0F172A;
            border-radius: 8px;
            padding: 20px;
            background-color: #F8FAFC;
            margin-bottom: 30px;
          }
          .shipping-panel h3 {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #475569;
            margin-bottom: 10px;
            margin-top: 0;
            border-bottom: 1.5px solid #0F172A;
            padding-bottom: 6px;
            font-weight: 900;
          }
          .shipping-panel p {
            white-space: pre-line;
            font-size: 13px;
            font-weight: 600;
            color: #334155;
            margin: 0;
            line-height: 1.5;
          }

          /* Solid Grid-Border Items Table */
          .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            border: 2px solid #0F172A;
            margin-bottom: 30px;
          }
          .items-table th { 
            border: 2px solid #0F172A;
            background-color: #F1F5F9; 
            padding: 12px 14px; 
            font-size: 11px; 
            text-transform: uppercase; 
            letter-spacing: 0.08em;
            color: #0F172A; 
            text-align: left; 
            font-weight: 900;
          }
          .items-table td {
            border: 1.5px solid #0F172A;
            padding: 14px;
            font-size: 13px;
            color: #334155;
            vertical-align: top;
          }
          .items-table tr:nth-child(even) {
            background-color: #F8FAFC;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }

          /* Totals Box with Grid-Borders */
          .totals-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 30px;
          }
          .terms-info {
            max-width: 450px;
            font-size: 11px;
            color: #64748B;
            line-height: 1.6;
            font-weight: 500;
          }
          .terms-info h4 {
            color: #0F172A;
            font-size: 12px;
            margin: 0 0 6px 0;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .totals-box { 
            width: 320px; 
            border: 2px solid #0F172A;
            border-radius: 8px;
            overflow: hidden;
            background: #ffffff;
            margin-left: 20px;
          }
          .totals-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 10px 14px; 
            font-size: 13px; 
            color: #475569;
            font-weight: 600;
            border-bottom: 1.5px solid #0F172A;
          }
          .totals-row:last-child {
            border-bottom: none;
          }
          .totals-row.grand-total { 
            background: #F8FAFC;
            border-top: 1px solid #0F172A;
            padding: 14px; 
            font-size: 16px; 
            font-weight: 900; 
            color: #1E40AF; 
          }

          /* Signature / Stamp Area */
          .signatory-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 50px;
            padding-right: 10px;
          }
          .signatory-box {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-bottom: 1.5px solid #0F172A;
            height: 50px;
            margin-bottom: 8px;
            position: relative;
          }
          .signature-label {
            font-size: 11px;
            font-weight: 800;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .seal-placeholder {
            position: absolute;
            top: 5px;
            left: 50%;
            transform: translateX(-50%);
            border: 2px dashed #CBD5E1;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7px;
            color: #94A3B8;
            font-weight: 900;
            text-transform: uppercase;
          }

          /* Status Badges */
          .badge-paid {
            background-color: #ECFDF5;
            color: #065F46;
            border: 1.5px solid #059669;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 850;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .badge-unpaid {
            background-color: #FFFBEB;
            color: #92400E;
            border: 1.5px solid #D97706;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 850;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          /* Footer styling */
          .footer { 
            margin-top: 60px; 
            border-top: 2px solid #0F172A; 
            padding-top: 25px; 
            text-align: center; 
            font-size: 11px; 
            color: #475569; 
            line-height: 1.6;
            font-weight: 600; 
          }

          /* Print Overrides */
          @page {
            size: A4;
            margin: 10mm;
          }
          @media print {
            body { 
              padding: 0; 
              background: #ffffff;
            }
            .invoice-card {
              border: 2px solid #000000 !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 12mm !important;
              max-width: 100% !important;
              border-radius: 6px !important;
              box-sizing: border-box;
            }
            .invoice-header, .invoice-grid, .shipping-panel, .totals-container, .signatory-container, .footer {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .items-table tr {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .details-panel {
              border: 1.5px solid #000000 !important;
              background-color: #ffffff !important;
            }
            .shipping-panel {
              border: 1.5px solid #000000 !important;
              background-color: #ffffff !important;
            }
            .items-table {
              border: 2px solid #000000 !important;
            }
            .items-table th {
              border: 2px solid #000000 !important;
              background-color: #F1F5F9 !important;
            }
            .items-table td {
              border: 1.5px solid #000000 !important;
            }
            .totals-box {
              border: 2px solid #000000 !important;
            }
            .totals-row {
              border-bottom: 1.5px solid #000000 !important;
            }
            .totals-row.grand-total {
              border-top: 1.5px solid #000000 !important;
            }
            .signature-line {
              border-bottom: 1.5px solid #000000 !important;
            }
            .badge-paid {
              border: 1.5px solid #000000 !important;
              background-color: #ffffff !important;
              color: #000000 !important;
            }
            .badge-unpaid {
              border: 1.5px solid #000000 !important;
              background-color: #ffffff !important;
              color: #000000 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <!-- Corporate / Organization Header Details -->
          <div class="invoice-header">
            <div class="logo-area">
              <h1 class="logo">KALVEX</h1>
              <p class="tagline">Engineering & Technologies Labs</p>
              <div class="company-details">
                <strong>Kalvex Engineering Labs Private Limited</strong><br>
                HQ: Double Road, Indiranagar, Bangalore, KA 560038, India<br>
                <strong>CIN:</strong> U72900KA2026PTC123456 | <strong>GSTIN:</strong> 29AAFCD1234F1Z5<br>
                <strong>Support Email:</strong> billing@kalvex.com | <strong>Web:</strong> www.kalvex.com
              </div>
            </div>
            <div class="title-area">
              <h2 class="invoice-title">INVOICE</h2>
              <div class="invoice-number">${order.orderNumber}</div>
            </div>
          </div>
  
          <!-- Client & Billing Information Panels -->
          <div class="invoice-grid">
            <div class="details-panel">
              <h3>Billed To</h3>
              <p style="font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 6px;">${clientName}</p>
              <p style="font-weight: 600; color: #475569;">${clientEmail}</p>
              ${clientPhone ? `<p style="font-weight: 500; color: #475569; margin-top: 4px;"><strong>Phone:</strong> ${clientPhone}</p>` : ""}
              ${clientCollege ? `<p style="font-weight: 500; color: #475569; margin-top: 2px;"><strong>College:</strong> ${clientCollege}</p>` : ""}
            </div>
            <div class="details-panel">
              <h3>Invoice Metadata</h3>
              <p style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 12px;">
                <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h3>Payment Status</h3>
              <div style="margin-top: 4px;">
                <span class="${order.status === "PENDING_PAYMENT" ? "badge-unpaid" : "badge-paid"}">
                  ${order.status === "PENDING_PAYMENT" ? "Awaiting Payment" : "Paid & Confirmed"}
                </span>
              </div>
            </div>
          </div>
  
          <!-- Optional Shipping Destination Details -->
          ${
            isHardware
              ? `
              <div class="shipping-panel">
                <h3>Shipping Destination Details</h3>
                <p>${shippingDetails}</p>
              </div>
              `
              : ""
          }
  
          <!-- Items & Description Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 50%;">Item Description & Details</th>
                <th class="text-center" style="width: 10%;">Qty</th>
                <th class="text-right" style="width: 20%;">Unit Price</th>
                <th class="text-right" style="width: 20%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
  
          <!-- Summary & Totals / Signatory Section -->
          <div class="totals-container">
            <div class="terms-info">
              <h4>Terms & Conditions</h4>
              <p style="margin: 0 0 6px 0;">1. All service deliverables are subject to the Kalvex Quality and plagiarism-free guarantee.</p>
              <p style="margin: 0 0 6px 0;">2. Strict No-Return and No-Replacement policy applies to all hardware and electronics store components once dispatched.</p>
              <p style="margin: 0;">3. This document constitutes a valid proof of transaction. For payment queries, reach out to support.</p>
            </div>
            <div>
              <div class="totals-box">
                <div class="totals-row">
                  <span>Subtotal</span>
                  <span style="font-weight: 700; color: #0F172A;">₹${order.amount?.toLocaleString()}</span>
                </div>
                <div class="totals-row">
                  <span>CGST (0%)</span>
                  <span>₹0</span>
                </div>
                <div class="totals-row">
                  <span>SGST (0%)</span>
                  <span>₹0</span>
                </div>
                <div class="totals-row grand-total">
                  <span>Total Amount</span>
                  <span>₹${order.amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Authorized Signature Area -->
          <div class="signatory-container">
            <div class="signatory-box" style="position: relative;">
              <!-- Premium Symmetrical Blue Ink Corporate Seal Stamp -->
              <div style="position: absolute; top: -55px; left: 50%; transform: translateX(-50%) rotate(-8deg); opacity: 0.85; pointer-events: none; z-index: 10;">
                <svg viewBox="0 0 120 120" width="120" height="120">
                  <defs>
                    <!-- Top Semi-Circle Path (Clockwise) -->
                    <path id="topTextPath" d="M 15,60 A 45,45 0 0,1 105,60" fill="none" />
                    <!-- Bottom Semi-Circle Path (Counter-Clockwise) -->
                    <path id="bottomTextPath" d="M 15,60 A 45,45 0 0,0 105,60" fill="none" />
                  </defs>

                  <!-- Outer Borders -->
                  <circle cx="60" cy="60" r="56" fill="none" stroke="#1E40AF" stroke-width="2.5" />
                  <circle cx="60" cy="60" r="51" fill="none" stroke="#1E40AF" stroke-width="0.75" stroke-dasharray="3,1.5" />

                  <!-- Inner Core Border -->
                  <circle cx="60" cy="60" r="34" fill="none" stroke="#1E40AF" stroke-width="1.5" />
                  <circle cx="60" cy="60" r="31.5" fill="none" stroke="#1E40AF" stroke-width="0.5" stroke-dasharray="1.5,1" />

                  <!-- Top Text (Clockwise) -->
                  <text fill="#1E40AF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="6.5" font-weight="950" letter-spacing="1.2">
                    <textPath href="#topTextPath" startOffset="50%" text-anchor="middle">
                      KALVEX ENGINEERING LABS
                    </textPath>
                  </text>

                  <!-- Bottom Text (Counter-Clockwise) -->
                  <text fill="#1E40AF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="6.5" font-weight="950" letter-spacing="1.2">
                    <textPath href="#bottomTextPath" startOffset="50%" text-anchor="middle">
                      ★ SECURED & ORIGINAL ★
                    </textPath>
                  </text>

                  <!-- Central Seal Content -->
                  <g transform="translate(60,60)">
                    <!-- Symmetrical star -->
                    <polygon points="0,-8 2.5,-2.5 8.5,-2.5 4,1 5.5,7 0,3.5 -5.5,7 -4,1 -8.5,-2.5 -2.5,-2.5" fill="#1E40AF" />
                    <text y="14" text-anchor="middle" fill="#1E40AF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="6" font-weight="950" letter-spacing="0.5">PASSED</text>
                    <text y="21" text-anchor="middle" fill="#1E40AF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="4.5" font-weight="800">ESTD 2026</text>
                  </g>
                </svg>
              </div>
              <div class="signature-line"></div>
              <div class="signature-label">Authorized Signatory</div>
            </div>
          </div>
  
          <!-- Professional Document Footer -->
          <div class="footer">
            <p style="margin: 0 0 4px 0; color: #0F172A;">Thank you for doing business with Kalvex Labs.</p>
            <p style="margin: 0; font-size: 10px; color: #64748B;">This is a computer-generated invoice and requires no physical signature. Subject to Bangalore jurisdiction.</p>
          </div>
        </div>
  
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
    </html>
  `);
  invoiceWindow.document.close();
};

// Infinitely scrolling shipping alerts marquee
const ShippingMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-slate-50 border border-slate-100 rounded-2xl py-2 relative flex items-center">
      {/* Gradient fade on left/right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
      
      {/* Banner Badge */}
      <div className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ml-4 shrink-0 shadow-sm z-20 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
        Fulfillment Updates
      </div>

      <div className="flex gap-10 whitespace-nowrap text-[9px] font-black uppercase tracking-widest text-slate-500 z-0 select-none overflow-hidden ml-4">
        <div className="flex gap-10 animate-[marquee_35s_linear_infinite] shrink-0">
          <span>⚡ Fast shipping active for your region</span>
          <span>📦 100% Quality-tested & certified electronics components</span>
          <span>🚚 Safe & secure transit with real-time tracking</span>
          <span>🛡️ Kalvex secure purchase guarantee included</span>
        </div>
        <div className="flex gap-10 animate-[marquee_35s_linear_infinite] shrink-0" aria-hidden="true">
          <span>⚡ Fast shipping active for your region</span>
          <span>📦 100% Quality-tested & certified electronics components</span>
          <span>🚚 Safe & secure transit with real-time tracking</span>
          <span>🛡️ Kalvex secure purchase guarantee included</span>
        </div>
      </div>
    </div>
  );
};

// E-commerce horizontal tracking step component
const HorizontalHardwareTracker = ({ status }: { status: string }) => {
  const currentIdx = HW_STEP_ORDER.indexOf(status);
  
  // Calculate percentage progress (cap at 100% for COMPLETED)
  const totalSteps = HW_TRACKING_STEPS.length;
  const progressPercent = currentIdx === -1 ? 0 : (Math.min(currentIdx, totalSteps - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden group">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50/20 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-heading font-black text-lg text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600 animate-bounce" /> Shipment Tracking
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Real-time fulfillment milestone map
          </p>
        </div>
        
        {/* Estimated Delivery / Status Badge */}
        <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Fulfillment Status: <span className="text-blue-600 font-extrabold">{HW_STATUS_LABELS[status] ?? status}</span>
          </span>
        </div>
      </div>

      {/* Progress Map Container */}
      <div className="relative px-4 py-8 sm:px-10 h-32">
        
        {/* Track Line Background (Positive z-index) */}
        <div className="absolute left-8 right-8 sm:left-16 sm:right-16 top-[48px] h-2 bg-slate-100 rounded-full z-0" />
        
        {/* Animated Filled Progress Line (Positive z-index) */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-8 sm:left-16 top-[48px] h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full z-10"
        />

        {/* Animated Moving Car/Truck (Bouncing Animation) */}
        <div className="absolute left-8 right-8 sm:left-16 sm:right-16 top-[36px] z-20 pointer-events-none">
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-blue-600"
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
            >
              <Truck className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>

        {/* Milestones Container (Elevated z-index) */}
        <div className="flex justify-between items-center relative z-30">
          {HW_TRACKING_STEPS.map((step, i) => {
            const stepIdx = HW_STEP_ORDER.indexOf(step.key);
            const isDone = currentIdx >= stepIdx;
            const isCurrent = currentIdx === stepIdx;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center relative w-10 sm:w-16">
                
                {/* Milestone Node */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 cursor-pointer ${
                    isDone 
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 border-white text-white shadow-xl shadow-blue-600/20" 
                      : "bg-white border-slate-100 text-slate-300"
                  } ${isCurrent ? "ring-4 ring-blue-600/20" : ""}`}
                >
                  {isDone && !isCurrent ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </motion.div>

                {/* Pulse Ring for Current Stage */}
                {isCurrent && (
                  <span className="absolute -top-1 w-12 h-12 rounded-full border border-blue-600/50 animate-ping opacity-75 z-0" />
                )}

                {/* Milestone Labels */}
                <div className="text-center mt-3 absolute top-10 w-24 sm:w-32 flex flex-col items-center">
                  <p className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                    isDone ? "text-slate-900 font-extrabold" : "text-slate-400"
                  }`}>
                    {step.label}
                  </p>
                  <p className="hidden sm:block text-[8px] font-bold text-slate-400 mt-0.5 max-w-[90px] leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Spacer for absolute positioned labels */}
      <div className="h-10 sm:h-12" />
    </div>
  );
};

export default function OrderDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await getOrders();
      if (res.orders) {
        const found = res.orders.find((o: any) => o.id === id);
        if (found) setOrder(found);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await uploadFile(formData, order.id, `orders/${order.orderNumber}`);
    if (res.success) {
      const ordersRes = await getOrders();
      if (ordersRes.orders) {
        const found = ordersRes.orders.find((o: any) => o.id === order.id);
        setOrder(found);
      }
      alert("File uploaded successfully!");
    } else {
      alert(res.error || "Upload failed. Please ensure the 'kalvex' storage bucket exists in Supabase.");
    }
    setUploading(false);
  };

  const handleDownloadDeliverables = () => {
    if (!order) return;

    const filesToDownload: { url: string; name: string }[] = [];

    // 1. Check order.deliveryFile
    if (order.deliveryFile) {
      filesToDownload.push({
        url: order.deliveryFile,
        name: order.deliveryFile.split("/").pop() || "deliverable"
      });
    }

    // 2. Check files uploaded by expert/admin (anyone other than the client)
    const deliverables = order.orderFiles?.filter((f: any) => f.uploadedBy !== order.userId) || [];
    deliverables.forEach((f: any) => {
      if (!filesToDownload.some(existing => existing.url === f.fileUrl)) {
        filesToDownload.push({
          url: f.fileUrl,
          name: f.fileName
        });
      }
    });

    // 3. Fallback: if no expert files, use all order files
    if (filesToDownload.length === 0 && order.orderFiles?.length > 0) {
      order.orderFiles.forEach((f: any) => {
        filesToDownload.push({
          url: f.fileUrl,
          name: f.fileName
        });
      });
    }

    if (filesToDownload.length === 0) {
      alert("No deliverable files found for this order yet. If you believe this is an error, please message the expert or support.");
      return;
    }

    // 4. Download all files
    filesToDownload.forEach((file) => {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/dashboard/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const isHardware = isElectronicsOrder(order);
  const st = STATUS_MAP[order.status] ?? STATUS_MAP["RESEARCH_STARTED"];
  const displayStatus = isHardware && HW_STATUS_LABELS[order.status]
    ? HW_STATUS_LABELS[order.status]
    : order.status;

  const { parsed: parsedReqs, remaining: remainingReqs } = parseRequirements(order.requirements);
  const displayTitle = isHardware ? "Electronics Order" : getServiceTitle(order.serviceType, order.requirements);

  const isExpert = session?.user?.role === "WRITER" || session?.user?.role === "DEVELOPER";
  const isLocked = order.status === "PENDING_PAYMENT" && isExpert;

  // Parse shipping address from requirements for hardware orders
  const shippingAddress = isHardware && order.requirements
    ? order.requirements.split("SHIPPING DESTINATION DETAILS:")[1]?.trim() || null
    : null;

  // Parse items from requirements for hardware orders
  const itemsList = isHardware && order.requirements
    ? order.requirements.split("ITEMS PURCHASED:")[1]?.split("SHIPPING DESTINATION")[0]?.trim() || null
    : null;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/orders" className="inline-flex items-center text-sm text-text-secondary hover:text-accent-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-text-muted bg-bg-surface px-2.5 py-1 rounded border border-border">
              {order.orderNumber}
            </span>
            {isHardware && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                <Cpu className="w-3.5 h-3.5" /> Electronics Order
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${st.color}`}>
              <st.icon className="w-3.5 h-3.5" /> {displayStatus}
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight capitalize">{displayTitle.toLowerCase()}</h1>
        </div>

        {order.status === "PENDING_PAYMENT" && !isExpert && (
          <div className="flex flex-col items-end shrink-0">
            <p className="text-sm text-text-secondary mb-2">Total Amount Due</p>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-3xl text-text-primary">₹{order.amount?.toLocaleString()}</span>
              <Button onClick={() => router.push(`/checkout?orderId=${order.id}`)} className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow h-11 px-6 rounded-xl text-sm">
                <CreditCard className="w-4 h-4 mr-2" /> Pay Now
              </Button>
            </div>
          </div>
        )}

        {(order.status === "DELIVERED" || order.status === "COMPLETED") && !isHardware && (
          <Button 
            onClick={handleDownloadDeliverables}
            className="bg-accent-success text-white hover:bg-accent-success/90 shadow-glow h-11 px-6 rounded-xl text-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Download Deliverables
          </Button>
        )}

        {order.status !== "PENDING_PAYMENT" && (
          <Button 
            onClick={() => downloadInvoice(order)} 
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-sm h-11 px-6 rounded-xl text-sm gap-2"
          >
            <Download className="w-4 h-4 text-blue-600" /> Download Invoice
          </Button>
        )}
      </div>

      {isHardware && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 mb-6">
          <ShippingMarquee />
          <HorizontalHardwareTracker status={order.status} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hardware order items */}
          {isHardware ? (
            <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-6">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-accent-primary" /> Order Details
              </h2>

              {/* Items list */}
              {itemsList && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Items Ordered & Learning Resources</p>
                  <div className="space-y-4">
                    {itemsList.split("\n").filter(Boolean).map((line: string, i: number) => {
                      const cleanItem = line.replace(/^- /, "");
                      const resources = getComponentResources(cleanItem);
                      
                      return (
                        <div key={i} className="flex flex-col p-4 bg-bg-surface border border-border rounded-2xl gap-3 hover:border-blue-600/30 transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                              <Box className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-text-primary leading-normal">{cleanItem}</p>
                            </div>
                          </div>
                          
                          {/* Learning/Datasheet Resources Tags */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-border/60">
                            {resources.map((res, idx) => (
                              <a 
                                key={idx} 
                                href={res.href} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-all duration-300 shadow-sm"
                              >
                                <FileText className="w-3 h-3 text-blue-600/70" />
                                {res.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shipping address */}
              {shippingAddress && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Shipping Address
                  </p>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-text-primary whitespace-pre-line">
                    {shippingAddress}
                  </div>
                </div>
              )}

              {/* Order meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-text-muted mb-1">Order Date</p>
                  <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Order Total</p>
                  <p className="text-sm font-semibold font-mono">₹{order.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Status</p>
                  <p className="text-sm font-semibold">{HW_STATUS_LABELS[order.status] ?? order.status}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Invoice Receipt</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => downloadInvoice(order)}
                    className="p-0 h-auto text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Standard service order requirements */
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent-primary" /> Requirements & Files
                </h2>
                {!isLocked && (
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    <Button variant="outline" size="sm" className="h-8 text-xs border-border rounded-lg gap-2">
                      <span>
                        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Paperclip className="w-3 h-3" />}
                        Add Attachment
                      </span>
                    </Button>
                  </label>
                )}
              </div>
              
              <div className="space-y-6">
                {parsedReqs.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {parsedReqs.map((req, i) => (
                      <RequirementCard key={i} label={req.label} value={req.value} index={i} />
                    ))}
                  </div>
                )}
                
                {(!parsedReqs.length || remainingReqs) && (
                  <div className="whitespace-pre-wrap text-sm text-text-secondary bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                    {remainingReqs || order.requirements || "No specific instructions provided."}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
                  {order.orderFiles?.length > 0 ? (
                    order.orderFiles.map((f: any) => (
                      <div key={f.id} className="flex items-center gap-3 p-3 bg-bg-surface border border-border rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-primary truncate">{f.fileName}</p>
                          <p className="text-[10px] text-text-muted">{new Date(f.createdAt).toLocaleDateString()}</p>
                        </div>
                        <a href={f.fileUrl} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-4 text-center text-[10px] text-text-muted italic border border-dashed border-border rounded-xl">
                      No files uploaded yet.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                <div>
                  <p className="text-xs text-text-muted mb-1">Service Type</p>
                  <p className="text-sm font-semibold capitalize">{displayTitle.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Created On</p>
                  <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Deadline</p>
                  <p className="text-sm font-semibold">{order.deadline ? new Date(order.deadline).toLocaleDateString() : "TBD"}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Total Amount</p>
                  <p className="text-sm font-semibold font-mono">₹{order.amount?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quality guarantee — only for service orders */}
          {!isHardware && (
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent-success" /> Quality & Security
              </h2>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-success mt-0.5 shrink-0" />
                  <span>Zero plagiarism guarantee with Turnitin report attached on delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-success mt-0.5 shrink-0" />
                  <span>Identity masking ensures your university/personal details are hidden from the expert.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-success mt-0.5 shrink-0" />
                  <span>Unlimited free revisions for 14 days after initial delivery.</span>
                </li>
              </ul>
            </div>
          )}

          {/* Hardware order guarantees */}
          {isHardware && (
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent-success" /> Purchase Guarantee
              </h2>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-success mt-0.5 shrink-0" />
                  <span>All electronic components are quality-tested before dispatch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-success mt-0.5 shrink-0" />
                  <span>Secure tamper-proof packaging to ensure safe delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-success mt-0.5 shrink-0" />
                  <span>Contact support within 7 days of delivery for any damaged or defective items.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* E-commerce tracker for hardware orders */}
          {isHardware ? (
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-base mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" /> Shipping Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Carrier:</span>
                  <span className="font-bold text-text-primary">Kalvex Logistics</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tracking ID:</span>
                  <span className="font-mono font-bold text-xs text-text-primary">KVX-TRK-{order.orderNumber.split("-")[1] || "120938"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Est. Weight:</span>
                  <span className="font-semibold text-text-primary">0.45 kg</span>
                </div>
                <div className="border-t border-dashed border-border pt-3 mt-2">
                  <p className="text-xs text-text-muted">Estimated Delivery within 3-5 business days.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Academic order tracker */
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-base mb-4">Tracking</h3>
              
              <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-border">
                <div className="relative">
                  <div className="absolute -left-6 w-5 h-5 rounded-full bg-accent-primary text-white flex items-center justify-center border-4 border-bg-card">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary">Order Placed</p>
                  <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="relative">
                  <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-4 border-bg-card ${order.status !== "PENDING_PAYMENT" ? "bg-accent-primary text-white" : "bg-bg-surface border-border"}`}>
                    {order.status !== "PENDING_PAYMENT" && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <p className={`text-sm font-semibold ${order.status !== "PENDING_PAYMENT" ? "text-text-primary" : "text-text-muted"}`}>Payment Received</p>
                </div>
                <div className="relative">
                  <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-4 border-bg-card ${order.status === "DELIVERED" || order.status === "COMPLETED" ? "bg-accent-primary text-white" : "bg-bg-surface border-border"}`}>
                    {(order.status === "DELIVERED" || order.status === "COMPLETED") && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <p className={`text-sm font-semibold ${order.status === "DELIVERED" || order.status === "COMPLETED" ? "text-text-primary" : "text-text-muted"}`}>Delivered</p>
                </div>
              </div>
            </div>
          )}

          {/* Expert Info — only for non-hardware orders */}
          {!isHardware && (
            <div className="bg-bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-accent-secondary/10 text-accent-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-heading font-bold text-xl">EX</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-text-primary">
                {order.maskedAssigneeId ?? "Pending Assignment"}
              </h3>
              <p className="text-xs text-text-secondary mt-1 mb-4">Assigned Expert</p>
              
              <Link href={isLocked ? "#" : "/dashboard/messages"}>
                <Button variant="outline" className="w-full border-border rounded-xl" disabled={!order.maskedAssigneeId || isLocked}>
                  <MessageSquare className="w-4 h-4 mr-2" /> Message {isExpert ? "Client" : "Expert"}
                </Button>
              </Link>
            </div>
          )}

          {/* Support card for hardware orders */}
          {isHardware && (
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-base mb-4">Need Help?</h3>
              <p className="text-sm text-text-secondary mb-4">
                For any queries about your order, reach out to our support team.
              </p>
              <Link href="/dashboard/messages">
                <Button variant="outline" className="w-full border-border rounded-xl gap-2">
                  <MessageSquare className="w-4 h-4" /> Contact Support
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
