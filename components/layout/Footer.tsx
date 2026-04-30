"use client";

import Link from "next/link";
import { Linkedin, Twitter, Instagram, Youtube, MapPin, Mail, Phone, CheckCircle, Shield, Sparkles, Building2, Globe } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-32 pb-16 relative overflow-hidden">
      {/* Cinematic Background Gradient */}
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-blue-50/50 rounded-full -z-10 blur-[120px] translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          
          {/* Column 1: Institutional Brand */}
          <div className="space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center font-heading font-black text-white shadow-2xl shadow-slate-900/20 group-hover:bg-blue-600 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6">
                <span className="text-xl">K</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-tighter text-slate-900">
                  KALVEX
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Labs Elite</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-bold">
              India&apos;s premier high-authority ecosystem for engineering excellence. Bridging abstract research with professional-grade industrial execution.
            </p>
            <div className="flex items-center space-x-5">
              {[
                { icon: Linkedin, color: "hover:text-[#0077B5]" },
                { icon: Twitter, color: "hover:text-[#1DA1F2]" },
                { icon: Instagram, color: "hover:text-[#E4405F]" },
                { icon: Youtube, color: "hover:text-[#FF0000]" },
              ].map((social, i) => (
                <a key={i} href="#" className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 ${social.color} hover:bg-white hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 hover:border-blue-600/20`}>
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Professional Expertise */}
          <div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 mb-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Professional Units
            </h3>
            <ul className="space-y-5">
              {[
                { name: "PhD Thesis Architecture", href: "/services/phd-thesis" },
                { name: "IEEE Research Drafting", href: "/services/research-paper" },
                { name: "AI Patent Design Lab", href: "/patent-drafter" },
                { name: "IPR & Copyright Secure", href: "/ipr" },
                { name: "Industrial Prototypes", href: "/projects" },
                { name: "Precision Hardware", href: "/electronics" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-600 text-[11px] font-black uppercase tracking-widest hover:text-blue-600 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-[2px] bg-blue-600 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Institutional Governance */}
          <div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 mb-10 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-900" /> Governance
            </h3>
            <ul className="space-y-5">
              {["Corporate Profile", "Institutional Blog", "Career Hub", "Technical Support", "Privacy Protocol", "Service Terms"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="text-slate-600 text-[11px] font-black uppercase tracking-widest hover:text-blue-600 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-[2px] bg-slate-900 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-3 rounded-full" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Headquarters & Security */}
          <div className="space-y-12">
            <div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 mb-10 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" /> Global Node
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                  <span className="text-slate-600 text-[12px] font-bold leading-relaxed">Strategic Hub, Hinjewadi Phase 1, <br />Pune, Maharashtra 411057</span>
                </li>
                <li className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  <a href="mailto:official@kalvex.in" className="text-slate-900 text-[12px] font-black tracking-tighter hover:text-blue-600 transition-colors">official@kalvex.in</a>
                </li>
                <li className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                  <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-slate-900 text-[12px] font-black tracking-tighter hover:text-emerald-600 transition-colors">Direct WhatsApp Counsel</a>
                </li>
              </ul>
            </div>
            
            <div className="p-6 bg-slate-900 rounded-[2rem] flex items-center gap-5 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.3)] border border-slate-800 group hover:border-blue-600/50 transition-all duration-700">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Encrypted Protocol</p>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Razorpay Institutional</p>
              </div>
            </div>
          </div>

        </div>

        {/* Brand Finale */}
        <div className="pt-16 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} Kalvex Institutional Technologies.
            </p>
            <div className="flex items-center space-x-8 text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">Security</Link>
              <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-8 py-3 rounded-full border border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Institutional Grade: <span className="text-blue-600">Verified</span></span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
