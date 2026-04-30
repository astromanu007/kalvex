import Link from "next/link";
import { Search, Filter, Heart, ShoppingCart, Sparkles, Box, Cpu, Zap, Monitor, Settings, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-widest text-blue-600">
              <Sparkles className="w-3 h-3" />
              Institutional Procurement
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl text-slate-900 tracking-tighter">
              Precision <span className="text-blue-600">Assets</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-lg">Sourcing military-grade components for high-stakes engineering and academic research.</p>
          </div>
          
          <div className="w-full lg:w-[480px] relative group">
            <input 
              type="text" 
              placeholder="Search components by SKU, Brand, or Spec..." 
              className="w-full bg-white border border-slate-200 rounded-3xl pl-14 pr-32 py-5 text-slate-900 font-bold focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 shadow-2xl shadow-slate-900/5"
            />
            <Search className="w-6 h-6 text-slate-300 absolute left-5 top-5 group-focus-within:text-blue-600 transition-colors" />
            <Button className="absolute right-2 top-2 h-11 px-8 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/20">
              Search Laboratory
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <motion.aside 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full lg:w-72 flex-shrink-0"
          >
            <div className="bg-white rounded-3xl p-8 sticky top-32 border border-slate-100 shadow-2xl shadow-slate-900/5">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 flex items-center">
                  <Filter className="w-4 h-4 mr-3 text-blue-600" /> Filters
                </h3>
                <button className="text-[10px] font-black text-blue-600 hover:text-slate-900 uppercase tracking-widest transition-colors">Reset</button>
              </div>

              <div className="mb-10">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-5">Categories</h4>
                <div className="space-y-4">
                  {CATEGORIES.map((cat, i) => (
                    <label key={i} className="flex items-center text-sm font-bold text-slate-500 cursor-pointer hover:text-blue-600 transition-colors group">
                      <input type="radio" name="category" className="mr-3 w-4 h-4 accent-blue-600 border-slate-200" defaultChecked={i===0} />
                      <span className="group-hover:translate-x-1 transition-transform">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-5">Price Range (₹)</h4>
                <div className="flex items-center gap-3 mb-6">
                  <input type="number" placeholder="Min" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-blue-600 outline-none" />
                  <span className="text-slate-300">—</span>
                  <input type="number" placeholder="Max" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-blue-600 outline-none" />
                </div>
                <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>

              <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-5">Availability</h4>
                <label className="flex items-center text-sm font-bold text-slate-500 cursor-pointer hover:text-blue-600 transition-colors group">
                  <input type="checkbox" className="mr-3 w-4 h-4 rounded-md border-slate-200 accent-blue-600" />
                  <span className="group-hover:translate-x-1 transition-transform">In Stock Only</span>
                </label>
              </div>
            </div>
          </motion.aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-10">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Inventory Status: <span className="text-slate-900">8 / 124 Units</span></p>
              <div className="flex items-center space-x-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sort:</span>
                <select className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:ring-4 ring-blue-600/5 outline-none cursor-pointer shadow-sm">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Technical Grade</option>
                </select>
              </div>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {PRODUCTS.map((p) => {
                const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                
                return (
                  <motion.div key={p.id} variants={fadeInUp} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 group hover:shadow-2xl hover:shadow-slate-900/10 hover:border-blue-600/20 transition-all duration-500 flex flex-col h-full relative">
                    {/* Image Area */}
                    <Link href={`/electronics/${p.id}`} className="block relative h-64 bg-slate-50 flex items-center justify-center overflow-hidden">
                      <div className="absolute top-6 left-6 z-10">
                        <span className="bg-white text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-100 shadow-sm">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <button className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:shadow-xl transition-all shadow-sm">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Placeholder for actual product image */}
                      <div className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-2xl shadow-slate-900/5">
                        {p.image === 'circuit' && <Cpu className="w-16 h-16 text-blue-600 opacity-20" />}
                        {p.image === 'cpu' && <Box className="w-16 h-16 text-blue-600 opacity-20" />}
                        {p.image === 'wifi' && <Zap className="w-16 h-16 text-blue-600 opacity-20" />}
                        {p.image === 'monitor' && <Monitor className="w-16 h-16 text-blue-600 opacity-20" />}
                        {p.image === 'settings' && <Settings className="w-16 h-16 text-blue-600 opacity-20" />}
                        {p.image === 'zap' && <Zap className="w-16 h-16 text-blue-600 opacity-20" />}
                        {p.image === 'battery' && <Battery className="w-16 h-16 text-blue-600 opacity-20" />}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="p-8 flex flex-col flex-grow">
                      <Link href={`/electronics/${p.id}`} className="group-hover:text-blue-600 transition-colors">
                        <h3 className="font-black text-slate-900 text-lg leading-tight mb-2 line-clamp-2" title={p.name}>{p.name}</h3>
                      </Link>
                      <div className="inline-flex text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 border border-slate-50 px-2 py-0.5 rounded-lg">{p.sku}</div>
                      
                      <div className="mt-auto">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="font-black text-slate-900 text-2xl tracking-tighter">₹{p.price.toLocaleString()}</span>
                          <span className="text-sm text-slate-300 line-through font-bold">₹{p.mrp.toLocaleString()}</span>
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">-{discount}%</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-50">
                          {p.stock > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Stock</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Backordered</span>
                            </div>
                          )}
                          
                          <Button 
                            disabled={p.stock === 0}
                            className={`flex-1 ${p.stock > 0 ? "bg-slate-900 hover:bg-blue-600 text-white shadow-xl shadow-slate-900/10" : "bg-slate-50 text-slate-300"} h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500`}
                          >
                            <ShoppingCart className="w-4 h-4 mr-3" /> Add to Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>div>

            {/* Pagination */}
            <div className="mt-20 flex justify-center">
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="w-12 h-12 rounded-xl border-slate-100 text-slate-400 font-black hover:bg-slate-50" disabled>&lt;</Button>
                <Button className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black shadow-xl shadow-slate-900/20">1</Button>
                <Button variant="outline" size="sm" className="w-12 h-12 rounded-xl border-slate-100 text-slate-400 font-black hover:bg-slate-50 transition-all">2</Button>
                <Button variant="outline" size="sm" className="w-12 h-12 rounded-xl border-slate-100 text-slate-400 font-black hover:bg-slate-50 transition-all">3</Button>
                <span className="px-4 text-slate-300 font-black tracking-widest">...</span>
                <Button variant="outline" size="sm" className="w-12 h-12 rounded-xl border-slate-100 text-slate-400 font-black hover:bg-slate-50 transition-all">12</Button>
                <Button variant="outline" size="sm" className="w-12 h-12 rounded-xl border-slate-100 text-slate-400 font-black hover:bg-slate-50 transition-all">&gt;</Button>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
