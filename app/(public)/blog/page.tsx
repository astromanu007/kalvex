"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Search, Calendar, User, ArrowRight, 
  Sparkles, Zap, BookOpen, Clock, 
  ChevronRight, TrendingUp, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const BLOG_POSTS = [
  {
    title: "The Future of Indian Patent Architecture in 2024",
    excerpt: "How AI is revolutionizing the way researchers protect their intellectual property across Tier-1 institutions.",
    author: "Manish Avishkar",
    date: "April 28, 2024",
    readTime: "8 min read",
    category: "IP Strategy",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=1200",
    color: "from-blue-600 to-indigo-600"
  },
  {
    title: "Top 10 Emerging Robotics Trends in IIT Labs",
    excerpt: "Exploring the most innovative robotic prototypes currently being developed in the heart of India's elite labs.",
    author: "Samarth Jadhav",
    date: "April 25, 2024",
    readTime: "12 min read",
    category: "Robotics",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    color: "from-emerald-600 to-teal-600"
  },
  {
    title: "Mastering the Art of IEEE Paper Submission",
    excerpt: "A comprehensive guide for PhD candidates on navigating the complex world of high-authority journal publications.",
    author: "Dr. Rajesh Kumar",
    date: "April 20, 2024",
    readTime: "15 min read",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200",
    color: "from-orange-600 to-red-600"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-32 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[70rem] h-[70rem] bg-blue-50 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-emerald-50 rounded-full -z-10 blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-32 space-y-8"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Sparkles className="w-4 h-4" /> The Kalvex Chronicle
          </div>
          <h1 className="text-7xl md:text-8xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
            Insights for the <br />
            <span className="text-blue-600">Next Gen</span> Innovators.
          </h1>
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Daily Updates
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Expert Analysis
            </div>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-6 mb-20 p-4 bg-white rounded-[3rem] shadow-2xl shadow-slate-900/5 border border-slate-100"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            <input 
              placeholder="Search research, articles, or case studies..."
              className="w-full bg-slate-50 h-16 pl-20 pr-8 rounded-2xl outline-none border border-transparent focus:border-blue-600/20 focus:bg-white transition-all font-bold text-sm"
            />
          </div>
          <Button variant="outline" className="h-16 px-10 rounded-2xl border-slate-100 font-black text-xs uppercase tracking-widest flex items-center gap-4">
            <Filter className="w-4 h-4" /> Filter Categories
          </Button>
        </motion.div>

        {/* Featured Post */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="group relative h-[600px] rounded-[4rem] overflow-hidden mb-32 shadow-2xl shadow-slate-900/10"
        >
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
            alt="Featured" 
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-12 md:p-20 w-full md:max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em]">
              <Zap className="w-4 h-4 fill-current" /> Editor&apos;s Pick
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
              Navigating High-Authority <br />Research Ethics in India
            </h2>
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 p-1 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-white font-black uppercase tracking-widest text-[10px]">Manish Avishkar</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 font-black uppercase tracking-widest text-[10px]">
                <Calendar className="w-4 h-4" /> April 30, 2024
              </div>
              <div className="flex items-center gap-3 text-white/60 font-black uppercase tracking-widest text-[10px]">
                <Clock className="w-4 h-4" /> 10 Min Read
              </div>
            </div>
            <Button className="bg-white hover:bg-blue-600 hover:text-white text-slate-950 h-20 px-12 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 hover:scale-105 group">
              Read Masterpiece <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {BLOG_POSTS.map((post, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -20, 
                rotateY: i % 2 === 0 ? 5 : -5,
                scale: 1.02
              }}
              className="group flex flex-col h-full bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 hover:border-blue-600/20 transition-all duration-500 hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] [transform-style:preserve-3d]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-tr ${post.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 border border-white/20">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-10 flex flex-col flex-grow space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                  {post.title}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">{post.author}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 bg-slate-950 rounded-[5rem] p-16 md:p-32 relative overflow-hidden text-center group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 space-y-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/10 text-blue-400 px-6 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="w-4 h-4" /> Premium Intelligence
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
              Get the Elite <br />Technical Insights.
            </h2>
            <p className="text-slate-400 text-xl font-bold leading-relaxed">
              Join 10,000+ top innovators who receive our curated weekly digest of engineering breakthroughs and IP strategy.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your university email..."
                className="flex-1 h-20 bg-white/5 border border-white/10 rounded-[1.5rem] px-8 text-white focus:border-blue-600 outline-none font-bold transition-all"
              />
              <Button className="h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all duration-500 shadow-2xl shadow-blue-600/30">
                Subscribe Now
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
