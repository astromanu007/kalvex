"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Share2, Users, IndianRupee, TrendingUp, Copy, CheckCircle, 
  AlertCircle, ChevronRight, PieChart, CreditCard, Loader2, Sparkles, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAffiliateStats, updateAffiliateUPI } from "@/app/actions/affiliate";
import { motion } from "framer-motion";
import CursorGlowCard from "@/components/ui/CursorGlowCard";

export default function AffiliatePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [upi, setUpi] = useState("");
  const [updatingUpi, setUpdatingUpi] = useState(false);

  // Calculator states
  const [calcReferrals, setCalcReferrals] = useState(5);
  const [calcOrderValue, setCalcOrderValue] = useState(8000);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await getAffiliateStats();
      if (res.affiliate) {
        setStats(res.affiliate);
        setUpi(res.affiliate.upiId || "");
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const handleCopy = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(`https://kalvex.com/register?ref=${stats.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpdateUPI = async () => {
    setUpdatingUpi(true);
    const res = await updateAffiliateUPI(upi);
    if (res.success) {
      alert("UPI ID updated successfully!");
    } else {
      alert(res.error || "Failed to update UPI ID");
    }
    setUpdatingUpi(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 text-indigo-650 animate-spin" /></div>;
  }

  // Calculate potential earnings based on current tier percentage (Bronze: 5%, Silver: 7%, Gold: 10%)
  const currentRate = stats?.tier === "Gold" ? 0.10 : stats?.tier === "Silver" ? 0.07 : 0.05;
  const estimatedEarnings = Math.floor(calcReferrals * calcOrderValue * currentRate);

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-550" />
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-650 animate-pulse" />
            Affiliate Commission Center
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">Share Kalvex with your student & developer network to earn passive multipliers</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Referral Clicks", value: stats?.clicks ?? "0", icon: Share2, color: "text-blue-600", bg: "bg-blue-50 border border-blue-100", glow: "blue" as const },
          { label: "Conversions", value: stats?.conversions ?? "0", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 border border-emerald-100", glow: "emerald" as const },
          { label: "Pending Payout", value: `₹${stats?.pendingPayout ?? "0"}`, icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50 border border-amber-100", glow: "amber" as const },
          { label: "Total Earnings", value: `₹${stats?.totalEarnings ?? "0"}`, icon: TrendingUp, color: "text-purple-650", bg: "bg-purple-50 border border-purple-100", glow: "purple" as const },
        ].map((stat) => (
          <CursorGlowCard key={stat.label} glowColor={stat.glow} className="min-h-[130px]" innerClassName="p-5 justify-between">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <div>
              <p className="font-heading font-black text-xl text-slate-800 leading-none">{stat.value}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          </CursorGlowCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Referral Link Card */}
          <CursorGlowCard glowColor="purple" innerClassName="bg-slate-950 text-white rounded-[30px] p-6 md:p-8 justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            
            <div className="space-y-6">
              <div>
                <h2 className="font-heading font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" /> Your Referral Link
                </h2>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1.5 leading-relaxed">
                  Earn up to 10% commission on every order referred by you. Link sign-ups automatically sync.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-indigo-300 flex items-center overflow-x-auto whitespace-nowrap scrollbar-none">
                  https://kalvex.com/register?ref={stats?.referralCode}
                </div>
                <Button onClick={handleCopy} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-xl h-11 px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied Release" : "Copy Link"}
                </Button>
              </div>
            </div>
          </CursorGlowCard>

          {/* Interactive Calculator */}
          <CursorGlowCard glowColor="indigo">
            <div>
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Passive Income Estimator</h3>
              <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-0.5">Drag settings to calculate potential payouts</p>
            </div>

            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-450">
                  <span>Number of Referrals: <span className="text-slate-800 font-extrabold">{calcReferrals}</span></span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={calcReferrals}
                  onChange={e => setCalcReferrals(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-650"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-450">
                  <span>Average Order Value: <span className="text-slate-800 font-extrabold">₹{calcOrderValue.toLocaleString()}</span></span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="1000"
                  value={calcOrderValue}
                  onChange={e => setCalcOrderValue(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-650"
                />
              </div>

              <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-450 block">Estimated Commissions ({Math.floor(currentRate * 100)}%)</span>
                  <span className="text-2xl font-mono font-black text-indigo-650 tracking-tight block mt-1">₹{estimatedEarnings.toLocaleString()}</span>
                </div>
                <Award className="w-8 h-8 text-indigo-400 animate-bounce" />
              </div>
            </div>
          </CursorGlowCard>
        </div>

        {/* Affiliate Tiers & Payout Settings */}
        <div className="space-y-6">
          
          {/* Tiers Card */}
          <CursorGlowCard glowColor="amber">
            <h2 className="font-heading font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-3">Affiliate Tiers</h2>
            
            <div className="space-y-5 pt-3">
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-center">
                <p className="text-[8px] uppercase tracking-widest text-slate-400 font-black mb-1">Current Status</p>
                <p className="font-heading font-black text-xl text-indigo-650 tracking-wide uppercase">{stats?.tier ?? "Standard (5%)"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Next Tier: Silver (7%)</span>
                  <span className="text-slate-800">40%</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-150 p-0.5">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '40%' }} />
                </div>
                <p className="text-[8px] text-slate-400 text-center uppercase tracking-wider font-semibold">Refer ₹25,000 more in total orders to level up.</p>
              </div>
            </div>
          </CursorGlowCard>

          {/* Payout Settings */}
          <CursorGlowCard glowColor="emerald">
            <h2 className="font-heading font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" /> Payout Settings
            </h2>
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[9px] text-amber-800 font-semibold leading-relaxed uppercase tracking-wider">
                  Payouts settle automatically every Sunday to your UPI ID for balances above <span className="font-bold">₹500</span>.
                </p>
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2">UPI Address Node</label>
                <div className="flex gap-2">
                  <input 
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    placeholder="Enter UPI ID (e.g. name@upi)" 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                  />
                  <Button onClick={handleUpdateUPI} disabled={updatingUpi} className="bg-slate-900 hover:bg-indigo-650 text-white rounded-xl h-12 px-5 text-[9px] font-black uppercase tracking-wider">
                    {updatingUpi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </CursorGlowCard>
        </div>
      </div>
    </div>
  );
}
