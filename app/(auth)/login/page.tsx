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
  { id: "STUDENT",    label: "Student",    icon: GraduationCap },
  { id: "WRITER",     label: "Scholar",    icon: PenTool },
  { id: "DEVELOPER",  label: "Engineer",   icon: Code },
  { id: "AFFILIATE",  label: "Partner",    icon: Building2 },
  { id: "ADMIN",      label: "Admin",      icon: Shield },
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
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center relative overflow-hidden selection:bg-blue-600/10">
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.2]">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-100 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 py-12 flex flex-col items-center">
        {/* LOGO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col items-center"
        >
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 mb-4 group hover:scale-110 transition-transform duration-500">
            <Shield className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-[10px] font-black text-slate-900 tracking-[0.4em] uppercase">KALVEX Portal</h2>
        </motion.div>

        {/* MAIN AUTH CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
            <div className="space-y-10">
              {/* ANIMATION SECTION */}
              <div className="flex flex-col items-center -mt-6 -mb-2">
                <div 
                  className="w-40 h-40 flex items-center justify-center"
                  dangerouslySetInnerHTML={{
                    __html: `<dotlottie-wc src="https://lottie.host/f0cc4b98-7cab-4943-be0b-7c810c148178/JLPlsDBnQm.lottie" style="width: 100%; height: 100%" autoplay loop></dotlottie-wc>`
                  }}
                />
              </div>

              {/* Header */}
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Sign In</h1>
                <p className="text-slate-600 font-bold text-sm">Welcome back to KALVEX. Please enter your details.</p>
              </div>

              {/* Role Selectors */}
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-500 ${
                      role === r.id
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-xl shadow-blue-600/5"
                        : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200 hover:text-slate-500"
                    }`}
                  >
                    <r.icon className={`w-5 h-5 mb-2 transition-transform ${role === r.id ? "scale-110" : ""}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-center">{r.label}</span>
                  </button>
                ))}
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
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
                      placeholder="Email Address"
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-5 pl-16 pr-6 text-slate-900 font-black text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Password"
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-5 pl-16 pr-6 text-slate-900 font-black text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                    />
                    <Link 
                      href="/forgot-password" 
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-500"
                    >
                      Reset
                    </Link>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center"
                    >
                      ⚠ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-slate-900/20 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Alternative Auth */}
              <div className="space-y-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-6 px-4">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Or sign in with</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full h-14 rounded-2xl border-2 border-slate-100 flex items-center justify-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FOOTER LINK */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Don't have an account? <Link href="/register" className="text-blue-600 hover:text-blue-500 transition-colors ml-2 font-black">Sign Up</Link>
          </p>
        </motion.div>
      </div>

      {/* SYSTEM DECOR */}
      <div className="fixed bottom-8 right-12 text-[9px] font-black text-slate-200 uppercase tracking-[0.5em] select-none hidden lg:block">
        KALVEX Platform // Secure Access
      </div>
    </div>
  );
}
