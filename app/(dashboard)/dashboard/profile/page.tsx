"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Save, GraduationCap, User, Lock, Bell } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"personal" | "academic" | "security" | "notifications">("personal");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const TABS = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "academic", label: "Academic Info", icon: GraduationCap },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ] as const;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-heading font-bold text-2xl text-text-primary">My Profile</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your personal and academic information</p>
      </div>

      {/* Avatar Block */}
      <div className="bg-bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-3xl">
            {session?.user?.name?.charAt(0) ?? "U"}
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-glow hover:scale-110 transition-transform">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <h2 className="font-heading font-semibold text-xl">{session?.user?.name ?? "Kalvex User"}</h2>
          <p className="text-text-secondary text-sm">{session?.user?.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[10px] font-mono bg-accent-primary/10 text-accent-primary border border-accent-primary/20 px-2.5 py-1 rounded-full">
              {session?.user?.maskedId ?? "KV-0000"}
            </span>
            <span className="text-[10px] font-semibold bg-accent-success/10 text-accent-success border border-accent-success/20 px-2.5 py-1 rounded-full capitalize">
              {session?.user?.role?.toLowerCase() ?? "user"} ✓
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-bg-card border border-border rounded-xl p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${tab === t.id ? "bg-accent-primary text-white shadow-glow" : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"}`}
          >
            <t.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-5">
        {tab === "personal" && (
          <>
            <h3 className="font-heading font-semibold text-base">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", placeholder: session?.user?.name ?? "", type: "text" },
                { label: "Email Address", placeholder: session?.user?.email ?? "", type: "email" },
                { label: "Phone Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
                { label: "City", placeholder: "Pune", type: "text" },
                { label: "Date of Birth", placeholder: "DD/MM/YYYY", type: "date" },
              ].map(({ label, placeholder, type }) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input type={type} defaultValue={placeholder} className="w-full bg-bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Bio (Optional)</label>
                <textarea rows={3} placeholder="Tell us a bit about yourself..." className="w-full bg-bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary resize-none" />
              </div>
            </div>
          </>
        )}

        {tab === "academic" && (
          <>
            <h3 className="font-heading font-semibold text-base">Academic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "College / University", placeholder: "e.g. VIT Pune" },
                { label: "Branch / Department", placeholder: "e.g. Computer Engineering" },
                { label: "Year of Study", placeholder: "Final Year" },
                { label: "Student ID / Roll No.", placeholder: "XXXXXX" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input defaultValue={placeholder} className="w-full bg-bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary" />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "security" && (
          <>
            <h3 className="font-heading font-semibold text-base">Change Password</h3>
            <div className="space-y-4">
              {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input type="password" className="w-full bg-bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-primary" placeholder="••••••••" />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "notifications" && (
          <>
            <h3 className="font-heading font-semibold text-base">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: "Order status updates", sub: "Get notified when your order status changes" },
                { label: "New messages from experts", sub: "Receive alerts when an expert sends you a message" },
                { label: "Platform announcements", sub: "New features, offers, and platform news" },
                { label: "WhatsApp notifications", sub: "Receive updates on your registered WhatsApp number" },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{pref.label}</p>
                    <p className="text-xs text-text-muted">{pref.sub}</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked id={pref.label} />
                    <label htmlFor={pref.label} className="block w-10 h-6 bg-bg-surface rounded-full cursor-pointer peer-checked:bg-accent-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-5 after:h-5 after:transition-transform peer-checked:after:translate-x-4 after:shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-border mt-2">
          <Button onClick={handleSave} disabled={saving} className="bg-accent-primary text-white rounded-xl shadow-glow h-10 px-6 gap-2">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </Button>
          {saved && <p className="text-sm text-accent-success">Profile updated successfully.</p>}
        </div>
      </div>
    </div>
  );
}
