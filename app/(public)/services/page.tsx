"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Clock, BadgeCheck, Shield,
  Sparkles, Fingerprint, ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThreeScene } from "@/components/ui/ThreeScene";
import { getServices } from "@/app/actions/entities";
import { ICON_MAP } from "@/lib/icons";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getServices();
      let dbServices: any[] = res.success && res.services ? res.services : [];
      const hasBlackBook = dbServices.some((s: any) => s.slug === "black-book-printing");
      if (!hasBlackBook) {
        dbServices = [
          ...dbServices,
          {
            slug: "black-book-printing",
            title: "Black Book Printing",
            description: "Premium final year project black book and bond paper printing with gold embossing and rapid 1-2 days delivery across Maharashtra.",
            icon: "BookOpen",
            color: "text-violet-600",
            bg: "bg-violet-600/10",
            deliverables: ["Gold Embossed Hard Bound Book", "Bond Paper Colour Prints", "1-2 Days Fast Delivery", "Vibrant All Pages Colour"]
          }
        ];
      }
      setServices(dbServices);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div
      className="min-h-screen pt-40 pb-32 transition-colors duration-500 relative overflow-hidden bg-slate-50"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <ThreeScene />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header: Professional Expertise */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-24 space-y-8"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Sparkles className="w-4 h-4" /> Our Services
          </div>
          <h1 className="font-heading font-black text-6xl md:text-9xl text-slate-900 tracking-tighter leading-[0.8]">
            Professional <br /><span className="text-blue-600 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">Solutions</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
            Expert help for students, researchers, and engineers to build and document their ideas.
          </p>
        </motion.div>

        {/* Why Choose Us: 3+1 Balanced Layout */}
        <div className="mb-24 space-y-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6"
          >
            {[
              { icon: BadgeCheck, text: "High Quality", color: "text-blue-600", border: "border-blue-100", shadow: "group-hover:shadow-blue-500/20", bg: "from-blue-600 to-blue-400", glow: "bg-blue-400/10", desc: "Institutional Grade" },
              { icon: Clock, text: "Fast Delivery", color: "text-orange-600", border: "border-orange-100", shadow: "group-hover:shadow-orange-500/20", bg: "from-orange-600 to-orange-400", glow: "bg-orange-400/10", desc: "48-hour Turnaround" },
              { icon: Shield, text: "Secure & Private", color: "text-indigo-600", border: "border-indigo-100", shadow: "group-hover:shadow-indigo-500/20", bg: "from-indigo-600 to-indigo-400", glow: "bg-indigo-400/10", desc: "End-to-end Encryption" },
            ].map((b) => (
              <motion.div
                key={b.text}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group min-w-[280px]"
              >
                <div className={`absolute -inset-2 ${b.glow} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                <div className={`bg-white border-2 ${b.border} rounded-2xl px-8 py-6 flex items-center gap-5 shadow-sm ${b.shadow} transition-all duration-500 cursor-pointer relative overflow-hidden group-hover:border-white`}>
                  <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center transition-all duration-500 group-hover:bg-gradient-to-br ${b.bg} shadow-inner`}>
                    <b.icon className={`w-6 h-6 ${b.color} group-hover:text-white transition-all duration-500`} />
                  </div>
                  <div>
                    <div className={`text-xs font-black uppercase tracking-wider ${b.color}`}>{b.text}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{b.desc}</div>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex justify-center"
          >
            {[
              { icon: Fingerprint, text: "100% Confidential", color: "text-rose-600", border: "border-rose-100", shadow: "group-hover:shadow-rose-500/20", bg: "from-rose-600 to-rose-400", glow: "bg-rose-400/10", desc: "Non-Disclosure Assured" },
            ].map((b) => (
              <motion.div
                key={b.text}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group min-w-[280px]"
              >
                <div className={`absolute -inset-2 ${b.glow} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                <div className={`bg-white border-2 ${b.border} rounded-2xl px-8 py-6 flex items-center gap-5 shadow-sm ${b.shadow} transition-all duration-500 cursor-pointer relative overflow-hidden group-hover:border-white`}>
                  <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center transition-all duration-500 group-hover:bg-gradient-to-br ${b.bg} shadow-inner`}>
                    <b.icon className={`w-6 h-6 ${b.color} group-hover:text-white transition-all duration-500`} />
                  </div>
                  <div>
                    <div className={`text-xs font-black uppercase tracking-wider ${b.color}`}>{b.text}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{b.desc}</div>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Services Grid: Our Expertise */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[500px] bg-white/40 rounded-[4rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {services.map((service) => {
                const Icon = ICON_MAP[service.icon] || Sparkles;
                
                // Professional color mapping for dynamic border and text hover
                const colorMap: Record<string, string> = {
                  "text-blue-600": "#2563eb",
                  "text-indigo-600": "#4f46e5",
                  "text-orange-600": "#ea580c",
                  "text-emerald-600": "#059669",
                  "text-cyan-600": "#0891b2",
                  "text-amber-600": "#d97706",
                  "text-rose-600": "#e11d48",
                  "text-violet-600": "#7c3aed",
                  "text-slate-600": "#475569",
                  "text-fuchsia-600": "#c026d3",
                  "text-emerald-500": "#10b981",
                  "text-blue-500": "#3b82f6"
                };
                
                const hexColor = colorMap[service.color] || "#2563eb";
                
                return (
                  <motion.div
                    key={service.slug}
                    variants={fadeInUp}
                    whileHover={{
                      y: -15,
                      rotateX: -2,
                      rotateY: 2,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    }}
                    onTouchMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const touch = e.touches[0];
                      const x = touch.clientX - rect.left;
                      const y = touch.clientY - rect.top;
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    }}
                    onTouchStart={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const touch = e.touches[0];
                      const x = touch.clientX - rect.left;
                      const y = touch.clientY - rect.top;
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    }}
                    style={{ "--hover-color": hexColor } as any}
                    className={`group relative p-[2px] rounded-[4rem] transition-all duration-700 flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] perspective-1000 group-hover:shadow-[0_0_50px_-10px_var(--hover-color)] bg-slate-50`}
                  >
                    {/* Animated Border Trace: kinetic light-beam confined to perimeter */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                      <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_20%,var(--hover-color)_50%,transparent_80%)] animate-[spin_4s_linear_infinite]" />
                    </div>

                    {/* Content Shield: High-opacity backdrop to prevent bleed-through */}
                    <div className="relative h-full w-full bg-white/95 backdrop-blur-2xl rounded-[calc(4rem-2px)] p-12 flex flex-col z-10">
                      {/* Subdued Spotlight Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-40 group-active:opacity-40 transition-opacity duration-500 z-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(37,99,235,0.03), transparent 70%)`,
                        }} />

                      {/* Cyber Grid - Subdued */}
                      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-10 group-hover:opacity-20 transition-opacity rounded-[calc(4rem-2px)]" />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className={`w-20 h-20 rounded-[1.75rem] ${service.bg} flex items-center justify-center mb-10 border border-white/60 shadow-lg transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-white group-hover:border-transparent group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]`}>
                          <Icon className={`w-9 h-9 ${service.color} transition-all duration-700`} />
                        </div>

                        <div className="space-y-4 mb-8 flex-grow">
                          <h2 className={`font-heading font-black text-2xl tracking-tight leading-tight transition-all duration-500 text-slate-900 group-hover:text-[var(--hover-color)]`}>
                            {service.title}
                          </h2>
                          <p className="text-slate-400 text-[13px] font-bold leading-relaxed">{service.description}</p>
                        </div>

                        <div className="mb-10 space-y-6">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Key Deliverables</p>
                          <ul className="space-y-4">
                            {service.deliverables.map((d: string) => (
                              <li key={d} className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                                <div className={`w-6 h-6 rounded-lg ${service.bg} flex items-center justify-center shrink-0 transition-colors duration-500`}>
                                  <ChevronRight className={`w-3 h-3 ${service.color} opacity-50`} />
                                </div>
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link href={`/services/${service.slug}`} className="mt-auto">
                          <Button className={`w-full bg-slate-900 text-white rounded-2xl h-16 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-700 shadow-2xl shadow-slate-900/10 group/btn hover:bg-blue-600`}>
                            Get Started <ArrowUpRight className="ml-3 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA: Custom Solutions */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-32 relative group"
        >
          <div className="absolute inset-0 bg-blue-600/5 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 text-center border border-slate-800 shadow-[0_64px_128px_-24px_rgba(15,23,42,0.3)] relative z-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-3xl mx-auto space-y-10">
              <h2 className="font-heading font-black text-4xl md:text-6xl text-white tracking-tighter leading-tight">
                Need Something <span className="text-blue-600">Else?</span>
              </h2>
              <p className="text-xl text-slate-400 font-bold max-w-xl mx-auto leading-relaxed">
                Tell us about your unique project requirements and we will build a custom solution for you.
              </p>
              <Link href="/contact" className="inline-block">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_24px_48px_-12px_rgba(37,99,235,0.4)] h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 hover:scale-105 hover:-translate-y-2 group/btn2">
                  Contact Us <ArrowRight className="ml-4 w-5 h-5 group-hover/btn2:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
