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
    title: "PhD Thesis Architecture",
    shortDesc: "End-to-end structural engineering and high-fidelity drafting for doctoral research as per Tier-1 institutional standards.",
    color: "text-blue-600",
    bg: "bg-blue-600/5",
    deliverables: ["Full thesis draft", "iThenticate audit", "Unlimited structural revisions", "Standard reference formatting"],
    sku: "KVX-RES-TH01"
  },
  {
    slug: "research-paper",
    icon: FileText,
    title: "IEEE Publication Engineering",
    shortDesc: "High-impact research manuscripts synthesized and submitted to IEEE, Scopus, and high-quantile journals.",
    color: "text-blue-600",
    bg: "bg-blue-600/5",
    deliverables: ["Journal-ready manuscript", "Plagiarism protocol audit", "Peer-review support", "Submission management"],
    sku: "KVX-RES-PP04"
  },
  {
    slug: "final-year-report",
    icon: Briefcase,
    title: "Institutional Project Documentation",
    shortDesc: "Professionally engineered project reports, technical manuals, and dossiers aligned with global academic criteria.",
    color: "text-slate-900",
    bg: "bg-slate-900/5",
    deliverables: ["Formatted PDF + DOCX", "Reference synchronization", "Technical audit report", "48-hour priority delivery"],
    sku: "KVX-ACA-RP09"
  },
  {
    slug: "design-patent",
    icon: ShieldCheck,
    title: "Proprietary Design Filing",
    shortDesc: "Secure the visual identity of your innovation with official Indian Design Patent filing via CGPDTM protocol.",
    color: "text-blue-600",
    bg: "bg-blue-600/5",
    deliverables: ["Representation sheets", "Locarno classification", "Disclosure drafting", "Official form management"],
    sku: "KVX-IPR-DP02"
  },
  {
    slug: "utility-patent",
    icon: Cpu,
    title: "Utility Patent Drafting",
    shortDesc: "Robust claims engineering and technical specification drafting for functional engineering inventions.",
    color: "text-blue-600",
    bg: "bg-blue-600/5",
    deliverables: ["Complete specification", "Claims architecture", "Drafting & diagrams", "Prior art audit"],
    sku: "KVX-IPR-UP07"
  },
  {
    slug: "copyright",
    icon: Award,
    title: "Copyright Legal Protocol",
    shortDesc: "Establish ownership for software logic, proprietary code, technical manuals, and artistic research works.",
    color: "text-slate-900",
    bg: "bg-slate-900/5",
    deliverables: ["Government registration", "Digital audit certificate", "Certified source copy", "Institutional compliance"],
    sku: "KVX-IPR-CR01"
  },
  {
    slug: "trademark",
    icon: Zap,
    title: "Institutional Brand Protection",
    shortDesc: "Register your startup logo, brand nomenclature, or tagline across India under official Trademarks Act governance.",
    color: "text-blue-600",
    bg: "bg-blue-600/5",
    deliverables: ["TM search audit", "Application filing", "Government fees included", "Protocol monitoring"],
    sku: "KVX-IPR-TM03"
  },
  {
    slug: "mini-project",
    icon: Lightbulb,
    title: "Rapid Prototype Development",
    shortDesc: "Pre-built or custom mini-projects for technical validation, featuring high-fidelity source code and schematics.",
    color: "text-blue-600",
    bg: "bg-blue-600/5",
    deliverables: ["Full source repository", "Technical manual", "Presentation deck", "Demonstration module"],
    sku: "KVX-ENG-MP12"
  },
  {
    slug: "major-project",
    icon: Cpu,
    title: "Capstone Engineering Suite",
    shortDesc: "Complex final-year engineering systems across CS, E&TC, Robotics, and Advanced Mechatronics domains.",
    color: "text-blue-600",
    bg: "bg-blue-600/5",
    deliverables: ["Custom development cycle", "Full documentation suite", "Technical support", "6-month maintenance"],
    sku: "KVX-ENG-CP05"
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-40 pb-32 bg-slate-50 transition-colors duration-500 relative overflow-hidden">
      {/* Background Cinematic Element */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-600/5 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header: Institutional Authority */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto mb-24 space-y-8"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Sparkles className="w-4 h-4" /> Expertise Division
          </div>
          <h1 className="font-heading font-black text-6xl md:text-8xl text-slate-900 tracking-tighter leading-[0.9]">
            Professional <br /><span className="text-blue-600">Consultancy</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
            High-authority academic and technical support for doctoral researchers, institutional innovators, and senior engineering students.
          </p>
        </motion.div>

        {/* Strategic Trust Protocol */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-4 mb-24"
        >
          {[
            { icon: BadgeCheck, text: "Institutional Standard", color: "text-blue-600" },
            { icon: Clock, text: "Priority Delivery", color: "text-slate-900" },
            { icon: Shield, text: "Encrypted Compliance", color: "text-blue-600" },
            { icon: Fingerprint, text: "Masked Identity Protocol", color: "text-slate-900" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-slate-900/5 group hover:border-blue-600/30 transition-all cursor-default">
              <b.icon className={`w-4 h-4 ${b.color} group-hover:scale-110 transition-transform`} /> {b.text}
            </div>
          ))}
        </motion.div>

        {/* Services Grid: High-Fidelity Expertise */}
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
              whileHover={{ y: -15 }}
              className="group bg-white border border-slate-100 rounded-[3.5rem] p-12 hover:border-blue-600/20 hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center mb-8 border border-white/50 shadow-sm transition-all duration-700 group-hover:bg-blue-600 group-hover:scale-110 group-hover:-rotate-6`}>
                <service.icon className={`w-7 h-7 ${service.color} group-hover:text-white transition-colors duration-700`} />
              </div>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">{service.sku}</div>
                <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{service.title}</h2>
                <p className="text-slate-400 text-[13px] font-bold leading-relaxed">{service.shortDesc}</p>
              </div>

              <div className="mb-10 space-y-6">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Institutional Deliverables</p>
                <ul className="space-y-4">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors duration-500">
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-white" />
                      </div>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={`/services/${service.slug}`} className="mt-auto">
                <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-2xl h-16 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-700 shadow-2xl shadow-slate-900/10 group/btn">
                  Authorize Brief <ArrowUpRight className="ml-3 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA: Custom Mission Protocol */}
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
                 Initialize <span className="text-blue-600">Custom Mission</span>
               </h2>
               <p className="text-xl text-slate-400 font-bold max-w-xl mx-auto leading-relaxed">
                 Brief our senior engineering council on your unique research parameters for a precision-engineered solution.
               </p>
               <Link href="/contact" className="inline-block">
                 <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_24px_48px_-12px_rgba(37,99,235,0.4)] h-20 px-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 hover:scale-105 hover:-translate-y-2 group/btn2">
                   Request Custom Protocol <ArrowRight className="ml-4 w-5 h-5 group-hover/btn2:translate-x-2 transition-transform" />
                 </Button>
               </Link>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
