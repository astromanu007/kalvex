"use client";

import { useState } from "react";
import { 
  Search, Filter, ShoppingBag, Download, 
  Cpu, Code, GraduationCap, ChevronRight,
  Star, Clock, ShieldCheck, Sparkles, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
    features: ["Real-time soil analysis", "Automated irrigation", "Mobile app control"]
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
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    features: ["Immutable records", "Biometric auth", "Real-time results"]
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
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    features: ["SLAM implementation", "Obstacle avoidance", "Path planning"]
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
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    features: ["Load forecasting", "Renewable integration", "Billing system"]
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
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-20 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-widest text-blue-600">
            <Sparkles className="w-3 h-3" />
            Engineering Assets Marketplace
          </div>
          <h1 className="font-heading font-black text-4xl md:text-6xl text-slate-900 tracking-tighter leading-tight">
            Ready-to-Deploy <span className="text-blue-600">Innovations</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            High-fidelity engineering prototypes, source code, and comprehensive documentation for high-stakes research and academic excellence.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col lg:flex-row gap-6 mb-16 items-center"
        >
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search by research area, tech stack, or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[2rem] pl-16 pr-8 py-5 text-slate-900 font-bold focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 shadow-2xl shadow-slate-900/5"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide max-w-full">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20" 
                  : "bg-white border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-600/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {filteredProjects.map(project => (
            <motion.div key={project.id} variants={fadeInUp} className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-blue-600/20 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(15,23,42,0.1)] flex flex-col h-full">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black px-4 py-2 rounded-full border border-white/20 uppercase tracking-widest shadow-sm">
                    {project.type}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(project.rating) ? "text-blue-600 fill-blue-600" : "text-slate-200"}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">{project.rating}</span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">({project.reviews} Reviews)</span>
                </div>

                <h3 className="font-heading font-black text-2xl text-slate-900 mb-4 line-clamp-2 min-h-[4rem] group-hover:text-blue-600 transition-colors leading-tight">
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map(t => (
                    <span key={t} className="text-[9px] font-black bg-slate-50 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>

                <ul className="space-y-3 mb-10">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-500">
                      <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <ChevronRight className="w-3 h-3 text-blue-600" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto">
                  <div>
                    <p className="text-[9px] text-slate-300 uppercase tracking-widest font-black mb-2">Institutional Pricing</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{project.price.toLocaleString()}</span>
                      <span className="text-sm text-slate-300 line-through font-bold">₹{project.mrp.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button className="bg-slate-900 hover:bg-blue-600 text-white shadow-xl shadow-slate-900/10 h-14 w-14 rounded-[1.25rem] transition-all duration-500 group/btn">
                    <ShoppingBag className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Trust Bar */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-0 p-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden"
        >
          <div className="flex items-center gap-6 p-10 hover:bg-slate-50 transition-colors group">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-1">Instant Deployment</h4>
              <p className="text-xs text-slate-400 font-bold">Immediate access to source code and assets.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-10 hover:bg-slate-50 transition-colors border-y md:border-y-0 md:border-x border-slate-50 group">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-slate-900" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-1">Verified Integrity</h4>
              <p className="text-xs text-slate-400 font-bold">Tested by senior research engineers.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-10 hover:bg-slate-50 transition-colors group">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-1">Academic Grade</h4>
              <p className="text-xs text-slate-400 font-bold">Comprehensive IEEE-standard documentation.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
