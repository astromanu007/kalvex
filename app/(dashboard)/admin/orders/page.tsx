"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Search, Loader2, User, UserCog,
  Calendar, ChevronDown, X, CheckCircle, Clock,
  AlertTriangle, Trash2, ExternalLink, Filter,
  RefreshCw, ArrowUpDown, IndianRupee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  getAllOrders, forceUpdateOrderStatus,
  assignOrderToExpert, setOrderDeadline,
  deleteOrder, getExperts
} from "@/app/actions/admin";
import { toast } from "sonner";
import Link from "next/link";

const ORDER_STATUSES = [
  "PENDING_PAYMENT", "PAYMENT_CONFIRMED", "TOPIC_CONFIRMED",
  "RESEARCH_STARTED", "DRAFT_IN_PROGRESS", "DRAFT_SUBMITTED",
  "UNDER_REVIEW", "REVISION_REQUESTED", "REVISION_SUBMITTED",
  "FINAL_APPROVED", "DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED"
] as const;

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT:    "bg-amber-50 text-amber-600 border-amber-200",
  PAYMENT_CONFIRMED:  "bg-blue-50 text-blue-600 border-blue-200",
  TOPIC_CONFIRMED:    "bg-indigo-50 text-indigo-600 border-indigo-200",
  RESEARCH_STARTED:   "bg-violet-50 text-violet-600 border-violet-200",
  DRAFT_IN_PROGRESS:  "bg-sky-50 text-sky-600 border-sky-200",
  DRAFT_SUBMITTED:    "bg-cyan-50 text-cyan-600 border-cyan-200",
  UNDER_REVIEW:       "bg-orange-50 text-orange-600 border-orange-200",
  REVISION_REQUESTED: "bg-rose-50 text-rose-600 border-rose-200",
  REVISION_SUBMITTED: "bg-pink-50 text-pink-600 border-pink-200",
  FINAL_APPROVED:     "bg-teal-50 text-teal-600 border-teal-200",
  DELIVERED:          "bg-emerald-50 text-emerald-600 border-emerald-200",
  COMPLETED:          "bg-green-50 text-green-600 border-green-200",
  CANCELLED:          "bg-red-50 text-red-600 border-red-200",
  REFUNDED:           "bg-gray-50 text-gray-600 border-gray-200",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setLoading(true);
    const [ordersRes, expertsRes] = await Promise.all([getAllOrders(), getExperts()]);
    if (ordersRes.success) setOrders(ordersRes.orders || []);
    else toast.error("Failed to load orders");
    if (expertsRes.success) setExperts(expertsRes.experts || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const setSav = (id: string, val: boolean) => setSaving(s => ({ ...s, [id]: val }));

  const handleStatusChange = async (orderId: string, status: string) => {
    setSav(orderId, true);
    const res = await forceUpdateOrderStatus(orderId, status as any);
    if (res.success) {
      toast.success(`Status → ${status.replace(/_/g, " ")}`);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } else toast.error("Failed to update status");
    setSav(orderId, false);
  };

  const handleAssign = async (orderId: string, expertId: string) => {
    setSav(orderId + "-assign", true);
    const res = await assignOrderToExpert(orderId, expertId || null);
    if (res.success) {
      toast.success(expertId ? "Expert assigned!" : "Expert removed");
      fetchData();
    } else toast.error("Failed to assign expert");
    setSav(orderId + "-assign", false);
  };

  const handleDeadline = async (orderId: string, deadline: string) => {
    if (!deadline) return;
    setSav(orderId + "-deadline", true);
    const res = await setOrderDeadline(orderId, deadline);
    if (res.success) {
      toast.success("Deadline set!");
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deadline } : o));
    } else toast.error("Failed to set deadline");
    setSav(orderId + "-deadline", false);
  };

  const handleDelete = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Delete order #${orderNumber}? This cannot be undone.`)) return;
    setSav(orderId, true);
    const res = await deleteOrder(orderId);
    if (res.success) {
      toast.success("Order deleted");
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } else toast.error(res.message || "Failed to delete");
    setSav(orderId, false);
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.email || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + (o.amount || 0), 0);
  const confirmedRevenue = orders
    .filter(o => !["PENDING_PAYMENT","CANCELLED","REFUNDED"].includes(o.status))
    .reduce((acc, o) => acc + (o.amount || 0), 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Orders Command Center</h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm mt-1">Assign experts, manage deadlines, change statuses, and track all orders.</p>
        </div>
        <Button onClick={fetchData} className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl px-6 h-12 font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Revenue quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",       value: orders.length,               color: "text-slate-900", bg: "bg-slate-50" },
          { label: "Paid Orders",        value: orders.filter(o => o.status === "PAYMENT_CONFIRMED" || o.status === "COMPLETED").length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Billed",       value: `₹${totalRevenue.toLocaleString()}`,      color: "text-slate-900", bg: "bg-slate-50" },
          { label: "Confirmed Revenue",  value: `₹${confirmedRevenue.toLocaleString()}`,  color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-slate-100`}>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders, clients, service type..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-300 shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-100 rounded-2xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 transition-all shadow-sm cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-100 py-24 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Loading Orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 py-24 flex flex-col items-center gap-4">
            <ShoppingBag className="w-12 h-12 text-slate-100" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Orders Found</p>
          </div>
        ) : (
          filtered.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Order header row */}
              <div
                className="p-5 sm:p-6 flex flex-wrap sm:flex-nowrap items-center gap-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                {/* Order number */}
                <div className="flex-shrink-0">
                  <code className="text-[10px] font-black bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-slate-900 font-mono">
                    #{order.orderNumber}
                  </code>
                </div>

                {/* Client */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-900 text-xs flex-shrink-0">
                    {(order.user?.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{order.user?.name || "Unknown"}</p>
                    <p className="text-[9px] font-bold text-slate-400 truncate">{order.user?.email}</p>
                  </div>
                </div>

                {/* Service */}
                <div className="hidden md:block">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                    {order.serviceType.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Amount */}
                <div className="font-heading font-black text-slate-900 text-lg flex-shrink-0">
                  ₹{order.amount.toLocaleString()}
                </div>

                {/* Status */}
                <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest flex-shrink-0 hidden sm:inline-flex ${STATUS_COLORS[order.status] ?? "bg-amber-50 text-amber-600 border-amber-200"}`}>
                  {order.status.replace(/_/g, " ")}
                </span>

                {/* Assigned */}
                <div className="flex items-center gap-2 flex-shrink-0 hidden lg:flex">
                  {order.assignedTo ? (
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                      {order.assignedTo.name}
                    </span>
                  ) : (
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Unassigned</span>
                  )}
                </div>

                {/* Expand indicator */}
                <ChevronDown className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform ${expandedId === order.id ? "rotate-180" : ""}`} />
              </div>

              {/* Expanded controls */}
              <AnimatePresence>
                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-0 border-t border-slate-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                      {/* Status changer */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Change Status</label>
                        <select
                          defaultValue={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          disabled={saving[order.id]}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
                        >
                          {ORDER_STATUSES.map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                      </div>

                      {/* Assign expert */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Assign Expert</label>
                        <select
                          defaultValue={order.assignedToId || ""}
                          onChange={e => handleAssign(order.id, e.target.value)}
                          disabled={saving[order.id + "-assign"]}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
                        >
                          <option value="">— Unassigned —</option>
                          {experts.map(ex => (
                            <option key={ex.id} value={ex.id}>
                              {ex.name} ({ex.role}) — {ex._count?.assignedOrders ?? 0} orders
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Set deadline */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Set Deadline</label>
                        <input
                          type="date"
                          defaultValue={order.deadline ? order.deadline.split("T")[0] : ""}
                          onBlur={e => handleDeadline(order.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[10px] font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                        />
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(order.id, order.orderNumber)}
                            disabled={saving[order.id]}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all text-[9px] font-black uppercase tracking-widest border border-red-100"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order history */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                      <div className="px-5 sm:px-6 pb-6">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Recent Activity</p>
                        <div className="space-y-2">
                          {order.statusHistory.slice(0, 3).map((h: any) => (
                            <div key={h.id} className="flex items-start gap-3 text-[10px]">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                              <div>
                                <span className="font-black text-slate-900 uppercase tracking-widest">{h.status.replace(/_/g, " ")}</span>
                                {h.note && <span className="text-slate-400 ml-2">— {h.note}</span>}
                                <p className="text-slate-300 text-[9px] mt-0.5">{format(new Date(h.createdAt), "dd MMM yyyy, HH:mm")}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
