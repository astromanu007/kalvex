"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, Building2, TrendingUp, DollarSign, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    businessType: "", channel: "", reach: "", paymentMode: "",
    password: "", confirmPassword: ""
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-white px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-emerald-50 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="w-full max-w-xl bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-emerald-900/5 relative overflow-hidden">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/20 rotate-3">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tight mb-2">Partner Registration</h1>
          <p className="text-slate-400 font-bold text-sm tracking-tight">Scale with KALVEX Business Growth</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-12 relative px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-50 -z-10"></div>
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 -z-10 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></motion.div>
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                step >= s ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20" : "bg-white text-slate-200 border border-slate-100"
              }`}
            >
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step < 4 ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name / Entity Contact</label>
                    <input type="text" required placeholder="John Smith" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Email</label>
                    <input type="email" required placeholder="partners@yourbrand.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 outline-none transition-all" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Type</label>
                      <select required value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 outline-none transition-all appearance-none cursor-pointer">
                        <option value="">Select Type</option>
                        <option value="Agency">Agency</option>
                        <option value="Influencer">Influencer</option>
                        <option value="Consultancy">Consultancy</option>
                        <option value="Educational">Educational Body</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Channel</label>
                      <div className="relative">
                        <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input type="text" placeholder="e.g. LinkedIn, YouTube" value={formData.channel} onChange={e => setFormData({...formData, channel: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expected Monthly Reach</label>
                    <input type="text" required placeholder="e.g. 50k+ Followers" value={formData.reach} onChange={e => setFormData({...formData, reach: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 outline-none transition-all" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 outline-none transition-all" />
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
                    <DollarSign className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
                      Welcome to the growth engine. By registering, you agree to our <span className="text-emerald-600 underline">Commission Policy</span>. Earnings are settled on the 1st of every month via UPI/Bank.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-4">
                <Button type="button" variant="ghost" onClick={step > 1 ? handlePrev : undefined} className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                  {step > 1 ? <><ArrowLeft className="w-4 h-4 mr-2" /> Back</> : <Link href="/register">Change Role</Link>}
                </Button>
                
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-slate-900 text-white rounded-2xl px-12 h-16 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-emerald-600/20 transition-all duration-500">
                  {loading ? "Registering..." : step === 3 ? "Complete Registration" : "Continue"} 
                  {!loading && step < 3 && <ArrowRight className="w-4 h-4 ml-3" />}
                </Button>
              </div>
            </motion.form>
          ) : (
            <div className="text-center py-10 space-y-8 animate-in fade-in duration-700">
              <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/30 rotate-12">
                <Building2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registration Request Received</h3>
              <p className="text-slate-400 font-bold px-6 leading-relaxed">Our partnership team will review your application and activate your partner dashboard within <span className="text-emerald-600 font-black">24 hours</span>.</p>
              <Button onClick={() => router.push("/dashboard")} className="w-full h-16 bg-slate-900 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-colors duration-500">Go to Dashboard</Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
