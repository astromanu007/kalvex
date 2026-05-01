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
    <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-blue-500/10 rounded-full -z-10 blur-[150px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="w-full max-w-xl bg-slate-800/50 backdrop-blur-3xl p-12 rounded-[3rem] border border-slate-700 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/40">
            <Code className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-black text-4xl text-white tracking-tight mb-2 uppercase">Engineer Node</h1>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">System Initialization & Protocol Setup</p>
        </div>

        {/* Binary Progress Tracker */}
        <div className="flex items-center justify-between mb-12 relative px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-slate-700 -z-10"></div>
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-blue-500 -z-10"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></motion.div>
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${
                step >= s ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/40" : "bg-slate-800 text-slate-500 border border-slate-700"
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
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Legal Name</label>
                    <input type="text" required placeholder="User_Identity" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-6 py-4 text-white font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Communication Channel (Email)</label>
                    <input type="email" required placeholder="dev@node.io" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-6 py-4 text-white font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-700" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Tech Stack / Skills</label>
                      <input type="text" placeholder="e.g. Next.js, CUDA" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-6 py-4 text-white font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Primary Domain</label>
                      <select required value={formData.specialism} onChange={e => setFormData({...formData, specialism: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-6 py-4 text-white font-mono focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                        <option value="" className="bg-slate-900">Select Domain</option>
                        <option value="FullStack" className="bg-slate-900">Full Stack Dev</option>
                        <option value="Hardware" className="bg-slate-900">Hardware / IoT</option>
                        <option value="AI" className="bg-slate-900">AI / ML Engineer</option>
                        <option value="Embedded" className="bg-slate-900">Embedded Systems</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Github Repository Index</label>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                      <input type="url" placeholder="github.com/username" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl pl-12 pr-6 py-4 text-white font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-700" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Secret Access Key (Password)</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-6 py-4 text-white font-mono focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                    <Terminal className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                      By proceeding, you agree to KALVEX&apos;s <span className="text-blue-500">Security Clearance</span> and <span className="text-blue-500">NDA protocols</span> for proprietary hardware development.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t border-slate-700/50 mt-4">
                <Button type="button" variant="ghost" onClick={step > 1 ? handlePrev : undefined} className="text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-white">
                  {step > 1 ? <><ArrowLeft className="w-4 h-4 mr-2" /> Back</> : <Link href="/register">Change Role</Link>}
                </Button>
                
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-white hover:text-slate-900 text-white rounded-2xl px-10 h-16 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all duration-500">
                  {loading ? "Injecting..." : step === 3 ? "Initialize Node" : "Sync Next"} 
                  {!loading && step < 3 && <ArrowRight className="w-4 h-4 ml-3" />}
                </Button>
              </div>
            </motion.form>
          ) : (
            <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-blue-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                <Cpu className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">System Online</h3>
              <p className="text-slate-400 font-bold font-mono">Verification handshake sent to <span className="text-blue-500">{formData.email}</span></p>
              <Button onClick={() => router.push("/dashboard")} className="w-full h-16 bg-white rounded-2xl text-slate-900 font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-500 hover:text-white transition-all duration-700">Access Nexus</Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
