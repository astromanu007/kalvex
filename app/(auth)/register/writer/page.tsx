"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, PenTool, BookOpen, GraduationCap, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScholarRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    highestDegree: "", expertise: "", publications: "", university: "",
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
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/5 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="w-full max-w-xl bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/20">
            <PenTool className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tight mb-2">Scholar Network</h1>
          <p className="text-slate-400 font-bold text-sm italic">Join the Elite Circle of Technical & Patent Writers</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-12 relative px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 -z-10 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></motion.div>
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                step >= s ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "bg-white text-slate-300 border border-slate-100"
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
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Name</label>
                    <input type="text" required placeholder="Dr./Mr./Ms. Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Email</label>
                    <input type="email" required placeholder="scholar@university.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Highest Degree</label>
                      <select required value={formData.highestDegree} onChange={e => setFormData({...formData, highestDegree: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all appearance-none">
                        <option value="">Select Degree</option>
                        <option value="PhD">PhD / PostDoc</option>
                        <option value="Masters">Masters (M.Tech/MS)</option>
                        <option value="Bachelors">Bachelors (Senior)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Expertise</label>
                      <input type="text" placeholder="e.g. AI, Quantum, IP" value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Affiliated University / Research Body</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input type="text" required value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Create Secure Password</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all" />
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                    <BookOpen className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                      By joining, you agree to KALVEX’s <span className="text-indigo-600">Confidentiality Protocol</span> and academic integrity guidelines. Your expertise will be verified via institutional records.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-4">
                <Button type="button" variant="ghost" onClick={step > 1 ? handlePrev : undefined} className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                  {step > 1 ? <><ArrowLeft className="w-4 h-4 mr-2" /> Back</> : <Link href="/register">Change Role</Link>}
                </Button>
                
                <Button type="submit" disabled={loading} className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-10 h-16 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all duration-500">
                  {loading ? "Processing..." : step === 3 ? "Complete Enrollment" : "Continue"} 
                  {!loading && step < 3 && <ArrowRight className="w-4 h-4 ml-3" />}
                </Button>
              </div>
            </motion.form>
          ) : (
            <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Expertise Acknowledged</h3>
              <p className="text-slate-400 font-bold">Please check your inbox at <span className="text-indigo-600">{formData.email}</span> to verify your academic credentials.</p>
              <Button onClick={() => router.push("/dashboard")} className="w-full h-16 bg-slate-900 rounded-2xl text-white font-black uppercase tracking-widest text-xs">Verify & Login</Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
