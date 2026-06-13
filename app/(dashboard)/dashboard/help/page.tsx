"use client";

import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import {
  HelpCircle, Mail, MessageSquare, PhoneCall, ArrowRight, ShieldCheck,
  Ticket, Plus, CheckCircle2, Loader2, Sparkles, Search, MessageCircle,
  Calendar, FileText, Settings, AlertTriangle, Shield, Check, Info,
  ExternalLink, Send, Paperclip, Terminal, BookOpen, RefreshCw, Cpu, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  category: "billing" | "electronics" | "research" | "general";
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "billing",
    q: "Is my payment safe?",
    a: "Yes, all transactions are secured and processed using institutional Razorpay checkout layers. No credit card details are ever stored on our servers."
  },
  {
    category: "billing",
    q: "How do I claim student discount benefits?",
    a: "Register using a valid student email or upload your student ID inside the 'Academic Info' tab in your Profile page."
  },
  {
    category: "electronics",
    q: "How long does component shipping take?",
    a: "Standard delivery for electronics store components takes 2-4 business days. Tracking details are updated under your order details page once shipped."
  },
  {
    category: "electronics",
    q: "Do components include working code/wiring diagrams?",
    a: "Yes! If you purchased components as part of a development package, all verified wiring guides, schematics, and source codes are shared in your files vault."
  },
  {
    category: "research",
    q: "Can I directly communicate with my assigned writer or developer?",
    a: "Yes! Once your order payment is verified, you can access the 'Messages' secure corridor to message your assigned expert directly."
  },
  {
    category: "research",
    q: "What is your rework policy for research papers?",
    a: "We offer unlimited free revisions for 14 days after initial delivery, provided the revision request aligns with your original order specifications."
  },
  {
    category: "general",
    q: "How does the intellectual property agreement work?",
    a: "Once full payment is completed, all intellectual property rights, copyrights, code ownership, and patent files transfer 100% to you automatically."
  }
];

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  date: string;
}

export default function HelpIntelPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isExpert = role === "WRITER" || role === "DEVELOPER";

  // Help center sub-tabs: support, ai, tools, status
  const [activeSubTab, setActiveSubTab] = useState<"support" | "ai" | "tools" | "status">("support");

  // Search and FAQ category state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "billing" | "electronics" | "research" | "general">("all");
  
  // Ticket Creator Form State
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("general");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketPriority, setTicketPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [ticketStatus, setTicketStatus] = useState<"idle" | "loading" | "success">("idle");
  const [attachedFileName, setAttachedFileName] = useState("");

  // AI Assistant Chat Mock State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Hello! I am your Kalvex Support Assistant. Ask me anything about payments, electronics shipping, source code, or revisions!" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Citation Generator tool state
  const [citationSource, setCitationSource] = useState("");
  const [citationAuthor, setCitationAuthor] = useState("");
  const [citationYear, setCitationYear] = useState(new Date().getFullYear().toString());
  const [citationFormat, setCitationFormat] = useState<"APA" | "IEEE" | "MLA">("APA");
  const [generatedCitation, setGeneratedCitation] = useState("");

  // Component Replacement State
  const [hwOrderId, setHwOrderId] = useState("");
  const [hwPartName, setHwPartName] = useState("");
  const [hwIssueDesc, setHwIssueDesc] = useState("");
  const [hwRequestSent, setHwRequestSent] = useState(false);

  // In-memory ticket list
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "TK-9402", subject: "Refund query for duplicate charge", category: "billing", priority: "HIGH", status: "RESOLVED", date: "2026-06-08" },
    { id: "TK-9481", subject: "Arduino Uno R4 Wifi firmware verification", category: "electronics", priority: "MEDIUM", status: "OPEN", date: "2026-06-10" }
  ]);

  // Filtered FAQs
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    setTicketStatus("loading");
    
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: ticketSubject,
        category: ticketCategory,
        priority: ticketPriority,
        status: "OPEN",
        date: new Date().toISOString().split("T")[0]
      };
      
      setTickets([newTicket, ...tickets]);
      setTicketStatus("success");
      setTicketSubject("");
      setTicketDesc("");
      setAttachedFileName("");
      
      setTimeout(() => setTicketStatus("idle"), 4500);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  // Chat search handler based on matching keywords in FAQ database
  const handleSendMessage = (textToSend?: string) => {
    const input = textToSend || chatInput;
    if (!input.trim()) return;

    const userMsg = { sender: "user" as const, text: input };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    // Simple keyword mapping search
    setTimeout(() => {
      const lower = input.toLowerCase();
      let matchedFaq = FAQ_DATA.find(faq => 
        lower.includes(faq.category) || 
        faq.q.toLowerCase().split(" ").some(word => word.length > 3 && lower.includes(word))
      );

      let reply = "I couldn't find a direct answer in our system database. Let me route you to a live coordinator Desk via our WhatsApp channel on the support page.";
      if (matchedFaq) {
        reply = `Here is what I found:\n"${matchedFaq.a}"`;
      }

      setChatMessages(prev => [...prev, { sender: "bot", text: reply }]);
    }, 800);
  };

  // Formatter tool action
  const handleGenerateCitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citationSource || !citationAuthor) return;

    let citation = "";
    if (citationFormat === "APA") {
      citation = `${citationAuthor}. (${citationYear}). ${citationSource}. Kalvex Academic Library.`;
    } else if (citationFormat === "IEEE") {
      citation = `[1] ${citationAuthor}, "${citationSource}," Kalvex Press, ${citationYear}.`;
    } else {
      citation = `${citationAuthor}. "${citationSource}." Kalvex Academic Library, ${citationYear}.`;
    }
    setGeneratedCitation(citation);
    toast.success("Citation generated successfully!");
  };

  const handleHwRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwOrderId || !hwPartName) return;
    setHwRequestSent(true);
    toast.success("Replacement claim submitted to hardware desk.");
    setTimeout(() => {
      setHwRequestSent(false);
      setHwOrderId("");
      setHwPartName("");
      setHwIssueDesc("");
    }, 5000);
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-12">
      
      {/* Premium Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-550" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-150/30 text-indigo-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-650 animate-pulse" />
              Kalvex Help Intelligence Center
            </div>
            <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
              Customer Support & Student Tools
            </h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Access live support desks, resolve hardware claims, generate citations, and track tickets.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-2xl w-fit">
            {[
              { id: "support", label: "Help Desk", icon: HelpCircle },
              { id: "ai", label: "AI Copilot", icon: Sparkles },
              { id: "tools", label: "Student Tools", icon: BookOpen },
              { id: "status", label: "Systems", icon: Activity }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeSubTab === sub.id 
                    ? "bg-slate-900 text-white shadow" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <sub.icon className="w-3.5 h-3.5" />
                <span>{sub.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Tab Panels */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: Support Ticket & FAQ */}
        {activeSubTab === "support" && (
          <motion.div
            key="support"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
          >
            {/* Left 2 Columns: FAQs */}
            <div className="lg:col-span-2 space-y-6 flex flex-col">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Frequently Asked Questions</h3>
                  </div>
                  
                  {/* FAQ Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* FAQ Filter Tags */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
                  {[
                    { id: "all", label: "All Topics" },
                    { id: "billing", label: "Payments & Invoices" },
                    { id: "electronics", label: "Hardware & Shipping" },
                    { id: "research", label: "Research & Experts" },
                    { id: "general", label: "Copyrights & IP" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id as any)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === tab.id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                      <Info className="w-8 h-8 mx-auto mb-2 text-slate-350" />
                      <p className="text-xs font-semibold">No questions found matching your query.</p>
                    </div>
                  ) : (
                    filteredFAQs.map((faq, i) => (
                      <div key={i} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200/50 space-y-2 hover:border-slate-300 transition-colors">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Q: {faq.q}</h4>
                        <p className="text-xs font-semibold text-slate-500 leading-relaxed uppercase tracking-wider">{faq.a}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Safeguards Badges */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100/50 text-purple-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">NDA & IP Protected</h4>
                    <p className="text-[10px] font-semibold text-slate-400 leading-normal uppercase tracking-wider">
                      All research work belongs entirely to you. We maintain signed NDAs, ensuring complete confidentiality.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50 text-indigo-650 shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Dedicated Service SLAs</h4>
                    <p className="text-[10px] font-semibold text-slate-400 leading-normal uppercase tracking-wider">
                      General queries get answered in under 24 hours. High-priority billing tickets resolved within 2 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Ticket Form & Ticket Status Tracker */}
            <div className="space-y-6 flex flex-col justify-between">
              
              {/* Ticket Creator Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <Ticket className="w-5 h-5 text-indigo-650" />
                  <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Submit Support Ticket</h3>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Subject / Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Firmware updates request"
                      value={ticketSubject}
                      onChange={e => setTicketSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2">Category</label>
                      <select
                        value={ticketCategory}
                        onChange={e => setTicketCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-[10px] font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                      >
                        <option value="general">General Support</option>
                        <option value="billing">Billing & Payouts</option>
                        <option value="electronics">Electronics Store</option>
                        <option value="research">Academic Writing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2">Priority</label>
                      <select
                        value={ticketPriority}
                        onChange={e => setTicketPriority(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-[10px] font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2">Detailed Description</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us what you need support with..."
                      value={ticketDesc}
                      onChange={e => setTicketDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 resize-none"
                      required
                    />
                  </div>

                  {/* File Upload Zone */}
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2">Attachments (Optional)</label>
                    <div className="relative flex items-center justify-center border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center gap-2 text-slate-400">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {attachedFileName || "Attach Screenshots"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={ticketStatus === "loading"}
                    className="w-full bg-slate-900 hover:bg-indigo-650 text-white rounded-xl h-11 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {ticketStatus === "loading" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Submit Ticket
                      </>
                    )}
                  </Button>
                </form>

                {ticketStatus === "success" && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Support Ticket Created Successfully!
                  </div>
                )}
              </div>

              {/* In-page Ticket History Tracker */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex-1">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Active Support Tickets</h4>
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/50 rounded-xl text-[10px] font-bold">
                      <div className="space-y-0.5">
                        <span className="font-mono text-indigo-650">{t.id}</span>
                        <p className="text-slate-700 truncate max-w-[150px] uppercase tracking-wider">{t.subject}</p>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.date} · {t.category}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          t.priority === "HIGH" ? "bg-red-50 text-red-650" : t.priority === "MEDIUM" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
                        }`}>
                          {t.priority}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[8px] font-black ${
                          t.status === "RESOLVED" ? "text-emerald-600" : "text-indigo-600"
                        }`}>
                          {t.status === "RESOLVED" ? <Check className="w-2.5 h-2.5" /> : <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: AI Copilot Chat Drawer */}
        {activeSubTab === "ai" && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
          >
            {/* AI Assistant Chat Interface */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[500px]">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">Kalvex Support Copilot</span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-100">
                  Online
                </span>
              </div>

              {/* Chat screen */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-none">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-4 rounded-2xl max-w-md text-xs leading-relaxed uppercase tracking-wider font-bold ${
                      msg.sender === "user" 
                        ? "bg-slate-950 text-white rounded-tr-none" 
                        : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Inputs */}
              <div className="border-t border-slate-100 pt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about payments, refunds, wiring schematics..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
                <Button onClick={() => handleSendMessage()} className="bg-slate-900 text-white rounded-xl h-11 px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Prompts Recommendations */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">Recommended Prompts</h3>
              <div className="space-y-2.5">
                {[
                  "Is my payment safe?",
                  "How to claim student discount?",
                  "How long does component shipping take?",
                  "How does the copyright agreement work?"
                ].map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => handleSendMessage(promptText)}
                    className="w-full text-left p-3 rounded-xl border border-slate-150 text-[10px] font-bold uppercase tracking-wider hover:border-indigo-500 hover:bg-indigo-50/20 text-slate-650 transition-all"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: Academic Tools & Hardware Desk */}
        {activeSubTab === "tools" && (
          <motion.div
            key="tools"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Citation Formatter Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-650" />
                  Academic Citation Formatter
                </h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Quickly generate bibliography strings for your black book reports</p>
              </div>

              <form onSubmit={handleGenerateCitation} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Author Name(s)</label>
                    <input
                      type="text"
                      placeholder="e.g. M. Student, J. Doe"
                      value={citationAuthor}
                      onChange={e => setCitationAuthor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Graduation / Publish Year</label>
                    <input
                      type="number"
                      value={citationYear}
                      onChange={e => setCitationYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Book / Project Report Title</label>
                  <input
                    type="text"
                    placeholder="e.g. IoT Smart Farming Irrigation System"
                    value={citationSource}
                    onChange={e => setCitationSource(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                    required
                  />
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-150 rounded-xl w-fit">
                  {["APA", "IEEE", "MLA"].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setCitationFormat(f as any)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors ${
                        citationFormat === f ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <Button type="submit" className="w-full bg-slate-950 text-white rounded-xl h-11 text-[9px] font-black uppercase tracking-widest">
                  Generate Citation
                </Button>
              </form>

              {generatedCitation && (
                <div className="p-4 bg-indigo-50/30 border border-indigo-150 rounded-2xl space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 block">Generated Result ({citationFormat}):</span>
                  <p className="text-xs font-mono font-bold text-slate-800 break-words">{generatedCitation}</p>
                </div>
              )}
            </div>

            {/* Hardware Replacement Request Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4.5 h-4.5 text-blue-600 animate-pulse" />
                  Hardware Replacement Desk
                </h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Submit defective component replacement claims directly</p>
              </div>

              <form onSubmit={handleHwRequest} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Order Number</label>
                    <input
                      type="text"
                      placeholder="e.g. ORD-123456"
                      value={hwOrderId}
                      onChange={e => setHwOrderId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Defective Component</label>
                    <input
                      type="text"
                      placeholder="e.g. ESP32 Wi-Fi Node"
                      value={hwPartName}
                      onChange={e => setHwPartName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Describe Technical Issue</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Component fails to flash firmware or boot up..."
                    value={hwIssueDesc}
                    onChange={e => setHwIssueDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-xl h-11 text-[9px] font-black uppercase tracking-widest">
                  Submit Claim
                </Button>
              </form>

              {hwRequestSent && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Claim submitted successfully. Testing coordinator will message you.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 4: System Status Indicators */}
        {activeSubTab === "status" && (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Kalvex System Status Monitor
              </h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Real-time status tracking of platform nodes and checkout gateways</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Academic Coordinators Desk", status: "Operational", desc: "Available for live assignments routing" },
                { name: "Electronics Store Shipping Desk", status: "Operational", desc: "DHL/BlueDart packages dispatching daily" },
                { name: "Razorpay Payments Gateway", status: "Operational", desc: "Transaction nodes active and secure" },
                { name: "AI Patent Drafter Engine", status: "Operational", desc: "Text generation server response in 4s" },
                { name: "Supabase DB Cluster", status: "Operational", desc: "Response latency 14ms (100% uptime)" },
                { name: "WhatsApp Alerts Node", status: "Operational", desc: "Milestones triggers sending successfully" }
              ].map((sys) => (
                <div key={sys.name} className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{sys.name}</h4>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">{sys.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase text-emerald-600 tracking-wider">
                      {sys.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Multi-Channel Interactive Support Row */}
      {activeSubTab === "support" && (
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* WhatsApp Channel Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50 text-emerald-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">WhatsApp Support Desks</h3>
                <p className="text-[10px] font-semibold text-slate-400 leading-relaxed uppercase tracking-wider mt-1.5">
                  Connect directly with our dedicated channels. No bots, only immediate human assistance.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href="https://wa.me/917620153491?text=Hi%20Kalvex%20Support,%20I%20have%20an%2520inquiry%20regarding%20my%20academic%20development%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-between bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest px-4 py-3 rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5"
              >
                <span>💬 Academic Writing & Research Desk</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/917620153491?text=Hi%20Kalvex%20Hardware,%20I%20need%20help%20tracking%20or%2520testing%20my%2520electronics%20components%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-between bg-blue-500 hover:bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest px-4 py-3 rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5"
              >
                <span>🛍️ Electronics & Store Support</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="bg-slate-950 text-white border border-slate-900 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-sm text-slate-100 uppercase tracking-wider">Email Intel Desk</h3>
                <p className="text-[10px] font-semibold text-slate-400 leading-relaxed uppercase tracking-wider mt-1.5">
                  Submit complex requests, request project rework reviews, IP queries, invoice customizations or official correspondence.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="mailto:kalvextechnologies@gmail.com"
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:-translate-y-0.5"
              >
                <Send className="w-3.5 h-3.5" /> Email Official Support
              </a>
            </div>
          </div>

          {/* Book Call Scheduling Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50 text-indigo-650">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Schedule 1-on-1 Call</h3>
                <p className="text-[10px] font-semibold text-slate-400 leading-relaxed uppercase tracking-wider mt-1.5">
                  Book a 15-minute voice or video call with your assigned project coordinator to sync on complex deliverables.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert("Calendar scheduler loading... please select an available date slot.")}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[9px] uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5"
              >
                📅 Book Meeting Slot
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
