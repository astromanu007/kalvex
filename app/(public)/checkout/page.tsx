"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { 
  ShieldCheck, CreditCard, Smartphone, Building2, 
  CheckCircle, Loader2, Sparkles, MapPin, 
  ArrowRight, Shield, LogIn, Check 
} from "lucide-react";
import { getOrders, updateOrderStatus, createOrder } from "@/app/actions/orders";
import { createBooking } from "@/app/actions/bookings";
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
  const { data: session, status: sessionStatus } = useSession();
  const [step, setStep] = useState<Step>("address");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [address, setAddress] = useState({
    name: "", phone: "", pincode: "", address: "", city: "", state: "", landmark: "",
  });

  const [orderTotal, setOrderTotal] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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

  const handleProceedToPayment = () => {
    if (!address.name || !address.phone || !address.pincode || !address.city || !address.state || !address.address) {
      setFormError("Please fill in all mandatory fields before proceeding.");
      return;
    }
    setFormError("");
    setStep("payment");
  };

  const handlePayment = async () => {
    setProcessing(true);
    let activeOrder = order;

    try {
      if (!activeOrder) {
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

        const requirementsText = `ITEMS PURCHASED:
${cartItemsText}

SHIPPING DESTINATION DETAILS:
Name: ${address.name}
Phone: ${address.phone}
Address: ${address.address}, ${address.city}, ${address.state}
Pincode: ${address.pincode}
Landmark: ${address.landmark || "N/A"}`;

        const createRes = await createOrder({
          serviceType: "CUSTOM_PROJECT",
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
        
        try {
          await createBooking({
            userId: session?.user?.id ?? "",
            serviceId: createRes.orderId,
            serviceType: "CUSTOM_PROJECT",
            requirements: requirementsText,
          });
        } catch (err) {
          console.error("Failed to create booking:", err);
        }
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay Checkout SDK. Please check your network connection.");
        setProcessing(false);
        return;
      }

      const paymentOrder = await createPaymentOrder(activeOrder.amount, activeOrder.id);
      if (!paymentOrder.success || !paymentOrder.id) {
        alert(paymentOrder.error || "Failed to initiate payment. Please try again.");
        setProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SjepBzGtOTKoTN",
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "KALVEX LABS",
        description: `Order ${activeOrder.orderNumber} - Component Procurement`,
        image: "/logo.png",
        order_id: paymentOrder.id,
        handler: async function (response: any) {
          const verifyRes = await verifyPayment(response, activeOrder.id);
          if (verifyRes.success) {
            await updateOrderStatus(activeOrder.id, "PAYMENT_CONFIRMED", "Payment successfully verified via Razorpay.");
            setOrder(activeOrder);
            try {
              localStorage.removeItem("kalvex_cart");
              window.dispatchEvent(new Event("kalvex-cart-updated"));
            } catch (err) {}
            setDone(true);
          } else {
            alert("Payment verification failed.");
          }
          setProcessing(false);
        },
        prefill: {
          name: address.name || session?.user?.name || "Customer",
          email: session?.user?.email || "customer@example.com",
          contact: address.phone || "",
        },
        theme: { color: "#4f46e5" },
        modal: { ondismiss: function () { setProcessing(false); } }
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
      <div className="min-h-screen pt-32 pb-24 bg-[#f8fafc] flex items-center justify-center px-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-xl w-full bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/50"
        >
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-100">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="font-black text-3xl text-slate-900 tracking-tight mb-3">
            Payment <span className="text-emerald-500">Successful!</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed mb-10">
            Order Reference: <span className="text-slate-800 font-black">{order ? order.orderNumber : "ORD-XXXXXX"}</span>
          </p>
          <div className="flex gap-4">
            <Link href={order ? `/dashboard/orders/${order.id}` : "/dashboard/orders"} className="flex-1">
              <button className="w-full bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest transition-all">
                Track Order
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col justify-center items-center gap-4 bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading checkout...</p>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-[#f8fafc] flex items-center justify-center px-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center shadow-xl shadow-slate-200/50"
        >
          <div className="w-20 h-20 rounded-[1.5rem] bg-blue-50 flex items-center justify-center mx-auto border border-blue-100 mb-6">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="font-black text-3xl text-slate-900 tracking-tighter mb-3">Sign in to <span className="text-blue-600">Checkout</span></h1>
          <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto mb-8">
            Create an account or sign in to complete your procurement request.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => signIn("google", { callbackUrl: "/checkout" })}
              className="w-full bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3"
            >
              Continue with Google
            </button>
            <Link href="/login" className="block">
              <button className="w-full border border-slate-200 hover:border-blue-200 rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all bg-white">
                Sign in with Email
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const shipping = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0) > 5000 ? 0 : 150;
  
  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#f8fafc] font-sans">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex items-center gap-5 mb-14">
          <div className="w-14 h-14 rounded-[1rem] bg-white flex items-center justify-center shadow-sm border border-slate-100">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-black text-3xl sm:text-4xl text-slate-900 tracking-tighter">
              Secure <span className="text-blue-600">Payment</span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mt-1">
              COMPLETE YOUR PURCHASE
            </p>
          </div>
        </motion.div>

        {/* Stepper */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex items-center gap-4 sm:gap-6 mb-12">
          {(["address", "payment", "confirm"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                  step === s 
                    ? "bg-[#0f172a] text-white" 
                    : "bg-white text-slate-400 border border-slate-100"
                }`}>
                  {i + 1}
                </div>
                <span className={`hidden sm:inline-block text-[10px] font-black uppercase tracking-widest ${
                  step === s ? "text-slate-900" : "text-slate-300"
                }`}>
                  {s}
                </span>
              </div>
              {i < 2 && <div className="w-8 sm:w-16 h-px bg-slate-200" />}
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {/* Step 1: Address */}
              {step === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight">Shipping Address</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                      { key: "name", label: "FULL NAME", type: "text", placeholder: "Rahul Sharma" },
                      { key: "phone", label: "PHONE NUMBER", type: "tel", placeholder: "+91 98765 43210" },
                      { key: "pincode", label: "PINCODE", type: "text", placeholder: "411057" },
                      { key: "city", label: "CITY", type: "text", placeholder: "Pune" },
                      { key: "state", label: "STATE", type: "text", placeholder: "Maharashtra" },
                      { key: "landmark", label: "LANDMARK (OPTIONAL)", type: "text", placeholder: "Near main gate" },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key} className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={address[key as keyof typeof address]}
                          onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 h-14 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">FULL ADDRESS</label>
                      <textarea
                        rows={3}
                        placeholder="Campus, Building No., Floor, Lab Reference"
                        value={address.address}
                        onChange={(e) => setAddress((a) => ({ ...a, address: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300 resize-none"
                      />
                    </div>
                  </div>

                  {formError && (
                    <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {formError}
                    </div>
                  )}
                  
                  <button onClick={handleProceedToPayment} className="w-full bg-[#0f172a] hover:bg-slate-800 text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3">
                    PROCEED TO PAYMENT <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Shield className="w-5 h-5 text-slate-400" />
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight">Payment Verification</h2>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      { id: "upi", icon: Smartphone, label: "UPI (INSTANT)", sub: "PHONEPE, GOOGLE PAY, ETC." },
                      { id: "card", icon: CreditCard, label: "CREDIT / DEBIT CARD", sub: "VISA, MASTERCARD, AMEX" },
                      { id: "netbanking", icon: Building2, label: "NET BANKING", sub: "ALL INDIAN BANKS" },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`w-full flex items-center gap-5 p-5 rounded-2xl border transition-all ${
                          paymentMethod === pm.id 
                            ? "border-blue-500 bg-blue-50/50" 
                            : "border-slate-100 bg-white hover:border-slate-200"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          paymentMethod === pm.id ? "bg-blue-500 text-white" : "bg-slate-50 text-slate-400"
                        }`}>
                          <pm.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1.5">{pm.label}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{pm.sub}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-[6px] transition-colors ${
                          paymentMethod === pm.id ? "border-blue-500 bg-white" : "border-slate-100 bg-white"
                        }`} />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      ALL TRANSACTIONS ARE PROTECTED BY RAZORPAY&apos;S HIGH-SECURITY PAYMENT STANDARDS.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setStep("address")} className="flex-1 bg-white border border-slate-100 hover:border-slate-300 text-slate-400 hover:text-slate-600 rounded-2xl h-16 font-black text-[10px] uppercase tracking-widest transition-all">
                      PREVIOUS
                    </button>
                    <button onClick={() => setStep("confirm")} className="flex-[2] bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl h-16 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all">
                      REVIEW ORDER
                    </button>
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
                  className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight">Review & Confirm</h2>
                  </div>

                  <div className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden mb-8">
                    {order ? (
                      <div className="p-6 text-[10px] font-black uppercase tracking-widest flex justify-between">
                        <span className="text-slate-500">{order.serviceType?.replace(/_/g, " ")}</span>
                        <span className="text-slate-900">₹{order.amount?.toLocaleString()}</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-6 space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                              <span className="text-slate-500">{item.name} × {item.qty || 1}</span>
                              <span className="text-slate-900">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-500">SHIPPING</span>
                            <span className="text-slate-900">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="bg-[#0f172a] p-8 text-white flex justify-between items-end rounded-b-[1.8rem]">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">TOTAL AMOUNT</p>
                        <p className="text-4xl font-black tracking-tighter">₹{orderTotal.toLocaleString()}</p>
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 pb-1">PRICE IN INR</p>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white h-16 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3"
                  >
                    {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSING PAYMENT...</> : `PAY NOW - ₹${orderTotal.toLocaleString()}`}
                  </button>
                  <button 
                    onClick={() => setStep("payment")} 
                    disabled={processing}
                    className="w-full mt-4 bg-white border border-slate-100 hover:border-slate-300 text-slate-400 hover:text-slate-600 rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    PREVIOUS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Order Summary */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="hidden lg:block sticky top-28">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">ORDER SUMMARY</h3>
              
              <div className="space-y-4 mb-6">
                {order ? (
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span className="truncate pr-4">{order.serviceType?.replace(/_/g, " ")}</span>
                    <span className="text-slate-900">₹{order.amount?.toLocaleString()}</span>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-4 text-[9px] font-black uppercase tracking-widest">
                      <span className="text-slate-400 leading-tight">{item.name} × {item.qty || 1}</span>
                      <span className="text-slate-900 flex-shrink-0">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
              
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">TOTAL AMOUNT</span>
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
    <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">Setting up secure checkout...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
