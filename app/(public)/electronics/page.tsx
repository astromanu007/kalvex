"use client";

import Link from "next/link";
import { Search, Filter, Heart, ShoppingCart, Sparkles, Box, Cpu, Zap, Monitor, Settings, Battery, ChevronRight, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Mock products data
const PRODUCTS = [
  { id: "1", name: "Raspberry Pi 5 4GB RAM", sku: "KVX-SBC-005", price: 6500, mrp: 7200, category: "Development Boards", stock: 15, rating: 4.8, image: "circuit" },
  { id: "2", name: "Arduino Uno R3 Compatible", sku: "KVX-SBC-001", price: 450, mrp: 600, category: "Development Boards", stock: 120, rating: 4.5, image: "cpu" },
  { id: "3", name: "ESP32 NodeMCU WiFi+BT", sku: "KVX-MOD-032", price: 350, mrp: 500, category: "Modules", stock: 0, rating: 4.7, image: "wifi" },
  { id: "4", name: "L298N Motor Driver Module", sku: "KVX-MOD-015", price: 150, mrp: 200, category: "Modules", stock: 45, rating: 4.2, image: "cpu" },
  { id: "5", name: "HC-SR04 Ultrasonic Sensor", sku: "KVX-SEN-004", price: 85, mrp: 120, category: "Sensors", stock: 200, rating: 4.6, image: "zap" },
  { id: "6", name: "0.96 inch OLED Display I2C", sku: "KVX-DIS-096", price: 250, mrp: 350, category: "Displays", stock: 30, rating: 4.9, image: "monitor" },
  { id: "7", name: "NEMA 17 Stepper Motor", sku: "KVX-MOT-017", price: 850, mrp: 1100, category: "Motors", stock: 12, rating: 4.4, image: "settings" },
  { id: "8", name: "3.7V 2000mAh Li-ion Battery", sku: "KVX-PWR-037", price: 120, mrp: 180, category: "Power Supply", stock: 500, rating: 4.1, image: "battery" },
];

const CATEGORIES = [
  "All Products",
  "Development Boards",
  "Modules",
  "Sensors",
  "Displays",
  "Motors & Drivers",
  "Power Supply",
  "Passive Components",
  "Hardware & Tools"
];

export default function ElectronicsStore() {
  return (
    <div className="min-h-screen pt-40 pb-32 bg-slate-50 transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header: Institutional Authority */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col xl:flex-row justify-between items-end mb-24 gap-12"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
              <Shield className="w-4 h-4" /> Hardware Division
            </div>
            <h1 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter">
              Precision <span className="text-blue-600">Assets</span>
            </h1>
            <p className="text-xl text-slate-400 font-bold max-w-xl">
              Sourcing aerospace-grade components for high-stakes engineering research and rapid institutional prototyping.
            </p>
          </div>
          
          <div className="w-full xl:w-[540px] relative group">
            <div className="absolute inset-0 bg-blue-600/5 rounded-3xl blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
            <input 
              type="text" 
              placeholder="Audit components by SKU, Brand, or Specification..." 
              className="w-full bg-white border border-slate-100 rounded-[2rem] pl-16 pr-40 py-6 text-slate-900 font-black text-sm focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200 shadow-2xl shadow-slate-900/5 relative z-10"
            />
            <Search className="w-6 h-6 text-slate-300 absolute left-6 top-6 group-focus-within:text-blue-600 transition-colors z-20" />
            <Button className="absolute right-3 top-3 h-14 px-10 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-slate-900/20 z-20">
              Audit Lab
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Sidebar Filters: Administrative Controls */}
          <motion.aside 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full lg:w-80 shrink-0 sticky top-40"
          >
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.05)] space-y-12">
              <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300 flex items-center">
                  <Filter className="w-4 h-4 mr-3 text-blue-600" /> Parameters
                </h3>
                <button className="text-[9px] font-black text-blue-600 hover:text-slate-900 uppercase tracking-widest transition-colors">Clear</button>
              </div>

              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Box className="w-4 h-4 text-slate-300" /> Classification
                </h4>
                <div className="space-y-4">
                  {CATEGORIES.map((cat, i) => (
                    <label key={i} className="flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-blue-600 transition-all group">
                      <div className="relative w-5 h-5 mr-4 shrink-0">
                        <input type="radio" name="category" className="peer absolute inset-0 opacity-0 cursor-pointer" defaultChecked={i===0} />
                        <div className="w-full h-full border-2 border-slate-100 rounded-lg bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all" />
                        <CheckCircle className="absolute inset-0 w-full h-full text-white scale-0 peer-checked:scale-75 transition-transform" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-50">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-300" /> Valuation
                </h4>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">₹</span>
                    <input type="number" placeholder="Min" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-[11px] font-black outline-none focus:border-blue-600 transition-all" />
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">₹</span>
                    <input type="number" placeholder="Max" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-[11px] font-black outline-none focus:border-blue-600 transition-all" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <label className="flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-blue-600 transition-all group">
                   <div className="relative w-5 h-5 mr-4 shrink-0">
                    <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-full h-full border-2 border-slate-100 rounded-lg bg-slate-50 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-all" />
                    <CheckCircle className="absolute inset-0 w-full h-full text-white scale-0 peer-checked:scale-75 transition-transform" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">In-Stock Only</span>
                </label>
              </div>
            </div>
          </motion.aside>

          {/* Product Grid: High-Fidelity Assets */}
          <main className="flex-1 space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory Status: <span className="text-slate-900">08 / 124 Registered Units</span></p>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sequencing:</span>
                <select className="bg-white border border-slate-100 rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:ring-8 ring-blue-600/5 outline-none cursor-pointer shadow-xl shadow-slate-900/5 appearance-none pr-10 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTQ0NzhmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[center_right_1rem] bg-[length:1.25rem]">
                  <option>Strategic Relevance</option>
                  <option>Valuation: Low-High</option>
                  <option>Valuation: High-Low</option>
                  <option>Institutional Grade</option>
                </select>
              </div>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
            >
              {PRODUCTS.map((p) => {
                const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                
                return (
                  <motion.div 
                    key={p.id} 
                    variants={fadeInUp} 
                    whileHover={{ y: -15 }}
                    className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 group hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] hover:border-blue-600/20 transition-all duration-700 flex flex-col h-full relative"
                  >
                    {/* Visual Asset Area */}
                    <div className="relative h-72 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-50">
                      <div className="absolute top-8 left-8 z-10">
                        <span className="bg-white text-slate-900 text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-slate-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500">
                          {p.category}
                        </span>
                      </div>
                      
                      <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
                        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:shadow-2xl transition-all shadow-sm border border-slate-50">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          className="h-full bg-blue-600/10"
                        />
                      </div>

                      <div className="w-48 h-48 bg-white rounded-[2.5rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-1000 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] border border-slate-50 relative">
                        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                        {p.image === 'circuit' && <Cpu className="w-16 h-16 text-blue-600 transition-colors" />}
                        {p.image === 'cpu' && <Box className="w-16 h-16 text-slate-400 group-hover:text-blue-600 transition-colors" />}
                        {p.image === 'wifi' && <Zap className="w-16 h-16 text-slate-400 group-hover:text-blue-600 transition-colors" />}
                        {p.image === 'monitor' && <Monitor className="w-16 h-16 text-slate-400 group-hover:text-blue-600 transition-colors" />}
                        {p.image === 'settings' && <Settings className="w-16 h-16 text-slate-400 group-hover:text-blue-600 transition-colors" />}
                        {p.image === 'zap' && <Zap className="w-16 h-16 text-slate-400 group-hover:text-blue-600 transition-colors" />}
                        {p.image === 'battery' && <Battery className="w-16 h-16 text-slate-400 group-hover:text-blue-600 transition-colors" />}
                      </div>
                    </div>

                    {/* Technical Specifications */}
                    <div className="p-10 flex flex-col flex-grow space-y-6">
                      <div className="space-y-2">
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">{p.sku}</div>
                        <Link href={`/electronics/${p.id}`}>
                          <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{p.name}</h3>
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => <div key={s} className={`w-1 h-3 rounded-full ${s <= Math.floor(p.rating) ? "bg-blue-600" : "bg-slate-100"}`} />)}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.rating} Grade</span>
                      </div>

                      <div className="mt-auto space-y-8">
                        <div className="flex items-center justify-between border-y border-slate-50 py-6">
                          <div className="flex items-baseline gap-3">
                            <span className="font-black text-slate-900 text-3xl tracking-tighter">₹{p.price.toLocaleString()}</span>
                            <span className="text-xs text-slate-300 line-through font-bold">₹{p.mrp.toLocaleString()}</span>
                          </div>
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">-{discount}% OFF</span>
                        </div>

                        <div className="flex items-center justify-between gap-6">
                          <div className="flex flex-col gap-1">
                            {p.stock > 0 ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Stock</span>
                                </div>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{p.stock} Units</span>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Backordered</span>
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            disabled={p.stock === 0}
                            className={`flex-1 h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-700 shadow-2xl ${p.stock > 0 ? "bg-slate-900 hover:bg-blue-600 text-white shadow-slate-900/10" : "bg-slate-50 text-slate-200"}`}
                          >
                            Authorize Order <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Advanced Pagination */}
            <div className="mt-24 flex justify-center">
              <nav className="flex items-center gap-4 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-900/5">
                <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl text-slate-300 hover:bg-slate-50" disabled>&lt;</Button>
                <div className="flex items-center gap-2 px-4">
                  <Button className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-xl shadow-slate-900/20">01</Button>
                  <Button variant="ghost" className="w-14 h-14 rounded-2xl text-slate-400 font-black text-sm hover:bg-slate-50">02</Button>
                  <Button variant="ghost" className="w-14 h-14 rounded-2xl text-slate-400 font-black text-sm hover:bg-slate-50">03</Button>
                  <span className="px-4 text-slate-200 font-black tracking-[0.5em]">...</span>
                  <Button variant="ghost" className="w-14 h-14 rounded-2xl text-slate-400 font-black text-sm hover:bg-slate-50">12</Button>
                </div>
                <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all hover:translate-x-1">&gt;</Button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
