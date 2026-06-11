"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Settings, Shield, Save, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import CursorGlowCard from "@/components/ui/CursorGlowCard";
import { useLanguage, Language } from "@/components/context/LanguageContext";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

  const [toggles, setToggles] = useState({
    fileSecurity: true,
    loginAlerts: true,
    maskId: true,
    weeklyDigest: false
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setLanguage(selectedLang);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const handleToggleChange = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-550" />
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-650 animate-pulse" />
            {t("Settings Corridor")}
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">{t("Configure your dashboard preferences, access credentials, and security policies")}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Configuration */}
        <CursorGlowCard glowColor="indigo">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">{t("Dashboard Settings")}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t("Configure display region and base multiplier node")}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2">{t("Display Language")}</label>
              <select 
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as Language)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
              >
                <option value="en-UK">{t("English (UK)")}</option>
                <option value="en-US">{t("English (US)")}</option>
                <option value="mr">{t("Marathi (मराठी)")}</option>
                <option value="hi">{t("Hindi (हिंदी)")}</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2">{t("Primary Currency")}</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650">
                <option value="INR">{t("INR (₹)")}</option>
                <option value="USD">{t("USD ($)")}</option>
              </select>
            </div>
          </div>
        </CursorGlowCard>

        {/* Security policies toggle sheet */}
        <CursorGlowCard glowColor="purple">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">{t("Security & Access Policies")}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t("Manage encryption settings and session safety protocols")}</p>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {[
              { id: "fileSecurity", label: t("Secure File Downloads"), sub: t("Enforce secure, encrypted download pathways for deliverable files") },
              { id: "loginAlerts", label: t("Sign-in Notification Alerts"), sub: t("Receive immediate email notifications on every new session login") },
              { id: "maskId", label: t("Profile ID Masking"), sub: t("Show your Masked ID (e.g. KV-E0000) instead of your full name across public feeds") },
              { id: "weeklyDigest", label: t("Weekly Payout Digests"), sub: t("Send weekly earnings and task summaries directly to email node") }
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{pref.label}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-relaxed">{pref.sub}</p>
                </div>
                <div className="relative flex-shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={toggles[pref.id as keyof typeof toggles]} 
                    onChange={() => handleToggleChange(pref.id as any)}
                    id={pref.id} 
                  />
                  <label htmlFor={pref.id} className="block w-10 h-6 bg-slate-100 border border-slate-200 rounded-full cursor-pointer peer-checked:bg-slate-950 peer-checked:border-slate-950 transition-colors after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 peer-checked:after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-transform peer-checked:after:translate-x-4 after:shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </CursorGlowCard>

        {/* Save Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-150">
          <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-indigo-650 text-white rounded-xl h-11 px-8 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t("Saving...") : t("Save Settings")}
          </Button>
          {saved && <p className="text-xs font-black uppercase tracking-wider text-emerald-600">✓ {t("Settings saved successfully.")}</p>}
        </div>
      </form>
    </div>
  );
}
