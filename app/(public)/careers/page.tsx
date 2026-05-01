"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Zap, Users, Globe, 
  ArrowRight, CheckCircle2, Star, 
  Coffee, Laptop, Rocket, Heart,
  Search, Briefcase, MapPin, Clock,
  ChevronRight, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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

const JOBS = [
  {
    title: "Senior AI Architect",
    category: "Engineering",
    location: "Mumbai / Remote",
    type: "Full Time",
    salary: "₹35L - ₹50L",
    experience: "5+ Years"
  },
  {
    title: "IP Strategy Developer",
    category: "Legal Tech",
    location: "Bangalore",
    type: "Full Time",
    salary: "₹25L - ₹40L",
    experience: "3+ Years"
  },
  {
    title: "Full Stack Developer (Next.js)",
    category: "Product",
    location: "Remote",
    type: "Full Time",
    salary: "₹18L - ₹30L",
    experience: "2+ Years"
  },
  {
    title: "Robotics Research Lead",
    category: "R&D",
    location: "Mumbai Campus",
    type: "Full Time",
    salary: "₹40L+",
    experience: "PhD Preferred"
  }
];

const VALUES = [
  { icon: Zap, title: "Velocity", desc: "We move at the speed of thought, deploying solutions before the world knows they are needed.", color: "from-blue-600 to-indigo-600" },
  { icon: Globe, title: "Impact", desc: "Our engineering serves the billions, solving national-scale challenges with precision.", color: "from-emerald-600 to-teal-600" },
  { icon: Users, title: "Elite Network", desc: "Work with the top 0.1% of engineering talent from Tier-1 institutions globally.", color: "from-purple-600 to-pink-600" }
];

export default function CareersPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-white pt-40 pb-32 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[80rem] h-[80rem] bg-blue-50 rounded-full -z-10 blur-[150px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[60rem] h-[60rem] bg-emerald-50 rounded-full -z-10 blur-[130px] translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto mb-32 space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Rocket className="w-4 h-4" /> Career Architecture
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-7xl md:text-8xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
            Join the <br />
            <span className="text-blue-600">KALVEX</span> Elite.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">
            We are looking for the world&apos;s most ambitious developers, researchers, and strategists to build the high-authority ecosystem of the future.
          </motion.p>
        </motion.div>

        {/* Core Values: 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">
          {VALUES.map((val, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -20, perspective: 1000, rotateY: i % 2 === 0 ? 5 : -5 }}
              className="group bg-white p-12 rounded-[4rem] border border-slate-100 transition-all duration-700 hover:shadow-[0_64px_128px_-24px_rgba(0,0,0,0.1)] hover:border-blue-600/20 [transform-style:preserve-3d]"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${val.color} flex items-center justify-center text-white mb-10 shadow-2xl group-hover:scale-110 transition-transform`}>
                <val.icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{val.title}</h3>
              <p className="text-slate-400 font-bold leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Hiring Protocol: Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Open Transmissions.</h2>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Current Active Opportunities</p>
          </div>
          <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            {["All", "Engineering", "Legal Tech", "Product", "R&D"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "text-slate-400 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings: Premium Clean Design */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {JOBS.filter(j => activeCategory === "All" || j.category === activeCategory).map((job, i) => (
              <motion.div 
                key={job.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ x: 20, scale: 1.01 }}
                className="group bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12 transition-all duration-500 hover:border-blue-600/30 hover:shadow-2xl shadow-slate-900/5 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-2 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-10 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-6 mt-2">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <MapPin className="w-4 h-4 text-blue-600" /> {job.location}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Clock className="w-4 h-4 text-emerald-600" /> {job.type}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 text-right">
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Comp Package</p>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">{job.salary}</p>
                  </div>
                  <Button className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest transition-all duration-500 group-hover:scale-105">
                    Apply Now <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Culture Protocol Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 bg-slate-900 rounded-[5rem] p-16 md:p-32 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 bg-white/5 text-blue-400 px-6 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
                <Heart className="w-4 h-4" /> Living the Protocol
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                Developer <br />Life at Kalvex.
              </h2>
              <div className="space-y-8">
                {[
                  { icon: Laptop, label: "Tech Forward", desc: "Top-of-the-line hardware and unlimited cloud credits for research." },
                  { icon: Coffee, label: "Work-Life Synergy", desc: "Flexible hours, institutional sabbaticals, and premium health plans." },
                  { icon: Building2, label: "Tier-1 Ecosystem", desc: "Headquarters designed for deep-focus and collaborative innovation." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start group/item">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white tracking-tight">{item.label}</p>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100" />
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                <div className="absolute bottom-12 left-12 bg-white/10 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] space-y-2">
                  <p className="text-4xl font-black text-white tracking-tighter">98%</p>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Talent Retention</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <div className="mt-40 text-center space-y-12">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Don&apos;t see a fit?</h2>
          <p className="text-xl text-slate-400 font-bold max-w-2xl mx-auto">
            We are always scouting for elite talent. Send your transmission directly to our development command.
          </p>
          <Button variant="outline" className="h-20 px-12 rounded-[2rem] border-slate-200 text-slate-900 hover:border-blue-600 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all duration-500 group">
            Send Open Transmission <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
