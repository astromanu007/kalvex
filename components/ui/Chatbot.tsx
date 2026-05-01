"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Minus, Maximize2 } from "lucide-react";
import { Button } from "./button";
import { askChatbot } from "@/app/actions/chatbot";
import { motion, AnimatePresence } from "framer-motion";

export function Chatbot() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi! I'm your KALVEX Intelligence unit. How can I assist with your engineering or patent requirements today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const res = await askChatbot(userMsg, history);

    if (res.answer) {
      setMessages(prev => [...prev, { role: "assistant", content: res.answer }]);
    } else if (res.error) {
      setMessages(prev => [...prev, { role: "assistant", content: `[SYSTEM ERROR]: ${res.error}` }]);
    } else {
      setMessages(prev => [...prev, { role: "assistant", content: "Apologies, I encountered a connection anomaly. Please re-submit your inquiry." }]);
    }
    setLoading(false);
  };

  // Hide chatbot on login and register pages (Client-side only)
  if (mounted && (pathname?.startsWith("/login") || pathname?.startsWith("/register"))) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-3xl bg-slate-900 text-white shadow-2xl shadow-slate-900/40 flex items-center justify-center hover:bg-blue-600 transition-all duration-500 hover:scale-110 active:scale-95 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <MessageSquare className="w-7 h-7 relative z-10" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-slate-50 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="absolute bottom-0 right-0 w-[400px] sm:w-[440px] h-[640px] bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(15,23,42,0.15)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-8 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-40" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10 group">
                  <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-heading font-black text-sm uppercase tracking-widest">KALVEX Intelligence</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Active Link</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <button className="p-2 text-white/40 hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-red-400 transition-colors bg-white/5 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-5 rounded-[2rem] text-[13px] font-medium leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10"
                        : "bg-white border border-slate-100 text-slate-600 rounded-tl-none"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-8 bg-white border-t border-slate-50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-4 items-center"
              >
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Inquire with AI..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-6 pr-12 py-4 text-sm font-bold text-slate-900 focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-300"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Maximize2 className="w-4 h-4 text-slate-200" />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={!input.trim() || loading} 
                  className="w-14 h-14 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white flex items-center justify-center transition-all duration-500 shadow-xl shadow-slate-900/20 disabled:opacity-50 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
              <p className="text-[10px] text-center text-slate-300 font-black uppercase tracking-widest mt-6">Powered by KALVEX High-Performance LLM Architecture</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
