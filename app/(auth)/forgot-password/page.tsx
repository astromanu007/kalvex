"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center relative overflow-hidden selection:bg-blue-600/10">
      {/* ENGINEERING ATMOSPHERE */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.4]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(37, 99, 235, 0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-[20%] right-[10%] w-64 h-64 border border-blue-600/5 rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10 py-12 flex flex-col items-center">
        {/* LOGO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 flex flex-col items-center"
        >
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 mb-4">
            <Zap className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-[10px] font-black text-slate-900 tracking-[0.4em] uppercase">KALVEX Recovery Portal</h2>
        </motion.div>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
            {!submitted ? (
              <div className="space-y-10">
                {/* Header */}
                <div className="text-center space-y-3">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Account Recovery</h1>
                  <p className="text-slate-600 font-bold text-sm leading-relaxed">
                    Enter your institutional email to receive an access override link.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2">
                        <Mail className="w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Institutional Email"
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-5 pl-16 pr-6 text-slate-900 font-black text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-slate-900/20 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? "Initializing Recovery..." : "Send Reset Link"}
                  </Button>
                </form>

                <div className="pt-6 text-center">
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Return to Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-8 py-4">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Shield className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Email Dispatched</h3>
                  <p className="text-slate-400 font-bold text-sm leading-relaxed">
                    Check your inbox for <b>{email}</b>. We've sent a secure link to reset your institutional credentials.
                  </p>
                </div>
                <div className="pt-4">
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 bg-slate-50 text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* SYSTEM DECOR */}
      <div className="fixed bottom-8 right-12 text-[9px] font-black text-slate-200 uppercase tracking-[0.5em] select-none hidden lg:block">
        Recovery Protocol // Active
      </div>
    </div>
  );
}
