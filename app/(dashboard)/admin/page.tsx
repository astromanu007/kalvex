"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Users, ShoppingBag, IndianRupee, Briefcase, 
  Search, Filter, MoreVertical, ExternalLink, Loader2, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminStats, getAllOrders, forceUpdateOrderStatus } from "@/app/actions/admin";
// Import OrderStatus types as strings to avoid browser-side Prisma resolution
type OrderStatus = string;

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        getAdminStats(),
        getAllOrders()
      ]);
      
      if (statsRes.stats) setStats(statsRes.stats);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const res = await forceUpdateOrderStatus(orderId, status);
    if (res.success) {
      const ordersRes = await getAllOrders();
      if (ordersRes.orders) setOrders(ordersRes.orders);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.serviceType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">Master Control</h1>
        <p className="text-text-secondary text-sm mt-1">Platform-wide overview and order management.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₹${stats?.totalRevenue?.toLocaleString() ?? "0"}`, icon: IndianRupee, color: "text-accent-success" },
          { label: "Active Orders", value: stats?.totalOrders ?? "0", icon: ShoppingBag, color: "text-accent-primary" },
          { label: "Total Clients", value: stats?.totalUsers ?? "0", icon: Users, color: "text-accent-secondary" },
          { label: "Active Experts", value: stats?.activeExperts ?? "0", icon: Briefcase, color: "text-accent-warning" },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-bg-surface flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-text-muted mb-0.5">{stat.label}</p>
              <p className="font-heading font-bold text-xl text-text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between gap-4">
          <h2 className="font-heading font-semibold text-lg">System Orders</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, service..." 
              className="bg-bg-input border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-primary w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface text-text-muted text-[10px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Expert</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-accent-primary animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-muted text-sm">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-bg-surface/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-text-primary font-bold">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{order.user?.name}</span>
                        <span className="text-[10px] font-mono text-text-muted">{order.user?.maskedId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs capitalize">{order.serviceType.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">₹{order.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {order.assignedTo ? (
                        <span className="text-xs font-mono text-accent-primary">{order.assignedTo.maskedId}</span>
                      ) : (
                        <span className="text-[10px] text-text-muted italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        order.status === 'COMPLETED' ? 'bg-accent-success/10 text-accent-success' :
                        order.status === 'CANCELLED' ? 'bg-accent-danger/10 text-accent-danger' :
                        'bg-accent-warning/10 text-accent-warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select 
                          className="bg-bg-input border border-border rounded-lg px-2 py-1 text-[10px] focus:outline-none"
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          value={order.status}
                        >
                          {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <ExternalLink className="w-4 h-4 text-text-muted" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
