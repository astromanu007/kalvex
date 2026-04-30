import React from "react";
import { 
  Target, Users, Award, ShieldCheck, 
  ArrowRight, Globe, Zap, Heart 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AboutPage() {
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

  const stats = [
    { label: "Engineering Projects", value: "500+", icon: Zap },
    { label: "Expert Consultants", value: "50+", icon: Users },
    { label: "Global Patents Filed", value: "120+", icon: Award },
    { label: "Success Rate", value: "99%", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative pt-32 pb-20 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 rounded-l-[100px] -z-10 blur-3xl" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black font-heading mb-6 text-slate-900 leading-tight tracking-tighter">
              Pioneering the Future of <br /><span className="text-blue-600">Engineering & IP</span>
            </h1>
            <p className="text-xl text-slate-500 mb-8 leading-relaxed font-medium">
              KALVEX is India&apos;s premier platform dedicated to bridging the gap between innovative ideas and professional engineering execution. We empower students, researchers, and startups with the tools they need to build, protect, and scale.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl shadow-2xl shadow-blue-500/25 transition-all hover:scale-105 font-bold h-16">
                <Link href="/services" className="flex items-center">Our Services <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-200 text-slate-900 rounded-2xl hover:bg-slate-50 px-8 font-bold h-16">
                <Link href="/projects">Explore Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-12 border-y border-slate-100 bg-slate-50/50"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mb-4 transition-transform group-hover:scale-110 shadow-sm">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-blue-600 rounded-[4rem] rotate-3 absolute inset-0 opacity-10 blur-2xl" />
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" 
                alt="Engineering Excellence" 
                className="rounded-[4rem] shadow-2xl relative z-10 hover:-rotate-1 transition-transform duration-500"
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 font-heading tracking-tighter">Our Core Mission</h2>
                <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                  To democratize engineering excellence by providing a unified ecosystem where complex technical challenges meet world-class solutions. We believe that every great invention deserves a perfect prototype and a legally sound patent.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Identity Protection", desc: "Your innovative ideas are safe with our masked identity protocols.", icon: ShieldCheck },
                  { title: "Expert Vetting", desc: "Every project is handled by industry-certified engineering experts.", icon: Award },
                  { title: "Global Reach", desc: "Helping Indian innovation reach global patent offices.", icon: Globe },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                      <p className="text-sm text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Founders Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-slate-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tighter">The Visionaries</h2>
            <p className="text-slate-500 max-w-2xl mx-auto italic font-medium text-lg">
              &quot;Engineering is not just about building things; it&apos;s about solving the problems of tomorrow with the precision of today.&quot;
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              <div className="grid md:grid-cols-2 gap-12 items-stretch">
                {/* Manish Card */}
                <div className="group relative h-full">
                  <div className="absolute inset-0 bg-blue-600 rounded-[4rem] rotate-2 opacity-5 group-hover:rotate-3 transition-transform" />
                  <div className="h-full bg-white overflow-hidden rounded-[4rem] border border-slate-100 shadow-xl flex flex-col relative z-10 transition-all hover:-translate-y-2">
                    <div className="aspect-[4/5] overflow-hidden bg-slate-100 shrink-0 relative group-hover:after:opacity-100 after:opacity-0 after:absolute after:inset-0 after:bg-blue-600/10 after:transition-opacity">
                      <img 
                        src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800" 
                        alt="Manish Avishkar Dhatrak" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      />
                    </div>
                    <div className="p-12 space-y-6 text-center">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2 font-heading tracking-tight">Manish Avishkar Dhatrak</h3>
                        <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">Founder & CEO</p>
                      </div>
                      <div className="w-12 h-0.5 bg-slate-100 mx-auto" />
                      <p className="text-slate-600 leading-relaxed text-lg italic font-medium px-4">
                        &quot;Engineering is the bridge between pure science and the practical needs of humanity. At KALVEX, we build that bridge every day.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Samarth Card */}
                <div className="group relative h-full">
                  <div className="absolute inset-0 bg-blue-600 rounded-[4rem] -rotate-2 opacity-5 group-hover:-rotate-3 transition-transform" />
                  <div className="h-full bg-white overflow-hidden rounded-[4rem] border border-slate-100 shadow-xl flex flex-col relative z-10 transition-all hover:-translate-y-2">
                    <div className="aspect-[4/5] overflow-hidden bg-slate-100 shrink-0 relative group-hover:after:opacity-100 after:opacity-0 after:absolute after:inset-0 after:bg-blue-600/10 after:transition-opacity">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                        alt="Samarth Bharat Jadhav" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      />
                    </div>
                    <div className="p-12 space-y-6 text-center">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2 font-heading tracking-tight">Samarth Bharat Jadhav</h3>
                        <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">Co-Founder & CTO</p>
                      </div>
                      <div className="w-12 h-0.5 bg-slate-100 mx-auto" />
                      <p className="text-slate-600 leading-relaxed text-lg italic font-medium px-4">
                        &quot;Technology should be invisible yet indispensable. We focus on building tools that empower creators without getting in their way.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-slate-950 text-white overflow-hidden relative"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-16 font-heading tracking-tighter">Values that Drive Us</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Integrity", desc: "We maintain absolute transparency and trust in every engineering consultation.", icon: ShieldCheck },
              { title: "Innovation", desc: "Constant pushing of technical boundaries to deliver state-of-the-art results.", icon: Zap },
              { title: "Inclusion", desc: "Making high-end engineering services accessible to every aspiring inventor.", icon: Heart },
            ].map((value, i) => (
              <div key={i} className="p-12 rounded-[3rem] bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-blue-600/20">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-blue-600 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-[0_48px_100px_-24px_rgba(37,99,235,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 -z-10" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:32px_32px]" />
            
            <h2 className="text-4xl md:text-6xl font-black mb-8 font-heading tracking-tighter leading-tight">Ready to Start <br />Your Journey?</h2>
            <p className="text-xl md:text-2xl text-blue-50 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of engineers and inventors who are building the future on KALVEX today.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-20 px-12 rounded-2xl font-black shadow-2xl transition-all hover:scale-105 text-xl">
                <Link href="/register">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
