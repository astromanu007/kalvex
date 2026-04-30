"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Zap, CheckCircle, AlertCircle, Loader2, Download, FileImage, Info, Sparkles } from "lucide-react";
import { generatePatentDraft } from "@/app/actions/patent";

const LOCARNO_CLASSES = [
  { id: "08", label: "Tools & Hardware" }, { id: "09", label: "Packages & Containers" },
  { id: "10", label: "Clocks, Watches, Instruments" }, { id: "12", label: "Means of Transport" },
  { id: "13", label: "Equipment for Production" }, { id: "14", label: "Recording Equipment" },
  { id: "15", label: "Machines, Engines" }, { id: "16", label: "Photographic / Optical Equipment" },
  { id: "21", label: "Games, Toys, Sporting Goods" }, { id: "26", label: "Lighting Equipment" },
  { id: "28", label: "Pharmaceutical & Cosmetic Products" }, { id: "99", label: "Miscellaneous" },
];

type StepStatus = "idle" | "loading" | "done" | "error";

export default function PatentDrafterPage() {
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [overrideClass, setOverrideClass] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<StepStatus>("idle");
  const [draftStep, setDraftStep] = useState<StepStatus>("idle");
  const [result, setResult] = useState<{ className: string; classDesc: string; noveltyPoints: string[]; claimText: string; } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    setFiles((p) => [...p, ...dropped].slice(0, 6));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles((p) => [...p, ...Array.from(e.target.files ?? [])].slice(0, 6));
  };

  const handleAnalyze = async () => {
    if (!productName || !productDesc) return;
    setDrafting(true); setAnalysisStep("loading"); setDraftStep("idle"); setResult(null);
    
    const res = await generatePatentDraft({
      productTitle: productName,
      description: productDesc,
      locarnoClass: overrideClass || undefined
    });

    if (res.success) {
      setAnalysisStep("done"); 
      setDraftStep("loading");
      await new Promise((r) => setTimeout(r, 1000));
      setDraftStep("done");
      setResult({
        className: res.suggestedClass.split(" ")[1] || "15",
        classDesc: "Machines, Engines, Motors",
        noveltyPoints: res.noveltyPoints,
        claimText: res.claimText,
      });
    } else {
      setAnalysisStep("error");
      alert(res.error || "Failed to generate draft");
    }
    setDrafting(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-primary">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Kalvex AI Labs — Design Patent Auto-Drafter</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-text-primary mb-4">Draft Your Design Patent in Minutes</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Upload product views, describe your design, and let AI classify it under the Locarno system and generate your official Disclosure Document.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-primary text-white text-xs flex items-center justify-center font-bold">1</span>
                Product Information
              </h2>
              <div>
                <label className="block text-sm font-medium mb-1">Product / Invention Name *</label>
                <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Foldable Portable Air Purifier" className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Design Description *</label>
                <textarea value={productDesc} onChange={(e) => setProductDesc(e.target.value)} rows={4} placeholder="Describe the visual and ornamental features — shape, surface texture, color, pattern, configuration..." className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary resize-none" />
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-primary text-white text-xs flex items-center justify-center font-bold">2</span>
                Product Views (up to 6)
              </h2>
              <div onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent-primary hover:bg-accent-primary/5 transition-all">
                <FileImage className="w-8 h-8 text-text-muted mx-auto mb-3" />
                <p className="text-sm font-medium">Drop images or click to upload</p>
                <p className="text-xs text-text-muted mt-1">Front, Back, Left, Right, Top, Bottom — PNG/JPG</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} />
              </div>
              {files.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {files.map((f, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-bg-surface border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={(e) => { e.stopPropagation(); setFiles((p) => p.filter((_, idx) => idx !== i)); }} className="text-white text-xs bg-accent-danger rounded-lg px-2 py-1">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-3">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-primary text-white text-xs flex items-center justify-center font-bold">3</span>
                Locarno Classification (Optional)
              </h2>
              <p className="text-xs text-text-secondary flex items-center gap-1.5"><Info className="w-3.5 h-3.5 shrink-0" /> AI will auto-suggest a class. Override below if known.</p>
              <select value={overrideClass} onChange={(e) => setOverrideClass(e.target.value)} className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary">
                <option value="">Let AI decide automatically</option>
                {LOCARNO_CLASSES.map((c) => <option key={c.id} value={c.id}>Class {c.id} — {c.label}</option>)}
              </select>
            </div>

            <Button onClick={handleAnalyze} disabled={drafting || !productName || !productDesc} className="w-full h-14 bg-accent-primary hover:bg-accent-primary/90 text-white text-base font-semibold shadow-glow rounded-xl">
              {drafting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</> : <><Zap className="w-5 h-5 mr-2" /> Generate Patent Draft</>}
            </Button>
          </div>

          {/* Status + Output */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading font-semibold text-lg mb-5">AI Processing Status</h2>
              <div className="space-y-4">
                {[
                  { label: "Locarno Class Classification", status: analysisStep },
                  { label: "Novelty Point Extraction", status: draftStep },
                  { label: "Disclosure Document Generation", status: result ? "done" as StepStatus : draftStep === "loading" ? "loading" as StepStatus : "idle" as StepStatus },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.status === "done" ? "bg-accent-success/10 text-accent-success" : step.status === "loading" ? "bg-accent-primary/10 text-accent-primary" : "bg-bg-surface text-text-muted"}`}>
                      {step.status === "done" && <CheckCircle className="w-4 h-4" />}
                      {step.status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                      {step.status === "idle" && <span className="text-xs font-mono">{i + 1}</span>}
                    </div>
                    <span className={`text-sm ${step.status !== "idle" ? "text-text-primary font-medium" : "text-text-muted"}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {result && (
              <div className="bg-bg-card border border-accent-primary/30 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-base">Draft Generated</h3>
                  <Button size="sm" className="bg-accent-success text-white h-8 px-3 rounded-lg gap-1.5 text-xs">
                    <Download className="w-3 h-3" /> PDF
                  </Button>
                </div>
                <div className="p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-xl">
                  <p className="text-xs text-text-secondary mb-0.5">Locarno Class</p>
                  <p className="font-mono font-bold text-accent-primary text-sm">Class {result.className} — {result.classDesc}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Novelty Points</p>
                  <ul className="space-y-2">
                    {result.noveltyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-primary"><CheckCircle className="w-3.5 h-3.5 text-accent-success flex-shrink-0 mt-0.5" /> {pt}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Claim Text</p>
                  <p className="text-xs text-text-secondary bg-bg-surface rounded-xl p-3 border border-border font-mono leading-relaxed">{result.claimText}</p>
                </div>
                <p className="text-[10px] text-text-muted text-center border-t border-border pt-3">⚡ AI-generated draft. A Kalvex expert will review before official filing.</p>
              </div>
            )}

            {!result && (
              <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold">What you&apos;ll get</h3>
                <ul className="space-y-2">
                  {["Auto Locarno classification", "Novelty point extraction", "Official claim text", "Disclosure Document brief", "Representation sheet placeholders", "Expert review before filing"].map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-xs text-text-secondary"><CheckCircle className="w-3.5 h-3.5 text-accent-success" /> {pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
