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
import { motion, Reorder, useDragControls } from "framer-motion";

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
    <div className="min-h-screen pt-40 pb-32 bg-white transition-colors duration-500 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-blue-50 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-50 rounded-full -z-10 blur-[100px] translate-y-1/3 -translate-x-1/4" />

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

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Product Name</label>
                    <input value={productName} onChange={e => setProductName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-blue-500/20 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all" placeholder="e.g. AI-Based Detection System" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Filing Date</label>
                    <input value={dated} onChange={e => setDated(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-blue-500/20 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {PATENT_VIEWS.map(v => (
                    <label key={v.id} className="cursor-pointer group/view">
                      <div className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-1 transition-all ${views[v.id] ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-800/30"}`}>
                        {views[v.id] ? (
                          <>
                            <img src={views[v.id]!} className="w-full h-full object-contain" alt="v" />
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViews(p => ({ ...p, [v.id]: null })); }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors z-10"
                            >
                              <Plus className="w-3 h-3 rotate-45" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center">
                            <FileImage className="w-3 h-3 mx-auto text-slate-400 dark:text-slate-600 mb-0.5 group-hover/view:text-blue-500 transition-colors" />
                            <span className="text-[6px] font-bold text-slate-400 dark:text-slate-600 uppercase leading-none">{v.id}</span>
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

                  <Reorder.Group axis="y" values={authors} onReorder={setAuthors} className="space-y-2">
                    {authors.map((a) => (
                      <Reorder.Item key={a.id} value={a} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-default group/author transition-all">
                        <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover/author:text-slate-500 transition-colors cursor-grab active:cursor-grabbing shrink-0" />
                        <input value={a.name} onChange={e => setAuthors(p => p.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))} placeholder="Full Name" className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs uppercase font-bold text-slate-700 dark:text-slate-200 focus:border-blue-300 dark:focus:border-blue-500 outline-none transition-all" />
                        <label className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[9px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 whitespace-nowrap text-slate-700 dark:text-slate-300" onClick={e => e.stopPropagation()}>
                          {a.signature ? "✓ Signed" : "Upload Sign"}
                          <input type="file" className="hidden" onChange={e => handleUpload(a.id, e, 'sig', a.id)} />
                        </label>
                        {a.signature && (
                          <div className="relative group shrink-0">
                            <img src={a.signature} className="w-8 h-8 rounded border dark:border-slate-700 bg-white object-contain" alt="s" />
                            <button
                              onClick={() => setAuthors(p => p.map(x => x.id === a.id ? { ...x, signature: null } : x))}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Plus className="w-2 h-2 rotate-45" />
                            </button>
                          </div>
                        )}
                        <button onClick={() => removeAuthor(a.id)} className="p-2 text-slate-300 dark:text-slate-700 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[480px] shrink-0 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Live Document Preview</h3>
              <div className="flex gap-2">
                <select className="bg-white dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-[10px] font-bold outline-none" value={currentSheet} onChange={e => setCurrentSheet(parseInt(e.target.value))}>
                  {PATENT_VIEWS.map((_, i) => <option key={i} value={i + 1}>Sheet {i + 1}</option>)}
                </select>
                <PDFDownloadLink document={<PatentDocument productName={productName} dated={dated} views={views} authors={authors} />} fileName="Patent_Document.pdf">
                  {({ loading }) => <Button size="sm" className="bg-blue-600 text-white rounded-lg h-8 shadow-lg shadow-blue-500/20" disabled={loading}>{loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Download className="w-3 h-3 mr-2" /> Download</>}</Button>}
                </PDFDownloadLink>
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
