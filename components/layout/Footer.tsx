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
              <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center font-heading font-black text-white shadow-xl group-hover:bg-blue-600 transition-all duration-500 group-hover:scale-105">
                <span className="text-xl">K</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-tight text-slate-900">
                  KALVEX
                </span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Empowering engineers and researchers with top-tier technical resources, academic drafting, and hardware solutions.
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

          {/* Column 2: Services */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Services
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Research Drafting", href: "/services/research-paper" },
                { name: "AI Patent Generator", href: "/patent-drafter" },
                { name: "IPR & Copyrights", href: "/ipr" },
                { name: "Engineering Projects", href: "/projects" },
                { name: "Hardware Store", href: "/electronics" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 text-sm hover:text-blue-600 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-[2px] bg-blue-600 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-6 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Company
            </h3>
            <ul className="space-y-4">
              {["About Us", "Blog", "Careers", "Support", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="text-slate-500 text-sm hover:text-blue-600 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-[2px] bg-blue-600 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2 rounded-full" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Security */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" /> Contact
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-slate-500 text-sm leading-relaxed">Hinjewadi Phase 1, <br />Pune, Maharashtra 411057</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  <a href="mailto:contact@kalvex.in" className="text-slate-700 text-sm hover:text-blue-600 transition-colors">contact@kalvex.in</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                  <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-slate-700 text-sm hover:text-emerald-600 transition-colors">WhatsApp Support</a>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">100% Secure Payments</p>
                <p className="text-xs text-slate-500">Powered by Razorpay</p>
              </div>
            </div>
          </div>

        </div>

        {/* Brand Finale */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Kalvex. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-slate-500 text-sm">
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500">System Status: <span className="text-emerald-600">All Systems Operational</span></span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
