"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { getNotifications } from "@/app/actions/notifications";
import {
  LayoutDashboard, ShoppingBag, FileText, MessageSquare,
  User, Settings, ChevronRight, Bell, Star, Wallet, HelpCircle, LogOut, Share2
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "My Projects", href: "/dashboard/projects", icon: FileText },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Wallet & Credits", href: "/dashboard/wallet", icon: Wallet },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Affiliate Portal", href: "/dashboard/affiliate", icon: Share2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user) {
      getNotifications().then(res => {
        if (res.notifications) {
          setUnreadCount(res.notifications.filter(n => !n.isRead).length);
        }
      });
    }
  }, [session]);

  return (
    <div className="min-h-screen pt-20 bg-bg-primary flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-border bg-bg-card h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
        {/* User Identity Card */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {session?.user?.name?.charAt(0) ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{session?.user?.name ?? "User"}</p>
              <p className="text-[10px] font-mono text-accent-primary">{session?.user?.maskedId ?? "KV-0000"}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                  }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-accent-primary" : ""}`} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="w-3 h-3 text-accent-primary" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-accent-danger hover:bg-accent-danger/10 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
