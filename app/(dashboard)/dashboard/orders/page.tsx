"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search, Filter, Clock, CheckCircle, AlertCircle, TrendingUp,
  Download, Eye, Loader2, Package, Truck, PackageCheck, Cpu,
  ShoppingBag, FileText, ChevronRight
} from "lucide-react";
import { getOrders } from "@/app/actions/orders";
import { getServiceTitle, isElectronicsOrder } from "@/lib/utils";
import { motion } from "framer-motion";

// ─── E-commerce / Electronics ─────────────────────────────────────────────────
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

const HW_STATUS_CONFIG: Record<string, { color: string; icon: any; dot: string }> = {
  PENDING_PAYMENT:   { color: "text-amber-700 bg-amber-50 border-amber-200",   icon: Clock,        dot: "bg-amber-400" },
  PAYMENT_CONFIRMED: { color: "text-blue-700 bg-blue-50 border-blue-200",      icon: CheckCircle,  dot: "bg-blue-500" },
  RESEARCH_STARTED:  { color: "text-violet-700 bg-violet-50 border-violet-200", icon: Package,     dot: "bg-violet-500" },
  DRAFT_IN_PROGRESS: { color: "text-sky-700 bg-sky-50 border-sky-200",         icon: Truck,        dot: "bg-sky-500" },
  DELIVERED:         { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: PackageCheck, dot: "bg-emerald-500" },
  COMPLETED:         { color: "text-green-700 bg-green-50 border-green-200",   icon: CheckCircle,  dot: "bg-green-500" },
  CANCELLED:         { color: "text-red-700 bg-red-50 border-red-200",         icon: AlertCircle,  dot: "bg-red-500" },
  REFUNDED:          { color: "text-gray-700 bg-gray-50 border-gray-200",      icon: AlertCircle,  dot: "bg-gray-400" },
};

// ─── Service / Academic ────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  PENDING_PAYMENT:    { color: "text-amber-600 bg-amber-50 border-amber-200",    icon: Clock },
  PAYMENT_CONFIRMED:  { color: "text-blue-600 bg-blue-50 border-blue-200",       icon: CheckCircle },
  TOPIC_CONFIRMED:    { color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: CheckCircle },
  RESEARCH_STARTED:   { color: "text-violet-600 bg-violet-50 border-violet-200", icon: TrendingUp },
  DRAFT_IN_PROGRESS:  { color: "text-sky-600 bg-sky-50 border-sky-200",          icon: Clock },
  DRAFT_SUBMITTED:    { color: "text-cyan-600 bg-cyan-50 border-cyan-200",       icon: CheckCircle },
  UNDER_REVIEW:       { color: "text-orange-600 bg-orange-50 border-orange-200", icon: TrendingUp },
  REVISION_REQUESTED: { color: "text-rose-600 bg-rose-50 border-rose-200",       icon: AlertCircle },
  REVISION_SUBMITTED: { color: "text-pink-600 bg-pink-50 border-pink-200",       icon: CheckCircle },
  FINAL_APPROVED:     { color: "text-teal-600 bg-teal-50 border-teal-200",       icon: CheckCircle },
  DELIVERED:          { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle },
  COMPLETED:          { color: "text-green-600 bg-green-50 border-green-200",    icon: CheckCircle },
  CANCELLED:          { color: "text-red-600 bg-red-50 border-red-200",          icon: AlertCircle },
  REFUNDED:           { color: "text-gray-600 bg-gray-50 border-gray-200",       icon: AlertCircle },
};

// Shipping steps for electronics mini-tracker
const HW_STEPS = ["PENDING_PAYMENT", "PAYMENT_CONFIRMED", "RESEARCH_STARTED", "DRAFT_IN_PROGRESS", "DELIVERED"];

function HardwareOrderCard({ order }: { order: any }) {
  const hw = HW_STATUS_CONFIG[order.status] ?? HW_STATUS_CONFIG["PAYMENT_CONFIRMED"];
  const label = HW_STATUS_LABELS[order.status] ?? order.status.replace(/_/g, " ");
  const currentStep = HW_STEPS.indexOf(order.status);
  const isPending = order.status === "PENDING_PAYMENT";

  // Parse items list from requirements
  const itemsList = order.requirements
    ? order.requirements.split("ITEMS PURCHASED:")[1]?.split("SHIPPING DESTINATION")[0]?.trim()
    : null;
  const itemLines: string[] = itemsList
    ? itemsList.split("\n").filter(Boolean).slice(0, 3)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-2xl overflow-hidden transition-all hover:shadow-md ${
        isPending
          ? "border-amber-200 bg-amber-50/30"
          : "border-blue-100 bg-white hover:border-blue-300"
      }`}
    >
      {/* Top row */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isPending ? "bg-amber-100 text-amber-600" : "bg-blue-50 text-blue-600"
        }`}>
          <ShoppingBag className="w-5 h-5" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-mono text-text-muted bg-white border border-border px-2 py-0.5 rounded">
              {order.orderNumber}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              <Cpu className="w-3 h-3" /> Electronics Store
            </span>
          </div>

          {/* Items preview */}
          {itemLines.length > 0 ? (
            <div className="space-y-0.5">
              {itemLines.map((line: string, i: number) => (
                <p key={i} className="text-sm font-semibold text-text-primary truncate">
                  {line.replace(/^- /, "").split(" — ")[0]}
                </p>
              ))}
              {itemsList && itemsList.split("\n").filter(Boolean).length > 3 && (
                <p className="text-xs text-text-muted">+ more items</p>
              )}
            </div>
          ) : (
            <p className="text-sm font-semibold text-text-primary">Electronics Purchase</p>
          )}

          <p className="text-xs text-text-muted mt-1">
            Ordered on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Amount + status + button */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
          <p className="font-mono font-bold text-lg text-text-primary">₹{order.amount?.toLocaleString()}</p>
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full border ${hw.color}`}>
            <hw.icon className="w-3 h-3" /> {label}
          </span>
          <div className="flex gap-2">
            {isPending ? (
              <Link href={`/checkout?orderId=${order.id}`}>
                <Button size="sm" className="h-8 px-3 text-xs rounded-lg bg-accent-primary text-white gap-1.5">
                  Pay Now
                </Button>
              </Link>
            ) : (
              <Link href={`/dashboard/orders/${order.id}`}>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 gap-1.5">
                  <Truck className="w-3 h-3" /> Track Order
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mini shipping progress — only if payment done */}
      {!isPending && (
        <div className="px-5 pb-4 border-t border-blue-50 pt-3">
          <div className="flex items-center gap-0">
            {HW_STEPS.map((step, i) => {
              const done = currentStep >= i;
              return (
                <div key={step} className="flex items-center gap-0 flex-1 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border-2 transition-all ${
                    done ? `${hw.dot} border-transparent` : "bg-white border-slate-300"
                  }`} />
                  {i < HW_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 ${done && currentStep > i ? "bg-blue-500" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            {["Placed", "Confirmed", "Processing", "Shipped", "Delivered"].map((lbl, i) => (
              <span key={i} className={`text-[8px] font-bold uppercase tracking-wider ${currentStep >= i ? "text-blue-600" : "text-slate-300"}`}>
                {lbl}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
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

  // Split using the robust isElectronicsOrder check
  const hardwareOrders = orders.filter(o => isElectronicsOrder(o));
  const serviceOrders  = orders.filter(o => !isElectronicsOrder(o));

  const tabs = ["All", "PENDING_PAYMENT", "RESEARCH_STARTED", "DELIVERED", "COMPLETED"];

  const filteredService = serviceOrders.filter(o => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesSearch =
      o.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const filteredHardware = hardwareOrders.filter(o =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    (o.requirements || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text-primary">My Orders</h1>
          <p className="text-text-secondary text-sm mt-1">
            {serviceOrders.length} service order{serviceOrders.length !== 1 ? "s" : ""}
            {hardwareOrders.length > 0 && ` · ${hardwareOrders.length} store order${hardwareOrders.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/electronics">
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 h-10 px-4 rounded-xl gap-2">
              <ShoppingBag className="w-4 h-4" /> Electronics Store
            </Button>
          </Link>
          <Link href="/services">
            <Button className="bg-accent-primary hover:bg-accent-primary/90 text-white h-10 px-5 rounded-xl gap-2">
              <FileText className="w-4 h-4" /> New Service Order
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or items..."
            className="w-full bg-bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
          />
        </div>
        <Button variant="outline" className="border-border h-10 px-4 rounded-xl flex items-center gap-2 flex-shrink-0">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      {loading ? (
        <div className="bg-bg-card border border-border rounded-2xl p-12 flex justify-center text-accent-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Electronics Store Section ── */}
          {hardwareOrders.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-base text-text-primary">
                      Electronics Store Orders
                    </h2>
                    <p className="text-xs text-text-muted">
                      {hardwareOrders.length} purchase{hardwareOrders.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <Link href="/electronics" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  Browse Store <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {filteredHardware.length === 0 ? (
                <div className="bg-bg-card border border-blue-100 rounded-2xl p-8 text-center">
                  <p className="text-sm text-text-muted">No electronics orders match your search.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHardware.map(order => (
                    <HardwareOrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Service Orders Section ── */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                <FileText className="w-4 h-4 text-accent-primary" />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-base text-text-primary">Service Orders</h2>
                <p className="text-xs text-text-muted">Academic projects, research, patents & more</p>
              </div>
            </div>

            {/* Status tabs */}
            <div className="bg-bg-card border border-border rounded-2xl p-1 flex gap-1 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === tab
                      ? "bg-accent-primary text-white shadow-glow"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                  }`}
                >
                  {tab === "All" ? "All Services" : tab.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {filteredService.length === 0 ? (
              <div className="bg-bg-card border border-border rounded-2xl p-12 text-center">
                <FileText className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-text-muted mb-4">
                  {serviceOrders.length === 0
                    ? "You haven't placed any service orders yet."
                    : "No service orders match your search or filter."}
                </p>
                <Link href="/services">
                  <Button className="bg-accent-primary text-white rounded-xl">Browse Services</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredService.map(order => {
                  const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["RESEARCH_STARTED"];
                  const title = getServiceTitle(order.serviceType, order.requirements);
                  const progress = order.status === "COMPLETED" || order.status === "DELIVERED" ? 100 : 50;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-bg-card border border-border rounded-2xl p-5 hover:border-accent-primary/30 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] font-medium text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">
                              {order.serviceType?.replace(/_/g, " ") ?? "Service"}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-text-primary mb-2 line-clamp-1">{title}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                            <span>Placed: <span className="text-text-primary">{new Date(order.createdAt).toLocaleDateString()}</span></span>
                            {order.deadline && (
                              <span>Deadline: <span className="text-text-primary">{new Date(order.deadline).toLocaleDateString()}</span></span>
                            )}
                            <span>Expert: <span className="font-mono text-accent-primary">{order.maskedAssigneeId ?? "Unassigned"}</span></span>
                          </div>

                          {/* Progress bar */}
                          {progress < 100 && (
                            <div className="mt-3 flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                                <div
                                  className="h-1.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-accent-primary">{progress}%</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-row justify-between items-center lg:flex-col lg:items-end gap-3 flex-shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t border-dashed border-border lg:border-t-0 mt-2 lg:mt-0">
                          <div className="flex items-center lg:flex-col lg:items-end gap-2.5">
                            <p className="font-mono font-bold text-base text-text-primary">₹{order.amount?.toLocaleString()}</p>
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${st.color}`}>
                              <st.icon className="w-3 h-3" /> {order.status.replace(/_/g, " ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg border-border gap-1.5">
                                <Eye className="w-3 h-3" /> View
                              </Button>
                            </Link>
                            {(order.status === "DELIVERED" || order.status === "COMPLETED") && (
                              <Link href={`/dashboard/orders/${order.id}`}>
                                <Button size="sm" className="h-8 px-3 text-xs rounded-lg bg-accent-success/10 text-accent-success hover:bg-accent-success/20 gap-1.5">
                                  <Download className="w-3 h-3" /> Files
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
