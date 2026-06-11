"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Briefcase,
  Settings, Users, Layers, Star, Image as ImageIcon,
  ChevronRight, LogOut, X, CalendarDays, Eye, EyeOff, Shield, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: Star },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Messages Desk", href: "/admin/messages", icon: MessageSquare },
  { label: "Store Items", href: "/admin/store", icon: ShoppingBag },
  { label: "Projects", href: "/admin/projects", icon: Briefcase },
  { label: "Services", href: "/admin/services", icon: Layers },
  { label: "Submissions", href: "/admin/submissions", icon: ImageIcon },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Security Logs", href: "/admin/logs", icon: Shield },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [navbarVisible, setNavbarVisible] = useState(false);

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

  return (
    <aside className="w-80 h-full max-h-screen overflow-y-auto sticky top-0 bg-white border-r border-slate-100 p-8 flex flex-col gap-12">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-black text-xl text-slate-900 tracking-tighter">KALVEX</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between p-4 rounded-2xl transition-all duration-300",
                isActive
                  ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/10"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "group-hover:text-blue-600 transition-colors")} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {isActive && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-slate-50 flex flex-col gap-2">
        <button 
          onClick={handleToggle}
          className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all group"
        >
          <div className="flex items-center gap-4">
            {navbarVisible ? (
              <EyeOff className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
            ) : (
              <Eye className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
            )}
            <span className="text-[11px] font-black uppercase tracking-widest">
              {navbarVisible ? "Hide Main Nav" : "Show Main Nav"}
            </span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 bg-slate-100 px-2 py-0.5 rounded">
            Alt+N
          </span>
        </button>

        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
