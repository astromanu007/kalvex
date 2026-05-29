"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, ShoppingBag, Download,
  Cpu, Code, GraduationCap, ChevronRight,
  Star, Clock, ShieldCheck, Sparkles, Zap,
  Fingerprint, Shield, Building2, ArrowUpRight, Heart, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  useEffect(() => {
    const syncWishlist = () => {
      try {
        const saved = localStorage.getItem("kalvex_saved");
        if (saved) {
          const items = JSON.parse(saved);
          if (Array.isArray(items)) {
            setWishlist(items);
          }
        } else {
          setWishlist([]);
        }
      } catch (err) {}
    };

    syncWishlist();
    window.addEventListener("kalvex-wishlist-updated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("kalvex-wishlist-updated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const toggleWishlist = (project: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const saved = localStorage.getItem("kalvex_saved");
      let items = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(items)) items = [];

      const exists = items.some((i: any) => i.id === project.id);
      if (exists) {
        items = items.filter((i: any) => i.id !== project.id);
      } else {
        items.push({
          id: project.id,
          name: project.title,
          sku: project.sku,
          price: project.price,
          mrp: project.mrp,
          category: project.category,
          qty: 1,
          image: project.image,
        });
      }

      localStorage.setItem("kalvex_saved", JSON.stringify(items));
      window.dispatchEvent(new Event("kalvex-wishlist-updated"));
      
      const toast = document.createElement("div");
      toast.className = "fixed bottom-8 right-8 z-[500] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans text-xs font-bold uppercase tracking-wider";
      toast.innerHTML = exists 
        ? `<span class="text-slate-400">×</span> Removed from wishlist.` 
        : `<span class="text-red-500">❤️</span> Added to wishlist.`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.className += " animate-out fade-out duration-300";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } catch (err) {}
  };

  // Eliminate hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (project: any) => {
    if (!session) {
      router.push("/login");
      return;
    }
    try {
      const stored = localStorage.getItem("kalvex_cart");
      let items: any[] = [];
      if (stored) {
        items = JSON.parse(stored);
      }
      if (!Array.isArray(items)) {
        items = [];
      }
      const existing = items.find((item: any) => item.id === project.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        items.push({
          id: project.id,
          name: project.title,
          sku: project.sku,
          price: project.price,
          mrp: project.mrp,
          category: project.category,
          qty: 1,
          image: project.image,
        });
      }
      localStorage.setItem("kalvex_cart", JSON.stringify(items));
      window.dispatchEvent(new Event("kalvex-cart-updated"));
      
      // MNC Style premium toast feedback
      const toast = document.createElement("div");
      toast.className = "fixed bottom-8 right-8 z-[500] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans text-xs font-bold uppercase tracking-wider";
      toast.innerHTML = `<span class="text-emerald-500">✓</span> ${project.title} added to your procurement inventory`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.className += " animate-out fade-out duration-300";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } catch (err) {
      console.error("Failed to add project to cart:", err);
      alert("Failed to update cart inventory.");
    }
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
            className="lg:w-80 shrink-0"
          >
            <div className="sticky top-32 space-y-8">
              {/* Search: The Pulse Interface */}
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-blue-600/20 rounded-3xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:bg-blue-600/40 transition-all duration-500 blur-[2px]" />

                <div className="relative bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-3xl p-1 shadow-2xl shadow-slate-900/5 group-hover:border-blue-500/50 group-focus-within:border-blue-600 transition-all duration-500">
                  <div className="relative flex items-center">
                    <Search className="absolute left-6 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 group-focus-within:scale-110 transition-all duration-500" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent pl-14 pr-6 py-5 text-[11px] font-black uppercase tracking-widest outline-none text-slate-900 placeholder:text-slate-300 transition-all"
                    />
                    <div className="absolute right-4 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                      ⌘ K
                    </div>
                  </div>
                </div>
              </div>


              {/* Categories: The Neural Grid */}
              <div className="bg-white/40 backdrop-blur-md border border-white rounded-[2.5rem] p-4 shadow-2xl shadow-slate-900/5 relative overflow-hidden group/sidebar">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-1000" />

                <div className="relative p-4">
                  <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                      <Filter className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Expertise</p>
                      <p className="text-[8px] font-bold text-indigo-600/60 uppercase tracking-widest">Filter by Domain</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "All", color: "blue", icon: Sparkles },
                      { name: "Internet of Things", color: "emerald", icon: Cpu },
                      { name: "Cybersecurity", color: "red", icon: Shield },
                      { name: "Robotics", color: "purple", icon: Cpu },
                      { name: "Electrical", color: "amber", icon: Zap },
                      { name: "Machine Learning", color: "indigo", icon: Fingerprint },
                    ].map((cat) => {
                      const isActive = selectedCategory === cat.name;
                      const Icon = cat.icon;

                      return (
                        <motion.button
                          key={cat.name}
                          onClick={() => setSelectedCategory(cat.name)}
                          whileHover={{ scale: 1.02, x: 8 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full group/item relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 ${isActive
                            ? `bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-600/20`
                            : "hover:bg-white text-slate-400 hover:text-slate-900 hover:shadow-xl hover:shadow-slate-900/5"
                            }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${isActive
                            ? `bg-white/20 backdrop-blur-md text-white`
                            : `bg-slate-50 text-slate-300 group-hover/item:bg-${cat.color}-50 group-hover/item:text-${cat.color}-500`
                            }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <span className="text-[10px] font-black uppercase tracking-widest flex-grow text-left">
                            {cat.name}
                          </span>

                          {isActive && (
                            <motion.div
                              layoutId="active-pill"
                              className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Strategic Insights Trust */}
              <div className="relative group/trust overflow-hidden rounded-[2.5rem]">
                <div className="absolute inset-0 bg-slate-900 transition-transform duration-700 group-hover/trust:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                <div className="relative p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover/trust:rotate-12 transition-transform">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Total Assets</p>
                      <p className="text-blue-400 text-2xl font-black tracking-tighter">{PROJECTS.length} Units</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <p className="text-[8px] text-white/60 font-black uppercase tracking-widest leading-none">Security Verified</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <p className="text-[8px] text-white/60 font-black uppercase tracking-widest leading-none">Immediate Access</p>
                    </div>
                  </div>
                </div>
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
                      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={(e) => toggleWishlist(project, e)}
                          className={`w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:shadow-md transition-all border border-white/20 ${
                            wishlist.some(i => i.id === project.id) ? "text-red-500 bg-red-50" : "text-slate-400 hover:text-red-500"
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${wishlist.some(i => i.id === project.id) ? "fill-red-500" : ""}`} />
                        </button>
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

            {/* Custom Project CTA Button */}
            <div className="mt-16 text-center pb-8 border-b border-slate-100 flex justify-center">
              <button 
                onClick={() => setShowCustomizeModal(true)}
                className="group relative inline-flex items-center justify-center bg-white px-10 py-5 rounded-[2rem] border-2 border-slate-100 hover:border-transparent transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                <div className="absolute inset-[-2px] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-600 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
                
                <div className="relative z-10 flex items-center gap-3 bg-white px-8 py-3 rounded-full group-hover:bg-transparent transition-colors duration-300">
                  <Sparkles className="w-5 h-5 text-fuchsia-500 group-hover:text-white transition-colors" />
                  <span className="font-black text-sm uppercase tracking-widest text-slate-800 group-hover:text-white transition-colors">
                    Can't find your project? Customize
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Strategic Trust Protocol: The Institutional Guard */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Download,
              title: "Instant Download",
              desc: "Immediate source code access.",
              theme: "from-blue-600 to-indigo-600",
              lightTheme: "bg-blue-50/50",
              iconColor: "text-blue-600",
              hoverColor: "group-hover:text-blue-600"
            },
            {
              icon: ShieldCheck,
              title: "Verified Quality",
              desc: "Exhaustive technical audit.",
              theme: "from-emerald-600 to-teal-600",
              lightTheme: "bg-emerald-50/50",
              iconColor: "text-emerald-600",
              hoverColor: "group-hover:text-emerald-600"
            },
            {
              icon: GraduationCap,
              title: "Academic Excellence",
              desc: "IEEE Standardized documentation.",
              theme: "from-purple-600 to-indigo-600",
              lightTheme: "bg-purple-50/50",
              iconColor: "text-purple-600",
              hoverColor: "group-hover:text-purple-600"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-900/5 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.theme} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="flex flex-col gap-6 relative">
                <div className={`w-16 h-16 rounded-2xl ${item.lightTheme} flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-sm`}>
                  <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                </div>
                <div>
                  <h4 className={`font-black text-slate-900 text-[13px] md:text-[15px] uppercase tracking-[0.2em] mb-3 transition-colors duration-500 ${item.hoverColor}`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] md:text-[12px] text-slate-400 font-bold uppercase tracking-widest leading-loose transition-colors duration-500 group-hover:text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      <AnimatePresence>
        {showCustomizeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowCustomizeModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[3rem] p-10 relative shadow-2xl border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowCustomizeModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-fuchsia-50 text-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-3xl text-slate-900 tracking-tight">Customize Your Project</h3>
                <p className="text-slate-500 font-bold mt-3 max-w-sm mx-auto">Select the complexity level to get started with your custom requirement.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <button 
                  onClick={() => router.push("/services/major-project")}
                  className="group relative bg-white border-2 border-slate-100 rounded-3xl p-6 text-left hover:border-indigo-600 transition-colors"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Major Project</h4>
                  <p className="text-slate-400 text-[10px] font-bold leading-relaxed">Complex, end-to-end hardware/software systems suitable for final year submissions.</p>
                </button>

                <button 
                  onClick={() => router.push("/services/mini-project")}
                  className="group relative bg-white border-2 border-slate-100 rounded-3xl p-6 text-left hover:border-teal-600 transition-colors"
                >
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Mini Project</h4>
                  <p className="text-slate-400 text-[10px] font-bold leading-relaxed">Simpler, focused implementations perfect for semester or internal projects.</p>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
