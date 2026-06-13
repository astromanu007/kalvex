"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { 
  MessageSquare, X, Send, Sparkles, Minus, Maximize2, Minimize2, 
  Trash2, Check, Copy, AlertCircle, RefreshCw, Circle
} from "lucide-react";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

// 1. Custom Code Block Component with Copy Action
interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

const MarkdownCodeBlock = ({ children, className, inline }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, "");
  const language = className?.replace("language-", "") || "code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (inline) {
    return (
      <code className="bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-blue-600 font-bold break-all">
        {children}
      </code>
    );
  }

  return (
    <div className="relative border border-slate-800 rounded-2xl my-4 overflow-hidden bg-slate-950 shadow-2xl group/code">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-850 text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
        <span>{language}</span>
        <button 
          type="button"
          onClick={handleCopy} 
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs text-slate-200 bg-slate-950 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
        <code>{codeString}</code>
      </pre>
    </div>
  );
};

export function Chatbot() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 2. Load History from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("kalvex_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history:", e);
      }
    } else {
      setMessages([
        { role: "assistant", content: "Hi! I'm your KALVEX Intelligence unit. How can I assist with your engineering, academic writing, or patent requirements today?" }
      ]);
    }
  }, []);

  // 3. Persist History to localStorage on update
  useEffect(() => {
    if (mounted && messages.length > 0) {
      localStorage.setItem("kalvex_chat_history", JSON.stringify(messages));
    }
  }, [messages, mounted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // 4. Client Side Streaming Action Handler
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    
    // Add user message to state
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    // Filter error notifications out of history before sending to server
    const historyPayload = messages
      .filter(m => !m.content.startsWith("[SYSTEM ERROR]"))
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: historyPayload })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Server responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to initialize response stream reader.");
      }

      // Append empty assistant message placeholder to stream tokens into
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const token = decoder.decode(value, { stream: true });
        assistantContent += token;

        // Update the last message in messages state with the streamed chunk
        setMessages(prev => {
          const next = [...prev];
          if (next.length > 0) {
            next[next.length - 1] = {
              role: "assistant",
              content: assistantContent
            };
          }
          return next;
        });
      }
    } catch (err: any) {
      console.error("Chat Stream Error:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `[SYSTEM ERROR]: ${err?.message || "Communication link lost. Please retry your inquiry."}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 5. Clear Chat Helper
  const handleClearChat = () => {
    if (confirm("Are you sure you want to reset your conversation history?")) {
      const defaultMsg = [
        { role: "assistant", content: "Hi! I'm your KALVEX Intelligence unit. How can I assist with your engineering, academic writing, or patent requirements today?" }
      ] as const;
      setMessages([...defaultMsg]);
      localStorage.setItem("kalvex_chat_history", JSON.stringify(defaultMsg));
    }
  };

  // Generate random cosmic stars for the header banner background
  const starsBackground = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3
    }));
  }, []);

  if (mounted && (pathname?.startsWith("/login") || pathname?.startsWith("/register"))) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9999] flex flex-col items-end">
      
      {/* 1. Closed Launcher State Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-slate-950/50 flex items-center justify-center hover:bg-blue-600 transition-all duration-500 hover:scale-110 active:scale-95 group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
            <div className="absolute top-3.5 right-3.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Open Chatbot Shell */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 120 }}
            className={`bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-[0_32px_128px_-16px_rgba(15,23,42,0.15)] flex flex-col overflow-hidden transition-all duration-300 ${
              isMinimized 
                ? "w-[280px] sm:w-[320px] h-[72px]" 
                : isMaximized 
                  ? "w-[calc(100vw-2rem)] sm:w-[760px] h-[85vh] sm:h-[760px]" 
                  : "w-[calc(100vw-2rem)] sm:w-[440px] h-[72vh] sm:h-[620px]"
            }`}
          >
            {/* Header section with Cosmic Theme */}
            <div className="bg-slate-950 p-4 sm:p-5 flex items-center justify-between relative overflow-hidden select-none shrink-0 border-b border-slate-900">
              
              {/* Star Particles */}
              {starsBackground.map((star) => (
                <motion.div
                  key={star.id}
                  className="absolute bg-white rounded-full opacity-35 pointer-events-none"
                  style={{
                    top: star.top,
                    left: star.left,
                    width: star.size,
                    height: star.size,
                  }}
                  animate={{
                    opacity: [0.15, 0.7, 0.15],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: star.duration,
                    delay: star.delay,
                    ease: "easeInOut"
                  }}
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/15 via-transparent to-purple-900/10 pointer-events-none" />
              
              <div 
                className="flex items-center gap-3 relative z-10 cursor-pointer"
                onClick={() => isMinimized && setIsMinimized(false)}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-heading font-black text-xs uppercase tracking-widest leading-none">KALVEX AI</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-white/40 text-[8px] font-black uppercase tracking-wider">Sync Active</span>
                  </div>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1.5 relative z-10">
                {/* Reset History */}
                {!isMinimized && (
                  <button 
                    onClick={handleClearChat}
                    title="Clear Conversation"
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {/* Minimize (Collapse contents) */}
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand Chat" : "Minimize Chat"}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                {/* Maximize / Standard size toggler */}
                {!isMinimized && (
                  <button 
                    onClick={() => setIsMaximized(!isMaximized)}
                    title={isMaximized ? "Restore Size" : "Maximize Chat"}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                )}
                {/* Close Button */}
                <button 
                  onClick={() => setIsOpen(false)}
                  title="Close AI"
                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-lg cursor-pointer ml-1"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Panel */}
            <AnimatePresence>
              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
                    {messages.map((m, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        key={i} 
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-[88%] flex gap-2.5 items-start">
                          {m.role === "assistant" && (
                            <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-white font-black flex items-center justify-center shrink-0 mt-0.5 select-none shadow-sm">
                              KV
                            </div>
                          )}
                          <div
                            className={`p-4 rounded-[1.5rem] text-xs sm:text-[13px] font-medium leading-relaxed shadow-sm ${
                              m.role === "user"
                                ? "bg-slate-900 text-slate-50 rounded-tr-none shadow-xl shadow-slate-950/5"
                                : m.content.startsWith("[SYSTEM ERROR]")
                                  ? "bg-red-50 border border-red-150/50 text-red-700 rounded-tl-none font-bold flex items-start gap-2"
                                  : "bg-white border border-slate-200/60 text-slate-700 rounded-tl-none"
                            }`}
                          >
                            {m.content.startsWith("[SYSTEM ERROR]") && (
                              <AlertCircle className="w-4.5 h-4.5 text-red-650 shrink-0 mt-0.5" />
                            )}
                            
                            {m.role === "assistant" && !m.content.startsWith("[SYSTEM ERROR]") ? (
                              <div className="prose prose-sm prose-slate max-w-none text-inherit font-medium leading-relaxed
                                prose-p:my-0 prose-headings:my-1 prose-strong:text-blue-600 prose-strong:font-black">
                                <ReactMarkdown
                                  components={{
                                    code(props) {
                                      const { children, className, node, ...rest } = props;
                                      const codeStr = String(children || "");
                                      // Check if inline
                                      const isInline = !className && !codeStr.includes("\n");
                                      return (
                                        <MarkdownCodeBlock 
                                          className={className} 
                                          inline={isInline}
                                        >
                                          {codeStr}
                                        </MarkdownCodeBlock>
                                      );
                                    },
                                    a(props) {
                                      const { href, children } = props;
                                      const isInternal = href?.startsWith("/");
                                      if (isInternal) {
                                        return (
                                          <Link 
                                            href={href || "/"} 
                                            className="text-blue-600 hover:text-blue-700 underline font-black transition-colors"
                                          >
                                            {children}
                                          </Link>
                                        );
                                      }
                                      return (
                                        <a 
                                          href={href} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-blue-600 hover:text-blue-700 underline font-black transition-colors"
                                        >
                                          {children}
                                        </a>
                                      );
                                    }
                                  }}
                                >
                                  {m.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              m.content.startsWith("[SYSTEM ERROR]") 
                                ? m.content.slice(15) 
                                : m.content
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Streaming / Loader Indicator */}
                    {loading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                      <div className="flex justify-start">
                        <div className="flex gap-2.5 items-start">
                          <div className="w-6 h-6 rounded-lg bg-slate-900 text-[10px] text-white font-black flex items-center justify-center shrink-0 select-none">
                            KV
                          </div>
                          <div className="bg-white border border-slate-200/50 p-4 rounded-[1.5rem] rounded-tl-none flex items-center gap-1.5 shadow-sm">
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form Footer */}
                  <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="flex gap-3 items-center"
                    >
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        placeholder="Inquire with AI (e.g. check my active orders)..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-350 disabled:opacity-50"
                      />
                      <button 
                        type="submit" 
                        disabled={!input.trim() || loading} 
                        className="w-12 h-12 rounded-xl sm:rounded-2xl bg-slate-950 hover:bg-blue-600 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/20 disabled:opacity-40 disabled:hover:bg-slate-950 shrink-0 cursor-pointer group"
                      >
                        {loading ? (
                          <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                        ) : (
                          <Send className="w-4.5 h-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        )}
                      </button>
                    </form>
                    <p className="text-[9px] text-center text-slate-350 font-black uppercase tracking-wider mt-3">
                      Powered by KALVEX High-Performance LLM Engine
                    </p>
                  </div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
