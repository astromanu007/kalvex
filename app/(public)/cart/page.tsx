"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Shield, Truck, Sparkles, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const INITIAL_CART = [
  { id: "c1", name: "Raspberry Pi 5 4GB RAM", sku: "KVX-SBC-005", price: 6500, qty: 2, category: "Development Boards" },
  { id: "c2", name: "HC-SR04 Ultrasonic Sensor × Pack of 5", sku: "KVX-SEN-004", price: 399, qty: 1, category: "Sensors" },
  { id: "c3", name: "0.96\" OLED Display I2C Module", sku: "KVX-DIS-096", price: 250, qty: 3, category: "Displays" },
];

export default function CartPage() {
  const [cart, setCart] = useState(INITIAL_CART);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setCart((c) => c.map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (id: string) => setCart((c) => c.filter((item) => item.id !== id));

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex items-center gap-4 mb-12"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tighter">Your <span className="text-blue-600">Inventory</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Review your procurement request</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-900/5"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                <ShoppingBag className="w-10 h-10 text-slate-200" />
              </div>
              <h2 className="font-black text-2xl text-slate-900 mb-3 tracking-tight">Your request is currently empty</h2>
              <p className="text-slate-400 font-bold text-sm mb-10 max-w-sm mx-auto">Initialize your engineering build by sourcing high-performance components from our laboratory.</p>
              <Link href="/electronics">
                <Button className="bg-slate-900 hover:bg-blue-600 text-white rounded-2xl h-14 px-10 font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/20">
                  Access Laboratory Store
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col sm:flex-row gap-8 items-center group hover:border-blue-600/20 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-900/5"
                    >
                      {/* Placeholder image */}
                      <div className="w-28 h-28 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                        <CreditCard className="w-10 h-10 text-slate-200" />
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3 border border-slate-50 px-3 py-1 rounded-full">{item.sku}</div>
                        <h3 className="font-black text-slate-900 text-xl mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                        <p className="text-[10px] font-black text-blue-600 bg-blue-50/50 px-3 py-1 inline-block rounded-lg tracking-widest uppercase">{item.category}</p>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-6 flex-shrink-0 w-full sm:w-auto">
                        <p className="font-black text-slate-900 text-2xl tracking-tighter">₹{(item.price * item.qty).toLocaleString()}</p>
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1 shadow-sm">
                          <button onClick={() => updateQty(item.id, -1)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:text-blue-600 transition-all">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center text-sm font-black text-slate-900">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:text-blue-600 transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-200 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Trust Badges */}
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
                >
                  {[
                    { icon: Shield, text: "Authorized Secure Gateway", sub: "AES-256 Protocol" },
                    { icon: Truck, text: "Institutional Logistics", sub: "Priority Ground Shipping" },
                    { icon: Tag, text: "KALVEX10 Research Grant", sub: "10% Institutional Discount" },
                  ].map((b) => (
                    <div key={b.text} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-5 group hover:bg-slate-50 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                        <b.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{b.text}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{b.sub}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="lg:col-span-1"
              >
                <div className="bg-white border border-slate-100 rounded-[3rem] p-10 sticky top-32 shadow-2xl shadow-slate-900/5 space-y-10">
                  <div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight mb-2">Statement of <span className="text-blue-600">Accounts</span></h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Procurement Summary</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold">Base Assessment</span>
                      <span className="font-black text-slate-900">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-600 font-black uppercase tracking-widest text-[10px]">Research Grant Application</span>
                        <span className="font-black text-blue-600">- ₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold">Strategic Logistics</span>
                      <span className={shipping === 0 ? "text-emerald-500 font-black uppercase tracking-widest text-[10px]" : "font-black text-slate-900"}>
                        {shipping === 0 ? "Complimentary" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="pt-8 border-t border-slate-50 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Liability</span>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">₹{total.toLocaleString()}</div>
                      </div>
                      <div className="bg-blue-50 px-3 py-1 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">INR</div>
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Authorization Token</p>
                    <div className="flex gap-3">
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-200"
                        disabled={couponApplied}
                      />
                      <Button
                        onClick={() => { if (coupon === "KALVEX10") setCouponApplied(true); }}
                        disabled={couponApplied}
                        className="bg-slate-900 hover:bg-blue-600 text-white rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        {couponApplied ? "✓" : "Validate"}
                      </Button>
                    </div>
                    {couponApplied && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <Sparkles className="w-3 h-3" /> Token Accepted — 10% Research Grant Applied
                      </motion.p>
                    )}
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white shadow-xl shadow-slate-900/20 h-16 rounded-2xl font-black text-[11px] uppercase tracking-widest gap-4 group transition-all duration-500">
                      Proceed to Secure Settlement <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <div className="text-[9px] text-slate-300 text-center font-black uppercase tracking-widest leading-relaxed">
                    By finalizing, you acknowledge the <Link href="/terms" className="text-slate-400 hover:text-blue-600 transition-colors">Institutional Protocol</Link> and <Link href="/privacy" className="text-slate-400 hover:text-blue-600 transition-colors">Secure Data Policy</Link>.
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
