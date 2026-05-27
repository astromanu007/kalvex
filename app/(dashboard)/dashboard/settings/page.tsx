"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Settings, Shield, Bell, Key, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-slate-900">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences, security settings, and defaults</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Settings */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Account Settings</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configure your basic account preferences</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 mb-2">Display Language</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600">
                <option>English (UK)</option>
                <option>English (US)</option>
                <option>Marathi (मराठी)</option>
                <option>Hindi (हिंदी)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 mb-2">Default Currency</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600">
                <option>INR (₹)</option>
                <option>USD ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Security & Access</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Manage your account security and privacy preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: "Secure File Downloads", sub: "Enforce secure download pathways for deliverable files" },
              { label: "Sign-in Notification Alerts", sub: "Receive email alerts on every new login session" },
              { label: "Profile ID Masking", sub: "Show your Masked ID (e.g. KV-0000) instead of your full name on public lists" }
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wider">{pref.label}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{pref.sub}</p>
                </div>
                <div className="relative flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked id={`sec-${i}`} />
                  <label htmlFor={`sec-${i}`} className="block w-10 h-6 bg-slate-100 border border-slate-200 rounded-full cursor-pointer peer-checked:bg-slate-900 peer-checked:border-slate-950 transition-colors after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 peer-checked:after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-transform peer-checked:after:translate-x-4 after:shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
          <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl h-11 px-8 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Updating..." : "Save Settings"}
          </Button>
          {saved && <p className="text-xs font-black uppercase tracking-wider text-emerald-600">✓ Settings successfully updated.</p>}
        </div>
      </form>
    </div>
  );
}
