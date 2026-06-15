"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Zap, Download, Layers, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <div className="space-y-12 animate-in fade-in duration-500 w-full text-slate-800">
      {/* DYNAMIC BILL OF MATERIALS (BOM) GRID WITH AUTO-SUGGESTIONS */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative overflow-visible">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-slate-100 gap-4">
          <div>
            <h3 className="font-heading font-black text-lg uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" /> Lab Bill of Materials (BOM)
            </h3>
            <p className="text-xs text-slate-400 mt-1">Auto-suggest catalog items while typing to estimate complete costings.</p>
          </div>
          <div className="flex gap-2.5 items-center w-full sm:w-auto">
            <button 
              type="button"
              onClick={exportBomCsv}
              className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer w-full sm:w-auto"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Info Tip */}
        <div className="mb-6 flex gap-2.5 items-center bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-700">
          <Info className="w-4 h-4 shrink-0" />
          <span>Search parts by entering part name or SKU. Select suggestions to auto-fill SKU and price.</span>
        </div>

        {/* Add item form with suggestions dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-6 rounded-2xl border border-slate-150 mb-8 relative">
          
          <div className="space-y-1 relative">
            <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Part Name (Searches Store)</label>
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
            <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Part SKU</label>
            <input 
              value={partSku}
              onChange={e => setPartSku(e.target.value)}
              placeholder="e.g. KVX-SBC-005"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Unit Price (INR)</label>
            <input 
              type="number"
              value={partPrice}
              onChange={e => setPartPrice(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" 
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
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-150/60 mt-8 pt-8 gap-4">
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
