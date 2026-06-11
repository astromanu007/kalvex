"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getNotifications } from "@/app/actions/notifications";
import {
  LayoutDashboard, ShoppingBag, FileText, MessageSquare,
  User, Settings, ChevronRight, Bell, Star, Wallet,
  HelpCircle, LogOut, Share2, Sparkles, Shield, Menu, X, Eye, EyeOff
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/context/LanguageContext";

const NAV = [
  { label: "Dashboard",       href: "/dashboard",              icon: LayoutDashboard },
  { label: "My Orders",       href: "/dashboard/orders",       icon: ShoppingBag },
  { label: "My Projects",     href: "/dashboard/projects",     icon: FileText },
  { label: "Messages",        href: "/dashboard/messages",     icon: MessageSquare },
  { label: "My Wallet",       href: "/dashboard/wallet",       icon: Wallet },
  { label: "My Reviews",      href: "/dashboard/reviews",      icon: Star },
  { label: "My Profile",      href: "/dashboard/profile",      icon: User },
  { label: "Affiliate Program",href: "/dashboard/affiliate",    icon: Share2 },
  { label: "Settings",        href: "/dashboard/settings",     icon: Settings },
  { label: "Help & Support",  href: "/dashboard/help",         icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);

  // Role-based routing redirection
  const role = (session?.user as any)?.role;
  useEffect(() => {
    if (!role) return;

    if (role === "ADMIN" && pathname === "/dashboard") {
      router.replace("/admin");
    } else if (
      (role === "WRITER" || role === "DEVELOPER") &&
      pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/dashboard/messages") &&
      !pathname.startsWith("/dashboard/wallet") &&
      !pathname.startsWith("/dashboard/profile") &&
      !pathname.startsWith("/dashboard/settings") &&
      !pathname.startsWith("/dashboard/help") &&
      !pathname.startsWith("/dashboard/affiliate") &&
      !pathname.startsWith("/dashboard/orders") &&
      !pathname.startsWith("/dashboard/projects") &&
      !pathname.startsWith("/dashboard/reviews")
    ) {
      router.replace("/expert");
    } else if (role === "AFFILIATE" && pathname === "/dashboard") {
      router.replace("/dashboard/affiliate");
    } else if ((role === "USER" || role === "STUDENT") && pathname.startsWith("/expert")) {
      router.replace("/dashboard");
    }
  }, [role, pathname, router]);

  useEffect(() => {
    setNavbarVisible(localStorage.getItem("kalvex_dashboard_navbar") === "true");

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "n") {
        setNavbarVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggle = () => {
    window.dispatchEvent(new Event("toggle-dashboard-navbar"));
    setNavbarVisible((prev) => !prev);
  };

  useEffect(() => {
    if (session?.user) {
      getNotifications().then(res => {
        if (res.notifications) {
          setUnreadCount(res.notifications.filter(n => !n.isRead).length);
        }
      });
    }
  }, [session]);

  const isExpert = role === "WRITER" || role === "DEVELOPER";
  const isAffiliate = role === "AFFILIATE";

  const dynamicNav = NAV.filter(item => {
    if (isExpert && (item.label === "My Orders" || item.label === "My Projects")) {
      return false;
    }
    return true;
  }).map(item => {
    let translatedLabel = item.label;
    if (item.label === "Dashboard") translatedLabel = t("Dashboard");
    else if (item.label === "My Orders") translatedLabel = t("My Orders");
    else if (item.label === "My Projects") translatedLabel = t("My Projects");
    else if (item.label === "Messages") translatedLabel = t("Messages");
    else if (item.label === "My Wallet") translatedLabel = t("Wallet");
    else if (item.label === "My Reviews") translatedLabel = t("Reviews");
    else if (item.label === "My Profile") translatedLabel = t("Profile");
    else if (item.label === "Affiliate Program") translatedLabel = t("Affiliate Commission");
    else if (item.label === "Settings") translatedLabel = t("Settings");
    else if (item.label === "Help & Support") translatedLabel = t("Help & Support");

    let href = item.href;
    if (isExpert && item.label === "Dashboard") {
      href = "/expert";
    } else if (isAffiliate && item.label === "Dashboard") {
      href = "/dashboard/affiliate";
    }

    return { ...item, label: translatedLabel, href };
  });

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
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="bg-blue-50 text-blue-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider border border-blue-100/50">
                {role ?? "USER"}
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t("Online")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {dynamicNav.map((item, i) => {
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
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-550 group ${
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
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">{t("AI Assistant: Active")}</span>
        </div>

        <button
          onClick={handleToggle}
          className="flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all duration-550 w-full group"
        >
          <div className="flex items-center gap-4">
            {navbarVisible ? (
              <EyeOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
            ) : (
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            <span>{navbarVisible ? t("Hide Main Nav") : t("Show Main Nav")}</span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 bg-slate-100/50 px-1.5 py-0.5 rounded">
            Alt+N
          </span>
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-550 w-full group"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          {t("Sign Out")}
        </button>
      </div>
    </div>
  );

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen bg-slate-50 flex transition-all duration-500 ${navbarVisible ? "pt-24" : "pt-0"}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-100 bg-white overflow-hidden shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] rounded-r-[2rem] transition-all duration-500 ${
        navbarVisible 
          ? "sticky top-24 h-[calc(100vh-6rem)]" 
          : "sticky top-0 h-screen"
      }`}>
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
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
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
