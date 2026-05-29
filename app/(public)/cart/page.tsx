"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  Tag, Shield, Truck, CreditCard,
  ShoppingCart, Sparkles, Bookmark, FileText, CheckCircle2, Package, Box
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { QuotationPDF } from "@/components/cart/QuotationPDF";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { data: session } = useSession();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("kalvex_cart");
      if (stored) {
        const items = JSON.parse(stored);
        if (Array.isArray(items)) setCart(items);
      }
      const saved = localStorage.getItem("kalvex_saved");
      if (saved) {
        const savedItems = JSON.parse(saved);
        if (Array.isArray(savedItems)) setSavedItems(savedItems);
      }
    } catch (err) { console.error(err); }
  }, []);

  const updateQty = (id: string, delta: number) => {
    setCart((c) => {
      const updated = c.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      );
      localStorage.setItem("kalvex_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("kalvex-cart-updated"));
      return updated;
    });
  };

  const updateProject = (id: string, project: string) => {
    setCart((c) => {
      const updated = c.map((item) =>
        item.id === id ? { ...item, project } : item
      );
      localStorage.setItem("kalvex_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setCart((c) => {
      const filtered = c.filter((item) => item.id !== id);
      localStorage.setItem("kalvex_cart", JSON.stringify(filtered));
      window.dispatchEvent(new Event("kalvex-cart-updated"));
      return filtered;
    });
  };

  const saveForLater = (id: string) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    removeItem(id);
    setSavedItems((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("kalvex_saved", JSON.stringify(updated));
      return updated;
    });
  };

  const moveToCart = (id: string) => {
    const item = savedItems.find(i => i.id === id);
    if (!item) return;
    setSavedItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem("kalvex_saved", JSON.stringify(updated));
      return updated;
    });
    setCart((c) => {
      const updated = [...c, item];
      localStorage.setItem("kalvex_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("kalvex-cart-updated"));
      return updated;
    });
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "KALVEX10") {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponError(true);
      setCouponApplied(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = 0; // Logistics removed
  const total = subtotal - discount + shipping;

  const getCategoryGroup = (category?: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("project") || cat.includes("robotics") || cat.includes("machine learning") || cat.includes("system") || cat.includes("ai")) return "Projects & Complete Systems";
    if (cat.includes("service") || cat.includes("consulting") || cat.includes("support") || cat.includes("maintenance")) return "Services & Support";
    return "Hardware & Components";
  };

  const groupedCart = cart.reduce((acc, item) => {
    const group = getCategoryGroup(item.category);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Sorting groups so Hardware & Components is usually first
  const groupOrder = ["Hardware & Components", "Projects & Complete Systems", "Services & Support"];
  const sortedGroups = (Object.entries(groupedCart) as [string, any[]][]).sort(([a], [b]) => {
    return groupOrder.indexOf(a) - groupOrder.indexOf(b);
  });

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border-4 border-blue-600/20 border-t-blue-600 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans relative overflow-hidden">
      
      {/* Professional Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
      
      {/* Cursor Reactive Spotlight */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        animate={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59,130,246,0.06), transparent 40%)`
        }}
      />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-5 mb-12">
          <div className="w-14 h-14 rounded-[1rem] bg-white flex items-center justify-center shadow-sm border border-slate-100">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
              Your <span className="text-blue-600">Inventory</span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mt-1">
              REVIEW YOUR PROCUREMENT REQUEST
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
            /* Empty State */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="max-w-lg mx-auto text-center mt-20"
            >
              <div className="bg-white rounded-[2.5rem] p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-8 border border-slate-100">
                  <ShoppingCart className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="font-black text-2xl text-slate-900 mb-3 tracking-tight">Inventory Empty</h2>
                <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
                  Your procurement request has no items.
                </p>
                <Link href="/electronics">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#0f172a] hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20"
                  >
                    Add Equipment
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Main Content Grid */
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              
              {/* Left Column (Items & Trust Badges) */}
              <div className="space-y-6">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-10">
                  {sortedGroups.map(([groupName, items]) => (
                    <div key={groupName} className="space-y-4">
                      <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em] mb-2 flex items-center gap-2 pl-2">
                        {groupName} <span className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[8px] font-bold pb-px">i</span>
                      </h3>
                      <div className="space-y-4">
                        <AnimatePresence>
                          {items.map((item, index) => (
                              <motion.div
                              key={item.id}
                              layout
                              variants={fadeUp}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              whileHover={{ y: -4, scale: 1.01 }}
                              className="group relative rounded-[2rem] p-[1px] transition-all hover:shadow-xl hover:shadow-blue-500/10"
                            >
                              {/* Colorful Animated Border */}
                              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              <div className="relative bg-white rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm border border-slate-100/60 group-hover:border-transparent transition-all h-full">
                              {/* Item Icon or Image */}
                              <div className="w-24 h-24 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                  <CreditCard className="w-8 h-8 text-slate-300" />
                                )}
                              </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 self-start mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              {item.sku || "KVX-EQP-001"}
                            </p>
                            <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> In Stock
                            </span>
                          </div>
                          <h3 className="font-black text-slate-900 text-lg tracking-tight leading-tight truncate mb-1">
                            {item.name}
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">{item.category} • Professional Grade</p>
                          
                          {/* Project Tagging */}
                          <div className="mb-3">
                            <input 
                              type="text" 
                              placeholder="Assign to Project (e.g. Robotics Lab)" 
                              value={item.project || ""}
                              onChange={(e) => updateProject(item.id, e.target.value)}
                              className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-full max-w-[250px] focus:outline-none focus:border-blue-300 transition-colors placeholder:text-slate-300"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                              {item.category}
                            </span>
                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                              <Truck className="w-3.5 h-3.5" /> Est. Delivery: 3-5 Days
                            </span>
                          </div>
                        </div>

                        {/* Price & Controls */}
                        <div className="flex flex-col items-end justify-between sm:self-stretch mt-2 sm:mt-0">
                          <div className="flex gap-2 mb-4 sm:mb-0">
                            <button
                              onClick={() => saveForLater(item.id)}
                              className="text-slate-300 hover:text-blue-500 transition-colors p-1 group/save"
                              title="Save for Later"
                            >
                              <Bookmark className="w-4 h-4 group-hover/save:fill-blue-500" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-1"
                              title="Remove Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                              <p className="font-black text-slate-900 text-xl tracking-tighter">
                                ₹{(item.price * (item.qty || 1)).toLocaleString()}
                              </p>
                              <p className="font-bold text-slate-400 text-xs line-through">
                                ₹{Math.round((item.price * 1.2) * (item.qty || 1)).toLocaleString()}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQty(item.id, -1)}
                                className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all"
                              >
                                <Minus className="w-4 h-4" />
                              </motion.button>
                              <div className="w-5 flex justify-center overflow-hidden">
                                <AnimatePresence mode="popLayout">
                                  <motion.span
                                    key={item.qty}
                                    initial={{ y: -15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 15, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="text-sm font-black text-slate-900 inline-block"
                                  >
                                    {item.qty}
                                  </motion.span>
                                </AnimatePresence>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQty(item.id, 1)}
                                className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all"
                              >
                                <Plus className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                        </div>
                      </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Saved for Later Section */}
                <AnimatePresence>
                  {savedItems.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-12 pt-8 border-t border-slate-200">
                      <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-blue-500 fill-blue-500/20" /> Saved for Later ({savedItems.length})
                      </h3>
                      <div className="space-y-4">
                        {savedItems.map((item) => (
                          <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Package className="w-5 h-5 text-slate-300" />
                              </div>
                              <div>
                                <h4 className="font-black text-slate-800 text-sm truncate max-w-[200px] sm:max-w-[300px]">{item.name}</h4>
                                <p className="font-bold text-slate-400 text-[10px]">₹{item.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => moveToCart(item.id)} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors">
                                Move to Cart
                              </button>
                              <button onClick={() => setSavedItems(p => { const nv = p.filter(i => i.id !== item.id); localStorage.setItem("kalvex_saved", JSON.stringify(nv)); return nv; })} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Frequently Bought Together */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" /> Frequently Bought Together
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "xtra-1", name: "High-Speed Data Acquisition Cable", price: 2500, category: "Accessories" },
                      { id: "xtra-2", name: "Calibration Sensor Kit V2", price: 12500, category: "Sensors" }
                    ].map(extra => (
                      <div key={extra.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full gap-4">
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-blue-500 mb-1">{extra.category}</p>
                          <h4 className="font-black text-slate-800 text-sm">{extra.name}</h4>
                          <p className="font-bold text-slate-500 mt-1">₹{extra.price.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setCart(c => {
                              const exists = c.find(i => i.id === extra.id);
                              let nv;
                              if (exists) nv = c.map(i => i.id === extra.id ? { ...i, qty: i.qty + 1 } : i);
                              else nv = [...c, { ...extra, qty: 1, sku: `KVX-ACC-${Math.floor(Math.random()*1000)}` }];
                              localStorage.setItem("kalvex_cart", JSON.stringify(nv));
                              window.dispatchEvent(new Event("kalvex-cart-updated"));
                              return nv;
                            });
                          }}
                          className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3 h-3" /> Quick Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column (Statement of Accounts) */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} className="sticky top-28 group relative rounded-[2.5rem] p-[2px] transition-all hover:shadow-2xl hover:shadow-blue-500/10">
                {/* Colorful Animated Border */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-blue-500 via-rose-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 group-hover:border-transparent transition-all h-full flex flex-col">
                <h2 className="font-black text-xl text-slate-900 tracking-tight text-center mb-10 uppercase">
                  CART
                </h2>
                
                <div className="bg-teal-50 text-teal-600 px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest mb-8">
                  <Truck className="w-4 h-4" /> Estimated order delivery time: 15 min
                </div>

                <div className="space-y-4 mb-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex justify-between items-center">
                    <span>{cart.length} Items</span>
                    <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span>You save</span>
                      <span className="text-slate-900">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-slate-900">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 border-t border-slate-200 pt-6">
                  <span className="text-sm font-black uppercase tracking-widest text-slate-900">
                    TOTAL
                  </span>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                    AUTHORIZATION TOKEN
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(false); }}
                      placeholder="ENTER CODE"
                      disabled={couponApplied}
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all h-12"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponApplied}
                      className={`px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        couponApplied
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {couponApplied ? "APPLIED" : "ADD COUPON"}
                    </button>
                  </div>
                  <AnimatePresence>
                    {couponError && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-2">
                        INVALID OR EXPIRED COUPON
                      </motion.p>
                    )}
                    {couponApplied && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-2 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> COUPON APPLIED
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-auto pt-4">
                  <Link href="/checkout" className="block w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black text-sm transition-all flex items-center justify-center shadow-lg shadow-blue-600/30"
                    >
                      Go to Checkout
                    </motion.button>
                  </Link>

                <div className="mt-3">
                  <PDFDownloadLink
                    document={<QuotationPDF items={cart} subtotal={subtotal} discount={discount} total={total} />}
                    fileName={`Kalvex_Quotation_${new Date().toISOString().split("T")[0]}.pdf`}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all group"
                  >
                    {({ loading }) => (
                      <>
                        <FileText className="w-4 h-4 text-blue-500" />
                        {loading ? "GENERATING PDF..." : "DOWNLOAD QUOTATION PDF"}
                      </>
                    )}
                  </PDFDownloadLink>
                </div>

                <p className="text-center text-[7px] font-black uppercase tracking-widest text-slate-300 mt-5 leading-relaxed px-4">
                  BY FINALIZING, YOU ACKNOWLEDGE THE INSTITUTIONAL PROTOCOL AND SECURE DATA POLICY.
                </p>

                </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
