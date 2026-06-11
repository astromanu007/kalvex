// app/(dashboard)/admin/logs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Shield, Search, Loader2, ArrowLeft, X,
  Terminal, Globe, Cpu, AlertTriangle, Clock, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { getAuditLogs } from "@/app/actions/admin";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const ACTION_BADGES: Record<string, string> = {
  LOGIN: "bg-emerald-50 text-emerald-600 border-emerald-100",
  LOGOUT: "bg-slate-100 text-slate-600 border-slate-200",
  FAILED_LOGIN_ATTEMPT: "bg-rose-50 text-rose-600 border-rose-100 animate-pulse",
};

export default function SecurityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getAuditLogs();
      if (res.success && res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      (log.user?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (log.user?.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (log.ipAddress?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (log.userAgent?.toLowerCase() || "").includes(search.toLowerCase());

    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-16 max-w-[1600px] mx-auto pb-16">
      {/* Top Navigation Bar - Separated from the Title */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 border-b border-slate-100 pb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:shadow-lg hover:-translate-x-1 transition-all duration-300 shadow-sm w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
        </Link>
        
        <button
          onClick={() => fetchLogs(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-blue-600 transition-all active:scale-95 shadow-sm disabled:opacity-50 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing Feed..." : "Refresh Feed"}
        </button>
      </motion.div>

      {/* Main Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-3 w-fit bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20">
            <Shield className="w-4 h-4 text-emerald-400" /> Security Operations Center
          </div>
          <h1 className="font-heading font-black text-5xl sm:text-6xl text-slate-900 tracking-tighter leading-none">
            Audit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Logs</span>
          </h1>
          <p className="text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
            Real-time security auditing. Monitor all logins, logouts, session activities, and authentication attempts seamlessly across the Kalvex platform.
          </p>
        </div>
      </motion.div>

      {/* Filter and Search Bar with Animated Glowing Border */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative group p-[2px] rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 hover:from-indigo-500/60 hover:via-purple-500/60 hover:to-pink-500/60 transition-all duration-700 shadow-xl shadow-slate-900/5 z-20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative bg-white/95 backdrop-blur-xl rounded-[2.4rem] p-6 lg:p-8 flex flex-col xl:flex-row gap-6 justify-between items-center">
          <div className="relative w-full xl:flex-1 flex flex-col sm:flex-row items-center gap-4 group/input">
            <div className="relative w-full">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" />
                <div className="h-5 w-[2px] bg-slate-100" />
              </div>
              
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email, IP, or browser device..."
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-600 rounded-2xl pl-20 pr-16 py-5 text-xs font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-300 placeholder:text-slate-400 shadow-inner"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="w-full sm:w-auto flex items-center gap-3 shrink-0">
              <button className="w-full sm:w-auto px-8 py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Search
              </button>
              <span className="hidden sm:inline-flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-2xl shadow-sm whitespace-nowrap">
                {filteredLogs.length} Match{filteredLogs.length !== 1 && "es"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full xl:w-auto shrink-0 justify-start sm:justify-center">
            {["ALL", "LOGIN", "LOGOUT", "FAILED_LOGIN_ATTEMPT"].map((filter) => {
              const isActive = actionFilter === filter;
              const labels: Record<string, string> = {
                ALL: "All Logs",
                LOGIN: "Logins",
                LOGOUT: "Logouts",
                FAILED_LOGIN_ATTEMPT: "Failed Attempts"
              };
              return (
                <button
                  key={filter}
                  onClick={() => setActionFilter(filter)}
                  className={`px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm ${
                    isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 -translate-y-0.5"
                      : "bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {labels[filter]}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Logs Command Table with Glowing Border */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative group p-[1px] rounded-[3rem] overflow-hidden bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/40 hover:via-purple-500/40 hover:to-pink-500/40 transition-all duration-700 shadow-2xl shadow-slate-900/5"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10 blur-xl group-hover:opacity-25 transition-opacity duration-700 pointer-events-none" />

        <div className="relative bg-white/95 rounded-[2.95rem] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {["Timestamp", "User & Identity", "Action", "IP Address", "User Agent / Device"].map((h) => (
                  <th key={h} className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-3xl border-4 border-blue-600/10 border-t-blue-600 animate-spin" />
                        <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">
                        Retrieving Audit Logs...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <AlertTriangle className="w-16 h-16 text-slate-350" />
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">
                        No Logs Registered matching criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/20 transition-all duration-500 group">
                    {/* Timestamp */}
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-black text-slate-900">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {new Date(log.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* User & Identity */}
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                            {log.user?.name || "System Event"}
                          </span>
                          <span className="bg-slate-100 text-slate-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest border border-slate-200">
                            {log.user?.role || "SYSTEM"}
                          </span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {log.user?.email || "internal@system"}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-10 py-8">
                      <span
                        className={`inline-block text-[9px] font-black px-4 py-2 rounded-xl border uppercase tracking-[0.15em] shadow-sm ${
                          ACTION_BADGES[log.action] || "bg-slate-50 text-slate-600 border-slate-150"
                        }`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* IP Address */}
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-300 shrink-0" />
                        <span className="font-mono text-[10px] font-black text-slate-900 bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm">
                          {log.ipAddress || "127.0.0.1 (Localhost)"}
                        </span>
                      </div>
                    </td>

                    {/* User Agent */}
                    <td className="px-10 py-8 max-w-sm">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-slate-300 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-400 line-clamp-2 leading-relaxed">
                          {log.userAgent || "Internal Service Call (Prisma-Client)"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
    </div>
  );
}
