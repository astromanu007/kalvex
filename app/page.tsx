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
              { name: "IIT BOMBAY", color: "text-blue-500", logo: "https://www.iitb.ac.in/themes/custom/iitb_bootstrap/logo.png" },
              { name: "IIT DELHI", color: "text-red-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg/220px-Indian_Institute_of_Technology_Delhi_Logo.svg.png" },
              { name: "IIT MADRAS", color: "text-orange-500", logo: "https://www.iitm.ac.in/themes/custom/iitm/assets/images/iitm_logo.png" },
              { name: "IIT KANPUR", color: "text-indigo-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/IIT_Kanpur_Logo.svg/220px-IIT_Kanpur_Logo.svg.png" },
              { name: "IIT KHARAGPUR", color: "text-amber-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/220px-IIT_Kharagpur_Logo.svg.png" },
              { name: "IIT ROORKEE", color: "text-emerald-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Indian_Institute_of_Technology_Roorkee_logo.png/220px-Indian_Institute_of_Technology_Roorkee_logo.png" },
              { name: "IIT GUWAHATI", color: "text-cyan-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/IIT_Guwahati_Logo.svg/220px-IIT_Guwahati_Logo.svg.png" },
              { name: "IIT HYDERABAD", color: "text-violet-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/19/IIT_Hyderabad_Insignia.svg/220px-IIT_Hyderabad_Insignia.svg.png" }
            ].map((iit, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden p-2`}>
                  <img src={iit.logo} alt={iit.name} className="w-full h-full object-contain" />
                </div>
                <div className={`text-4xl font-heading font-black tracking-tighter uppercase ${iit.color}`}>
                  {iit.name}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center space-x-24 px-12">
            {[
              { name: "IIT BOMBAY", color: "text-blue-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/220px-Indian_Institute_of_Technology_Bombay_Logo.svg.png" },
              { name: "IIT DELHI", color: "text-red-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg/220px-Indian_Institute_of_Technology_Delhi_Logo.svg.png" },
              { name: "IIT MADRAS", color: "text-orange-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Indian_Institute_of_Technology_Madras_Logo.svg/220px-Indian_Institute_of_Technology_Madras_Logo.svg.png" },
              { name: "IIT KANPUR", color: "text-indigo-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/IIT_Kanpur_Logo.svg/220px-IIT_Kanpur_Logo.svg.png" },
              { name: "IIT KHARAGPUR", color: "text-amber-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/220px-IIT_Kharagpur_Logo.svg.png" },
              { name: "IIT ROORKEE", color: "text-emerald-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Indian_Institute_of_Technology_Roorkee_logo.png/220px-Indian_Institute_of_Technology_Roorkee_logo.png" },
              { name: "IIT GUWAHATI", color: "text-cyan-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/IIT_Guwahati_Logo.svg/220px-IIT_Guwahati_Logo.svg.png" },
              { name: "IIT HYDERABAD", color: "text-violet-500", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/19/IIT_Hyderabad_Insignia.svg/220px-IIT_Hyderabad_Insignia.svg.png" }
            ].map((iit, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden p-2`}>
                  <img src={iit.logo} alt={iit.name} className="w-full h-full object-contain" />
                </div>
                <div className={`text-4xl font-heading font-black tracking-tighter uppercase ${iit.color}`}>
                  {iit.name}
                </div>
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
              { slug: "copyright", icon: Award, title: "Copyright Registration", desc: "Register and protect your software code and technical writing.", color: "text-indigo-500", groupHoverBg: "group-hover:bg-indigo-500" },
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
              { name: "Arduino Uno R3", price: "₹699.00", img: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&q=80&w=400" },
              { name: "Raspberry Pi 4", price: "₹4,500.00", img: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&q=80&w=400" },
              { name: "NodeMCU ESP8266", price: "₹299.00", img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=400" },
              { name: "L298N Motor Driver", price: "₹149.00", img: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&q=80&w=400" },

            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 group cursor-pointer hover:shadow-[0_48px_96px_-24px_rgba(16,185,129,0.15)] hover:border-emerald-200 transition-all duration-700"
              >
                <div className="aspect-square bg-slate-50 relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                  <div className="absolute top-6 left-6 bg-slate-900 text-white text-[9px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full z-10 uppercase">
                    In Stock
                  </div>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply opacity-90" />
                </div>
                <div className="p-8 space-y-6">
                  <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                  <div className="flex items-center justify-between border-y border-slate-50 py-4">
                    <span className="font-black text-slate-900 text-2xl tracking-tighter">{item.price}</span>
                  </div>
                  <Button className="w-full bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/10">Add to Cart</Button>
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
