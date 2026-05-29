"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { 
  ShieldCheck, CreditCard, Smartphone, Building2, 
  CheckCircle, Loader2, Sparkles, MapPin, 
  ArrowRight, Shield, LogIn, Check, Truck, Globe 
} from "lucide-react";
import { getOrders, updateOrderStatus, createOrder } from "@/app/actions/orders";
import { createBooking } from "@/app/actions/bookings";
import { createPaymentOrder, verifyPayment } from "@/app/actions/payments";
import { motion, AnimatePresence } from "framer-motion";
import { STATE_DISTRICT_MAP } from "@/app/utils/locations";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};



type Step = "address" | "payment";

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
    name: "", phone: "", pincode: "", address: "", city: "", state: "", country: "India", landmark: "",
  });

  const [orderTotal, setOrderTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [shippingMode, setShippingMode] = useState("standard");
  const [shippingCost, setShippingCost] = useState(150);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [isFlipped, setIsFlipped] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
      try {
        const res = await getOrders();
        if (res?.orders) {
          const found = res.orders.find((o: any) => o.id === orderId);
          if (found) setOrder(found);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order) {
      setSubtotal(order.amount);
      setOrderTotal(order.amount);
    } else {
      try {
        const stored = localStorage.getItem("kalvex_cart");
        if (stored) {
          const items = JSON.parse(stored);
          if (Array.isArray(items) && items.length > 0) {
            setCartItems(items);
            const currentSubtotal = items.reduce((acc, item: any) => acc + (item.price || 0) * (item.qty || 1), 0);
            setSubtotal(currentSubtotal);
          }
        }
      } catch (err) {
        console.error("Failed to calculate cart total:", err);
      }
    }
  }, [order]);

  useEffect(() => {
    if (!order) {
      const discount = subtotal > 5000 ? Math.round(subtotal * 0.1) : 0;
      setOrderTotal(subtotal - discount + shippingCost);
    }
  }, [subtotal, shippingCost, order]);

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
Landmark: ${address.landmark || "N/A"}
Shipping Partner: ${shippingMode.toUpperCase()}`;

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
            setPaymentSuccess(true);
            setTimeout(() => {
              setDone(true);
            }, 2000);
          } else {
            alert("Payment verification failed.");
            setProcessing(false);
          }
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
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading checkout...</p>
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
          <div className="w-20 h-20 rounded-[2rem] bg-blue-50 flex items-center justify-center mx-auto border border-blue-100 mb-6">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="font-black text-3xl text-slate-900 tracking-tighter mb-3">Sign in to <span className="text-blue-600">Checkout</span></h1>
          <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto mb-8">
            Create an account or sign in to complete your procurement request.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => signIn("google", { callbackUrl: "/checkout" })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-16 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3"
            >
              Continue with Google
            </button>
            <Link href="/login" className="block">
              <button className="w-full border border-slate-200 hover:border-blue-200 rounded-full h-16 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all bg-white">
                Sign in with Email
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }


  
  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#f8fafc] font-sans">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex items-center gap-5 mb-14">
          <div className="w-14 h-14 rounded-[1.5rem] bg-white flex items-center justify-center shadow-sm border border-slate-100">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-black text-3xl sm:text-4xl text-slate-900 tracking-tighter">
              Secure <span className="text-blue-600">Payment</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mt-1">
              COMPLETE YOUR PURCHASE
            </p>
          </div>
        </motion.div>

        {/* Stepper */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex items-center gap-4 sm:gap-6 mb-12">
          {(["address", "payment"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                  step === s 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                    : "bg-white text-slate-400 border border-slate-100"
                }`}>
                  {i + 1}
                </div>
                <span className={`hidden sm:inline-block text-xs font-black uppercase tracking-widest ${
                  step === s ? "text-slate-900" : "text-slate-300"
                }`}>
                  {s}
                </span>
              </div>
              {i < 1 && (
                <div className="w-8 sm:w-16 h-px bg-slate-200 relative overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }} 
                    animate={{ x: step === "payment" ? "0%" : "-100%" }} 
                    transition={{ duration: 0.6, ease: "circOut" }} 
                    className="absolute inset-0 bg-blue-600" 
                  />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        <div className={step === "payment" ? "grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start" : "max-w-3xl mx-auto"}>
          
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
                      { key: "country", label: "COUNTRY", type: "select", options: ["India", "United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates", "Singapore"] },
                      { key: "state", label: "STATE / PROVINCE", type: "select", options: Object.keys(STATE_DISTRICT_MAP) },
                      { key: "city", label: "CITY / DISTRICT", type: "select", options: address.state ? STATE_DISTRICT_MAP[address.state] || [] : [] },
                      { key: "landmark", label: "LANDMARK (OPTIONAL)", type: "text", placeholder: "Near main gate" },
                    ].map(({ key, label, type, placeholder, options }) => (
                      <div key={key} className={`relative ${key === "landmark" ? "md:col-span-2" : ""}`}>
                        {type === "select" ? (
                          <div className="relative">
                            <select
                              value={address[key as keyof typeof address]}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (key === "state") {
                                  setAddress((a) => ({ ...a, state: val, city: "" }));
                                } else {
                                  setAddress((a) => ({ ...a, [key]: val }));
                                }
                              }}
                              className={`peer w-full bg-slate-50 border rounded-full px-6 pt-5 pb-1 h-14 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                                address[key as keyof typeof address] !== "" && address[key as keyof typeof address] !== "Select..."
                                  ? "border-blue-200 focus:ring-blue-200 bg-blue-50/30" 
                                  : "border-slate-100 focus:ring-blue-100 focus:border-blue-300"
                              }`}
                            >
                              <option value="" hidden></option>
                              {options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                              {address[key as keyof typeof address] && !options?.includes(address[key as keyof typeof address]) && (
                                <option value={address[key as keyof typeof address]}>{address[key as keyof typeof address]}</option>
                              )}
                            </select>
                            <label className={`absolute left-6 transition-all pointer-events-none font-black uppercase tracking-widest ${
                              address[key as keyof typeof address] 
                                ? "top-2 text-[8px] text-blue-500" 
                                : "top-1/2 -translate-y-1/2 text-[10px] text-slate-400"
                            }`}>
                              {label}
                            </label>
                            <div className="absolute top-1/2 right-6 -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <input
                              type={type}
                              placeholder=" "
                              value={address[key as keyof typeof address]}
                              onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                              className={`peer w-full bg-slate-50 border rounded-full px-6 pt-5 pb-1 h-14 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                                address[key as keyof typeof address] !== "" && key !== "landmark"
                                  ? "border-blue-200 focus:ring-blue-200 bg-blue-50/30" 
                                  : "border-slate-100 focus:ring-blue-100 focus:border-blue-300"
                              }`}
                            />
                            <label className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all pointer-events-none peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[8px] peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-[8px] peer-[:not(:placeholder-shown)]:text-blue-500">
                              {label}
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="md:col-span-2 relative">
                      <textarea
                        rows={3}
                        placeholder=" "
                        value={address.address}
                        onChange={(e) => setAddress((a) => ({ ...a, address: e.target.value }))}
                        className={`peer w-full bg-slate-50 border rounded-[2rem] px-6 pt-7 pb-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all resize-none ${
                          address.address !== ""
                            ? "border-blue-200 focus:ring-blue-200 bg-blue-50/30" 
                            : "border-slate-100 focus:ring-blue-100 focus:border-blue-300"
                        }`}
                      />
                      <label className="absolute left-6 top-6 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all pointer-events-none peer-focus:top-4 peer-focus:text-[8px] peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[8px] peer-[:not(:placeholder-shown)]:text-blue-500">
                        FULL ADDRESS (Campus, Building No., Lab Ref)
                      </label>
                    </div>
                  </div>

                  {/* Shipping Mode Selection */}
                  <div className="mb-10 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4 text-slate-400" />
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">SELECT SHIPPING PARTNER</label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: "standard", name: "Standard Delivery", price: 50, eta: "5-7 Days", activeClass: "border-blue-400 bg-blue-50 text-blue-800", ring: "ring-blue-400/20" },
                        { id: "shiprocket", name: "Shiprocket Priority", price: 100, eta: "3-4 Days", activeClass: "border-blue-500 bg-blue-50 text-blue-900", ring: "ring-blue-500/20" },
                        { id: "bluedart", name: "Bluedart Air Express", price: 150, eta: "1-2 Days", activeClass: "border-blue-600 bg-blue-100 text-blue-900", ring: "ring-blue-600/20" },
                      ].map((sm) => (
                        <button
                          key={sm.id}
                          type="button"
                          onClick={() => {
                            setShippingMode(sm.id);
                            setShippingCost(sm.price);
                          }}
                          className={`p-5 rounded-[2rem] border-2 text-left transition-all ${
                            shippingMode === sm.id 
                              ? sm.activeClass + " ring-4 " + sm.ring + " shadow-md scale-[1.02]" 
                              : "border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-blue-200 text-slate-600"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black uppercase tracking-widest pr-2">{sm.name}</span>
                            <span className="text-xs font-black shrink-0">₹{sm.price}</span>
                          </div>
                          <span className="text-[8px] font-bold uppercase tracking-widest opacity-80 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> ETA: {sm.eta}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formError && (
                    <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {formError}
                    </div>
                  )}
                  
                  <button onClick={handleProceedToPayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3">
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
                        className={`w-full flex items-center gap-5 p-5 rounded-[2rem] border transition-all ${
                          paymentMethod === pm.id 
                            ? "border-blue-500 bg-blue-50/50 shadow-sm" 
                            : "border-slate-100 bg-white hover:border-blue-200"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-colors ${
                          paymentMethod === pm.id ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "bg-slate-50 text-slate-400"
                        }`}>
                          <pm.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none mb-1.5">{pm.label}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{pm.sub}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-[6px] transition-colors ${
                          paymentMethod === pm.id ? "border-blue-600 bg-white" : "border-slate-100 bg-white"
                        }`} />
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                          {/* 3D Card Visual */}
                          <div className="w-full max-w-[280px]" style={{ perspective: "1000px" }}>
                            <motion.div
                              animate={{ rotateY: isFlipped ? 180 : 0 }}
                              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                              className="w-full aspect-[1.586/1] relative"
                              style={{ transformStyle: "preserve-3d" }}
                            >
                              {/* Front */}
                              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-[1.5rem] p-6 text-white shadow-xl shadow-blue-900/20 flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
                                <div className="flex justify-between items-start">
                                  <div className="w-10 h-8 bg-white/20 rounded-md" /> {/* Chip */}
                                  <svg className="w-10 h-10 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>
                                </div>
                                <div>
                                  <p className="font-mono text-lg tracking-widest mb-2 opacity-90">{cardDetails.number || "•••• •••• •••• ••••"}</p>
                                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-70">
                                    <span>{cardDetails.name || "CARDHOLDER"}</span>
                                    <span>{cardDetails.expiry || "MM/YY"}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Back */}
                              <div className="absolute inset-0 bg-slate-800 rounded-[1.5rem] overflow-hidden shadow-xl" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                                <div className="w-full h-10 bg-black mt-6" />
                                <div className="px-6 mt-4">
                                  <div className="w-full h-8 bg-white flex items-center justify-end px-3 rounded">
                                    <span className="text-black font-mono text-sm">{cardDetails.cvv || "•••"}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                          
                          {/* Inputs */}
                          <div className="flex-1 space-y-4 w-full">
                            <input type="text" placeholder="Card Number" maxLength={19} value={cardDetails.number} onChange={e => setCardDetails(c => ({...c, number: e.target.value}))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                            <input type="text" placeholder="Cardholder Name" value={cardDetails.name} onChange={e => setCardDetails(c => ({...c, name: e.target.value}))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                            <div className="flex gap-4">
                              <input type="text" placeholder="MM/YY" maxLength={5} value={cardDetails.expiry} onChange={e => setCardDetails(c => ({...c, expiry: e.target.value}))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                              <input type="text" placeholder="CVV" maxLength={3} value={cardDetails.cvv} onChange={e => setCardDetails(c => ({...c, cvv: e.target.value}))} onFocus={() => setIsFlipped(true)} onBlur={() => setIsFlipped(false)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      ALL TRANSACTIONS ARE PROTECTED BY RAZORPAY&apos;S HIGH-SECURITY PAYMENT STANDARDS.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setStep("address")} className="flex-1 bg-white border border-slate-100 hover:border-slate-300 text-slate-400 hover:text-slate-600 rounded-full h-16 font-black text-xs uppercase tracking-widest transition-all">
                      PREVIOUS
                    </button>
                    <button onClick={() => setShowConfirmModal(true)} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-full h-16 font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all">
                      REVIEW ORDER
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Review & Confirm Modal */}
              <AnimatePresence>
                {showConfirmModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                          </div>
                          <h2 className="font-black text-slate-900 text-xl tracking-tight">Review & Confirm</h2>
                        </div>
                        <button onClick={() => setShowConfirmModal(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>

                      <div className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden mb-8">
                        {order ? (
                          <div className="p-6 text-xs font-black uppercase tracking-widest flex justify-between">
                            <span className="text-slate-500">{order.serviceType?.replace(/_/g, " ")}</span>
                            <span className="text-slate-900">₹{order.amount?.toLocaleString()}</span>
                          </div>
                        ) : (
                          <>
                            <div className="p-6 space-y-4">
                              {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                  <span className="text-slate-500">{item.name} × {item.qty || 1}</span>
                                  <span className="text-slate-900">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                                </div>
                              ))}
                              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest mt-2 pt-2 border-t border-slate-100">
                                <span className="text-slate-500">SHIPPING ({shippingMode})</span>
                                <span className="text-slate-900">{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        <div className="bg-blue-600 p-8 text-white flex justify-between items-end rounded-b-[1.8rem]">
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-200 mb-2">TOTAL AMOUNT</p>
                            <p className="text-4xl font-black tracking-tighter">₹{orderTotal.toLocaleString()}</p>
                          </div>
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-200 pb-1">PRICE IN INR</p>
                        </div>
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={processing || paymentSuccess}
                        className={`w-full h-16 rounded-full font-black text-[12px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 overflow-hidden relative ${
                          paymentSuccess ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {paymentSuccess ? (
                            <motion.div 
                              key="success"
                              initial={{ scale: 0, opacity: 0 }} 
                              animate={{ scale: 1, opacity: 1 }} 
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-6 h-6" /> PAYMENT SUCCESSFUL
                            </motion.div>
                          ) : processing ? (
                            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" /> PROCESSING PAYMENT...
                            </motion.div>
                          ) : (
                            <motion.div key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              PAY NOW - ₹{orderTotal.toLocaleString()}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatePresence>
          </div>

          {/* Right Column: Order Summary */}
          {step === "payment" && (
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="hidden lg:block sticky top-28">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">ORDER SUMMARY</h3>
              
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
          )}
          
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mt-4">Setting up secure checkout...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
