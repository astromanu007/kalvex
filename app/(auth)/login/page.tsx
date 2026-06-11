"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, GraduationCap, Code, PenTool, Shield, Building2, Fingerprint, Lock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = [
  { id: "USER",       label: "Client",     icon: User },
  { id: "STUDENT",    label: "Student",    icon: GraduationCap },
  { id: "WRITER",     label: "Scholar",    icon: PenTool },
  { id: "DEVELOPER",  label: "Developer",   icon: Code },
  { id: "ADMIN",      label: "Admin",      icon: Shield },
];

const ROLE_THEMES: Record<string, {
  name: string;
  color: string;
  activeBtn: string;
  hoverBtn: string;
  glowColor: string;
  focusInput: string;
  btnSubmit: string;
}> = {
  USER: {
    name: "Client",
    color: "#3b82f6",
    activeBtn: "border-blue-600 bg-blue-50/70 text-blue-600 shadow-xl shadow-blue-600/10",
    hoverBtn: "hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50/20",
    glowColor: "rgba(59, 130, 246, 0.25)",
    focusInput: "focus:border-blue-600 focus:ring-blue-600/20",
    btnSubmit: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 text-white",
  },
  STUDENT: {
    name: "Student",
    color: "#10b981",
    activeBtn: "border-emerald-600 bg-emerald-50/70 text-emerald-600 shadow-xl shadow-emerald-600/10",
    hoverBtn: "hover:border-emerald-200 hover:text-emerald-500 hover:bg-emerald-50/20",
    glowColor: "rgba(16, 185, 129, 0.25)",
    focusInput: "focus:border-emerald-600 focus:ring-emerald-600/20",
    btnSubmit: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 text-white",
  },
  WRITER: {
    name: "Scholar",
    color: "#f59e0b",
    activeBtn: "border-amber-600 bg-amber-50/70 text-amber-600 shadow-xl shadow-amber-600/10",
    hoverBtn: "hover:border-amber-200 hover:text-amber-500 hover:bg-amber-50/20",
    glowColor: "rgba(245, 158, 11, 0.25)",
    focusInput: "focus:border-amber-600 focus:ring-amber-600/20",
    btnSubmit: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20 text-white",
  },
  DEVELOPER: {
    name: "Developer",
    color: "#8b5cf6",
    activeBtn: "border-purple-600 bg-purple-50/70 text-purple-600 shadow-xl shadow-purple-600/10",
    hoverBtn: "hover:border-purple-200 hover:text-purple-500 hover:bg-purple-50/20",
    glowColor: "rgba(139, 92, 246, 0.25)",
    focusInput: "focus:border-purple-600 focus:ring-purple-600/20",
    btnSubmit: "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20 text-white",
  },

  ADMIN: {
    name: "Admin",
    color: "#f43f5e",
    activeBtn: "border-rose-600 bg-rose-50/70 text-rose-600 shadow-xl shadow-rose-600/10",
    hoverBtn: "hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50/20",
    glowColor: "rgba(244, 63, 94, 0.25)",
    focusInput: "focus:border-rose-600 focus:ring-rose-600/20",
    btnSubmit: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 text-white",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Spotlight card ref
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Border Spotlight Coordinate Calculations
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    wrapperRef.current.style.setProperty("--mouse-x", `${x}px`);
    wrapperRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", { redirect: false, email, password });
      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const activeTheme = ROLE_THEMES[role] || ROLE_THEMES.USER;

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center relative overflow-hidden selection:bg-blue-600/10">
      
      {/* Decorative Shifting Background Glow Spheres */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/10 blur-[120px]" />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full bg-pink-400/5 blur-[100px] animate-pulse" style={{ animationDuration: "12s" }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-12 sm:py-16 md:py-24 flex flex-col items-center">
        
        {/* FUTURISTIC PREMIUM LOGO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-10 sm:mb-12 flex flex-col items-center relative"
        >
          {/* Orbital Sweeps System */}
          <div className="absolute w-24 h-24 sm:w-28 sm:h-28 -z-10 flex items-center justify-center pointer-events-none">
            {/* Inner pulsing orbit */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1], rotate: 360 }}
              transition={{ scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 15, ease: "linear" } }}
              className="absolute inset-0 rounded-full border border-dashed opacity-30"
              style={{ borderColor: activeTheme.color }}
            />
            {/* Outer rotating orbit */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute w-[125%] h-[125%] rounded-full border border-dotted opacity-20"
              style={{ borderColor: activeTheme.color }}
            />
          </div>

          <div className="relative flex items-center justify-center mb-5">
            {/* Ambient Backlight Glow */}
            <div 
              className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full blur-2xl transition-all duration-700 opacity-60"
              style={{ backgroundColor: activeTheme.color }}
            />

            <motion.div 
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-white/70 backdrop-blur-xl rounded-[1.3rem] sm:rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-500 relative overflow-hidden shadow-2xl cursor-pointer"
              style={{ 
                borderColor: `${activeTheme.color}35`,
                boxShadow: `0 20px 40px -10px ${activeTheme.glowColor}`
              }}
            >
              {/* Metallic Sheen Sweep */}
              <motion.div 
                initial={{ x: "-150%" }}
                animate={{ x: "150%" }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 z-0"
              />

              <Shield className="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-500 z-10 drop-shadow-md" style={{ color: activeTheme.color }} />
            </motion.div>
          </div>

          {/* Typography Header */}
          <div className="text-center space-y-2.5">
            <h2 className="text-sm sm:text-base font-black tracking-[0.5em] uppercase bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 bg-clip-text text-transparent flex items-center justify-center pl-[0.5em] drop-shadow-sm">
              KALVEX PORTAL
            </h2>
            
            {/* System Status Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-100 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400">
                System Active // Node Verified
              </span>
            </div>
          </div>
        </motion.div>


        {/* MAIN AUTH CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-lg relative group"
        >
          {/* Dynamic Rainbow Spotlight Border Wrapper */}
          <div
            ref={wrapperRef}
            onMouseMove={handleMouseMove}
            className="relative p-[2px] rounded-[3rem] overflow-hidden bg-slate-200/40 hover:bg-transparent shadow-[0_64px_128px_-32px_rgba(0,0,0,0.08)] transition-all duration-700 w-full"
            style={{
              // @ts-ignore
              "--spotlight-color": activeTheme.color
            }}
          >
            {/* Dynamic Shifting Border Gradient */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
              style={{
                background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color) 0%, #6366f1 35%, #a855f7 65%, #ec4899 100%, transparent 100%)`,
              }}
            />

            {/* Core Form Card */}
            <div className="relative z-10 bg-white/95 backdrop-blur-3xl rounded-[2.9rem] p-6 sm:p-10 lg:p-12 transition-colors duration-500">
              <div className="space-y-6 sm:space-y-10">
                
                {/* ANIMATION SECTION */}
                <div className="flex flex-col items-center -mt-4 sm:-mt-6 -mb-4 sm:-mb-2">
                  <div 
                    className="w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center"
                    dangerouslySetInnerHTML={{
                      __html: `<dotlottie-wc src="https://lottie.host/f0cc4b98-7cab-4943-be0b-7c810c148178/JLPlsDBnQm.lottie" style="width: 100%; height: 100%" autoplay loop></dotlottie-wc>`
                    }}
                  />
                </div>

                {/* Header */}
                <div className="text-center space-y-2 sm:space-y-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">Sign In</h1>
                  <p className="text-slate-600 font-bold text-xs sm:text-sm">Welcome back. Log in to your account.</p>
                </div>

                {/* Role Selectors */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {ROLES.map((r) => {
                    const isSelected = role === r.id;
                    const theme = ROLE_THEMES[r.id];
                    return (
                      <button
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-500 ${
                          isSelected
                            ? theme.activeBtn
                            : `border-slate-50 bg-slate-50 text-slate-400 ${theme.hoverBtn}`
                        }`}
                      >
                        <r.icon 
                          className={`w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2 transition-transform duration-500 ${isSelected ? "scale-110" : ""}`}
                          style={{ color: isSelected ? theme.color : undefined }}
                        />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center leading-none">{r.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    
                    {/* Email Field */}
                    <div className="relative group">
                      <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 transition-colors duration-500" style={{ color: email ? activeTheme.color : undefined }} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email Address"
                        className={`w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 sm:py-5 pl-12 sm:pl-16 pr-4 sm:pr-6 text-slate-900 font-black text-xs focus:outline-none focus:bg-white focus:ring-4 transition-all placeholder:text-slate-300 shadow-sm ${activeTheme.focusInput}`}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="relative group">
                      <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10">
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 transition-colors duration-500" style={{ color: password ? activeTheme.color : undefined }} />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                        className={`w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 sm:py-5 pl-12 sm:pl-16 pr-20 text-slate-900 font-black text-xs focus:outline-none focus:bg-white focus:ring-4 transition-all placeholder:text-slate-300 shadow-sm ${activeTheme.focusInput}`}
                      />
                      <Link 
                        href="/forgot-password" 
                        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
                        style={{ color: activeTheme.color }}
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
                        className="bg-red-50 border border-red-100 text-red-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center"
                      >
                        ⚠ {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-14 sm:h-16 rounded-2xl font-black uppercase tracking-[0.3em] text-[9px] sm:text-[10px] shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${activeTheme.btnSubmit}`}
                    style={{
                      boxShadow: `0 20px 40px -10px ${activeTheme.glowColor}`
                    }}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                {/* Alternative Auth */}
                <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-4 sm:gap-6 px-2 sm:px-4">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] whitespace-nowrap">Or sign in with</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full h-12 sm:h-14 rounded-2xl border-2 border-slate-100 flex items-center justify-center gap-3 sm:gap-4 text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all group"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
