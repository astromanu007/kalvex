"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { getNotifications } from "@/app/actions/notifications";
import {
  LayoutDashboard, ShoppingBag, FileText, MessageSquare,
  User, Settings, ChevronRight, Bell, Star, Wallet,
  HelpCircle, LogOut, Share2, Sparkles, Shield, Menu, X
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { label: "Command Center", href: "/dashboard",              icon: LayoutDashboard },
  { label: "Commissions",    href: "/dashboard/orders",       icon: ShoppingBag },
  { label: "Active Missions",href: "/dashboard/projects",     icon: FileText },
  { label: "Secure Channel", href: "/dashboard/messages",     icon: MessageSquare },
  { label: "Asset Vault",    href: "/dashboard/wallet",       icon: Wallet },
  { label: "Assessments",    href: "/dashboard/reviews",      icon: Star },
  { label: "Identity Node",  href: "/dashboard/profile",      icon: User },
  { label: "Alliance Hub",   href: "/dashboard/affiliate",    icon: Share2 },
  { label: "Parameters",     href: "/dashboard/settings",     icon: Settings },
  { label: "Support Intel",  href: "/dashboard/help",         icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      getNotifications().then(res => {
        if (res.notifications) {
          setUnreadCount(res.notifications.filter(n => !n.isRead).length);
        }
      });
    }
  }, [session]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Identity Card */}
      <div className="p-8 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-heading font-black text-xl shadow-2xl shadow-slate-900/20 shrink-0">
            {session?.user?.name?.charAt(0) ?? "K"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900 truncate tracking-tight">{session?.user?.name ?? "Elite Member"}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mt-0.5">
              {(session?.user as any)?.maskedId ?? "KV-0000"}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Active Session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map((item, i) => {
          const active = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 group ${
                  active
                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-900/5"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${active ? "text-blue-400" : ""}`} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 text-blue-400" />}
                {item.href === "/dashboard/messages" && unreadCount > 0 && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-[9px] font-black flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-50 space-y-2">
        <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-blue-600/5 border border-blue-600/10">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">AI Counsel: Active</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-500 w-full group"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Deauthorize
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-100 bg-white h-[calc(100vh-6rem)] sticky top-24 overflow-hidden shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] rounded-r-[2rem]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl lg:hidden flex flex-col rounded-r-[2rem] overflow-hidden"
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="pt-16">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 lg:p-10">
        {/* Mobile Header */}
        <div className="flex items-center gap-4 mb-8 lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-heading font-black text-sm">K</span>
            </div>
            <span className="font-heading font-black text-slate-900 tracking-tighter">KALVEX</span>
          </div>
          {unreadCount > 0 && (
            <Link href="/dashboard/messages" className="ml-auto relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center">{unreadCount}</span>
            </Link>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
