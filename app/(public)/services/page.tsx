"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, BookOpen, FileText, Briefcase, 
  ShieldCheck, Cpu, Award, Zap, Lightbulb, 
  Clock, RefreshCw, BadgeCheck, Shield, 
  Sparkles, Building2, Fingerprint, ChevronRight,
  ArrowUpRight
} from "lucide-react";
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

const SERVICES = [
  {
    slug: "phd-thesis",
    icon: BookOpen,
    title: "PhD Thesis Help",
    shortDesc: "End-to-end support and drafting for your doctoral research thesis to meet university standards.",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    glow: "group-hover:shadow-blue-600/20",
    deliverables: ["Complete thesis draft", "Plagiarism check", "Unlimited revisions", "Proper formatting"],
  },
  {
    slug: "research-paper",
    icon: FileText,
    title: "Research Papers",
    shortDesc: "High-quality research papers ready for IEEE, Scopus, or other major journals.",
    color: "text-indigo-600",
    bg: "bg-indigo-600/10",
    glow: "group-hover:shadow-indigo-600/20",
    deliverables: ["Ready-to-publish paper", "Plagiarism check", "Peer-review support", "Submission help"],
  },
  {
    slug: "final-year-report",
    icon: Briefcase,
    title: "Final Year Reports",
    shortDesc: "Professional project reports, technical manuals, and documentation for your final year.",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
    glow: "group-hover:shadow-emerald-600/20",
    deliverables: ["PDF & Word files", "References sorted", "Quality check", "48-hour delivery"],
  },
  {
    slug: "design-patent",
    icon: ShieldCheck,
    title: "Design Patent Filing",
    shortDesc: "Protect the unique visual look and feel of your invention with official registration.",
    color: "text-amber-600",
    bg: "bg-amber-600/10",
    glow: "group-hover:shadow-amber-600/20",
    deliverables: ["Application forms", "Technical drawings", "Legal drafting", "Government filing"],
  },
  {
    slug: "utility-patent",
    icon: Cpu,
    title: "Utility Patents",
    shortDesc: "Technical drafting and claims preparation for your functional engineering inventions.",
    color: "text-rose-600",
    bg: "bg-rose-600/10",
    glow: "group-hover:shadow-rose-600/20",
    deliverables: ["Complete specification", "Patent claims", "Diagrams", "Prior art search"],
  },
  {
    slug: "copyright",
    icon: Award,
    title: "Copyright Registration",
    shortDesc: "Officially register your software code, technical manuals, or creative works.",
    color: "text-violet-600",
    bg: "bg-violet-600/10",
    glow: "group-hover:shadow-violet-600/20",
    deliverables: ["Government registration", "Digital certificate", "Source copy", "Legal compliance"],
  },
  {
    slug: "trademark",
    icon: Zap,
    title: "Trademark Registration",
    shortDesc: "Register your startup logo, brand name, or tagline across India securely.",
    color: "text-orange-600",
    bg: "bg-orange-600/10",
    glow: "group-hover:shadow-orange-600/20",
    deliverables: ["Trademark search", "Application filing", "Government fees included", "Status tracking"],
  },
  {
    slug: "mini-project",
    icon: Lightbulb,
    title: "Mini Projects",
    shortDesc: "Pre-built or custom mini-projects featuring high-quality source code and schematics.",
    color: "text-cyan-600",
    bg: "bg-cyan-600/10",
    glow: "group-hover:shadow-cyan-600/20",
    deliverables: ["Source code", "Project report", "Presentation", "Working demo"],
  },
  {
    slug: "major-project",
    icon: Cpu,
    title: "Major Projects",
    shortDesc: "Complex final-year engineering projects for CS, Electronics, and Robotics students.",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    glow: "group-hover:shadow-blue-600/20",
    deliverables: ["Custom development", "Full documentation", "Technical support", "6-month maintenance"],
  },
  {
    slug: "writing-writeups",
    icon: FileText,
    title: "Writing & Writeups",
    shortDesc: "Professional technical writeups and documentation starting at ₹5 per page.",
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-600/10",
    glow: "group-hover:shadow-fuchsia-600/20",
    deliverables: ["Standard (₹5/pg)", "Urgent (₹10/pg)", "Plagiarism report", "Ready to print"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-40 pb-32 bg-slate-50 transition-colors duration-500 relative overflow-hidden">
      {/* Background Cinematic Element */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-600/5 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="container mx-auto px-4 max-w-7xl">
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
          <h1 className="font-heading font-black text-6xl md:text-8xl text-slate-900 tracking-tighter leading-[0.9]">
            Professional <br /><span className="text-blue-600">Solutions</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
            Expert help for students, researchers, and engineers to build and document their ideas.
          </p>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-4 mb-24"
        >
          {[
            { icon: BadgeCheck, text: "High Quality", color: "text-blue-600" },
            { icon: Clock, text: "Fast Delivery", color: "text-slate-900" },
            { icon: Shield, text: "Secure & Private", color: "text-blue-600" },
            { icon: Fingerprint, text: "100% Confidential", color: "text-slate-900" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-slate-900/5 group hover:border-blue-600/30 transition-all cursor-default">
              <b.icon className={`w-4 h-4 ${b.color} group-hover:scale-110 transition-transform`} /> {b.text}
            </div>
          ))}
        </motion.div>

        {/* Services Grid: Our Expertise */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {SERVICES.map((service) => (
            <motion.div 
              key={service.slug} 
              variants={fadeInUp}
              whileHover={{ 
                y: -15,
                rotateX: -5,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              style={{ 
                // @ts-ignore
                "--service-color": service.color.includes('blue') ? '#2563eb' : 
                                   service.color.includes('indigo') ? '#4f46e5' :
                                   service.color.includes('emerald') ? '#059669' :
                                   service.color.includes('amber') ? '#d97706' :
                                   service.color.includes('rose') ? '#e11d48' :
                                   service.color.includes('violet') ? '#7c3aed' :
                                   service.color.includes('orange') ? '#ea580c' :
                                   service.color.includes('cyan') ? '#0891b2' :
                                   service.color.includes('fuchsia') ? '#c026d3' : '#0f172a'
              }}
              className={`group relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-[4rem] p-12 transition-all duration-700 flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] perspective-1000`}
            >
              {/* Stitch-Grade Cyber Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-10 group-hover:opacity-20 transition-opacity" />
              
              {/* Dynamic Gradient Orbs */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.4, 1],
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute -top-24 -right-24 w-80 h-80 ${service.bg.replace('10', '40')} rounded-full blur-[100px] pointer-events-none`}
              />
              
              {/* Prism Border (Hover state) */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 border-[3px] border-transparent rounded-[4rem] bg-gradient-to-br from-white/40 to-transparent pointer-events-none`} />

              <div className="relative z-10">
                <div className={`w-20 h-20 rounded-[1.75rem] ${service.bg.replace('10', '20')} flex items-center justify-center mb-10 border border-white/60 shadow-lg transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-white group-hover:border-transparent group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]`}>
                  <service.icon className={`w-9 h-9 ${service.color} transition-all duration-700`} />
                </div>
              
              <div className="space-y-4 mb-8 flex-grow">
                <h2 className={`font-heading font-black text-2xl tracking-tight leading-tight transition-all duration-500 text-slate-900 group-hover:text-[var(--service-color)] group-hover:drop-shadow-[0_0_15px_var(--service-color)]/20`}>{service.title}</h2>
                <p className="text-slate-400 text-[13px] font-bold leading-relaxed">{service.shortDesc}</p>
              </div>

              <div className="mb-10 space-y-6">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">What You Get</p>
                <ul className="space-y-4">
                  {service.deliverables.map((d) => (
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
                  <Button className={`w-full bg-slate-900 text-white rounded-2xl h-16 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-700 shadow-2xl shadow-slate-900/10 group/btn ${service.color.replace('text-', 'hover:bg-')}`}>
                    Learn More <ArrowUpRight className="ml-3 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
