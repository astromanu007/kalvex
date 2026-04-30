"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Users, ShoppingBag, IndianRupee, Briefcase, 
  Search, ExternalLink, Loader2, Shield, TrendingUp, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminStats, getAllOrders, forceUpdateOrderStatus } from "@/app/actions/admin";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const ORDER_STATUSES = [
  'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'TOPIC_CONFIRMED', 
  'RESEARCH_STARTED', 'DRAFT_IN_PROGRESS', 'DRAFT_SUBMITTED', 
  'UNDER_REVIEW', 'REVISION_REQUESTED', 'REVISION_SUBMITTED', 
  'FINAL_APPROVED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'
];

const STATUS_COLORS: Record<string, string> = {
  COMPLETED:  "bg-emerald-50 text-emerald-600 border-emerald-100",
  DELIVERED:  "bg-blue-50 text-blue-600 border-blue-100",
  CANCELLED:  "bg-red-50 text-red-600 border-red-100",
  REFUNDED:   "bg-red-50 text-red-600 border-red-100",
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([getAdminStats(), getAllOrders()]);
      if (statsRes.stats) setStats(statsRes.stats);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    const res = await forceUpdateOrderStatus(orderId, status as any);
    if (res.success) {
      const ordersRes = await getAllOrders();
      if (ordersRes.orders) setOrders(ordersRes.orders);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.serviceType.toLowerCase().includes(search.toLowerCase())
  );

  const STAT_CARDS = [
    { label: "Total Revenue",   value: `₹${stats?.totalRevenue?.toLocaleString() ?? "—"}`, icon: IndianRupee, color: "bg-blue-600",  shadow: "shadow-blue-600/20" },
    { label: "Active Orders",   value: stats?.totalOrders ?? "—",                          icon: ShoppingBag, color: "bg-slate-900", shadow: "shadow-slate-900/20" },
    { label: "Total Clients",   value: stats?.totalUsers ?? "—",                           icon: Users,       color: "bg-blue-600",  shadow: "shadow-blue-600/20" },
    { label: "Expert Network",  value: stats?.activeExperts ?? "—",                        icon: Briefcase,   color: "bg-slate-900", shadow: "shadow-slate-900/20" },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em]">
          <Shield className="w-3 h-3" /> Command Authority
        </div>
        <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tighter">Master Control</h1>
        <p className="text-slate-400 font-bold">Platform-wide oversight and institutional order governance.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {STAT_CARDS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bg-white border border-slate-100 rounded-[2rem] p-8 flex items-center gap-6 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-700 group"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-2xl ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-1">{stat.label}</p>
              <p className="font-heading font-black text-2xl text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Orders Command Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/5"
      >
        {/* Table Header */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div className="space-y-1">
            <h2 className="font-heading font-black text-xl text-slate-900 tracking-tight">Commission Registry</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{filteredOrders.length} Active Records</p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Audit by order #, service..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-8 ring-blue-600/5 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Order Node", "Client Identity", "Service Type", "Valuation", "Assigned Expert", "Status", "Protocol"].map(h => (
                  <th key={h} className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Loading Registry...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">No Commissions Found.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-mono text-[11px] font-black text-slate-900 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black text-slate-900">{order.user?.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600">{order.user?.maskedId}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
                        {order.serviceType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-heading font-black text-slate-900 text-sm">₹{order.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      {order.assignedTo ? (
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600">{order.assignedTo.maskedId}</span>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Unassigned</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest ${
                        STATUS_COLORS[order.status] ?? "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <select
                          className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          value={order.status}
                        >
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                        </select>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
