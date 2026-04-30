"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText, IndianRupee, Clock, CheckCircle, AlertCircle,
  TrendingUp, Download, Eye, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ASSIGNED_ORDERS = [
  { id: "ORD-001", title: "PhD Thesis – Smart Grid Optimization", status: "In Progress", deadline: "15 May 2026", earning: 8500, userMasked: "KV-0091", progress: 60 },
  { id: "ORD-005", title: "Research Paper – IoT Health", status: "Revision Requested", deadline: "20 May 2026", earning: 4500, userMasked: "KV-0182", progress: 80 },
];

const COMPLETED_ORDERS = [
  { id: "ORD-009", title: "IEEE Paper Formatting", status: "Completed", date: "10 Apr 2026", earning: 1500, rating: 5 },
  { id: "ORD-012", title: "Mini Project Report", status: "Completed", date: "02 Apr 2026", earning: 2000, rating: 4 },
];

export default function ExpertDashboard() {
  const { data: session } = useSession();

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
          { label: "Active Tasks", value: "2", sub: "Require attention", icon: FileText, color: "text-accent-primary", bg: "bg-accent-primary/10" },
          { label: "Pending Revisions", value: "1", sub: "Client requested", icon: AlertCircle, color: "text-accent-warning", bg: "bg-accent-warning/10" },
          { label: "This Month Earnings", value: "₹13,000", sub: "Pending clearance", icon: IndianRupee, color: "text-accent-success", bg: "bg-accent-success/10" },
          { label: "Total Completed", value: "45", sub: "All time", icon: CheckCircle, color: "text-accent-secondary", bg: "bg-accent-secondary/10" },
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
          {/* Active Orders */}
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-heading font-semibold text-lg">Current Assignments</h2>
            </div>
            <div className="divide-y divide-border">
              {ASSIGNED_ORDERS.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">{order.id}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${order.status === 'In Progress' ? 'bg-accent-warning/10 text-accent-warning' : 'bg-accent-danger/10 text-accent-danger'}`}>
                          {order.status}
                        </span>
                      </div>
                      <h3 className="font-medium text-text-primary mb-1">{order.title}</h3>
                      <p className="text-xs text-text-muted">Client: <span className="font-mono text-accent-primary">{order.userMasked}</span> &middot; Deadline: <span className="font-semibold text-text-primary">{order.deadline}</span></p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-text-muted mb-0.5">Earning</p>
                      <p className="font-mono font-bold text-accent-success text-lg">₹{order.earning}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                      <div className="h-1.5 bg-accent-primary rounded-full transition-all" style={{ width: `${order.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono">{order.progress}%</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-border rounded-lg gap-1.5">
                      <Eye className="w-3 h-3" /> View Details
                    </Button>
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
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Recent Completions */}
        <div className="space-y-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-lg mb-4">Recent Completions</h2>
            <div className="space-y-4">
              {COMPLETED_ORDERS.map((order) => (
                <div key={order.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-medium text-text-primary line-clamp-1">{order.title}</p>
                    <span className="text-xs font-mono font-bold text-accent-success ml-2">+₹{order.earning}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-text-muted">
                    <span>{order.date}</span>
                    <span className="text-accent-warning">
                      {Array(order.rating).fill('★').join('')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 text-xs border-border">View All History</Button>
          </div>

          <div className="bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-2xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-accent-primary mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-1">Increase your earning potential</h3>
            <p className="text-xs text-text-secondary mb-4">Complete 5 more orders with 5-star ratings to reach Senior Expert tier.</p>
            <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden">
              <div className="h-1.5 bg-accent-primary rounded-full w-[60%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick hack to import MessageSquare since I forgot it at the top
import { MessageSquare } from "lucide-react";
