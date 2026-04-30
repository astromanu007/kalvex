"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Trash2, Loader2, Download, FileImage, Sparkles,
  UserPlus, Image as ImageIcon, Info
} from "lucide-react";
import { 
  Document, Page, Text, View, Image as PDFImage, 
  StyleSheet, PDFDownloadLink 
} from "@react-pdf/renderer";

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

// PDF Styles - Exact matching of the image
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Times-Roman", fontSize: 9, lineHeight: 1.4 },
  docTitle: { textAlign: "center", fontSize: 10, fontWeight: "bold", textDecoration: "underline", marginBottom: 15, textTransform: "uppercase" },
  headerBox: { flexDirection: "row", border: "1pt solid black", marginBottom: 20 },
  headerLeft: { flex: 3, borderRight: "1pt solid black", padding: 6 },
  headerRight: { flex: 1, padding: 6 },
  boldText: { fontWeight: "bold" },
  viewContainer: { width: "100%", height: 300, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  viewImage: { maxWidth: "85%", maxHeight: "85%", objectFit: "contain" },
  viewLabel: { textAlign: "center", fontSize: 11, fontWeight: "bold", textDecoration: "underline", marginBottom: 20, textTransform: "uppercase" },
  noveltyBlock: { textAlign: "justify", marginBottom: 20 },
  paragraph: { marginBottom: 8 },
  dated: { fontWeight: "bold", marginTop: 5, marginBottom: 30 },
  sigSection: { alignSelf: "flex-end", width: "40%" },
  sigRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottom: "0.5pt solid #eee", paddingBottom: 2, marginBottom: 6 },
  sigImage: { height: 20, objectFit: "contain" },
  footer: { marginTop: "auto", fontWeight: "bold", textTransform: "uppercase", fontSize: 8 }
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
          <Text>THE CONTROLLER OF DESIGNS, THE PATENT OFFICE, KOLKATA</Text>
        </View>
      </Page>
    ))}
  </Document>
);

export default function PatentDrafterPage() {
  const [productName, setProductName] = useState("");
  const [dated, setDated] = useState(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [views, setViews] = useState<Record<string, string | null>>({ perspective: null, front: null, back: null, left: null, right: null, top: null, bottom: null });
  const [authors, setAuthors] = useState([{ id: "1", name: "", signature: null as any }]);
  const [currentSheet, setCurrentSheet] = useState(1);

  const handleUpload = (id: string, file: File, type: 'view' | 'sig', authorId?: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'view') setViews(p => ({ ...p, [id]: result }));
      else setAuthors(p => p.map(a => a.id === authorId ? { ...a, signature: result } : a));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F1F5F9]">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-heading"><Sparkles className="text-blue-600" /> Patent Designer v2.0</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Product Name</label>
                    <input value={productName} onChange={e => setProductName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-blue-500/20 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Filing Date</label>
                    <input value={dated} onChange={e => setDated(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-blue-500/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {PATENT_VIEWS.map(v => (
                    <label key={v.id} className="cursor-pointer">
                      <div className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-1 transition-all ${views[v.id] ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-blue-500 bg-slate-50"}`}>
                        {views[v.id] ? <img src={views[v.id]!} className="w-full h-full object-contain" alt="v" /> : <div className="text-center"><FileImage className="w-3 h-3 mx-auto text-slate-400 mb-0.5" /><span className="text-[6px] font-bold text-slate-400 uppercase leading-none">{v.id}</span></div>}
                      </div>
                      <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(v.id, e.target.files[0], 'view')} />
                    </label>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center"><h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Applicants</h3><Button variant="ghost" size="sm" onClick={() => setAuthors([...authors, {id: Date.now().toString(), name: "", signature: null}])} className="text-blue-600"><Plus className="w-3 h-3 mr-1"/> Add Applicant</Button></div>
                  {authors.map(a => (
                    <div key={a.id} className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <input value={a.name} onChange={e => setAuthors(p => p.map(x => x.id === a.id ? {...x, name: e.target.value} : x))} placeholder="Full Name" className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs uppercase font-bold" />
                      <label className="cursor-pointer bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold hover:bg-slate-100 transition-colors">{a.signature ? "✓ Signed" : "Signature"}<input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(a.id, e.target.files[0], 'sig', a.id)} /></label>
                      {a.signature && <img src={a.signature} className="w-8 h-8 rounded border bg-white object-contain" alt="s" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[480px] shrink-0 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700">Live Document Preview</h3>
              <div className="flex gap-2">
                <select className="bg-white border rounded px-2 py-1 text-[10px] font-bold" value={currentSheet} onChange={e => setCurrentSheet(parseInt(e.target.value))}>
                  {PATENT_VIEWS.map((_, i) => <option key={i} value={i+1}>Sheet {i+1}</option>)}
                </select>
                <PDFDownloadLink document={<PatentDocument productName={productName} dated={dated} views={views} authors={authors} />} fileName="Patent_Document.pdf">
                  {({ loading }) => <Button size="sm" className="bg-blue-600 text-white rounded-lg h-8 shadow-lg shadow-blue-500/20" disabled={loading}>{loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Download className="w-3 h-3 mr-2" /> Download</>}</Button>}
                </PDFDownloadLink>
              </div>
            </div>

            <div className="bg-white shadow-2xl border border-slate-300 w-full min-h-[640px] p-8 font-serif flex flex-col overflow-hidden">
              <div className="text-center mb-4 border-b border-black pb-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-2">The Designs Act, 2000</h4>
              </div>

              <div className="flex border border-black mb-6">
                <div className="flex-[3] border-r border-black p-2 text-[8px] font-bold uppercase leading-tight">
                  NAME OF THE APPLICANTS: <span className="font-normal">{authors.filter(a => a.name).map(a => a.name).join(", ") || "____________________"}</span>
                </div>
                <div className="flex-[1] p-2 text-[8px] font-bold flex flex-col justify-center">
                  <p>Total Sheet: 7</p>
                  <p>Sheet No: {currentSheet}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center py-4">
                <div className="w-full aspect-[4/3] flex items-center justify-center mb-4 border border-slate-50">
                  {views[PATENT_VIEWS[currentSheet - 1].id] ? <img src={views[PATENT_VIEWS[currentSheet - 1].id]!} className="max-w-full max-h-full object-contain" alt="v" /> : <div className="text-slate-100 flex flex-col items-center"><ImageIcon className="w-12 h-12 opacity-10 mb-1" /><span className="text-[8px] italic">Upload {PATENT_VIEWS[currentSheet - 1].label}</span></div>}
                </div>
                <h5 className="text-[10px] font-bold uppercase underline underline-offset-4 mb-6 tracking-wider">{PATENT_VIEWS[currentSheet - 1].label}</h5>
              </div>

              <div className="text-[8px] leading-relaxed text-justify space-y-1.5 mb-6">
                <p>The novelty resides in the shape and configuration of the <span className="font-bold">"{productName || "____________________"}"</span>, as illustrated in the accompanying representations.</p>
                <p>No claim is made by virtue of this registration to any right to the exclusive use of the colour or colour combination appearing in the design.</p>
                <p>No claim is made by virtue of this registration in respect of any mechanical or other action of any mechanism whatsoever or in respect of any mode or principle of construction of the article.</p>
                <p>No claim is made by virtue of this registration to any right to the exclusive use of the words, letters, numbers, trademarks, or any other symbols appearing in the design.</p>
                <p className="font-bold">Dated: {dated}</p>
              </div>

              <div className="flex justify-end mb-4">
                <div className="w-[160px] space-y-2">
                  <p className="text-[8px] font-bold italic">For,</p>
                  {authors.map(a => (
                    <div key={a.id} className="flex items-center justify-between border-b border-dotted border-slate-300 pb-0.5">
                      <span className="text-[7px] font-bold uppercase truncate max-w-[90px]">{a.name || "________"}</span>
                      {a.signature && <img src={a.signature} className="h-4 object-contain mix-blend-multiply" alt="s" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[8px] font-bold uppercase mt-auto leading-tight">
                <p>TO,</p>
                <p>THE CONTROLLER OF DESIGNS, THE PATENT OFFICE, KOLKATA</p>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1"><Info className="w-3 h-3" /> Professional Print Preview (Times-Roman Engine)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
