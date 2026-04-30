"use client";

import Link from "next/link";
import { Linkedin, Twitter, Instagram, Youtube, MapPin, Mail, Phone, CheckCircle, Shield, Sparkles, Building2, Globe, Box, Hexagon, Triangle, Circle, Square } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const socialLinks = [
    { icon: Linkedin, color: "hover:bg-[#0077B5]", iconColor: "text-[#0077B5]", label: "LinkedIn" },
    { icon: Twitter, color: "hover:bg-[#1DA1F2]", iconColor: "text-[#1DA1F2]", label: "Twitter" },
    { icon: Instagram, color: "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]", iconColor: "text-[#DD2A7B]", label: "Instagram" },
    { icon: Youtube, color: "hover:bg-[#FF0000]", iconColor: "text-[#FF0000]", label: "YouTube" },
  ];

  return (
    <footer className="bg-slate-50/90 border-t border-slate-200/50 pt-32 pb-12 relative overflow-hidden text-slate-900">
      {/* Immersive Geometric Background Section */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-20" />
        
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[60rem] h-[60rem] bg-blue-100/20 rounded-full blur-[120px] opacity-60"
        />
        
        <motion.div 
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[50rem] h-[50rem] bg-emerald-100/10 rounded-full blur-[100px] opacity-50"
        />

        {/* Geometric Shape Accents */}
        <div className="absolute top-1/4 left-10 w-32 h-32 border border-blue-200/30 rounded-full rotate-12 flex items-center justify-center">
          <div className="w-16 h-16 border border-blue-300/20 rotate-45" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border border-slate-200/30 rotate-12" />
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-blue-100/10 rounded-full blur-sm" />
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        {/* Upper Footer: Professional CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24 border-b border-slate-200/60 mb-20 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-white text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 shadow-xl shadow-blue-600/5">
              <Sparkles className="w-4 h-4" /> Strategic Nexus
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] font-heading">
              Engineering <br />
              <span className="text-blue-600">Pure Potential.</span>
            </h2>
            <p className="text-slate-400 text-xl font-bold leading-relaxed max-w-xl">
              Connect with India&apos;s most authoritative ecosystem for engineering research and IP strategy.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="p-3 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-900/5 group focus-within:shadow-blue-600/10 transition-all duration-500">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Professional Email" 
                  className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-5 text-slate-900 text-sm font-black placeholder:text-slate-300 uppercase tracking-widest"
                />
                <button className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/20">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 lg:gap-12 mb-24">
          
          {/* Column 1: Identity */}
          <div className="space-y-12">
            <Link href="/" className="flex flex-col gap-5 group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center font-black text-white shadow-2xl group-hover:bg-blue-600 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <span className="text-3xl font-heading tracking-widest">K</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-black text-4xl tracking-[-0.08em] text-slate-900 uppercase leading-none">
                    KALVEX
                  </span>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1 leading-none">Institutional</span>
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-[13px] font-bold leading-relaxed max-w-xs uppercase tracking-tight opacity-70">
              High-authority hub for engineering excellence, hardware manufacturing, and global IP strategy.
            </p>
            {/* Social Icons with Brand Colors */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm transition-all duration-500 group/social ${social.color} hover:text-white hover:shadow-xl hover:-translate-y-2`}
                >
                  <social.icon className={`w-5.5 h-5.5 ${social.iconColor} group-hover/social:text-white transition-colors duration-300`} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Ecosystem */}
          <div>
            <h3 className="font-black text-slate-900 mb-12 flex items-center gap-4 uppercase tracking-[0.4em] text-[10px]">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <Hexagon className="w-4 h-4" />
              </div>
              Ecosystem
            </h3>
            <ul className="space-y-6">
              {[
                { name: "Research Drafting", href: "/services/research-paper" },
                { name: "AI Patent Engine", href: "/patent-drafter" },
                { name: "IPR & Licensing", href: "/ipr" },
                { name: "Engineering Hub", href: "/projects" },
                { name: "Component Store", href: "/electronics" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 text-[13px] font-black hover:text-blue-600 flex items-center group transition-colors uppercase tracking-[0.1em]">
                    <motion.span 
                      whileHover={{ width: 24 }}
                      className="w-0 h-[2.5px] bg-blue-600 mr-0 group-hover:mr-4 transition-all duration-500 rounded-full" 
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-black text-slate-900 mb-12 flex items-center gap-4 uppercase tracking-[0.4em] text-[10px]">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Triangle className="w-4 h-4" />
              </div>
              Resources
            </h3>
            <ul className="space-y-6">
              {[
                { name: "Success Stories", href: "/success-stories" },
                { name: "Technical Blog", href: "/blog" },
                { name: "Resource Center", href: "/resource-center" },
                { name: "Careers", href: "/careers" },
                { name: "Documentation", href: "/documentation" },
                { name: "Contact Support", href: "/support" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-400 text-[13px] font-black hover:text-blue-600 flex items-center group transition-colors uppercase tracking-[0.1em]">
                    <motion.span 
                      whileHover={{ width: 24 }}
                      className="w-0 h-[2.5px] bg-blue-600 mr-0 group-hover:mr-4 transition-all duration-500 rounded-full" 
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Command HQ */}
          <div className="space-y-12">
            <div>
              <h3 className="font-black text-slate-900 mb-12 flex items-center gap-4 uppercase tracking-[0.4em] text-[10px]">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                  <Globe className="w-4 h-4" />
                </div>
                Command HQ
              </h3>
              <ul className="space-y-8">
                <li className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-[1rem] bg-white border border-slate-200/50 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-slate-500 text-[13px] font-black leading-relaxed uppercase tracking-widest">Hinjewadi Tech Park, <br />Pune, MH 411057</span>
                </li>
                <li className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-[1rem] bg-white border border-slate-200/50 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <a href="mailto:contact@kalvex.in" className="text-slate-900 text-sm font-black hover:text-blue-600 transition-colors uppercase tracking-widest">CONTACT@KALVEX.IN</a>
                </li>
              </ul>
            </div>
            
            <div className="p-6 bg-white/60 backdrop-blur-md rounded-[2rem] border border-white flex items-center gap-6 shadow-2xl shadow-blue-600/5 group hover:bg-white transition-all duration-700">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-xl group-hover:bg-blue-600 transition-all duration-500">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Network Security</span>
                <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Secure Protocols</span>
              </div>
            </div>
          </div>

        </div>

        {/* Finale Section */}
        <div className="pt-16 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] opacity-60">
              &copy; {new Date().getFullYear()} Kalvex Institutional
            </p>
            <div className="flex items-center gap-10">
              {['Privacy', 'Terms', 'Cookies'].map((link) => (
                <Link key={link} href={`/${link.toLowerCase()}`} className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] hover:text-blue-600 transition-colors">{link}</Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6 px-8 py-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-2xl shadow-slate-900/5">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Protocol Active</span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">v2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
