"use client";

import { useState } from "react";
import { 
  Plus, Search, Trash2, Edit2, 
  MoreVertical, Check, X, Loader2,
  Image as ImageIcon, ExternalLink,
  Filter, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EntityDashboardProps {
  title: string;
  subtitle: string;
  entities: any[];
  columns: { key: string; label: string; render?: (val: any) => React.ReactNode }[];
  onAdd: () => void;
  onEdit: (entity: any) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function EntityDashboard({
  title,
  subtitle,
  entities,
  columns,
  onAdd,
  onEdit,
  onDelete,
  loading
}: EntityDashboardProps) {
  const [search, setSearch] = useState("");

  const filteredEntities = entities.filter(e => 
    Object.values(e).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em]">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> System Dashboard
          </div>
          <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tighter">{title}</h1>
          <p className="text-sm text-slate-400 font-bold">{subtitle}</p>
        </div>
        <Button 
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-[1.25rem] px-8 py-7 h-auto flex items-center gap-3 transition-all duration-500 group shadow-2xl shadow-blue-600/20 hover:scale-105 hover:-translate-y-1"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Add New Item</span>
        </Button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-900/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="p-10 border-b border-slate-50 flex justify-between items-center relative z-10">
          <div className="relative w-full max-w-md group">
            <div className="absolute -inset-[1px] bg-blue-600/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-500 blur-[1px]" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-all duration-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all fields..."
              className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-300 relative z-10"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {filteredEntities.length} Total Records
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-slate-100 transition-colors">
              <Filter className="w-5 h-5 text-slate-400" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {columns.map(col => (
                  <th key={col.key} className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">{col.label}</th>
                ))}
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-3xl border-4 border-blue-600/10 border-t-blue-600 animate-spin" />
                        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">Synchronizing Database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEntities.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                      <Search className="w-16 h-16 text-slate-300" />
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">No Records Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEntities.map((entity) => (
                  <tr key={entity.id} className="hover:bg-blue-50/30 transition-all duration-500 group">
                    {columns.map(col => (
                      <td key={col.key} className="px-10 py-8">
                        {col.render ? col.render(entity[col.key]) : (
                          <span className="text-[12px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">{String(entity[col.key])}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <Button 
                          onClick={() => onEdit(entity)}
                          variant="ghost" size="icon" 
                          className="h-12 w-12 rounded-2xl bg-white/50 border border-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-500 shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => onDelete(entity.id)}
                          variant="ghost" size="icon" 
                          className="h-12 w-12 rounded-2xl bg-white/50 border border-slate-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-500 shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
