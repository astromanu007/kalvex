"use client";

import { useState } from "react";
import { Plus, Trash2, Cpu, Zap, Download, RefreshCw, Layers } from "lucide-react";

interface BomItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
}

export default function ElectronicsAddons() {
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

  return (
    <div className="space-y-12 animate-in fade-in duration-500 w-full">
      
      {/* 1. LOGIC GATE SIMULATOR PLAYGROUND */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Interactive Logic Gate Builder
            </h3>
            <p className="text-xs text-slate-400 mt-1">Simulate real-time circuit logic and trace outputs instantly.</p>
          </div>
          <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            Gate Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
          
          {/* Inputs Section */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Inputs (Binary)</span>
            
            <button
              onClick={() => setInputA(inputA === 1 ? 0 : 1)}
              className={`p-4 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                inputA === 1 
                  ? "bg-blue-600 border-blue-650 text-white shadow-md shadow-blue-500/20" 
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              Input A: {inputA}
            </button>

            <button
              onClick={() => setInputB(inputB === 1 ? 0 : 1)}
              className={`p-4 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                inputB === 1 
                  ? "bg-blue-600 border-blue-650 text-white shadow-md shadow-blue-500/20" 
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              Input B: {inputB}
            </button>
          </div>

          {/* Gate Selection Section */}
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Gate Function</span>
            <select
              value={gateType}
              onChange={e => setGateType(e.target.value as any)}
              className="w-full max-w-[160px] text-center bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="AND">AND GATE</option>
              <option value="OR">OR GATE</option>
              <option value="XOR">XOR GATE</option>
              <option value="NAND">NAND GATE</option>
              <option value="NOR">NOR GATE</option>
            </select>

            {/* Custom SVG Drawing of logic gate */}
            <svg width="100" height="60" viewBox="0 0 100 60" className="opacity-90">
              <path d="M10,10 L50,10 A20,20 0 0,1 50,50 L10,50 Z" fill="none" stroke="#64748b" strokeWidth="2" />
              <line x1="50" y1="30" x2="90" y2="30" stroke="#64748b" strokeWidth="2" />
              <circle cx="90" cy="30" r="3" fill="#64748b" />
            </svg>
          </div>

          {/* Outputs Section */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Signal Output</span>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-black transition-all border-4 ${
              getGateOutput() === 1 
                ? "bg-emerald-500 border-emerald-300 text-white shadow-xl shadow-emerald-500/30 scale-105" 
                : "bg-slate-200 border-slate-300 text-slate-400"
            }`}>
              {getGateOutput()}
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mt-3">
              {getGateOutput() === 1 ? "Logic High (True)" : "Logic Low (False)"}
            </span>
          </div>

        </div>
      </div>

      {/* 2. DYNAMIC BILL OF MATERIALS (BOM) GRID */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" /> Lab Bill of Materials (BOM)
            </h3>
            <p className="text-xs text-slate-400 mt-1">Compile your component shopping list and estimate project costings.</p>
          </div>
          <button 
            onClick={exportBomCsv}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        {/* Add item form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50/50 p-5 rounded-2xl border border-slate-100 mb-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Part Name</label>
            <input 
              value={partName}
              onChange={e => setPartName(e.target.value)}
              placeholder="e.g. ESP32 Dev Board"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Part SKU</label>
            <input 
              value={partSku}
              onChange={e => setPartSku(e.target.value)}
              placeholder="e.g. KVX-SBC-032"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price (INR)</label>
            <input 
              type="number"
              value={partPrice}
              onChange={e => setPartPrice(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none" 
            />
          </div>
          <button
            onClick={addBomItem}
            className="bg-slate-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer"
          >
            Add Component
          </button>
        </div>

        {/* BOM Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-3">Component Info</th>
                <th className="pb-3">SKU</th>
                <th className="pb-3">Unit Price</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Subtotal</th>
                <th className="pb-3 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bom.map(item => (
                <tr key={item.id} className="border-b border-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-50/50">
                  <td className="py-4 pl-3">{item.name}</td>
                  <td>{item.sku}</td>
                  <td>₹{item.price.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateBomQty(item.id, item.qty - 1)}
                        className="w-6 h-6 border rounded bg-white hover:bg-slate-100 cursor-pointer flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 w-6 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateBomQty(item.id, item.qty + 1)}
                        className="w-6 h-6 border rounded bg-white hover:bg-slate-100 cursor-pointer flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="font-bold">₹{(item.price * item.qty).toLocaleString()}</td>
                  <td className="text-right pr-3">
                    <button 
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
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 mt-8 pt-8">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Prices include local taxes (Diwali Offer code applicable at checkout)</p>
          <div className="text-right mt-4 sm:mt-0">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Estimated BOM Total</span>
            <span className="text-3xl font-black text-slate-900">₹{getBomTotal().toLocaleString()}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
