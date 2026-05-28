"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle, Loader2, Sparkles, MapPin, ArrowRight, Shield, LogIn, Check } from "lucide-react";
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
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [address, setAddress] = useState({
    name: "", phone: "", pincode: "", address: "", city: "", state: "", landmark: "",
  });

  const [orderTotal, setOrderTotal] = useState(14399);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Robust script loader for Razorpay
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

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
        // Create booking entry for the order
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

      // Verify Razorpay client SDK is fully loaded
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
            setOrder(activeOrder); // Update state to display order details on success screen
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
        prefill: {
          name: address.name || session?.user?.name || "Customer",
          email: session?.user?.email || "customer@example.com",
          contact: address.phone || "",
        },
        theme: {
          color: "#4f46e5",
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
          className="max-w-2xl w-full bg-gradient-to-br from-white via-indigo-50/10 to-purple-50/10 border-2 border-indigo-100 rounded-[3rem] p-12 md:p-16 text-center space-y-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none -z-10" />

          {/* Animated Success Badge */}
          <div className="w-28 h-28 bg-emerald-50 border-2 border-emerald-150 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl relative overflow-hidden group">
            <Check className="w-12 h-12 text-emerald-600" />
            <div className="absolute inset-0 rounded-[2.5rem] border-4 border-emerald-500 animate-ping opacity-15" />
          </div>

          <div className="space-y-4">
            <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tighter uppercase">
              Procurement <span className="text-emerald-500">Confirmed!</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
              Order Reference ID: <span className="text-slate-800 font-black">{order ? order.orderNumber : "ORD-000000"}</span>
            </p>
            <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto leading-relaxed">
              Your hardware procurement request has been received. High-quality lab grade items are being dispatched to your campus!
            </p>
          </div>

          {/* Premium Components Tracking Progress Bar */}
          <div className="max-w-xl mx-auto bg-slate-50/80 backdrop-blur-md border border-slate-200/60 rounded-[2.5rem] p-8 md:p-10 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-[50px] pointer-events-none" />
            
            <p className="text-[9px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full inline-block font-black uppercase tracking-widest mb-10">
              🚚 Real-time Shipment Tracker
            </p>
            
            <div className="relative">
              {/* Tracking Line Background */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 rounded-full -z-10" />
              {/* Active progress fill */}
              <div className="absolute top-5 left-8 w-[66%] h-1 bg-emerald-500 rounded-full -z-10 transition-all duration-1000 animate-pulse" />
              
              <div className="grid grid-cols-4 gap-2">
                {[
                  { step: 1, label: "Paid", emoji: "💳", active: true, done: true },
                  { step: 2, label: "Sourced", emoji: "📥", active: true, done: true },
                  { step: 3, label: "Packed", emoji: "📦", active: true, done: false, pulse: true },
                  { step: 4, label: "Shipped", emoji: "🚚", active: false, done: false }
                ].map((track) => (
                  <div key={track.step} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg border-2 shadow-sm transition-all duration-500 ${
                      track.done 
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10 scale-105"
                        : track.pulse
                          ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-650/20 animate-bounce"
                          : "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {track.done ? "✓" : track.emoji}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-wider mt-3 ${
                      track.done 
                        ? "text-emerald-600 font-extrabold" 
                        : track.pulse 
                          ? "text-indigo-600 font-extrabold"
                          : "text-slate-400"
                    }`}>
                      {track.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md mx-auto">
            <Link href={order ? `/dashboard/orders/${order.id}` : "/dashboard/orders"} className="flex-1">
              <Button className="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl h-16 font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/20">
                Track Order
              </Button>
            </Link>
            <Link href="/electronics" className="flex-1">
              <Button variant="outline" className="w-full border-slate-200 hover:border-indigo-650/30 rounded-2xl h-16 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-indigo-650 transition-all bg-white">
                Return to Store
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show loading while session resolves
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col justify-center items-center gap-4 bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verifying session...</p>
      </div>
    );
  }

  // Sign-in wall — show premium prompt if not authenticated
  if (sessionStatus === "unauthenticated") {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-white border-2 border-indigo-100 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl shadow-slate-900/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />
          <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto border border-indigo-100 relative">
            <LogIn className="w-8 h-8 text-indigo-600" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping opacity-20" />
          </div>
          <div>
            <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tighter mb-3">Sign in to <span className="text-indigo-600">Checkout</span></h1>
            <p className="text-slate-400 font-bold text-sm max-w-xs mx-auto leading-relaxed">
              Create a free account or sign in to track your order, manage payments, and get delivery updates.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/checkout" })}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/20 gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </Button>
            <Link href="/login">
              <Button variant="outline" className="w-full border-slate-150 hover:border-indigo-650/30 rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-indigo-650 transition-all bg-white">
                Sign in with Email
              </Button>
            </Link>
          </div>
          <Link href="/cart" className="block text-[9px] font-black text-slate-300 hover:text-indigo-600 transition-colors uppercase tracking-widest">
            ← Back to Cart
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col justify-center items-center gap-4 bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
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
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="font-heading font-black text-4xl text-slate-900 tracking-tighter uppercase">Secure <span className="text-indigo-600">Checkout</span></h1>
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
                className={`flex items-center gap-4 transition-all duration-500 ${step === s ? "opacity-100" : "opacity-35"}`}
              >
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black tracking-widest transition-all ${step === s ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "bg-white border border-slate-150 text-slate-400"}`}>{i + 1}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step === s ? "text-slate-900 font-black" : "text-slate-400 font-bold"}`}>{s}</span>
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
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  onTouchStart={handleTouchMove}
                  className="bg-white border-2 border-indigo-50 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group/card"
                >
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99,102,241,0.03), transparent 75%)" } as any} />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <MapPin className="w-5 h-5 text-slate-450" />
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight uppercase">Shipping Address</h2>
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
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-8 ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-350"
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
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-8 ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-350 resize-none"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={() => setStep("payment")} className="w-full bg-slate-900 hover:bg-indigo-600 text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-slate-900/20 group">
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
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  onTouchStart={handleTouchMove}
                  className="bg-white border-2 border-indigo-50 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group/card"
                >
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99,102,241,0.03), transparent 75%)" } as any} />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Shield className="w-5 h-5 text-slate-450" />
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight uppercase">Payment Verification</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: "upi", icon: Smartphone, label: "UPI (Instant)", sub: "PhonePe, Google Pay, etc." },
                      { id: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex" },
                      { id: "netbanking", icon: Building2, label: "Net Banking", sub: "All Indian Banks" },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`w-full flex items-center gap-6 p-6 rounded-2xl border-2 transition-all duration-500 group ${paymentMethod === pm.id ? "border-indigo-600 bg-indigo-50/15 shadow-xl shadow-indigo-650/5" : "border-slate-100 hover:border-slate-350 bg-white"}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${paymentMethod === pm.id ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}`}>
                          <pm.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{pm.label}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{pm.sub}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-4 transition-all ${paymentMethod === pm.id ? "border-indigo-600 bg-white" : "border-slate-150"}`} />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-slate-450 bg-slate-50 border border-slate-150 rounded-[1.5rem] p-6 font-bold uppercase tracking-widest leading-relaxed">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    All transactions are protected by Razorpay&apos;s high-security payment standards.
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep("address")} className="flex-1 border-slate-200 rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all bg-white">Previous</Button>
                    <Button onClick={() => setStep("confirm")} className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all">Review Order</Button>
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
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  onTouchStart={handleTouchMove}
                  className="bg-white border-2 border-indigo-50 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group/card"
                >
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99,102,241,0.03), transparent 75%)" } as any} />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight uppercase">Review & Confirm</h2>
                  </div>

                  {/* Premium Invoice Summary Card */}
                  <div className="bg-gradient-to-br from-indigo-50/20 via-white to-purple-50/20 rounded-[2rem] border-2 border-indigo-100/70 divide-y divide-indigo-50 overflow-hidden shadow-sm">
                    {order ? (
                      <>
                        <div className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-450">{order.serviceType?.replace(/_/g, " ")}</span>
                          <span className="text-slate-900">₹{order.amount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400 font-bold">Platform Fee</span>
                          <span className="text-emerald-500 font-black">Waived</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest items-center">
                            <span className="text-slate-450 font-black">{item.name} × {item.qty || 1}</span>
                            <span className="text-slate-900">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                          </div>
                        ))}
                        {cartItems.length > 0 && cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0) > 5000 && (
                          <div className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest items-center">
                            <span className="text-indigo-650 font-black">Research Grant (10% Off)</span>
                            <span className="font-black text-indigo-600">- ₹{(cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0) * 0.1).toLocaleString()}</span>
                          </div>
                        )}
                        {cartItems.length > 0 && (
                          <div className="flex justify-between p-6 text-[10px] font-black uppercase tracking-widest items-center">
                            <span className="text-slate-450">Shipping</span>
                            <span className={cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0) > 5000 ? "text-emerald-500 font-black uppercase tracking-widest" : "text-slate-900"}>
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

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep("payment")} className="flex-1 border-slate-200 rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all bg-white" disabled={processing}>Previous</Button>
                    <Button
                      onClick={handlePayment}
                      disabled={processing}
                      className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl shadow-xl shadow-indigo-600/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group flex items-center justify-center gap-3"
                    >
                      {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Tunneling...</> : <>💳 Pay Now - ₹{orderTotal.toLocaleString()}</>}
                    </Button>
                  </div>
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
            <div className="bg-white border-2 border-indigo-50/60 rounded-[2.5rem] p-8 sticky top-32 shadow-2xl space-y-8">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] pb-4 border-b border-slate-100">Order Summary</h3>
              <div className="space-y-4">
                {order ? (
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-450">
                    <span className="truncate max-w-[150px]">{order.serviceType?.replace(/_/g, " ")}</span>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-455">
                      <span className="max-w-[200px] truncate">{item.name} × {item.qty || 1}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-350 uppercase tracking-widest">Total Amount</span>
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
    <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 text-indigo-600 animate-spin" /><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">Setting up secure checkout...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
