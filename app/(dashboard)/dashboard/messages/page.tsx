"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, Paperclip, Lock, Clock, CheckCircle, ShieldCheck, Loader2, AlertCircle, Sparkles, Terminal, Copy, Check, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/app/actions/orders";
import { getServiceTitle } from "@/lib/utils";
import { getMessages, sendMessage as sendServerMessage } from "@/app/actions/messages";
import { motion } from "framer-motion";
import CursorGlowCard from "@/components/ui/CursorGlowCard";

export default function MessagesPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isExpert = role === "WRITER" || role === "DEVELOPER";

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick reply templates for developers
  const DEVELOPER_TEMPLATES = [
    "Draft files uploaded. Please review.",
    "Working on project specifications.",
    "Code compiled and validated locally.",
    "Revision request received. Aligning scope.",
    "Plagiarism check complete: 0% match."
  ];

  // Quick reply templates for students/clients
  const STUDENT_TEMPLATES = [
    "Hi, please check my specifications description.",
    "Can we update the circuit/wiring diagram?",
    "When will the next code build be ready?",
    "Looks good! Let's proceed to payment.",
    "Please check the comment markers I added to the code."
  ];

  const QUICK_TEMPLATES = isExpert ? DEVELOPER_TEMPLATES : STUDENT_TEMPLATES;

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

  const sendMessage = async (customText?: string) => {
    const textToSend = customText || newMsg;
    if (!textToSend.trim() || !activeConv || sending) return;
    setSending(true);
    
    // Optimistic update
    const tempMsg = {
      id: `temp-${Date.now()}`,
      senderId: session?.user?.id,
      sender: { maskedId: session?.user?.maskedId },
      content: textToSend.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    if (!customText) setNewMsg("");

    const res = await sendServerMessage(activeConv.id, tempMsg.content);
    if (!res.success) {
      alert("Failed to send message");
    } else {
      const msgRes = await getMessages(activeConv.id);
      if (msgRes.messages) setMessages(msgRes.messages);
    }
    setSending(false);
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple parser to format code snippets in message text
  const renderMessageContent = (content: string, msgId: string) => {
    if (content.includes("```")) {
      const parts = content.split("```");
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          const lines = part.split("\n");
          const lang = lines[0]?.trim() || "code";
          const codeText = lines.slice(1).join("\n").trim() || part.trim();
          return (
            <div key={i} className="my-3 font-mono text-xs rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 p-4 relative group">
              <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-slate-500 border-b border-slate-900 pb-2 mb-2">
                <span>{lang} Snippet</span>
                <button type="button" onClick={() => handleCopyCode(codeText, `${msgId}-${i}`)} className="hover:text-white flex items-center gap-1 transition-colors">
                  {copiedId === `${msgId}-${i}` ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre">{codeText}</pre>
            </div>
          );
        }
        return <span key={i}>{part}</span>;
      });
    }
    return content;
  };

  const filteredConversations = conversations.filter(conv => {
    const title = getServiceTitle(conv.serviceType, conv.requirements).toLowerCase();
    const orderNum = conv.orderNumber.toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || orderNum.includes(query);
  });

  return (
    <div className="space-y-6 w-full h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden shrink-0 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-650 animate-pulse" />
            Messages Corridor
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">All communications are encrypted, identity-masked, and audited</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2">
          <ShieldCheck className="w-4 h-4 text-indigo-650" /> End-to-End Encrypted
        </div>
      </div>

      {/* Main Grid: Multi-card structure to prevent stretch and make it fully cursor reactive */}
      <div className="flex-1 flex gap-6 min-h-[480px] overflow-hidden">
        
        {/* Left Sidebar: Conversations */}
        <CursorGlowCard 
          glowColor="indigo" 
          animateY={false}
          className="w-80 flex-shrink-0 hidden md:flex flex-col h-full border border-slate-150 bg-white" 
          innerClassName="p-0 h-full flex flex-col justify-between"
        >
          <div className="p-4 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Search tunnels..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-650 transition-colors" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-55/60">
            {loadingConvs ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 text-indigo-650 animate-spin" /></div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">No active channels.</div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full text-left p-5 hover:bg-slate-50/50 transition-all flex flex-col gap-2 relative border-l-4 ${
                      isActive ? "bg-indigo-50/30 border-l-indigo-600" : "border-l-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wide line-clamp-1">{getServiceTitle(conv.serviceType, conv.requirements)}</p>
                      <span className="text-[8px] font-bold text-slate-400 shrink-0 ml-1">{new Date(conv.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[8px] font-mono font-black text-indigo-650 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                        {conv.orderNumber}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[120px]">
                        {conv.maskedAssigneeId ?? "Pending Assignment"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </CursorGlowCard>

        {/* Right Chat Pane */}
        <CursorGlowCard 
          glowColor="purple" 
          animateY={false}
          className="flex-1 flex flex-col h-full border border-slate-150 bg-white" 
          innerClassName="p-0 h-full flex flex-col justify-between"
        >
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 md:px-6 border-b border-slate-150 bg-white flex items-center justify-between shadow-sm relative z-10 shrink-0">
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wide">{getServiceTitle(activeConv.serviceType, activeConv.requirements)}</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[9px] font-mono font-black text-indigo-600 uppercase tracking-wider">
                      {isExpert ? `Client: ${activeConv.maskedClientId}` : `Expert: ${activeConv.maskedAssigneeId ?? "Unassigned"}`}
                    </span>
                    <span className="text-[9px] font-mono text-slate-450 uppercase tracking-wider">Tunnel: {activeConv.orderNumber}</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Tunnel Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Timeline */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 bg-white border border-slate-150 rounded-full px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 shadow-sm">
                    <Lock className="w-3 h-3 text-indigo-650" /> Identities masked for strict NDA compliance.
                  </span>
                </div>

                {loadingMsgs ? (
                  <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 text-indigo-650 animate-spin" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center p-12 text-xs text-slate-450 font-bold uppercase tracking-wider">No transmission details yet. Send a hello payload!</div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === session?.user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className="max-w-[80%] space-y-1">
                          <p className={`text-[8px] font-mono font-black uppercase tracking-wider ${isMe ? "text-right text-indigo-600" : "text-slate-500"}`}>
                            {msg.sender?.maskedId || "KV-USER"}
                          </p>
                          
                          {/* Message Bubble */}
                          <div className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed border shadow-sm ${
                            isMe 
                              ? "bg-slate-950 text-white border-slate-900 rounded-tr-sm" 
                              : "bg-white text-slate-800 border-slate-150 rounded-tl-sm"
                          }`}>
                            {msg.isBlocked ? (
                              <span className="text-rose-400 italic flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Transmission Blocked (PII Shield Violation)
                              </span>
                            ) : (
                              renderMessageContent(msg.content, msg.id)
                            )}
                          </div>

                          <div className={`flex items-center gap-1.5 ${isMe ? "justify-end" : "justify-start"}`}>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isMe && <CheckCircle className="w-3 h-3 text-indigo-600" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick reply templates bar */}
              <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto select-none shrink-0 scrollbar-none">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Quick Replies:</span>
                {QUICK_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(tpl)}
                    className="px-3 py-1 bg-slate-50 border border-slate-200 hover:border-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-650 hover:bg-indigo-50/50 hover:text-indigo-650 transition-colors whitespace-nowrap"
                  >
                    {tpl}
                  </button>
                ))}
              </div>

              {/* Input Control Box */}
              <div className="p-4 border-t border-slate-150 bg-white shadow-lg relative z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => alert("Scope attachments securely restricted to the project specifications tab.")}
                    className="text-slate-400 hover:text-indigo-650 transition-colors shrink-0"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder="Send message payload... (e.g. use ```javascript for code blocks)"
                    disabled={sending}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 disabled:opacity-50"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!newMsg.trim() || sending}
                    className="bg-slate-950 hover:bg-indigo-600 text-white w-12 h-12 p-0 rounded-xl shrink-0 flex items-center justify-center transition-colors shadow-md"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-[8px] font-bold text-slate-400 mt-2 text-center uppercase tracking-wider">
                  Sharing phone numbers, personal emails, or social tags violates NDA security protocols.
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/20">
              <MessageSquare className="w-12 h-12 text-slate-300 animate-pulse mb-3" />
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">No Active Corridor</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-xs mt-1.5 leading-relaxed">
                Select an active project tunnel from the list to start end-to-end encrypted communication.
              </p>
            </div>
          )}
        </CursorGlowCard>
      </div>
    </div>
  );
}
