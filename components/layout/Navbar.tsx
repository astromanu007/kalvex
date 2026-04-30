"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, ShoppingCart, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-bg-primary/80 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 z-50">
          <span className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            KALVEX
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center space-x-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-primary hover:text-accent-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="text-text-primary hover:text-accent-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <ThemeToggle />

          <button className="relative text-text-primary hover:text-accent-primary transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <Link href="/cart" className="relative text-text-primary hover:text-accent-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
              2
            </span>
          </Link>

          {session ? (
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold overflow-hidden border border-accent-primary/50">
                {session.user?.name?.charAt(0) || "U"}
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-bg-card border border-border rounded-xl shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
                <Link href="/dashboard" className="px-4 py-2 hover:bg-bg-surface text-sm">Dashboard</Link>
                <Link href="/dashboard/orders" className="px-4 py-2 hover:bg-bg-surface text-sm">Orders</Link>
                <Link href="/dashboard/profile" className="px-4 py-2 hover:bg-bg-surface text-sm">Profile</Link>
                <button onClick={() => signOut()} className="px-4 py-2 hover:bg-bg-surface text-sm text-left text-accent-danger">Logout</button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg shadow-glow transition-all hover:-translate-y-[2px]">
                Login / Register
              </Button>
            </Link>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <div className="flex items-center lg:hidden space-x-4 z-50">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-text-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 bg-bg-primary z-40 transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-6 overflow-y-auto">
          <nav className="flex flex-col space-y-4 mb-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-heading font-semibold hover:text-accent-primary transition-colors"
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
                  <Button variant="outline" className="w-full justify-start rounded-lg">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={() => signOut()} variant="ghost" className="w-full justify-start text-accent-danger">
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-accent-primary text-white rounded-lg h-12 text-lg">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
