"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShoppingBag, FileText, MessageSquare, Wallet,
  ArrowRight, TrendingUp, Clock, CheckCircle, AlertCircle, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const RECENT_ORDERS = [
  { id: "ORD-001", title: "PhD Thesis – Smart Grid Optimization", type: "Academic", status: "In Progress", date: "25 Apr 2026", amount: 12500, masked: "KV-E2341" },
  { id: "ORD-002", title: "Raspberry Pi 5 4GB × 2 units", type: "Hardware", status: "Delivered", date: "18 Apr 2026", amount: 13000, masked: "—" },
  { id: "ORD-003", title: "Design Patent – Portable Water Purifier", type: "Patent", status: "Under Review", date: "10 Apr 2026", amount: 8500, masked: "KV-C1892" },
];

const STATUS_MAP: Record<string, { color: string; icon: React.ElementType }> = {
  "In Progress": { color: "text-accent-warning bg-accent-warning/10", icon: Clock },
  "Delivered":   { color: "text-accent-success bg-accent-success/10", icon: CheckCircle },
  "Under Review":{ color: "text-accent-primary bg-accent-primary/10", icon: TrendingUp },
  "Disputed":    { color: "text-accent-danger bg-accent-danger/10", icon: AlertCircle },
};

export default function DashboardHome() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Identity: <span className="font-mono text-accent-primary">{session?.user?.maskedId ?? "KV-0000"}</span>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: "7", sub: "+2 this month", icon: ShoppingBag, color: "text-accent-primary", bg: "bg-accent-primary/10" },
          { label: "Active Projects", value: "2", sub: "In progress", icon: FileText, color: "text-accent-warning", bg: "bg-accent-warning/10" },
          { label: "Wallet Balance", value: "₹650", sub: "Available credits", icon: Wallet, color: "text-accent-success", bg: "bg-accent-success/10" },
          { label: "Unread Messages", value: "3", sub: "From experts", icon: MessageSquare, color: "text-accent-secondary", bg: "bg-accent-secondary/10" },
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
          <h2 className="font-heading font-semibold text-lg">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-accent-primary hover:underline flex items-center">
            View all <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="divide-y divide-border">
          {RECENT_ORDERS.map((order) => {
            const st = STATUS_MAP[order.status] ?? STATUS_MAP["In Progress"];
            return (
              <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-bg-surface/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">{order.id}</span>
                    <span className="text-[10px] font-medium text-text-muted">{order.type}</span>
                  </div>
                  <p className="text-sm font-medium text-text-primary truncate">{order.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">Placed {order.date} · Expert: <span className="font-mono text-accent-primary">{order.masked}</span></p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <p className="font-mono font-semibold text-text-primary">₹{order.amount.toLocaleString()}</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                    <st.icon className="w-3 h-3" /> {order.status}
                  </span>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs border border-border rounded-lg">View</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="font-heading font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Track Order", href: "/dashboard/orders", icon: ShoppingBag, color: "text-accent-primary bg-accent-primary/10" },
            { label: "New Request", href: "/services", icon: Plus, color: "text-accent-success bg-accent-success/10" },
            { label: "Chat with Expert", href: "/dashboard/messages", icon: MessageSquare, color: "text-accent-secondary bg-accent-secondary/10" },
            { label: "AI Patent Drafter", href: "/patent-drafter", icon: FileText, color: "text-accent-warning bg-accent-warning/10" },
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
              <div className="h-2 w-[60%] bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"></div>
            </div>
            <span className="text-xs font-mono font-medium text-accent-primary">60%</span>
          </div>
        </div>
        <Link href="/dashboard/profile">
          <Button className="bg-accent-primary text-white hover:bg-accent-primary/90 h-10 px-6 rounded-xl flex-shrink-0">
            Complete Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
