"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Network, ChevronRight, Globe, Shield, Zap, Cpu, Sparkles } from "lucide-react";

export default function SitemapPage() {
  const sections = [
    {
      title: "Core Ecosystem",
      icon: Globe,
      links: [
        { name: "Strategic Homepage", href: "/" },
        { name: "Research Drafting", href: "/services/research-paper" },
        { name: "AI Patent Engine", href: "/patent-drafter" },
        { name: "IPR & Licensing", href: "/ipr" },
        { name: "Engineering Projects", href: "/projects" },
      ]
    },
    {
      title: "Resource Nodes",
      icon: Zap,
      links: [
        { name: "Technical Blog", href: "/blog" },
        { name: "Success Stories", href: "/success-stories" },
        { name: "Careers @ KALVEX", href: "/careers" },
        { name: "Resource Center", href: "/resource-center" },
        { name: "Documentation", href: "/documentation" },
      ]
    },
    {
      title: "Intelligence Support",
      icon: Shield,
      links: [
        { name: "Contact Command", href: "/contact" },
        { name: "Strategic Support", href: "/support" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Privacy Framework", href: "/privacy-policy" },
        { name: "Cookie Protocol", href: "/cookies" },
      ]
    },
    {
      title: "Operational Dashboard",
      icon: Cpu,
      links: [
        { name: "User Console", href: "/dashboard" },
        { name: "Order Tracking", href: "/dashboard/orders" },
        { name: "Expert Portal", href: "/dashboard/expert" },
        { name: "Admin Nexus", href: "/dashboard/admin" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.2]" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="space-y-16">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-900/20">
              <Network className="w-10 h-10" />
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Strategic Site Map</h1>
            <p className="text-slate-500 font-medium text-lg italic">Comprehensive mapping of the KALVEX global engineering infrastructure.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">{section.title}</h2>
                </div>

                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link href={link.href} className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-600 group-hover:scale-150 transition-all" />
                        <span className="text-[15px] font-bold tracking-tight">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="pt-16 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Optimized for Institutional Access v2.4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
