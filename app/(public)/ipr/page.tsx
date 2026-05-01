"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, Scale, FileCheck, Globe, 
  Zap, Lock, Briefcase, ChevronRight,
  Sparkles, Award, Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function IPRPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 overflow-hidden relative">
      {/* Cinematic Background */}
      <div className="absolute top-0 right-0 w-[70rem] h-[70rem] bg-indigo-50/50 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3 -z-10" />
      <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-blue-50/40 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 -z-10" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-24"
        >
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/20">
                <Shield className="w-4 h-4" /> Global IP Strategy
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] font-heading">
                Shielding <br />
                <span className="text-indigo-600">Innovation.</span> <br />
                Scaling Impact.
              </h1>
              <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-lg">
                KALVEX provides the world&apos;s most sophisticated legal-technical framework for patent filing, trademark protection, and institutional licensing.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest group shadow-2xl shadow-slate-900/20">
                  Consult an Attorney <ChevronRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-slate-200 font-black text-xs uppercase tracking-widest hover:bg-slate-50">
                  View Fee Schedule
                </Button>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="relative aspect-square flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-blue-50/20 rounded-[4rem] border border-white/50 backdrop-blur-3xl -rotate-6 scale-95" />
              <div className="relative w-full h-full bg-slate-900 rounded-[4rem] p-12 flex flex-col justify-between overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="space-y-6 relative z-10">
                  <Fingerprint className="w-16 h-16 text-indigo-400" />
                  <h3 className="text-3xl font-black text-white tracking-tight">Institutional Proof of Novelty</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">Our AI-driven prior art search engine covers 150+ patent jurisdictions in real-time.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                  {[
                    { label: "Patent Protection", icon: FileCheck },
                    { label: "Trademark Guard", icon: Lock },
                    { label: "License Brokerage", icon: Briefcase },
                    { label: "Global Filing", icon: Globe }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col gap-3">
                      <item.icon className="w-5 h-5 text-indigo-300" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-100">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats/Proof Section */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Patents Filed", val: "2,400+", icon: Award },
              { label: "Success Rate", val: "98.2%", icon: Zap },
              { label: "Global Reach", val: "45+", sub: "Countries", icon: Globe },
              { label: "IP Valuation", val: "$1.2B+", icon: Scale }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{stat.val}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Detailed Services Grid */}
          <div className="space-y-12">
            <motion.div variants={fadeInUp} className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Complete Lifecycle Protection</h2>
              <p className="text-slate-500 font-medium">From initial disclosure to market-ready licensing, KALVEX manages every strategic node of your IP portfolio.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Prior Art Analysis", desc: "Exhaustive global database search using neural semantic matching." },
                { title: "Drafting Excellence", desc: "PhD-grade technical specifications paired with elite legal claims." },
                { title: "PCT Filing", desc: "Single-entry point for global protection in over 150 nations." },
                { title: "Design Patents", desc: "High-fidelity ornamental protection for hardware and industrial design." },
                { title: "Litigation Support", desc: "Full-scale technical auditing for IP enforcement and defense." },
                { title: "Market Valuation", desc: "Data-driven ROI analysis for strategic IP licensing and sale." }
              ].map((service, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
