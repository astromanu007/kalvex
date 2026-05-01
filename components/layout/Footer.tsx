"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Linkedin, Twitter, Instagram, Youtube, MapPin, Mail, Phone, CheckCircle, Shield, Sparkles, Building2, Globe, Search, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Footer() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide footer on login and register pages (Client-side only)
  if (mounted && (pathname?.startsWith("/login") || pathname?.startsWith("/register"))) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
        setTimeout(() => setIsSubscribed(false), 5000);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Subscription failed. Please try again.");
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Linkedin, color: "group-hover/social:bg-blue-50", borderColor: "group-hover/social:border-blue-200", iconColor: "text-[#0077B5]", label: "LinkedIn", href: "https://linkedin.com/company/kalvex" },
    { icon: Twitter, color: "group-hover/social:bg-sky-50", borderColor: "group-hover/social:border-sky-200", iconColor: "text-[#1DA1F2]", label: "Twitter", href: "https://x.com/kalvex" },
    { icon: Instagram, color: "group-hover/social:bg-pink-50", borderColor: "group-hover/social:border-pink-200", iconColor: "text-[#DD2A7B]", label: "Instagram", href: "https://instagram.com/kalvex" },
    { icon: Youtube, color: "group-hover/social:bg-red-50", borderColor: "group-hover/social:border-red-200", iconColor: "text-[#FF0000]", label: "YouTube", href: "https://youtube.com/@kalvex" },
  ];

  return (
    <footer className="relative overflow-hidden text-slate-900">
      {/* 3D/Geometric Background Section (Global for both parts) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-20" />
        
        {/* Floating 3D Prisms */}
        <motion.div 
          animate={{ y: [0, -40, 0], rotateX: [0, 15, 0], rotateY: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[10%] w-64 h-64 bg-gradient-to-br from-blue-400/10 to-transparent rounded-[2rem] blur-xl border border-blue-200/20 rotate-12"
        />
        
        <div className="absolute inset-0 opacity-[0.03] [perspective:1000px]">
          <div className="absolute inset-0 [transform:rotateX(60deg)] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:80px_80px]" />
        </div>
      </div>

      {/* Section 1: Distinct Pre-Footer CTA */}
      <div className="relative z-10 border-t border-b border-slate-200/60 bg-white/40 backdrop-blur-sm py-24 mb-0">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-white text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 shadow-xl shadow-blue-600/5">
                <Sparkles className="w-4 h-4" /> Our Mission
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] font-heading">
                Building <br />
                <span className="text-blue-600">The Future.</span>
              </h2>
              <p className="text-slate-400 text-xl font-bold leading-relaxed max-w-xl">
                Join India&apos;s leading platform for engineering research and intellectual property.
              </p>
            </div>
            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="relative max-w-2xl">
                <div className="bg-white rounded-[1.25rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] p-1.5 flex flex-col sm:flex-row items-center gap-2 border border-slate-100/50">
                  <div className="flex-1 flex items-center px-5 gap-3 w-full">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your professional email..." 
                      className="flex-1 bg-transparent border-none focus:ring-0 py-4 text-slate-600 text-[15px] font-medium placeholder:text-slate-300 outline-none"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-8 py-4 rounded-[1rem] font-bold text-[14px] transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 group"
                  >
                    <Search className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform" />
                    Subscribe
                  </button>
                </div>
              </form>
              <p className="mt-6 text-[11px] font-medium text-slate-400 text-center lg:text-left flex items-center gap-2 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Join 5,000+ industry professionals receiving our weekly technical briefing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {isSubscribed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 right-10 z-[200] max-w-sm w-full"
          >
            <div className="bg-white rounded-[1.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] p-6 border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Thank You</h4>
                  <button onClick={() => setIsSubscribed(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  We truly appreciate your interest in KALVEX Technologies. You've successfully joined our professional network.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 2: Main Footer Navigation */}
      <div className="bg-slate-50/80 border-t border-slate-200/60 transition-all duration-1000 hover:bg-white group/lower relative overflow-hidden">
        {/* Subtle Background Glow on Section Hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent opacity-0 group-hover/lower:opacity-100 transition-opacity duration-1000" />
        
        <div className="container mx-auto px-6 md:px-12 max-w-7xl py-24 relative z-10">
          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-20">
            
            {/* Column 1: Identity */}
            <div className="space-y-10">
              <Link href="/" className="inline-block group">
                <img 
                  src="/kalvex-logo.png" 
                  alt="KALVEX TECHNOLOGIES" 
                  className="h-12 w-auto object-contain transition-all duration-700 group-hover:scale-105 mix-blend-multiply"
                />
              </Link>
              <p className="text-slate-500 text-[14px] font-medium leading-relaxed max-w-xs group-hover/lower:text-slate-600 transition-colors">
                The premier hub for engineering excellence, hardware manufacturing, and global intellectual property strategy.
              </p>
              <div className="flex items-center gap-5">
                {socialLinks.map((social, i) => (
                  <Link 
                    key={i} 
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-[1rem] bg-white border border-slate-100 flex items-center justify-center transition-all duration-500 hover:-translate-y-2 group/social relative overflow-hidden ${social.borderColor}`}
                  >
                    {/* Brand Light Tint Background */}
                    <div className={`absolute inset-0 opacity-0 group-hover/social:opacity-100 transition-opacity duration-500 ${social.color}`} />
                    
                    <span className="sr-only">{social.label}</span>
                    <social.icon className={`w-5 h-5 relative z-10 transition-all duration-500 ${social.iconColor} group-hover/social:scale-110 group-hover/social:rotate-[360deg]`} />
                    
                    {/* Subtle Glow */}
                    <div className={`absolute inset-0 blur-xl opacity-0 group-hover/social:opacity-20 transition-opacity duration-500 ${social.color}`} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 2: Ecosystem */}
            <div className="space-y-8">
              <div className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-50/50 border border-blue-100/50 overflow-hidden group/header cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/30 to-blue-100/0 -translate-x-full group-hover/header:translate-x-full transition-transform duration-1000" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[12px] font-bold text-blue-900 uppercase tracking-wider">Services</span>
              </div>
              <ul className="space-y-3">
                {[
                  { name: "Research Drafting", href: "/services/research-paper" },
                  { name: "AI Patent Engine", href: "/patent-drafter" },
                  { name: "IPR & Licensing", href: "/ipr" },
                  { name: "Engineering Hub", href: "/projects" },
                  { name: "Component Store", href: "/electronics" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="group/link flex items-center">
                      <div className="relative flex items-center px-4 py-2 rounded-xl transition-all duration-300 group-hover/link:bg-blue-50 group-hover/link:translate-x-1">
                        <ChevronRight className="w-3 h-3 mr-2 text-blue-400 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                        <span className="text-slate-500 group-hover/link:text-blue-900 transition-colors text-[14px] font-semibold">
                          {link.name}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-8">
              <div className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 overflow-hidden group/header cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/0 via-emerald-100/30 to-emerald-100/0 -translate-x-full group-hover/header:translate-x-full transition-transform duration-1000" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] font-bold text-emerald-900 uppercase tracking-wider">Resources</span>
              </div>
              <ul className="space-y-3">
                {[
                  { name: "Success Stories", href: "/success-stories" },
                  { name: "Technical Blog", href: "/blog" },
                  { name: "Resource Center", href: "/resource-center" },
                  { name: "Careers", href: "/careers" },
                  { name: "Documentation", href: "/documentation" },
                  { name: "Contact Us", href: "/contact" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="group/link flex items-center">
                      <div className="relative flex items-center px-4 py-2 rounded-xl transition-all duration-300 group-hover/link:bg-emerald-50 group-hover/link:translate-x-1">
                        <ChevronRight className="w-3 h-3 mr-2 text-emerald-400 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                        <span className="text-slate-500 group-hover/link:text-emerald-900 transition-colors text-[14px] font-semibold">
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Command HQ */}
            <div className="space-y-8">
              <div className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group/header cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200/0 via-slate-200/30 to-slate-200/0 -translate-x-full group-hover/header:translate-x-full transition-transform duration-1000" />
                <div className="w-2 h-2 rounded-full bg-slate-900" />
                <span className="text-[12px] font-bold text-slate-900 uppercase tracking-wider">Headquarters</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-slate-500 text-[14px] font-medium leading-relaxed group-hover/lower:text-slate-600 transition-colors">Hinjewadi Tech Park, Pune, MH 411057</span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href="mailto:contact@kalvex.in" className="text-slate-900 text-[14px] font-bold hover:text-blue-600 transition-colors">contact@kalvex.in</a>
                </li>
              </ul>
              <div className="pt-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group/sec hover:bg-white hover:shadow-xl transition-all duration-500">
                  <Shield className="w-6 h-6 text-slate-900 group-hover/sec:text-blue-600 transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Secure Platform</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Verified Security</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[12px] font-semibold text-slate-400 uppercase tracking-widest">
              <Link href="/terms-of-service" className="hover:text-slate-900 transition-colors">Terms</Link>
              <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy</Link>
              <Link href="/cookies" className="hover:text-slate-900 transition-colors">Cookies</Link>
              <Link href="/sitemap" className="hover:text-slate-900 transition-colors">Sitemap</Link>
            </div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
              © {new Date().getFullYear()} KALVEX TECHNOLOGIES <span className="mx-2 text-slate-200">|</span> ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
