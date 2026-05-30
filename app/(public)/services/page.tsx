"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Clock, BadgeCheck, Shield,
  Sparkles, Fingerprint, ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThreeScene } from "@/components/ui/ThreeScene";
import { getServices } from "@/app/actions/entities";
import { ICON_MAP } from "@/lib/icons";

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

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pricing Calculator States
  const [selectedService, setSelectedService] = useState("phd-thesis");
  const [calcPages, setCalcPages] = useState(100);
  const [calcUrgent, setCalcUrgent] = useState(false);
  const [calcPlagiarism, setCalcPlagiarism] = useState(false);
  const [calcConsultation, setCalcConsultation] = useState(false);
  const [calcPrinting, setCalcPrinting] = useState(false);
  const [calcComplexity, setCalcComplexity] = useState("Standard");
  const [calcReferences, setCalcReferences] = useState(35);
  const [calcRawDeliverables, setCalcRawDeliverables] = useState(false);
  const [calcPeerReview, setCalcPeerReview] = useState(false);
  const [calcSupport, setCalcSupport] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getServices();
      let dbServices: any[] = res.success && res.services ? res.services : [];
      const hasBlackBook = dbServices.some((s: any) => s.slug === "black-book-printing");
      if (!hasBlackBook) {
        dbServices = [
          ...dbServices,
          {
            slug: "black-book-printing",
            title: "Black Book Printing",
            description: "Premium final year project black book and bond paper printing with gold embossing and rapid 1-2 days delivery across Maharashtra.",
            icon: "BookOpen",
            color: "text-violet-600",
            bg: "bg-violet-600/10",
            deliverables: ["Gold Embossed Hard Bound Book", "Bond Paper Colour Prints", "1-2 Days Fast Delivery", "Vibrant All Pages Colour"]
          }
        ];
      }
      setServices(dbServices);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div
      className="min-h-screen pt-40 pb-32 transition-colors duration-500 relative overflow-hidden bg-slate-50"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <ThreeScene />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
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
          <h1 className="font-heading font-black text-6xl md:text-9xl text-slate-900 tracking-tighter leading-[0.8]">
            Professional <br /><span className="text-blue-600 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">Solutions</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
            Expert help for students, researchers, and engineers to build and document their ideas.
          </p>
        </motion.div>
        {/* Interactive Pricing Calculator */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-24 bg-gradient-to-br from-white via-blue-50/10 to-indigo-50/10 border border-blue-100/60 rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden text-slate-800"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-550/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-96 h-96 bg-indigo-550/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                  💰 LIVE COST ESTIMATOR
                </span>
                <h2 className="font-heading font-black text-3xl md:text-5xl text-slate-900 tracking-tight">
                  Calculate Your <span className="text-blue-600">Plan</span> Estimate
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Select a service and play with options to see instant price changes
                </p>
              </div>

              {/* Service Selection Grid */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Select Service Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "phd-thesis", label: "PhD Thesis", emoji: "🎓" },
                    { id: "research-paper", label: "Research Paper", emoji: "🔬" },
                    { id: "final-year-report", label: "Project Report", emoji: "📄" },
                    { id: "professional-write-ups", label: "Write-ups", emoji: "✍️" },
                    { id: "utility-patent", label: "Utility Patent", emoji: "🛡️" },
                    { id: "major-project", label: "Major Project", emoji: "💻" }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedService(s.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left group hover:-translate-y-0.5 hover:shadow-md ${
                        selectedService === s.id
                          ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-600/5"
                          : "border-slate-100 bg-white hover:border-blue-200"
                      }`}
                    >
                      <span className="text-xl block mb-2">{s.emoji}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest block ${selectedService === s.id ? "text-slate-900" : "text-slate-500"}`}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Sliders for Pages / Scope */}
              {["phd-thesis", "research-paper", "final-year-report", "professional-write-ups"].includes(selectedService) && (
                <div className="space-y-4 bg-white/60 border border-slate-100 p-6 rounded-3xl">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Approximate Page Count</label>
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1 rounded-xl text-xs font-black">{calcPages} Pages</span>
                  </div>
                  
                  <div className="relative h-10 flex items-center">
                    <div className="absolute left-0 right-0 h-2 bg-slate-100 rounded-full" />
                    <div 
                      className="absolute left-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full pointer-events-none transition-all duration-75" 
                      style={{ width: `${(calcPages - 1) / (300 - 1) * 100}%` }}
                    />
                    <input 
                      type="range" 
                      min="1" 
                      max="300" 
                      value={calcPages} 
                      onChange={(e) => setCalcPages(parseInt(e.target.value))} 
                      className="absolute left-0 w-full h-8 appearance-none bg-transparent cursor-pointer focus:outline-none z-10"
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-400 uppercase tracking-widest font-black">
                    <span>1 Page</span>
                    <span>150 Pages</span>
                    <span>300 Pages</span>
                  </div>
                </div>
              )}

              {/* Dynamic Sliders for Complexity and References */}
              {["phd-thesis", "research-paper", "final-year-report", "major-project", "utility-patent"].includes(selectedService) && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4 bg-white/60 border border-slate-100 p-6 rounded-3xl">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Complexity Tier</label>
                      <span className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">{calcComplexity}</span>
                    </div>
                    <div className="relative h-10 flex items-center">
                      <div className="absolute left-0 right-0 h-2 bg-slate-100 rounded-full" />
                      <div 
                        className="absolute left-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full pointer-events-none transition-all duration-75" 
                        style={{ width: `${calcComplexity === "Standard" ? 0 : calcComplexity === "Advanced" ? 50 : 100}%` }}
                      />
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        value={calcComplexity === "Standard" ? 1 : calcComplexity === "Advanced" ? 2 : 3} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setCalcComplexity(val === 1 ? "Standard" : val === 2 ? "Advanced" : "Enterprise PhD");
                        }} 
                        className="absolute left-0 w-full h-8 appearance-none bg-transparent cursor-pointer focus:outline-none z-10"
                      />
                    </div>
                    <div className="flex justify-between text-[7px] text-slate-400 uppercase tracking-widest font-black">
                      <span>Standard</span>
                      <span>Advanced (+25%)</span>
                      <span>Enterprise (+50%)</span>
                    </div>
                  </div>

                  {["phd-thesis", "research-paper"].includes(selectedService) && (
                    <div className="space-y-4 bg-white/60 border border-slate-100 p-6 rounded-3xl">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bibliography References</label>
                        <span className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-xl text-[9px] font-black">{calcReferences} Sources</span>
                      </div>
                      <div className="relative h-10 flex items-center">
                        <div className="absolute left-0 right-0 h-2 bg-slate-100 rounded-full" />
                        <div 
                          className="absolute left-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full pointer-events-none transition-all duration-75" 
                          style={{ width: `${(calcReferences - 10) / (150 - 10) * 100}%` }}
                        />
                        <input 
                          type="range" 
                          min="10" 
                          max="150" 
                          value={calcReferences} 
                          onChange={(e) => setCalcReferences(parseInt(e.target.value))} 
                          className="absolute left-0 w-full h-8 appearance-none bg-transparent cursor-pointer focus:outline-none z-10"
                        />
                      </div>
                      <div className="flex justify-between text-[7px] text-slate-400 uppercase tracking-widest font-black">
                        <span>10 Ref</span>
                        <span>80 Ref</span>
                        <span>150 Ref</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Priority & Add-on Toggles */}
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCalcUrgent(!calcUrgent)}
                  className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                    calcUrgent
                      ? "border-blue-600 bg-blue-50/40"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${calcUrgent ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-450"}`}>
                    ⚡
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest block text-slate-900">Urgent fulfillment</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Priority dispatch & fast delivery</span>
                  </div>
                </button>

                {["phd-thesis", "research-paper", "final-year-report"].includes(selectedService) && (
                  <button
                    type="button"
                    onClick={() => setCalcPlagiarism(!calcPlagiarism)}
                    className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                      calcPlagiarism ? "border-blue-600 bg-blue-50/40" : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${calcPlagiarism ? "bg-emerald-500 text-white font-bold" : "bg-slate-50 text-slate-450"}`}>✓</div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest block text-slate-900">Turnitin Plag Report</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">+₹1,500 add-on fee</span>
                    </div>
                  </button>
                )}

                {selectedService === "utility-patent" && (
                  <button
                    type="button"
                    onClick={() => setCalcConsultation(!calcConsultation)}
                    className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                      calcConsultation ? "border-blue-600 bg-blue-50/40" : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${calcConsultation ? "bg-emerald-500 text-white font-bold" : "bg-slate-50 text-slate-450"}`}>✓</div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest block text-slate-900">Legal Consultation</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">+₹1,000 professional fee</span>
                    </div>
                  </button>
                )}

                {["phd-thesis", "research-paper", "major-project"].includes(selectedService) && (
                  <button
                    type="button"
                    onClick={() => setCalcRawDeliverables(!calcRawDeliverables)}
                    className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                      calcRawDeliverables ? "border-blue-600 bg-blue-50/40" : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${calcRawDeliverables ? "bg-indigo-500 text-white font-bold" : "bg-slate-50 text-slate-450"}`}>📁</div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest block text-slate-900">Raw Source Deliverables</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">+₹4,000 codebase escrow</span>
                    </div>
                  </button>
                )}

                {["phd-thesis", "research-paper"].includes(selectedService) && (
                  <button
                    type="button"
                    onClick={() => setCalcPeerReview(!calcPeerReview)}
                    className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                      calcPeerReview ? "border-blue-600 bg-blue-50/40" : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${calcPeerReview ? "bg-purple-500 text-white font-bold" : "bg-slate-50 text-slate-450"}`}>🔬</div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest block text-slate-900">Peer Review Simulation</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">+₹1,800 audit review</span>
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setCalcSupport(!calcSupport)}
                  className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                    calcSupport ? "border-blue-600 bg-blue-50/40" : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${calcSupport ? "bg-rose-500 text-white font-bold" : "bg-slate-50 text-slate-450"}`}>📞</div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest block text-slate-900">Priority Support Desk</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">+₹2,500 dedicated desk</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Price Card */}
            <div className="lg:col-span-5 bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-800 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
              
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] block mb-4">Calculated Quote</span>
              
              <div className="font-heading font-black text-6xl md:text-7xl text-white mb-6 tracking-tighter flex items-start justify-center gap-1.5 font-sans">
                <span className="text-2xl mt-2 text-blue-500 font-bold font-sans">₹</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-600 font-black font-sans">
                  {(() => {
                    let total = 0;
                    if (selectedService === "phd-thesis") {
                      let base = 25000;
                      base += calcPages * 100;
                      if (calcComplexity === "Advanced") base *= 1.25;
                      else if (calcComplexity === "Enterprise PhD") base *= 1.50;
                      base += calcReferences * 60;
                      if (calcUrgent) base += 5000;
                      if (calcPlagiarism) base += 1500;
                      total = base;
                    } else if (selectedService === "research-paper") {
                      let base = 12500;
                      base += calcPages * 75;
                      if (calcComplexity === "Advanced") base *= 1.25;
                      else if (calcComplexity === "Enterprise PhD") base *= 1.40;
                      base += calcReferences * 40;
                      if (calcUrgent) base += 3000;
                      if (calcPlagiarism) base += 1500;
                      total = base;
                    } else if (selectedService === "final-year-report") {
                      let base = 5000;
                      base += calcPages * 20;
                      if (calcComplexity === "Advanced") base *= 1.20;
                      else if (calcComplexity === "Enterprise PhD") base *= 1.35;
                      if (calcUrgent) base += 1500;
                      if (calcPlagiarism) base += 1500;
                      total = base;
                    } else if (selectedService === "professional-write-ups") {
                      let rate = calcUrgent ? 10 : 5;
                      let base = calcPages * rate;
                      if (calcComplexity === "Advanced") base *= 1.20;
                      else if (calcComplexity === "Enterprise PhD") base *= 1.30;
                      total = base;
                    } else if (selectedService === "utility-patent") {
                      let base = 30000;
                      if (calcComplexity === "Advanced") base *= 1.20;
                      else if (calcComplexity === "Enterprise PhD") base *= 1.40;
                      if (calcConsultation) base += 1000;
                      if (calcUrgent) base += 8000;
                      total = base;
                    } else if (selectedService === "design-patent") {
                      let base = 15000;
                      if (calcComplexity === "Advanced") base *= 1.20;
                      else if (calcComplexity === "Enterprise PhD") base *= 1.35;
                      total = base;
                    } else if (selectedService === "major-project") {
                      let base = calcUrgent ? 29000 : 25000;
                      if (calcComplexity === "Advanced") base *= 1.20;
                      else if (calcComplexity === "Enterprise PhD") base *= 1.35;
                      total = base;
                    } else {
                      total = 10000;
                    }

                    // Add global add-ons
                    if (calcRawDeliverables && ["phd-thesis", "research-paper", "major-project"].includes(selectedService)) total += 4000;
                    if (calcPeerReview && ["phd-thesis", "research-paper"].includes(selectedService)) total += 1800;
                    if (calcSupport) total += 2500;

                    return Math.round(total);
                  })().toLocaleString()}
                </span>
              </div>

              {/* Order Checklist Summary */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-8 text-left space-y-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                <div className="flex justify-between items-center">
                  <span>Selected Rate</span>
                  <span className="text-blue-500 font-black">
                    {selectedService.replace(/-/g, " ")}
                  </span>
                </div>
                {["phd-thesis", "research-paper", "final-year-report", "professional-write-ups"].includes(selectedService) && (
                  <div className="flex justify-between items-center">
                    <span>Scope Volume</span>
                    <span className="text-white font-black">{calcPages} Pages</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Complexity Tier</span>
                  <span className="text-white font-black">{calcComplexity}</span>
                </div>
                {["phd-thesis", "research-paper"].includes(selectedService) && (
                  <div className="flex justify-between items-center">
                    <span>Bibliography Ref</span>
                    <span className="text-white font-black">{calcReferences} Sources</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Urgency Level</span>
                  <span className={`font-black ${calcUrgent ? "text-amber-500" : "text-slate-450"}`}>
                    {calcUrgent ? "⚡ Urgent Delivery" : "⏳ Standard Delivery"}
                  </span>
                </div>
                <div className="h-[1px] bg-slate-800" />
                <div className="flex justify-between items-center text-slate-500 text-[8px]">
                  <span>Fulfillment Duration</span>
                  <span className="text-white">
                    {selectedService === "phd-thesis" ? (calcUrgent ? "15-20 Days" : "30-45 Days") :
                     selectedService === "research-paper" ? (calcUrgent ? "7-10 Days" : "14-21 Days") :
                     selectedService === "utility-patent" ? "21-30 Days" : "5-7 Days"}
                  </span>
                </div>
              </div>

              <Link href={`/services/${selectedService}`}>
                <Button className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-600/10">
                  Proceed to Booking ⚡
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
        {/* Why Choose Us: 3+1 Balanced Layout */}
        <div className="mb-24 space-y-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6"
          >
            {[
              { icon: BadgeCheck, text: "High Quality", color: "text-blue-600", border: "border-blue-100", shadow: "group-hover:shadow-blue-500/20", bg: "from-blue-600 to-blue-400", glow: "bg-blue-400/10", desc: "Institutional Grade" },
              { icon: Clock, text: "Fast Delivery", color: "text-orange-600", border: "border-orange-100", shadow: "group-hover:shadow-orange-500/20", bg: "from-orange-600 to-orange-400", glow: "bg-orange-400/10", desc: "48-hour Turnaround" },
              { icon: Shield, text: "Secure & Private", color: "text-indigo-600", border: "border-indigo-100", shadow: "group-hover:shadow-indigo-500/20", bg: "from-indigo-600 to-indigo-400", glow: "bg-indigo-400/10", desc: "End-to-end Encryption" },
            ].map((b) => (
              <motion.div
                key={b.text}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group min-w-[280px]"
              >
                <div className={`absolute -inset-2 ${b.glow} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                <div className={`bg-white border-2 ${b.border} rounded-2xl px-8 py-6 flex items-center gap-5 shadow-sm ${b.shadow} transition-all duration-500 cursor-pointer relative overflow-hidden group-hover:border-white`}>
                  <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center transition-all duration-500 group-hover:bg-gradient-to-br ${b.bg} shadow-inner`}>
                    <b.icon className={`w-6 h-6 ${b.color} group-hover:text-white transition-all duration-500`} />
                  </div>
                  <div>
                    <div className={`text-xs font-black uppercase tracking-wider ${b.color}`}>{b.text}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{b.desc}</div>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex justify-center"
          >
            {[
              { icon: Fingerprint, text: "100% Confidential", color: "text-rose-600", border: "border-rose-100", shadow: "group-hover:shadow-rose-500/20", bg: "from-rose-600 to-rose-400", glow: "bg-rose-400/10", desc: "Non-Disclosure Assured" },
            ].map((b) => (
              <motion.div
                key={b.text}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group min-w-[280px]"
              >
                <div className={`absolute -inset-2 ${b.glow} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                <div className={`bg-white border-2 ${b.border} rounded-2xl px-8 py-6 flex items-center gap-5 shadow-sm ${b.shadow} transition-all duration-500 cursor-pointer relative overflow-hidden group-hover:border-white`}>
                  <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center transition-all duration-500 group-hover:bg-gradient-to-br ${b.bg} shadow-inner`}>
                    <b.icon className={`w-6 h-6 ${b.color} group-hover:text-white transition-all duration-500`} />
                  </div>
                  <div>
                    <div className={`text-xs font-black uppercase tracking-wider ${b.color}`}>{b.text}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{b.desc}</div>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Services Grid: Our Expertise */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[500px] bg-white/40 rounded-[4rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {services.map((service) => {
                const Icon = ICON_MAP[service.icon] || Sparkles;
                
                // Professional color mapping for dynamic border and text hover
                const colorMap: Record<string, string> = {
                  "text-blue-600": "#2563eb",
                  "text-indigo-600": "#4f46e5",
                  "text-orange-600": "#ea580c",
                  "text-emerald-600": "#059669",
                  "text-cyan-600": "#0891b2",
                  "text-amber-600": "#d97706",
                  "text-rose-600": "#e11d48",
                  "text-violet-600": "#7c3aed",
                  "text-slate-600": "#475569",
                  "text-fuchsia-600": "#c026d3",
                  "text-emerald-500": "#10b981",
                  "text-blue-500": "#3b82f6"
                };
                
                const hexColor = colorMap[service.color] || "#2563eb";
                
                return (
                  <motion.div
                    key={service.slug}
                    variants={fadeInUp}
                    whileHover={{
                      y: -15,
                      rotateX: -2,
                      rotateY: 2,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    }}
                    onTouchMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const touch = e.touches[0];
                      const x = touch.clientX - rect.left;
                      const y = touch.clientY - rect.top;
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    }}
                    onTouchStart={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const touch = e.touches[0];
                      const x = touch.clientX - rect.left;
                      const y = touch.clientY - rect.top;
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    }}
                    style={{ "--hover-color": hexColor } as any}
                    className={`group relative p-[2px] rounded-[4rem] transition-all duration-700 flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] perspective-1000 group-hover:shadow-[0_0_50px_-10px_var(--hover-color)] bg-slate-50`}
                  >
                    {/* Animated Border Trace: kinetic light-beam confined to perimeter */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                      <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_20%,var(--hover-color)_50%,transparent_80%)] animate-[spin_4s_linear_infinite]" />
                    </div>

                    {/* Content Shield: High-opacity backdrop to prevent bleed-through */}
                    <div className="relative h-full w-full bg-white/95 backdrop-blur-2xl rounded-[calc(4rem-2px)] p-12 flex flex-col z-10">
                      {/* Subdued Spotlight Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-40 group-active:opacity-40 transition-opacity duration-500 z-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(37,99,235,0.03), transparent 70%)`,
                        }} />

                      {/* Cyber Grid - Subdued */}
                      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-10 group-hover:opacity-20 transition-opacity rounded-[calc(4rem-2px)]" />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className={`w-20 h-20 rounded-[1.75rem] ${service.bg} flex items-center justify-center mb-10 border border-white/60 shadow-lg transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-white group-hover:border-transparent group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]`}>
                          <Icon className={`w-9 h-9 ${service.color} transition-all duration-700`} />
                        </div>

                        <div className="space-y-4 mb-8 flex-grow">
                          <h2 className={`font-heading font-black text-2xl tracking-tight leading-tight transition-all duration-500 text-slate-900 group-hover:text-[var(--hover-color)]`}>
                            {service.title}
                          </h2>
                          <p className="text-slate-400 text-[13px] font-bold leading-relaxed">{service.description}</p>
                        </div>

                        <div className="mb-10 space-y-6">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Key Deliverables</p>
                          <ul className="space-y-4">
                            {service.deliverables.map((d: string) => (
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
                          <Button className={`w-full bg-slate-900 text-white rounded-2xl h-16 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-700 shadow-2xl shadow-slate-900/10 group/btn hover:bg-blue-600`}>
                            Get Started <ArrowUpRight className="ml-3 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

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
