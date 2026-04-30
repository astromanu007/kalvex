"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Bell, User, LogOut, LayoutDashboard, Settings, Sparkles, Shield, ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { getNotifications } from "@/app/actions/notifications";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Store", href: "/electronics" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "AI Patent", href: "/patent-drafter" },
  { name: "Resources", href: "/resource-center" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession({ required: false }) || { data: null };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (session?.user) {
      getNotifications().then(res => {
        if (res.notifications) {
          setUnreadCount(res.notifications.filter(n => !n.isRead).length);
        }
      });
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [session]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-2xl shadow-slate-900/5 py-4"
          : "bg-transparent py-8"
      }`}
    >
      <div className="container mx-auto px-4 md:px-12 max-w-7xl flex items-center justify-between">
        {/* LOGO: INSTITUTIONAL BRANDING */}
        <Link href="/" className="relative z-[110] flex items-center gap-5 group">
          <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center font-black text-white shadow-2xl group-hover:bg-blue-600 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <span className="text-2xl font-heading tracking-widest">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-3xl tracking-[-0.08em] text-slate-900 group-hover:text-blue-600 transition-colors duration-300 uppercase leading-none">
              KALVEX
            </span>
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1.5 leading-none">Institutional</span>
          </div>
        </Link>

        {/* DESKTOP NAV: CINEMATIC REVEAL */}
        <nav className="hidden xl:flex items-center space-x-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors duration-300 relative group/nav"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover/nav:w-full" />
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS: HIGH-STAKES INTERACTION */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex items-center gap-6 pr-6 border-r border-slate-100">
            <button className="text-slate-400 hover:text-blue-600 transition-all duration-500 hover:scale-125">
              <Search className="w-5 h-5" />
            </button>

            <button className="relative text-slate-400 hover:text-blue-600 transition-all duration-500 hover:scale-125">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-xl shadow-blue-600/40 border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <Link href="/cart" className="relative text-slate-400 hover:text-blue-600 transition-all duration-500 hover:scale-125">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-xl shadow-slate-900/10 border-2 border-white">
                2
              </span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {session ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative group"
              >
                <button className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black overflow-hidden hover:bg-white hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] transition-all duration-700 group/user">
                   {session.user?.image ? (
                     <img src={session.user.image} alt="User" className="w-full h-full object-cover grayscale group-hover/user:grayscale-0 transition-all duration-700" />
                   ) : (
                     <User className="w-6 h-6 text-slate-400 group-hover/user:text-blue-600 transition-colors" />
                   )}
                </button>
                <div className="absolute right-0 top-full mt-6 w-72 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0 transition-all duration-700 flex flex-col py-6 px-3 z-[120]">
                  <div className="px-6 py-4 mb-2 border-b border-slate-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Authorized Personnel</p>
                    <p className="text-sm font-black text-slate-900 mt-1 truncate">{session.user?.name || "Member Node"}</p>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:text-blue-600 group/item">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <Link href="/dashboard/orders" className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:text-blue-600 group/item">
                    <ShoppingCart className="w-4 h-4" /> Commissions <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <Link href="/dashboard/profile" className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:text-blue-600 group/item">
                    <Settings className="w-4 h-4" /> Parameters <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <div className="h-px bg-slate-50 my-4 mx-6" />
                  <button onClick={() => signOut()} className="flex items-center gap-4 px-6 py-4 hover:bg-red-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-600 transition-all group/item">
                    <LogOut className="w-4 h-4" /> Deauthorize
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link href="/login">
                  <Button className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl px-8 h-12 font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-sm flex items-center gap-2">
                    Sign In <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MOBILE TOGGLE: PRECISION CONTROL */}
        <div className="flex items-center xl:hidden space-x-6 z-[110]">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20 transition-all duration-500 active:scale-90"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER: STAGGERED REVEAL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[105] xl:hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-50/50 rounded-full -z-10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col h-full pt-40 px-12 pb-16 overflow-y-auto">
              <nav className="flex flex-col space-y-8 mb-20">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-5xl font-heading font-black text-slate-900 hover:text-blue-600 transition-all duration-500 tracking-tighter block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-auto flex flex-col gap-6"
              >
                {session ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-20 rounded-[2rem] border-slate-200 text-slate-900 font-black text-xl uppercase tracking-widest shadow-xl shadow-slate-900/5">
                        <LayoutDashboard className="w-6 h-6 mr-4" /> Command Center
                      </Button>
                    </Link>
                    <Button onClick={() => signOut()} variant="ghost" className="w-full h-20 text-red-600 font-black text-xl uppercase tracking-widest">
                      <LogOut className="w-6 h-6 mr-4" /> Deauthorize
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-slate-900 hover:bg-blue-600 transition-colors text-white rounded-2xl h-16 text-lg font-bold flex items-center justify-center gap-2">
                      Sign In <ChevronRight className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                
                <div className="flex justify-center gap-10 pt-8 border-t border-slate-50">
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">AI Enabled</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="w-6 h-6 text-slate-900" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Secure Node</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
