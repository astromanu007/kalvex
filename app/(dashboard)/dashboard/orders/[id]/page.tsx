"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Clock, FileText, CheckCircle, AlertCircle, 
  MessageSquare, Download, CreditCard, Loader2, Paperclip 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/app/actions/orders";
import { uploadFile } from "@/app/actions/storage";

const STATUS_MAP: Record<string, { color: string; icon: React.ElementType, desc: string }> = {
  "PENDING_PAYMENT": { color: "text-accent-warning bg-accent-warning/10", icon: AlertCircle, desc: "Awaiting your payment to begin." },
  "RESEARCH_STARTED": { color: "text-accent-primary bg-accent-primary/10", icon: Clock, desc: "Expert is actively working on this order." },
  "DELIVERED": { color: "text-accent-success bg-accent-success/10", icon: CheckCircle, desc: "Draft delivered for your review." },
  "COMPLETED": { color: "text-accent-success bg-accent-success/10", icon: CheckCircle, desc: "Order finalized and closed." },
  "CANCELLED": { color: "text-text-muted bg-bg-surface", icon: AlertCircle, desc: "Order was cancelled." },
  "REFUNDED": { color: "text-text-muted bg-bg-surface", icon: AlertCircle, desc: "Order was refunded." },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await getOrders();
      if (res.orders) {
        const found = res.orders.find((o: any) => o.id === id);
        if (found) setOrder(found);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await uploadFile(formData, order.id, `orders/${order.orderNumber}`);
    if (res.success) {
      // Re-fetch order
      const ordersRes = await getOrders();
      if (ordersRes.orders) {
        const found = ordersRes.orders.find((o: any) => o.id === order.id);
        setOrder(found);
      }
      alert("File uploaded successfully!");
    } else {
      alert(res.error || "Upload failed. Please ensure the 'kalvex' storage bucket exists in Supabase.");
    }
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/dashboard/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const st = STATUS_MAP[order.status] ?? STATUS_MAP["RESEARCH_STARTED"];
  const typeLabel = order.serviceType?.replace(/_/g, " ") ?? "Service";

  return (
    <div className="space-y-6">
      <Link href="/dashboard/orders" className="inline-flex items-center text-sm text-text-secondary hover:text-accent-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-medium text-text-muted bg-bg-surface px-2.5 py-1 rounded border border-border">
              {order.orderNumber}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${st.color}`}>
              <st.icon className="w-3.5 h-3.5" /> {order.status}
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary capitalize">{typeLabel}</h1>
        </div>

        {order.status === "PENDING_PAYMENT" && (
          <div className="flex flex-col items-end shrink-0">
            <p className="text-sm text-text-secondary mb-2">Total Amount Due</p>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-3xl text-text-primary">₹{order.amount?.toLocaleString()}</span>
              <Button onClick={() => router.push(`/checkout?orderId=${order.id}`)} className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow h-11 px-6 rounded-xl text-sm">
                <CreditCard className="w-4 h-4 mr-2" /> Pay Now
              </Button>
            </div>
          </div>
        )}

        {(order.status === "DELIVERED" || order.status === "COMPLETED") && (
          <Button className="bg-accent-success text-white hover:bg-accent-success/90 shadow-glow h-11 px-6 rounded-xl text-sm">
            <Download className="w-4 h-4 mr-2" /> Download Deliverables
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-primary" /> Requirements & Files
              </h2>
              <label className="cursor-pointer">
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                <Button variant="outline" size="sm" className="h-8 text-xs border-border rounded-lg gap-2" asChild>
                  <span>
                    {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Paperclip className="w-3 h-3" />}
                    Add Attachment
                  </span>
                </Button>
              </label>
            </div>
            
            <div className="space-y-4">
              <div className="whitespace-pre-wrap text-sm text-text-secondary bg-bg-surface rounded-xl p-4 border border-border">
                {order.requirements || "No specific requirements provided."}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
                {order.orderFiles?.length > 0 ? (
                  order.orderFiles.map((f: any) => (
                    <div key={f.id} className="flex items-center gap-3 p-3 bg-bg-surface border border-border rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-accent-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate">{f.fileName}</p>
                        <p className="text-[10px] text-text-muted">{new Date(f.createdAt).toLocaleDateString()}</p>
                      </div>
                      <a href={f.fileUrl} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted">
                          <Download className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-4 text-center text-[10px] text-text-muted italic border border-dashed border-border rounded-xl">
                    No files uploaded yet.
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              <div>
                <p className="text-xs text-text-muted mb-1">Service</p>
                <p className="text-sm font-semibold capitalize">{typeLabel.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Created On</p>
                <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Deadline</p>
                <p className="text-sm font-semibold">{order.deadline ? new Date(order.deadline).toLocaleDateString() : "TBD"}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Total Amount</p>
                <p className="text-sm font-semibold font-mono">₹{order.amount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-card border border-border rounded-2xl p-6">
             <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent-success" /> Quality & Security
            </h2>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-accent-success mt-0.5 shrink-0" />
                <span>Zero plagiarism guarantee with Turnitin report attached on delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-accent-success mt-0.5 shrink-0" />
                <span>Identity masking ensures your university/personal details are hidden from the expert.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-accent-success mt-0.5 shrink-0" />
                <span>Unlimited free revisions for 14 days after initial delivery.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Tracker */}
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h3 className="font-heading font-semibold text-base mb-4">Tracking</h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-border">
              <div className="relative">
                <div className="absolute -left-6 w-5 h-5 rounded-full bg-accent-primary text-white flex items-center justify-center border-4 border-bg-card">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <p className="text-sm font-semibold text-text-primary">Order Placed</p>
                <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="relative">
                <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-4 border-bg-card ${order.status !== "PENDING_PAYMENT" ? "bg-accent-primary text-white" : "bg-bg-surface border-border"}`}>
                  {order.status !== "PENDING_PAYMENT" && <CheckCircle className="w-3 h-3" />}
                </div>
                <p className={`text-sm font-semibold ${order.status !== "PENDING_PAYMENT" ? "text-text-primary" : "text-text-muted"}`}>Payment Received</p>
              </div>
              <div className="relative">
                <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-4 border-bg-card ${order.status === "DELIVERED" || order.status === "COMPLETED" ? "bg-accent-primary text-white" : "bg-bg-surface border-border"}`}>
                  {(order.status === "DELIVERED" || order.status === "COMPLETED") && <CheckCircle className="w-3 h-3" />}
                </div>
                <p className={`text-sm font-semibold ${order.status === "DELIVERED" || order.status === "COMPLETED" ? "text-text-primary" : "text-text-muted"}`}>Delivered</p>
              </div>
            </div>
          </div>

          {/* Expert Info */}
          <div className="bg-bg-card border border-border rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-accent-secondary/10 text-accent-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-heading font-bold text-xl">EX</span>
            </div>
            <h3 className="font-heading font-semibold text-lg text-text-primary">
              {order.maskedAssigneeId ?? "Pending Assignment"}
            </h3>
            <p className="text-xs text-text-secondary mt-1 mb-4">Assigned Expert</p>
            
            <Link href="/dashboard/messages">
              <Button variant="outline" className="w-full border-border rounded-xl" disabled={!order.maskedAssigneeId}>
                <MessageSquare className="w-4 h-4 mr-2" /> Message Expert
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
