"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, Building2, User, Globe, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    organization: "", website: "", industry: "", role: "",
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

  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-600/5 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="w-full max-w-xl bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
            <User className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tight mb-2">Client Enrollment</h1>
          <p className="text-slate-400 font-bold text-sm italic">Institutional Access for Innovators & Organizations</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-12 relative px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 -z-10 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></motion.div>
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                step >= s ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "bg-white text-slate-300 border border-slate-100"
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Representative</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input type="text" required placeholder="Full Legal Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Institutional Email</label>
                    <input type="email" required placeholder="name@organization.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Organization / Startup Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input type="text" required value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Industry Sector</label>
                      <select required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer">
                        <option value="">Select Sector</option>
                        <option value="Aerospace">Aerospace</option>
                        <option value="Consumer Electronics">Consumer Electronics</option>
                        <option value="Biotech">Biotech</option>
                        <option value="Fintech">Fintech</option>
                        <option value="Defense">Defense</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Website URL</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input type="url" placeholder="https://" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Protocol (Password)</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verify Protocol</label>
                    <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" />
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                    <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 accent-blue-600" />
                    <label htmlFor="terms" className="text-[11px] font-bold text-slate-500 leading-relaxed">
                      I authorize KALVEX to process institutional data according to the <Link href="/terms-of-service" className="text-blue-600 underline">Nexus Terms</Link> and <Link href="/privacy-policy" className="text-blue-600 underline">Privacy Framework</Link>.
                    </label>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-4">
                {step > 1 ? (
                  <Button type="button" variant="ghost" onClick={handlePrev} className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Previous Node
                  </Button>
                ) : (
                  <Link href="/register">
                    <Button type="button" variant="ghost" className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Change Role</Button>
                  </Link>
                )}
                
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-slate-900 text-white rounded-2xl px-10 h-16 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-blue-600/20 transition-all duration-500">
                  {loading ? "Authenticating..." : step === 3 ? "Initialize Account" : "Next Phase"} 
                  {!loading && step < 3 && <ArrowRight className="w-4 h-4 ml-3" />}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              key="otp"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleOTPVerify} 
              className="space-y-10 text-center py-6"
            >
              <div className="space-y-6">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-2xl text-slate-900 tracking-tight">Identity Verification</h3>
                  <p className="text-slate-400 font-bold text-sm mt-2">A 6-digit synchronization code has been sent to <br/><span className="text-blue-600 font-black underline">{formData.email}</span></p>
                </div>
                
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input key={i} type="text" maxLength={1} className="w-12 h-16 text-center text-2xl font-black bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all text-slate-900" />
                  ))}
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Resend Code in <span className="text-blue-600">00:59</span></p>
              </div>
              
              <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-blue-600 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all duration-700">
                {loading ? "Verifying Token..." : "Authorize & Enter Dashboard"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
