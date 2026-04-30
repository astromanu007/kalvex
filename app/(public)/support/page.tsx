"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, LifeBuoy, Phone, 
  Search, ChevronDown, Sparkles, 
  Zap, ShieldCheck, Clock, ArrowRight,
  Send, HelpCircle, FileText, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const SUPPORT_CHANNELS = [
  { icon: MessageSquare, title: "AI Live Link", desc: "Real-time communication with our KALVEX intelligence units.", color: "bg-blue-50 text-blue-600", border: "hover:border-blue-200" },
  { icon: LifeBuoy, title: "Expert Ticket", desc: "Submit complex technical or IP-related inquiries for elite review.", color: "bg-emerald-50 text-emerald-600", border: "hover:border-emerald-200" },
  { icon: Phone, title: "Command Line", desc: "Direct voice transmission for high-priority institutional partners.", color: "bg-orange-50 text-orange-600", border: "hover:border-orange-200" }
];

const FAQS = [
  { q: "How do I securely file a patent through KALVEX?", a: "Our proprietary IP Engine automates the technical drafting process. Once complete, our strategist team reviews the claims before direct filing through our government-integrated portal." },
  { q: "What is the identity masking protocol?", a: "To protect research integrity, all student and researcher data is masked using high-authority hashing before being assigned to external experts for review." },
  { q: "How can I track my hardware lab orders?", a: "Live tracking is available via your Command Dashboard under the 'Transmissions' tab. Real-time updates are pushed via our secure WebSocket link." }
];

export default function SupportPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white pt-40 pb-32 overflow-hidden relative">
      {/* Background Decorative Ambience */}
      <div className="absolute top-0 left-0 w-[80rem] h-[80rem] bg-blue-50 rounded-full -z-10 blur-[150px] -translate-y-1/2 -translate-x-1/4" />
      <div className="absolute bottom-0 right-0 w-[60rem] h-[60rem] bg-emerald-50 rounded-full -z-10 blur-[130px] translate-y-1/3 translate-x-1/4" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header: Institutional Support */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-32 space-y-8"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <LifeBuoy className="w-4 h-4" /> Command Support
          </div>
          <h1 className="text-7xl md:text-8xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
            We are here <br />to <span className="text-blue-600">Assist.</span>
          </h1>
          <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">
            Access direct transmission channels to our elite engineering and IP strategy units. No bots, only experts.
          </p>

          {/* Search Knowledge Base */}
          <div className="max-w-2xl mx-auto pt-8 relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            <input 
              placeholder="Search help topics, FAQs, or documentation..."
              className="w-full bg-white h-20 pl-20 pr-8 rounded-[2rem] outline-none border border-slate-100 shadow-2xl shadow-slate-900/5 focus:border-blue-600/20 transition-all font-bold text-sm"
            />
          </div>
        </motion.div>

        {/* Support Channels: 3D Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">
          {[
            { ...SUPPORT_CHANNELS[0], action: () => document.getElementById('direct-channel')?.scrollIntoView({ behavior: 'smooth' }) },
            { ...SUPPORT_CHANNELS[1], action: () => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }) },
            { ...SUPPORT_CHANNELS[2], action: () => alert("Direct Command Line: +91 98765 43210 (Institutional Partners Only)") }
          ].map((channel, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -20, 
                rotateX: 10,
                perspective: 1000,
                scale: 1.02
              }}
              onClick={channel.action}
              className={`group bg-white p-12 rounded-[4rem] border border-slate-100 transition-all duration-700 hover:shadow-[0_64px_128px_-24px_rgba(0,0,0,0.1)] ${channel.border} [transform-style:preserve-3d] cursor-pointer`}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] ${channel.color} flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 transition-transform`}>
                <channel.icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{channel.title}</h3>
              <p className="text-slate-400 font-bold leading-relaxed mb-8">{channel.desc}</p>
              <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors">Start Transmission</span>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Grid: FAQ & Quick Links */}
        <div className="grid lg:grid-cols-12 gap-24 items-start">
          {/* Left: FAQs */}
          <div id="faq-section" className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Frequent Inquiries.</h2>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Institutional Knowledge Protocol</p>
            </div>
            
            <div className="space-y-6">
              {FAQS.map((faq, i) => (
                <motion.div 
                  key={i}
                  className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 transition-all duration-500 hover:border-blue-600/20"
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full p-10 text-left flex items-center justify-between group"
                  >
                    <span className="text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{faq.q}</span>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-500 ${activeFaq === i ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="px-10 pb-10"
                      >
                        <p className="text-slate-500 font-bold leading-relaxed border-t border-slate-200/50 pt-8">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Instant Transmission Hub */}
          <div id="direct-channel" className="lg:col-span-5">
            <div className="bg-slate-900 rounded-[4rem] p-12 md:p-16 text-white relative overflow-hidden group shadow-[0_64px_128px_-24px_rgba(15,23,42,0.4)] transition-all duration-500 [transform-style:preserve-3d]">
              <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="relative z-10 space-y-12">
                <div className="space-y-4 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                    <Send className="w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="text-4xl font-black font-heading tracking-tight">Direct Channel</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Instant High-Authority Support</p>
                </div>

                <div className="space-y-8">
                  {[
                    { icon: Globe, label: "Live Hubs", val: "Global 24/7" },
                    { icon: Clock, label: "Avg Response", val: "< 2 Minutes" },
                    { icon: ShieldCheck, label: "Security", val: "End-to-End" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <item.icon className="w-5 h-5 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                      </div>
                      <span className="text-sm font-black tracking-tight">{item.val}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => alert("Initializing Secure Transmission... Our representative will connect with you shortly.")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white h-20 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 transition-all duration-500 hover:scale-[1.02] group"
                >
                  Initialize Transmission <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Quick Resources */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <Link href="/documentation" className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-600/20 transition-all group">
                <FileText className="w-6 h-6 text-slate-400 mb-4 group-hover:text-blue-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Technical Docs</p>
              </Link>
              <Link href="/blog" className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-600/20 transition-all group">
                <HelpCircle className="w-6 h-6 text-slate-400 mb-4 group-hover:text-blue-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Knowledge Base</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
