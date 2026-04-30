"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, BookOpen, Cpu, ShieldCheck, Briefcase, 
  Award, Zap, Lightbulb, FileText, CheckCircle, 
  Sparkles, Globe, Shield, Fingerprint, Building2,
  ChevronRight, Star
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
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-20 bg-slate-50 transition-colors duration-500">
      {/* SECTION 1 - HERO: INSTITUTIONAL PRECISION */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative min-h-[95vh] flex items-center bg-white overflow-hidden pb-20"
      >
        {/* Cinematic Background Elements */}
        <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-blue-50/50 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-slate-50 rounded-full -z-10 blur-[100px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.15]" />

        <div className="container mx-auto px-4 z-10 pt-20 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7 space-y-12">
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
                  <Sparkles className="w-4 h-4" /> India&apos;s Elite IP Platform
                </div>
                <h1 className="font-heading font-black text-6xl md:text-8xl leading-[0.9] text-slate-900 tracking-tighter">
                  Engineering <br />
                  <span className="text-blue-600">Dominance.</span> <br />
                  Institutionalized.
                </h1>
                <p className="text-2xl text-slate-400 max-w-2xl leading-relaxed font-bold">
                  Empowering the next tier of global innovators with high-authority academic support, AI-driven patent architecture, and aerospace-grade electronics.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6">
                <Link href="/services" className="w-full sm:w-auto">
                  <Button className="bg-slate-900 hover:bg-blue-600 text-white h-20 px-12 rounded-[2rem] shadow-2xl shadow-slate-900/20 transition-all duration-500 hover:scale-105 font-black text-[11px] uppercase tracking-widest group w-full">
                    Deploy Expertise <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link href="/electronics" className="w-full sm:w-auto">
                  <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-white hover:border-blue-600/30 h-20 px-12 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all w-full">
                    Audit Hardware Lab
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="pt-8 flex flex-wrap items-center gap-12">
                <div className="space-y-2">
                  <div className="text-4xl font-black text-slate-900 tracking-tighter">10K+</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Global Innovators</div>
                </div>
                <div className="w-px h-12 bg-slate-100 hidden md:block" />
                <div className="space-y-2">
                  <div className="text-4xl font-black text-slate-900 tracking-tighter">500+</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Commissions</div>
                </div>
                <div className="w-px h-12 bg-slate-100 hidden md:block" />
                <div className="space-y-2">
                  <div className="text-4xl font-black text-slate-900 tracking-tighter">120+</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Patents Secured</div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              variants={fadeInUp}
              className="lg:col-span-5 relative group"
            >
              <div className="absolute -inset-10 bg-blue-600/5 rounded-[5rem] rotate-3 blur-3xl group-hover:rotate-6 transition-transform duration-1000" />
              <div className="relative rounded-[5rem] overflow-hidden border-[12px] border-white shadow-[0_64px_128px_-24px_rgba(0,0,0,0.15)] bg-slate-100 transition-all duration-700 group-hover:-translate-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                  alt="Elite Engineering" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white rounded-[3rem] p-6 shadow-2xl flex flex-col justify-center items-center text-center border border-slate-50 transition-all duration-700 group-hover:scale-110">
                <Award className="w-10 h-10 text-blue-600 mb-2" />
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Certified ISO 9001</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 2 - INSTITUTIONAL MARQUEE */}
      <section className="py-20 bg-white border-y border-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 mb-12 max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Official Institutional Calibration</p>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        </div>
        <div className="relative flex overflow-x-hidden opacity-20 group">
          <div className="animate-marquee whitespace-nowrap flex items-center space-x-32">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="text-4xl font-heading font-black text-slate-900 tracking-tighter uppercase">
                Directorate of Research {i}
              </div>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center space-x-32">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={`dup-${i}`} className="text-4xl font-heading font-black text-slate-900 tracking-tighter uppercase">
                Directorate of Research {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - SERVICES: THE ECOSYSTEM */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-32 bg-slate-50"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div variants={fadeInUp} className="text-center mb-24 space-y-6">
            <div className="inline-flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest">
              <Building2 className="w-4 h-4" /> Strategic Operations
            </div>
            <h2 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter">Unified Solution <span className="text-blue-600">Framework</span></h2>
            <p className="text-slate-400 text-xl font-bold max-w-3xl mx-auto">Providing high-stakes technical architecture for India&apos;s leading engineering minds.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: BookOpen, title: "PhD Architecture", desc: "End-to-end technical construction and institutional formatting for doctoral thesis." },
              { icon: FileText, title: "Strategic Research", desc: "High-impact paper engineering for Tier-1 journals including IEEE and Springer." },
              { icon: Briefcase, title: "Senior Reports", desc: "Professionally calibrated technical documentation for graduation audits." },
              { icon: ShieldCheck, title: "IP Strategy", desc: "Securing visual innovation through comprehensive Design Patent filings." },
              { icon: Cpu, title: "Utility IP", desc: "Constructing robust legal claims for functional engineering breakthroughs." },
              { icon: Award, title: "Copyright Secure", desc: "Absolute protection for software kernels and technical literature." },
            ].map((service, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -15 }}
                className="group p-12 rounded-[3.5rem] bg-white border border-slate-100 hover:border-blue-600/20 hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-bl-[4rem] translate-x-16 -translate-y-16 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700" />
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-blue-500 shadow-sm">
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl mb-6 text-slate-900 tracking-tight">{service.title}</h3>
                <p className="text-slate-400 text-[13px] font-bold uppercase tracking-widest leading-loose mb-10 flex-grow">{service.desc}</p>
                <Link href={`/services/${service.title.toLowerCase().replace(/ /g, '-')}`}>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 group/btn">
                    Initiate Audit <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 4 - AI LABS: REVOLUTIONARY IP */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-32 bg-slate-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80rem] h-[80rem] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-blue-400 px-6 py-2 rounded-xl backdrop-blur-xl">
                <Zap className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">Kalvex AI Labs v3.0</span>
              </div>
              <h2 className="font-heading font-black text-5xl md:text-7xl text-white leading-[0.95] tracking-tighter">
                Autonomous <br /><span className="text-blue-500">IP Generation</span> <br />at Scale.
              </h2>
              <p className="text-slate-400 text-xl leading-relaxed font-bold max-w-xl">
                Our neural architecture handles classification and instantly engineers your official Representation Sheets with aerospace-level precision.
              </p>
              <Link href="/patent-drafter">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-20 px-12 rounded-[2rem] shadow-2xl shadow-blue-600/30 transition-all duration-500 hover:scale-105 font-black text-[11px] uppercase tracking-widest">
                  Access AI Drafter <Sparkles className="ml-4 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute -inset-10 bg-blue-600/20 rounded-[5rem] rotate-3 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              <div className="relative rounded-[4rem] border-[2px] border-white/10 bg-white/5 backdrop-blur-md p-12 overflow-hidden group-hover:border-blue-500/50 transition-all duration-700">
                <div className="aspect-video rounded-[2.5rem] bg-slate-950 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                   <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-1000"
                    alt="AI Labs"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 cursor-pointer hover:scale-110 transition-transform">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 5 - HARDWARE LAB: THE MARKETPLACE */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-32 bg-white"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                <Cpu className="w-4 h-4" /> Hardware Division
              </div>
              <h2 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter">Elite <span className="text-blue-600">Procurement</span></h2>
              <p className="text-slate-400 text-xl font-bold">Aerospace-grade components for institutional engineering builds.</p>
            </div>
            <Link href="/electronics">
              <Button variant="outline" className="border-slate-200 text-slate-900 h-16 px-10 rounded-2xl bg-white shadow-xl shadow-slate-900/5 font-black text-[10px] uppercase tracking-widest hover:border-blue-600 transition-all">
                Audit Full Inventory <ArrowRight className="w-4 h-4 ml-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 group cursor-pointer hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] transition-all duration-700"
              >
                <div className="aspect-square bg-slate-50 relative p-12 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  <div className="absolute top-8 left-8 bg-slate-900 text-white text-[9px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full z-10 uppercase">
                    Procurement Node
                  </div>
                  <Cpu className="w-24 h-24 text-slate-200 group-hover:text-blue-600/30 transition-all duration-500 group-hover:scale-110" />
                </div>
                <div className="p-12 space-y-8">
                  <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-blue-600 transition-colors">Strategic Sensor Array v{i}.0</h3>
                  <div className="flex items-center justify-between border-y border-slate-50 py-4">
                    <span className="font-black text-slate-900 text-2xl tracking-tighter">₹8,499.00</span>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100">Verified Stock</span>
                  </div>
                  <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/10">Authorize Purchase</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 6 - TRUST & AUTHORITY */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-32 bg-slate-50"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div variants={fadeInUp} className="text-center mb-24 space-y-6">
            <div className="inline-flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest">
              <Shield className="w-4 h-4" /> Integrity
            </div>
            <h2 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter">Verified <span className="text-blue-600">Impact</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Executive Counsel", text: "The quality of technical documentation provided is indistinguishable from top-tier institutional standards." },
              { name: "Strategic Lead", text: "Their IP architecture enabled us to secure three utility patents within a single fiscal quarter." },
              { name: "Procurement Officer", text: "Reliability in component sourcing has redefined our rapid prototyping workflow." },
            ].map((review, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col hover:border-blue-600/20 transition-all duration-700"
              >
                <div className="flex gap-1 mb-10 text-blue-600">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-400 text-xl font-bold italic leading-relaxed mb-12 flex-grow">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-6 pt-10 border-t border-slate-50">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white shadow-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">{review.name}</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Verified Member</p>
                  </div>
                  <CheckCircle className="ml-auto w-6 h-6 text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 7 - ULTIMATE CTA */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-40 bg-white"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-slate-900 rounded-[6rem] p-32 text-center text-white shadow-[0_64px_128px_-24px_rgba(15,23,42,0.4)] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_2px,transparent_2px)] bg-[length:48px_48px] group-hover:scale-125 transition-transform duration-[2000ms]" />
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 space-y-16">
              <div className="inline-flex items-center gap-3 bg-white/10 text-blue-400 px-8 py-3 rounded-2xl backdrop-blur-xl border border-white/10">
                <Fingerprint className="w-5 h-5" />
                <span className="text-[11px] font-black tracking-[0.4em] uppercase">Authorized Access Only</span>
              </div>
              <h2 className="font-heading font-black text-6xl md:text-8xl leading-[0.85] tracking-tighter">
                Lead the <br /><span className="text-blue-500">Infrastructure</span> <br />of Tomorrow.
              </h2>
              <p className="text-slate-400 text-2xl max-w-3xl mx-auto font-bold leading-relaxed">
                Join the tier of innovators who define the technical landscape. Secure your high-stakes commissions now.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-8 pt-8">
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white h-24 px-16 text-xl rounded-[2.5rem] w-full sm:w-auto font-black shadow-2xl shadow-blue-600/30 transition-all duration-500 hover:scale-105 uppercase tracking-widest">
                    Create Secure Node
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-24 px-16 text-xl rounded-[2.5rem] w-full sm:w-auto bg-white/5 backdrop-blur-md font-black uppercase tracking-widest transition-all">
                    Speak with Counsel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
