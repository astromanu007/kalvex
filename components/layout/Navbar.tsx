"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Bell } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { getNotifications } from "@/app/actions/notifications";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Electronics Store", href: "/electronics" },
  { name: "Project Shop", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/about" },
  { name: "AI Design Patent", href: "/patent-drafter" },
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
    window.addEventListener("scroll", handleScroll);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 z-50 flex items-center gap-3 group">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center font-heading font-black text-white shadow-2xl shadow-slate-900/20 group-hover:bg-blue-600 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3">K</div>
          <span className="font-heading font-black text-2xl tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors duration-500">
            KALVEX
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all duration-300 relative group/nav"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover/nav:w-full" />
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden lg:flex items-center space-x-6">
          <button className="text-slate-400 hover:text-blue-600 transition-all duration-300 hover:scale-110">
            <Search className="w-5 h-5" />
          </button>

          <button className="relative text-slate-400 hover:text-blue-600 transition-all duration-300 hover:scale-110">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg shadow-blue-600/40">
                {unreadCount}
              </span>
            )}
          </button>

          <Link href="/cart" className="relative text-slate-400 hover:text-blue-600 transition-all duration-300 hover:scale-110">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-slate-900 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg">
              2
            </span>
          </Link>

          {session ? (
            <div className="relative group">
              <button className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black overflow-hidden hover:bg-white hover:shadow-xl transition-all duration-500">
                {session.user?.name?.charAt(0) || "U"}
              </button>
              <div className="absolute right-0 top-full mt-4 w-56 bg-white border border-slate-100 rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 flex flex-col py-3 px-2">
                <Link href="/dashboard" className="px-4 py-3 hover:bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 transition-colors">Dashboard</Link>
                <Link href="/dashboard/orders" className="px-4 py-3 hover:bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 transition-colors">Orders</Link>
                <Link href="/dashboard/profile" className="px-4 py-3 hover:bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 transition-colors">Profile</Link>
                <div className="h-px bg-slate-50 my-2 mx-4" />
                <button onClick={() => signOut()} className="px-4 py-3 hover:bg-red-50 rounded-2xl text-xs font-bold text-left text-red-600 transition-colors">Logout</button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-slate-900 hover:bg-blue-600 text-white rounded-2xl px-8 h-14 font-black shadow-2xl shadow-slate-900/20 transition-all hover:-translate-y-1 duration-500 text-xs uppercase tracking-widest">
                Elite Access
              </Button>
            </Link>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <div className="flex items-center lg:hidden space-x-4 z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-32 px-8 pb-12 overflow-y-auto">
          <nav className="flex flex-col space-y-6 mb-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-3xl font-heading font-black text-slate-900 hover:text-blue-600 transition-all duration-300 tracking-tighter"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col space-y-4">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-100 text-slate-900 font-black text-lg shadow-sm">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={() => signOut()} variant="ghost" className="w-full h-16 text-red-600 font-black text-lg">
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-slate-900 text-white rounded-2xl h-16 text-lg font-black shadow-2xl shadow-slate-900/20 uppercase tracking-widest">
                  Elite Access
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
