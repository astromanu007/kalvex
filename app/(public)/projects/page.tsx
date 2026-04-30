"use client";

import { useState } from "react";
import { 
  Search, Filter, ShoppingBag, Download, 
  Cpu, Code, GraduationCap, ChevronRight,
  Star, Clock, ShieldCheck, Sparkles, Zap,
  Fingerprint, Shield, Building2, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
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

const PROJECTS = [
  {
    id: "p1",
    title: "AI-Based Smart Agriculture System",
    category: "Internet of Things",
    type: "Major Project",
    price: 4999,
    mrp: 8999,
    rating: 4.9,
    reviews: 128,
    tech: ["Python", "Arduino", "LoRaWAN", "OpenCV"],
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1200",
    features: ["Real-time soil analysis", "Automated irrigation", "Mobile app control"],
    sku: "KVX-IOT-S01"
  },
  {
    id: "p2",
    title: "Blockchain Secure Voting Platform",
    category: "Cybersecurity",
    type: "Final Year Project",
    price: 5499,
    mrp: 9999,
    rating: 4.8,
    reviews: 94,
    tech: ["Ethereum", "Solidity", "Next.js", "Web3.js"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
    features: ["Immutable records", "Biometric auth", "Real-time results"],
    sku: "KVX-SEC-V04"
  },
  {
    id: "p3",
    title: "Autonomous Warehouse Robot",
    category: "Robotics",
    type: "Minor Project",
    price: 2999,
    mrp: 5999,
    rating: 4.7,
    reviews: 56,
    tech: ["ROS", "C++", "LiDAR", "Raspberry Pi"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    features: ["SLAM implementation", "Obstacle avoidance", "Path planning"],
    sku: "KVX-ROB-R09"
  },
  {
    id: "p4",
    title: "Smart Grid Energy Management",
    category: "Electrical",
    type: "Mini Project",
    price: 1999,
    mrp: 3999,
    rating: 4.6,
    reviews: 42,
    tech: ["MATLAB", "IoT", "React"],
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
    features: ["Load forecasting", "Renewable integration", "Billing system"],
    sku: "KVX-ELE-G02"
  }
];

const CATEGORIES = ["All", "Internet of Things", "Cybersecurity", "Robotics", "Electrical", "Machine Learning"];

export default function ProjectShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProjects = PROJECTS.filter(p => 
    (selectedCategory === "All" || p.category === selectedCategory) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.tech.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-40 pb-32 transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header: Institutional Authority */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-24 space-y-8"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Building2 className="w-4 h-4" /> Innovation Marketplace
          </div>
          <h1 className="font-heading font-black text-6xl md:text-8xl text-slate-900 tracking-tighter leading-[0.9]">
            Ready-to-Deploy <br /><span className="text-blue-600">Breakthroughs</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
            High-fidelity engineering prototypes, proprietary source code, and institutional-grade documentation for Tier-1 research and academic excellence.
          </p>
        </motion.div>

        {/* Search & Intelligence Architecture */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col xl:flex-row gap-8 mb-20 items-center"
        >
          <div className="relative flex-1 w-full group">
            <div className="absolute inset-0 bg-blue-600/5 rounded-[2.5rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-blue-600 transition-all duration-500 z-10" />
            <input 
              type="text"
              placeholder="Audit by research area, technical stack, or SKU nomenclature..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-[2.5rem] pl-20 pr-10 py-7 text-slate-900 font-black text-sm focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200 shadow-2xl shadow-slate-900/5 relative z-0"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 xl:pb-0 scrollbar-hide max-w-full">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-10 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border transition-all duration-500 whitespace-nowrap active:scale-95 ${
                  selectedCategory === cat 
                  ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/20" 
                  : "bg-white border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-600/30 hover:shadow-xl hover:shadow-slate-900/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project Grid: High-Fidelity Assets */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map(project => (
              <motion.div 
                key={project.id} 
                layout
                variants={fadeInUp} 
                whileHover={{ y: -20 }}
                className="group bg-white border border-slate-100 rounded-[4rem] overflow-hidden hover:border-blue-600/20 transition-all duration-700 hover:shadow-[0_64px_128px_-24px_rgba(15,23,42,0.15)] flex flex-col h-full relative"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-50">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                  />
                  <div className="absolute top-8 left-8 z-10">
                    <span className="bg-white/90 backdrop-blur-xl text-slate-900 text-[9px] font-black px-5 py-2.5 rounded-xl border border-white/20 uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10">
                      {project.type}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-8 right-8 z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/40">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="p-12 flex flex-col flex-grow space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-4 rounded-full ${i < Math.floor(project.rating) ? "bg-blue-600" : "bg-slate-100"}`} />
                        ))}
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-3">{project.rating} Grade</span>
                      </div>
                      <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">{project.sku}</span>
                    </div>

                    <h3 className="font-heading font-black text-2xl text-slate-900 line-clamp-2 min-h-[4rem] group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                      <span key={t} className="text-[9px] font-black bg-slate-50 text-slate-400 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-[0.15em] transition-all group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-4 py-8 border-y border-slate-50">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest list-none">
                        <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 transition-colors duration-500">
                          <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-white transition-colors" />
                        </div>
                        <span className="leading-relaxed group-hover:text-slate-600 transition-colors">{f}</span>
                      </li>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-auto">
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-300 uppercase tracking-[0.3em] font-black">Valuation</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{project.price.toLocaleString()}</span>
                        <span className="text-sm text-slate-300 line-through font-bold">₹{project.mrp.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button className="bg-slate-900 hover:bg-blue-600 text-white shadow-2xl shadow-slate-900/20 h-16 w-16 rounded-[1.5rem] transition-all duration-700 group/btn active:scale-90">
                      <ShoppingBag className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Strategic Trust Protocol */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-40 grid grid-cols-1 lg:grid-cols-3 gap-0 p-3 bg-white rounded-[4rem] border border-slate-100 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          <div className="flex items-center gap-8 p-12 hover:bg-slate-50 transition-all duration-700 group border-b lg:border-b-0 lg:border-r border-slate-50">
            <div className="w-20 h-20 rounded-[2rem] bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-xl shadow-blue-600/5 border border-blue-100">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.3em] mb-2">Immediate Deployment</h4>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-loose">Instant authorization for proprietary source code and assets.</p>
            </div>
          </div>
          <div className="flex items-center gap-8 p-12 hover:bg-slate-50 transition-all duration-700 group border-b lg:border-b-0 lg:border-r border-slate-50">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-2xl shadow-slate-900/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.3em] mb-2">Institutional Integrity</h4>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-loose">Exhaustive technical audit by senior research engineers.</p>
            </div>
          </div>
          <div className="flex items-center gap-8 p-12 hover:bg-slate-50 transition-all duration-700 group">
            <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-2xl shadow-blue-600/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.3em] mb-2">Academic Excellence</h4>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-loose">Comprehensive IEEE-standardized research documentation.</p>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-4 bg-slate-900/5 px-10 py-5 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-slate-900/10 group">
            <Fingerprint className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">All Project Data Protected by Masked Identity Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
