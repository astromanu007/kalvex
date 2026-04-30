"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, Paperclip, Lock, Clock, CheckCircle, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/app/actions/orders";
import { getMessages, sendMessage as sendServerMessage } from "@/app/actions/messages";

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Orders/Conversations
  useEffect(() => {
    const fetchConvs = async () => {
      const res = await getOrders();
      if (res.orders) {
        setConversations(res.orders);
        if (res.orders.length > 0) setActiveConv(res.orders[0]);
      }
      setLoadingConvs(false);
    };
    fetchConvs();
  }, []);

  // Fetch Messages for active conversation
  useEffect(() => {
    if (!activeConv) return;
    const fetchMsgs = async () => {
      setLoadingMsgs(true);
      const res = await getMessages(activeConv.id);
      if (res.messages) {
        setMessages(res.messages);
      }
      setLoadingMsgs(false);
    };
    fetchMsgs();
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeConv || sending) return;
    setSending(true);
    
    // Optimistic update
    const tempMsg = {
      id: `temp-${Date.now()}`,
      senderId: session?.user?.id,
      sender: { maskedId: session?.user?.maskedId },
      content: newMsg.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMsg("");

    const res = await sendServerMessage(activeConv.id, tempMsg.content);
    if (!res.success) {
      alert("Failed to send message");
      // Could remove temp message here
    } else {
      // Re-fetch to get real ID and blocked status
      const msgRes = await getMessages(activeConv.id);
      if (msgRes.messages) setMessages(msgRes.messages);
    }
    setSending(false);
  };

  return (
    <div className="space-y-0">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text-primary">Messages</h1>
        <p className="text-text-secondary text-sm mt-1">All communications are encrypted and identity-masked.</p>
      </div>

      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden flex" style={{ height: "calc(100vh - 240px)", minHeight: "500px" }}>
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 border-r border-border flex flex-col hidden md:flex">
          <div className="p-4 border-b border-border">
            <input placeholder="Search conversations..." className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent-primary" />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loadingConvs ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 text-accent-primary animate-spin" /></div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted">No active orders yet.</div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full text-left p-4 hover:bg-bg-surface transition-colors ${activeConv?.id === conv.id ? "bg-accent-primary/5 border-l-2 border-accent-primary" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-semibold text-text-primary line-clamp-1 flex-1">{conv.serviceType?.replace(/_/g, " ") ?? "Order"}</p>
                    <span className="text-[10px] text-text-muted ml-2 flex-shrink-0">{new Date(conv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[10px] font-mono text-accent-primary mb-1">Order: {conv.orderNumber}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-text-muted truncate flex-1">Expert: {conv.maskedAssigneeId ?? "Pending Assignment"}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          {activeConv ? (
            <div className="p-4 border-b border-border flex items-center justify-between bg-bg-card">
              <div>
                <h3 className="font-semibold text-sm text-text-primary">{activeConv.serviceType?.replace(/_/g, " ") ?? "Order"}</h3>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] font-mono text-accent-primary">Expert: {activeConv.maskedAssigneeId ?? "Pending"}</span>
                  <span className="text-[10px] font-mono text-text-muted">Order: {activeConv.orderNumber}</span>
                  {activeConv.maskedAssigneeId && (
                    <span className="flex items-center gap-1 text-[10px] text-accent-success"><span className="w-1.5 h-1.5 rounded-full bg-accent-success"></span> Online</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-muted bg-accent-success/5 border border-accent-success/20 rounded-full px-3 py-1.5">
                <ShieldCheck className="w-3 h-3 text-accent-success" /> Masked & Encrypted
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-border bg-bg-card h-[73px]"></div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Identity Mask Notice */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-bg-surface border border-border rounded-full px-4 py-2 text-[10px] text-text-muted">
                <Lock className="w-3 h-3" /> Identities masked for privacy. No real contact info allowed.
              </div>
            </div>

            {loadingMsgs ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 text-accent-primary animate-spin" /></div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center p-8 text-sm text-text-muted">No messages yet. Say hello!</div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === session?.user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] space-y-1`}>
                      <p className={`text-[10px] font-mono ${isMe ? "text-right text-accent-primary" : "text-accent-secondary"}`}>{msg.sender?.maskedId}</p>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-accent-primary text-white rounded-tr-sm" : "bg-bg-surface border border-border text-text-primary rounded-tl-sm"}`}>
                        {msg.isBlocked ? (
                          <span className="text-red-300 italic flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Message Blocked (Privacy Policy Violation)</span>
                        ) : msg.content}
                      </div>
                      <div className={`flex items-center gap-1 ${isMe ? "justify-end" : "justify-start"}`}>
                        <span className="text-[10px] text-text-muted">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isMe && <CheckCircle className="w-3 h-3 text-accent-success" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-bg-card">
            <div className="flex items-center gap-3">
              <button className="text-text-muted hover:text-accent-primary transition-colors flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder={activeConv ? "Type a message... (No contact info allowed)" : "Select an order to start messaging"}
                disabled={!activeConv || sending}
                className="flex-1 bg-bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary disabled:opacity-50"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMsg.trim() || !activeConv || sending}
                className="bg-accent-primary hover:bg-accent-primary/90 text-white w-10 h-10 p-0 rounded-xl flex-shrink-0"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-text-muted mt-2 text-center">Messages sharing personal contact info are automatically flagged and removed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
