"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, ShoppingBag, Download, 
  Cpu, Code, GraduationCap, ChevronRight,
  Star, Clock, ShieldCheck, Sparkles, Zap,
  Fingerprint, Shield, Building2, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    tech: ["Python", "Arduino", "LoRaWAN"],
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
    features: ["Real-time soil analysis", "Automated irrigation"],
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
    tech: ["Ethereum", "Solidity", "Next.js"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    features: ["Immutable records", "Biometric auth"],
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
    tech: ["ROS", "LiDAR", "Raspberry Pi"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    features: ["SLAM implementation", "Obstacle avoidance"],
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
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    features: ["Load forecasting", "Billing system"],
    sku: "KVX-ELE-G02"
  },
  {
    id: "p5",
    title: "Neural Network Traffic Control",
    category: "Machine Learning",
    type: "Major Project",
    price: 6499,
    mrp: 11999,
    rating: 5.0,
    reviews: 215,
    tech: ["TensorFlow", "OpenCV", "Flask"],
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=800",
    features: ["Object detection", "Dynamic signal timing"],
    sku: "KVX-ML-T88"
  },
  {
    id: "p6",
    title: "Bio-Medical Patient Monitor",
    category: "Internet of Things",
    type: "Final Year Project",
    price: 3499,
    mrp: 6999,
    rating: 4.9,
    reviews: 82,
    tech: ["ESP32", "Firebase", "HealthAPI"],
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
    features: ["ECG streaming", "Alert system"],
    sku: "KVX-BIO-M12"
  },
  {
    id: "p7",
    title: "Cyber-Threat Defense Suite",
    category: "Cybersecurity",
    type: "Major Project",
    price: 7999,
    mrp: 14999,
    rating: 4.8,
    reviews: 110,
    tech: ["Go", "Wireshark", "Docker"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    features: ["Intrusion detection", "Log analysis"],
    sku: "KVX-SEC-D09"
  },
  {
    id: "p8",
    title: "6-DOF Robotic Arm System",
    category: "Robotics",
    type: "Final Year Project",
    price: 8999,
    mrp: 17999,
    rating: 5.0,
    reviews: 64,
    tech: ["C++", "Kinematics", "SolidWorks"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    features: ["Inverse kinematics", "Haptic control"],
    sku: "KVX-ROB-A6D"
  },
  {
    id: "p9",
    title: "Wireless Power Transfer Kit",
    category: "Electrical",
    type: "Minor Project",
    price: 1599,
    mrp: 2999,
    rating: 4.5,
    reviews: 38,
    tech: ["RF Design", "Eagle PCB"],
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    features: ["Inductive coupling", "Efficiency audit"],
    sku: "KVX-ELE-W05"
  },
  {
    id: "p10",
    title: "ML Sentiment Analysis Bot",
    category: "Machine Learning",
    type: "Mini Project",
    price: 1299,
    mrp: 2499,
    rating: 4.6,
    reviews: 52,
    tech: ["NLTK", "FastAPI", "React"],
    image: "https://images.unsplash.com/photo-1531746790731-6c2079ee396f?auto=format&fit=crop&q=80&w=800",
    features: ["Real-time NLP", "Social media scrape"],
    sku: "KVX-ML-S02"
  }
];

const CATEGORIES = ["All", "Internet of Things", "Cybersecurity", "Robotics", "Electrical", "Machine Learning"];

export default function ProjectShopPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  // Eliminate hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (project: any) => {
    if (!session) {
      router.push("/login");
      return;
    }
    alert(`${project.title} added to cart!`);
  };

  const filteredProjects = PROJECTS.filter(p => 
    (selectedCategory === "All" || p.category === selectedCategory) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.tech.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-40 pb-32 transition-colors duration-500 relative overflow-hidden">
      {/* 3D Floating Background Elements - Only render on client to avoid hydration mismatch */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none -z-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                position: "absolute",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                background: i % 2 === 0 
                  ? "linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0.02) 100%)" 
                  : "linear-gradient(135deg, rgba(15,23,42,0.06) 0%, rgba(15,23,42,0.02) 100%)",
                borderRadius: i % 3 === 0 ? "20%" : i % 3 === 1 ? "50%" : "0%",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(2px)",
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 max-w-[1800px]">
        {/* Header: Project Marketplace */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-20 space-y-6"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Building2 className="w-3 h-3" /> Innovation Marketplace
          </div>
          <h1 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter leading-[1]">
            Engineering <span className="text-blue-600">Projects</span>
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Filters Sidebar */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:w-72 shrink-0"
          >
            <div className="sticky top-32 space-y-8">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-black outline-none focus:ring-4 ring-blue-600/5 transition-all shadow-lg shadow-slate-900/5"
                />
              </div>

              {/* Categories */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-lg shadow-slate-900/5 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Filter className="w-3 h-3 text-blue-600" />
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-900">Project Category</p>
                </div>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                        selectedCategory === cat 
                        ? "bg-slate-900 text-white shadow-md" 
                        : "text-slate-400 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      {cat}
                      {selectedCategory === cat && <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Status Trust */}
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white space-y-4 shadow-2xl shadow-slate-900/20">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <p className="text-[9px] font-black uppercase tracking-widest leading-none">Total Projects: {PROJECTS.length}</p>
                </div>
                <p className="text-[8px] opacity-60 leading-relaxed uppercase tracking-widest">High Quality Standards Applied.</p>
              </div>
            </div>
          </motion.div>

          {/* High-Density Grid */}
          <div className="flex-1">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map(project => (
                  <motion.div 
                    key={project.id} 
                    layout
                    variants={fadeInUp} 
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-blue-600/20 transition-all duration-500 hover:shadow-xl flex flex-col h-full"
                  >
                    <div className="relative aspect-[5/4] overflow-hidden bg-slate-50">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[7px] font-black px-2.5 py-1 rounded-md border border-white/20 uppercase tracking-widest shadow-sm">
                          {project.type.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow space-y-4">
                      <h3 className="font-heading font-black text-sm text-slate-900 line-clamp-2 min-h-[2.5rem] leading-tight group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>

                      <div className="flex flex-wrap gap-1">
                        {project.tech.slice(0, 2).map(t => (
                          <span key={t} className="text-[7px] font-black bg-slate-50 text-slate-400 px-2.5 py-1 rounded-md border border-slate-100 uppercase tracking-widest">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-[7px] text-slate-300 uppercase tracking-widest font-black">Price</p>
                          <span className="text-lg font-black text-slate-900">₹{project.price.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => handleAddToCart(project)}
                          className="bg-slate-900 hover:bg-blue-600 text-white h-10 w-10 rounded-xl transition-all duration-300 group/btn"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Strategic Trust Protocol */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: Download, title: "Instant Download", desc: "Immediate source code access." },
            { icon: ShieldCheck, title: "Verified Quality", desc: "Exhaustive technical audit." },
            { icon: GraduationCap, title: "Academic Excellence", desc: "IEEE Standardized documentation." }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-[9px] uppercase tracking-widest mb-1">{item.title}</h4>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
        
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-slate-900/5 px-8 py-4 rounded-full border border-slate-100 group">
            <Shield className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Secure & Encrypted Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}
