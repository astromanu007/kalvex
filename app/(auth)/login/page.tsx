"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, GraduationCap, Code, PenTool, Shield, Building2, Fingerprint, Lock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const ROLES = [
  { id: "USER",       label: "Client",     icon: User },
  { id: "STUDENT",    label: "Researcher", icon: GraduationCap },
  { id: "WRITER",     label: "Scholar",    icon: PenTool },
  { id: "DEVELOPER",  label: "Engineer",   icon: Code },
  { id: "AFFILIATE",  label: "Partner",    icon: Building2 },
  { id: "ADMIN",      label: "Command",    icon: Shield },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", { redirect: false, email, password });
      if (res?.error) {
        setError("Authentication failed. Verify your credentials.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("A connection anomaly occurred. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel: Institutional Brand */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-slate-900 p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.15),transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group z-10">
          <div className="w-12 h-12 bg-white rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-white/10 group-hover:bg-blue-600 transition-all duration-500">
            <span className="font-heading font-black text-xl text-slate-900 group-hover:text-white transition-colors">K</span>
          </div>
          <div>
            <span className="font-heading font-black text-2xl tracking-tighter text-white">KALVEX</span>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">Labs Elite</p>
          </div>
        </Link>

        {/* Quote */}
        <div className="z-10 space-y-8">
          <div className="w-12 h-1 bg-blue-600 rounded-full" />
          <blockquote className="text-4xl font-heading font-black text-white leading-tight tracking-tighter">
            Engineering the <span className="text-blue-600">Future</span> of Academic Excellence.
          </blockquote>
          <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-sm">
            Access India's premier institutional ecosystem for high-stakes engineering research, proprietary prototypes, and strategic industrial innovation.
          </p>
          <div className="flex items-center gap-6 pt-4 border-t border-slate-800">
            {["200+ Projects", "50+ Patents", "ISO Certified"].map(stat => (
              <div key={stat} className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">{stat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-4 z-10 bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl px-6 py-4">
          <Fingerprint className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Protocol</p>
            <p className="text-xs font-black text-white">Masked Identity Authentication</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Authentication Interface */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 lg:px-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full max-w-md space-y-10"
        >
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
              <Lock className="w-3 h-3" /> Secure Node Access
            </div>
            <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tighter">Authorize Entry</h1>
            <p className="text-slate-400 font-bold">Select your node classification to proceed.</p>
          </div>

          {/* Role Selector */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Node Classification</p>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center justify-center py-5 px-3 rounded-2xl border-2 transition-all duration-500 group ${
                    role === r.id
                      ? "border-blue-600 bg-blue-600/5 text-blue-600 shadow-xl shadow-blue-600/10"
                      : "border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:text-slate-600 hover:shadow-xl hover:shadow-slate-900/5"
                  }`}
                >
                  <r.icon className={`w-5 h-5 mb-2 transition-transform group-hover:scale-110 ${role === r.id ? "text-blue-600" : ""}`} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Node Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-slate-900 font-black text-sm focus:outline-none focus:border-blue-600 focus:ring-8 ring-blue-600/5 transition-all placeholder:text-slate-200 shadow-xl shadow-slate-900/5"
                  placeholder="identity@domain.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Authorization Key</label>
                <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors">
                  Reset Key
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-slate-900 font-black text-sm focus:outline-none focus:border-blue-600 focus:ring-8 ring-blue-600/5 transition-all placeholder:text-slate-200 shadow-xl shadow-slate-900/5"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl"
                >
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-slate-900/20 transition-all duration-700 hover:scale-[1.02] group"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  Authorize Entry <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Google OAuth */}
          {(role === "USER" || role === "STUDENT") && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Or via</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <Button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                variant="outline"
                className="w-full h-16 border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:border-blue-600/30 hover:bg-blue-600/5 transition-all shadow-xl shadow-slate-900/5"
              >
                <svg className="w-5 h-5 mr-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </div>
          )}

          <p className="text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            No account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 transition-colors">
              Register Node
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
