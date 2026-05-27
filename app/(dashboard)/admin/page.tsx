"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Users, ShoppingBag, IndianRupee, Briefcase, 
  Search, ExternalLink, Loader2, Shield, TrendingUp, CheckCircle,
  Activity, ArrowUpRight, ArrowDownRight, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminStats, getAllOrders, forceUpdateOrderStatus } from "@/app/actions/admin";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
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
  CANCELLED:  "bg-rose-50 text-rose-600 border-rose-100",
  REFUNDED:   "bg-rose-50 text-rose-600 border-rose-100",
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
    { label: "Total Revenue",   value: `₹${stats?.totalRevenue?.toLocaleString() ?? "0"}`, icon: IndianRupee, color: "bg-blue-600",  trend: "+12.5%", isUp: true },
    { label: "Active Orders",   value: stats?.totalOrders ?? "0",                          icon: ShoppingBag, color: "bg-slate-900", trend: "+8.2%",  isUp: true },
    { label: "Total Clients",   value: stats?.totalUsers ?? "0",                           icon: Users,       color: "bg-blue-600",  trend: "+5.1%",  isUp: true },
    { label: "Expert Network",  value: stats?.activeExperts ?? "0",                        icon: Briefcase,   color: "bg-slate-900", trend: "+2.4%",  isUp: true },
  ];

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20">
            <Activity className="w-3.5 h-3.5 text-blue-400" /> System Status: Online
          </div>
          <h1 className="font-heading font-black text-5xl text-slate-900 tracking-tighter leading-none">Admin <span className="text-blue-600">Dashboard</span></h1>
          <p className="text-sm text-slate-400 font-bold max-w-xl">Real-time statistics, user directory, and order management for the Kalvex platform.</p>
        </div>
        
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Last Updated</p>
            <p className="text-[11px] font-black text-slate-900">May 27, 2026 - 07:36 PM</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-xl shadow-slate-900/5">
            <Globe className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {STAT_CARDS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
              e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
            }}
            className="group relative bg-white/70 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] p-8 transition-all duration-700 hover:shadow-2xl hover:border-blue-600/20 overflow-hidden"
          >
             {/* Spotlight Effect */}
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"
              style={{
                background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(37,99,235,0.05), transparent 80%)`,
              }} />

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-1 group-hover:text-blue-600 transition-colors">{stat.label}</p>
                <p className="font-heading font-black text-3xl text-slate-900 tracking-tighter">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Orders Command Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white/70 backdrop-blur-3xl border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-900/5 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        {/* Table Header */}
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-8 items-start md:items-center relative z-10">
          <div className="space-y-2">
            <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight">All Orders</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{filteredOrders.length} Orders Found</p>
            </div>
          </div>
          <div className="relative w-full md:w-96 group">
            <div className="absolute -inset-[1px] bg-blue-600/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-500 blur-[1px]" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-all duration-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-300 relative z-10 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {["Order ID", "User Details", "Service Type", "Amount", "Status", "Actions"].map(h => (
                  <th key={h} className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-3xl border-4 border-blue-600/10 border-t-blue-600 animate-spin" />
                        <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Loading Orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <Search className="w-16 h-16 text-slate-300" />
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">No Orders Found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-all duration-500 group">
                    <td className="px-10 py-8">
                      <span className="font-mono text-[10px] font-black text-slate-900 bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm group-hover:border-blue-600/30 transition-colors">
                        #{order.orderNumber}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">{order.user?.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{order.user?.maskedId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        {order.serviceType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="font-heading font-black text-slate-900 text-lg">₹{order.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`text-[9px] font-black px-4 py-2 rounded-xl border uppercase tracking-[0.2em] shadow-sm transition-all duration-500 ${
                        STATUS_COLORS[order.status] ?? "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <select
                          className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none focus:border-blue-600 transition-all cursor-pointer shadow-sm hover:shadow-md"
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          value={order.status}
                        >
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                        </select>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-sm hover:shadow-blue-600/20">
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
