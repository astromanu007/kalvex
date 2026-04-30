"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Filter, Clock, CheckCircle, AlertCircle, TrendingUp, Download, Eye } from "lucide-react";

const ALL_ORDERS = [
  { id: "ORD-001", title: "PhD Thesis – Smart Grid Optimization using ML", type: "Academic", status: "In Progress", date: "25 Apr 2026", deadline: "15 May 2026", amount: 12500, expert: "KV-E2341", progress: 60 },
  { id: "ORD-002", title: "Raspberry Pi 5 4GB RAM × 2 Units + Accessories", type: "Hardware", status: "Delivered", date: "18 Apr 2026", deadline: "20 Apr 2026", amount: 13000, expert: "—", progress: 100 },
  { id: "ORD-003", title: "Design Patent – Portable Solar Water Purifier", type: "Patent", status: "Under Review", date: "10 Apr 2026", deadline: "30 Apr 2026", amount: 8500, expert: "KV-C1892", progress: 80 },
  { id: "ORD-004", title: "Major Project – Autonomous Drone with CV", type: "Project", status: "Delivered", date: "01 Apr 2026", deadline: "10 Apr 2026", amount: 18000, expert: "KV-E5510", progress: 100 },
  { id: "ORD-005", title: "Research Paper – IoT-Based Health Monitoring System", type: "Academic", status: "In Progress", date: "05 Apr 2026", deadline: "20 May 2026", amount: 6500, expert: "KV-E2102", progress: 30 },
  { id: "ORD-006", title: "Copyright Registration – Source Code", type: "IPR", status: "Completed", date: "20 Mar 2026", deadline: "31 Mar 2026", amount: 4500, expert: "KV-C0887", progress: 100 },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  "In Progress":  { color: "text-accent-warning bg-accent-warning/10 border-accent-warning/20", icon: Clock },
  "Delivered":    { color: "text-accent-success bg-accent-success/10 border-accent-success/20", icon: CheckCircle },
  "Under Review": { color: "text-accent-primary bg-accent-primary/10 border-accent-primary/20", icon: TrendingUp },
  "Completed":    { color: "text-accent-success bg-accent-success/10 border-accent-success/20", icon: CheckCircle },
  "Disputed":     { color: "text-accent-danger bg-accent-danger/10 border-accent-danger/20", icon: AlertCircle },
};

const TYPE_COLOR: Record<string, string> = {
  Academic: "bg-accent-primary/10 text-accent-primary",
  Hardware: "bg-accent-secondary/10 text-accent-secondary",
  Patent:   "bg-accent-warning/10 text-accent-warning",
  Project:  "bg-accent-success/10 text-accent-success",
  IPR:      "bg-bg-surface text-text-secondary",
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "In Progress", "Delivered", "Under Review", "Completed"];

  const filtered = ALL_ORDERS.filter((o) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text-primary">My Orders</h1>
          <p className="text-text-secondary text-sm mt-1">{ALL_ORDERS.length} total orders</p>
        </div>
        <Link href="/services">
          <Button className="bg-accent-primary hover:bg-accent-primary/90 text-white h-10 px-5 rounded-xl">+ New Order</Button>
        </Link>
      </div>

      {/* Tabs + Search */}
      <div className="bg-bg-card border border-border rounded-2xl p-1 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-accent-primary text-white shadow-glow"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or Order ID..."
            className="w-full bg-bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
          />
        </div>
        <Button variant="outline" className="border-border h-10 px-4 rounded-xl flex items-center gap-2 flex-shrink-0">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-bg-card border border-border rounded-2xl p-12 text-center text-text-muted">No orders found.</div>
        )}
        {filtered.map((order) => {
          const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["In Progress"];
          return (
            <div key={order.id} className="bg-bg-card border border-border rounded-2xl p-5 hover:border-accent-primary/30 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">{order.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[order.type] ?? "bg-bg-surface text-text-muted"}`}>{order.type}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2 line-clamp-1">{order.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                    <span>Placed: <span className="text-text-primary">{order.date}</span></span>
                    <span>Deadline: <span className="text-text-primary">{order.deadline}</span></span>
                    <span>Expert: <span className="font-mono text-accent-primary">{order.expert}</span></span>
                  </div>

                  {/* Progress Bar */}
                  {order.progress < 100 && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-1.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-accent-primary">{order.progress}%</span>
                    </div>
                  )}
                </div>

                {/* Right */}
                <div className="flex lg:flex-col items-center lg:items-end gap-3 flex-shrink-0">
                  <p className="font-mono font-bold text-lg text-text-primary">₹{order.amount.toLocaleString()}</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${st.color}`}>
                    <st.icon className="w-3 h-3" /> {order.status}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg border-border gap-1.5">
                        <Eye className="w-3 h-3" /> View
                      </Button>
                    </Link>
                    {order.status === "Delivered" || order.status === "Completed" ? (
                      <Button size="sm" className="h-8 px-3 text-xs rounded-lg bg-accent-success/10 text-accent-success hover:bg-accent-success/20 gap-1.5">
                        <Download className="w-3 h-3" /> Files
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
