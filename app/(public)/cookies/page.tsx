"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cookie, Shield, Eye, Settings, FileText, ChevronRight } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-12"
        >
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12">
              <Cookie className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Cookie Protocol</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Version 2.4.0 • Updated May 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" /> Essential Operations
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                KALVEX utilizes strictly necessary cookies to manage your institutional sessions, maintain identity masking, and ensure secure database transmissions. These cannot be disabled as they are foundational to the platform&apos;s security protocol.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Settings className="w-6 h-6 text-emerald-600" /> Strategic Analytics
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Node Optimization", desc: "Monitors global latency to optimize content delivery across research sectors." },
                  { title: "User Persistence", desc: "Remembers your dashboard preferences and session configurations." },
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-wider">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4 pt-8 border-t border-slate-50">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-600" /> Consent Management
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                By interacting with the KALVEX Strategic Nexus, you acknowledge the use of these technical protocols. For advanced configuration, please consult our <a href="/privacy-policy" className="text-blue-600 font-bold hover:underline">Privacy Framework</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
