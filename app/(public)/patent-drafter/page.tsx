"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Trash2, Loader2, Download, FileImage, Sparkles,
  UserPlus, Image as ImageIcon, Info, Plus, GripVertical, Shield, FileText
} from "lucide-react";
import { 
  Document, Page, Text, View, Image as PDFImage, 
  StyleSheet, PDFDownloadLink 
} from "@react-pdf/renderer";
import { Reorder, motion, AnimatePresence } from "framer-motion";

// Framer Motion Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Define views for the patent
const PATENT_VIEWS = [
  { id: "perspective", label: "Perspective View" },
  { id: "front", label: "Front View" },
  { id: "back", label: "Back View" },
  { id: "left", label: "Left View" },
  { id: "right", label: "Right View" },
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
            <Text style={pdfStyles.boldText}>NAME OF THE APPLICANTS: {authors.map((a:any) => a.name).join(", ") || "________________"}</Text>
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
  const [productName, setProductName] = useState("");
  const [dated, setDated] = useState(`${new Date().getDate()} Day of ${new Date().toLocaleString('en-GB', { month: 'long' })} ${new Date().getFullYear()}`);
  const [views, setViews] = useState<Record<string, string | null>>({ perspective: null, front: null, back: null, left: null, right: null, top: null, bottom: null });
  const [authors, setAuthors] = useState([{ id: "1", name: "", signature: null as any }]);
  const [currentSheet, setCurrentSheet] = useState(1);

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

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col lg:flex-row gap-16 items-start"
        >
          
          <div className="flex-1 space-y-12 w-full">
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/20">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tighter">AI Design <span className="text-blue-600">Drafter</span></h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Institutional IP Generation Engine</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white border border-slate-100 rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-slate-900/5 space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
                  <Sparkles className="text-blue-600 w-5 h-5" /> Invention Architecture
                </h2>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100">v3.0 Secure Node</div>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Nomenclature</label>
                    <input 
                      value={productName} 
                      onChange={e => setProductName(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none text-slate-900 transition-all placeholder:text-slate-200" 
                      placeholder="e.g. MULTI-PHASE SENSORY ARRAY" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chronological Marker</label>
                    <input 
                      value={dated} 
                      onChange={e => setDated(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none text-slate-900 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Structural Representations (7 Sheets Required)</label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                    {PATENT_VIEWS.map(v => (
                      <label key={v.id} className="cursor-pointer group/view">
                        <div className={`relative aspect-square rounded-[1.5rem] border-2 transition-all duration-500 flex flex-col items-center justify-center p-2 ${views[v.id] ? "border-blue-600 bg-blue-50/30 shadow-xl shadow-blue-600/5" : "border-slate-100 border-dashed hover:border-slate-300 bg-slate-50/50"}`}>
                          <AnimatePresence mode="wait">
                            {views[v.id] ? (
                              <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full h-full relative"
                              >
                                <img src={views[v.id]!} className="w-full h-full object-contain p-2" alt="v" />
                                <button 
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViews(p => ({ ...p, [v.id]: null })); }}
                                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-xl p-1.5 shadow-xl hover:bg-red-600 transition-all scale-0 group-hover/view:scale-100 z-10"
                                >
                                  <Plus className="w-3 h-3 rotate-45" />
                                </button>
                              </motion.div>
                            ) : (
                              <div className="text-center group-hover/view:scale-110 transition-transform duration-500">
                                <FileImage className="w-5 h-5 mx-auto text-slate-300 group-hover/view:text-blue-600 transition-colors mb-2" />
                                <span className="text-[8px] font-black text-slate-400 uppercase leading-none tracking-tighter">{v.id}</span>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                        <input type="file" className="hidden" onClick={e => e.stopPropagation()} onChange={e => handleUpload(v.id, e, 'view')} />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 pt-10 border-t border-slate-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">Institutional Applicants</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Verification Sequence</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setAuthors([...authors, {id: Date.now().toString(), name: "", signature: null}])} className="text-blue-600 font-black text-[10px] uppercase tracking-widest h-12 hover:bg-blue-50 rounded-2xl px-6 transition-all border border-transparent hover:border-blue-100"><Plus className="w-4 h-4 mr-2"/> Add Signatory</Button>
                  </div>
                  
                  <Reorder.Group axis="y" values={authors} onReorder={setAuthors} className="space-y-4">
                    {authors.map((a) => (
                      <Reorder.Item key={a.id} value={a} className="flex gap-6 items-center bg-white p-6 rounded-[2rem] border border-slate-100 cursor-default group/author transition-all hover:border-blue-600/20 hover:shadow-2xl hover:shadow-slate-900/5">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing hover:bg-slate-100 transition-colors">
                          <GripVertical className="w-5 h-5 text-slate-300" />
                        </div>
                        <input 
                          value={a.name} 
                          onChange={e => setAuthors(p => p.map(x => x.id === a.id ? {...x, name: e.target.value} : x))} 
                          placeholder="FULL LEGAL NAME" 
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200" 
                        />
                        <div className="flex items-center gap-4">
                          <label className={`cursor-pointer h-14 rounded-2xl px-6 flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all ${a.signature ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-900/10"}`} onClick={e => e.stopPropagation()}>
                            {a.signature ? "Signed ✓" : "Upload Sign"}
                            <input type="file" className="hidden" onChange={e => handleUpload(a.id, e, 'sig', a.id)} />
                          </label>
                          {a.signature && (
                            <div className="relative group/sig shrink-0">
                              <img src={a.signature} className="w-14 h-14 rounded-2xl border border-slate-100 bg-white object-contain p-2 shadow-inner" alt="s" />
                              <button 
                                onClick={() => setAuthors(p => p.map(x => x.id === a.id ? { ...x, signature: null } : x))}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-xl p-1.5 shadow-xl transition-all scale-0 group-hover/sig:scale-100"
                              >
                                <Plus className="w-3 h-3 rotate-45" />
                              </button>
                            </div>
                          )}
                          <button onClick={() => removeAuthor(a.id)} className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-200 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="lg:w-[520px] shrink-0 sticky top-32 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em]">Institutional Preview</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Formal IP Assessment</p>
              </div>
              <div className="flex gap-4">
                <select className="bg-white text-slate-900 border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none shadow-xl shadow-slate-900/5 focus:ring-8 ring-blue-600/5 transition-all cursor-pointer" value={currentSheet} onChange={e => setCurrentSheet(parseInt(e.target.value))}>
                  {PATENT_VIEWS.map((_, i) => <option key={i} value={i+1}>Sheet 0{i+1}</option>)}
                </select>
                <PDFDownloadLink document={<PatentDocument productName={productName} dated={dated} views={views} authors={authors} />} fileName="KALVEX_Patent_Draft.pdf">
                  {({ loading }) => (
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-8 font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-600/30 transition-all duration-500 group" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4 mr-3 group-hover:translate-y-0.5 transition-transform" /> Export Draft</>}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>

            <div className="bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-slate-200 w-full aspect-[1/1.414] p-12 font-serif flex flex-col overflow-hidden relative group/preview transition-all duration-700 hover:shadow-[0_48px_96px_-24px_rgba(37,99,235,0.15)] rounded-[0.5rem]">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-5 pointer-events-none" />
              
              <div className="text-center mb-6 border-b border-black pb-3 relative z-10">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] underline underline-offset-4">The Designs Act, 2000</h4>
              </div>

              <div className="flex border border-black mb-6 relative z-10">
                <div className="flex-[3] border-r border-black p-4 text-[9px] font-bold uppercase leading-tight">
                  NAME OF THE APPLICANTS: <span className="font-normal block mt-1 tracking-tight text-[8px]">{authors.filter(a => a.name).map(a => a.name).join(", ") || "____________________"}</span>
                </div>
                <div className="flex-[1] p-4 text-[9px] font-bold flex flex-col justify-center items-center gap-1">
                  <p className="tracking-tighter">TOTAL SHEETS: 07</p>
                  <p className="tracking-tighter">SHEET NO: 0{currentSheet}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-6 relative z-10">
                <div className="w-full h-full max-h-[220px] flex items-center justify-center mb-6 border border-slate-50 bg-slate-50/50 rounded-xl">
                  <AnimatePresence mode="wait">
                    {views[PATENT_VIEWS[currentSheet - 1].id] ? (
                      <motion.img 
                        key={currentSheet}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={views[PATENT_VIEWS[currentSheet - 1].id]!} 
                        className="max-h-full object-contain mix-blend-multiply" 
                        alt="v" 
                      />
                    ) : (
                      <div className="text-slate-200 flex flex-col items-center gap-2">
                        <ImageIcon className="w-12 h-12 opacity-10" />
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20">Awaiting {PATENT_VIEWS[currentSheet - 1].id} representation</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
                <h5 className="text-xs font-bold uppercase underline underline-offset-4 mb-4 tracking-widest">{PATENT_VIEWS[currentSheet - 1].label}</h5>
              </div>

              <div className="text-[9px] leading-relaxed text-justify space-y-3 mb-10 relative z-10">
                <p>The novelty resides in the shape and configuration of the <span className="font-bold uppercase">"{productName || "____________________"}"</span>, as illustrated in the accompanying representations.</p>
                <p>No claim is made by virtue of this registration to any right to the exclusive use of the colour or colour combination appearing in the design.</p>
                <p>No claim is made by virtue of this registration in respect of any mechanical or other action of any mechanism whatsoever or in respect of any mode or principle of construction of the article.</p>
                <p className="font-bold pt-4 border-t border-slate-100">Dated: {dated}</p>
              </div>

              <div className="flex justify-end mb-8 mt-auto pr-4 relative z-10">
                <div className="w-[220px] space-y-3">
                  <p className="text-[9px] font-bold italic opacity-40">For,</p>
                  {authors.map(a => (
                    <div key={a.id} className="flex items-center justify-between pb-1 border-b border-slate-100 min-h-[30px]">
                      <span className="text-[8px] font-bold uppercase tracking-tight text-slate-800">{a.name || "________________"}</span>
                      {a.signature && <img src={a.signature} className="h-6 object-contain mix-blend-multiply transition-all group-hover/preview:scale-110" alt="s" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[9px] font-bold uppercase leading-tight relative z-10 border-t border-slate-100 pt-4">
                <p>TO,</p>
                <p>THE CONTROLLER OF DESIGNS,</p>
                <p>THE PATENT OFFICE, KOLKATA</p>
              </div>
            </div>
            
            <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2rem] p-6 flex items-start gap-4 shadow-xl shadow-blue-600/5 transition-all hover:bg-blue-600/10">
              <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600/60 leading-loose">
                Security Protocol: All draft data is strictly client-side. No IP sensitive imagery is persisted until official institutional submission.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
