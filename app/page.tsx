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
        {/* Cinematic Background & 3D Floating Shapes */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Main Glows */}
          <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-blue-50/60 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-slate-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          
          {/* Precision Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.15]" />

          {/* Floating 3D Shapes - Darker & More Pronounced */}
          <motion.div 
            animate={{ 
              y: [0, -50, 0],
              rotate: [0, 45, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] right-[15%] w-32 h-32 border-2 border-blue-400/50 rounded-[2rem] rotate-12 flex items-center justify-center backdrop-blur-[2px]"
          >
            <div className="w-16 h-16 border border-blue-500/40 rounded-full animate-pulse" />
          </motion.div>

          <motion.div 
            animate={{ 
              x: [0, 40, 0],
              rotate: [0, -30, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] left-[10%] w-24 h-24 border-2 border-slate-400/40 rotate-45 flex items-center justify-center backdrop-blur-[2px]"
          >
            <div className="w-10 h-10 bg-blue-400/20 rounded-full" />
          </motion.div>

          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] left-[20%] w-16 h-16 border border-emerald-400/40 rounded-full opacity-60"
          />

          <motion.div 
            animate={{ 
              y: [0, 60, 0],
              x: [0, -20, 0],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[15%] left-[45%] w-6 h-6 border-2 border-blue-600/30 rotate-45 blur-[0.5px]"
          />

          {/* New Shapes */}
          <motion.div 
            animate={{ 
              rotate: -360,
              y: [0, -40, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[30%] right-[10%] w-20 h-20 border-2 border-slate-300/40 rounded-3xl opacity-50"
          />

          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[30%] right-[40%] w-3 h-3 bg-blue-500/40 rounded-full"
          />

          <motion.div 
            animate={{ 
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-[10%] left-[40%] w-12 h-12 border border-blue-400/30 rotate-[30deg] opacity-40 flex items-center justify-center"
          >
             <div className="w-4 h-4 border border-blue-300/20 rounded-full" />
          </motion.div>

          <div className="absolute top-[60%] right-[30%] w-12 h-12 border border-purple-400/40 rotate-12 opacity-50" />
          
          <div className="absolute top-[20%] left-[5%] w-8 h-8 border-2 border-slate-200/40 rounded-full opacity-30" />
          <div className="absolute bottom-[15%] right-[25%] w-16 h-1 bg-gradient-to-r from-blue-500/20 to-transparent rotate-[30deg]" />
        </div>

        <div className="container mx-auto px-4 z-10 pt-20 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7 space-y-12">
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
                  <Sparkles className="w-4 h-4" /> Your Academic & Engineering Partner
                </div>
                <h1 className="font-heading font-black text-6xl md:text-8xl leading-[0.9] text-slate-900 tracking-tighter">
                  Build. Publish.<br />
                  <span className="text-blue-600">Patent.</span> <br />
                  Succeed.
                </h1>
                <p className="text-2xl text-slate-400 max-w-2xl leading-relaxed font-bold">
                  The ultimate platform for engineering students and researchers. Get help with your thesis, buy high-quality electronics, and register your patents effortlessly.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6">
                <Link href="/services" className="w-full sm:w-auto">
                  <Button className="bg-slate-900 hover:bg-blue-600 text-white h-20 px-12 rounded-[2rem] shadow-2xl shadow-slate-900/20 transition-all duration-500 hover:scale-105 font-black text-[11px] uppercase tracking-widest group w-full">
                    Explore Services <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link href="/electronics" className="w-full sm:w-auto">
                  <Button variant="outline" className="border-slate-200 text-slate-900 hover:bg-white hover:border-blue-600/30 h-20 px-12 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all w-full">
                    Shop Electronics
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="pt-8 flex flex-wrap items-center gap-12">
                <div className="space-y-2">
                  <div className="text-4xl font-black text-slate-900 tracking-tighter">10K+</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Happy Students</div>
                </div>
                <div className="w-px h-12 bg-slate-100 hidden md:block" />
                <div className="space-y-2">
                  <div className="text-4xl font-black text-slate-900 tracking-tighter">500+</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Projects Delivered</div>
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
                  alt="Students building projects"
                  className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white rounded-[3rem] p-6 shadow-2xl flex flex-col justify-center items-center text-center border border-slate-50 transition-all duration-700 group-hover:scale-110">
                <Award className="w-10 h-10 text-blue-600 mb-2" />
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Top Rated Platform</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 2 - INSTITUTES MARQUEE */}
      <section className="py-20 bg-white border-y border-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 mb-12 max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Trusted by Innovators from Premier Institutes</p>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex items-center space-x-24 px-12">
            {[
              { name: "IIT Bombay", logo: "https://www.iitb.ac.in/sites/default/files/iitb_logo.png", color: "from-blue-600 to-blue-400" },
              { name: "IIT Delhi", logo: "https://home.iitd.ac.in/images/logo.png", color: "from-orange-600 to-orange-400" },
              { name: "IIT Madras", logo: "https://www.iitm.ac.in/sites/default/files/iitm-logo_0.png", color: "from-red-600 to-red-400" },
              { name: "IIT Kanpur", logo: "https://www.iitk.ac.in/new/images/iitk-logo.png", color: "from-blue-700 to-blue-500" },
              { name: "IIT Kharagpur", logo: "https://www.iitkgp.ac.in/assets/images/logo.png", color: "from-slate-800 to-slate-600" },
              { name: "IIT Roorkee", logo: "https://www.iitr.ac.in/theme/iitr/images/logo.png", color: "from-blue-900 to-blue-700" },
              { name: "IIT Guwahati", logo: "https://www.iitg.ac.in/images/iitg_logo.png", color: "from-purple-600 to-purple-400" },
            ].map((iit, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
                className="flex items-center gap-6 px-12 py-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-2xl shadow-slate-900/5 group transition-all duration-500"
              >
                <div className="w-14 h-14 relative group-hover:drop-shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center">
                  <img 
                    src={iit.logo} 
                    alt={iit.name} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${iit.logo.split('/')[2]}&sz=128`;
                    }}
                  />
                </div>
                <span className={`text-xl font-black tracking-tighter bg-gradient-to-r ${iit.color} bg-clip-text text-transparent`}>{iit.name}</span>
              </motion.div>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center space-x-24 px-12">
            {[
              { name: "IIT Bombay", logo: "https://www.iitb.ac.in/sites/default/files/iitb_logo.png", color: "from-blue-600 to-blue-400" },
              { name: "IIT Delhi", logo: "https://home.iitd.ac.in/images/logo.png", color: "from-orange-600 to-orange-400" },
              { name: "IIT Madras", logo: "https://www.iitm.ac.in/sites/default/files/iitm-logo_0.png", color: "from-red-600 to-red-400" },
              { name: "IIT Kanpur", logo: "https://www.iitk.ac.in/new/images/iitk-logo.png", color: "from-blue-700 to-blue-500" },
              { name: "IIT Kharagpur", logo: "https://www.iitkgp.ac.in/assets/images/logo.png", color: "from-slate-800 to-slate-600" },
              { name: "IIT Roorkee", logo: "https://www.iitr.ac.in/theme/iitr/images/logo.png", color: "from-blue-900 to-blue-700" },
              { name: "IIT Guwahati", logo: "https://www.iitg.ac.in/images/iitg_logo.png", color: "from-purple-600 to-purple-400" },
            ].map((iit, i) => (
              <motion.div
                key={`dup-${i}`}
                whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
                className="flex items-center gap-6 px-12 py-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-2xl shadow-slate-900/5 group transition-all duration-500"
              >
                <div className="w-14 h-14 relative group-hover:drop-shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center">
                  <img 
                    src={iit.logo} 
                    alt={iit.name} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${iit.logo.split('/')[2]}&sz=128`;
                    }}
                  />
                </div>
                <span className={`text-xl font-black tracking-tighter bg-gradient-to-r ${iit.color} bg-clip-text text-transparent`}>{iit.name}</span>
              </motion.div>
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
              <Building2 className="w-4 h-4" /> Our Services
            </div>
            <h2 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter">How We <span className="text-blue-600">Help You</span></h2>
            <p className="text-slate-400 text-xl font-bold max-w-3xl mx-auto">Helping India&apos;s brightest students build amazing projects and get their work published.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { slug: "phd-thesis", icon: BookOpen, title: "PhD Thesis Help", desc: "Complete support for your PhD thesis, from writing to formatting.", color: "text-blue-500", groupHoverBg: "group-hover:bg-blue-500" },
              { slug: "research-paper", icon: FileText, title: "Research Papers", desc: "Get your research published in top journals like IEEE and Springer.", color: "text-purple-500", groupHoverBg: "group-hover:bg-purple-500" },
              { slug: "final-year-report", icon: Briefcase, title: "Final Year Reports", desc: "Perfectly written reports and documentation for your final year projects.", color: "text-orange-500", groupHoverBg: "group-hover:bg-orange-500" },
              { slug: "design-patent", icon: ShieldCheck, title: "Design Patents", desc: "Protect the unique look of your inventions with official design patents.", color: "text-emerald-500", groupHoverBg: "group-hover:bg-emerald-500" },
              { slug: "utility-patent", icon: Cpu, title: "Utility Patents", desc: "Secure your technical inventions with complete utility patent filing.", color: "text-red-500", groupHoverBg: "group-hover:bg-red-500" },
              { slug: "writing-writeups", icon: FileText, title: "Writing & Writeups", desc: "Professional technical writeups starting at ₹5/page. Urgent delivery available.", color: "text-amber-500", groupHoverBg: "group-hover:bg-amber-500" },
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -15 }}
                className="group p-12 rounded-[3.5rem] bg-white border border-slate-100 hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] translate-x-16 -translate-y-16 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700" />
                <div className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-10 group-hover:text-white transition-all duration-500 border border-slate-100 shadow-sm ${service.color} ${service.groupHoverBg} group-hover:border-transparent`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className={`font-heading font-black text-2xl mb-6 text-slate-900 tracking-tight transition-colors duration-500 group-hover:${service.color}`}>{service.title}</h3>
                <p className="text-slate-400 text-[13px] font-bold uppercase tracking-widest leading-loose mb-10 flex-grow">{service.desc}</p>
                <Link href={`/services/${service.slug}`}>
                  <Button variant="ghost" className={`p-0 h-auto hover:bg-transparent font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 group/btn ${service.color}`}>
                    Learn More <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
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
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">AI Patent Drafter</span>
              </div>
              <h2 className="font-heading font-black text-5xl md:text-7xl text-white leading-[0.95] tracking-tighter">
                Write Your Patents <br /><span className="text-blue-500">Automatically.</span>
              </h2>
              <p className="text-slate-400 text-xl leading-relaxed font-bold max-w-xl">
                Save time and money. Our AI tool helps you draft complete patent applications in minutes, formatted exactly how the government needs them.
              </p>
              <Link href="/patent-drafter">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-20 px-12 rounded-[2rem] shadow-2xl shadow-blue-600/30 transition-all duration-500 hover:scale-105 font-black text-[11px] uppercase tracking-widest">
                  Try AI Drafter <Sparkles className="ml-4 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute -inset-10 bg-blue-600/20 rounded-[5rem] rotate-3 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              <div className="relative rounded-[4rem] border-[2px] border-white/10 bg-white/5 backdrop-blur-md p-12 overflow-hidden group-hover:border-blue-500/50 transition-all duration-700">
                <div className="aspect-video rounded-[2.5rem] bg-slate-950 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                  <img
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover transition-all duration-1000 opacity-80 mix-blend-screen"
                    alt="AI Drafter"
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
              <div className="inline-flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                <Cpu className="w-4 h-4" /> Electronics Store
              </div>
              <h2 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter">Top Rated <span className="text-emerald-600">Components</span></h2>
              <p className="text-slate-400 text-xl font-bold">Buy high-quality electronic components for your college projects and DIY builds.</p>
            </div>
            <Link href="/electronics">
              <Button variant="outline" className="border-slate-200 text-slate-900 h-16 px-10 rounded-2xl bg-white shadow-xl shadow-slate-900/5 font-black text-[10px] uppercase tracking-widest hover:border-emerald-600 transition-all">
                Shop Electronics <ArrowRight className="w-4 h-4 ml-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { name: "Arduino Uno R3", price: "₹699.00", img: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&q=80&w=400", color: "text-blue-600", bg: "bg-blue-50" },
              { name: "Raspberry Pi 4", price: "₹4,500.00", img: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&q=80&w=400", color: "text-purple-600", bg: "bg-purple-50" },
              { name: "NodeMCU ESP8266", price: "₹299.00", img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=400", color: "text-cyan-600", bg: "bg-cyan-50" },
              { name: "L298N Motor Driver", price: "₹149.00", img: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&q=80&w=400", color: "text-orange-600", bg: "bg-orange-50" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -15, scale: 1.02 }}
                className={`bg-white rounded-[4rem] overflow-hidden border border-slate-100 group cursor-pointer hover:shadow-2xl transition-all duration-700`}
              >
                <div className="aspect-square bg-slate-50 relative overflow-hidden group-hover:bg-white transition-colors p-8">
                  <div className={`absolute top-6 left-6 ${item.bg} ${item.color} text-[9px] font-black tracking-[0.2em] px-4 py-1.5 rounded-xl z-10 uppercase shadow-sm border border-slate-100`}>
                    In Stock
                  </div>
                  <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="p-10 space-y-6">
                  <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                  <div className="flex items-center justify-between border-y border-slate-50 py-4">
                    <span className="font-black text-slate-900 text-2xl tracking-tighter">{item.price}</span>
                  </div>
                  <Button className={`w-full bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl h-16 font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/10 group-hover:shadow-emerald-600/20`}>Add to Cart</Button>
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
            <div className="inline-flex items-center gap-3 text-orange-600 font-black text-[10px] uppercase tracking-widest">
              <Star className="w-4 h-4 fill-current" /> Reviews
            </div>
            <h2 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter">What Students <span className="text-orange-600">Say</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Aman S.", course: "B.Tech Computer Science", text: "Kalvex helped me finish my final year project and get my first IEEE paper published! Highly recommend their AI drafter too.", color: "text-orange-600", bg: "bg-orange-50" },
              { name: "Priya M.", course: "M.Tech Electronics", text: "The quality of their electronic components is amazing. Delivery was fast and everything worked perfectly out of the box.", color: "text-emerald-600", bg: "bg-emerald-50" },
              { name: "Rahul V.", course: "PhD Scholar", text: "Writing a thesis was so stressful until I found Kalvex. They made the formatting and plagiarism check super easy and quick.", color: "text-blue-600", bg: "bg-blue-50" },
            ].map((review, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col hover:shadow-2xl transition-all duration-700 group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[4rem] translate-x-16 -translate-y-16 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700 opacity-50 ${review.bg}`} />
                <div className={`flex gap-1 mb-8 ${review.color} relative z-10`}>
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-600 text-lg font-bold italic leading-relaxed mb-10 flex-grow relative z-10">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-6 pt-8 border-t border-slate-50 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-lg ${review.bg} ${review.color}`}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">{review.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{review.course}</p>
                  </div>
                  <CheckCircle className={`ml-auto w-6 h-6 ${review.color}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 7 - INFRA OF TOMORROW */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-40 bg-slate-950 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[80rem] h-[80rem] bg-blue-600/10 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[60rem] h-[60rem] bg-emerald-600/10 rounded-full blur-[140px] -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-6 space-y-12">
              <motion.div variants={fadeInUp} className="space-y-8">
                <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em]">
                  <Globe className="w-4 h-4" /> Global Impact
                </div>
                <h2 className="text-6xl md:text-8xl font-black font-heading text-white leading-[0.85] tracking-tighter">
                  Lead the <br />
                  <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-gradient-x">Infra of Tomorrow.</span>
                </h2>
                <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-xl">
                  We are not just a service provider; we are the foundation for the next decade of Indian engineering excellence. Join the movement that is redefining innovation.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8">
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 group hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                  <div className="text-4xl font-black text-white mb-2 tracking-tighter bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-blue-600 transition-all">50k+</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Patents</div>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 group hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <div className="text-4xl font-black text-white mb-2 tracking-tighter bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:to-emerald-600 transition-all">100+</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">IIT Collaborations</div>
                </div>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="lg:col-span-6 relative">
              <div className="relative rounded-[4rem] overflow-hidden border border-white/10 group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100"
                  alt="Future Infra"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-pulse cursor-pointer group-hover:bg-blue-600/20 group-hover:border-blue-500/50"
                  >
                    <Zap className="w-12 h-12 text-blue-500 group-hover:text-blue-400" />
                  </motion.div>
                </div>
              </div>
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-12 bg-blue-600 p-8 rounded-[3rem] shadow-2xl shadow-blue-600/40 z-20 hover:scale-110 transition-transform cursor-pointer"
              >
                <Cpu className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
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
                <span className="text-[11px] font-black tracking-[0.4em] uppercase">Join Us Today</span>
              </div>
              <h2 className="font-heading font-black text-6xl md:text-8xl leading-[0.85] tracking-tighter">
                Ready to Build <br /><span className="text-blue-500">Something Amazing?</span>
              </h2>
              <p className="text-slate-400 text-2xl max-w-3xl mx-auto font-bold leading-relaxed">
                Join thousands of top students who trust Kalvex for their projects, publications, and patents.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-8 pt-8">
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white h-24 px-16 text-xl rounded-[2.5rem] w-full sm:w-auto font-black shadow-2xl shadow-blue-600/30 transition-all duration-500 hover:scale-105 uppercase tracking-widest">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-24 px-16 text-xl rounded-[2.5rem] w-full sm:w-auto bg-white/5 backdrop-blur-md font-black uppercase tracking-widest transition-all">
                    Contact Us
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
