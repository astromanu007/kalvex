"use client";

import { useState } from "react";
import { Clock, CheckCircle2, User, Calendar, Award } from "lucide-react";

interface Milestone {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "pending" | "active" | "completed";
  owner: string;
}

export default function GanttTimeline() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "m-1", name: "Project Inception & Architecture", startDate: "Jun 1", endDate: "Jun 5", progress: 100, status: "completed", owner: "Dr. Clara Croft (IP Specialist)" },
    { id: "m-2", name: "Schematic Engineering & Simulation", startDate: "Jun 6", endDate: "Jun 12", progress: 100, status: "completed", owner: "Devon Reed (Lead hardware Engineer)" },
    { id: "m-3", name: "Prototype Assembly & Calibration", startDate: "Jun 13", endDate: "Jun 20", progress: 45, status: "active", owner: "Sanjay Sen (Firmware Engineer)" },
    { id: "m-4", name: "System QA & Compliance Audit", startDate: "Jun 21", endDate: "Jun 26", progress: 0, status: "pending", owner: "Elena Rostova (Compliance Expert)" },
    { id: "m-5", name: "Handover & Documentation Release", startDate: "Jun 27", endDate: "Jun 30", progress: 0, status: "pending", owner: "Dr. Clara Croft (IP Specialist)" }
  ]);

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(milestones[2]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-150/80 shadow-sm space-y-6 w-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-heading font-black text-lg text-slate-900 tracking-tight uppercase">Interactive Project Milestone Gantt Timeline</h3>
          <p className="text-xs text-slate-400 mt-0.5">Click any milestone bar to view assigned experts, schedule dates, and detailed status updates.</p>
        </div>
        <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
          Milestones Track Active
        </span>
      </div>

      {/* Gantt Chart SVG */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px] p-4 bg-slate-50/50 rounded-2xl border border-slate-100 relative">
          
          {/* Day markers / Timeline Header */}
          <div className="grid grid-cols-6 border-b border-slate-200 pb-2 mb-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
            <span>Milestone Phase</span>
            <span className="text-center">Jun 1 - Jun 5</span>
            <span className="text-center">Jun 6 - Jun 12</span>
            <span className="text-center">Jun 13 - Jun 20</span>
            <span className="text-center">Jun 21 - Jun 26</span>
            <span className="text-center">Jun 27 - Jun 30</span>
          </div>

          {/* Rows */}
          <div className="space-y-4">
            {milestones.map((m, idx) => {
              const isActive = selectedMilestone?.id === m.id;
              
              // Calculate custom grid starts depending on index to simulate Gantt horizontal bars
              const barPositions = [
                "col-start-2 col-span-1",
                "col-start-3 col-span-1",
                "col-start-4 col-span-1",
                "col-start-5 col-span-1",
                "col-start-6 col-span-1"
              ];

              return (
                <div key={m.id} className="grid grid-cols-6 items-center gap-4">
                  {/* Left Label */}
                  <div className="text-xs font-bold text-slate-700 truncate" title={m.name}>
                    {m.name}
                  </div>
                  
                  {/* Gantt Bar */}
                  <div 
                    onClick={() => setSelectedMilestone(m)}
                    className={`h-8 rounded-xl relative cursor-pointer overflow-hidden transition-all duration-300 ${barPositions[idx]} ${
                      isActive ? "ring-2 ring-indigo-500 ring-offset-2 scale-[1.01]" : "hover:scale-[1.01]"
                    } ${
                      m.status === "completed" 
                        ? "bg-emerald-500/20 border border-emerald-500/30" 
                        : m.status === "active"
                          ? "bg-indigo-500/20 border border-indigo-500/30"
                          : "bg-slate-200/50 border border-slate-350/20"
                    }`}
                  >
                    {/* Inner Progress Bar Fill */}
                    <div 
                      className={`h-full absolute left-0 top-0 transition-all rounded-r-md ${
                        m.status === "completed" 
                          ? "bg-emerald-500" 
                          : m.status === "active"
                            ? "bg-indigo-600 animate-pulse"
                            : "bg-slate-300"
                      }`} 
                      style={{ width: `${m.progress}%` }} 
                    />
                    
                    {/* Label inside bar */}
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black uppercase text-slate-800 mix-blend-multiply tracking-widest">
                      {m.progress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestone Details Card */}
      {selectedMilestone && (
        <div className="bg-slate-50 border border-slate-150/70 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Active Stage Selected</span>
            <h4 className="font-bold text-sm text-slate-800 leading-tight">{selectedMilestone.name}</h4>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              <span>{selectedMilestone.owner}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Duration: {selectedMilestone.startDate} - {selectedMilestone.endDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${
              selectedMilestone.status === "completed"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : selectedMilestone.status === "active"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse"
                  : "bg-slate-100 border-slate-200 text-slate-500"
            }`}>
              {selectedMilestone.status === "completed" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              <span>{selectedMilestone.status}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
