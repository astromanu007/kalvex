"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, Code, Terminal, Cpu, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EngineerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    skills: "", github: "", experience: "", specialism: "",
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
    <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-[#fafbfc] px-4 relative overflow-hidden">
      {/* Subtle Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.2]">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-100 rounded-full blur-[120px]" />
      </div>
      
      <div className="w-full max-w-xl bg-white p-12 rounded-[3rem] border border-slate-100 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] relative overflow-hidden z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/20">
            <Code className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tight mb-2 uppercase">Engineer Node</h1>
          <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">System Initialization & Protocol Setup</p>
        </div>

        {/* Binary Progress Tracker */}
        <div className="flex items-center justify-between mb-12 relative px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-slate-100 -z-10"></div>
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-blue-600 -z-10"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></motion.div>
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${
                step >= s ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "bg-white text-slate-300 border border-slate-100"
              }`}
            >
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : `0${s}`}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step < 4 ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Legal Name</label>
                    <input type="text" required placeholder="User_Identity" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-mono focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Communication Channel (Email)</label>
                    <input type="email" required placeholder="dev@node.io" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-mono focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-sm" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tech Stack / Skills</label>
                      <input type="text" placeholder="e.g. Next.js, CUDA" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-mono focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Primary Domain</label>
                      <select required value={formData.specialism} onChange={e => setFormData({...formData, specialism: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-mono focus:border-blue-600 focus:bg-white outline-none transition-all appearance-none cursor-pointer shadow-sm">
                        <option value="">Select Domain</option>
                        <option value="FullStack">Full Stack Dev</option>
                        <option value="Hardware">Hardware / IoT</option>
                        <option value="AI">AI / ML Engineer</option>
                        <option value="Embedded">Embedded Systems</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Github Repository Index</label>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input type="url" placeholder="github.com/username" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-4 text-slate-900 font-mono focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-sm" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secret Access Key (Password)</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-slate-900 font-mono focus:border-blue-600 focus:bg-white outline-none transition-all shadow-sm" />
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                    <Terminal className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-wider">
                      By proceeding, you agree to KALVEX&apos;s <span className="text-blue-600">Security Clearance</span> and <span className="text-blue-600">NDA protocols</span> for proprietary hardware development.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-4">
                <Button type="button" variant="ghost" onClick={step > 1 ? handlePrev : undefined} className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition-colors">
                  {step > 1 ? <><ArrowLeft className="w-4 h-4 mr-2" /> Back</> : <Link href="/register">Change Role</Link>}
                </Button>
                
                <Button type="submit" disabled={loading} className="bg-slate-900 hover:bg-blue-600 text-white rounded-2xl px-10 h-16 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all duration-500">
                  {loading ? "Injecting..." : step === 3 ? "Initialize Node" : "Sync Next"} 
                  {!loading && step < 3 && <ArrowRight className="w-4 h-4 ml-3" />}
                </Button>
              </div>
            </motion.form>
          ) : (
            <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/20">
                <Cpu className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">System Online</h3>
              <p className="text-slate-500 font-bold font-mono">Verification handshake sent to <span className="text-blue-600">{formData.email}</span></p>
              <Button onClick={() => router.push("/dashboard")} className="w-full h-16 bg-slate-900 rounded-2xl text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-600 transition-all duration-700 shadow-2xl">Access Nexus</Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
