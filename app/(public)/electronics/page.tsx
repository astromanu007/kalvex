"use client";

import Link from "next/link";
import { Search, Filter, Heart, ShoppingCart, Sparkles, Box, Cpu, Zap, Monitor, Settings, Battery, ChevronRight, Shield, ArrowRight, CheckCircle, ShoppingBag } from "lucide-react";
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

const PRODUCTS = [
  { id: "1", name: "Raspberry Pi 5 4GB RAM", sku: "KVX-SBC-005", price: 6500, mrp: 7200, category: "Development Boards", stock: 15, rating: 4.8, image: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?auto=format&fit=crop&q=80&w=600" },
  { id: "2", name: "Arduino Uno R3 Compatible", sku: "KVX-SBC-001", price: 450, mrp: 600, category: "Development Boards", stock: 120, rating: 4.5, image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=600" },
  { id: "3", name: "ESP32 NodeMCU WiFi+BT", sku: "KVX-MOD-032", price: 350, mrp: 500, category: "Modules", stock: 0, rating: 4.7, image: "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&q=80&w=600" },
  { id: "4", name: "L298N Motor Driver Module", sku: "KVX-MOD-015", price: 150, mrp: 200, category: "Modules", stock: 45, rating: 4.2, image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600" },
  { id: "5", name: "HC-SR04 Ultrasonic Sensor", sku: "KVX-SEN-004", price: 85, mrp: 120, category: "Sensors", stock: 200, rating: 4.6, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600" },
  { id: "6", name: "0.96 inch OLED Display I2C", sku: "KVX-DIS-096", price: 250, mrp: 350, category: "Displays", stock: 30, rating: 4.9, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" },
  { id: "7", name: "NEMA 17 Stepper Motor", sku: "KVX-MOT-017", price: 850, mrp: 1100, category: "Motors", stock: 12, rating: 4.4, image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=600" },
  { id: "8", name: "3.7V 2000mAh Li-ion Battery", sku: "KVX-PWR-037", price: 120, mrp: 180, category: "Power Supply", stock: 500, rating: 4.1, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600" },
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
        
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col xl:flex-row justify-between items-end mb-16 gap-12"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl shadow-blue-600/20">
              <ShoppingBag className="w-4 h-4" /> Electronics Store
            </div>
            <h1 className="font-heading font-black text-5xl md:text-6xl text-slate-900 tracking-tight">
              Electronic <span className="text-blue-600">Components</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-xl">
              High-quality electronics, sensors, and development boards for your engineering projects and prototypes.
            </p>
          </div>
          
          <div className="w-full xl:w-[500px] relative group">
            <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <input 
              type="text" 
              placeholder="Search components, modules, or brands..." 
              className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-32 py-5 text-slate-900 font-medium text-sm focus:ring-4 ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 shadow-lg shadow-slate-900/5 relative z-10"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-5 top-5 group-focus-within:text-blue-600 transition-colors z-20" />
            <Button className="absolute right-2 top-2 bottom-2 h-auto px-6 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md z-20">
              Search
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Sidebar Filters */}
          <motion.aside 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full lg:w-72 shrink-0 lg:sticky lg:top-32"
          >
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-blue-600" /> Filters
                </h3>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">Clear All</button>
              </div>

              <div className="space-y-5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Box className="w-4 h-4 text-slate-400" /> Categories
                </h4>
                <div className="space-y-3">
                  {CATEGORIES.map((cat, i) => (
                    <label key={i} className="flex items-center text-sm font-medium text-slate-600 cursor-pointer hover:text-blue-600 transition-colors group">
                      <div className="relative w-4 h-4 mr-3 shrink-0">
                        <input type="radio" name="category" className="peer absolute inset-0 opacity-0 cursor-pointer" defaultChecked={i===0} />
                        <div className="w-full h-full border-2 border-slate-300 rounded-full bg-white peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all" />
                        <div className="absolute inset-1 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-400" /> Price Range
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

              <div className="pt-6 border-t border-slate-100">
                <label className="flex items-center text-sm font-medium text-slate-600 cursor-pointer hover:text-emerald-600 transition-colors group">
                   <div className="relative w-4 h-4 mr-3 shrink-0">
                    <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-full h-full border-2 border-slate-300 rounded bg-white peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-all" />
                    <CheckCircle className="absolute -inset-0.5 w-5 h-5 text-white scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span>In-Stock Only</span>
                </label>
              </div>
            </div>
          </motion.aside>

          {/* Product Grid */}
          <main className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Showing <span className="text-slate-900">1-8</span> of 124 products</p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sort By:</span>
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 outline-none cursor-pointer appearance-none pr-8 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTQ0NzhmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[center_right_0.75rem] bg-[length:1rem]">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
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
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 group hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-full relative"
                  >
                    {/* Visual Area */}
                    <div className="relative h-60 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
                          {p.category}
                        </span>
                      </div>
                      
                      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:shadow-md transition-all border border-slate-200">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="w-full h-full flex items-center justify-center bg-white">
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="space-y-1 mb-4">
                        <div className="text-xs font-semibold text-slate-400">{p.sku}</div>
                        <Link href={`/electronics/${p.id}`}>
                          <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{p.name}</h3>
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <svg key={s} className={`w-4 h-4 ${s <= Math.round(p.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{p.rating} Reviews</span>
                      </div>

                      <div className="mt-auto space-y-5">
                        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-slate-900 text-2xl">₹{p.price.toLocaleString()}</span>
                            <span className="text-sm text-slate-400 line-through">₹{p.mrp.toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">{discount}% OFF</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col">
                            {p.stock > 0 ? (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-semibold text-emerald-600">In Stock</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-xs font-semibold text-red-600">Out of Stock</span>
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            disabled={p.stock === 0}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${p.stock > 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-100 text-slate-400"}`}
                          >
                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center">
              <nav className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg text-slate-500" disabled>&lt;</Button>
                <div className="flex items-center gap-1 px-2">
                  <Button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold">1</Button>
                  <Button variant="ghost" className="w-10 h-10 rounded-lg text-slate-600 font-medium hover:bg-slate-100">2</Button>
                  <Button variant="ghost" className="w-10 h-10 rounded-lg text-slate-600 font-medium hover:bg-slate-100">3</Button>
                  <span className="px-2 text-slate-400">...</span>
                  <Button variant="ghost" className="w-10 h-10 rounded-lg text-slate-600 font-medium hover:bg-slate-100">12</Button>
                </div>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg text-slate-500 hover:bg-slate-50">&gt;</Button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
