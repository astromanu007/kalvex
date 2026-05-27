"use client";

import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; isRead: boolean; createdAt: string }>>([]);
  const { data: session } = useSession({ required: false }) || { data: null };
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchableContent = [
    { title: "Home", description: "Main landing page", href: "/", category: "Navigation" },
    { title: "Store", description: "Buy electronic components and gadgets", href: "/electronics", category: "Store" },
    { title: "Projects", description: "View our recent projects and portfolio", href: "/projects", category: "Navigation" },
    { title: "Services", description: "Our range of engineering and academic services", href: "/services", category: "Services" },
    { title: "Writing & Writeups", description: "Professional academic writing services", href: "/services/writing-writeups", category: "Services" },
    { title: "AI Patent Drafter", description: "Draft patents professionally with AI", href: "/patent-drafter", category: "AI Tools" },
    { title: "Resource Center", description: "Educational materials and guides", href: "/resource-center", category: "Resources" },
    { title: "About Us", description: "Learn more about KALVEX Institutional", href: "/about", category: "Company" },
    { title: "Contact", description: "Get in touch with us", href: "/contact", category: "Support" },
    { title: "Blog", description: "Latest news and engineering insights", href: "/blog", category: "Resources" },
    { title: "Careers", description: "Join our team of experts", href: "/careers", category: "Company" },
    { title: "Success Stories", description: "Client testimonials and case studies", href: "/success-stories", category: "Company" },
    { title: "Documentation", description: "Technical documentation and help", href: "/documentation", category: "Resources" },
    { title: "Privacy Policy", description: "Legal and privacy information", href: "/privacy-policy", category: "Legal" },
    { title: "Terms of Service", description: "User agreement and terms", href: "/terms-of-service", category: "Legal" },
  ];

  const filteredResults = searchQuery.length > 0
    ? searchableContent.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    if (session?.user) {
      getNotifications().then(res => {
        if (res.notifications) {
          setNotifications(res.notifications as typeof notifications);
          setUnreadCount(res.notifications.filter((n: { isRead: boolean }) => !n.isRead).length);
        }
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [session]);

  // Minimal Navbar for Auth Pages (Moved down to follow Rules of Hooks)
  if (mounted && (pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/forgot-password"))) {
    return (
      <header className="fixed top-0 left-0 right-0 z-[100] py-8 transition-all duration-500">
        <div className="container mx-auto px-12 max-w-7xl flex items-center justify-between">
          <Link href="/" className="relative z-[110] flex items-center group">
            <img
              src="/kalvex-logo.png"
              alt="KALVEX"
              className="h-10 md:h-12 w-auto object-contain transition-all duration-700 group-hover:scale-105"
            />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-700 group shadow-2xl shadow-slate-900/5"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-2 transition-transform duration-500" />
            Back to Homepage
          </Link>
        </div>
      </header>
    );
  }

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-700 ${mobileMenuOpen ? "z-[250]" : "z-[100]"
        } ${isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm"
          : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-4 md:px-12 max-w-7xl flex items-center justify-between">
        {/* LOGO: NEW BRAND IDENTITY */}
        <Link href="/" className="relative z-[110] flex items-center group">
          <img
            src="/kalvex-logo.png"
            alt="KALVEX"
            className="h-9 md:h-11 w-auto object-contain transition-all duration-500 group-hover:scale-105"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[12px] font-bold uppercase tracking-wider transition-colors relative group/nav ${pathname === link.href ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 rounded-full ${pathname === link.href ? "w-full" : "w-0 group-hover/nav:w-full"
                }`} />
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS: HIGH-STAKES INTERACTION */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex items-center gap-6 pr-6 border-r border-slate-100">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-slate-400 hover:text-blue-600 transition-all duration-500 hover:scale-125 group relative"
            >
              <Search className="w-5 h-5" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap">Search (Ctrl+K)</span>
            </button>

            <button
              onClick={() => {
                if (session) {
                  setNotificationOpen(prev => !prev);
                } else {
                  router.push("/login");
                }
              }}
              className="relative text-slate-400 hover:text-blue-600 transition-all duration-500 hover:scale-125"
            >
              <Bell className={`w-5 h-5 transition-all duration-300 ${unreadCount > 0 ? "text-slate-700" : ""}`} />
              {/* Subtle pulse ring when notifications exist */}
              {unreadCount > 0 && (
                <span className={`absolute inset-0 rounded-full animate-ping opacity-20 ${unreadCount >= 10 ? "bg-red-500" : unreadCount >= 4 ? "bg-orange-500" : "bg-blue-500"
                  }`} />
              )}
              {unreadCount > 0 && (
                <span className={`absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-xl transition-all duration-300 ${unreadCount >= 10
                    ? "bg-red-500 shadow-red-500/40 scale-110"
                    : unreadCount >= 4
                      ? "bg-orange-500 shadow-orange-500/40"
                      : "bg-blue-600 shadow-blue-600/40"
                  }`}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <Link href="/cart" className="relative text-slate-400 hover:text-blue-600 transition-all duration-500 hover:scale-125">
              <ShoppingCart className={`w-5 h-5 transition-all duration-300 ${cartCount > 0 ? "text-slate-700" : ""}`} />
              {/* Pulse ring */}
              {cartCount > 0 && (
                <span className={`absolute inset-0 rounded-full animate-ping opacity-20 ${cartCount >= 10 ? "bg-red-500" : cartCount >= 4 ? "bg-orange-500" : "bg-blue-500"
                  }`} />
              )}
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-xl transition-all duration-300 ${cartCount >= 10
                    ? "bg-red-500 shadow-red-500/40 scale-110"
                    : cartCount >= 4
                      ? "bg-orange-500 shadow-orange-500/40"
                      : "bg-blue-600 shadow-blue-600/40"
                  }`}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
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
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">User Account</p>
                    <p className="text-sm font-black text-slate-900 mt-1 truncate">{session.user?.name || "Member"}</p>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:text-blue-600 group/item">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <Link href="/dashboard/orders" className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:text-blue-600 group/item">
                    <ShoppingCart className="w-4 h-4" /> My Orders <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <Link href="/dashboard/profile" className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:text-blue-600 group/item">
                    <Settings className="w-4 h-4" /> Settings <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <div className="h-px bg-slate-50 my-4 mx-6" />
                  <button onClick={() => signOut()} className="flex items-center gap-4 px-6 py-4 hover:bg-red-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-600 transition-all group/item">
                    <LogOut className="w-4 h-4" /> Sign Out
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

        {/* MOBILE TOGGLE */}
        <div className="flex items-center lg:hidden z-[110]">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[200] lg:hidden flex flex-col"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
            
            <div className="flex flex-col h-full pt-32 px-10 pb-10 relative z-10">
              <nav className="flex flex-col space-y-3 mb-10">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`text-[32px] font-black tracking-tight transition-colors ${
                          isActive ? "text-blue-600" : "text-slate-900"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <div className="mt-auto space-y-8">
                {session ? (
                  <button
                    onClick={() => signOut()}
                    className="w-full bg-slate-900 text-white py-5 rounded-[1.2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20"
                  >
                    Sign Out <LogOut className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="w-full bg-[#0F172A] text-white py-5 rounded-[1.2rem] font-black text-sm flex items-center justify-center gap-2 shadow-2xl shadow-slate-900/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In <ChevronRight className="w-4 h-4" />
                  </Link>
                )}

                <div className="flex items-center gap-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* GLOBAL SEARCH OVERLAY */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xl flex items-start justify-center pt-32 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 flex items-center gap-6 border-b border-slate-50">
                <Search className="w-8 h-8 text-blue-600" />
                <input
                  autoFocus
                  placeholder="Search KALVEX..."
                  className="bg-transparent border-none outline-none text-2xl font-black text-slate-900 placeholder:text-slate-200 w-full tracking-tighter"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                {filteredResults.length > 0 ? (
                  <div className="grid gap-2">
                    {filteredResults.map((result, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          router.push(result.href);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all text-left group"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                          <LayoutDashboard className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-black text-slate-900 tracking-tight">{result.title}</h4>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                              {result.category}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-400 mt-1">{result.description}</p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : searchQuery.length > 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8 text-slate-200" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900 tracking-tight">No results for "{searchQuery}"</p>
                      <p className="text-sm font-bold text-slate-400 mt-1">Try a different search term.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6">Quick Sections</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {searchableContent.slice(0, 6).map((item, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            router.push(item.href);
                            setSearchOpen(false);
                          }}
                          className="p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
                        >
                          <h5 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{item.title}</h5>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 truncate">{item.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION PANEL */}
      <AnimatePresence>
        {notificationOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setNotificationOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-24 right-4 md:right-12 z-[160] w-[22rem] bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Inbox</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">Notifications</p>
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <span className={`px-3 py-1 text-white text-[10px] font-black rounded-full ${unreadCount >= 10 ? "bg-red-500" : unreadCount >= 4 ? "bg-orange-500" : "bg-blue-600"
                      }`}>
                      {unreadCount > 99 ? "99+" : unreadCount} new
                    </span>
                  )}
                  <button
                    onClick={() => setNotificationOpen(false)}
                    className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-[28rem] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="p-3">
                    {notifications.map((notif, i) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex gap-4 p-5 rounded-2xl mb-2 cursor-pointer transition-all hover:bg-slate-50 ${!notif.isRead ? "bg-blue-50/50" : ""
                          }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${!notif.isRead ? "bg-blue-600" : "bg-slate-200"
                          }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">{notif.title}</p>
                          <p className="text-xs font-bold text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] font-black text-slate-300 mt-2 uppercase tracking-widest">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 flex flex-col items-center text-center px-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mb-4">
                      <Bell className="w-7 h-7 text-slate-200" />
                    </div>
                    <p className="text-base font-black text-slate-900">All caught up!</p>
                    <p className="text-sm font-bold text-slate-400 mt-1">No notifications yet.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-50">
                <button
                  onClick={() => { router.push("/dashboard/profile"); setNotificationOpen(false); }}
                  className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-900 text-[11px] font-black uppercase tracking-widest transition-all duration-300"
                >
                  View All in Dashboard
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
