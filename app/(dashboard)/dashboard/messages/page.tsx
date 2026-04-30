"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, Paperclip, Lock, Clock, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONVERSATIONS = [
  { id: "conv-1", orderId: "ORD-001", title: "PhD Thesis – Smart Grid", expertId: "KV-E2341", lastMsg: "Please confirm the chapter outline.", time: "10:32 AM", unread: 2, status: "active" },
  { id: "conv-2", orderId: "ORD-003", title: "Design Patent Filing", expertId: "KV-C1892", lastMsg: "Representation sheets are ready.", time: "Yesterday", unread: 0, status: "active" },
  { id: "conv-3", orderId: "ORD-005", title: "Research Paper – IoT Health", expertId: "KV-E2102", lastMsg: "Started on the literature review.", time: "28 Apr", unread: 1, status: "active" },
];

const MOCK_MESSAGES = [
  { id: "m1", from: "expert", maskedId: "KV-E2341", content: "Hello! I've received your thesis requirements document. I'll start with Chapter 1 – Introduction & Literature Review.", time: "09:45 AM", read: true },
  { id: "m2", from: "user", maskedId: "KV-C0091", content: "Great! Please make sure to follow the university's formatting guide — I've attached the PDF below.", time: "09:52 AM", read: true },
  { id: "m3", from: "expert", maskedId: "KV-E2341", content: "Received the guide. I'll strictly follow the formatting requirements. Expected first draft by this Friday.", time: "10:01 AM", read: true },
  { id: "m4", from: "expert", maskedId: "KV-E2341", content: "Please confirm the chapter outline I've shared. Once approved, I'll proceed with the full draft.", time: "10:32 AM", read: false },
];

export default function MessagesPage() {
  const { data: session } = useSession();
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        from: "user",
        maskedId: session?.user?.maskedId ?? "KV-0000",
        content: newMsg.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: true,
      },
    ]);
    setNewMsg("");
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
            {CONVERSATIONS.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`w-full text-left p-4 hover:bg-bg-surface transition-colors ${activeConv.id === conv.id ? "bg-accent-primary/5 border-l-2 border-accent-primary" : ""}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-semibold text-text-primary line-clamp-1 flex-1">{conv.title}</p>
                  <span className="text-[10px] text-text-muted ml-2 flex-shrink-0">{conv.time}</span>
                </div>
                <p className="text-[10px] font-mono text-accent-primary mb-1">Expert: {conv.expertId}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-text-muted truncate flex-1">{conv.lastMsg}</p>
                  {conv.unread > 0 && (
                    <span className="ml-2 w-4 h-4 rounded-full bg-accent-primary text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0">{conv.unread}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-bg-card">
            <div>
              <h3 className="font-semibold text-sm text-text-primary">{activeConv.title}</h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[10px] font-mono text-accent-primary">Expert: {activeConv.expertId}</span>
                <span className="text-[10px] font-mono text-text-muted">Order: {activeConv.orderId}</span>
                <span className="flex items-center gap-1 text-[10px] text-accent-success"><span className="w-1.5 h-1.5 rounded-full bg-accent-success"></span> Online</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted bg-accent-success/5 border border-accent-success/20 rounded-full px-3 py-1.5">
              <ShieldCheck className="w-3 h-3 text-accent-success" /> Masked & Encrypted
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Identity Mask Notice */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-bg-surface border border-border rounded-full px-4 py-2 text-[10px] text-text-muted">
                <Lock className="w-3 h-3" /> Identities masked for privacy. No real contact info allowed.
              </div>
            </div>

            {messages.map((msg) => {
              const isMe = msg.from === "user";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] space-y-1`}>
                    <p className={`text-[10px] font-mono ${isMe ? "text-right text-accent-primary" : "text-accent-secondary"}`}>{msg.maskedId}</p>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-accent-primary text-white rounded-tr-sm" : "bg-bg-surface border border-border text-text-primary rounded-tl-sm"}`}>
                      {msg.content}
                    </div>
                    <div className={`flex items-center gap-1 ${isMe ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-text-muted">{msg.time}</span>
                      {isMe && (msg.read ? <CheckCircle className="w-3 h-3 text-accent-success" /> : <Clock className="w-3 h-3 text-text-muted" />)}
                    </div>
                  </div>
                </div>
              );
            })}
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
                placeholder="Type a message... (No contact info allowed)"
                className="flex-1 bg-bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMsg.trim()}
                className="bg-accent-primary hover:bg-accent-primary/90 text-white w-10 h-10 p-0 rounded-xl flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-text-muted mt-2 text-center">Messages sharing personal contact info are automatically flagged and removed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
