"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Cpu, Zap, Download, Layers, Sparkles, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Define PDF styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    fontSize: 9,
    lineHeight: 1.5,
  },
  borderWrapper: {
    border: "2.5pt double #1e293b",
    padding: 24,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 16,
    marginBottom: 24,
  },
  companyInfo: {
    flexDirection: "column",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
    letterSpacing: 1,
  },
  companySub: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "bold",
  },
  docTitleBlock: {
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
  metaText: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  table: {
    width: "100%",
    marginTop: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#334155",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableCell: {
    fontSize: 8.5,
    color: "#334155",
  },
  colSku: { width: "22%" },
  colDesc: { width: "42%" },
  colQty: { width: "10%", textAlign: "center" },
  colPrice: { width: "13%", textAlign: "right" },
  colTotal: { width: "13%", textAlign: "right" },
  
  totalBlock: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  totalRow: {
    width: "35%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },
  totalVal: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2563eb",
  },
  
  authBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
  },
  stamp: {
    borderWidth: 2,
    borderColor: "#10b981",
    borderRadius: 8,
    padding: 8,
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  stampTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#10b981",
  },
  stampSub: {
    fontSize: 6,
    color: "#10b981",
    marginTop: 2,
    fontWeight: "bold",
  },
  stampFooter: {
    fontSize: 5,
    color: "#94a3b8",
    marginTop: 4,
  },
  signatureLine: {
    width: 140,
    borderTopWidth: 1,
    borderTopColor: "#0f172a",
    paddingTop: 6,
    alignItems: "center",
  },
  signatureTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#0f172a",
  },
  signatureSub: {
    fontSize: 7,
    color: "#64748b",
    marginTop: 2,
  },
  
  footer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    textAlign: "center",
    fontSize: 7,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 8,
  }
});

// PDF Document component
const BOMDocumentPDF = ({ items = [], total = 0 }: { items: BomItem[]; total: number }) => {
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const refCode = `KVX-BOM-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.borderWrapper}>
          
          {/* Header block */}
          <View style={pdfStyles.header}>
            <View style={pdfStyles.companyInfo}>
              <Text style={pdfStyles.companyName}>KALVEX LABS</Text>
              <Text style={pdfStyles.companySub}>Electronics Engineering & Simulation Suite</Text>
              <Text style={pdfStyles.metaText}>Email: info@kalvex.in | Web: www.kalvex.in</Text>
            </View>
            <View style={pdfStyles.docTitleBlock}>
              <Text style={pdfStyles.docTitle}>BILL OF MATERIALS</Text>
              <Text style={pdfStyles.metaText}>Date: {dateStr}</Text>
              <Text style={pdfStyles.metaText}>Ref: {refCode}</Text>
            </View>
          </View>

          {/* Table */}
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colSku]}>SKU / PART CODE</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colDesc]}>DESCRIPTION</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colQty]}>QTY</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colPrice]}>UNIT PRICE</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colTotal]}>TOTAL</Text>
            </View>

            {items.map((item, idx) => (
              <View key={item.id || idx} style={pdfStyles.tableRow}>
                <Text style={[pdfStyles.tableCell, pdfStyles.colSku]}>{item.sku}</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.colDesc]}>{item.name}</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.colQty]}>{item.qty}</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.colPrice]}>INR {item.price.toLocaleString()}</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.colTotal]}>INR {(item.price * item.qty).toLocaleString()}</Text>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={pdfStyles.totalBlock}>
            <View style={pdfStyles.totalRow}>
              <Text style={pdfStyles.totalLabel}>ESTIMATED LIABILITY:</Text>
              <Text style={pdfStyles.totalVal}>INR {total.toLocaleString()}</Text>
            </View>
          </View>

          {/* Signatures & Stamp */}
          <View style={pdfStyles.authBlock}>
            <View style={pdfStyles.stamp}>
              <Text style={pdfStyles.stampTitle}>KALVEX LABS</Text>
              <Text style={pdfStyles.stampSub}>★ APPROVED ★</Text>
              <Text style={pdfStyles.stampFooter}>OFFICIAL STAMP</Text>
            </View>
            <View style={pdfStyles.signatureLine}>
              <Text style={pdfStyles.signatureTitle}>Dr. Clara Croft</Text>
              <Text style={pdfStyles.signatureSub}>Authorized Signatory</Text>
            </View>
          </View>

          {/* Footer disclaimer */}
          <Text style={pdfStyles.footer}>
            This is an official document generated by the Kalvex High-Performance Simulation Engine. Protected by SSL & AES-256 protocols.
          </Text>

        </View>
      </Page>
    </Document>
  );
};

interface BomItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
}

interface ElectronicsAddonsProps {
  products?: any[];
}

export default function ElectronicsAddons({ products = [] }: ElectronicsAddonsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- STATE FOR BOM MANAGER ---
  const [bom, setBom] = useState<BomItem[]>([
    { id: "1", name: "Raspberry Pi 5 8GB RAM", sku: "KVX-SBC-005", price: 8500, qty: 2 },
    { id: "2", name: "MPU6050 6-Axis Gyro/Accel", sku: "KVX-SEN-605", price: 180, qty: 10 },
    { id: "3", name: "SG90 Micro Servo Motor", sku: "KVX-MOT-090", price: 120, qty: 5 }
  ]);
  const [partName, setPartName] = useState("");
  const [partSku, setPartSku] = useState("");
  const [partPrice, setPartPrice] = useState(150);
  const [partQty, setPartQty] = useState(1);
  
  // Auto-suggestions states
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on name
  useEffect(() => {
    if (!partName.trim() || !products.length) {
      setSuggestions([]);
      return;
    }
    const matched = products.filter(p => 
      p.name.toLowerCase().includes(partName.toLowerCase()) ||
      p.sku.toLowerCase().includes(partName.toLowerCase())
    ).slice(0, 5);
    setSuggestions(matched);
  }, [partName, products]);

  const selectSuggestion = (prod: any) => {
    setPartName(prod.name);
    setPartSku(prod.sku);
    setPartPrice(prod.price);
    setShowSuggestions(false);
  };

  const addBomItem = () => {
    if (!partName.trim() || !partSku.trim()) return;
    setBom([
      ...bom,
      {
        id: `bom-${Date.now()}`,
        name: partName.trim(),
        sku: partSku.trim(),
        price: partPrice,
        qty: partQty
      }
    ]);
    setPartName("");
    setPartSku("");
    setPartPrice(150);
    setPartQty(1);
    setShowSuggestions(false);
  };

  const removeBomItem = (id: string) => {
    setBom(bom.filter(item => item.id !== id));
  };

  const updateBomQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setBom(bom.map(item => item.id === id ? { ...item, qty } : item));
  };

  const getBomTotal = () => {
    return bom.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const exportBomCsv = () => {
    const header = "SKU,Product Name,Unit Price,Quantity,Total\n";
    const body = bom.map(i => `${i.sku},"${i.name}",${i.price},${i.qty},${i.price * i.qty}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kalvex_bom_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- STATE FOR LOGIC GATE BUILDER ---
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [gateType, setGateType] = useState<"AND" | "OR" | "XOR" | "NAND" | "NOR">("AND");

  const getGateOutput = () => {
    switch (gateType) {
      case "AND": return inputA && inputB ? 1 : 0;
      case "OR": return inputA || inputB ? 1 : 0;
      case "XOR": return inputA !== inputB ? 1 : 0;
      case "NAND": return !(inputA && inputB) ? 1 : 0;
      case "NOR": return !(inputA || inputB) ? 1 : 0;
      default: return 0;
    }
  };

  const outputVal = getGateOutput();

  return (
    <div className="space-y-12 animate-in fade-in duration-500 w-full">
      <style jsx global>{`
        @keyframes flow-line {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        .anim-wire-high {
          stroke: #10b981;
          stroke-dasharray: 6 4;
          animation: flow-line 2s linear infinite;
        }
        .anim-wire-low {
          stroke: #94a3b8;
        }
        .glowing-glow {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }
        .rainbow-border-card {
          position: relative;
          border-radius: 24px;
          padding: 1.5px;
          background: linear-gradient(135deg, #3b82f6, #ec4899, #10b981, #f59e0b);
        }
        .rainbow-inner {
          background: white;
          border-radius: 23px;
        }
      `}</style>
      
      {/* 1. LOGIC GATE SIMULATOR PLAYGROUND */}
      <div className="rainbow-border-card shadow-xl shadow-slate-900/5">
        <div className="rainbow-inner p-8">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-black text-[15px] uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" /> 
                Next-Gen Circuit Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-1">Simulate live logic flows with real-time signal calculations and active path tracking.</p>
            </div>
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
              Simulator Ready
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center bg-slate-950 text-white p-8 rounded-2xl relative overflow-hidden border border-slate-800 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
            
            {/* Input Switches block */}
            <div className="flex flex-col gap-6 justify-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Inputs (Toggle Switches)</span>
              
              <button
                type="button"
                onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                className={`py-4 px-6 rounded-2xl border-2 text-left font-black text-xs transition-all duration-300 relative group flex justify-between items-center cursor-pointer ${
                  inputA === 1 
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-450 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-[1.02]" 
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <span>INPUT A: {inputA}</span>
                <span className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${inputA === 1 ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_#10b981]" : "border-slate-600"}`} />
              </button>

              <button
                type="button"
                onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                className={`py-4 px-6 rounded-2xl border-2 text-left font-black text-xs transition-all duration-300 relative group flex justify-between items-center cursor-pointer ${
                  inputB === 1 
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-450 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-[1.02]" 
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <span>INPUT B: {inputB}</span>
                <span className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${inputB === 1 ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_#10b981]" : "border-slate-600"}`} />
              </button>
            </div>

            {/* SVG Wire Path visualization */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center relative py-8">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Logic Flow Wireframe</span>
              
              <svg width="240" height="120" viewBox="0 0 240 120" className="overflow-visible">
                {/* Wires */}
                <path d="M 10 30 L 100 30" fill="none" strokeWidth="3.5" className={inputA === 1 ? "anim-wire-high" : "anim-wire-low"} />
                <path d="M 10 90 L 100 90" fill="none" strokeWidth="3.5" className={inputB === 1 ? "anim-wire-high" : "anim-wire-low"} />
                
                <path d="M 150 60 L 230 60" fill="none" strokeWidth="3.5" className={outputVal === 1 ? "anim-wire-high" : "anim-wire-low"} />

                {/* Gate Silhouette */}
                <g transform="translate(90, 25)">
                  <rect x="0" y="0" width="60" height="70" rx="15" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />
                  <text x="30" y="40" fill="#f8fafc" fontSize="12" fontWeight="900" textAnchor="middle" letterSpacing="1">{gateType}</text>
                  <text x="30" y="55" fill="#64748b" fontSize="7" fontWeight="900" textAnchor="middle">GATE</text>
                </g>
              </svg>

              <div className="mt-6">
                <select
                  value={gateType}
                  onChange={e => setGateType(e.target.value as any)}
                  className="bg-slate-900 border-2 border-slate-800 text-white hover:border-indigo-500 text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl outline-none cursor-pointer transition-all"
                >
                  <option value="AND">AND GATE</option>
                  <option value="OR">OR GATE</option>
                  <option value="XOR">XOR GATE</option>
                  <option value="NAND">NAND GATE</option>
                  <option value="NOR">NOR GATE</option>
                </select>
              </div>
            </div>

            {/* Output Panel block */}
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Signal Output</span>
              
              <motion.div 
                animate={outputVal === 1 ? { scale: [1, 1.08, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center border-4 transition-all duration-500 ${
                  outputVal === 1 
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]" 
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                <span className="text-3xl font-black">{outputVal}</span>
                <span className="text-[7.5px] font-black uppercase tracking-wider mt-1">
                  {outputVal === 1 ? "HIGH" : "LOW"}
                </span>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. DYNAMIC BILL OF MATERIALS (BOM) GRID WITH AUTO-SUGGESTIONS */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-visible">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-black text-[15px] uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" /> Lab Bill of Materials (BOM)
            </h3>
            <p className="text-xs text-slate-400 mt-1">Auto-suggest catalog items while typing to estimate complete costings.</p>
          </div>
          <div className="flex gap-2.5 items-center">
            {mounted && (
              <PDFDownloadLink 
                document={<BOMDocumentPDF items={bom} total={getBomTotal()} />} 
                fileName={`kalvex_bom_${new Date().toISOString().slice(0, 10)}.pdf`}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-indigo-500/20"
              >
                {({ loading }) => (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>{loading ? "Generating PDF..." : "Download PDF"}</span>
                  </>
                )}
              </PDFDownloadLink>
            )}
            <button 
              type="button"
              onClick={exportBomCsv}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-650 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Add item form with suggestions dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50/50 p-6 rounded-2xl border border-slate-150/70 mb-8 relative">
          
          <div className="space-y-1 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Part Name (Searches Store)</label>
            <input 
              value={partName}
              onChange={e => {
                setPartName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="e.g. Raspberry"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" 
            />

            {/* Suggestions drop-panel */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100 max-h-60 overflow-y-auto"
                  >
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => selectSuggestion(s)}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50/50 transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-black text-slate-800 truncate max-w-[180px]">{s.name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.sku}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-indigo-600 shrink-0">₹{s.price}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Part SKU</label>
            <input 
              value={partSku}
              onChange={e => setPartSku(e.target.value)}
              placeholder="e.g. KVX-SBC-005"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price (INR)</label>
            <input 
              type="number"
              value={partPrice}
              onChange={e => setPartPrice(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none" 
            />
          </div>

          <button
            type="button"
            onClick={addBomItem}
            className="bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* BOM Table Grid */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-inner bg-slate-50/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                <th className="py-4 pl-4">Component Details</th>
                <th className="py-4">SKU</th>
                <th className="py-4">Unit Cost</th>
                <th className="py-4">Qty</th>
                <th className="py-4">Total Cost</th>
                <th className="py-4 pr-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody>
              {bom.map(item => (
                <tr key={item.id} className="border-b border-slate-100 text-xs font-semibold text-slate-700 hover:bg-white transition-colors">
                  <td className="py-4 pl-4">{item.name}</td>
                  <td>{item.sku}</td>
                  <td>₹{item.price.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button 
                        type="button"
                        onClick={() => updateBomQty(item.id, item.qty - 1)}
                        className="w-6 h-6 border rounded bg-white hover:bg-slate-100 cursor-pointer flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 w-6 text-center">{item.qty}</span>
                      <button 
                        type="button"
                        onClick={() => updateBomQty(item.id, item.qty + 1)}
                        className="w-6 h-6 border rounded bg-white hover:bg-slate-100 cursor-pointer flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="font-bold">₹{(item.price * item.qty).toLocaleString()}</td>
                  <td className="text-right pr-4">
                    <button 
                      type="button"
                      onClick={() => removeBomItem(item.id)}
                      className="text-slate-350 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOM Total Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-150/60 mt-8 pt-8">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Prices include local taxes (Diwali Offer code applicable at checkout)</p>
          <div className="text-right mt-4 sm:mt-0">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Estimated BOM Total</span>
            <span className="text-3xl font-black text-slate-950">₹{getBomTotal().toLocaleString()}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
