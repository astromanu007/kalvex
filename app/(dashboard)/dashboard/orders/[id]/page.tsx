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

  const itemsHTML = order.requirements
    ? order.requirements
        .split("ITEMS PURCHASED:")[1]
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
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${name}</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 500;">1</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">${priceStr}</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">${priceStr}</td>
            </tr>
          `;
        })
        .join("")
    : `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${order.serviceType?.replace(/_/g, " ") || "Services"}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 500;">1</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">₹${order.amount?.toLocaleString()}</td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">₹${order.amount?.toLocaleString()}</td>
      </tr>
    `;

  const shippingDetails = order.requirements?.split("SHIPPING DESTINATION DETAILS:")[1]?.trim() || "N/A";

  invoiceWindow.document.write(`
    <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #0F172A; margin: 40px; }
          .invoice-header { display: flex; justify-content: space-between; border-bottom: 2px solid #F1F5F9; padding-bottom: 20px; }
          .logo { font-size: 26px; font-weight: 900; color: #2563EB; letter-spacing: -0.05em; }
          .invoice-details { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .details-section h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; margin-bottom: 8px; margin-top: 0; }
          .details-section p { font-size: 14px; font-weight: 600; line-height: 1.5; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 40px; }
          th { border-bottom: 2px solid #E2E8F0; padding: 12px; font-size: 10px; text-transform: uppercase; color: #64748B; text-align: left; }
          .text-right { text-align: right; }
          .totals { margin-top: 30px; margin-left: auto; width: 300px; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .totals-row.grand-total { border-top: 2px solid #E2E8F0; padding-top: 12px; margin-top: 8px; font-size: 18px; font-weight: 900; color: #2563EB; }
          .footer { margin-top: 80px; border-top: 1px solid #F1F5F9; padding-top: 20px; text-align: center; font-size: 11px; color: #94A3B8; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div>
            <div class="logo">KALVEX</div>
            <p style="font-size: 12px; color: #64748B; margin: 5px 0 0 0; font-weight: 600;">Kalvex Engineering & Technologies Labs</p>
          </div>
          <div class="text-right">
            <h1 style="font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.03em;">INVOICE</h1>
            <p style="font-size: 14px; font-weight: 700; color: #64748B; margin: 5px 0 0 0;">${order.orderNumber}</p>
          </div>
        </div>

        <div class="invoice-details">
          <div class="details-section">
            <h3>Billed To</h3>
            <p style="font-size: 15px; font-weight: 700;">Manish Student</p>
            <p style="font-weight: 500; color: #64748B;">manish@kalvex.com</p>
          </div>
          <div class="details-section">
            <h3>Invoice Date</h3>
            <p>${new Date(order.createdAt).toLocaleDateString()}</p>
            <h3 style="margin-top: 15px;">Payment Status</h3>
            <p style="color: ${order.status === "PENDING_PAYMENT" ? "#F59E0B" : "#10B981"}; font-weight: 700;">${order.status === "PENDING_PAYMENT" ? "Awaiting Payment" : "Paid & Confirmed"}</p>
          </div>
        </div>

        ${
          order.serviceType === "HARDWARE_COMPONENTS" || order.requirements?.includes("ITEMS PURCHASED:")
            ? `
            <div class="invoice-details" style="margin-top: 20px; display: block;">
              <div class="details-section">
                <h3>Shipping Address</h3>
                <p style="white-space: pre-line; font-weight: 500; color: #334155; font-size: 13px;">${shippingDetails}</p>
              </div>
            </div>
            `
            : ""
        }

        <table>
          <thead>
            <tr>
              <th style="padding: 12px; text-align: left;">Description</th>
              <th class="text-right" style="padding: 12px; width: 80px;">Qty</th>
              <th class="text-right" style="padding: 12px; width: 120px;">Unit Price</th>
              <th class="text-right" style="padding: 12px; width: 120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span style="color: #64748B; font-weight: 500;">Subtotal</span>
            <span style="font-weight: 600;">₹${order.amount?.toLocaleString()}</span>
          </div>
          <div class="totals-row">
            <span style="color: #64748B; font-weight: 500;">CGST (0%)</span>
            <span style="font-weight: 600;">₹0</span>
          </div>
          <div class="totals-row">
            <span style="color: #64748B; font-weight: 500;">SGST (0%)</span>
            <span style="font-weight: 600;">₹0</span>
          </div>
          <div class="totals-row grand-total">
            <span>Total</span>
            <span>₹${order.amount?.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for doing business with Kalvex Engineering & Technologies Labs.</p>
          <p>This is a computer-generated invoice and requires no signature.</p>
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
          <Button className="bg-accent-success text-white hover:bg-accent-success/90 shadow-glow h-11 px-6 rounded-xl text-sm">
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
