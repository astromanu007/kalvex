"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Upload, Zap, CheckCircle, Plus, Trash2, 
  Loader2, Download, FileImage, Info, Sparkles,
  ChevronRight, Printer, UserPlus, Image as ImageIcon
} from "lucide-react";

const PATENT_VIEWS = [
  { id: "perspective", label: "Perspective View" },
  { id: "front", label: "Front View" },
  { id: "back", label: "Back View" },
  { id: "left", label: "Left View" },
  { id: "right", label: "Right View" },
  { id: "top", label: "Top View" },
  { id: "bottom", label: "Bottom View" },
];

type Author = {
  id: string;
  name: string;
  signature: string | null;
};

export default function PatentDrafterPage() {
  const [productName, setProductName] = useState("");
  const [dated, setDated] = useState(new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }));
  
  // Views State
  const [views, setViews] = useState<Record<string, string | null>>({
    perspective: null, front: null, back: null, left: null, right: null, top: null, bottom: null
  });

  // Authors State
  const [authors, setAuthors] = useState<Author[]>([
    { id: "1", name: "", signature: null }
  ]);

  const [drafting, setDrafting] = useState(false);
  const [currentSheet, setCurrentSheet] = useState(1);

  const handleViewUpload = (viewId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setViews(prev => ({ ...prev, [viewId]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSignatureUpload = (authorId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAuthors(prev => prev.map(a => 
        a.id === authorId ? { ...a, signature: e.target?.result as string } : a
      ));
    };
    reader.readAsDataURL(file);
  };

  const addAuthor = () => {
    setAuthors([...authors, { id: Date.now().toString(), name: "", signature: null }]);
  };

  const removeAuthor = (id: string) => {
    if (authors.length > 1) {
      setAuthors(authors.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F8FAFC]">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Side: Editor */}
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="font-heading font-bold text-3xl text-text-primary mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-accent-primary" />
                AI Patent Designer
              </h1>
              <p className="text-text-secondary">Generate "The Designs Act, 2000" compliant filing documents.</p>
            </div>

            {/* Step 1: Basic Info */}
            <section className="bg-white border border-border rounded-3xl p-8 shadow-sm">
              <h2 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">1</span>
                Project Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-text-secondary mb-2 block uppercase tracking-wider">Product Title</label>
                  <input 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. AI-Based Wild Animal Detection and Alert System"
                    className="w-full bg-bg-surface border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-accent-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-text-secondary mb-2 block uppercase tracking-wider">Filing Date</label>
                  <input 
                    value={dated}
                    onChange={(e) => setDated(e.target.value)}
                    className="w-full bg-bg-surface border border-border rounded-2xl px-6 py-4 focus:outline-none focus:border-accent-primary transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Step 2: 7 Views Upload */}
            <section className="bg-white border border-border rounded-3xl p-8 shadow-sm">
              <h2 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">2</span>
                Representation Sheets (7 Views)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PATENT_VIEWS.map((view) => (
                  <div key={view.id} className="relative group">
                    <label className="cursor-pointer">
                      <div className={`aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center ${
                        views[view.id] ? "border-accent-success bg-accent-success/5" : "border-border hover:border-accent-primary bg-bg-surface"
                      }`}>
                        {views[view.id] ? (
                          <img src={views[view.id]!} className="w-full h-full object-contain rounded-lg" alt={view.label} />
                        ) : (
                          <>
                            <FileImage className="w-6 h-6 text-text-muted mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-text-muted">{view.label}</span>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleViewUpload(view.id, e.target.files[0])}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* Step 3: Authors & Signatures */}
            <section className="bg-white border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">3</span>
                  Applicants & Signatures
                </h2>
                <Button variant="outline" onClick={addAuthor} className="rounded-xl border-accent-primary text-accent-primary hover:bg-accent-primary/5">
                  <UserPlus className="w-4 h-4 mr-2" /> Add Applicant
                </Button>
              </div>

              <div className="space-y-6">
                {authors.map((author, index) => (
                  <div key={author.id} className="p-6 bg-bg-surface rounded-2xl border border-border relative group">
                    <button 
                      onClick={() => removeAuthor(author.id)}
                      className="absolute top-4 right-4 text-text-muted hover:text-accent-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-bold text-text-secondary mb-2 block uppercase tracking-wider">Applicant {index + 1} Name</label>
                        <input 
                          value={author.name}
                          onChange={(e) => setAuthors(prev => prev.map(a => a.id === author.id ? { ...a, name: e.target.value } : a))}
                          placeholder="FULL NAME IN BLOCK LETTERS"
                          className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm font-bold uppercase"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-text-secondary mb-2 block uppercase tracking-wider">Wet Signature Upload</label>
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer flex-1">
                            <div className={`h-12 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all ${
                              author.signature ? "border-accent-success bg-accent-success/5" : "border-border hover:border-accent-primary"
                            }`}>
                              {author.signature ? (
                                <span className="text-xs font-bold text-accent-success">Signature Captured</span>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 text-text-muted" />
                                  <span className="text-xs text-text-muted">Upload Sign (PNG/JPG)</span>
                                </>
                              )}
                            </div>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => e.target.files?.[0] && handleSignatureUpload(author.id, e.target.files[0])}
                            />
                          </label>
                          {author.signature && (
                            <div className="w-12 h-12 rounded-xl border border-border bg-white p-1">
                              <img src={author.signature} className="w-full h-full object-contain" alt="sign" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-text-muted mt-4 flex items-center gap-2">
                <Info className="w-3 h-3" /> Our AI will automatically remove the background from signatures and adjust contrast for the final PDF.
              </p>
            </section>
          </div>

          {/* Right Side: LIVE PREVIEW */}
          <div className="lg:w-[450px]">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg">Document Preview</h3>
                <div className="flex gap-2">
                  <select 
                    className="bg-white border border-border rounded-lg px-3 py-1 text-xs font-bold focus:outline-none"
                    onChange={(e) => setCurrentSheet(parseInt(e.target.value))}
                  >
                    {PATENT_VIEWS.map((v, i) => (
                      <option key={v.id} value={i + 1}>Sheet {i + 1}: {v.label}</option>
                    ))}
                  </select>
                  <Button size="sm" className="bg-text-primary text-white rounded-lg">
                    <Printer className="w-3 h-3 mr-2" /> PDF
                  </Button>
                </div>
              </div>

              {/* THE DESIGNS ACT DOCUMENT MOCKUP */}
              <div className="bg-white shadow-2xl border border-border aspect-[1/1.414] w-full p-8 font-serif overflow-hidden select-none">
                <div className="text-center border-b-2 border-black pb-4 mb-6">
                  <h4 className="text-[14px] font-bold uppercase tracking-widest underline">The Designs Act, 2000</h4>
                </div>

                <div className="grid grid-cols-4 border-2 border-black mb-10">
                  <div className="col-span-3 border-r-2 border-black p-3">
                    <p className="text-[9px] font-bold leading-tight">
                      NAME OF THE APPLICANTS: {authors.filter(a => a.name).map(a => a.name).join(", ") || "[APPLICANT NAMES]"}
                    </p>
                  </div>
                  <div className="col-span-1 p-2 space-y-1">
                    <p className="text-[9px] font-bold">Total Sheet: 7</p>
                    <p className="text-[9px] font-bold">Sheet No: {currentSheet}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center mb-10">
                  <div className="w-full aspect-square border border-slate-100 flex items-center justify-center mb-4">
                    {views[PATENT_VIEWS[currentSheet - 1].id] ? (
                      <img src={views[PATENT_VIEWS[currentSheet - 1].id]!} className="max-w-[80%] max-h-[80%] object-contain" alt="view" />
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center">
                        <ImageIcon className="w-20 h-20 mb-4 opacity-20" />
                        <span className="text-xs italic">Upload {PATENT_VIEWS[currentSheet - 1].label}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[12px] font-bold uppercase underline decoration-2 underline-offset-4 mb-6">
                    {PATENT_VIEWS[currentSheet - 1].label}
                  </p>
                </div>

                <div className="space-y-4 text-[10px] leading-relaxed text-justify">
                  <p>
                    The novelty resides in the shape and configuration of the 
                    <span className="font-bold"> "{productName || "[Product Title]"}"</span>, as illustrated in the accompanying representations.
                  </p>
                  <p>No claim is made by virtue of this registration to any right to the exclusive use of the colour or colour combination appearing in the design.</p>
                  <p>No claim is made by virtue of this registration in respect of any mechanical or other action of any mechanism whatsoever or in respect of any mode or principle of construction of the article.</p>
                </div>

                <div className="mt-8 text-[10px] font-bold mb-10">
                  Dated: {dated}
                </div>

                <div className="flex justify-end">
                  <div className="w-1/2 space-y-4">
                    <p className="text-[10px] font-bold italic mb-2">For,</p>
                    {authors.map(a => (
                      <div key={a.id} className="flex items-center justify-between border-b border-dotted border-slate-300 pb-1">
                        <span className="text-[9px] font-bold uppercase truncate max-w-[120px]">{a.name || "[NAME]"}</span>
                        {a.signature && (
                          <img src={a.signature} className="h-6 object-contain mix-blend-multiply filter contrast-125" alt="sign" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 text-[9px] font-bold uppercase space-y-0.5">
                  <p>TO,</p>
                  <p>THE CONTROLLER OF DESIGNS,</p>
                  <p>THE PATENT OFFICE,</p>
                  <p>KOLKATA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
