"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShieldCheck, Clock, FileText, Loader2 } from "lucide-react";
import { createOrder } from "@/app/actions/orders";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const serviceDetails = {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    basePrice: 12500,
    delivery: "14-21 Days",
    desc: "Complete end-to-end writing, editing, and formatting services strictly adhering to your university's guidelines.",
  };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    topic: "", 
    wordCount: "", 
    deadline: "",
    guidelines: "",
    deliverables: [] as string[],
  });

  const toggleDeliverable = (item: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.includes(item) 
        ? prev.deliverables.filter(i => i !== item)
        : [...prev.deliverables, item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    const serviceTypeRaw = slug.toUpperCase().replace(/-/g, "_");
    
    const req = `Topic: ${formData.topic}\nWords/Pages: ${formData.wordCount}\nDeliverables: ${formData.deliverables.join(", ")}\nGuidelines: ${formData.guidelines}`;
    
    const res = await createOrder({
      serviceType: serviceTypeRaw as any,
      requirements: req,
      amount: serviceDetails.basePrice,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    });

    setLoading(false);
    if (res.success) {
      router.push("/dashboard/orders");
    } else {
      alert(res.error || "Failed to submit request.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Link href="/services" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-blue-600 mb-8 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
          </Link>

          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 md:p-16 mb-12 flex flex-col md:flex-row gap-12 items-center shadow-2xl shadow-slate-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
            <div className="flex-1 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Elite Service
              </div>
              <h1 className="font-heading font-black text-4xl md:text-5xl text-slate-900 tracking-tighter">
                {serviceDetails.title}
              </h1>
              <p className="text-slate-500 text-xl leading-relaxed font-medium">
                {serviceDetails.desc}
              </p>
              <div className="flex flex-wrap gap-6 text-sm font-bold">
                <div className="flex items-center gap-3 text-slate-900 bg-slate-50 px-5 py-2.5 rounded-2xl">
                  <Clock className="w-5 h-5 text-blue-600" /> Est. {serviceDetails.delivery}
                </div>
                <div className="flex items-center gap-3 text-slate-900 bg-slate-50 px-5 py-2.5 rounded-2xl">
                  <ShieldCheck className="w-5 h-5 text-blue-600" /> Identity Masked
                </div>
              </div>
            </div>
            <div className="w-full md:w-80 bg-slate-900 rounded-[2.5rem] p-10 text-center shrink-0 shadow-2xl shadow-slate-900/40 relative z-10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Project Investment</p>
              <p className="font-heading font-black text-5xl text-white mb-2">₹{serviceDetails.basePrice.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Starting Price</p>
            </div>
          </div>

          {/* Multi-step Order Form */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-900/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
              <h2 className="font-heading font-black text-3xl text-slate-900">Secure Inquiry</h2>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-4 w-full md:w-64">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 space-y-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${step >= s ? "bg-blue-600" : "bg-slate-100"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest block text-center ${step >= s ? "text-blue-600" : "text-slate-300"}`}>
                      0{s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Project Domain / Topic</label>
                        <input type="text" placeholder="e.g. AI-Powered Stethoscope" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Deadline Target</label>
                        <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Scope / Volume</label>
                      <input type="text" placeholder="e.g. 15k words or 50 pages" value={formData.wordCount} onChange={(e) => setFormData({...formData, wordCount: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Required Deliverables</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["Technical Report", "Source Code", "Presentation (PPT)", "CAD Models", "Thesis Writing", "Plagiarism Report"].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleDeliverable(item)}
                            className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold text-center ${
                              formData.deliverables.includes(item) 
                                ? "border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-600/10" 
                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Detailed Guidelines</label>
                      <textarea rows={5} placeholder="Include specific university formatting rules, tools, or references..." value={formData.guidelines} onChange={(e) => setFormData({...formData, guidelines: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300 resize-none" />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 text-center"
                  >
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/10">
                      <FileText className="w-10 h-10" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-heading font-black text-3xl text-slate-900">Final Validation</h3>
                      <p className="text-slate-500 text-lg font-medium max-w-md mx-auto">Our elite experts will review your brief and provide a precision quote within 180 minutes.</p>
                    </div>
                    <div className="flex items-start gap-4 bg-amber-50 border border-amber-100 p-6 rounded-[2rem] text-left">
                      <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
                      <p className="text-sm text-amber-900 font-medium leading-relaxed">
                        Security Notice: Your identity is 100% masked. Never share personal contact info within the portal. All communication must remain on KALVEX.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 pt-10">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="border-slate-200 text-slate-900 h-14 px-10 rounded-2xl font-bold hover:bg-slate-50">
                    Previous Step
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className={`h-14 px-12 rounded-2xl font-black text-lg transition-all shadow-2xl ${
                    step < 3 
                      ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 ml-auto" 
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 w-full"
                  }`}
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Finalizing Request...</>
                  ) : step < 3 ? (
                    <>Continue Exploration <ArrowRight className="ml-2 w-5 h-5" /></>
                  ) : (
                    "Submit Elite Project Request"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

  );
}
