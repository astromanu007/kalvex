"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FileText, Clock, CheckCircle2, Loader2, ArrowUpRight, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/app/actions/orders";

export default function MyProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getOrders();
      if (res.orders) {
        // Filter orders that represent custom developments, project reports, design or utility projects
        const projectOrders = res.orders.filter((o: any) =>
          ["MINI_PROJECT", "MAJOR_PROJECT", "CUSTOM_PROJECT", "FINAL_YEAR_PROJECT", "FINAL_YEAR_REPORT", "PHD_THESIS", "RESEARCH_PAPER"].includes(o.serviceType)
        );
        setProjects(projectOrders);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-slate-900">My Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your running projects, thesis, and reports</p>
        </div>
        <Link href="/services">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-5 shadow-lg shadow-indigo-600/10">
            Start New Project
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-20 flex justify-center text-indigo-600 shadow-sm">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[3rem] p-16 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
            <FolderOpen className="w-10 h-10" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-heading font-black text-xl text-slate-900">No Projects Found</h3>
            <p className="text-sm font-bold text-slate-400">
              You haven't ordered any custom projects, thesis drafts, or components delivery yet.
            </p>
          </div>
          <Link href="/services" className="inline-block">
            <Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl px-8 h-12 font-bold shadow-md">
              Browse Available Services
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((proj) => {
            const isCompleted = ["DELIVERED", "COMPLETED"].includes(proj.status);
            return (
              <div
                key={proj.id}
                className="bg-white border border-slate-150/80 rounded-3xl p-8 hover:border-indigo-500/30 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-500 px-3 py-1 rounded-lg">
                      {proj.orderNumber}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      isCompleted ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {proj.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight leading-tight">
                      {proj.serviceType.replace(/_/g, " ")}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                      Ordered on {new Date(proj.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {proj.requirements && (
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-500 leading-relaxed max-w-2xl whitespace-pre-line line-clamp-2">
                      {proj.requirements}
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 border-slate-100 pt-6 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">Project Value</span>
                    <span className="text-xl font-mono font-black text-slate-800">₹{proj.amount?.toLocaleString()}</span>
                  </div>
                  <Link href={`/dashboard/orders/${proj.id}`}>
                    <Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl h-11 px-6 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                      Project Details <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
