"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);

  useEffect(() => {
    setNavbarVisible(localStorage.getItem("kalvex_dashboard_navbar") === "true");

    const handleToggle = () => {
      setNavbarVisible((prev) => !prev);
    };
    window.addEventListener("toggle-dashboard-navbar", handleToggle);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "n") {
        setNavbarVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("toggle-dashboard-navbar", handleToggle);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying Authority...</p>
      </div>
    );
  }

  // Check if user is admin
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className={`min-h-screen bg-slate-50 flex overflow-hidden transition-all duration-500 ${navbarVisible ? "pt-24" : "pt-0"}`}>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-black text-lg text-slate-900 tracking-tighter">KALVEX</h2>
            <span className="bg-blue-100 text-blue-700 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
