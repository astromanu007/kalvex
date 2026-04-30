"use client";

import React from "react";
import { 
  Target, Users, Award, ShieldCheck, 
  ArrowRight, Globe, Zap, Heart, Sparkles, Building2, Shield, Fingerprint,
  Cpu, Rocket, Lightbulb, Workflow, Star, Instagram, Linkedin, Twitter
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  
  const stats = [
    { label: "Engineering Assets", value: "500+", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Institutional Experts", value: "50+", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "IP Applications", value: "120+", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Strategic Success", value: "99%", icon: Target, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const team = [
    {
      name: "Manish Avishkar Dhatrak",
      role: "Chief Executive Officer",
      quote: "Engineering is the bridge between pure science and the practical needs of humanity. At KALVEX, we build that bridge every day.",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000",
      accent: "from-blue-600/20 to-indigo-600/20",
      iconColor: "text-blue-600"
    },
    {
      name: "Samarth Bharat Jadhav",
      role: "Chief Technology Officer",
      quote: "Technology should be invisible yet indispensable. We focus on building tools that empower creators without getting in their way.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000",
      accent: "from-emerald-600/20 to-teal-600/20",
      iconColor: "text-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white transition-colors duration-500 overflow-hidden text-slate-900">
      {/* Refined Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-50 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-10"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-blue-100 shadow-sm">
                <Building2 className="w-4 h-4" /> Institutional Protocol
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-6xl md:text-7xl font-black font-heading text-slate-900 leading-[1] tracking-tight">
                Architecting the Nexus of <br />
                <span className="text-blue-600">Engineering Authority.</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl">
                KALVEX is India&apos;s premier ecosystem for high-stakes engineering research, industrial-grade execution, and strategic IP protection.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-5 pt-2">
                <Link href="/services" className={buttonVariants({ className: "bg-slate-900 hover:bg-blue-600 text-white px-10 rounded-2xl transition-all duration-500 font-black text-xs uppercase tracking-[0.15em] h-16 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:scale-105" })}>
                  Explore Expertise <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/projects" className={buttonVariants({ variant: "outline", className: "border-slate-200 text-slate-600 rounded-2xl hover:bg-white hover:border-blue-600/30 px-10 font-black text-xs uppercase tracking-[0.15em] h-16 transition-all flex items-center justify-center bg-white/50 backdrop-blur-md" })}>
                  Marketplace Audit
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="relative p-8">
                {/* 3D Glass Ornament */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 to-transparent rounded-[4rem] -z-10 blur-2xl" />
                <div className="relative rounded-[3.5rem] overflow-hidden border border-white shadow-2xl bg-white/80 backdrop-blur-md p-3 group">
                  <img 
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" 
                    className="w-full aspect-[4/5] object-cover rounded-[3rem] transition-transform duration-1000 group-hover:scale-110"
                    alt="Institutional Excellence"
                  />
                  <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors duration-700" />
                </div>
                
                {/* Floating Micro-UI */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 flex items-center gap-4 z-20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Status</p>
                    <p className="text-sm font-black text-slate-900 tracking-tight">IP Masking Active</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Neat Stats Section */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fantastic Visionaries Section */}
      <section className="py-40 relative overflow-hidden">
        {/* Dynamic Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100rem] h-[100rem] bg-[radial-gradient(#3b82f610_1px,transparent_1px)] [background-size:40px_40px] opacity-40 -z-10" />
        <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-blue-50/30 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-emerald-50/30 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-32 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]"
            >
              <Users className="w-5 h-5" /> The Strategic Command
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black text-slate-900 font-heading tracking-tighter leading-tight"
            >
              The <span className="text-blue-600">Visionaries.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-slate-400 font-bold text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Architecting the bridge between pure science and industrial-grade execution.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 md:gap-24">
            {team.map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="group flex flex-col space-y-12"
              >
                {/* Massive 3D Image Container */}
                <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-[5rem] overflow-hidden shadow-2xl border-[16px] border-white bg-slate-50 transition-all duration-1000 group-hover:shadow-[0_64px_128px_-24px_rgba(59,130,246,0.2)]">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${member.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                  />
                  
                  {/* Floating Socials on Image */}
                  <div className="absolute bottom-12 right-12 flex flex-col gap-4 translate-x-20 group-hover:translate-x-0 transition-transform duration-700 delay-100">
                    {[Linkedin, Twitter, Instagram].map((Icon, idx) => (
                      <button key={idx} className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        <Icon className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Container Below Image */}
                <div className="px-6 md:px-12 space-y-8">
                  <div className="space-y-4">
                    <motion.div 
                      whileInView={{ width: [0, 80] }}
                      className="h-1.5 bg-blue-600 rounded-full" 
                    />
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-2">
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px]">
                          {member.role}
                        </p>
                      </div>
                      <div className={`w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center ${member.iconColor} group-hover:bg-blue-600 group-hover:text-white transition-all duration-500`}>
                        <Star className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xl text-slate-400 font-bold leading-relaxed italic border-l-4 border-slate-100 pl-8 group-hover:border-blue-600/30 transition-colors duration-500">
                    &quot;{member.quote}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Mission: Professional Clean Grid */}
      <section className="py-32 bg-slate-50/50 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">The KALVEX Protocol</p>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">Professional Engineering <br />for Global Impact.</h2>
                <p className="text-xl text-slate-400 font-bold leading-relaxed">
                  Every technical challenge deserves an institutional-grade solution. We provide the architecture to scale your vision.
                </p>
              </div>
              <div className="grid gap-6">
                {[
                  { title: "Institutional Reliability", desc: "Military-grade precision in every technical interaction and project deployment.", icon: ShieldCheck },
                  { title: "Strategic IP Guard", desc: "Identity-masked protocols ensuring your innovations remain your exclusive property.", icon: Fingerprint }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8 p-8 rounded-[3rem] bg-white border border-slate-100 hover:border-blue-600/20 transition-all group shadow-sm hover:shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{item.title}</h4>
                      <p className="text-sm text-slate-400 font-bold leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white group">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" className="w-full aspect-square object-cover transition-transform duration-[5s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-600/10 group-hover:opacity-0 transition-opacity duration-1000" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-700 delay-200">
                  <Zap className="w-10 h-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <section className="py-40">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-[5rem] p-24 text-center border border-slate-100 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.08)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-50/50 rounded-full -z-10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 space-y-12">
              <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border border-blue-100">
                Join the Elite Network
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                Initiate Your <br />
                <span className="text-blue-600">Breakthrough.</span>
              </h2>
              <p className="text-2xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">
                Transform your technical vision into a world-class institutional asset with the KALVEX infrastructure.
              </p>
              <div className="flex justify-center pt-8">
                <Link href="/contact" className="group flex items-center gap-6 bg-slate-900 hover:bg-blue-600 text-white px-16 h-24 rounded-[2.5rem] transition-all duration-700 hover:scale-105 shadow-2xl">
                  <span className="font-black text-xl uppercase tracking-widest">Connect with Command</span>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
