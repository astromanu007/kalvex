"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Trash2, Loader2, Download, FileImage, Sparkles,
  UserPlus, Image as ImageIcon, Info, Plus, GripVertical
} from "lucide-react";
import { 
  Document, Page, Text, View, Image as PDFImage, 
  StyleSheet, PDFDownloadLink 
} from "@react-pdf/renderer";
import { Reorder, useDragControls } from "framer-motion";

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
    // Reset input value so same file can be uploaded again
    const target = event?.target as HTMLInputElement;
    if (target) target.value = "";
  };

  const removeAuthor = (id: string) => {
    if (authors.length > 1) {
      setAuthors(p => p.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col lg:flex-row gap-8 items-start"
        >
          
          <motion.div variants={fadeInUp} className="flex-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl shadow-slate-900/5 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-3 font-heading text-slate-900">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Sparkles className="text-blue-600 w-6 h-6" />
                  </div>
                  Patent Designer Pro
                </h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">v2.4 Elite</div>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Invention Name</label>
                    <input 
                      value={productName} 
                      onChange={e => setProductName(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 ring-blue-600/5 focus:border-blue-600 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300" 
                      placeholder="e.g. AI-Based Detection System" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Filing Date</label>
                    <input 
                      value={dated} 
                      onChange={e => setDated(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 ring-blue-600/5 focus:border-blue-600 outline-none font-bold text-slate-900 transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {PATENT_VIEWS.map(v => (
                    <label key={v.id} className="cursor-pointer group/view">
                      <div className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-1 transition-all ${views[v.id] ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-blue-600 bg-slate-50/50"}`}>
                        {views[v.id] ? (
                          <>
                            <img src={views[v.id]!} className="w-full h-full object-contain p-2" alt="v" />
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViews(p => ({ ...p, [v.id]: null })); }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors z-10"
                            >
                              <Plus className="w-3 h-3 rotate-45" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center">
                            <FileImage className="w-4 h-4 mx-auto text-slate-300 group-hover/view:text-blue-600 transition-colors mb-1" />
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">{v.id}</span>
                          </div>
                        )}
                      </div>
                      <input type="file" className="hidden" onClick={e => e.stopPropagation()} onChange={e => handleUpload(v.id, e, 'view')} />
                    </label>
                  ))}
                </div>

                <div className="space-y-5 pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Order of Applicants</h3>
                    <Button variant="ghost" size="sm" onClick={() => setAuthors([...authors, {id: Date.now().toString(), name: "", signature: null}])} className="text-blue-600 font-bold h-10 hover:bg-blue-50 rounded-xl px-4"><Plus className="w-4 h-4 mr-2"/> Add Applicant</Button>
                  </div>
                  
                  <Reorder.Group axis="y" values={authors} onReorder={setAuthors} className="space-y-3">
                    {authors.map((a) => (
                      <Reorder.Item key={a.id} value={a} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 cursor-default group/author transition-all hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
                        <GripVertical className="w-5 h-5 text-slate-300 group-hover/author:text-slate-400 transition-colors cursor-grab active:cursor-grabbing shrink-0" />
                        <input 
                          value={a.name} 
                          onChange={e => setAuthors(p => p.map(x => x.id === a.id ? {...x, name: e.target.value} : x))} 
                          placeholder="Applicant's Full Name" 
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm uppercase font-bold text-slate-900 focus:border-blue-600 outline-none transition-all placeholder:normal-case placeholder:font-medium placeholder:text-slate-300" 
                        />
                        <label className="cursor-pointer bg-slate-900 text-white rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shrink-0 whitespace-nowrap shadow-lg shadow-slate-900/10" onClick={e => e.stopPropagation()}>
                          {a.signature ? "Signed ✓" : "Upload Sign"}
                          <input type="file" className="hidden" onChange={e => handleUpload(a.id, e, 'sig', a.id)} />
                        </label>
                        {a.signature && (
                          <div className="relative group shrink-0">
                            <img src={a.signature} className="w-10 h-10 rounded-xl border border-slate-100 bg-white object-contain p-1" alt="s" />
                            <button 
                              onClick={() => setAuthors(p => p.map(x => x.id === a.id ? { ...x, signature: null } : x))}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Plus className="w-2 h-2 rotate-45" />
                            </button>
                          </div>
                        )}
                        <button onClick={() => removeAuthor(a.id)} className="p-3 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:w-[480px] shrink-0 sticky top-32">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-400 text-xs uppercase tracking-[0.2em]">Institutional Preview</h3>
              <div className="flex gap-3">
                <select className="bg-white text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black outline-none shadow-sm focus:ring-4 ring-blue-600/5 transition-all" value={currentSheet} onChange={e => setCurrentSheet(parseInt(e.target.value))}>
                  {PATENT_VIEWS.map((_, i) => <option key={i} value={i+1}>Sheet {i+1} of 7</option>)}
                </select>
                <PDFDownloadLink document={<PatentDocument productName={productName} dated={dated} views={views} authors={authors} />} fileName="Patent_Document.pdf">
                  {({ loading }) => <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-10 px-6 font-bold shadow-xl shadow-blue-600/20" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4 mr-2" /> Export PDF</>}</Button>}
                </PDFDownloadLink>
              </div>
            </div>v>

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
