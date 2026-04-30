import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Cpu, ShieldCheck, Briefcase, Award, Zap, Lightbulb, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* SECTION 1 - HERO */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative min-h-[90vh] flex items-center bg-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        
        <div className="container mx-auto px-4 z-10 pt-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-bold tracking-wide uppercase">
                <Zap className="w-4 h-4" />
                India&apos;s Most Trusted Platform
              </div>
              <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-slate-900 tracking-tighter">
                Engineering <br />
                <span className="text-blue-600">Excellence</span> <br />
                Simplified.
              </h1>
              <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
                Empowering the next generation of Indian innovators with premium academic support, AI-driven patenting, and high-precision electronic components.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link href="/services">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-slate-900/20 w-full sm:w-auto">
                    Explore Services <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/electronics">
                  <Button variant="outline" size="lg" className="border-slate-200 text-slate-900 hover:bg-slate-50 h-16 px-10 text-lg rounded-2xl w-full sm:w-auto">
                    Browse Components
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex items-center gap-8">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-slate-900">10k+</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-widest">Students</div>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-slate-900">500+</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-widest">Projects</div>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-slate-900">4.9/5</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-widest">Rating</div>
                </div>
              </div>
            </div>

            <div className="relative group animate-in fade-in slide-in-from-right duration-1000">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-[64px] -rotate-2 group-hover:rotate-0 transition-transform duration-700" />
              <div className="relative rounded-[48px] overflow-hidden border-8 border-white shadow-2xl shadow-slate-900/20">
                <img 
                  src="/hero.png" 
                  alt="KALVEX Engineering Hero" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - WHO WE ARE */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-slate-50/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 -skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-heading font-black text-4xl md:text-5xl text-slate-900 leading-tight">Empowering Indian <br />Innovators</h2>
                <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
              </div>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium">
                <p>
                  At Kalvex, we believe that brilliant minds shouldn&apos;t be held back by formatting rules, missing components, or complex patent filings. We are India&apos;s premier academic and technical support ecosystem.
                </p>
                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">100% Original</h4>
                      <p className="text-sm">Verified iThenticate reports</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Masked Identity</h4>
                      <p className="text-sm">Confidential & Private</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-slate-900/5 rounded-3xl rotate-3" />
              <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-8">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                    <Lightbulb className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-slate-900">Innovation First</h3>
                  <p className="text-slate-500 text-sm">Providing cutting-edge tools like our AI Patent Drafter to accelerate your journey from idea to IP.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 3 - SERVICES */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-16 space-y-4">
            <h2 className="font-heading font-black text-4xl md:text-5xl text-slate-900">What We Do For You</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Comprehensive academic and professional support for India&apos;s leading engineers.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { icon: BookOpen, title: "PhD Thesis", desc: "End-to-end writing, editing, and formatting for your doctoral thesis." },
              { icon: FileText, title: "Research Paper", desc: "High-impact papers targeted for IEEE, Scopus, and Springer journals." },
              { icon: Briefcase, title: "Final Year Report", desc: "Professionally formatted project reports as per university guidelines." },
              { icon: ShieldCheck, title: "Design Patent", desc: "Protect the visual appearance of your product with official filing." },
              { icon: Cpu, title: "Utility Patent", desc: "Drafting robust claims for your functional engineering inventions." },
              { icon: Award, title: "Copyright", desc: "Secure your software code, literary works, or technical manuals." },
            ].map((service, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -translate-y-12 translate-x-12 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500" />
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-2xl mb-4 text-slate-900">{service.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed mb-8 flex-grow">{service.desc}</p>
                <Link href={`/services/${service.title.toLowerCase().replace(/ /g, '-')}`}>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent text-blue-600 font-bold flex items-center gap-2 group/btn">
                    Get Quote <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 4 - HOW IT WORKS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-white border-y border-slate-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-heading font-black text-4xl md:text-5xl text-slate-900">How It Works</h2>
            <p className="text-slate-500 text-lg">Seamless execution from concept to completion.</p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              {[
                { step: "01", title: "Submit Requirements", desc: "Detail your specific project needs and deadlines via our secure portal." },
                { step: "02", title: "Expert Matching", desc: "Our system assigns a verified specialist to your task anonymously." },
                { step: "03", title: "Live Collaboration", desc: "Track progress, review drafts, and collaborate in real-time." },
                { step: "04", title: "Secure Delivery", desc: "Receive your high-quality, plagiarism-checked deliverables." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-slate-900/20 text-2xl font-black font-heading">
                    {item.step}
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-heading font-bold text-xl text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 5 - ELECTRONICS STORE PREVIEW */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 bg-slate-50"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="font-heading font-black text-4xl md:text-5xl text-slate-900">Precision Components</h2>
              <p className="text-slate-500 text-lg">High-grade hardware for professional engineering builds.</p>
            </div>
            <Link href="/electronics">
              <Button size="lg" variant="outline" className="border-slate-200 text-slate-900 h-14 px-8 rounded-2xl bg-white shadow-sm">
                Shop Marketplace <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 group cursor-pointer hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500"
              >
                <div className="aspect-square bg-slate-50 relative p-8 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  <div className="absolute top-6 left-6 bg-slate-900 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full z-10 uppercase">
                    Sensors
                  </div>
                  <Cpu className="w-20 h-20 text-slate-200 group-hover:text-blue-600/20 transition-colors" />
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">Ultrasonic Distance Sensor HC-SR04 Pro</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-xl">₹85.00</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">In Stock</span>
                  </div>
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold">Add to Cart</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 6 - AI DESIGN PATENT TEASER */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-slate-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-blue-400 px-6 py-2 rounded-full backdrop-blur-md">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-xs font-black tracking-[0.2em] uppercase">Kalvex AI Labs</span>
          </div>
          <h2 className="font-heading font-black text-4xl md:text-6xl text-white leading-tight">
            Auto-Draft Your <br />Design Patent in Minutes
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Upload your product views. Our AI handles classification and instantly generates your official Representation Sheet.
          </p>
          <Link href="/patent-drafter">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white h-16 px-12 text-lg rounded-2xl shadow-2xl shadow-blue-600/40 font-bold">
              Try AI Drafter Now
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* SECTION 7 - TRUSTED PARTNERS MARQUEE */}
      <section className="py-20 bg-white border-b border-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 mb-10">
          <p className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Partners & Trust</p>
        </div>
        <div className="relative flex overflow-x-hidden opacity-30 group">
          <div className="animate-marquee whitespace-nowrap flex items-center space-x-24">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="text-3xl font-heading font-black text-slate-900 inline-block px-4">
                INSTITUTE {i}
              </div>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center space-x-24">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={`dup-${i}`} className="text-3xl font-heading font-black text-slate-900 inline-block px-4">
                INSTITUTE {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 - TESTIMONIALS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-20 space-y-4">
            <h2 className="font-heading font-black text-4xl md:text-5xl text-slate-900">User Endorsements</h2>
            <p className="text-slate-500 text-lg">Verified results from India&apos;s leading engineering institutions.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {[
              { name: "Rahul S.", college: "VIT Pune", branch: "Computer Engg.", text: "The quality of the final year report was exceptional. They followed all university guidelines perfectly and delivered early." },
              { name: "Priya M.", college: "COEP", branch: "E&TC Engg.", text: "Struggling with major project code? The assigned expert not only fixed bugs but provided detailed documentation. Highly recommended!" },
              { name: "Ankit D.", college: "SRM Institute", branch: "Mech Engg.", text: "The AI Design Patent drafter is revolutionary. Formatted sheets in minutes, saving thousands in professional fees." },
            ].map((review, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500"
              >
                <div className="flex items-center space-x-1 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-blue-600 text-lg">&starf;</span>
                  ))}
                </div>
                <p className="text-slate-600 text-lg italic mb-10 flex-grow font-medium leading-relaxed">&quot;{review.text}&quot;</p>
                <div className="flex items-center space-x-5 pt-8 border-t border-slate-50">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{review.branch}</p>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 9 - CTA BANNER */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center text-white shadow-[0_48px_100px_-24px_rgba(15,23,42,0.3)] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:32px_32px] group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10 space-y-10">
              <h2 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl leading-tight">
                Ready to Lead the <br />Future of Engineering?
              </h2>
              <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
                Join thousands of elite innovators who trust Kalvex. Get a free consultation for your high-stakes requirements.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                <Link href="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white h-20 px-12 text-xl rounded-2xl w-full sm:w-auto font-black shadow-2xl shadow-blue-600/20">
                    Create Elite Account
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 h-20 px-12 text-xl rounded-2xl w-full sm:w-auto bg-white/5 backdrop-blur-sm font-black">
                    Speak with an Expert
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
