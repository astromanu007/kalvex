"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Filter, Clock, CheckCircle, AlertCircle, TrendingUp, Download, Eye, Loader2 } from "lucide-react";
import { getOrders } from "@/app/actions/orders";


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
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await getOrders();
      if (res.orders) {
        setOrders(res.orders);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const tabs = ["All", "PENDING_PAYMENT", "RESEARCH_STARTED", "DELIVERED", "COMPLETED"];

  const filtered = orders.filter((o) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesSearch = o.serviceType?.toLowerCase().includes(search.toLowerCase()) || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text-primary">My Orders</h1>
          <p className="text-text-secondary text-sm mt-1">{orders.length} total orders</p>
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
        {loading ? (
          <div className="bg-bg-card border border-border rounded-2xl p-12 flex justify-center text-accent-primary">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-bg-card border border-border rounded-2xl p-12 text-center text-text-muted">No orders found.</div>
        ) : (
          filtered.map((order) => {
            const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["In Progress"];
            // Quick map for display
            const title = order.serviceType?.replace(/_/g, " ") ?? "Custom Order";
            const typeLabel = order.serviceType ?? "Service";
            const progress = order.status === "COMPLETED" || order.status === "DELIVERED" ? 100 : 50;

            return (
              <div key={order.id} className="bg-bg-card border border-border rounded-2xl p-5 hover:border-accent-primary/30 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">{order.orderNumber}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[typeLabel] ?? "bg-bg-surface text-text-muted"}`}>{typeLabel}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-2 line-clamp-1">{title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                      <span>Placed: <span className="text-text-primary">{new Date(order.createdAt).toLocaleDateString()}</span></span>
                      {order.deadline && <span>Deadline: <span className="text-text-primary">{new Date(order.deadline).toLocaleDateString()}</span></span>}
                      <span>Expert: <span className="font-mono text-accent-primary">{order.maskedAssigneeId ?? "Unassigned"}</span></span>
                    </div>

                    {/* Progress Bar */}
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

                  {/* Right */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-3 flex-shrink-0">
                    <p className="font-mono font-bold text-lg text-text-primary">₹{order.amount?.toLocaleString()}</p>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${st.color}`}>
                      <st.icon className="w-3 h-3" /> {order.status}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg border-border gap-1.5">
                          <Eye className="w-3 h-3" /> View
                        </Button>
                      </Link>
                      {order.status === "DELIVERED" || order.status === "COMPLETED" ? (
                        <Button size="sm" className="h-8 px-3 text-xs rounded-lg bg-accent-success/10 text-accent-success hover:bg-accent-success/20 gap-1.5">
                          <Download className="w-3 h-3" /> Files
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
