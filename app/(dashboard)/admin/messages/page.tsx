"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, Loader2, Sparkles, AlertCircle, CheckCircle2, 
  Trash2, Eye, HelpCircle, FileText, Send, X, ShieldAlert 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingMessages, approveMessage, rejectMessage } from "@/app/actions/messages";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMessagesDesk() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "blocked">("pending");

  const fetchPending = async () => {
    setLoading(true);
    const res = await getPendingMessages();
    if (res.messages) {
      setMessages(res.messages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (msgId: string) => {
    const res = await approveMessage(msgId);
    if (res.success) {
      toast.success("Message approved and forwarded successfully.");
      setMessages(prev => prev.filter(m => m.id !== msgId));
    } else {
      toast.error(res.error || "Failed to approve message");
    }
  };

  const handleReject = async (msgId: string) => {
    const reason = prompt("Enter reason for rejection/blocking:", "Violation of NDA communication guidelines");
    if (reason === null) return; // cancel click

    const res = await rejectMessage(msgId, reason);
    if (res.success) {
      toast.success("Message rejected and blocked.");
      fetchPending();
    } else {
      toast.error(res.error || "Failed to reject message");
    }
  };

  const pendingList = messages.filter(m => !m.approvedByAdmin && !m.isBlocked);
  const blockedList = messages.filter(m => m.isBlocked);

  const displayList = activeTab === "pending" ? pendingList : blockedList;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-blue-600 animate-pulse" />
            Messages Approval Desk
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
            Review and forward student-developer communication payloads for strict NDA compliance
          </p>
        </div>
      </div>

      {/* Tabs Selection */}
      <div className="flex gap-2 p-1 bg-slate-100 border border-slate-200 rounded-2xl w-fit">
        {[
          { id: "pending", label: "Pending Approval", count: pendingList.length },
          { id: "blocked", label: "PII Shield Blocked", count: blockedList.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? "bg-slate-900 text-white shadow" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
              activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Listing Content */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-20 flex justify-center text-blue-600">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : displayList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-heading font-black text-base text-slate-900 uppercase tracking-wider">No Messages to Review</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">All communications are in sync and approved.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="wait">
            {displayList.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="flex-1 space-y-4">
                  {/* Header info */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[9px] font-mono font-black bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-1 rounded-lg">
                      Order: {msg.order?.orderNumber}
                    </span>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                      {msg.order?.serviceType?.replace(/_/g, " ")}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Sent {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Sender & Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{msg.sender?.name}</span>
                      <span className="text-[8px] font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                        {msg.senderRole} (ID: {msg.sender?.maskedId})
                      </span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-xs font-semibold text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>

                  {/* Blocked info if any */}
                  {msg.isBlocked && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-[10px] font-bold text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>BLOCKED REASON: {msg.blockReason || "PII Shield Detection"}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 shrink-0 md:pt-6">
                  {!msg.approvedByAdmin && !msg.isBlocked && (
                    <Button 
                      onClick={() => handleApprove(msg.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-5 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Forward
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleReject(msg.id)}
                    variant="outline"
                    className="border-rose-150 text-rose-600 hover:bg-rose-50 rounded-xl h-10 px-5 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> {msg.isBlocked ? "Modify Reason" : "Reject & Block"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
