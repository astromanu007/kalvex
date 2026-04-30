"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, TrendingUp, Users, Zap, 
  ChevronRight, ArrowRight, Shield, 
  Globe, Cpu, GraduationCap, Building2,
  PlayCircle, BarChart3, Award
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

const SUCCESS_STORIES = [
  {
    title: "AI-Powered Cardiac Diagnostic System",
    client: "National Health Institute",
    category: "Medical Tech",
    stats: { accuracy: "99.2%", processing: "< 10ms", users: "50k+" },
    description: "Developed a deep-learning architecture for real-time heart sound segmentation and anomaly detection, now deployed in rural clinics across India.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",
    color: "from-blue-600 to-indigo-600",
    icon: Zap
  },
  {
    title: "Autonomous Drone Swarm Intelligence",
    client: "Defense Research Wing",
    category: "Defense & Robotics",
    stats: { drones: "128", coordination: "Real-time", latency: "5ms" },
    description: "Architected a decentralized communication protocol for autonomous drone swarms capable of complex environmental mapping in GPS-denied areas.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200",
    color: "from-emerald-600 to-teal-600",
    icon: Cpu
  },
  {
    title: "Institutional Patent Portfolio Growth",
    client: "Top Tier-1 University",
    category: "IP Strategy",
    stats: { growth: "300%", filings: "150+", approval: "92%" },
    description: "Transformed the university's research output into a high-authority patent portfolio through our end-to-end IP engineering and drafting services.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
    color: "from-orange-600 to-red-600",
    icon: Shield
  }
];

export default function SuccessStoriesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-white pt-40 pb-32 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[80rem] h-[80rem] bg-blue-50/50 rounded-full -z-10 blur-[150px] -translate-y-1/2 translate-x-1/4 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[60rem] h-[60rem] bg-emerald-50/50 rounded-full -z-10 blur-[130px] translate-y-1/3 -translate-x-1/4 animate-pulse" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Hero Section: Institutional Excellence */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto mb-32 space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Award className="w-4 h-4" /> Global Impact
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-7xl md:text-8xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
            Architecting <br />
            <span className="text-blue-600 underline decoration-blue-600/20 decoration-8 underline-offset-[12px]">Success</span> Stories.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">
            From deep-tech research to national-scale deployments, explore how we accelerate the world&apos;s most ambitious engineering breakthroughs.
          </motion.p>

          {/* Impact Ticker */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-12 pt-8">
            <div className="text-left">
              <p className="text-4xl font-black text-slate-900 tracking-tighter">500+</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Patents Secured</p>
            </div>
            <div className="w-px h-12 bg-slate-100 hidden md:block" />
            <div className="text-left">
              <p className="text-4xl font-black text-blue-600 tracking-tighter">1.2M+</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Lives Impacted</p>
            </div>
            <div className="w-px h-12 bg-slate-100 hidden md:block" />
            <div className="text-left">
              <p className="text-4xl font-black text-slate-900 tracking-tighter">50+</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Govt Partners</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Featured Case Study: Immersive 3D Experience */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group h-[700px] rounded-[5rem] overflow-hidden mb-40 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.2)] bg-slate-900"
        >
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
            alt="Featured" 
            className="w-full h-full object-cover opacity-50 transition-transform duration-[4s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent" />
          
          <div className="absolute inset-0 p-12 md:p-24 flex flex-col justify-center max-w-4xl space-y-10">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl text-blue-400 px-6 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="w-4 h-4 fill-current" /> Featured Transformation
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">
              Digital Twin for <br />Smart City Grids.
            </h2>
            <p className="text-slate-300 text-xl font-bold leading-relaxed max-w-2xl">
              We engineered a real-time virtual simulation engine that predicts grid failures with 94% accuracy, saving millions in infrastructure downtime.
            </p>
            <div className="flex gap-6 pt-4">
              <Button className="bg-white hover:bg-blue-600 hover:text-white text-slate-950 h-20 px-12 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 hover:scale-105 group">
                View Case Study <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button variant="outline" className="h-20 w-20 rounded-[2rem] border-white/20 text-white hover:bg-white/10 transition-all duration-500">
                <PlayCircle className="w-8 h-8" />
              </Button>
            </div>
          </div>

          {/* Floating Stats Card */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="absolute top-24 right-24 hidden lg:block"
          >
            <div className="bg-white/10 backdrop-blur-3xl border border-white/10 p-12 rounded-[4rem] space-y-8 shadow-2xl">
              <div className="space-y-2 text-center">
                <p className="text-5xl font-black text-white tracking-tighter">94%</p>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Prediction Rate</p>
              </div>
              <div className="h-px bg-white/10 w-32 mx-auto" />
              <div className="space-y-2 text-center">
                <p className="text-5xl font-black text-white tracking-tighter">-$24M</p>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Annual Savings</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {SUCCESS_STORIES.map((story, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -20, 
                rotateY: i % 2 === 0 ? 3 : -3,
                scale: 1.02
              }}
              className="group relative flex flex-col h-[650px] bg-white rounded-[4rem] overflow-hidden border border-slate-100 hover:border-blue-600/20 transition-all duration-700 hover:shadow-[0_64px_128px_-24px_rgba(0,0,0,0.1)] [transform-style:preserve-3d]"
            >
              {/* Image Header */}
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-tr ${story.color} opacity-0 group-hover:opacity-40 transition-opacity duration-700`} />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                
                <div className="absolute top-8 left-8">
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl">
                    <story.icon className="w-6 h-6 text-slate-900" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-12 space-y-8 flex-grow flex flex-col">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{story.category}</p>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
                    {story.title}
                  </h3>
                </div>
                
                <p className="text-slate-400 font-bold text-sm leading-relaxed line-clamp-3">
                  {story.description}
                </p>

                {/* Micro Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                  {Object.entries(story.stats).map(([key, val], idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{key}</p>
                      <p className="text-sm font-black text-slate-900 tracking-tight">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors group/btn">
                    Read Transmission <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Network Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 bg-slate-950 rounded-[5rem] p-16 md:p-32 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
          <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-blue-600/10 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2" />
          
          <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 bg-white/5 text-blue-400 px-6 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
                <Globe className="w-4 h-4" /> Strategic Alliance
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                Collaborate with <br />the Global Elite.
              </h2>
              <p className="text-slate-400 text-xl font-bold leading-relaxed">
                Whether you are a researcher at a top university or a decision-maker at a national lab, we have the architecture to scale your vision.
              </p>
              <div className="flex flex-wrap gap-6">
                <Button className="h-20 px-12 bg-white text-slate-950 hover:bg-blue-600 hover:text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 shadow-2xl">
                  Become a Partner
                </Button>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-14 h-14 rounded-2xl border-4 border-slate-950 overflow-hidden bg-slate-800">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-2xl border-4 border-slate-950 bg-blue-600 flex items-center justify-center text-white text-[10px] font-black tracking-widest">
                    +250
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { icon: Building2, label: "University Partners", val: "120+" },
                  { icon: GraduationCap, label: "PhD Collaborators", val: "850+" },
                  { icon: Shield, label: "Govt. Accreditations", val: "12" },
                  { icon: BarChart3, label: "Success Velocity", val: "98%" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-4 backdrop-blur-xl group/card"
                  >
                    <item.icon className="w-8 h-8 text-blue-500 group-hover/card:scale-110 transition-transform" />
                    <div>
                      <p className="text-4xl font-black text-white tracking-tighter">{item.val}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{item.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
