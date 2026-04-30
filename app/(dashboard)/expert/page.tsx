"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText, IndianRupee, Clock, CheckCircle, AlertCircle,
  TrendingUp, Download, Eye, Upload, MessageSquare, Search, Filter, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders, getAvailableOrders, acceptOrder } from "@/app/actions/orders";

export default function ExpertDashboard() {
  const { data: session } = useSession();
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [marketplace, setMarketplace] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "marketplace">("tasks");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [assignedRes, availableRes] = await Promise.all([
        getOrders(),
        getAvailableOrders()
      ]);
      
      if (assignedRes.orders) setActiveTasks(assignedRes.orders);
      if (availableRes.orders) setMarketplace(availableRes.orders);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAccept = async (orderId: string) => {
    const res = await acceptOrder(orderId);
    if (res.success) {
      // Refresh
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
          Expert Dashboard
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Identity: <span className="font-mono text-accent-primary">{session?.user?.maskedId ?? "KV-E0000"}</span>
          &nbsp;·&nbsp;
          Rating: <span className="font-semibold text-accent-warning">4.8 ★</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Tasks", value: loading ? "-" : activeTasks.length.toString(), sub: "In progress", icon: FileText, color: "text-accent-primary", bg: "bg-accent-primary/10" },
          { label: "Marketplace", value: loading ? "-" : marketplace.length.toString(), sub: "Available to pick", icon: TrendingUp, color: "text-accent-warning", bg: "bg-accent-warning/10" },
          { label: "Earnings", value: "₹0", sub: "Pending clearance", icon: IndianRupee, color: "text-accent-success", bg: "bg-accent-success/10" },
          { label: "Success Rate", value: "100%", sub: "High quality", icon: CheckCircle, color: "text-accent-secondary", bg: "bg-accent-secondary/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-bg-surface border border-border rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "tasks" ? "bg-bg-card text-accent-primary shadow-sm" : "text-text-muted hover:text-text-primary"}`}
            >
              Assigned Tasks ({activeTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "marketplace" ? "bg-bg-card text-accent-primary shadow-sm" : "text-text-muted hover:text-text-primary"}`}
            >
              Marketplace ({marketplace.length})
            </button>
          </div>

          {/* Active Orders */}
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-heading font-semibold text-lg">
                {activeTab === "tasks" ? "Current Assignments" : "Available Marketplace"}
              </h2>
            </div>
            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-accent-primary animate-spin" /></div>
              ) : activeTab === "tasks" ? (
                activeTasks.length === 0 ? (
                  <div className="p-12 text-center text-text-muted text-sm">No active assignments. Check the marketplace!</div>
                ) : (
                  activeTasks.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">{order.orderNumber}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-warning/10 text-accent-warning`}>
                              {order.status}
                            </span>
                          </div>
                          <h3 className="font-medium text-text-primary mb-1 capitalize">{order.serviceType?.replace(/_/g, " ")}</h3>
                          <p className="text-xs text-text-muted">Client: <span className="font-mono text-accent-primary">{order.maskedClientId}</span> &middot; Deadline: <span className="font-semibold text-text-primary">{order.deadline ? new Date(order.deadline).toLocaleDateString() : "TBD"}</span></p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-text-muted mb-0.5">Earning (85%)</p>
                          <p className="font-mono font-bold text-accent-success text-lg">₹{Math.floor(order.amount * 0.85)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                          <div className="h-1.5 bg-accent-primary rounded-full transition-all" style={{ width: `50%` }} />
                        </div>
                        <span className="text-[10px] font-mono">50%</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs border-border rounded-lg gap-1.5">
                            <Eye className="w-3 h-3" /> View Details
                          </Button>
                        </Link>
                        <Link href="/dashboard/messages">
                          <Button variant="outline" size="sm" className="h-8 text-xs border-border rounded-lg gap-1.5">
                            <MessageSquare className="w-3 h-3" /> Chat with Client
                          </Button>
                        </Link>
                        <Button size="sm" className="h-8 text-xs bg-accent-primary text-white rounded-lg gap-1.5 ml-auto">
                          <Upload className="w-3 h-3" /> Submit Draft
                        </Button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                marketplace.length === 0 ? (
                  <div className="p-12 text-center text-text-muted text-sm">No available orders at the moment.</div>
                ) : (
                  marketplace.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-bg-surface/50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">{order.orderNumber}</span>
                          </div>
                          <h3 className="font-medium text-text-primary mb-1 capitalize">{order.serviceType?.replace(/_/g, " ")}</h3>
                          <p className="text-xs text-text-muted line-clamp-1 max-w-md">{order.requirements}</p>
                          <p className="text-[10px] text-text-muted mt-2">Deadline: <span className="text-text-primary">{order.deadline ? new Date(order.deadline).toLocaleDateString() : "TBD"}</span></p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-text-muted mb-0.5">Your Earning</p>
                          <p className="font-mono font-bold text-accent-success text-lg">₹{Math.floor(order.amount * 0.85)}</p>
                          <Button onClick={() => handleAccept(order.id)} size="sm" className="mt-2 bg-accent-primary text-white rounded-lg px-4">Accept Job</Button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-lg mb-4">Recent Completions</h2>
            <div className="p-8 text-center text-text-muted text-xs border border-dashed border-border rounded-xl">
              No recent completions.
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-2xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-accent-primary mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-1">Increase your earning potential</h3>
            <p className="text-xs text-text-secondary mb-4">Complete 5 more orders with 5-star ratings to reach Senior Expert tier.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
