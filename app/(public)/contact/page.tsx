"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Mail, MessageSquare, MapPin, Phone, 
  Send, Sparkles, Zap, Globe, Github, 
  Twitter, Linkedin, Instagram, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white transition-colors duration-500 pt-32 pb-20 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-blue-50 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-emerald-50 rounded-full -z-10 blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid lg:grid-cols-12 gap-16 items-start"
        >
          {/* Left Column: Info & 3D Cards */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
                <Sparkles className="w-4 h-4" /> Get In Touch
              </div>
              <h1 className="text-6xl md:text-7xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
                Let&apos;s Build <br />
                <span className="text-blue-600">The Future</span> <br />
                Together.
              </h1>
              <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-md">
                Have a vision? Need expertise? Our team of elite engineers and IP strategists is ready to accelerate your breakthrough.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-6">
              {[
                { icon: Mail, label: "Email Us", value: "hello@kalvex.com", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Phone, label: "Call Us", value: "+91 98765 43210", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: MapPin, label: "Visit Us", value: "IIT Bombay Campus, Mumbai", color: "text-purple-600", bg: "bg-purple-50" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 flex items-center gap-8 group transition-all duration-500 hover:border-blue-600/20 hover:shadow-2xl"
                >
                  <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-8 space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Follow Our Progress</p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                  <Button key={i} variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-slate-100 hover:border-blue-600 hover:text-blue-600 transition-all duration-500">
                    <Icon className="w-6 h-6" />
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ 
              perspective: 1000,
              rotateY: -2,
              rotateX: 2,
              scale: 1.01
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 cursor-default"
          >
            <div className="bg-slate-900 rounded-[4rem] p-12 md:p-16 text-white relative overflow-hidden group shadow-[0_64px_128px_-24px_rgba(15,23,42,0.4)] transition-all duration-500 hover:shadow-blue-600/10 [transform-style:preserve-3d]">
              {/* Form 3D Glow Effect */}
              <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black font-heading tracking-tight">Send a Message</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure & Encrypted Transmission</p>
                </div>

                <form className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Full Name</label>
                      <Input 
                        placeholder="John Doe" 
                        className="bg-white/5 border-white/10 h-16 rounded-2xl px-6 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-white placeholder:text-slate-600 font-bold" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="bg-white/5 border-white/10 h-16 rounded-2xl px-6 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-white placeholder:text-slate-600 font-bold" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Inquiry Type</label>
                    <select className="w-full bg-white/5 border border-white/10 h-16 rounded-2xl px-6 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-white font-bold outline-none appearance-none">
                      <option className="bg-slate-900">Academic Project Support</option>
                      <option className="bg-slate-900">Patent Drafting / IP Services</option>
                      <option className="bg-slate-900">Hardware Lab / Components</option>
                      <option className="bg-slate-900">Institutional Partnership</option>
                      <option className="bg-slate-900">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Message Details</label>
                    <Textarea 
                      placeholder="Tell us about your project..." 
                      className="bg-white/5 border-white/10 min-h-[200px] rounded-[2rem] p-6 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-white placeholder:text-slate-600 font-bold" 
                    />
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-20 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 transition-all duration-500 hover:scale-[1.02] group">
                    Send Transmission <Send className="ml-4 w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                <Globe className="w-4 h-4" /> ISO Certified 9001
              </div>
              <div className="flex items-center gap-2 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                <Zap className="w-4 h-4" /> Fast Response
              </div>
              <div className="flex items-center gap-2 font-black text-slate-400 text-[10px] uppercase tracking-widest">
                <ArrowRight className="w-4 h-4" /> 24/7 Support
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
