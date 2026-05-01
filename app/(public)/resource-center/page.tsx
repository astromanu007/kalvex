"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, Award, FileText, LifeBuoy, 
  Users, Zap, ArrowRight, Sparkles, 
  Database, Share2, Search, Download,
  Fingerprint, ShieldCheck, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const RESOURCES = [
  {
    title: "Technical Blog",
    desc: "In-depth analysis of emerging engineering trends and AI architectures.",
    icon: BookOpen,
    link: "/blog",
    color: "from-blue-600 to-indigo-600",
    stats: "40+ Articles"
  },
  {
    title: "Success Stories",
    desc: "Explore our most impactful engineering transformations and deployments.",
    icon: Award,
    link: "/success-stories",
    color: "from-emerald-600 to-teal-600",
    stats: "15 Case Studies"
  },
  {
    title: "Documentation",
    desc: "Comprehensive guides, APIs, and technical specifications for our tools.",
    icon: FileText,
    link: "/documentation",
    color: "from-purple-600 to-pink-600",
    stats: "200+ Pages"
  },
  {
    title: "Support Center",
    desc: "Get expert assistance for your technical or IP-related inquiries.",
    icon: LifeBuoy,
    link: "/support",
    color: "from-orange-600 to-red-600",
    stats: "24/7 Expert Help"
  },
  {
    title: "Research Papers",
    desc: "Access our collection of peer-reviewed engineering research publications.",
    icon: Database,
    link: "/blog?category=Academic",
    color: "from-cyan-600 to-blue-600",
    stats: "50+ Publications"
  },
  {
    title: "Expert Network",
    desc: "Connect with our global elite community of developers and IP strategists.",
    icon: Users,
    link: "/careers",
    color: "from-slate-600 to-slate-900",
    stats: "850+ Experts"
  }
];

export default function ResourceCenterPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-32 overflow-hidden relative">
      {/* Immersive Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      <div className="absolute top-0 right-0 w-[80rem] h-[80rem] bg-blue-50 rounded-full -z-10 blur-[150px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[60rem] h-[60rem] bg-emerald-50 rounded-full -z-10 blur-[130px] translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header: Institutional Hub */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-24 space-y-8"
        >
          <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
            <Sparkles className="w-4 h-4 text-blue-400" /> Knowledge Ecosystem
          </div>
          <h1 className="text-7xl md:text-8xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
            The KALVEX <br />
            <span className="text-blue-600">Resource</span> Center.
          </h1>
          <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">
            Access the institutional intelligence required to accelerate your research, protect your IP, and develop the future.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-8 relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            <input 
              placeholder="Search the entire resource ecosystem..."
              className="w-full bg-white h-20 pl-20 pr-8 rounded-[2rem] outline-none border border-slate-100 shadow-2xl shadow-slate-900/5 focus:border-blue-600/20 transition-all font-bold text-sm"
            />
          </div>
        </motion.div>

        {/* Resources Grid: 3D Interaction */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {RESOURCES.map((res, i) => (
            <Link key={i} href={res.link}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ 
                  y: -20, 
                  rotateY: i % 3 === 0 ? 5 : (i % 3 === 2 ? -5 : 0),
                  perspective: 1000
                }}
                className="group relative h-[450px] bg-white rounded-[4rem] p-12 flex flex-col border border-slate-100 transition-all duration-700 hover:shadow-[0_64px_128px_-24px_rgba(0,0,0,0.1)] hover:border-blue-600/20 cursor-pointer overflow-hidden [transform-style:preserve-3d]"
              >
                {/* 3D Glow Background */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${res.color} opacity-0 group-hover:opacity-10 rounded-full blur-[60px] transition-opacity duration-700`} />
                
                <div className="relative z-10 space-y-8 h-full flex flex-col">
                  <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${res.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    <res.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{res.title}</h3>
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{res.stats}</span>
                    </div>
                    <p className="text-slate-400 font-bold leading-relaxed text-sm">
                      {res.desc}
                    </p>
                  </div>

                  <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-50">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-blue-600 transition-colors">Access Resource</span>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:translate-x-2">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Featured Download Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 relative group rounded-[5rem] overflow-hidden shadow-[0_64px_128px_-24px_rgba(15,23,42,0.15)]"
        >
          <div className="absolute inset-0 bg-slate-900" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')] opacity-20 bg-cover bg-center mix-blend-overlay transition-transform duration-[10s] group-hover:scale-110" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 p-16 md:p-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                <Download className="w-4 h-4" /> Technical Whitepaper
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter">
                The State of IP <br />
                <span className="text-blue-500">Engineering</span> 2024.
              </h2>
              <p className="text-slate-400 text-xl font-bold leading-relaxed max-w-xl">
                Download our comprehensive 120-page guide on navigating the new institutional patent landscape in the age of AI.
              </p>
              <Button className="h-20 px-12 bg-white text-slate-900 hover:bg-blue-600 hover:text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 shadow-2xl">
                Download Now (12.4 MB)
              </Button>
            </div>
            
            <div className="hidden lg:flex justify-center relative">
              {/* 3D Floating Book Visual */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-80 h-[480px] bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[3rem] p-1 shadow-[0_64px_128px_-32px_rgba(37,99,235,0.4)] relative [transform-style:preserve-3d] [transform:rotateY(-20deg)rotateX(10deg)] group-hover:[transform:rotateY(0deg)rotateX(0deg)] duration-1000"
              >
                <div className="w-full h-full bg-slate-900 rounded-[2.8rem] p-10 flex flex-col justify-between border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                  <Zap className="w-12 h-12 text-blue-500 relative z-10" />
                  <div className="space-y-4 relative z-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Q2 2024 Edition</p>
                    <p className="text-3xl font-black text-white tracking-tight leading-tight">IP STRATEGY MASTERCLASS</p>
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Fingerprint className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Official Publication</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Global Authority Footer */}
        <div className="mt-32 grid md:grid-cols-3 gap-12 border-t border-slate-100 pt-20">
          {[
            { icon: Globe, label: "Global Standards", val: "ISO 9001:2015" },
            { icon: ShieldCheck, label: "Data Integrity", val: "GDPR Compliant" },
            { icon: Share2, label: "Open Access", val: "Knowledge First" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-900">
                <item.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-lg font-black text-slate-900 tracking-tight">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
