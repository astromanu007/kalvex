"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Upload, Zap, Trash2, 
  Loader2, Download, FileImage, Info, Sparkles,
  Printer, UserPlus, Image as ImageIcon
} from "lucide-react";
import { 
  Document, Page, Text, View, Image as PDFImage, 
  StyleSheet, PDFDownloadLink, Font 
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

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  headerBox: { flexDirection: "row", border: "1.5pt solid black", marginBottom: 30 },
  headerLeft: { flex: 3, borderRight: "1.5pt solid black", padding: 10 },
  headerRight: { flex: 1, padding: 10 },
  title: { fontSize: 14, fontWeight: "bold", textAlign: "center", textDecoration: "underline", marginBottom: 20, textTransform: "uppercase" },
  label: { fontSize: 9, fontWeight: "bold" },
  viewContainer: { width: "100%", height: 350, border: "0.5pt solid #eee", marginBottom: 20, alignItems: "center", justifyContent: "center" },
  viewImage: { maxWidth: "85%", maxHeight: "85%", objectFit: "contain" },
  viewTitle: { fontSize: 12, fontWeight: "bold", textAlign: "center", textDecoration: "underline", marginBottom: 30, textTransform: "uppercase" },
  noveltyText: { fontSize: 10, textAlign: "justify", marginBottom: 10, lineHeight: 1.5 },
  bold: { fontWeight: "bold" },
  date: { fontSize: 10, fontWeight: "bold", marginTop: 20, marginBottom: 30 },
  footer: { marginTop: 40, textTransform: "uppercase", fontSize: 9, fontWeight: "bold" },
  sigSection: { alignSelf: "flex-end", width: "50%", marginTop: 20 },
  sigRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottom: "0.5pt dotted #999", paddingBottom: 2, marginBottom: 10 },
  sigName: { fontSize: 9, fontWeight: "bold", maxWidth: 120 },
  sigImage: { height: 25, objectFit: "contain" }
});

// PDF Component
const PatentDocument = ({ productName, dated, views, authors }: any) => (
  <Document>
    {PATENT_VIEWS.map((view, index) => (
      <Page key={view.id} size="A4" style={styles.page}>
        <View style={styles.headerBox}>
          <View style={styles.headerLeft}>
            <Text style={styles.label}>
              NAME OF THE APPLICANTS: {authors.filter((a: any) => a.name).map((a: any) => a.name).join(", ") || "[NAMES]"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.label}>Total Sheet: 7</Text>
            <Text style={styles.label}>Sheet No: {index + 1}</Text>
          </View>
        </View>

        <Text style={styles.title}>The Designs Act, 2000</Text>

        <View style={styles.viewContainer}>
          {views[view.id] ? (
            <PDFImage src={views[view.id]} style={styles.viewImage} />
          ) : (
            <Text style={{ fontSize: 10, color: "#ccc" }}>[ {view.label} Missing ]</Text>
          )}
        </View>

        <Text style={styles.viewTitle}>{view.label}</Text>

        <View style={{ marginBottom: 40 }}>
          <Text style={styles.noveltyText}>
            The novelty resides in the shape and configuration of the 
            <Text style={styles.bold}> "{productName || "[Product Title]"}"</Text>, as illustrated in the accompanying representations.
          </Text>
          <Text style={styles.noveltyText}>No claim is made by virtue of this registration to any right to the exclusive use of the colour or colour combination appearing in the design.</Text>
          <Text style={styles.noveltyText}>No claim is made by virtue of this registration in respect of any mechanical or other action of any mechanism whatsoever or in respect of any mode or principle of construction of the article.</Text>
          <Text style={styles.noveltyText}>No claim is made by virtue of this registration to any right to the exclusive use of the words, letters, numbers, trademarks, or any other symbols appearing in the design.</Text>
        </View>

        <Text style={styles.date}>Dated: {dated}</Text>

        <View style={styles.sigSection}>
          <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 5 }}>For,</Text>
          {authors.map((a: any) => (
            <View key={a.id} style={styles.sigRow}>
              <Text style={styles.sigName}>{a.name}</Text>
              {a.signature && <PDFImage src={a.signature} style={styles.sigImage} />}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
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
  const [dated, setDated] = useState(new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }));
  
  const [views, setViews] = useState<Record<string, string | null>>({
    perspective: null, front: null, back: null, left: null, right: null, top: null, bottom: null
  });

  const [authors, setAuthors] = useState([{ id: "1", name: "", signature: null as any }]);
  const [currentSheet, setCurrentSheet] = useState(1);

  const handleViewUpload = (viewId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setViews(prev => ({ ...prev, [viewId]: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSignatureUpload = (authorId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setAuthors(prev => prev.map(a => 
      a.id === authorId ? { ...a, signature: e.target?.result as string } : a
    ));
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F8FAFC]">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="font-heading font-bold text-3xl text-text-primary mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-accent-primary" />
                AI Patent Designer
              </h1>
              <p className="text-text-secondary">Ready-to-file document generator for Design Patents.</p>
            </div>

            <section className="bg-white border border-border rounded-3xl p-8 shadow-sm space-y-6">
              <h2 className="font-heading font-bold text-xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">1</span>
                Project Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-text-secondary mb-2 block uppercase">Product Title</label>
                  <input value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-bg-surface border border-border rounded-2xl px-6 py-4" />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary mb-2 block uppercase">Filing Date</label>
                  <input value={dated} onChange={(e) => setDated(e.target.value)} className="w-full bg-bg-surface border border-border rounded-2xl px-6 py-4" />
                </div>
              </div>
            </section>

            <section className="bg-white border border-border rounded-3xl p-8 shadow-sm">
              <h2 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">2</span>
                Upload 7 Views
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PATENT_VIEWS.map((view) => (
                  <label key={view.id} className="cursor-pointer">
                    <div className={`aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-2 ${views[view.id] ? "border-accent-success bg-accent-success/5" : "border-border hover:border-accent-primary bg-bg-surface"}`}>
                      {views[view.id] ? <img src={views[view.id]!} className="w-full h-full object-contain rounded-lg" alt="view" /> : <><FileImage className="w-5 h-5 text-text-muted mb-1" /><span className="text-[9px] font-bold text-text-muted">{view.label}</span></>}
                    </div>
                    <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleViewUpload(view.id, e.target.files[0])} />
                  </label>
                ))}
              </div>
            </section>

            <section className="bg-white border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm">3</span>Applicants</h2>
                <Button variant="outline" onClick={() => setAuthors([...authors, { id: Date.now().toString(), name: "", signature: null }])} className="rounded-xl"><UserPlus className="w-4 h-4 mr-2" /> Add</Button>
              </div>
              <div className="space-y-4">
                {authors.map((author, index) => (
                  <div key={author.id} className="p-6 bg-bg-surface rounded-2xl border border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input value={author.name} onChange={(e) => setAuthors(prev => prev.map(a => a.id === author.id ? { ...a, name: e.target.value } : a))} placeholder="FULL NAME" className="w-full bg-white border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase" />
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer border-2 border-dashed rounded-xl flex items-center justify-center bg-white text-[10px] font-bold">{author.signature ? "Sign Captured" : "Upload Signature"}<input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleSignatureUpload(author.id, e.target.files[0])} /></label>
                        {author.signature && <img src={author.signature} className="w-12 h-12 rounded-xl object-contain bg-white border border-border" alt="s" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:w-[450px]">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg">Live Preview</h3>
                <div className="flex gap-2">
                  <select className="bg-white border border-border rounded-lg px-2 py-1 text-[10px] font-bold" onChange={(e) => setCurrentSheet(parseInt(e.target.value))}>
                    {PATENT_VIEWS.map((v, i) => <option key={v.id} value={i + 1}>Sheet {i + 1}</option>)}
                  </select>
                  <PDFDownloadLink 
                    document={<PatentDocument productName={productName} dated={dated} views={views} authors={authors} />}
                    fileName={`Patent_${productName || 'Document'}.pdf`}
                  >
                    {({ loading }) => (
                      <Button size="sm" className="bg-accent-primary text-white" disabled={loading}>
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Download className="w-3 h-3 mr-2" /> Download 7-Page DOC</>}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              </div>

              {/* MOCKUP PREVIEW */}
              <div className="bg-white shadow-2xl border border-border aspect-[1/1.414] w-full p-8 font-serif select-none overflow-hidden">
                <div className="text-center border-b border-black pb-2 mb-4"><Text style={{ fontSize: 10, fontWeight: "bold" }}>THE DESIGNS ACT, 2000</Text></div>
                <div className="grid grid-cols-4 border border-black mb-6">
                  <div className="col-span-3 border-r border-black p-2 text-[8px] font-bold">NAME: {authors.map(a => a.name).join(", ")}</div>
                  <div className="col-span-1 p-2 text-[8px] font-bold">Sheet: {currentSheet}/7</div>
                </div>
                <div className="aspect-square border border-slate-100 flex items-center justify-center mb-4">
                  {views[PATENT_VIEWS[currentSheet - 1].id] ? <img src={views[PATENT_VIEWS[currentSheet - 1].id]!} className="max-h-[85%] object-contain" alt="v" /> : <ImageIcon className="w-12 h-12 opacity-10" />}
                </div>
                <div className="text-center text-[10px] font-bold underline mb-4">{PATENT_VIEWS[currentSheet - 1].label}</div>
                <div className="text-[8px] leading-tight text-justify space-y-1">
                  <p>The novelty resides in the shape and configuration of the <span className="font-bold">"{productName}"</span>...</p>
                  <p>No claim is made to exclusive use of colour...</p>
                  <p>Dated: {dated}</p>
                </div>
                <div className="flex justify-end mt-4"><div className="w-1/2 border-t border-slate-300 pt-2"><p className="text-[8px] font-bold">For,</p>
                  {authors.map(a => (
                    <div key={a.id} className="flex justify-between items-center py-1">
                      <span className="text-[7px] uppercase">{a.name}</span>
                      {a.signature && <img src={a.signature} className="h-4 object-contain" alt="s" />}
                    </div>
                  ))}
                </div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
