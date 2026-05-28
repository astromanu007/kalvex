"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  Tag, Shield, Truck, CreditCard,
  ShoppingCart, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

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
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("kalvex_cart");
      if (stored) {
        const items = JSON.parse(stored);
        if (Array.isArray(items)) setCart(items);
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

  const removeItem = (id: string) => {
    setCart((c) => {
      const filtered = c.filter((item) => item.id !== id);
      localStorage.setItem("kalvex_cart", JSON.stringify(filtered));
      window.dispatchEvent(new Event("kalvex-cart-updated"));
      return filtered;
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
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal - discount + shipping;

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
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 font-sans">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        
        {/* Test Marquee Banner */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-indigo-500 to-blue-600 p-[2px] shadow-lg shadow-blue-500/10">
          <div className="bg-[#0f172a] rounded-[14px] py-4 px-6 relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center text-[10px] font-black text-white tracking-[0.2em] uppercase space-x-8">
              <span>✨ TEST UPDATE VERIFICATION: Mark thank you so much for your order ✨ &nbsp;&nbsp;&nbsp;</span>
              <span>✨ TEST UPDATE VERIFICATION: Mark thank you so much for your order ✨ &nbsp;&nbsp;&nbsp;</span>
            </div>
            <div className="absolute top-4 animate-marquee2 whitespace-nowrap flex items-center text-[10px] font-black text-white tracking-[0.2em] uppercase space-x-8">
              <span>✨ TEST UPDATE VERIFICATION: Mark thank you so much for your order ✨ &nbsp;&nbsp;&nbsp;</span>
              <span>✨ TEST UPDATE VERIFICATION: Mark thank you so much for your order ✨ &nbsp;&nbsp;&nbsp;</span>
            </div>
          </div>
        </div>

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
                <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        variants={fadeUp}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm border border-slate-100/60 transition-all hover:shadow-md"
                      >
                        {/* Item Icon */}
                        <div className="w-24 h-24 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-8 h-8 text-slate-300" />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 self-start mt-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">
                            {item.sku}
                          </p>
                          <h3 className="font-black text-blue-600 text-xl tracking-tight leading-tight truncate mb-3">
                            {item.name}
                          </h3>
                          <div className="inline-flex">
                            <span className="bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Price & Controls */}
                        <div className="flex flex-col items-end gap-6 sm:self-start mt-2">
                          <p className="font-black text-slate-900 text-2xl tracking-tighter">
                            ₹{(item.price * (item.qty || 1)).toLocaleString()}
                          </p>
                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-black text-slate-900">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Trust Badges - Desktop Row, Mobile Column */}
                <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {[
                    { icon: Shield, title: "AUTHORIZED SECURE GATEWAY", sub: "AES-256 PROTOCOL" },
                    { icon: Truck, title: "INSTITUTIONAL LOGISTICS", sub: "PRIORITY GROUND SHIPPING" },
                    { icon: Tag, title: "KALVEX10 RESEARCH GRANT", sub: "10% INSTITUTIONAL DISCOUNT" },
                  ].map((badge, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      className="bg-white rounded-[1.5rem] p-5 flex items-center gap-4 shadow-sm border border-slate-100/60"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <badge.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-900 leading-tight">
                          {badge.title}
                        </p>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {badge.sub}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right Column (Statement of Accounts) */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-28">
                
                <h2 className="font-black text-2xl text-slate-900 tracking-tight mb-1">
                  Statement of <span className="text-blue-600">Accounts</span>
                </h2>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                  PROCUREMENT SUMMARY
                </p>

                <div className="space-y-5 mb-8">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>Base Assessment</span>
                    <span className="text-slate-900 font-black">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-sm font-bold text-blue-600">
                      <span>Research Grant</span>
                      <span className="font-black">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>Strategic Logistics</span>
                    <span className="text-slate-900 font-black">₹{shipping.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 mb-8">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                    TOTAL LIABILITY
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">
                      ₹{total.toLocaleString()}
                    </span>
                    <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      INR
                    </span>
                  </div>
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
                          : "bg-[#0f172a] hover:bg-slate-800 text-white"
                      }`}
                    >
                      {couponApplied ? "APPLIED" : "VALIDATE"}
                    </button>
                  </div>
                  <AnimatePresence>
                    {couponError && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-2">
                        INVALID OR EXPIRED TOKEN
                      </motion.p>
                    )}
                    {couponApplied && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-2 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> TOKEN ACCEPTED
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/checkout" className="block w-full">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-[#0f172a] hover:bg-slate-800 text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 transition-all group"
                  >
                    PROCEED TO SECURE SETTLEMENT
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                <p className="text-center text-[7px] font-black uppercase tracking-widest text-slate-300 mt-5 leading-relaxed px-4">
                  BY FINALIZING, YOU ACKNOWLEDGE THE INSTITUTIONAL PROTOCOL AND SECURE DATA POLICY.
                </p>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
