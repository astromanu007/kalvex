"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  Tag, Shield, Truck, Sparkles, CreditCard,
  Loader2, ShoppingCart, CheckCircle, Zap, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, useSession } from "next-auth/react";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const CATEGORY_COLORS: Record<string, { from: string; to: string; text: string }> = {
  "DEVELOPMENT BOARDS": { from: "#6366f1", to: "#8b5cf6", text: "white" },
  "SENSORS": { from: "#0ea5e9", to: "#06b6d4", text: "white" },
  "DISPLAYS": { from: "#f59e0b", to: "#ef4444", text: "white" },
  "COMMUNICATION": { from: "#10b981", to: "#059669", text: "white" },
  "POWER": { from: "#f43f5e", to: "#e11d48", text: "white" },
};
function getCategoryStyle(cat: string) {
  const key = (cat || "").toUpperCase();
  return CATEGORY_COLORS[key] || { from: "#334155", to: "#475569", text: "white" };
}

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
  const shipping = subtotal > 5000 ? 0 : 149;
  const total = subtotal - discount + shipping;

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border-4 border-blue-600/20 border-t-blue-600 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f7] pt-28 pb-20">

      {/* ── Page Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/25">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
              Your <span className="text-blue-600">Cart</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mt-0.5">
              {cart.length} item{cart.length !== 1 ? "s" : ""} · Electronics Store
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {cart.length === 0 ? (
          /* ── Empty State ── */
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="max-w-lg mx-auto px-4 text-center"
          >
            <div className="bg-white rounded-[3rem] p-16 shadow-2xl shadow-slate-900/5 border border-slate-100/60">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ShoppingCart className="w-10 h-10 text-slate-200" />
              </div>
              <h2 className="font-black text-2xl text-slate-900 mb-3 tracking-tight">Cart is Empty</h2>
              <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
                Add components from our electronics laboratory to get started.
              </p>
              <Link href="/electronics">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/20"
                >
                  Browse Electronics Store
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* ── Main Layout ── */
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">

              {/* ──────────── LEFT: Cart Items ──────────── */}
              <div className="space-y-4">
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                  <AnimatePresence>
                    {cart.map((item, index) => {
                      const catStyle = getCategoryStyle(item.category);
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          variants={fadeUp}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className="group bg-white rounded-[2rem] border border-slate-100/80 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-500"
                        >
                          <div className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6">

                            {/* Product icon */}
                            <div
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg"
                              style={{ background: `linear-gradient(135deg, ${catStyle.from}, ${catStyle.to})` }}
                            >
                              <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-white/90" />
                            </div>

                            {/* Item info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                  {item.sku}
                                </span>
                              </div>
                              <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300 truncate">
                                {item.name}
                              </h3>
                              <div className="mt-1.5 inline-flex items-center gap-1.5">
                                <span
                                  className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                                  style={{
                                    background: `linear-gradient(135deg, ${catStyle.from}15, ${catStyle.to}15)`,
                                    color: catStyle.from,
                                    border: `1px solid ${catStyle.from}25`
                                  }}
                                >
                                  {item.category}
                                </span>
                              </div>
                            </div>

                            {/* Price + controls */}
                            <div className="flex flex-col items-end gap-3 flex-shrink-0">
                              <p className="font-black text-slate-900 text-xl sm:text-2xl tracking-tighter">
                                ₹{(item.price * (item.qty || 1)).toLocaleString()}
                              </p>

                              {/* Qty control */}
                              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1">
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-sm font-black text-slate-900">{item.qty}</span>
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Delete */}
                              <button
                                onClick={() => removeItem(item.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-200 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* ── Trust Badges ── */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2"
                >
                  {[
                    { icon: Shield, title: "Secure Gateway", sub: "AES-256 Encrypted", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                    { icon: Truck,  title: "Fast Delivery",   sub: "2–5 Business Days",  color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                    { icon: Tag,    title: "KALVEX10",         sub: "10% off on ₹500+",   color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
                  ].map((b) => (
                    <motion.div
                      key={b.title}
                      variants={fadeUp}
                      className={`bg-white border ${b.border} rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${b.bg} flex items-center justify-center flex-shrink-0`}>
                        <b.icon className={`w-4 h-4 ${b.color}`} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${b.color}`}>{b.title}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{b.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* ──────────── RIGHT: Order Summary ──────────── */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="xl:sticky xl:top-28 h-fit"
              >
                {/* Dark card */}
                <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/30">

                  {/* Header */}
                  <div className="p-7 pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="font-black text-white text-xl tracking-tight">Order Summary</h2>
                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Secure</span>
                      </div>
                    </div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                      {cart.length} item{cart.length !== 1 ? "s" : ""} · Electronics
                    </p>
                  </div>

                  {/* Line items */}
                  <div className="p-7 space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-3">
                        <span className="text-sm text-white/60 font-medium leading-snug flex-1 line-clamp-1">
                          {item.name} <span className="text-white/30">×{item.qty}</span>
                        </span>
                        <span className="text-sm font-black text-white flex-shrink-0">
                          ₹{(item.price * (item.qty || 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mx-7 h-px bg-white/10" />

                  {/* Totals */}
                  <div className="p-7 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50 font-medium">Subtotal</span>
                      <span className="font-black text-white">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Coupon KALVEX10
                        </span>
                        <span className="font-black text-emerald-400">−₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50 font-medium">Shipping</span>
                      <span className={`font-black ${shipping === 0 ? "text-emerald-400 text-[10px] uppercase tracking-widest" : "text-white"}`}>
                        {shipping === 0 ? "Free" : `₹${shipping}`}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="pt-4 mt-2 border-t border-white/10">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Total Payable</p>
                          <p className="font-black text-4xl text-white tracking-tighter">₹{total.toLocaleString()}</p>
                        </div>
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">INR</span>
                      </div>
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="px-7 pb-5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Promo Code</p>
                    <div className="flex gap-2">
                      <input
                        value={coupon}
                        onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(false); }}
                        placeholder="ENTER CODE"
                        disabled={couponApplied}
                        className="flex-1 bg-white/10 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponApplied}
                        className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          couponApplied
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
                        }`}
                      >
                        {couponApplied ? <CheckCircle className="w-4 h-4" /> : "Apply"}
                      </button>
                    </div>
                    <AnimatePresence>
                      {couponError && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[9px] text-red-400 font-black uppercase tracking-widest mt-2"
                        >
                          Invalid code. Try KALVEX10
                        </motion.p>
                      )}
                      {couponApplied && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mt-2 flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3" /> 10% discount applied!
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CTA */}
                  <div className="px-7 pb-7">
                    <Link href="/checkout">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white h-16 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/40 transition-all duration-300"
                      >
                        <Lock className="w-4 h-4 opacity-70" />
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>

                    {/* Accepted payment methods */}
                    <div className="mt-5 flex items-center justify-center gap-3">
                      {["UPI", "VISA", "MC", "RZP"].map((m) => (
                        <div key={m} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[8px] font-black text-white/30 uppercase tracking-widest">
                          {m}
                        </div>
                      ))}
                    </div>

                    <p className="text-center text-[8px] text-white/20 font-bold uppercase tracking-widest mt-3 leading-relaxed">
                      Secured by Razorpay · 256-bit SSL
                    </p>
                  </div>
                </div>

                {/* Continue shopping */}
                <Link href="/electronics" className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                  <ArrowRight className="w-3 h-3 rotate-180" /> Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
