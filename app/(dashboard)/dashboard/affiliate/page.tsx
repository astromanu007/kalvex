"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Share2, Users, IndianRupee, TrendingUp, Copy, CheckCircle, 
  AlertCircle, ChevronRight, PieChart, CreditCard, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAffiliateStats, updateAffiliateUPI } from "@/app/actions/affiliate";

export default function AffiliatePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [upi, setUpi] = useState("");
  const [updatingUpi, setUpdatingUpi] = useState(false);

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
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 text-accent-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">Affiliate Portal</h1>
        <p className="text-text-secondary text-sm mt-1">Earn 5% commission on every order referred by you.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Referral Clicks", value: stats?.clicks ?? "0", icon: Share2, color: "text-accent-primary", bg: "bg-accent-primary/10" },
          { label: "Successful Conversions", value: stats?.conversions ?? "0", icon: Users, color: "text-accent-success", bg: "bg-accent-success/10" },
          { label: "Pending Payout", value: `₹${stats?.pendingPayout ?? "0"}`, icon: IndianRupee, color: "text-accent-warning", bg: "bg-accent-warning/10" },
          { label: "Total Earnings", value: `₹${stats?.totalEarnings ?? "0"}`, icon: TrendingUp, color: "text-accent-secondary", bg: "bg-accent-secondary/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="font-heading font-bold text-xl text-text-primary">{stat.value}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Link Card */}
          <div className="bg-bg-card border border-border rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-150" />
            <div className="relative z-10">
              <h2 className="font-heading font-bold text-xl text-text-primary mb-2">Your Referral Link</h2>
              <p className="text-sm text-text-secondary mb-6">Share this link with your network. When they sign up and place an order, you earn.</p>
              
              <div className="flex gap-2">
                <div className="flex-1 bg-bg-surface border border-border rounded-xl px-4 py-3 font-mono text-xs text-text-primary flex items-center overflow-x-auto whitespace-nowrap">
                  https://kalvex.com/register?ref={stats?.referralCode}
                </div>
                <Button onClick={handleCopy} className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow rounded-xl px-6">
                  {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied" : "Copy Link"}
                </Button>
              </div>
            </div>
          </div>

          {/* Payout Information */}
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent-primary" /> Payout Settings
            </h2>
            <div className="space-y-4 max-w-md">
              <div className="p-4 bg-accent-warning/5 border border-accent-warning/20 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-accent-warning shrink-0" />
                <p className="text-xs text-text-secondary leading-relaxed">
                  Payouts are processed automatically every Sunday for balances above <span className="font-bold text-text-primary">₹500</span>. Please ensure your UPI ID is correct.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">UPI ID (e.g., name@okaxis)</label>
                <div className="flex gap-2">
                  <input 
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    placeholder="Enter your UPI ID" 
                    className="flex-1 bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary"
                  />
                  <Button onClick={handleUpdateUPI} disabled={updatingUpi} variant="outline" className="border-border rounded-xl px-6 h-12">
                    {updatingUpi ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliate Tiers / Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-bg-card to-bg-surface border border-border rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-lg mb-4">Affiliate Tier</h2>
            <div className="space-y-4">
              <div className="p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-xl text-center">
                <p className="text-[10px] uppercase tracking-widest text-accent-primary font-bold mb-1">Current Tier</p>
                <p className="font-heading font-extrabold text-2xl text-text-primary">{stats?.tier ?? "Standard"}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Next Tier: Silver (7%)</span>
                  <span className="text-text-primary font-bold">40%</span>
                </div>
                <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-accent-primary rounded-full" style={{ width: '40%' }} />
                </div>
                <p className="text-[10px] text-text-muted text-center italic">Refer ₹25,000 more in total orders to level up.</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-accent-secondary" /> Conversion Tip
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Sharing your referral link on student WhatsApp groups or LinkedIn with a short recommendation increases conversion by up to <span className="text-accent-success font-bold">300%</span>.
            </p>
            <Button variant="ghost" className="w-full text-xs text-accent-primary hover:bg-accent-primary/5 gap-2">
              Learn Marketing Strategies <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
