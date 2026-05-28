"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle, Loader2, Sparkles, MapPin, ArrowRight, Shield } from "lucide-react";
import { getOrders, updateOrderStatus, createOrder } from "@/app/actions/orders";
import { createPaymentOrder, verifyPayment } from "@/app/actions/payments";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

type Step = "address" | "payment" | "confirm";

function CheckoutContent() {
  const [step, setStep] = useState<Step>("address");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [address, setAddress] = useState({
    name: "", phone: "", pincode: "", address: "", city: "", state: "", landmark: "",
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      const res = await getOrders();
      if (res.orders) {
        const found = res.orders.find((o: any) => o.id === orderId);
        if (found) setOrder(found);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  const [orderTotal, setOrderTotal] = useState(14399);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (order) {
      setOrderTotal(order.amount);
    } else {
      try {
        const stored = localStorage.getItem("kalvex_cart");
        if (stored) {
          const items = JSON.parse(stored);
          if (Array.isArray(items) && items.length > 0) {
            setCartItems(items);
            const subtotal = items.reduce((acc, item: any) => acc + (item.price || 0) * (item.qty || 1), 0);
            const discount = subtotal > 5000 ? Math.round(subtotal * 0.1) : 0;
            const shipping = subtotal > 5000 ? 0 : 150;
            setOrderTotal(subtotal - discount + shipping);
          }
        }
      } catch (err) {
        console.error("Failed to calculate cart total:", err);
      }
    }
  }, [order]);

  const handlePayment = async () => {
    setProcessing(true);
    let activeOrder = order;

    try {
      if (!activeOrder) {
        // Load the actual cart items dynamically
        let cartItemsText = "NO ITEMS FOUND";
        try {
          const stored = localStorage.getItem("kalvex_cart");
          if (stored) {
            const items = JSON.parse(stored);
            if (Array.isArray(items) && items.length > 0) {
              cartItemsText = items
                .map((item: any) => `- ${item.name} (${item.sku}) x ${item.qty || 1} — ₹${((item.price || 0) * (item.qty || 1)).toLocaleString()}`)
                .join("\n");
            }
          }
        } catch (err) {
          console.error("Failed to parse cart items:", err);
        }

        // Construct the detailed order description with both sourced components and shipping destination
        const requirementsText = `ITEMS PURCHASED:
${cartItemsText}

SHIPPING DESTINATION DETAILS:
Name: ${address.name || "N/A"}
Phone: ${address.phone || "N/A"}
Address: ${address.address || "N/A"}, ${address.city || "N/A"}, ${address.state || "N/A"}
Pincode: ${address.pincode || "N/A"}
Landmark: ${address.landmark || "N/A"}`;

        const createRes = await createOrder({
          serviceType: "CUSTOM_PROJECT", // Using CUSTOM_PROJECT for components store orders
          requirements: requirementsText,
          amount: orderTotal,
        });

        if (createRes.error || !createRes.orderId) {
          alert(createRes.error || "Failed to register your procurement request.");
          setProcessing(false);
          return;
        }

        activeOrder = {
          id: createRes.orderId,
          orderNumber: createRes.orderNumber,
          amount: orderTotal,
          serviceType: "CUSTOM_PROJECT"
        };
      }

      const paymentOrder = await createPaymentOrder(activeOrder.amount, activeOrder.id);
      if (!paymentOrder.success) {
        alert("Failed to initiate payment. Please try again.");
        setProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SjepBzGtOTKoTN",
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "KALVEX LABS",
        description: `Order ${activeOrder.orderNumber} - ${activeOrder.serviceType}`,
        image: "/logo.png",
        order_id: paymentOrder.id,
        handler: async function (response: any) {
          const verifyRes = await verifyPayment(response, activeOrder.id);
          if (verifyRes.success) {
            await updateOrderStatus(activeOrder.id, "PAYMENT_CONFIRMED", "Payment successfully verified via Razorpay.");
            // Clear local storage cart
            try {
              localStorage.removeItem("kalvex_cart");
              window.dispatchEvent(new Event("kalvex-cart-updated"));
            } catch (err) {
              console.error("Failed to clear cart:", err);
            }
            setDone(true);
          } else {
            alert("Payment verification failed.");
          }
          setProcessing(false);
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert(response.error.description);
        setProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment gateway.");
      setProcessing(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-slate-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-xl w-full bg-white border border-slate-100 rounded-[3rem] p-16 text-center space-y-8 shadow-2xl shadow-slate-900/5"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto border border-emerald-100 relative">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20" />
          </div>
          <div>
            <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tighter mb-4">Order <span className="text-emerald-500">Confirmed</span></h1>
            <p className="text-slate-400 font-bold text-sm max-w-sm mx-auto leading-relaxed">
              Your order <span className="text-blue-600 font-black tracking-widest uppercase ml-1">#{order ? order.orderNumber : "ORD-007"}</span> is being processed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link href={order ? `/dashboard/orders/${order.id}` : "/dashboard/orders"} className="flex-1">
              <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-2xl h-16 font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/20">Track Order</Button>
            </Link>
            <Link href={order ? "/dashboard" : "/electronics"} className="flex-1">
              <Button variant="outline" className="w-full border-slate-100 hover:border-blue-600/30 rounded-2xl h-16 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">{order ? "Go to Dashboard" : "Return to Store"}</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col justify-center items-center gap-4 bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading your order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex items-center gap-4 mb-16"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tighter">Secure <span className="text-blue-600">Payment</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Complete your purchase</p>
          </div>
        </motion.div>

        {/* Step Tabs */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex items-center gap-8 mb-16 overflow-x-auto pb-4 scrollbar-hide"
        >
          {(["address", "payment", "confirm"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-8 flex-shrink-0">
              <button
                onClick={() => { if ((s === "payment" || s === "confirm") && step === "address") return; setStep(s); }}
                className={`flex items-center gap-4 transition-all duration-500 ${step === s ? "opacity-100" : "opacity-30"}`}
              >
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black tracking-widest ${step === s ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "bg-white border border-slate-100 text-slate-400"}`}>{i + 1}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step === s ? "text-slate-900" : "text-slate-400"}`}>{s}</span>
              </button>
              {i < 2 && <div className="h-px w-12 bg-slate-200" />}
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Address */}
              {step === "address" && (
                <motion.div 
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-2xl shadow-slate-900/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight">Shipping Address</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { key: "name", label: "Full Name", type: "text", placeholder: "Rahul Sharma" },
                      { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                      { key: "pincode", label: "Pincode", type: "text", placeholder: "411057" },
                      { key: "city", label: "City", type: "text", placeholder: "Pune" },
                      { key: "state", label: "State", type: "text", placeholder: "Maharashtra" },
                      { key: "landmark", label: "Landmark (Optional)", type: "text", placeholder: "Near main gate" },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key} className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={address[key as keyof typeof address]}
                          onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2 space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Address</label>
                      <textarea
                        rows={3}
                        placeholder="Campus, Building No., Floor, Lab Reference"
                        value={address.address}
                        onChange={(e) => setAddress((a) => ({ ...a, address: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200 resize-none"
                      />
                    </div>
                  </div>
                  <Button onClick={() => setStep("payment")} className="w-full bg-slate-900 hover:bg-blue-600 text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/20 group">
                    Proceed to Payment <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === "payment" && (
                <motion.div 
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-2xl shadow-slate-900/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Shield className="w-5 h-5 text-slate-400" />
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight">Payment Verification</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: "upi", icon: Smartphone, label: "UPI (Instant)", sub: "PhonePe, Google Pay, etc." },
                      { id: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex" },
                      { id: "netbanking", icon: Building2, label: "Net Banking", sub: "All Indian Banks" },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`w-full flex items-center gap-6 p-6 rounded-2xl border transition-all duration-500 group ${paymentMethod === pm.id ? "border-blue-600 bg-blue-50/30 shadow-xl shadow-blue-600/5" : "border-slate-100 hover:border-slate-300 bg-white"}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${paymentMethod === pm.id ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}`}>
                          <pm.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{pm.label}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{pm.sub}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-4 transition-all ${paymentMethod === pm.id ? "border-blue-600 bg-white" : "border-slate-100"}`} />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 font-bold uppercase tracking-widest leading-relaxed">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    All transactions are protected by Razorpay&apos;s high-security payment standards.
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep("address")} className="flex-1 border-slate-100 rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Previous</Button>
                    <Button onClick={() => setStep("confirm")} className="flex-1 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all">Review Order</Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirm */}
              {step === "confirm" && (
                <motion.div 
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-2xl shadow-slate-900/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight">Review & Confirm</h2>
                  </div>

                  <div className="bg-slate-50 rounded-[2rem] border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                    {order ? (
                      <>
                        <div className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">{order.serviceType?.replace(/_/g, " ")}</span>
                          <span className="text-slate-900">₹{order.amount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">Platform Fee</span>
                          <span className="text-emerald-500">Waived</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">{item.name} × {item.qty || 1}</span>
                            <span className="text-slate-900">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                          </div>
                        ))}
                        {cartItems.length > 0 && cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0) > 5000 && (
                          <div className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest">
                            <span className="text-blue-600 font-black uppercase tracking-widest text-[10px]">Research Grant Application</span>
                            <span className="font-black text-blue-600">- ₹{(cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0) * 0.1).toLocaleString()}</span>
                          </div>
                        )}
                        {cartItems.length > 0 && (
                          <div className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Shipping</span>
                            <span className={cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0) > 5000 ? "text-emerald-500 font-black uppercase tracking-widest text-[10px]" : "text-slate-900"}>
                              {cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0) > 5000 ? "Free" : "₹150"}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex justify-between p-8 bg-slate-900 text-white items-end">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Total Amount</span>
                        <div className="text-4xl font-black tracking-tighter">₹{orderTotal.toLocaleString()}</div>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Price in INR</div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-20 rounded-[1.5rem] shadow-[0_24px_48px_-12px_rgba(37,99,235,0.3)] text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-500 group"
                  >
                    {processing ? <><Loader2 className="w-5 h-5 mr-4 animate-spin" /> Processing payment...</> : `Pay Now - ₹${orderTotal.toLocaleString()}`}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mini Order Summary */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="hidden lg:block"
          >
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 sticky top-32 shadow-2xl shadow-slate-900/5 space-y-8">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] pb-4 border-b border-slate-50">Order Summary</h3>
              <div className="space-y-4">
                {order ? (
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="truncate max-w-[150px]">{order.serviceType?.replace(/_/g, " ")}</span>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>{item.name} × {item.qty || 1}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total Amount</span>
                <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{orderTotal.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">Setting up secure checkout...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
