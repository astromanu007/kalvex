"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Upload, Plus, Trash2, Shield, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface EntityFormProps {
  title: string;
  fields: { 
    key: string; 
    label: string; 
    type: "text" | "number" | "textarea" | "select" | "image" | "array";
    options?: { label: string; value: any }[];
    placeholder?: string;
  }[];
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export function EntityForm({
  title,
  fields,
  initialData,
  onSave,
  onClose,
  isOpen
}: EntityFormProps) {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Validation Error: Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (key: string, index: number, value: string) => {
    const newArray = [...(formData[key] || [])];
    newArray[index] = value;
    handleInputChange(key, newArray);
  };

  const addToArray = (key: string) => {
    handleInputChange(key, [...(formData[key] || []), ""]);
  };

  const removeFromArray = (key: string, index: number) => {
    const newArray = [...(formData[key] || [])];
    newArray.splice(index, 1);
    handleInputChange(key, newArray);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.25)] overflow-hidden max-h-[90vh] flex flex-col border border-slate-100"
        >
          {/* Header */}
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> Command Matrix
              </div>
              <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight">{title}</h2>
            </div>
            <Button 
              onClick={onClose}
              variant="ghost" size="icon" className="h-14 w-14 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </Button>
          </div>

          {/* Form Content */}
          <form id="entity-form" onSubmit={handleSubmit} className="p-10 overflow-y-auto flex-grow space-y-10 custom-scrollbar">
            {fields.map((field) => (
              <div key={field.key} className="group relative">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 block mb-4 ml-1 transition-colors group-focus-within:text-blue-600">
                  {field.label}
                </label>
                
                {field.type === "textarea" ? (
                  <textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-[12px] font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-[12px] ring-blue-600/5 transition-all min-h-[160px] resize-none"
                  />
                ) : field.type === "select" ? (
                  <div className="relative">
                    <select
                      value={formData[field.key] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleInputChange(field.key, val === "true" ? true : val === "false" ? false : val);
                      }}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-[12px] font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-[12px] ring-blue-600/5 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Parameter...</option>
                      {field.options?.map(opt => (
                        <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Plus className="w-4 h-4 text-slate-300 rotate-45" />
                    </div>
                  </div>
                ) : field.type === "array" ? (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {(formData[field.key] || []).map((val: string, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex gap-3"
                        >
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleArrayChange(field.key, i, e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 text-[12px] font-bold focus:border-blue-600 focus:bg-white transition-all"
                          />
                          <Button 
                            type="button"
                            onClick={() => removeFromArray(field.key, i)}
                            variant="ghost" className="h-auto px-5 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <Button 
                      type="button"
                      onClick={() => addToArray(field.key)}
                      variant="outline" className="w-full py-5 rounded-2xl border-dashed border-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50/50 transition-all group"
                    >
                      <Plus className="w-3.5 h-3.5 mr-3 group-hover:rotate-90 transition-transform" /> Add Vector Field
                    </Button>
                  </div>
                ) : field.type === "image" ? (
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="relative flex-1 group/input">
                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/input:text-blue-600 transition-colors" />
                        <input
                          type="text"
                          value={formData[field.key] || ""}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          placeholder="Resource URL (HTTPS)"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-[12px] font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                      <Button type="button" variant="outline" className="h-auto px-8 rounded-2xl border-slate-100 hover:bg-slate-50">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                    <AnimatePresence>
                      {formData[field.key] && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-100 shadow-2xl group/img"
                        >
                          <img src={formData[field.key]} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Visual Preview</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, field.type === "number" ? parseFloat(e.target.value) : e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-[12px] font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-[12px] ring-blue-600/5 transition-all"
                  />
                )}
              </div>
            ))}
          </form>

          {/* Footer */}
          <div className="p-10 border-t border-slate-50 flex justify-end items-center gap-6 bg-white relative z-20">
            <button 
              type="button"
              onClick={onClose}
              className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-900 transition-colors"
            >
              Cancel Operation
            </button>
            <Button 
              form="entity-form"
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-blue-600 text-white rounded-[1.25rem] px-14 py-7 h-auto text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:scale-105 hover:-translate-y-1 relative overflow-hidden group/submit"
            >
              <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/submit:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center gap-3">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Authorize & Deploy</>}
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
