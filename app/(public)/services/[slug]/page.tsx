"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShieldCheck, Clock, FileText, Loader2, Check } from "lucide-react";
import { createOrder } from "@/app/actions/orders";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const SERVICES_DATA: Record<string, any> = {
  "phd-thesis": { desc: "End-to-end support and drafting for your doctoral research thesis to meet university standards.", price: 25000, delivery: "30-45 Days", fields: { topicLabel: "Thesis Topic / Domain", topicPlaceholder: "e.g. Machine Learning in Healthcare", scopeLabel: "Word Count / Chapters", scopePlaceholder: "e.g. 5 Chapters, 20k words" }, deliverables: ["Full Thesis", "Plagiarism Report", "PPT Presentation", "Source Code"] },
  "research-paper": { desc: "High-quality research papers ready for IEEE, Scopus, or other major journals.", price: 12500, delivery: "14-21 Days", fields: { topicLabel: "Paper Topic / Domain", topicPlaceholder: "e.g. AI-Powered Stethoscope", scopeLabel: "Word Count / Page Count", scopePlaceholder: "e.g. 15k words or 50 pages" }, deliverables: ["Journal Paper", "Plagiarism Report", "PPT Presentation", "Source Code", "Submission Help"] },
  "final-year-report": { desc: "Professional project reports, technical manuals, and documentation for your final year.", price: 5000, delivery: "5-7 Days", fields: { topicLabel: "Project Topic", topicPlaceholder: "e.g. Smart IoT Home System", scopeLabel: "Page Count", scopePlaceholder: "e.g. 50-60 pages" }, deliverables: ["Project Report", "Plagiarism Report", "PPT Presentation", "Source Code"] },
  "design-patent": { desc: "Protect the unique visual look and feel of your invention with official registration.", price: 15000, delivery: "2-3 Months (Filing in 7 Days)", fields: { topicLabel: "Invention Name", topicPlaceholder: "e.g. Ergonomic Smart Mouse", scopeLabel: "Number of Views / Drawings", scopePlaceholder: "e.g. 7 views (Top, Bottom, etc.)" }, deliverables: ["Technical Drawings", "Application Forms", "Government Filing", "Status Tracking"] },
  "utility-patent": { desc: "Technical drafting and claims architecture for your functional engineering inventions.", price: 35000, delivery: "21-30 Days", fields: { topicLabel: "Invention Concept", topicPlaceholder: "e.g. Novel drone stabilization method", scopeLabel: "Number of Claims / Complexity", scopePlaceholder: "e.g. 10 claims, 3 diagrams" }, deliverables: ["Patent Draft", "Technical Diagrams", "Prior Art Search", "Government Filing"] },
  "copyright": { desc: "Officially register your software code, technical manuals, or creative works.", price: 8000, delivery: "30-45 Days", fields: { topicLabel: "Work Title / Type", topicPlaceholder: "e.g. Mobile App Source Code", scopeLabel: "Size of Work", scopePlaceholder: "e.g. 10,000 lines of code" }, deliverables: ["Copyright Application", "Government Filing", "Digital Certificate", "Source Copy"] },
  "trademark": { desc: "Register your startup logo, brand name, or tagline across India securely.", price: 10000, delivery: "6-12 Months (Filing in 3 Days)", fields: { topicLabel: "Brand Name / Logo Description", topicPlaceholder: "e.g. 'KALVEX' Wordmark", scopeLabel: "Business Classes", scopePlaceholder: "e.g. Class 9 and 42" }, deliverables: ["Trademark Search", "Application Forms", "Government Filing", "Status Tracking"] },
  "mini-project": { desc: "Pre-built or custom mini-projects featuring high-quality source code and schematics.", price: 8000, delivery: "7-10 Days", fields: { topicLabel: "Project Concept", topicPlaceholder: "e.g. Bluetooth Home Automation", scopeLabel: "Hardware/Software Requirements", scopePlaceholder: "e.g. Arduino UNO, Android App" }, deliverables: ["Source Code", "Circuit Diagrams", "Project Report", "Working Demo Video"] },
  "major-project": { desc: "Complex final-year engineering projects for CS, Electronics, and Robotics students.", price: 25000, delivery: "21-30 Days", fields: { topicLabel: "Project Domain / Topic", topicPlaceholder: "e.g. AI Drone for Crop Monitoring", scopeLabel: "Key Technologies", scopePlaceholder: "e.g. Python, YOLOv8, Raspberry Pi" }, deliverables: ["Source Code", "Hardware Implementation", "Project Report", "Research Paper", "PPT Presentation"] }
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = SERVICES_DATA[slug] || {
    desc: "Complete end-to-end services strictly adhering to quality guidelines.", price: 10000, delivery: "14-21 Days",
    fields: { topicLabel: "Project Domain / Topic", topicPlaceholder: "e.g. Technical Topic", scopeLabel: "Scope / Volume Assessment", scopePlaceholder: "e.g. 15k words or 50 pages" },
    deliverables: ["Technical Report", "Source Code", "Presentation", "CAD Models", "Plagiarism Report"]
  };

  const serviceDetails = {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    basePrice: data.price,
    delivery: data.delivery,
    desc: data.desc,
  };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

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
    
    if (!session) {
      router.push("/login");
      return;
    }

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
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Link href="/services" className="inline-flex items-center text-[10px] font-black text-slate-400 hover:text-blue-600 mb-12 transition-all uppercase tracking-[0.2em] group">
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Services
          </Link>

          <div className="bg-white border border-slate-100 rounded-[3rem] p-12 md:p-20 mb-16 flex flex-col md:flex-row gap-16 items-center shadow-2xl shadow-slate-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-50/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
            <div className="flex-1 space-y-10 relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20">
                Premium Service
              </div>
              <h1 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter leading-[0.9]">
                {serviceDetails.title}
              </h1>
              <p className="text-slate-400 text-xl leading-relaxed font-bold max-w-2xl">
                {serviceDetails.desc}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-8">
                <div className="flex items-center gap-4 text-slate-900 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <Clock className="w-5 h-5 text-blue-600" /> 
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Est. Delivery</p>
                    <p className="text-sm font-black">{serviceDetails.delivery}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-900 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600" /> 
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Security</p>
                    <p className="text-sm font-black">Identity Masked</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-96 bg-slate-900 rounded-[3rem] p-12 text-center shrink-0 shadow-2xl shadow-slate-900/40 relative z-10 border border-slate-800">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Starting Price</p>
              <div className="font-heading font-black text-6xl text-white mb-3 tracking-tighter flex items-start justify-center gap-2">
                <span className="text-2xl mt-2 text-slate-600 font-bold">₹</span>
                {serviceDetails.basePrice.toLocaleString()}
              </div>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Base Rate</p>
              <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Available Now</span>
              </div>
            </div>
          </div>

          {/* Multi-step Order Form */}
          <div className="bg-white border border-slate-100 rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-slate-900/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-12">
              <div>
                <h2 className="font-heading font-black text-4xl text-slate-900 tracking-tight mb-2">Service <span className="text-blue-600">Inquiry</span></h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tell us what you need</p>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-6 w-full md:w-80">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 space-y-3">
                    <div className={`h-1.5 rounded-full transition-all duration-700 ${step >= s ? "bg-blue-600 shadow-lg shadow-blue-600/20" : "bg-slate-100"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest block text-center ${step >= s ? "text-blue-600" : "text-slate-300"}`}>
                      Step 0{s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{data.fields.topicLabel}</label>
                        <input type="text" placeholder={data.fields.topicPlaceholder} value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-slate-900 font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deadline Target</label>
                        <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-slate-900 font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{data.fields.scopeLabel}</label>
                      <input type="text" placeholder={data.fields.scopePlaceholder} value={formData.wordCount} onChange={(e) => setFormData({...formData, wordCount: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-slate-900 font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="space-y-8">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">What do you need?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {data.deliverables.map((item: string) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleDeliverable(item)}
                            className={`p-6 rounded-3xl border-2 transition-all duration-500 flex items-center justify-between group ${
                              formData.deliverables.includes(item) 
                                ? "border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-600/5" 
                                : "border-slate-100 bg-slate-50 hover:border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.deliverables.includes(item) ? "bg-blue-600 text-white" : "bg-white text-slate-300"}`}>
                                <Check className="w-5 h-5" />
                              </div>
                              <span className={`text-[11px] font-black uppercase tracking-widest text-left ${formData.deliverables.includes(item) ? "text-slate-900" : "text-slate-400"}`}>
                                {item}
                              </span>
                            </div>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border-2 ${formData.deliverables.includes(item) ? "bg-blue-600 border-blue-600 text-white scale-110" : "bg-white border-slate-100 text-transparent"}`}>
                              <Check className="w-3 h-3" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Guidelines</label>
                      <textarea rows={5} placeholder="Include any specific rules, formats, or preferences..." value={formData.guidelines} onChange={(e) => setFormData({...formData, guidelines: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-slate-900 font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200 resize-none" />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12 text-center"
                  >
                    <div className="w-32 h-32 bg-blue-50 text-blue-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/10 border border-blue-100 relative">
                      <FileText className="w-12 h-12" />
                      <div className="absolute inset-0 rounded-[3rem] border-4 border-blue-600 animate-ping opacity-10" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-heading font-black text-4xl text-slate-900 tracking-tight">Almost <span className="text-blue-600">Done!</span></h3>
                      <p className="text-slate-400 text-lg font-bold max-w-lg mx-auto leading-relaxed">Our experts will review your request and get back to you shortly.</p>
                    </div>
                    <div className="flex items-start gap-6 bg-slate-900 border border-slate-800 p-8 rounded-[3rem] text-left max-w-2xl mx-auto shadow-2xl">
                      <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.15em] leading-loose">
                        Your information is secure and confidential. We never share your data. All communication stays within the secure KALVEX platform.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-6 pt-12">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="border-slate-100 text-slate-400 h-16 px-12 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all duration-500">
                    Back
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className={`h-16 px-16 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl group ${
                    step < 3 
                      ? "bg-slate-900 hover:bg-blue-600 text-white shadow-slate-900/20 ml-auto" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 w-full"
                  }`}
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 mr-4 animate-spin" /> Submitting...</>
                  ) : step < 3 ? (
                    <>Next Step <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    "Submit Request"
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
