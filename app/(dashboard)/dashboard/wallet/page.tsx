"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState(0);

  const TRANSACTIONS = [
    { id: "TXN-88231", title: "Welcome Referral Bonus", type: "credit", amount: 100, date: "2026-05-27", status: "Completed" },
    { id: "TXN-88120", title: "Refund: Black Book Pages", type: "credit", amount: 50, date: "2026-05-25", status: "Completed" }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-slate-900">My Wallet</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your platform credits, bonuses, and transaction history</p>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-indigo-300 font-bold uppercase tracking-widest text-[10px] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full w-max">
            <Wallet className="w-4 h-4" /> Kalvex Wallet Engine
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Available Balance</span>
            <span className="text-5xl font-mono font-black tracking-tighter mt-1 block">₹{balance.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
            Account Node: <span className="font-mono text-indigo-400 font-black">{(session?.user as any)?.maskedId ?? "KV-0000"}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 relative z-10 w-full md:w-auto">
          <Button onClick={() => alert("Add money flow is securely linked to the checkouts dashboard.")} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-14 px-8 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all duration-300">
            <Plus className="w-4 h-4" /> Add Credits
          </Button>
        </div>
      </div>

      {/* Grid: Transactions and Security */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Transaction History</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === "credit" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}>
                    {tx.type === "credit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{tx.title}</h4>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{tx.id} · {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-base font-mono font-black ${
                    tx.type === "credit" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                  </span>
                  <span className="text-[8px] font-black uppercase text-slate-300 block tracking-widest">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security / Info widget */}
        <div className="bg-slate-950 text-white rounded-[2rem] p-8 border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-black text-base tracking-tight leading-tight">100% Secure Node Ledger</h3>
            <p className="text-[10px] font-semibold text-slate-400 leading-relaxed uppercase tracking-wider">
              All transactions are encrypted and audited through secure server-side ledgers. Credits are instantly usable for patent drafting and component purchases.
            </p>
          </div>
          <div className="pt-6 border-t border-slate-900 mt-6">
            <a href="/support" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
              Intel Support desk <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
