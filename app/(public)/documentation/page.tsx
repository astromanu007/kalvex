"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Book, Code, FileText, 
  Terminal, Cpu, ShieldCheck, Zap,
  ChevronRight, Copy, Check, ArrowRight,
  ExternalLink, Globe, Database, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const DOCS_NAV = [
  {
    title: "Getting Started",
    items: ["Introduction", "Quick Start", "Installation", "Architecture"]
  },
  {
    title: "Core Services",
    items: ["AI Diagnostic API", "IP Drafter Engine", "Lab Inventory Sync"]
  },
  {
    title: "Authentication",
    items: ["OAuth Integration", "Identity Masking", "Role Permissions"]
  },
  {
    title: "Deployment",
    items: ["CI/CD Pipeline", "Cloud Run Config", "Database Scaling"]
  }
];

export default function DocumentationPage() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText("npm install @kalvex/core");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-32 overflow-hidden relative flex">
      {/* Sidebar: Navigation */}
      <aside className="w-80 border-r border-slate-100 hidden lg:flex flex-col p-12 space-y-12 fixed h-full top-0 pt-44 bg-white z-20">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input 
            placeholder="Search docs..."
            className="w-full bg-slate-50 h-12 pl-12 pr-4 rounded-xl outline-none border border-transparent focus:border-blue-600/20 transition-all font-bold text-[10px] uppercase tracking-widest"
          />
        </div>

        <nav className="space-y-10 overflow-y-auto pr-4 scrollbar-hide">
          {DOCS_NAV.map((section, i) => (
            <div key={i} className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] ml-1">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item, j) => (
                  <li key={j}>
                    <button className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 container mx-auto px-12 max-w-5xl">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="space-y-16"
        >
          {/* Header Section */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-xl">
              <Book className="w-4 h-4 text-blue-500" /> Technical Protocol v4.0
            </div>
            <h1 className="text-6xl md:text-7xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
              Documentation.
            </h1>
            <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-3xl">
              Comprehensive technical specifications and implementation guides for the KALVEX high-authority engineering ecosystem.
            </p>
          </div>

          {/* Quick Start Card */}
          <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                  <Terminal className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quick Start</h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Zap className="w-4 h-4 text-blue-600" /> Instant Setup
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600 blur-[40px] opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="bg-slate-900 rounded-2xl p-8 flex items-center justify-between group overflow-hidden border border-white/5 shadow-2xl relative z-10">
                <code className="text-blue-400 font-mono text-sm tracking-tight flex items-center gap-4">
                  <span className="text-slate-600 select-none">$</span> npm install @kalvex/core
                </code>
                <button 
                  onClick={copyCode}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Requirements", desc: "Node.js 18+, TypeScript 5.0+, and high-authority API key.", icon: Cpu },
                { title: "Auth Protocol", desc: "Standard identity-masked JWT authentication implemented.", icon: ShieldCheck }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600 border border-slate-100">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm tracking-tight">{item.title}</p>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Docs Sections Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            {[
              { icon: Globe, title: "API Reference", desc: "Explore our global REST and gRPC endpoints for real-time diagnostic data.", link: "#" },
              { icon: Code, title: "SDK Guides", desc: "Official libraries for React, Python, and Go to accelerate integration.", link: "#" },
              { icon: Database, title: "Data Protocol", desc: "Understanding the KALVEX masked-identity data architecture.", link: "#" },
              { icon: HelpCircle, title: "Support Hub", desc: "Direct transmission channel for high-priority technical issues.", link: "/support" }
            ].map((card, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group p-10 bg-white border border-slate-100 rounded-[3rem] space-y-6 transition-all duration-500 hover:border-blue-600/20 hover:shadow-2xl cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <card.icon className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{card.title}</h3>
                  <p className="text-slate-400 font-bold text-sm leading-relaxed">{card.desc}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600 transition-colors">
                  Read Section <ExternalLink className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Helpful Section */}
          <div className="pt-16 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-sm font-bold text-slate-400">Was this transmission helpful?</p>
            <div className="flex gap-4">
              <Button variant="outline" className="rounded-xl px-8 h-12 border-slate-100 hover:border-blue-600 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-widest">Yes, confirmed</Button>
              <Button variant="outline" className="rounded-xl px-8 h-12 border-slate-100 hover:border-red-600 hover:text-red-600 transition-all font-black text-[10px] uppercase tracking-widest">No, anomaly detected</Button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* On This Page: Right Sidebar */}
      <aside className="w-64 hidden xl:flex flex-col p-12 pt-44 space-y-8 fixed right-0 h-full bg-white">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">On This Page</h3>
        <ul className="space-y-4">
          {["Introduction", "Quick Start", "API Reference", "SDK Guides", "Authentication"].map((link, i) => (
            <li key={i}>
              <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors block border-l-2 border-transparent hover:border-blue-600 pl-4">
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="pt-12 space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6 space-y-4 border border-blue-100">
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Need Expert Help?</p>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">Our elite engineering team is available for direct consultation.</p>
            <Link href="/support">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-14 font-black text-[10px] uppercase tracking-widest transition-all">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
