"use client";

import { useState } from "react";
import { seedInitialData } from "@/app/actions/seed";
import { Button } from "@/components/ui/button";
import { Database, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    const res = await seedInitialData();
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-100 p-12 shadow-2xl shadow-slate-900/5 space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Database Initialization</h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Restore Initial Platform Content</p>
          </div>
        </div>

        <p className="text-slate-500 leading-relaxed">
          This utility will populate the database with the original <b>Services</b>, <b>Projects</b>, and <b>Components</b> 
          that were previously hardcoded. This ensures the public marketplace and services pages are immediately populated.
        </p>

        {result && (
          <div className={`p-4 rounded-2xl flex items-start gap-3 ${result.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {result.success ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
            <div>
              <p className="text-sm font-black uppercase tracking-widest">{result.success ? "Success" : "Failed"}</p>
              <p className="text-xs font-bold">{result.message}</p>
            </div>
          </div>
        )}

        <Button
          onClick={handleSeed}
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-blue-600 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300"
        >
          {loading ? "Seeding Database..." : (
            <span className="flex items-center gap-3">
              <Sparkles className="w-4 h-4" /> Start Initialization Protocol
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
