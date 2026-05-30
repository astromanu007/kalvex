"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Clock, Sparkles, CheckCircle2, ArrowLeft,
  ArrowRight, Calculator, Zap, ShieldCheck, Loader2, Check, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { createOrder } from "@/app/actions/orders";
import { createBooking } from "@/app/actions/bookings";
import { createPaymentOrder, verifyPayment } from "@/app/actions/payments";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function WritingWriteupsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { width, height } = useWindowSize();

  // Multi-step Wizard States
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form Fields
  const [topic, setTopic] = useState("");
  const [pages, setPages] = useState(5);
  const [isUrgent, setIsUrgent] = useState(false);
  const [guidelines, setGuidelines] = useState("");
  // Handwriting-specific config
  const [writingStyle, setWritingStyle] = useState("");
  const [paperType, setPaperType] = useState("");
  const [inkColor, setInkColor] = useState("");
  const [subjectType, setSubjectType] = useState("");
  const [diagramRequired, setDiagramRequired] = useState<"Yes" | "No" | "">("");
  const [diagramCount, setDiagramCount] = useState<number>(0);
  const [diagramType, setDiagramType] = useState<"Pencil" | "Pen" | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");

  // Applicant details (Step 3)
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Payment integration states
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");

  const baseRate = isUrgent ? 10 : 5;
  const diagramRate = isUrgent ? 6 : 4;
  const diagramExtra = diagramRequired === "Yes" ? diagramCount * diagramRate : 0;
  const totalPrice = pages * baseRate + diagramExtra;

  // Sync client-side mount to prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPdfFileName(selected.name);
    }
  };

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

  const handleRazorpayPayment = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setPaying(true);

    try {
      // 1. Create the order in the Database
      const req = `Handwritten Writeup Booking
Pages: ${pages}
Type: ${isUrgent ? "Urgent (24 Hours)" : "Standard (3-5 Days)"}
Topic: ${topic}
Writing Style: ${writingStyle}
Paper Type: ${paperType}
Ink Colour: ${inkColor}
Subject Type: ${subjectType}
Diagrams Required: ${diagramRequired}${diagramRequired === "Yes" ? ` (${diagramCount} - ${diagramType} diagrams)` : ""}
Special Instructions: ${guidelines}
Uploaded Reference: ${pdfFileName || "None"}

CLIENT DETAILS:
Name: ${recipientName}
Phone: ${phone}
Address: ${address}, ${city} - ${pincode}`;

      const orderRes = await createOrder({
        serviceType: "PROFESSIONAL_WRITEUP",
        requirements: req,
        amount: totalPrice,
      });

      if (!orderRes.success || !orderRes.orderId) {
        alert(orderRes.error || "Failed to initialize order.");
        setPaying(false);
        return;
      }

      setCreatedOrderId(orderRes.orderId);
      setCreatedOrderNumber(orderRes.orderNumber || "ORD-XXXXXX");

      // Also create booking entry for this order
      try {
        await createBooking({
          userId: session.user.id,
          serviceId: orderRes.orderId,
          serviceType: "PROFESSIONAL_WRITEUP",
          requirements: req,
        });
      } catch (err) {
        console.error("Booking creation failed:", err);
      }

      // 2. Create the payment order on Razorpay server-side
      const payRes = await createPaymentOrder(totalPrice, orderRes.orderId);

      if (!payRes.success || !payRes.id) {
        alert(payRes.error || "Failed to launch Razorpay overlay.");
        setPaying(false);
        return;
      }

      // 3. Load the Razorpay client SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay Checkout SDK. Please check your network connection.");
        setPaying(false);
        return;
      }

      // 4. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SjepBzGtOTKoTN",
        amount: payRes.amount,
        currency: payRes.currency,
        name: "KALVEX LABS",
        description: "Professional Writeup Service",
        order_id: payRes.id,
        handler: async function (response: any) {
          setPaying(true);
          const verifyRes = await verifyPayment(response, orderRes.orderId!);
          if (verifyRes.success) {
            setPaymentSuccess(true);
            setPaymentFailed(false);
          } else {
            setPaymentFailed(true);
          }
          setPaying(false);
        },
        prefill: {
          name: recipientName || session.user.name || "Customer",
          email: session.user.email || "customer@example.com",
          contact: phone || "",
        },
        theme: {
          color: "#ea580c",
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Razorpay workflow error:", err);
      alert("Something went wrong during checkout.");
      setPaying(false);
    }
  };

  const canProceed = useMemo(() => {
    if (step === 1) {
      return topic.trim() !== "";
    }
    if (step === 2) {
      const basic = writingStyle !== "" && paperType !== "" && inkColor !== "" && subjectType !== "" && diagramRequired !== "";
      if (diagramRequired === "Yes") {
        return basic && diagramCount > 0 && diagramType !== "";
      }
      return basic;
    }
    if (step === 3) {
      return recipientName.trim() !== "" && 
             phone.trim() !== "" && 
             address.trim() !== "" && 
             city.trim() !== "" && 
             pincode.trim() !== "";
    }
    return true;
  }, [step, topic, writingStyle, paperType, inkColor, subjectType, diagramRequired, diagramType, diagramCount, recipientName, phone, address, city, pincode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push("/login");
      return;
    }

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    const req = `Handwritten Writeup Booking
Pages: ${pages}
Type: ${isUrgent ? "Urgent (24 Hours)" : "Standard (3-5 Days)"}
Topic: ${topic}
Writing Style: ${writingStyle}
Paper Type: ${paperType}
Ink Colour: ${inkColor}
Subject Type: ${subjectType}
Diagrams Required: ${diagramRequired}${diagramRequired === "Yes" ? ` (${diagramCount} - ${diagramType} diagrams)` : ""}
Special Instructions: ${guidelines}
Uploaded Reference: ${pdfFileName || "None"}

CLIENT DETAILS:
Name: ${recipientName}
Phone: ${phone}
Address: ${address}, ${city} - ${pincode}`;

    const res = await createOrder({
      serviceType: "PROFESSIONAL_WRITEUP",
      requirements: req,
      amount: totalPrice,
    });

    if (res.success && res.orderId) {
      try {
        await createBooking({
          userId: session.user.id,
          serviceId: res.orderId,
          serviceType: "PROFESSIONAL_WRITEUP",
          requirements: req,
        });
      } catch (err) {
        console.error("Booking creation failed:", err);
      }
    }

    setLoading(false);
    if (res.success) {
      router.push("/dashboard/orders");
    } else {
      alert(res.error || "Failed to submit request.");
    }
  };

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  } as const;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 relative overflow-hidden font-sans">
      {paymentSuccess && <Confetti width={width} height={height} numberOfPieces={600} recycle={false} gravity={0.15} colors={['#ea580c', '#f97316', '#fb923c', '#fdba74', '#10b981']} style={{ zIndex: 100 }} />}
      <Navbar />

      {/* Payment Failure Modal */}
      <AnimatePresence>
        {paymentFailed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border-2 border-rose-100 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-rose-50 border-2 border-rose-200 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="font-heading font-black text-2xl text-slate-900">Payment Failed</h3>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">Your transaction could not be verified. Your money might have been deducted but the order wasn't confirmed. Please retry or contact support.</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setPaymentFailed(false)}
                  className="flex-1 h-14 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setPaymentFailed(false);
                    handleRazorpayPayment();
                  }}
                  className="flex-1 h-14 bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/20 font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
                >
                  Retry Pay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          
          <Link href="/services" className="inline-flex items-center text-[10px] font-black text-slate-400 hover:text-orange-600 mb-12 transition-all uppercase tracking-[0.2em] group">
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Services
          </Link>

          {/* Hero Header Section */}
          <div onMouseMove={handleMouseMove} onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} className="bg-gradient-to-br from-white via-orange-50/20 to-rose-50/20 border-2 border-orange-100 rounded-[3rem] p-12 md:p-20 mb-16 flex flex-col md:flex-row gap-16 items-center shadow-2xl shadow-orange-100/10 relative overflow-hidden text-slate-800 group/card">
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(249,115,22,0.06), transparent 75%)" } as any} />
            <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] -z-10 animate-pulse" />
            
            <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-3 bg-orange-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-orange-600/15">
                📝 Academic & Creative Content Desk
              </div>
              <h1 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter leading-[0.9] uppercase">
                Professional <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-orange-700 drop-shadow-[0_0_30px_rgba(249,115,22,0.15)]">Writeups</span> Desk
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed font-bold max-w-2xl">
                Get high-quality, plagiarism-free technical writeups, manuals, and custom reporting drafted to perfection by institutional standards.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {[
                  { title: "Standard", desc: "₹5 Per Page", emoji: "⏱️", borderHover: "hover:border-orange-400 hover:shadow-orange-500/5", bgGrad: "from-white to-orange-50/5 hover:to-orange-50/30", iconBg: "bg-orange-50/80 text-orange-600", textCol: "text-orange-600" },
                  { title: "Urgent", desc: "₹10 Per Page", emoji: "⚡", borderHover: "hover:border-rose-400 hover:shadow-rose-500/5", bgGrad: "from-white to-rose-50/5 hover:to-rose-50/30", iconBg: "bg-rose-50/80 text-rose-600", textCol: "text-rose-600" },
                  { title: "Plagiarism-Free", desc: "Turnitin Reports", emoji: "🎓", borderHover: "hover:border-amber-400 hover:shadow-amber-500/5", bgGrad: "from-white to-amber-50/5 hover:to-amber-50/30", iconBg: "bg-amber-50/80 text-amber-600", textCol: "text-amber-600" },
                  { title: "Secure Docs", desc: "100% Confidential", emoji: "🔒", borderHover: "hover:border-emerald-400 hover:shadow-emerald-500/5", bgGrad: "from-white to-emerald-50/5 hover:to-emerald-50/30", iconBg: "bg-emerald-50/80 text-emerald-600", textCol: "text-emerald-600" }
                ].map((feat) => (
                  <div 
                    key={feat.title} 
                    className={`bg-gradient-to-br ${feat.bgGrad} border-2 border-slate-100/80 ${feat.borderHover} rounded-[2rem] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl shadow-sm flex flex-col items-center md:items-start text-center md:text-left group/feat cursor-pointer`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${feat.iconBg} group-hover/feat:scale-110 flex items-center justify-center text-2xl mb-4 shadow-inner transition-all duration-500`}>
                      {feat.emoji}
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-wider ${feat.textCol} transition-colors duration-500`}>
                      {feat.title}
                    </div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      {feat.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-[400px] bg-gradient-to-b from-[#FFFDF9] to-[#FFF8EC] rounded-[3.5rem] p-8 md:p-10 text-center shrink-0 shadow-[0_20px_50px_rgba(249,115,22,0.06)] relative z-10 border-2 border-[#FFE8CC]/80 overflow-hidden group/calc hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 opacity-0 group-hover/calc:opacity-100 group-active/calc:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(249,115,22,0.04), transparent 75%)" } as any} />
              
              <p className="text-slate-450 text-[10px] font-extrabold uppercase tracking-[0.25em] mb-5">Calculated Price</p>
              
              <div className="font-heading font-black text-6xl md:text-[5.5rem] text-slate-900 mb-5 tracking-tighter flex items-center justify-center gap-1 transition-all duration-300 hover:scale-105">
                <span className="text-3xl text-[#EA580C] font-black self-start mt-2">₹</span>
                <span className="bg-gradient-to-r from-[#EA580C] via-[#DC2626] to-[#B91C1C] bg-clip-text text-transparent font-black leading-none">
                  {totalPrice.toLocaleString()}
                </span>
              </div>
              
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 text-[10px] text-[#C2410C] bg-[#FFF7ED] border border-[#FFD8A8] px-5 py-2 rounded-full font-black uppercase tracking-widest shadow-sm">
                  {isUrgent ? "⚡ Urgent Delivery Rate" : "⏳ Standard Delivery Rate"}
                </span>
              </div>

              <div className="bg-white/80 border border-[#F1EADF] rounded-3xl p-6 mb-8 text-left space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Pages Count</span>
                  <span className="text-[#EA580C] font-black">{pages} Pages</span>
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Rate Per Page</span>
                  <span className="text-slate-800 font-black">₹{baseRate} / Page</span>
                </div>

                {diagramRequired === "Yes" && (
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Diagrams Add-on</span>
                    <span className="text-[#EA580C] font-black">₹{diagramExtra} ({diagramCount} × ₹{diagramRate})</span>
                  </div>
                )}
                
                <div className="h-[1px] bg-[#EFE9DD] my-1" />
                
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Fulfillment Target</span>
                  <span className="text-slate-800 font-black">{isUrgent ? "24 Hours" : "3-5 Days"}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[#F1EADF]/85 flex justify-center items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Turnitin Verified Plag-Report Included</span>
              </div>
            </div>
          </div>

          {/* Stepper Card */}
          <div onMouseMove={handleMouseMove} onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} className="bg-white border-2 border-orange-100/60 rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-slate-900/5 relative overflow-hidden group/card">
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(249,115,22,0.03), transparent 75%)" } as any} />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-12">
              <div>
                <h2 className="font-heading font-black text-4xl text-slate-900 tracking-tight mb-2">Writeup <span className="text-orange-600">Configuration</span></h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Drafting & Scope Wizard</p>
              </div>
              
              {/* Stepper Progress Bar */}
              <div className="flex items-center gap-6 w-full md:w-80">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex-1 space-y-3">
                    <div className={`h-1.5 rounded-full transition-all duration-700 ${step >= s ? "bg-orange-600 shadow-lg shadow-orange-600/20" : "bg-slate-100"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest block text-center ${step >= s ? "text-orange-600" : "text-slate-300"}`}>
                      Step 0{s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Writeup Essentials */}
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Writeup / Project Topic <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="e.g., Wireless Power Transmission System Study" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-slate-900 font-bold focus:ring-8 ring-orange-600/5 focus:border-orange-600 outline-none transition-all placeholder:text-slate-200" required />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Page Count Assessment</label>
                          <span className="bg-orange-50 border border-orange-100 text-orange-700 px-4 py-1 rounded-xl text-xs font-black">{pages} Pages</span>
                        </div>
                        
                        <div className="relative h-12 flex items-center">
                          {/* Track Background */}
                          <div className="absolute left-0 right-0 h-2 bg-slate-100 rounded-full" />
                          
                          {/* Active Fill Track */}
                          <div 
                            className="absolute left-0 h-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full pointer-events-none transition-all duration-75" 
                            style={{ width: `${(pages - 1) / (100 - 1) * 100}%` }}
                          />
                          
                          {/* Native range slider placed on top */}
                          <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={pages} 
                            onChange={(e) => setPages(parseInt(e.target.value))} 
                            className="absolute left-0 w-full h-8 appearance-none bg-transparent cursor-pointer focus:outline-none z-10
                              [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-8
                              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-500 [&::-webkit-slider-thumb]:to-rose-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-orange-500/40 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-95
                              
                              [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-8
                              [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-orange-500 [&::-moz-range-thumb]:to-rose-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-orange-500/40 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:active:scale-95 border-none"
                          />
                        </div>
                        
                        <div className="flex justify-between text-[8px] text-slate-350 uppercase tracking-widest font-black pt-1">
                          <button type="button" onClick={() => setPages(1)} className="hover:text-orange-600 transition-colors focus:outline-none">1 Page</button>
                          <button type="button" onClick={() => setPages(50)} className="hover:text-orange-600 transition-colors focus:outline-none">50 Pages</button>
                          <button type="button" onClick={() => setPages(100)} className="hover:text-orange-600 transition-colors focus:outline-none">100 Pages</button>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Speeds */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fulfillment Priority</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                          type="button"
                          onClick={() => setIsUrgent(false)}
                          className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 text-center relative overflow-hidden group ${!isUrgent ? "border-orange-600 bg-orange-50/40 text-orange-850" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"}`}
                        >
                          <Clock className={`w-8 h-8 ${!isUrgent ? "text-orange-600 animate-pulse" : "text-slate-300"}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest block">Standard Delivery</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Fulfillment in 3-5 days @ ₹5 / page</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsUrgent(true)}
                          className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 text-center relative overflow-hidden group ${isUrgent ? "border-orange-600 bg-orange-50/40 text-orange-850" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"}`}
                        >
                          <Zap className={`w-8 h-8 ${isUrgent ? "text-orange-600 animate-bounce" : "text-slate-300"}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest block">Urgent Delivery (Priority)</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Fulfillment in 24 hours @ ₹10 / page</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Handwriting Configuration */}
                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >

                    {/* Writing Style */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Writing Style <span className="text-rose-500">*</span></label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { id: "Print", emoji: "🖊️", desc: "Clear block lettering" },
                          { id: "Cursive", emoji: "✍️", desc: "Joined flowing script" },
                          { id: "Semi-Cursive", emoji: "📝", desc: "Mixed natural style" },
                          { id: "Neat Mixed", emoji: "📖", desc: "Readable casual style" },
                        ].map(({ id, emoji, desc }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setWritingStyle(id)}
                            className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left group hover:-translate-y-1 hover:shadow-lg ${
                              writingStyle === id
                                ? "border-orange-600 bg-orange-50/50 shadow-xl shadow-orange-600/10 scale-[1.02]"
                                : "border-slate-100 bg-slate-50 hover:border-orange-200"
                            }`}
                          >
                            <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110">{emoji}</div>
                            <div className={`text-[10px] font-black uppercase tracking-widest ${writingStyle === id ? "text-slate-900" : "text-slate-500"}`}>{id}</div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">{desc}</div>
                            {writingStyle === id && (
                              <div className="mt-2 w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center ml-auto">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Paper Type */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paper Type <span className="text-rose-500">*</span></label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { id: "Line / Ruled Paper", emoji: "📄", desc: "Standard lined paper" },
                          { id: "Plain White Paper", emoji: "⬜", desc: "Unlined blank sheet" },
                          { id: "Graph / Grid Paper", emoji: "🔲", desc: "For numeric / diagrams" },
                          { id: "A4 Bond Paper", emoji: "🗒️", desc: "Premium quality bond" },
                        ].map(({ id, emoji, desc }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setPaperType(id)}
                            className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left group hover:-translate-y-1 hover:shadow-lg ${
                              paperType === id
                                ? "border-orange-600 bg-orange-50/50 shadow-xl shadow-orange-600/10 scale-[1.02]"
                                : "border-slate-100 bg-slate-50 hover:border-orange-200"
                            }`}
                          >
                            <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110">{emoji}</div>
                            <div className={`text-[10px] font-black uppercase tracking-widest ${paperType === id ? "text-slate-900" : "text-slate-500"}`}>{id}</div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">{desc}</div>
                            {paperType === id && (
                              <div className="mt-2 w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center ml-auto">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Diagrams Required Yes / No */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Diagrams / Figures Required? <span className="text-rose-500">*</span></label>
                      <div className="grid grid-cols-2 gap-4 max-w-md">
                        {[
                          { id: "Yes", emoji: "📊", desc: "Yes, include diagrams" },
                          { id: "No", emoji: "❌", desc: "No diagrams needed" }
                        ].map(({ id, emoji, desc }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              setDiagramRequired(id as "Yes" | "No");
                              if (id === "No") {
                                setDiagramCount(0);
                                setDiagramType("");
                              } else {
                                if (diagramCount === 0) setDiagramCount(1);
                                if (diagramType === "") setDiagramType("Pencil");
                              }
                            }}
                            className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left group hover:-translate-y-1 hover:shadow-lg ${
                              diagramRequired === id
                                ? "border-orange-600 bg-orange-50/50 shadow-xl shadow-orange-600/10 scale-[1.02]"
                                : "border-slate-100 bg-slate-50 hover:border-orange-200"
                            }`}
                          >
                            <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110">{emoji}</div>
                            <div className={`text-[10px] font-black uppercase tracking-widest ${diagramRequired === id ? "text-slate-900" : "text-slate-500"}`}>{id}</div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">{desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic diagrams setup */}
                    <AnimatePresence>
                      {diagramRequired === "Yes" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -20 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="bg-orange-50/20 border border-orange-100/50 rounded-3xl p-8 space-y-6 overflow-hidden"
                        >
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* How many diagrams */}
                            <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">How many diagrams? <span className="text-rose-500">*</span></label>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setDiagramCount(Math.max(1, diagramCount - 1))}
                                  className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-600 hover:bg-orange-50 hover:border-orange-200 transition-all active:scale-95"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min={1}
                                  value={diagramCount}
                                  onChange={(e) => setDiagramCount(Math.max(1, Number(e.target.value)))}
                                  className="w-20 h-12 bg-white border border-slate-250 rounded-xl text-center font-heading font-black text-slate-900 outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setDiagramCount(diagramCount + 1)}
                                  className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-600 hover:bg-orange-50 hover:border-orange-200 transition-all active:scale-95"
                                >
                                  +
                                </button>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-2">
                                  ₹{isUrgent ? "6" : "4"} per diagram ({isUrgent ? "Urgent Priority" : "Standard"})
                                </span>
                              </div>
                            </div>

                            {/* Diagram Type selection */}
                            <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Diagram Type / Medium <span className="text-rose-500">*</span></label>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { id: "Pencil", emoji: "✏️", desc: "Shaded pencil drawing" },
                                  { id: "Pen", emoji: "🖊️", desc: "Precise ink drawing" }
                                ].map(({ id, emoji, desc }) => (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={() => setDiagramType(id as "Pencil" | "Pen")}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left group hover:-translate-y-0.5 hover:shadow-md ${
                                      diagramType === id
                                        ? "border-orange-600 bg-white shadow-md scale-[1.02]"
                                        : "border-slate-200/60 bg-white/60 hover:border-orange-200"
                                    }`}
                                  >
                                    <div className="text-xl mb-1.5">{emoji}</div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${diagramType === id ? "text-slate-900" : "text-slate-500"}`}>{id}</div>
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{desc}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Ink Colour & Subject Type side by side */}
                    <div className="grid md:grid-cols-2 gap-10">
                      {/* Ink Colour */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ink Colour <span className="text-rose-500">*</span></label>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { id: "Black", dot: "bg-slate-900", desc: "Professional black" },
                            { id: "Blue", dot: "bg-blue-500", desc: "Standard blue" },
                            { id: "Black-Blue", dot: "bg-gradient-to-r from-slate-900 via-blue-500 to-slate-900", desc: "Dual black‑blue" },
                          ].map(({ id, dot, desc }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setInkColor(id)}
                              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 group ${
                                inkColor === id
                                  ? "border-orange-600 bg-orange-50/50 shadow-lg shadow-orange-600/10"
                                  : "border-slate-100 bg-slate-50 hover:border-orange-200"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full ${dot} shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-125 ${inkColor === id ? "scale-125 ring-2 ring-offset-1 ring-orange-400" : ""}`} />
                              <div className="text-left">
                                <div className={`text-[10px] font-black uppercase tracking-widest ${inkColor === id ? "text-slate-900" : "text-slate-500"}`}>{id}</div>
                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{desc}</div>
                              </div>
                              {inkColor === id && (
                                <div className="ml-auto w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subject Type */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject Type <span className="text-rose-500">*</span></label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "Engineering", emoji: "⚙️" },
                            { id: "Science", emoji: "🔬" },
                            { id: "Commerce", emoji: "📊" },
                            { id: "Arts / Humanities", emoji: "🎭" },
                            { id: "Mathematics", emoji: "📐" },
                            { id: "Medical", emoji: "🏥" },
                          ].map(({ id, emoji }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setSubjectType(id)}
                              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 group ${
                                subjectType === id
                                  ? "border-orange-600 bg-orange-50/50 shadow-lg shadow-orange-600/10"
                                  : "border-slate-100 bg-slate-50 hover:border-orange-200"
                              }`}
                            >
                              <span className="text-lg transition-transform duration-300 group-hover:scale-125">{emoji}</span>
                              <span className={`text-[9px] font-black uppercase tracking-widest text-left leading-tight ${subjectType === id ? "text-slate-900" : "text-slate-500"}`}>{id}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions & Reference Upload */}
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Special Instructions / Notes (Optional)</label>
                        <textarea rows={5} placeholder="e.g., Use margin on both sides, maintain 1-inch margins, write chapter headings in caps..." value={guidelines} onChange={(e) => setGuidelines(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 ring-orange-600/5 focus:border-orange-600 outline-none transition-all placeholder:text-slate-200 resize-none" />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Question Paper / Syllabus (Optional)</label>
                        <div className="relative border-2 border-dashed border-slate-100 hover:border-orange-300 transition-all duration-300 rounded-[2rem] p-8 text-center bg-slate-50 flex flex-col items-center justify-center cursor-pointer group hover:bg-orange-50/20 h-[142px]">
                          <input 
                            type="file" 
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5 text-orange-500" />
                          </div>
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                            {file ? `✓ ${file.name}` : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">PDF / JPG / PNG / Docx accepted</p>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* Step 3: Client Shipping / Logistics Details */}
                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                      <div>
                        <h3 className="font-heading font-black text-2xl text-slate-900 tracking-tight">Client Contact & Shipping Details</h3>
                        <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest">Where should we deliver the printed files & Turnitin reports?</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client / Recipient Full Name <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="John Doe" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 ring-orange-600/5 focus:border-orange-600 outline-none transition-all placeholder:text-slate-350" required />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number <span className="text-rose-500">*</span></label>
                        <input type="tel" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 ring-orange-600/5 focus:border-orange-600 outline-none transition-all placeholder:text-slate-355" required />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Complete Delivery Address <span className="text-rose-500">*</span></label>
                      <textarea rows={3} placeholder="House No, Building, Area Road, Landmark..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 ring-orange-600/5 focus:border-orange-600 outline-none transition-all placeholder:text-slate-355 resize-none" required />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City / District <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="Mumbai" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 ring-orange-600/5 focus:border-orange-600 outline-none transition-all placeholder:text-slate-355" required />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">PIN Code <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="400001" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:ring-4 ring-orange-600/5 focus:border-orange-600 outline-none transition-all placeholder:text-slate-355" required />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Summary & Payment Receipt */}
                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    {!paymentSuccess ? (
                      <div className="space-y-10">
                        
                        {/* Receipt Summary Card */}
                        <div className="bg-gradient-to-br from-orange-50/50 via-white to-rose-50/50 border-2 border-orange-100 rounded-[3rem] p-10 shadow-xl text-slate-800">
                          <h3 className="font-heading font-black text-2xl text-slate-900 uppercase tracking-tight mb-6 pb-4 border-b border-orange-100/60 flex items-center justify-between">
                            <span>📋 Writeup Order Configuration</span>
                            <span className="text-xs text-orange-650 bg-orange-50 border border-orange-100/50 px-4 py-1.5 rounded-full font-black">Verified Desk</span>
                          </h3>
                          
                          <div className="grid md:grid-cols-2 gap-8 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <div className="space-y-3.5">
                              <div className="flex justify-between border-b border-slate-150 pb-2">
                                <span>Service Title</span>
                                <span className="text-slate-800 font-black">Professional Writeups</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-150 pb-2">
                                <span>Project Topic</span>
                                <span className="text-orange-600 font-black text-right max-w-[200px] line-clamp-1">{topic}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-150 pb-2">
                                <span>Volume Target</span>
                                <span className="text-slate-800 font-black">{pages} Pages</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-150 pb-2">
                                <span>Fulfillment Priority</span>
                                <span className="text-slate-850 font-black">{isUrgent ? "Urgent (24 Hours)" : "Standard (3-5 Days)"}</span>
                              </div>
                            </div>
                            <div className="space-y-3.5">
                              <div className="flex flex-col gap-2">
                                <span>Handwriting Config:</span>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {writingStyle && <span className="bg-orange-50 border border-orange-100 text-orange-700 text-[8px] font-black uppercase px-2.5 py-1 rounded-lg">✓ {writingStyle}</span>}
                                  {paperType && <span className="bg-orange-50 border border-orange-100 text-orange-700 text-[8px] font-black uppercase px-2.5 py-1 rounded-lg">✓ {paperType}</span>}
                                  {subjectType && <span className="bg-orange-50 border border-orange-100 text-orange-700 text-[8px] font-black uppercase px-2.5 py-1 rounded-lg">✓ {subjectType}</span>}
                                  
                                  <div className="w-full flex flex-col gap-1.5 mt-2 bg-slate-50/55 p-3 rounded-xl border border-slate-100">
                                    <div className="flex justify-between items-center text-[10px] text-slate-600">
                                      <span>Ink Colour:</span>
                                      <span className="text-slate-805 font-extrabold">{inkColor || "None"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-600">
                                      <span>Diagrams:</span>
                                      <span className="text-slate-805 font-extrabold">
                                        {diagramRequired === "Yes" ? `${diagramCount} Diagrams (${diagramType})` : "No Diagrams"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 pt-2">
                                <span>Uploaded materials:</span>
                                <span className="text-slate-800 font-black text-[9px] line-clamp-1">{pdfFileName || "No attachments provided."}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-10 p-6 bg-white border-2 border-orange-50/80 rounded-2xl shadow-sm space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100/80">
                              <div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] block text-orange-700">Total Amount Due</span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">
                                  {isUrgent ? "⚡ Urgent Rate Calculation" : "⏳ Standard Rate Calculation"}
                                </span>
                              </div>
                              <span className="text-4xl font-black text-orange-650">₹{totalPrice.toLocaleString()}</span>
                            </div>

                            <div className="space-y-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest pt-1">
                              <div className="flex justify-between items-center">
                                <span>✍️ Base Writeup Charge ({isUrgent ? "₹10/page" : "₹5/page"})</span>
                                <span className="text-slate-800">₹{baseRate} × {pages} Pages = <span className="font-black text-slate-900">₹{pages * baseRate}</span></span>
                              </div>
                              {diagramRequired === "Yes" && diagramCount > 0 && (
                                <div className="flex justify-between items-center">
                                  <span>📊 Diagram Add-on ({isUrgent ? "₹6/diagram" : "₹4/diagram"})</span>
                                  <span className="text-slate-800">₹{diagramRate} × {diagramCount} Diagrams = <span className="font-black text-slate-900">₹{diagramExtra}</span></span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Proceed to Pay CTA */}
                        <div className="text-center space-y-6">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> SECURE 256-BIT ENCRYPTED RAZORPAY TRANSACTION
                          </p>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => setStep(2)}
                              className="flex-1 h-18 border-2 border-slate-200 hover:bg-slate-50 text-slate-405 hover:text-slate-900 font-black text-xs uppercase tracking-widest rounded-[1.5rem] transition-all bg-white"
                            >
                              Configure
                            </button>
                            <button
                              type="button"
                              onClick={handleRazorpayPayment}
                              disabled={paying}
                              className="flex-[2] h-18 bg-orange-600 hover:bg-orange-700 text-white font-black text-sm uppercase tracking-[0.25em] rounded-[1.5rem] shadow-xl shadow-orange-600/15 hover:shadow-orange-600/30 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                              {paying ? (
                                <>
                                  <Loader2 className="w-6 h-6 animate-spin" /> Tunneling...
                                </>
                              ) : (
                                <>
                                  💳 Pay Securely (₹{totalPrice.toLocaleString()})
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      
                      /* Successful Payment Real-time Tracker */
                      <div className="space-y-12 py-6 text-center">
                        <div className="w-28 h-28 bg-emerald-50 border-2 border-emerald-250 text-emerald-605 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl relative overflow-hidden group">
                          <Check className="w-12 h-12 text-emerald-600" />
                          <div className="absolute inset-0 rounded-[2.5rem] border-4 border-emerald-500 animate-ping opacity-15" />
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-heading font-black text-4xl text-slate-900 tracking-tight uppercase">
                            Payment <span className="text-emerald-600 font-black">Successful!</span>
                          </h3>
                          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                            Order ID: <span className="text-slate-800">{createdOrderNumber}</span>
                          </p>
                          <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto leading-relaxed">
                            Thank you for your order! Your request has been queued in the Kalvex Writing Dashboard.
                          </p>
                        </div>

                        <div className="max-w-xl mx-auto bg-slate-50/80 backdrop-blur-md border border-slate-200/60 rounded-[3rem] p-8 md:p-10 shadow-inner relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-orange-550/5 blur-[50px] pointer-events-none" />
                          
                          <p className="text-[10px] text-orange-700 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full inline-block font-black uppercase tracking-widest mb-10">
                            🎯 Real-time Writeup Tracker
                          </p>
                          
                          <div className="relative">
                            <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 rounded-full -z-10" />
                            <div className="absolute top-5 left-8 w-[66%] h-1 bg-emerald-500 rounded-full -z-10 transition-all duration-1000 animate-pulse" />
                            
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { step: 1, label: "Paid", emoji: "💳", active: true, done: true },
                                { step: 2, label: "Confirmed", emoji: "🎯", active: true, done: true },
                                { step: 3, label: "Drafting", emoji: "✍️", active: true, done: false, pulse: true },
                                { step: 4, label: "Delivery", emoji: "📁", active: false, done: false }
                              ].map((track) => (
                                <div key={track.step} className="flex flex-col items-center">
                                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg border-2 shadow-sm transition-all duration-500 ${
                                    track.done 
                                      ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10 scale-105"
                                      : track.pulse
                                        ? "bg-orange-600 border-orange-600 text-white scale-110 shadow-lg shadow-orange-650/20 animate-bounce"
                                        : "bg-white border-slate-200 text-slate-400"
                                  }`}>
                                    {track.done ? "✓" : track.emoji}
                                  </div>
                                  <span className={`text-[8px] font-black uppercase tracking-wider mt-3 ${
                                    track.done 
                                      ? "text-emerald-600 font-extrabold" 
                                      : track.pulse 
                                        ? "text-orange-600 font-extrabold"
                                        : "text-slate-400"
                                  }`}>
                                    {track.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-4">
                          <Link 
                            href="/dashboard/orders" 
                            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest h-14 px-8 rounded-xl transition-all shadow-md flex-1"
                          >
                            📂 Orders Dashboard
                          </Link>
                          <button 
                            type="button"
                            onClick={() => {
                              setStep(1);
                              setPaymentSuccess(false);
                              setTopic("");
                              setPages(5);
                              setIsUrgent(false);
                              setGuidelines("");
                              setWritingStyle("");
                              setPaperType("");
                              setInkColor("");
                              setSubjectType("");
                              setDiagramRequired("");
                              setDiagramCount(0);
                              setDiagramType("");
                              setFile(null);
                              setPdfFileName("");
                              setRecipientName("");
                              setPhone("");
                              setAddress("");
                              setCity("");
                              setPincode("");
                            }}
                            className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest h-14 px-8 rounded-xl transition-all bg-white flex-1"
                          >
                            🔄 Order Another
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Actions for Wizard steps */}
              {step < 4 && (
                <div className="flex flex-col sm:flex-row gap-6 pt-12">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="border-slate-100 text-slate-400 h-16 px-12 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all duration-500">
                      Back
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    disabled={loading || !canProceed} 
                    className={`h-16 px-16 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl group ${
                      !canProceed
                        ? "bg-rose-600/90 text-white cursor-not-allowed ml-auto border border-rose-200/50 shadow-rose-200/20"
                        : step < 4 
                          ? "bg-slate-900 hover:bg-orange-650 text-white shadow-slate-900/20 ml-auto" 
                          : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/30 w-full"
                    }`}
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 mr-4 animate-spin" /> Submitting...</>
                    ) : !canProceed ? (
                      "⚠️ Fill Required Fields"
                    ) : step < 4 ? (
                      <>Next Step <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                      "Submit Order"
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>

      {/* Why Choose Us */}
      <section className="py-20 bg-white border-t border-slate-50 relative z-10 mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Sparkles, title: "Plagiarism Free", desc: "100% unique content with official Turnitin reports provided." },
              { icon: ShieldCheck, title: "Data Privacy", desc: "Your project details and data are kept strictly confidential." },
              { icon: Clock, title: "Timely Delivery", desc: "We respect your deadlines. Late delivery means 50% refund." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm animate-pulse">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-100/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-rose-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />
    </div>
  );
}
