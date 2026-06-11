"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShoppingBag, FileText, MessageSquare, Wallet,
  ArrowRight, TrendingUp, Clock, CheckCircle, AlertCircle, Plus, Loader2,
  Package, Truck, PackageCheck, Cpu, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/app/actions/orders";
import { getServiceTitle, isElectronicsOrder } from "@/lib/utils";

const SERVICE_STATUS_MAP: Record<string, { color: string; icon: any }> = {
  PENDING_PAYMENT:    { color: "text-amber-600 bg-amber-50",   icon: Clock },
  PAYMENT_CONFIRMED:  { color: "text-blue-600 bg-blue-50",     icon: CheckCircle },
  RESEARCH_STARTED:   { color: "text-violet-600 bg-violet-50", icon: TrendingUp },
  DRAFT_IN_PROGRESS:  { color: "text-sky-600 bg-sky-50",       icon: Clock },
  DRAFT_SUBMITTED:    { color: "text-cyan-600 bg-cyan-50",     icon: CheckCircle },
  UNDER_REVIEW:       { color: "text-orange-600 bg-orange-50", icon: TrendingUp },
  REVISION_REQUESTED: { color: "text-rose-600 bg-rose-50",     icon: AlertCircle },
  FINAL_APPROVED:     { color: "text-teal-600 bg-teal-50",     icon: CheckCircle },
  DELIVERED:          { color: "text-emerald-600 bg-emerald-50", icon: CheckCircle },
  COMPLETED:          { color: "text-green-600 bg-green-50",   icon: CheckCircle },
  CANCELLED:          { color: "text-red-600 bg-red-50",       icon: AlertCircle },
  REFUNDED:           { color: "text-gray-600 bg-gray-50",     icon: AlertCircle },
};

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

const HW_STATUS_MAP: Record<string, { color: string; icon: any }> = {
  PENDING_PAYMENT:   { color: "text-amber-600 bg-amber-50",   icon: Clock },
  PAYMENT_CONFIRMED: { color: "text-blue-600 bg-blue-50",     icon: CheckCircle },
  RESEARCH_STARTED:  { color: "text-violet-600 bg-violet-50", icon: Package },
  DRAFT_IN_PROGRESS: { color: "text-sky-600 bg-sky-50",       icon: Truck },
  DELIVERED:         { color: "text-emerald-600 bg-emerald-50", icon: PackageCheck },
  COMPLETED:         { color: "text-green-600 bg-green-50",   icon: CheckCircle },
  CANCELLED:         { color: "text-red-600 bg-red-50",       icon: AlertCircle },
  REFUNDED:          { color: "text-gray-600 bg-gray-50",     icon: AlertCircle },
};

export default function DashboardHome() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await getOrders();
      if (res.orders) setOrders(res.orders);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const activeOrdersCount = orders
    .filter(o => o.serviceType !== "HARDWARE_COMPONENTS") // active service orders only
    .filter(o => !["DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED"].includes(o.status)).length;

  const hwPendingCount = orders
    .filter(o => o.serviceType === "HARDWARE_COMPONENTS")
    .filter(o => !["DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED"].includes(o.status)).length;

  // Show 3 most recent orders (mixed, but displayed differently)
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Account ID: <span className="font-mono text-accent-primary">{session?.user?.maskedId ?? "KV-0000"}</span>
            &nbsp;·&nbsp;
            Role: <span className="font-semibold capitalize">{session?.user?.role?.toLowerCase() ?? "user"}</span>
          </p>
        </div>
        <Link href="/services">
          <Button className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow h-10 rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> New Order
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",       value: loading ? "-" : orders.length.toString(),                 sub: "All time",                   icon: ShoppingBag,   color: "text-accent-primary",   bg: "bg-accent-primary/10" },
          { label: "Active Services",    value: loading ? "-" : activeOrdersCount.toString(),             sub: "Research & academic work",   icon: FileText,      color: "text-accent-warning",   bg: "bg-accent-warning/10" },
          { label: "Store Orders",       value: loading ? "-" : hwPendingCount.toString(),                sub: "Electronics pending",        icon: Package,       color: "text-blue-600",         bg: "bg-blue-50" },
          { label: "Wallet Balance",     value: "₹0",                                                    sub: "Available credits",          icon: Wallet,        color: "text-accent-success",   bg: "bg-accent-success/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-accent-primary/30 transition-colors">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="font-heading font-bold text-2xl text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-text-muted mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading font-semibold text-lg">Recent Activity</h2>
          <Link href="/dashboard/orders" className="text-sm text-accent-primary hover:underline flex items-center">
            View all <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-12 flex justify-center text-accent-primary">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center text-text-muted">No recent orders.</div>
          ) : (
            recentOrders.map((order) => {
              const isHardware = order.serviceType === "HARDWARE_COMPONENTS";

              if (isHardware) {
                // Electronics order row
                const st = HW_STATUS_MAP[order.status] ?? HW_STATUS_MAP["PAYMENT_CONFIRMED"];
                const label = HW_STATUS_LABELS[order.status] ?? order.status;

                // Parse first item from requirements
                const itemsList = order.requirements
                  ? order.requirements.split("ITEMS PURCHASED:")[1]?.split("SHIPPING DESTINATION")[0]?.trim()
                  : null;
                const firstItem = itemsList
                  ? itemsList.split("\n").filter(Boolean)[0]?.replace(/^- /, "").split(" — ")[0]
                  : "Electronics Purchase";

                return (
                  <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-blue-50/30 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">{order.orderNumber}</span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          <Cpu className="w-2.5 h-2.5" /> Electronics Store
                        </span>
                      </div>
                      <p className="text-sm font-medium text-text-primary truncate">{firstItem}</p>
                      <p className="text-xs text-text-muted mt-0.5">Ordered {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-4 flex-shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t border-dashed border-border sm:border-t-0 mt-2 sm:mt-0">
                      <div className="flex items-center gap-3">
                        <p className="font-mono font-semibold text-text-primary">₹{order.amount?.toLocaleString()}</p>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                          <st.icon className="w-3 h-3" /> {label}
                        </span>
                      </div>
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs border border-blue-100 rounded-lg text-blue-600">
                          <Truck className="w-3 h-3 mr-1" /> Track
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              } else {
                // Service order row
                const st = SERVICE_STATUS_MAP[order.status] ?? SERVICE_STATUS_MAP["RESEARCH_STARTED"];
                const title = getServiceTitle(order.serviceType, order.requirements);

                return (
                  <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-bg-surface/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">{order.orderNumber}</span>
                        <span className="text-[10px] font-medium text-text-muted">{order.serviceType?.replace(/_/g, " ")}</span>
                      </div>
                      <p className="text-sm font-medium text-text-primary truncate">{title}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Placed {new Date(order.createdAt).toLocaleDateString()}
                        {order.maskedAssigneeId && <span> · Specialist: <span className="font-mono text-accent-primary">{order.maskedAssigneeId}</span></span>}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-4 flex-shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t border-dashed border-border sm:border-t-0 mt-2 sm:mt-0">
                      <div className="flex items-center gap-3">
                        <p className="font-mono font-semibold text-text-primary">₹{order.amount?.toLocaleString()}</p>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                          <st.icon className="w-3 h-3" /> {order.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs border border-border rounded-lg">View</Button>
                      </Link>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="font-heading font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Track Orders",     href: "/dashboard/orders",  icon: ShoppingBag, color: "text-accent-primary bg-accent-primary/10" },
            { label: "New Request",      href: "/services",           icon: Plus,        color: "text-accent-success bg-accent-success/10" },
            { label: "Support Chat",     href: "/dashboard/messages", icon: MessageSquare, color: "text-accent-secondary bg-accent-secondary/10" },
            { label: "AI Patent Drafter", href: "/patent-drafter",   icon: FileText,    color: "text-accent-warning bg-accent-warning/10" },
          ].map((qa) => (
            <Link key={qa.label} href={qa.href}>
              <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center gap-3 hover:border-accent-primary/40 hover:shadow-glow hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className={`w-10 h-10 rounded-lg ${qa.color} flex items-center justify-center`}>
                  <qa.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-text-primary">{qa.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Profile Completion Banner */}
      <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-base mb-1">Complete your profile to unlock full access</h3>
          <p className="text-text-secondary text-sm mb-3">Add your university details, upload a government ID, and set your notification preferences.</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-bg-surface rounded-full overflow-hidden">
              <div className="h-2 w-[60%] bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full" />
            </div>
            <span className="text-xs font-mono font-medium text-accent-primary">60%</span>
          </div>
        </div>
        <Link href="/dashboard/profile" className="flex-shrink-0">
          <Button className="bg-accent-primary text-white hover:bg-accent-primary/90 h-10 px-6 rounded-xl w-full">
            Complete Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
