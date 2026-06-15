"use client";

import { useState } from "react";
import { DollarSign, Shield, Trash2, Plus, HelpCircle, Award, Globe, Building } from "lucide-react";

interface Claim {
  id: string;
  parentId: string | null;
  text: string;
  type: "independent" | "dependent";
}

export default function PatentDrafterAddons() {
  // --- STATE FOR STEPS ---
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { title: "Technical Concept", desc: "Define name & Locarno class" },
    { title: "Visual Assets", desc: "Upload 7 schematic views" },
    { title: "Claims & Novelty", desc: "Map patent dependencies" },
    { title: "Review & Exporter", desc: "Pay and download official documents" }
  ];

  // --- STATE FOR CLAIMS TREE ---
  const [claims, setClaims] = useState<Claim[]>([
    { id: "claim-1", parentId: null, text: "An automated detection system comprising a sensor array and a processor...", type: "independent" },
    { id: "claim-2", parentId: "claim-1", text: "The system of Claim 1, wherein the sensor array is an optical lidar detector...", type: "dependent" },
    { id: "claim-3", parentId: "claim-1", text: "The system of Claim 1, further comprising a neural feedback loop...", type: "dependent" }
  ]);
  const [newClaimText, setNewClaimText] = useState("");
  const [newClaimParent, setNewClaimParent] = useState("claim-1");
  const [newClaimType, setNewClaimType] = useState<"independent" | "dependent">("dependent");

  const addClaim = () => {
    if (!newClaimText.trim()) return;
    const newId = `claim-${Date.now()}`;
    setClaims([
      ...claims,
      {
        id: newId,
        parentId: newClaimType === "independent" ? null : newClaimParent,
        text: newClaimText,
        type: newClaimType
      }
    ]);
    setNewClaimText("");
  };

  const deleteClaim = (id: string) => {
    if (claims.length <= 1) return;
    setClaims(claims.filter(c => c.id !== id && c.parentId !== id));
  };

  // --- STATE FOR FILING COST ESTIMATOR ---
  const [claimsCount, setClaimsCount] = useState(3);
  const [entityType, setEntityType] = useState<"individual" | "small" | "large">("individual");
  const [countries, setCountries] = useState<Record<string, boolean>>({
    US: true,
    EP: false,
    IN: true,
    JP: false
  });

  const getFilingCost = () => {
    let basePrice = 0;
    // Base fee per country
    if (countries.US) basePrice += entityType === "individual" ? 300 : entityType === "small" ? 600 : 1200;
    if (countries.EP) basePrice += entityType === "individual" ? 800 : entityType === "small" ? 1400 : 2500;
    if (countries.IN) basePrice += entityType === "individual" ? 80 : entityType === "small" ? 200 : 400;
    if (countries.JP) basePrice += entityType === "individual" ? 500 : entityType === "small" ? 900 : 1800;

    // Surcharge for extra claims (> 10 claims)
    if (claimsCount > 10) {
      basePrice += (claimsCount - 10) * (entityType === "individual" ? 15 : 30);
    }
    return basePrice;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* 1. STEPPER WIZARD */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Patent Suite Wizard</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div 
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isActive 
                    ? "border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/10" 
                    : isCompleted
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-500"
                  }`}>
                    {stepNum}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    isActive ? "text-blue-600" : isCompleted ? "text-emerald-600" : "text-slate-400"
                  }`}>
                    {isActive ? "Active" : isCompleted ? "Done" : "Step"}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-800">{step.title}</h4>
                <p className="text-[9.5px] text-slate-400 leading-tight mt-1">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC CLAIMS TREE VISUALIZATION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Claims Dependency Tree</h3>
            <p className="text-[10px] text-slate-400 mt-1">Interactively map relationships between independent & dependent claims.</p>
          </div>
          <span className="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            {claims.length} Claims Total
          </span>
        </div>

        {/* Claim SVG Render Map */}
        <div className="border border-slate-150/70 rounded-2xl p-4 bg-slate-50/40 mb-6 flex flex-col items-center justify-center overflow-x-auto min-h-[220px]">
          <svg className="w-full max-w-[500px]" viewBox="0 0 500 200">
            {/* Draw SVG connections */}
            {claims.map((claim, idx) => {
              if (claim.parentId) {
                // Find parent idx
                const pIdx = claims.findIndex(c => c.id === claim.parentId);
                if (pIdx !== -1) {
                  const x1 = 120;
                  const y1 = 40 + pIdx * 45;
                  const x2 = 300;
                  const y2 = 40 + idx * 45;
                  return (
                    <path 
                      key={`line-${claim.id}`} 
                      d={`M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`} 
                      fill="none" 
                      stroke="#cbd5e1" 
                      strokeWidth="2"
                    />
                  );
                }
              }
              return null;
            })}

            {/* Render Nodes */}
            {claims.map((claim, idx) => {
              const x = claim.parentId ? 300 : 40;
              const y = 25 + idx * 45;
              return (
                <g key={`node-${claim.id}`}>
                  <rect 
                    x={x} 
                    y={y} 
                    width={150} 
                    height={32} 
                    rx={8} 
                    fill={claim.parentId ? "#ffffff" : "#ebf5ff"} 
                    stroke={claim.parentId ? "#e2e8f0" : "#3b82f6"} 
                    strokeWidth="1.5"
                    className="shadow-sm"
                  />
                  <text 
                    x={x + 10} 
                    y={y + 19} 
                    fill={claim.parentId ? "#475569" : "#1e40af"} 
                    fontSize="9" 
                    fontWeight="bold"
                  >
                    {claim.type === "independent" ? "Independent Claim" : `Claim ${idx+1} (Dep)`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Add new claim form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border-t border-slate-100 pt-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claim Type</label>
            <select
              value={newClaimType}
              onChange={e => setNewClaimType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="independent">Independent Claim</option>
              <option value="dependent">Dependent Claim</option>
            </select>
          </div>
          {newClaimType === "dependent" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parent Claim</label>
              <select
                value={newClaimParent}
                onChange={e => setNewClaimParent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-700 outline-none"
              >
                {claims.filter(c => c.type === "independent").map(c => (
                  <option key={c.id} value={c.id}>Independent ({c.text.slice(0, 20)}...)</option>
                ))}
              </select>
            </div>
          )}
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claim Wording Description</label>
            <input 
              value={newClaimText}
              onChange={e => setNewClaimText(e.target.value)}
              placeholder="e.g. Wherein the processor computes vector orientation..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none" 
            />
          </div>
          <button 
            type="button"
            onClick={addClaim}
            className="bg-slate-900 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Node
          </button>
        </div>

        {/* Claims List */}
        <div className="space-y-3 mt-6">
          {claims.map((c, idx) => (
            <div key={c.id} className="flex gap-4 items-center bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium">
              <span className="font-black text-slate-400">Claim {idx+1}:</span>
              <p className="flex-1">{c.text}</p>
              <button 
                onClick={() => deleteClaim(c.id)}
                className="text-slate-350 hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. GLOBAL FILING COST ESTIMATOR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Global Filing cost Estimator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Sliders / Selections */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Number of Claims</label>
                <span className="text-xs font-black text-blue-650">{claimsCount} claims</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={50} 
                value={claimsCount} 
                onChange={e => setClaimsCount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer" 
              />
              <p className="text-[9px] text-slate-400">Filing fees typically cover up to 10 claims without surcharges.</p>
            </div>

            {/* Entity Type selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Applicant Entity Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "individual", label: "Micro / Indiv.", discount: "80% Off" },
                  { id: "small", label: "Small Business", discount: "50% Off" },
                  { id: "large", label: "Large Entity", discount: "Standard" }
                ].map(entity => (
                  <button
                    key={entity.id}
                    type="button"
                    onClick={() => setEntityType(entity.id as any)}
                    className={`p-3 rounded-xl text-center border text-[11px] font-bold transition-all cursor-pointer ${
                      entityType === entity.id 
                        ? "border-blue-500 bg-blue-50/50 text-blue-600" 
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span>{entity.label}</span>
                    <span className="block text-[8px] text-slate-400 uppercase font-black mt-0.5">{entity.discount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Jurisdictions selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Select Jurisdictions</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "US", label: "United States (USPTO)", flag: "🇺🇸" },
                  { id: "EP", label: "Europe (EPO)", flag: "🇪🇺" },
                  { id: "IN", label: "India (IPO)", flag: "🇮🇳" },
                  { id: "JP", label: "Japan (JPO)", flag: "🇯🇵" }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCountries(p => ({ ...p, [c.id]: !p[c.id] }))}
                    className={`p-3 rounded-xl border flex items-center justify-between text-left text-xs font-bold transition-all cursor-pointer ${
                      countries[c.id] 
                        ? "border-blue-500 bg-blue-50/30 text-blue-600" 
                        : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{c.flag}</span>
                      <span>{c.id}</span>
                    </span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      countries[c.id] ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                    }`}>
                      {countries[c.id] && <svg width="6" height="4" viewBox="0 0 6 4" fill="none"><path d="M0.5 2L2 3.5L5.5 0.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Box Card */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimated Cost Summary</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Entity Multiplier:</span>
                  <span className="text-white font-bold capitalize">{entityType}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Claims Surcharge:</span>
                  <span className="text-white font-bold">
                    {claimsCount > 10 ? `$${(claimsCount - 10) * (entityType === "individual" ? 15 : 30)}` : "$0"}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Base Official Fees:</span>
                  <span className="text-white font-bold">
                    ${getFilingCost() - (claimsCount > 10 ? (claimsCount - 10) * (entityType === "individual" ? 15 : 30) : 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Grand Estimated Filing Fee</span>
              <div className="text-4xl font-black text-blue-400 flex items-baseline gap-1">
                <span>${getFilingCost()}</span>
                <span className="text-xs text-slate-400 font-bold">USD</span>
              </div>
              <p className="text-[9px] text-slate-500 mt-2">Does not include local agent representation fees.</p>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
