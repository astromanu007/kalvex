"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, 
  ArrowRight, TrendingUp, IndianRupee, RefreshCw, Send, Landmark, AlertCircle, Loader2, Sparkles, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { getWalletDetails, requestWithdrawal } from "@/app/actions/user";
import CursorGlowCard from "@/components/ui/CursorGlowCard";

export default function WalletPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isExpert = role === "WRITER" || role === "DEVELOPER";

  // State Management
  const [clearedBalance, setClearedBalance] = useState(0);
  const [escrowBalance, setEscrowBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [payoutMethod, setPayoutMethod] = useState<"upi" | "bank">("upi");
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [activeFilter, setActiveFilter] = useState<"all" | "credit" | "debit">("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralsCount, setReferralsCount] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchWallet = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const res = await getWalletDetails();
    if (res.success) {
      setClearedBalance(res.clearedBalance ?? 0);
      setEscrowBalance(res.escrowBalance ?? 0);
      setTransactions(res.transactions ?? []);
      setReferralsCount(res.referralsCount ?? 0);
      setChartData(res.chartData ?? []);
    }
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchWallet(true);
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-650 animate-spin" />
      </div>
    );
  }

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > clearedBalance || !upiId.trim()) {
      setRequestStatus("error");
      return;
    }

    setRequestStatus("loading");
    const res = await requestWithdrawal({
      amount: amountNum,
      payoutMethod,
      payoutDetails: upiId
    });

    if (res.success) {
      setRequestStatus("success");
      setWithdrawAmount("");
      setUpiId("");
      await fetchWallet(false);
      setTimeout(() => setRequestStatus("idle"), 3000);
    } else {
      setRequestStatus("error");
    }
  };

  const handleAddCredits = () => {
    const amountStr = prompt("Enter amount to add (₹):", "500");
    if (!amountStr) return;
    const amt = parseFloat(amountStr);
    if (isNaN(amt) || amt <= 0) return;

    setClearedBalance(prev => prev + amt);
    setTransactions(prev => [
      {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        title: "Added Credits via Gateway",
        type: "credit",
        amount: amt,
        date: new Date().toISOString().split("T")[0],
        status: "Completed"
      },
      ...prev
    ]);
  };

  const filteredTx = transactions.filter(t => {
    if (activeFilter === "all") return true;
    return t.type === activeFilter;
  });

  // Dynamic SVG chart points calculation
  const maxAmt = chartData.length > 0 ? Math.max(...chartData.map(d => d.amount), 1000) : 1000;
  const getY = (val: number) => 25 - (val / maxAmt) * 20;

  const y1 = chartData.length > 0 ? getY(chartData[0].amount) : 25;
  const y2 = chartData.length > 1 ? getY(chartData[1].amount) : 25;
  const y3 = chartData.length > 2 ? getY(chartData[2].amount) : 25;
  const y4 = chartData.length > 3 ? getY(chartData[3].amount) : 25;

  const pathD = `M 0 ${y1} C 16 ${y1}, 16 ${y2}, 33.3 ${y2} C 50 ${y2}, 50 ${y3}, 66.6 ${y3} C 83.3 ${y3}, 83.3 ${y4}, 100 ${y4}`;
  const areaD = `M 0 ${y1} C 16 ${y1}, 16 ${y2}, 33.3 ${y2} C 50 ${y2}, 50 ${y3}, 66.6 ${y3} C 83.3 ${y3}, 83.3 ${y4}, 100 ${y4} L 100 30 L 0 30 Z`;

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-550" />
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight capitalize flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
            {isExpert ? "Expert Payout Hub" : "My Wallet Ledger"}
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
            {isExpert 
              ? "Track clearances, active escrow milestones, and request instant UPI/Bank settlements"
              : "Manage your prepaid balances, welcome incentives, and transaction logs"
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
            Identity: <span className="font-mono text-indigo-600">{(session?.user as any)?.maskedId ?? "KV-U0000"}</span>
          </span>
        </div>
      </div>

      {/* Main Balances Grid - Well organized into 3 equal cards to prevent stretching */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cleared / Main Wallet Card */}
        <CursorGlowCard glowColor="indigo" className="min-h-[220px]" innerClassName="justify-between p-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-650 block mb-1">
                {isExpert ? "Cleared Earnings" : "Prepaid Credits"}
              </span>
              <span className="text-3xl sm:text-4xl font-mono font-black tracking-tight text-slate-900 block mt-1">
                ₹{clearedBalance.toLocaleString()}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-indigo-650" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-100">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Cleared Node
            </span>
            {isExpert ? (
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Settles Active
              </span>
            ) : (
              <Button onClick={handleAddCredits} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[8px] tracking-widest h-8 px-4 rounded-xl flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Credits
              </Button>
            )}
          </div>
        </CursorGlowCard>

        {/* Escrow Balance Card */}
        <CursorGlowCard glowColor="amber" className="min-h-[220px]" innerClassName="justify-between p-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 block mb-1">
                {isExpert ? "Escrow Balance" : "Active Referrals"}
              </span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-slate-900 tracking-tight block mt-1">
                {isExpert ? `₹${escrowBalance.toLocaleString()}` : `${referralsCount} Users`}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="flex items-center gap-1 mt-6 pt-5 border-t border-slate-100 text-[8px] font-semibold text-slate-450 uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-amber-550 shrink-0" />
            {isExpert ? "Released on completion verification" : "Earned 10% cashback credits"}
          </div>
        </CursorGlowCard>

        {/* Referral / Orders Card */}
        <CursorGlowCard glowColor="emerald" className="min-h-[220px]" innerClassName="justify-between p-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-650 block mb-1">
                {isExpert ? "Active Referrals" : "Total Orders"}
              </span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-slate-900 tracking-tight block mt-1">
                {isExpert ? `${referralsCount} Members` : `${transactions.length} orders`}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-5 h-5 text-emerald-650" />
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-[8px] font-semibold text-slate-450 uppercase tracking-wider">
            {isExpert ? "Referral code earns 10% payouts" : "Prepaid order logs active"}
          </div>
        </CursorGlowCard>
      </div>

      {/* Main Content Grid: Chart / Form + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left Column: Visual Analytics & Withdrawal Form */}
        <div className="lg:col-span-2 flex flex-col gap-6 justify-between">
          
          {/* Visual Earnings Analytics Graph */}
          <CursorGlowCard glowColor="purple" className="flex-1" innerClassName="justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Earnings Timeline</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Project earnings trajectory over past 4 weeks</p>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Secure Node
              </span>
            </div>

            {/* SVG Graph */}
            <div className="h-44 w-full bg-slate-50/50 border border-dashed border-slate-200/80 rounded-2xl relative p-4 flex flex-col justify-between overflow-hidden">
              <svg className="w-full h-28 overflow-visible mt-2" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path d={areaD} fill="url(#grad)" />
                {/* Path line */}
                <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
                {/* Grid guidelines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#e2e8f0" strokeWidth="0.15" strokeDasharray="2" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#e2e8f0" strokeWidth="0.15" strokeDasharray="2" />
                {/* Hotspots */}
                <circle cx="0" cy={y1} r="1.2" fill="#8b5cf6" stroke="#fff" strokeWidth="0.4" />
                <circle cx="33.3" cy={y2} r="1.2" fill="#8b5cf6" stroke="#fff" strokeWidth="0.4" />
                <circle cx="66.6" cy={y3} r="1.2" fill="#8b5cf6" stroke="#fff" strokeWidth="0.4" />
                <circle cx="100" cy={y4} r="1.2" fill="#10b981" stroke="#fff" strokeWidth="0.4" />
              </svg>
              
              <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-2 px-1">
                {chartData && chartData.length > 0 ? (
                  chartData.map((week, idx) => (
                    <span key={idx} className={idx === chartData.length - 1 ? "text-indigo-650 font-extrabold" : ""}>
                      {week.label} (₹{week.amount.toLocaleString()})
                    </span>
                  ))
                ) : (
                  <>
                    <span>Week 1 (₹0)</span>
                    <span>Week 2 (₹0)</span>
                    <span>Week 3 (₹0)</span>
                    <span className="text-indigo-650 font-extrabold">Week 4 (₹0)</span>
                  </>
                )}
              </div>
            </div>
          </CursorGlowCard>

          {/* Action Hub: Withdrawal Request UPI/Bank Form */}
          {isExpert ? (
            <CursorGlowCard glowColor="indigo">
              <div>
                <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Settlement Request Desk</h3>
                <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-0.5">Withdraw cleared earnings to your bank node or UPI address</p>
              </div>

              <form onSubmit={handleWithdrawal} className="space-y-5 mt-4">
                <div className="flex gap-1.5 p-1 bg-slate-50 border border-slate-150 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("upi")}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${payoutMethod === "upi" ? "bg-white text-slate-900 shadow-sm border border-slate-150" : "text-slate-400 hover:text-slate-650"}`}
                  >
                    <Send className="w-3.5 h-3.5 inline mr-1.5" /> UPI Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("bank")}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${payoutMethod === "bank" ? "bg-white text-slate-900 shadow-sm border border-slate-150" : "text-slate-400 hover:text-slate-650"}`}
                  >
                    <Landmark className="w-3.5 h-3.5 inline mr-1.5" /> Bank Transfer
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2">Withdrawal Amount (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="number"
                        placeholder="Min ₹500"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-black tracking-widest text-slate-700 focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-2">
                      {payoutMethod === "upi" ? "UPI Address node" : "Account Number & IFSC"}
                    </label>
                    <input
                      type="text"
                      placeholder={payoutMethod === "upi" ? "username@bank" : "A/C: 123456... & IFSC"}
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                  <Button
                    type="submit"
                    disabled={requestStatus === "loading"}
                    className="bg-slate-900 hover:bg-indigo-650 text-white rounded-xl h-11 px-6 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    {requestStatus === "loading" ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-3.5 h-3.5" /> Request Settlement
                      </>
                    )}
                  </Button>
                  
                  {requestStatus === "success" && (
                    <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">✓ Settlement requested successfully.</p>
                  )}
                  {requestStatus === "error" && (
                    <p className="text-[9px] font-black uppercase tracking-wider text-rose-600">⚠️ Invalid settlement amount or details.</p>
                  )}
                </div>
              </form>
            </CursorGlowCard>
          ) : (
            <CursorGlowCard glowColor="indigo">
              <div className="text-center py-6">
                <span className="text-3xl block mb-2">🎁</span>
                <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Referral cashback active</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Refer students to register using your referral link to earn 10% prepaid cashback directly added here on their order verification.
                </p>
              </div>
            </CursorGlowCard>
          )}
        </div>

        {/* Right Column: Transaction History Ledger List */}
        <CursorGlowCard glowColor="rose" className="h-full" innerClassName="p-0 justify-between">
          <div className="flex-1 flex flex-col min-h-[350px]">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-55/30">
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Transaction History</h3>
            </div>
            
            <div className="flex gap-1.5 p-4 border-b border-slate-50 bg-slate-50/30">
              {["all", "credit", "debit"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f as any)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors ${activeFilter === f ? "bg-slate-950 text-white border border-slate-950" : "bg-white text-slate-400 border border-slate-150 hover:bg-slate-50 hover:text-slate-650"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="divide-y divide-slate-50 overflow-y-auto max-h-[300px] flex-1">
              {filteredTx.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      tx.type === "credit" ? "bg-emerald-50 text-emerald-600 border-emerald-150" : "bg-rose-50 text-rose-600 border-rose-150"
                    }`}>
                      {tx.type === "credit" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wide truncate max-w-[130px]">{tx.title}</h4>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-mono font-black ${
                      tx.type === "credit" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                    </span>
                    <span className={`text-[7px] font-black uppercase block tracking-wider mt-0.5 ${tx.status === "Completed" ? "text-slate-400" : "text-amber-500 animate-pulse font-extrabold"}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
              {filteredTx.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">No matching logs found.</div>
              )}
            </div>
          </div>

          <div className="p-5 bg-slate-950 text-white flex items-start gap-3 relative overflow-hidden group rounded-b-[29px] border-t border-slate-900 shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="text-[9px] font-semibold text-slate-450 uppercase tracking-wider leading-relaxed">
              Ledger transactions are instantly cryptographically checksummed. Audit code: <span className="font-mono text-indigo-400 font-black">L-A512</span>
            </div>
          </div>
        </CursorGlowCard>
      </div>
    </div>
  );
}
