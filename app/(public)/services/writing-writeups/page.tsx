"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Clock, Sparkles, CheckCircle2,
  ArrowRight, Calculator, Zap, ShieldCheck, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

export default function WritingWriteupsPage() {
  const [pages, setPages] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const baseRate = isUrgent ? 10 : 5;
  const totalPrice = pages * baseRate;

  const handleBooking = async () => {
    setIsSubmitting(true);
    // Simulate booking process
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Clean Background */}

      <Navbar />

      {/* Clean Background */}

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 bg-orange-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-orange-600/20">
                <FileText className="w-4 h-4" /> Academic Writing Service
              </div>
              <h1 className="text-6xl md:text-8xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
                Professional <br />
                <span className="text-orange-600">Writeups.</span>
              </h1>
              <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-xl">
                Get high-quality, plagiarism-free technical writeups for your projects, research, and documentation. Fast, reliable, and institution-ready.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard</p>
                    <p className="text-lg font-black text-slate-900">₹5 / Page</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgent</p>
                    <p className="text-lg font-black text-slate-900">₹10 / Page</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interactive Booking Terminal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-900/5 relative"
            >
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form"
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-black flex items-center gap-4 text-slate-900 uppercase tracking-tight">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                        <Calculator className="w-6 h-6" />
                      </div>
                      Service Calculator
                    </h2>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Total Pages
                          </label>
                          <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-black">{pages} Pages</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={pages}
                          onChange={(e) => setPages(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-300">
                          <span>1 Page</span>
                          <span>100 Pages</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setIsUrgent(false)}
                          className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${!isUrgent ? 'border-orange-600 bg-orange-50/50 text-orange-700 shadow-lg shadow-orange-600/5' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
                        >
                          <Clock className="w-6 h-6" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Standard</span>
                          <span className="text-xs font-bold">3-5 Days</span>
                        </button>
                        <button
                          onClick={() => setIsUrgent(true)}
                          className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${isUrgent ? 'border-orange-600 bg-orange-50/50 text-orange-700 shadow-lg shadow-orange-600/5' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
                        >
                          <Zap className="w-6 h-6" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Urgent</span>
                          <span className="text-xs font-bold">24 Hours</span>
                        </button>
                      </div>

                      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
                          <div className="text-center sm:text-left">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Total</p>
                            <p className="text-4xl font-black tracking-tighter">₹{totalPrice}</p>
                          </div>
                          <Button
                            onClick={handleBooking}
                            disabled={isSubmitting}
                            className={`h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all w-full sm:w-auto shadow-2xl bg-orange-600 hover:bg-orange-700 shadow-orange-600/20`}
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Book Service"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-bold text-center flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-500" /> Secure Institutional Transaction
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center space-y-8"
                  >
                    <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/20">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Booking Successful!</h2>
                      <p className="text-slate-400 font-bold">Our experts will contact you within 2 hours to start your writeup.</p>
                    </div>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest"
                    >
                      New Booking
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white border-t border-slate-50 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Sparkles, title: "Plagiarism Free", desc: "100% unique content with official Turnitin reports provided." },
              { icon: ShieldCheck, title: "Data Privacy", desc: "Your project details and data are kept strictly confidential." },
              { icon: Clock, title: "Timely Delivery", desc: "We respect your deadlines. Late delivery means 50% refund." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-100/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-rose-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />
    </div>
  );
}
