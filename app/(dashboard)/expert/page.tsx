"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText, IndianRupee, Clock, CheckCircle, AlertCircle,
  TrendingUp, Download, Eye, Upload, MessageSquare, Search, Filter, Loader2, Sparkles, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders, getAvailableOrders, acceptOrder, rejectOrder } from "@/app/actions/orders";
import { getWalletDetails } from "@/app/actions/user";
import { getServiceTitle } from "@/lib/utils";
import { motion } from "framer-motion";
import CursorGlowCard from "@/components/ui/CursorGlowCard";
import { useLanguage } from "@/components/context/LanguageContext";

export default function ExpertDashboard() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [marketplace, setMarketplace] = useState<any[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "marketplace">("tasks");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [assignedRes, availableRes, walletRes] = await Promise.all([
        getOrders(),
        getAvailableOrders(),
        getWalletDetails()
      ]);
      
      if (assignedRes.orders) setActiveTasks(assignedRes.orders);
      if (availableRes.orders) setMarketplace(availableRes.orders);
      if (walletRes && walletRes.success) setEarnings(walletRes.clearedBalance ?? 0);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAccept = async (orderId: string) => {
    const res = await acceptOrder(orderId);
    if (res.success) {
      const [assignedRes, availableRes] = await Promise.all([
        getOrders(),
        getAvailableOrders()
      ]);
      if (assignedRes.orders) setActiveTasks(assignedRes.orders);
      if (availableRes.orders) setMarketplace(availableRes.orders);
    } else {
      alert(res.error || "Failed to accept order");
    }
  };

  const handleReject = async (orderId: string) => {
    const res = await rejectOrder(orderId);
    if (res.success) {
      const [assignedRes, availableRes] = await Promise.all([
        getOrders(),
        getAvailableOrders()
      ]);
      if (assignedRes.orders) setActiveTasks(assignedRes.orders);
      if (availableRes.orders) setMarketplace(availableRes.orders);
    } else {
      alert(res.error || "Failed to reject order");
    }
  };

  const MARQUEE_ITEMS = [
    { label: "Keep a 4.8+ Star Rating to unlock 90% Senior Expert Payouts", icon: "🔥" },
    { label: "Embedded C & Next.js projects have 1.5x payout multipliers active this week", icon: "🚀" },
    { label: "Developer support is active 24/7 — reach out for code & hardware help", icon: "💬" },
    { label: "Verify pinouts and schematic footprints before final hardware submission", icon: "🛠️" },
    { label: "All patent & IPR write-ups require strict NDA confidentiality compliance", icon: "🔒" },
    { label: "Protip: Update your specializations in 'My Profile' to receive targeted invitations", icon: "💡" },
    { label: "Earnings processed directly to your wallet within 48h of project completion", icon: "⚡" },
    { label: "Student clients appreciate clean comments and setup readme documentation", icon: "🎓" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-550" />
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-650 animate-pulse" />
            {t(session?.user?.role ? `${session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1).toLowerCase()} Dashboard` : "Expert Dashboard")}
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
            {t("Identity")}: <span className="font-mono text-indigo-650">{session?.user?.maskedId ?? "KV-E0000"}</span>
            &nbsp;·&nbsp;
            {t("Rating")}: <span className="font-bold text-amber-500">4.8 ★</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("Active Tasks"), value: loading ? "-" : activeTasks.length.toString(), sub: t("In progress"), icon: FileText, color: "text-blue-600 bg-blue-50 border border-blue-100", glow: "blue" as const },
          { label: t("Marketplace"), value: loading ? "-" : marketplace.length.toString(), sub: t("Available to pick"), icon: TrendingUp, color: "text-amber-600 bg-amber-50 border border-amber-100", glow: "amber" as const },
          { label: t("Earnings"), value: loading ? "₹-" : `₹${earnings.toLocaleString()}`, sub: t("Cleared balance"), icon: IndianRupee, color: "text-emerald-600 bg-emerald-50 border border-emerald-100", glow: "emerald" as const },
          { label: t("Success Rate"), value: "100%", sub: t("High quality"), icon: CheckCircle, color: "text-purple-600 bg-purple-50 border border-purple-100", glow: "purple" as const },
        ].map((stat) => (
          <CursorGlowCard key={stat.label} glowColor={stat.glow} className="min-h-[140px]" innerClassName="justify-between p-6">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center border shrink-0`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                {stat.sub}
              </span>
            </div>
            <div>
              <p className="font-heading font-black text-2xl text-slate-800 leading-none">{stat.value}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          </CursorGlowCard>
        ))}
      </div>

      {/* Services Showcase Marquee with vibrant colorful developer alerts */}
      <div className="relative flex overflow-x-hidden border border-slate-850 rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-4.5 shadow-xl select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {MARQUEE_ITEMS.map((item, idx) => (
            <span key={idx} className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <span className="text-xs">{item.icon}</span>
              {item.label}
              <span className="w-2 h-2 rounded-full bg-indigo-500 opacity-60 mx-4" />
            </span>
          ))}
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 animate-marquee2 whitespace-nowrap flex items-center gap-8">
          {MARQUEE_ITEMS.map((item, idx) => (
            <span key={idx} className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <span className="text-xs">{item.icon}</span>
              {item.label}
              <span className="w-2 h-2 rounded-full bg-indigo-500 opacity-60 mx-4" />
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-150 rounded-2xl w-fit shrink-0">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === "tasks" ? "bg-white text-indigo-650 shadow-sm border border-slate-150" : "text-slate-400 hover:text-slate-700"}`}
            >
              Assigned Tasks ({activeTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === "marketplace" ? "bg-white text-indigo-650 shadow-sm border border-slate-150" : "text-slate-400 hover:text-slate-700"}`}
            >
              Marketplace ({marketplace.length})
            </button>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
            <h2 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">
              {activeTab === "tasks" ? "Current Assignments" : "Available Marketplace"}
            </h2>
          </div>
          
          <div className="space-y-4 overflow-y-auto max-h-[550px] pr-2 scrollbar-thin">
            {loading ? (
              <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-100"><Loader2 className="w-8 h-8 text-indigo-650 animate-spin" /></div>
            ) : activeTab === "tasks" ? (
              activeTasks.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs bg-white rounded-3xl border border-slate-100">No active assignments. Check the marketplace!</div>
              ) : (
                activeTasks.map((order, idx) => {
                  const colors: Array<"blue" | "indigo" | "emerald" | "purple" | "pink" | "rose" | "amber"> = ["blue", "indigo", "emerald", "purple", "pink", "rose", "amber"];
                  const cardColor = colors[idx % colors.length];
                  return (
                    <CursorGlowCard key={order.id} glowColor={cardColor} className="w-full">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[8px] font-mono font-black text-indigo-650 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">{order.orderNumber}</span>
                            <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100`}>
                              {order.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm mb-1.5 capitalize">{getServiceTitle(order.serviceType, order.requirements)}</h3>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Client: <span className="font-mono text-indigo-650">{order.maskedClientId}</span> &middot; Deadline: <span className="font-semibold text-slate-600">{order.deadline ? new Date(order.deadline).toLocaleDateString() : "TBD"}</span></p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Earning (85%)</p>
                          <p className="font-mono font-black text-emerald-650 text-lg leading-none">₹{Math.floor(order.amount * 0.85)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-1.5 bg-slate-100 border border-slate-200/40 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-650 rounded-full transition-all" style={{ width: `50%` }} />
                        </div>
                        <span className="text-[8px] font-mono font-bold text-slate-400">50%</span>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-between pt-3 border-t border-dashed border-slate-100">
                        <div className="flex gap-2">
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase border-slate-150 hover:border-slate-350 rounded-xl gap-1.5">
                              <Eye className="w-3 h-3" /> View Details
                            </Button>
                          </Link>
                          <Link href="/dashboard/messages">
                            <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase border-slate-150 hover:border-slate-350 rounded-xl gap-1.5">
                              <MessageSquare className="w-3 h-3" /> Chat
                            </Button>
                          </Link>
                        </div>
                        {order.status === "PAYMENT_CONFIRMED" ? (
                          <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                            <Button
                              onClick={() => handleAccept(order.id)}
                              size="sm"
                              className="h-8 text-[9px] font-black uppercase bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl px-4 flex-1 sm:flex-initial"
                            >
                              Accept Assignment
                            </Button>
                            <Button
                              onClick={() => handleReject(order.id)}
                              size="sm"
                              className="h-8 text-[9px] font-black uppercase bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 flex-1 sm:flex-initial"
                            >
                              Reject Assignment
                            </Button>
                          </div>
                        ) : (
                          <Link href={`/dashboard/orders/${order.id}`} className="w-full sm:w-auto mt-2 sm:mt-0">
                            <Button size="sm" className="h-8 text-[9px] font-black uppercase bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 w-full flex items-center justify-center">
                              <Upload className="w-3 h-3" /> Submit Draft
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CursorGlowCard>
                  );
                })
              )
            ) : (
              marketplace.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs bg-white rounded-3xl border border-slate-100">No available orders at the moment.</div>
              ) : (
                marketplace.map((order, idx) => {
                  const colors: Array<"blue" | "indigo" | "emerald" | "purple" | "pink" | "rose" | "amber"> = ["blue", "indigo", "emerald", "purple", "pink", "rose", "amber"];
                  const cardColor = colors[idx % colors.length];
                  return (
                    <CursorGlowCard key={order.id} glowColor={cardColor} className="w-full">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[8px] font-mono font-black text-indigo-650 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">{order.orderNumber}</span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm mb-1 capitalize">{getServiceTitle(order.serviceType, order.requirements)}</h3>
                          <p className="text-xs text-slate-450 font-semibold leading-relaxed line-clamp-1 max-w-md">{order.requirements}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase mt-2">Deadline: <span className="text-slate-800">{order.deadline ? new Date(order.deadline).toLocaleDateString() : "TBD"}</span></p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-start sm:flex-col sm:items-end gap-3 pt-3 sm:pt-0 border-t border-dashed border-slate-100 sm:border-t-0 mt-3 sm:mt-0 w-full sm:w-auto shrink-0">
                          <div className="text-left sm:text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Your Earning (85%)</p>
                            <p className="font-mono font-black text-emerald-650 text-lg leading-none">₹{Math.floor(order.amount * 0.85)}</p>
                          </div>
                          <Button onClick={() => handleAccept(order.id)} size="sm" className="bg-slate-950 hover:bg-indigo-650 text-white rounded-xl px-5 h-9 text-[9px] font-black uppercase tracking-wider">Accept Job</Button>
                        </div>
                      </div>
                    </CursorGlowCard>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Recent Completions */}
          <CursorGlowCard glowColor="emerald" className="flex-1">
            <h2 className="font-heading font-black text-xs uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <CheckCircle className="w-4 h-4 text-emerald-500 animate-pulse" /> Recent Completions
            </h2>
            <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-wider text-[10px] border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center gap-2">
              <span className="text-2xl animate-bounce">🏆</span>
              <p className="font-black">No completions recorded</p>
              <p className="text-[8px] opacity-75">Your finished projects will show up here.</p>
            </div>
          </CursorGlowCard>

          {/* Level Progress */}
          <CursorGlowCard glowColor="purple" className="bg-slate-950 text-white" innerClassName="bg-slate-950 text-white justify-between">
            <div className="absolute -right-4 -bottom-4 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-4 -top-4 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-md border border-blue-500/50 px-3 py-1.5 rounded-full">
                  Level 1: Expert
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">Earning Potential</h3>
                <p className="text-[10px] text-slate-350 leading-relaxed">
                  Complete <span className="font-bold text-white">5 more orders</span> with 5-star ratings to unlock the <span className="text-amber-400 font-bold">Senior Expert</span> tier for a <span className="text-emerald-450 font-bold">90% payout cut</span>!
                </p>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                  <span>Progress to Senior</span>
                  <span className="text-slate-200">0 / 5 Tasks</span>
                </div>
                <div className="h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-550" style={{ width: "10%" }} />
                </div>
              </div>
            </div>
          </CursorGlowCard>
        </div>
      </div>
    </div>
  );
}

