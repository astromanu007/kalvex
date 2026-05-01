"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2, Loader2, Download, FileImage, Sparkles,
  UserPlus, Image as ImageIcon, Info, Plus, GripVertical,
  BrainCircuit, Layout, Zap
} from "lucide-react";
import {
  Document, Page, Text, View, Image as PDFImage,
  StyleSheet, PDFDownloadLink
} from "@react-pdf/renderer";
import { motion, Reorder, useDragControls } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LOCARNO_CLASSES } from "@/lib/locarno";
import { analyzePatent } from "@/lib/ai-engine";

// Define views for the patent
const PATENT_VIEWS = [
  { id: "perspective", label: "Perspective View" },
  { id: "front", label: "Front View" },
  { id: "back", label: "Back View" },
  { id: "left", label: "Left Hand Side View" },
  { id: "right", label: "Right Hand Side View" },
  { id: "top", label: "Top View" },
  { id: "bottom", label: "Bottom View" },
];

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: { padding: 30, paddingLeft: 40, paddingRight: 40, fontFamily: "Times-Roman", fontSize: 9, lineHeight: 1.4 },
  docTitle: { textAlign: "center", fontSize: 9, fontWeight: "bold", textDecoration: "underline", marginBottom: 10, textTransform: "uppercase" },
  headerBox: { flexDirection: "row", border: "1pt solid black", marginBottom: 5 },
  headerLeft: { flex: 3, borderRight: "1pt solid black", padding: 6 },
  headerRight: { flex: 1, padding: 6, alignItems: "center", justifyContent: "center" },
  boldText: { fontWeight: "bold" },
  viewContainer: { width: "100%", height: 160, alignItems: "center", justifyContent: "center", marginBottom: 5 },
  viewImage: { width: "auto", height: "100%", objectFit: "contain" },
  viewLabel: { textAlign: "center", fontSize: 10, fontWeight: "bold", textDecoration: "underline", marginBottom: 10, textTransform: "uppercase" },
  noveltyBlock: { textAlign: "justify", marginBottom: 10 },
  paragraph: { marginBottom: 4 },
  dated: { fontWeight: "bold", marginTop: 2, marginBottom: 15 },
  sigSection: { alignSelf: "flex-end", width: "40%", marginTop: "auto", marginBottom: 10 },
  sigRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 10, paddingBottom: 1, marginBottom: 2 },
  sigImage: { height: 28, objectFit: "contain" },
  footer: { fontWeight: "bold", textTransform: "uppercase", fontSize: 8 }
});

// PDF Component
const PatentDocument = ({ productName, dated, views, authors }: any) => (
  <Document>
    {PATENT_VIEWS.map((view, index) => (
      <Page key={view.id} size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.docTitle}>The Designs Act, 2000</Text>

        <View style={pdfStyles.headerBox}>
          <View style={pdfStyles.headerLeft}>
            <Text style={pdfStyles.boldText}>NAME OF THE APPLICANTS: {authors.map((a: any) => a.name).join(", ") || "________________"}</Text>
          </View>
          <View style={pdfStyles.headerRight}>
            <Text style={pdfStyles.boldText}>Total Sheet: 7</Text>
            <Text style={pdfStyles.boldText}>Sheet No: {index + 1}</Text>
          </View>
        </View>

        <View style={pdfStyles.viewContainer}>
          {views[view.id] && <PDFImage src={views[view.id]} style={pdfStyles.viewImage} />}
        </View>

        <Text style={pdfStyles.viewLabel}>{view.label}</Text>

        <View style={pdfStyles.noveltyBlock}>
          <Text style={pdfStyles.paragraph}>The novelty resides in the shape and configuration of the <Text style={pdfStyles.boldText}>"{productName || "________________"}"</Text>, as illustrated in the accompanying representations.</Text>
          <Text style={pdfStyles.paragraph}>No claim is made by virtue of this registration to any right to the exclusive use of the colour or colour combination appearing in the design.</Text>
          <Text style={pdfStyles.paragraph}>No claim is made by virtue of this registration in respect of any mechanical or other action of any mechanism whatsoever or in respect of any mode or principle of construction of the article.</Text>
          <Text style={pdfStyles.paragraph}>No claim is made by virtue of this registration to any right to the exclusive use of the words, letters, numbers, trademarks, or any other symbols appearing in the design.</Text>
        </View>

        <Text style={pdfStyles.dated}>Dated: {dated}</Text>

        <View style={pdfStyles.sigSection}>
          <Text style={{ fontSize: 9, fontStyle: "italic", marginBottom: 3 }}>For,</Text>
          {authors.map((a: any) => (
            <View key={a.id} style={pdfStyles.sigRow}>
              <Text style={{ fontSize: 8, fontWeight: "bold" }}>{a.name}</Text>
              {a.signature && <PDFImage src={a.signature} style={pdfStyles.sigImage} />}
            </View>
          ))}
        </View>

        <View style={pdfStyles.footer}>
          <Text>TO,</Text>
          <Text>THE CONTROLLER OF DESIGNS,</Text>
          <Text>THE PATENT OFFICE,</Text>
          <Text>KOLKATA</Text>
        </View>
      </Page>
    ))}
  </Document>
);

export default function PatentDrafterPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [bgShapes, setBgShapes] = useState<any[]>([]);
  
  useEffect(() => {
    setIsMounted(true);
    // Generate shapes only on client to avoid hydration mismatch
    setBgShapes(Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 400 + 100,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * -25,
      opacity: Math.random() * 0.12 + 0.03, // Increased opacity for visibility
      rotate: Math.random() * 360,
      type: ["cube", "sphere", "pyramid", "node", "ring"][i % 5]
    })));
  }, []);
  
  const [productName, setProductName] = useState("");
  const [dated, setDated] = useState(`${new Date().getDate()} Day of ${new Date().toLocaleString('en-GB', { month: 'long' })} ${new Date().getFullYear()}`);
  const [views, setViews] = useState<Record<string, string | null>>({ perspective: null, front: null, back: null, left: null, right: null, top: null, bottom: null });
  const [authors, setAuthors] = useState([{ id: "1", name: "", signature: null as any }]);
  const [currentSheet, setCurrentSheet] = useState(1);
  const [activeTab, setActiveTab] = useState<"general" | "ai">("general");
  const [projectDescription, setProjectDescription] = useState("");
  const [locarnoClass, setLocarnoClass] = useState("");
  const [locarnoSubClass, setLocarnoSubClass] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState<{confidence: number, reasoning: string[]} | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden">
        {/* 3D FLOATING BACKGROUND SHAPES */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {bgShapes.map((shape) => (
            <motion.div
              key={shape.id}
              initial={{ 
                x: `${shape.x}%`, 
                y: `${shape.y}%`, 
                rotate: shape.rotate,
                scale: 0.8
              }}
              animate={{
                y: [`${shape.y}%`, `${shape.y - 15}%`, `${shape.y}%`],
                x: [`${shape.x}%`, `${shape.x + 5}%`, `${shape.x}%`],
                rotate: shape.rotate + 360,
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{
                duration: shape.duration,
                repeat: Infinity,
                delay: shape.delay,
                ease: "linear"
              }}
              style={{
                position: 'absolute',
                width: shape.size,
                height: shape.size,
                opacity: shape.opacity,
              }}
              className="flex items-center justify-center"
            >
            {shape.type === "cube" && (
              <div className="w-full h-full border-[1.5px] border-slate-900/40 rounded-lg transform skew-x-12 bg-slate-900/[0.02]" />
            )}
            {shape.type === "sphere" && (
              <div className="w-full h-full border-[1.5px] border-slate-900/40 rounded-full bg-slate-900/[0.02]" />
            )}
            {shape.type === "pyramid" && (
              <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-slate-900/40" />
            )}
            {shape.type === "node" && (
              <div className="relative w-full h-full opacity-60">
                <div className="absolute inset-0 border-[1.5px] border-slate-900 rotate-45" />
                <div className="absolute inset-0 border-[1.5px] border-slate-900 -rotate-45" />
              </div>
            )}
            {shape.type === "ring" && (
              <div className="w-full h-full border-[3px] border-slate-900/30 rounded-full flex items-center justify-center">
                 <div className="w-1/2 h-1/2 border-[1.5px] border-slate-900/40 rounded-full" />
              </div>
            )}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  const handleUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>, type: 'view' | 'sig', authorId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'view') setViews(p => ({ ...p, [id]: result }));
      else setAuthors(p => p.map(a => a.id === authorId ? { ...a, signature: result } : a));
    };
    reader.readAsDataURL(file);
    const target = event?.target as HTMLInputElement;
    if (target) target.value = "";
  };

  const removeAuthor = (id: string) => {
    if (authors.length > 1) {
      setAuthors(p => p.filter(a => a.id !== id));
    }
  };

  const getAiRecommendation = async () => {
    if (!projectDescription) return;
    setIsAiLoading(true);
    setAiStatus([]);
    setAiResult(null);
    
    const log = (msg: string) => setAiStatus(prev => [...prev, msg]);

    log("Initializing KALVEX Neural Engine v2.0...");
    await new Promise(r => setTimeout(r, 600));
    
    log("Linguistic tokenization & intent analysis...");
    const result = await analyzePatent(projectDescription);
    await new Promise(r => setTimeout(r, 800));
    
    log("Cross-referencing Locarno Design Hierarchy...");
    await new Promise(r => setTimeout(r, 1000));

    log(`Decision Anchor: Class ${result.class}-${result.subclass}`);
    log(`Confidence Score: ${result.confidence}%`);
    
    setProductName(result.title);
    setLocarnoClass(result.class);
    setLocarnoSubClass(result.subclass);
    setAiResult({ confidence: result.confidence, reasoning: result.reasoning });
    
    log("Finalizing neural mapping...");
    await new Promise(r => setTimeout(r, 600));

    setIsAiLoading(false);
    // Stay on tab for a bit to show results
    setTimeout(() => {
      setActiveTab("general");
      setAiStatus([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-40 pb-32 bg-slate-50 transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-blue-100/50 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-100/50 rounded-full -z-10 blur-[100px] translate-y-1/3 -translate-x-1/4 animate-pulse" />


      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-24 space-y-8"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Sparkles className="w-4 h-4" /> AI Patent Engineering
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
            Draft Like a <br />
            <span className="text-blue-600">Pro Architect.</span>
          </h1>
          <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-3xl mx-auto">
            Our intelligent drafting engine generates production-grade IP documentation. Simply upload your technical views and witness the transformation.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">

          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-900/5 transition-all">
              <h2 className="text-2xl font-black mb-10 flex items-center gap-4 font-heading text-slate-900 uppercase tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                Drafting Terminal
              </h2>

              <div className="flex gap-2 mb-8 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setActiveTab("general")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "general" ? "bg-white text-blue-600 shadow-xl shadow-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
                >
                  <Layout className="w-4 h-4" /> General Info
                </button>
                <button 
                  onClick={() => setActiveTab("ai")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "ai" ? "bg-white text-blue-600 shadow-xl shadow-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
                >
                  <BrainCircuit className="w-4 h-4" /> AI Insights
                </button>
              </div>

              {activeTab === "general" ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Name</label>
                      <input value={productName} onChange={e => setProductName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800 transition-all shadow-sm" placeholder="e.g. AI-Based Detection System" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filing Date</label>
                      <input value={dated} onChange={e => setDated(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800 transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Locarno Class</label>
                      <input value={locarnoClass} onChange={e => setLocarnoClass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800 transition-all shadow-sm" placeholder="e.g. 14" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sub-Class</label>
                      <input value={locarnoSubClass} onChange={e => setLocarnoSubClass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800 transition-all shadow-sm" placeholder="e.g. 04" />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {PATENT_VIEWS.map(v => (
                      <label key={v.id} className="cursor-pointer group/view">
                        <div className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-1 transition-all ${views[v.id] ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400 bg-slate-50"}`}>
                          {views[v.id] ? (
                            <>
                              <img src={views[v.id]!} className="w-full h-full object-contain rounded-xl" alt="v" />
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViews(p => ({ ...p, [v.id]: null })); }}
                                className="absolute -top-3 -right-3 bg-white text-red-500 border border-red-100 rounded-full p-1.5 shadow-xl hover:bg-red-50 hover:scale-110 transition-all z-10"
                              >
                                <Plus className="w-4 h-4 rotate-45" />
                              </button>
                            </>
                          ) : (
                            <div className="text-center">
                              <FileImage className="w-5 h-5 mx-auto text-slate-300 mb-2 group-hover/view:text-blue-500 transition-colors" />
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{v.id}</span>
                            </div>
                          )}
                        </div>
                        <input type="file" className="hidden" onClick={e => e.stopPropagation()} onChange={e => handleUpload(v.id, e, 'view')} />
                      </label>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Applicants Order</h3>
                      <Button variant="ghost" size="sm" onClick={() => setAuthors([...authors, { id: Date.now().toString(), name: "", signature: null }])} className="text-blue-600 font-bold h-8"><Plus className="w-3 h-3 mr-1" /> Add Applicant</Button>
                    </div>

                    <Reorder.Group axis="y" values={authors} onReorder={setAuthors} className="space-y-3">
                      {authors.map((a) => (
                        <Reorder.Item key={a.id} value={a} className="flex gap-3 items-center bg-white p-2 pl-4 rounded-2xl border border-slate-100 shadow-md shadow-slate-100 cursor-default group/author transition-all">
                          <GripVertical className="w-5 h-5 text-slate-300 group-hover/author:text-slate-400 transition-colors cursor-grab active:cursor-grabbing shrink-0" />
                          <input value={a.name} onChange={e => setAuthors(p => p.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))} placeholder="Full Name" className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm uppercase font-black text-slate-800 focus:border-blue-400 focus:ring-4 ring-blue-500/10 outline-none transition-all" />
                          
                          <label className={`cursor-pointer rounded-xl px-4 py-3 text-[10px] font-black tracking-widest transition-all shrink-0 whitespace-nowrap flex items-center gap-2 ${a.signature ? "bg-green-50 text-green-600 border border-green-200" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"}`} onClick={e => e.stopPropagation()}>
                            {a.signature ? <><CheckCircle2 className="w-3 h-3"/> Signed</> : "Upload Sign"}
                            <input type="file" className="hidden" onChange={e => handleUpload(a.id, e, 'sig', a.id)} />
                          </label>
                          
                          {a.signature && (
                            <div className="relative group shrink-0">
                              <img src={a.signature} className="w-10 h-10 rounded-lg border border-slate-200 bg-white object-contain" alt="s" />
                              <button
                                onClick={() => setAuthors(p => p.map(x => x.id === a.id ? { ...x, signature: null } : x))}
                                className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110 transition-all"
                              >
                                <Plus className="w-3 h-3 rotate-45" />
                              </button>
                            </div>
                          )}
                          <button onClick={() => removeAuthor(a.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Patent Intelligence</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technical Description</label>
                      <textarea 
                        value={projectDescription}
                        onChange={e => setProjectDescription(e.target.value)}
                        placeholder="Describe your invention's core functionality, field of use, and key technical features..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-medium text-slate-700 transition-all min-h-[200px] resize-none leading-relaxed shadow-sm"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={getAiRecommendation}
                    disabled={isAiLoading || !projectDescription}
                    className="w-full py-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 group relative overflow-hidden transition-all"
                  >
                    {isAiLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-[8px] opacity-80">Processing Neural Mapping</span>
                      </div>
                    ) : (
                      <span className="relative z-10 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                        Generate Recommendations
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                  </Button>

                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8 border border-blue-100 shadow-2xl shadow-blue-900/5"
                    >
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-blue-100/50">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                          <span className="text-blue-900 font-black text-xs uppercase tracking-widest">Neural Recommendation Active</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">Confidence Score</span>
                          <span className="text-3xl font-black text-blue-600">{aiResult.confidence}%</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">Synthesized Title</span>
                          <span className="text-slate-800 font-black text-lg leading-tight">"{productName}"</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">Assigned Class</span>
                            <span className="text-slate-800 font-black text-2xl">{locarnoClass}</span>
                          </div>
                          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">Sub-Class</span>
                            <span className="text-slate-800 font-black text-2xl">{locarnoSubClass}</span>
                          </div>
                        </div>

                        <div className="pt-6">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-4">AI Reasoning Path</span>
                          <div className="space-y-3 mb-6">
                            {aiResult.reasoning.map((r, i) => (
                              <div key={i} className="flex items-start gap-3 text-xs font-bold text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-50">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                {r}
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest">
                              Note: These are neural-generated recommendations for institutional guidance only.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex gap-4">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-[11px] font-bold text-blue-900/70 leading-relaxed uppercase tracking-tighter">
                      Our AI will suggest a formal **Locarno Class** (Industrial Design classification) and an **Institutional-grade Title** based on your technical input.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-[480px] shrink-0 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2"><Layout className="w-4 h-4 text-blue-600"/> Live Preview</h3>
              <div className="flex gap-3">
                <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black outline-none shadow-sm text-slate-700 hover:border-slate-300 transition-colors" value={currentSheet} onChange={e => setCurrentSheet(parseInt(e.target.value))}>
                  {PATENT_VIEWS.map((_, i) => <option key={i} value={i + 1}>Sheet {i + 1}</option>)}
                </select>
                {session ? (
                  <PDFDownloadLink document={<PatentDocument productName={productName} dated={dated} views={views} authors={authors} />} fileName="Patent_Document.pdf">
                    {({ loading }) => <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4 mr-2" /> Download</>}</Button>}
                  </PDFDownloadLink>
                ) : (
                  <Button onClick={() => router.push("/login")} className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all">
                    <Download className="w-4 h-4 mr-2" /> Sign in to Download
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-white shadow-2xl border border-slate-300 w-full min-h-[640px] p-6 pt-4 font-serif flex flex-col overflow-hidden">
              <div className="text-center mb-2 border-b border-black pb-1">
                <h4 className="text-[9px] font-bold uppercase tracking-widest underline underline-offset-2">The Designs Act, 2000</h4>
              </div>

              <div className="flex border border-black mb-2">
                <div className="flex-[3] border-r border-black p-2 text-[8px] font-bold uppercase leading-tight">
                  NAME OF THE APPLICANTS: <span className="font-normal">{authors.filter(a => a.name).map(a => a.name).join(", ") || "____________________"}</span>
                </div>
                <div className="flex-[1] p-2 text-[8px] font-bold flex flex-col justify-center items-center">
                  <p>Total Sheet: 7</p>
                  <p>Sheet No: {currentSheet}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center py-1">
                <div className="w-full h-[140px] flex items-center justify-center mb-1 border border-slate-50">
                  {views[PATENT_VIEWS[currentSheet - 1].id] ? <img src={views[PATENT_VIEWS[currentSheet - 1].id]!} className="h-full object-contain" alt="v" /> : <div className="text-slate-100 flex flex-col items-center"><ImageIcon className="w-8 h-8 opacity-10" /><span className="text-[6px] italic uppercase">Upload {PATENT_VIEWS[currentSheet - 1].id}</span></div>}
                </div>
                <h5 className="text-[10px] font-bold uppercase underline underline-offset-2 mb-2 tracking-wider">{PATENT_VIEWS[currentSheet - 1].label}</h5>
              </div>

              <div className="text-[8px] leading-relaxed text-justify space-y-1.5 mb-6">
                <p>The novelty resides in the shape and configuration of the <span className="font-bold uppercase">"{productName || "____________________"}"</span>, as illustrated in the accompanying representations.</p>
                <p>No claim is made by virtue of this registration to any right to the exclusive use of the colour or colour combination appearing in the design.</p>
                <p>No claim is made by virtue of this registration in respect of any mechanical or other action of any mechanism whatsoever or in respect of any mode or principle of construction of the article.</p>
                <p>No claim is made by virtue of this registration to any right to the exclusive use of the words, letters, numbers, trademarks, or any other symbols appearing in the design.</p>
                <p className="font-bold">Dated: {dated}</p>
              </div>

              <div className="flex justify-end mb-4 mt-auto pr-2">
                <div className="w-[180px] space-y-1">
                  <p className="text-[8px] font-bold italic">For,</p>
                  {authors.map(a => (
                    <div key={a.id} className="flex items-center gap-3 pb-0.5 border-b border-slate-50">
                      <span className="text-[7px] font-bold uppercase whitespace-nowrap">{a.name || "________________"}</span>
                      {a.signature && <img src={a.signature} className="h-5 object-contain mix-blend-multiply" alt="s" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[8px] font-bold uppercase leading-tight">
                <p>TO,</p>
                <p>THE CONTROLLER OF DESIGNS,</p>
                <p>THE PATENT OFFICE,</p>
                <p>KOLKATA</p>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1"><Info className="w-3 h-3" /> Drag & reorder to update PDF signature order</p>
          </div>
        </div>
      </div>
    </div>
  );
}
