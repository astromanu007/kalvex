"use client";

import React from "react";
import { 
  Target, Users, Award, ShieldCheck, 
  ArrowRight, Globe, Zap, Heart, Sparkles, Building2, Shield, Fingerprint
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function AboutPage() {
  const stats = [
    { label: "Engineering Assets", value: "500+", icon: Zap },
    { label: "Institutional Experts", value: "50+", icon: Users },
    { label: "IP Applications", value: "120+", icon: Award },
    { label: "Strategic Success", value: "99%", icon: Target },
  ];

  const team = [
    {
      name: "Manish Avishkar Dhatrak",
      role: "Chief Executive Officer",
      quote: "Engineering is the bridge between pure science and the practical needs of humanity. At KALVEX, we build that bridge every day.",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000",
      accent: "rotate-2"
    },
    {
      name: "Samarth Bharat Jadhav",
      role: "Chief Technology Officer",
      quote: "Technology should be invisible yet indispensable. We focus on building tools that empower creators without getting in their way.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000",
      accent: "-rotate-2"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-500 pt-32">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative pb-32 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-50/50 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20 mb-8">
              <Building2 className="w-4 h-4" /> Institutional Profile
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-heading mb-8 text-slate-900 leading-[0.9] tracking-tighter">
              Pioneering the <span className="text-blue-600">Frontiers</span> of IP & Engineering
            </h1>
            <p className="text-2xl text-slate-400 mb-12 leading-relaxed font-bold max-w-3xl">
              KALVEX stands as India&apos;s premier high-authority platform, engineered to bridge the gap between abstract research and professional-grade industrial execution.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/services" className={buttonVariants({ className: "bg-slate-900 hover:bg-blue-600 text-white px-12 rounded-2xl shadow-2xl shadow-slate-900/20 transition-all duration-500 hover:scale-105 font-black text-[11px] uppercase tracking-widest h-20 flex items-center justify-center gap-4" })}>
                View Expertise <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/projects" className={buttonVariants({ variant: "outline", className: "border-slate-200 text-slate-900 rounded-2xl hover:bg-white hover:border-blue-600/30 px-12 font-black text-[11px] uppercase tracking-widest h-20 transition-all flex items-center justify-center" })}>
                Audit Marketplace
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-white border-y border-slate-100"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white text-slate-400 mb-6 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 group-hover:border-blue-500 group-hover:shadow-blue-600/25">
                  <stat.icon className="w-8 h-8 transition-transform group-hover:rotate-12" />
                </div>
                <div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter group-hover:text-blue-600 transition-colors">{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-32"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600 rounded-[5rem] rotate-3 opacity-10 blur-3xl group-hover:rotate-6 transition-transform duration-1000" />
              <div className="relative rounded-[5rem] overflow-hidden border-[12px] border-white shadow-2xl transition-transform duration-700 group-hover:-translate-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                  alt="Engineering Excellence" 
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-slate-900 rounded-[3rem] p-8 flex flex-col justify-center items-center text-center shadow-2xl border border-slate-800 transition-transform duration-700 group-hover:translate-x-4">
                <Sparkles className="w-8 h-8 text-blue-500 mb-3" />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Est. 2024</p>
              </div>
            </div>
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                  <Fingerprint className="w-4 h-4" /> Core Mission
                </div>
                <h2 className="text-5xl font-black text-slate-900 font-heading tracking-tighter leading-tight">Democratizing World-Class <span className="text-blue-600">Engineering</span></h2>
                <p className="text-xl text-slate-400 leading-relaxed font-bold">
                  To establish a unified ecosystem where complex technical challenges meet institutional-grade solutions. We believe that every great invention deserves a prestigious prototype and a legally ironclad patent.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Identity Encryption", desc: "Your strategic intellectual property is safe with our advanced masked identity protocols.", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50", shadow: "hover:shadow-blue-600/10" },
                  { title: "Elite Vetting", desc: "Every project is coordinated by industry-certified engineering consultants.", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50", shadow: "hover:shadow-emerald-600/10" },
                  { title: "Global Recognition", desc: "Empowering Indian innovation to meet global patent standards.", icon: Globe, color: "text-purple-600", bg: "bg-purple-50", shadow: "hover:shadow-purple-600/10" },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 10, scale: 1.02 }}
                    className={`flex gap-8 p-10 rounded-[3rem] border border-slate-100 bg-white shadow-xl shadow-slate-900/5 transition-all duration-500 group ${item.shadow} hover:border-slate-200`}
                  >
                    <div className={`w-20 h-20 rounded-[1.5rem] ${item.bg} flex items-center justify-center ${item.color} shrink-0 group-hover:scale-110 transition-all duration-500 border border-slate-100`}>
                      <item.icon className="w-10 h-10 transition-transform group-hover:rotate-12" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-2">{item.title}</h4>
                      <p className="text-[12px] text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Founders Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-40 bg-white"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-32 space-y-6">
            <div className="inline-flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest">
              <Users className="w-4 h-4" /> Leadership
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-slate-900 font-heading tracking-tighter">The <span className="text-blue-600">Visionaries</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-bold text-xl leading-relaxed">
              &quot;Engineering is not just about assembly; it&apos;s about preempting the challenges of tomorrow with the precision of today.&quot;
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-24">
            {team.map((member, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -20 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-blue-600 rounded-[5rem] ${member.accent} opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-105`} />
                <div className="relative bg-white rounded-[5rem] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden flex flex-col items-center text-center p-16 space-y-12 transition-all duration-500 group-hover:border-blue-600/20">
                  <div className="w-full aspect-square max-w-[400px] rounded-[4rem] overflow-hidden border-[16px] border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-700">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                    />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 font-heading tracking-tighter leading-tight mb-2">{member.name}</h3>
                      <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">{member.role}</p>
                    </div>
                    <div className="w-16 h-1 bg-slate-100 mx-auto rounded-full group-hover:bg-blue-600/30 transition-colors duration-500" />
                    <p className="text-slate-400 text-lg leading-relaxed italic font-bold max-w-md mx-auto">
                      &quot;{member.quote}&quot;
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-32 bg-slate-900 text-white overflow-hidden relative"
      >
        <div className="absolute top-0 left-1/4 w-[60rem] h-[60rem] bg-blue-600/10 blur-[160px] rounded-full -z-0" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-24 space-y-6">
            <div className="inline-flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-widest">
              <Shield className="w-4 h-4" /> Principles
            </div>
            <h2 className="text-5xl font-black font-heading tracking-tighter">Strategic <span className="text-blue-600">Foundation</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Uncompromising Integrity", desc: "Absolute transparency and security in every technical interaction.", icon: ShieldCheck },
              { title: "Relentless Innovation", desc: "Pushing the boundaries of what is technically possible.", icon: Zap },
              { title: "Universal Inclusion", desc: "Democratizing access to high-end engineering expertise.", icon: Heart },
            ].map((value, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="p-16 rounded-[4rem] bg-slate-950/50 border border-slate-800 hover:border-blue-500/50 transition-all group"
              >
                <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-2xl shadow-blue-600/20">
                  <value.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-6 tracking-tight uppercase tracking-widest text-[14px]">{value.title}</h3>
                <p className="text-slate-500 leading-loose font-bold text-sm uppercase tracking-widest">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-32 bg-slate-50"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-[5rem] p-24 text-center border border-slate-100 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] mb-12">
              Join the Elite
            </div>
            <h2 className="text-6xl md:text-8xl font-black mb-12 font-heading tracking-tighter leading-tight text-slate-900">
              Initiate Your <span className="text-blue-600">Breakthrough</span>
            </h2>
            <p className="text-2xl text-slate-400 mb-16 max-w-3xl mx-auto font-bold leading-relaxed">
              Access the KALVEX infrastructure today and transform your technical vision into a world-class institutional asset.
            </p>
            <div className="flex justify-center">
              <Link href="/register" className={buttonVariants({ className: "bg-slate-900 hover:bg-blue-600 text-white h-24 px-16 rounded-[2rem] font-black shadow-2xl transition-all duration-500 hover:scale-105 text-xl uppercase tracking-widest flex items-center justify-center" })}>
                Create Secure Account
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
