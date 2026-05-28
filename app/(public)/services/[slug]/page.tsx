"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShieldCheck, Clock, FileText, Loader2, Check } from "lucide-react";
import { createOrder } from "@/app/actions/orders";
import { createPaymentOrder, verifyPayment } from "@/app/actions/payments";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const SERVICES_DATA: Record<string, any> = {
  "phd-thesis": { desc: "End-to-end support and drafting for your doctoral research thesis to meet university standards.", price: 25000, delivery: "30-45 Days", fields: { topicLabel: "Thesis Topic / Domain", topicPlaceholder: "e.g. Machine Learning in Healthcare", scopeLabel: "Word Count / Chapters", scopePlaceholder: "e.g. 5 Chapters, 20k words" }, deliverables: ["Full Thesis", "Plagiarism Report", "PPT Presentation", "Source Code"] },
  "research-paper": { desc: "High-quality research papers ready for IEEE, Scopus, or other major journals.", price: 12500, delivery: "14-21 Days", fields: { topicLabel: "Paper Topic / Domain", topicPlaceholder: "e.g. AI-Powered Stethoscope", scopeLabel: "Word Count / Page Count", scopePlaceholder: "e.g. 15k words or 50 pages" }, deliverables: ["Journal Paper", "Plagiarism Report", "PPT Presentation", "Source Code", "Submission Help"] },
  "final-year-report": { desc: "Professional project reports, technical manuals, and documentation for your final year.", price: 5000, delivery: "5-7 Days", fields: { topicLabel: "Project Topic", topicPlaceholder: "e.g. Smart IoT Home System", scopeLabel: "Page Count", scopePlaceholder: "e.g. 50-60 pages" }, deliverables: ["Project Report", "Plagiarism Report", "PPT Presentation", "Source Code"] },
  "design-patent": { desc: "Protect the unique visual look and feel of your invention with official registration.", price: 15000, delivery: "2-3 Months (Filing in 7 Days)", fields: { topicLabel: "Invention Name", topicPlaceholder: "e.g. Ergonomic Smart Mouse", scopeLabel: "Number of Views / Drawings", scopePlaceholder: "e.g. 7 views (Top, Bottom, etc.)" }, deliverables: ["Technical Drawings", "Application Forms", "Government Filing", "Status Tracking"] },
  "utility-patent": { desc: "Technical drafting and claims architecture for your functional engineering inventions.", price: 35000, delivery: "21-30 Days", fields: { topicLabel: "Invention Concept", topicPlaceholder: "e.g. Novel drone stabilization method", scopeLabel: "Number of Claims / Complexity", scopePlaceholder: "e.g. 10 claims, 3 diagrams" }, deliverables: ["Patent Draft", "Technical Diagrams", "Prior Art Search", "Government Filing"] },
  "copyright": { desc: "Officially register your software code, technical manuals, or creative works.", price: 8000, delivery: "30-45 Days", fields: { topicLabel: "Work Title / Type", topicPlaceholder: "e.g. Mobile App Source Code", scopeLabel: "Size of Work", scopePlaceholder: "e.g. 10,000 lines of code" }, deliverables: ["Copyright Application", "Government Filing", "Digital Certificate", "Source Copy"] },
  "trademark": { desc: "Register your startup logo, brand name, or tagline across India securely.", price: 10000, delivery: "6-12 Months (Filing in 3 Days)", fields: { topicLabel: "Brand Name / Logo Description", topicPlaceholder: "e.g. 'KALVEX' Wordmark", scopeLabel: "Business Classes", scopePlaceholder: "e.g. Class 9 and 42" }, deliverables: ["Trademark Search", "Application Forms", "Government Filing", "Status Tracking"] },
  "mini-project": { desc: "Pre-built or custom mini-projects featuring high-quality source code and schematics.", price: 8000, delivery: "7-10 Days", fields: { topicLabel: "Project Concept", topicPlaceholder: "e.g. Bluetooth Home Automation", scopeLabel: "Hardware/Software Requirements", scopePlaceholder: "e.g. Arduino UNO, Android App" }, deliverables: ["Source Code", "Circuit Diagrams", "Project Report", "Working Demo Video"] },
  "major-project": { desc: "Complex final-year engineering projects for CS, Electronics, and Robotics students.", price: 25000, delivery: "21-30 Days", fields: { topicLabel: "Project Domain / Topic", topicPlaceholder: "e.g. AI Drone for Crop Monitoring", scopeLabel: "Key Technologies", scopePlaceholder: "e.g. Python, YOLOv8, Raspberry Pi" }, deliverables: ["Source Code", "Hardware Implementation", "Project Report", "Research Paper", "PPT Presentation"] },
  "black-book-printing": { desc: "Premium final year black book and bond paper printing services with gold embossing and rapid 1-2 days delivery across Maharashtra.", price: 365, delivery: "1-2 Days (Pan Maharashtra)", fields: { topicLabel: "Project Cover Title", topicPlaceholder: "e.g. Smart IoT Home System", scopeLabel: "Page Count (21 to 120)", scopePlaceholder: "e.g. 45" }, deliverables: ["Gold Embossed Hard Bound Book", "Bond Paper Colour Prints", "1-2 Days Fast Delivery", "Vibrant All Pages Colour"] }
};

const PRINTING_RATES = [
  { range: "21 to 30", min: 21, max: 30, blackBook: 265, bondPaper: 280 },
  { range: "31 to 40", min: 31, max: 40, blackBook: 275, bondPaper: 290 },
  { range: "41 to 50", min: 41, max: 50, blackBook: 285, bondPaper: 300 },
  { range: "51 to 60", min: 51, max: 60, blackBook: 295, bondPaper: 315 },
  { range: "61 to 70", min: 61, max: 70, blackBook: 305, bondPaper: 330 },
  { range: "71 to 80", min: 71, max: 80, blackBook: 320, bondPaper: 340 },
  { range: "81 to 90", min: 81, max: 90, blackBook: 330, bondPaper: 355 },
  { range: "91 to 100", min: 91, max: 100, blackBook: 345, bondPaper: 375 },
  { range: "101 to 110", min: 101, max: 110, blackBook: 355, bondPaper: 395 },
  { range: "111 to 120", min: 111, max: 120, blackBook: 370, bondPaper: 415 }
];

const MAHARASHTRA_DISTRICTS = [
  "Pune", "Mumbai City", "Mumbai Suburban", "Thane", "Nagpur", "Nashik", "Chhatrapati Sambhajinagar (Aurangabad)", 
  "Solapur", "Kolhapur", "Sangli", "Satara", "Ahilyanagar (Ahmednagar)", "Jalgaon", "Nanded", "Latur", "Dhule", 
  "Amravati", "Chandrapur", "Akola", "Wardha", "Yavatmal", "Buldhana", "Bhandara", "Gondia", "Gadchiroli", 
  "Washim", "Hingoli", "Parbhani", "Jalna", "Beed", "Dharashiv (Osmanabad)", "Nandurbar", "Ratnagiri", 
  "Sindhudurg", "Raigad", "Palghar"
];

const getRate = (pages: number, type: "black_book" | "bond_paper") => {
  const rate = PRINTING_RATES.find(r => pages >= r.min && pages <= r.max);
  if (!rate) {
    if (pages < 21) return type === "black_book" ? 265 : 280;
    return type === "black_book" ? 370 : 415;
  }
  return type === "black_book" ? rate.blackBook : rate.bondPaper;
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = SERVICES_DATA[slug] || {
    desc: "Complete end-to-end services strictly adhering to quality guidelines.", price: 10000, delivery: "14-21 Days",
    fields: { topicLabel: "Project Domain / Topic", topicPlaceholder: "e.g. Technical Topic", scopeLabel: "Scope / Volume Assessment", scopePlaceholder: "e.g. 15k words or 50 pages" },
    deliverables: ["Technical Report", "Source Code", "Presentation", "CAD Models", "Plagiarism Report"]
  };

  const [printingData, setPrintingData] = useState<{
    paperType: string;
    pageCount: number | "";
    copies: number;
    shippingZone: string;
    projectTitle: string;
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    expectedDelivery: string;
    expectedDeliveryCustom: string;
  }>({
    paperType: "black_book", // "black_book" | "bond_paper"
    pageCount: 30,
    copies: 1,
    shippingZone: "Pune",
    projectTitle: "",
    recipientName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    expectedDelivery: "Standard (2 Days)",
    expectedDeliveryCustom: ""
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paying, setPaying] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>("");

  const deliverySurcharge = printingData.expectedDelivery === "Urgent (1 Day)" ? 150 : 0;
  const calculatedPrice = slug === "black-book-printing" 
    ? getRate(typeof printingData.pageCount === "number" ? printingData.pageCount : 21, printingData.paperType as any) * printingData.copies + 100 + deliverySurcharge
    : data.price;

  const serviceDetails = {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    basePrice: calculatedPrice,
    delivery: data.delivery,
    desc: data.desc,
  };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [pdfFileName, setPdfFileName] = useState<string>("");

  const isPageCountValid = slug === "black-book-printing"
    ? (typeof printingData.pageCount === "number" && printingData.pageCount >= 21 && printingData.pageCount <= 120)
    : true;

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
      let serviceTypeRaw = slug.toUpperCase().replace(/-/g, "_");
      
      let req = "";
      if (slug === "black-book-printing") {
        serviceTypeRaw = "FINAL_YEAR_REPORT";
        req = `SERVICE: Black Book & Bond Printing\nProject Cover Title: ${printingData.projectTitle}\nPaper Type: ${printingData.paperType === "black_book" ? "Regular Paper (All Pages Colour)" : "Bond Paper (All Pages Colour)"}\nPage Count: ${printingData.pageCount}\nCopies: ${printingData.copies}\nUploaded PDF: ${pdfFileName || "Not uploaded"}\n\nSHIPPING DETAILS (MAHARASHTRA ONLY):\nRecipient Name: ${printingData.recipientName}\nContact Number: ${printingData.phone}\nDistrict: ${printingData.shippingZone}\nVillage / Locality / City: ${printingData.city}\nAddress: ${printingData.address}\nPincode: ${printingData.pincode}\nExpected Delivery Target: ${printingData.expectedDelivery === "Custom" ? printingData.expectedDeliveryCustom : printingData.expectedDelivery}`;
      } else {
        req = `Topic: ${formData.topic}\nWords/Pages: ${formData.wordCount}\nDeliverables: ${formData.deliverables.join(", ")}\nGuidelines: ${formData.guidelines}`;
      }
      
      const orderRes = await createOrder({
        serviceType: serviceTypeRaw as any,
        requirements: req,
        amount: calculatedPrice,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      });

      if (!orderRes.success || !orderRes.orderId) {
        alert(orderRes.error || "Failed to initialize order.");
        setPaying(false);
        return;
      }

      setCreatedOrderId(orderRes.orderId);
      setCreatedOrderNumber(orderRes.orderNumber || "ORD-XXXXXX");

      // 2. Create the payment order on Razorpay server-side
      const payRes = await createPaymentOrder(calculatedPrice, orderRes.orderId);

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
        description: serviceDetails.title,
        order_id: payRes.id,
        handler: async function (response: any) {
          setPaying(true);
          const verifyRes = await verifyPayment(response, orderRes.orderId!);
          if (verifyRes.success) {
            setPaymentSuccess(true);
          } else {
            alert(verifyRes.error || "Payment verification failed.");
          }
          setPaying(false);
        },
        prefill: {
          name: slug === "black-book-printing" ? printingData.recipientName : (session.user.name || "Customer"),
          email: session.user.email || "customer@example.com",
          contact: slug === "black-book-printing" ? printingData.phone : "",
        },
        theme: {
          color: "#4f46e5",
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

  const [formData, setFormData] = useState({
    topic: "", 
    wordCount: "", 
    deadline: "",
    guidelines: "",
    deliverables: [] as string[],
  });

  const toggleDeliverable = (item: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.includes(item) 
        ? prev.deliverables.filter(i => i !== item)
        : [...prev.deliverables, item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push("/login");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    let serviceTypeRaw = slug.toUpperCase().replace(/-/g, "_");
    
    let req = "";
    if (slug === "black-book-printing") {
      serviceTypeRaw = "FINAL_YEAR_REPORT";
      req = `SERVICE: Black Book & Bond Printing\nProject Cover Title: ${printingData.projectTitle}\nPaper Type: ${printingData.paperType === "black_book" ? "Regular Paper (All Pages Colour)" : "Bond Paper (All Pages Colour)"}\nPage Count: ${printingData.pageCount}\nCopies: ${printingData.copies}\nUploaded PDF: ${pdfFileName || "Not uploaded"}\n\nSHIPPING DETAILS (MAHARASHTRA ONLY):\nRecipient Name: ${printingData.recipientName}\nContact Number: ${printingData.phone}\nDistrict: ${printingData.shippingZone}\nVillage / Locality / City: ${printingData.city}\nAddress: ${printingData.address}\nPincode: ${printingData.pincode}`;
    } else {
      req = `Topic: ${formData.topic}\nWords/Pages: ${formData.wordCount}\nDeliverables: ${formData.deliverables.join(", ")}\nGuidelines: ${formData.guidelines}`;
    }
    
    const res = await createOrder({
      serviceType: serviceTypeRaw as any,
      requirements: req,
      amount: serviceDetails.basePrice,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    });

    setLoading(false);
    if (res.success) {
      router.push("/dashboard/orders");
    } else {
      alert(res.error || "Failed to submit request.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  } as const;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Link href="/services" className="inline-flex items-center text-[10px] font-black text-slate-400 hover:text-blue-600 mb-12 transition-all uppercase tracking-[0.2em] group">
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Services
          </Link>

          {slug === "black-book-printing" ? (
            <div onMouseMove={handleMouseMove} onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 border-2 border-indigo-100 rounded-[3rem] p-12 md:p-20 mb-16 flex flex-col md:flex-row gap-16 items-center shadow-2xl shadow-indigo-100/10 relative overflow-hidden text-slate-800 group/card">
              <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99,102,241,0.06), transparent 75%)" } as any} />
              <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] -z-10 animate-pulse" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-amber-500/5 rounded-full blur-[80px] -z-10" />
              
              <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/15">
                  🏆 Premium Printing Desk
                </div>
                <h1 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter leading-[0.9] uppercase">
                  Final Year <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 drop-shadow-[0_0_30px_rgba(99,102,241,0.15)]">Black Book</span> Printing
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed font-bold max-w-2xl">
                  Institutional grade hard-bound print works with gold foil embossing, premium paper grades, and rapid delivery across Maharashtra.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {[
                    { title: "All Pages Colour", desc: "Vibrant & Bright", emoji: "🎨", borderHover: "hover:border-pink-400 hover:shadow-pink-500/5", bgGrad: "from-white to-pink-50/5 hover:to-pink-50/30", iconBg: "bg-pink-50/80 text-pink-600", textCol: "text-pink-600" },
                    { title: "Premium Quality", desc: "Gold Foil Embossed", emoji: "🎖️", borderHover: "hover:border-indigo-400 hover:shadow-indigo-500/5", bgGrad: "from-white to-indigo-50/5 hover:to-indigo-50/30", iconBg: "bg-indigo-50/80 text-indigo-600", textCol: "text-indigo-600" },
                    { title: "Fast Delivery", desc: "1-2 Days Delivery", emoji: "🚚", borderHover: "hover:border-cyan-400 hover:shadow-cyan-500/5", bgGrad: "from-white to-cyan-50/5 hover:to-cyan-50/30", iconBg: "bg-cyan-50/80 text-cyan-600", textCol: "text-cyan-600" },
                    { title: "Best Price", desc: "Affordable & Fair", emoji: "💰", borderHover: "hover:border-amber-400 hover:shadow-amber-500/5", bgGrad: "from-white to-amber-50/5 hover:to-amber-50/30", iconBg: "bg-amber-50/80 text-amber-600", textCol: "text-amber-600" }
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
              
              <div onMouseMove={handleMouseMove} onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} className="w-full md:w-96 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 rounded-[3rem] p-10 text-center shrink-0 shadow-2xl shadow-indigo-100/40 relative z-10 border-2 border-indigo-200/80 overflow-hidden group/calc hover:scale-[1.02] transition-all duration-550">
                <div className="absolute inset-0 opacity-0 group-hover/calc:opacity-100 group-active/calc:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99,102,241,0.06), transparent 75%)" } as any} />
                
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Calculated Cost</p>
                <div className="font-heading font-black text-6xl text-slate-900 mb-4 tracking-tighter flex items-start justify-center gap-1.5 transition-all duration-300 hover:scale-105">
                  <span className="text-2xl mt-2 text-indigo-600 font-bold">₹</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 font-black">
                    {serviceDetails.basePrice.toLocaleString()}
                  </span>
                </div>
                
                <div className="mb-6">
                  <p className="text-[10px] text-indigo-600 bg-indigo-50/80 px-4 py-1.5 rounded-full inline-block font-black uppercase tracking-widest border border-indigo-100">
                    Incl. Maharashtra Delivery
                  </p>
                </div>

                {/* Real-time Order Specs Breakdown */}
                <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl p-4 mb-6 text-left space-y-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                  <div className="flex justify-between items-center">
                    <span>Paper Selected</span>
                    <span className="text-indigo-600 font-black">
                      {printingData.paperType === "black_book" ? "📘 Regular Paper" : "📄 Bond Paper"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pages Count</span>
                    <span className="text-slate-800 font-black">{printingData.pageCount} Pages</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Copies Count</span>
                    <span className="text-slate-800 font-black">x{printingData.copies} {printingData.copies > 1 ? "Copies" : "Copy"}</span>
                  </div>
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <div className="flex justify-between items-center text-[8px] text-slate-400">
                    <span>Base Rate</span>
                    <span>₹{getRate(typeof printingData.pageCount === "number" ? printingData.pageCount : 21, printingData.paperType as any)} / copy</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-center items-center gap-3">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">1-2 Days Pan Maharashtra</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-[3rem] p-12 md:p-20 mb-16 flex flex-col md:flex-row gap-16 items-center shadow-2xl shadow-slate-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-50/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
              <div className="flex-1 space-y-10 relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20">
                  Premium Service
                </div>
                <h1 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tighter leading-[0.9]">
                  {serviceDetails.title}
                </h1>
                <p className="text-slate-400 text-xl leading-relaxed font-bold max-w-2xl">
                  {serviceDetails.desc}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-8">
                  <div className="flex items-center gap-4 text-slate-900 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                    <Clock className="w-5 h-5 text-blue-600" /> 
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Est. Delivery</p>
                      <p className="text-sm font-black">{serviceDetails.delivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-900 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-blue-600" /> 
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Security</p>
                      <p className="text-sm font-black">Identity Masked</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-96 bg-slate-900 rounded-[3rem] p-12 text-center shrink-0 shadow-2xl shadow-slate-900/40 relative z-10 border border-slate-800">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Starting Price</p>
                <div className="font-heading font-black text-6xl text-white mb-3 tracking-tighter flex items-start justify-center gap-2">
                  <span className="text-2xl mt-2 text-slate-600 font-bold">₹</span>
                  {serviceDetails.basePrice.toLocaleString()}
                </div>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Base Rate</p>
                <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Available Now</span>
                </div>
              </div>
            </div>
          )}

          {/* Multi-step Order Form */}
          <div onMouseMove={handleMouseMove} onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} className="bg-white border-2 border-indigo-100/60 rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-slate-900/5 relative overflow-hidden group/card">
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99,102,241,0.03), transparent 75%)" } as any} />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-12">
              <div>
                <h2 className="font-heading font-black text-4xl text-slate-900 tracking-tight mb-2">Service <span className="text-indigo-600">Configuration</span></h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tell us what you need</p>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-6 w-full md:w-80">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 space-y-3">
                    <div className={`h-1.5 rounded-full transition-all duration-700 ${step >= s ? "bg-indigo-600 shadow-lg shadow-indigo-600/20" : "bg-slate-100"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest block text-center ${step >= s ? "text-indigo-600" : "text-slate-300"}`}>
                      Step 0{s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <AnimatePresence mode="wait">
                {slug === "black-book-printing" ? (
                  <>
                    {step === 1 && (
                      <motion.div 
                        key="printing-step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                      >
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project / Cover Title</label>
                            <input type="text" placeholder="e.g. AI-Based Crop Detection System" value={printingData.projectTitle} onChange={(e) => setPrintingData({...printingData, projectTitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-8 py-5 text-slate-900 font-bold focus:ring-8 ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 h-[66px]" required />
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload PDF Soft Copy</label>
                            <div className={`border-2 border-dashed rounded-2xl px-8 py-4 text-center transition-all cursor-pointer flex items-center justify-between gap-4 relative group h-[66px] ${
                              pdfFileName 
                                ? "border-emerald-500 bg-emerald-50/30 text-emerald-900" 
                                : "border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-indigo-400"
                            }`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm border transition-all group-hover:scale-105 ${
                                  pdfFileName 
                                    ? "bg-white text-emerald-600 border-emerald-100" 
                                    : "bg-white text-indigo-600 border-slate-100"
                                }`}>
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                  {pdfFileName ? (
                                    <>
                                      <p className="text-xs font-black text-emerald-800 uppercase tracking-wide line-clamp-1">✓ {pdfFileName}</p>
                                      <p className="text-[8px] text-emerald-600 font-bold uppercase">Click to change</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Upload Black Book Soft Copy</p>
                                      <p className="text-[8px] text-slate-400 font-bold uppercase">PDF format up to 100MB</p>
                                    </>
                                  )}
                                </div>
                              </div>
                              <input 
                                type="file" 
                                accept=".pdf" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setPdfFileName(file.name);
                                  }
                                }} 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paper Type</label>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={() => setPrintingData({...printingData, paperType: "black_book"})}
                                className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center text-center relative overflow-hidden group/btn ${
                                  printingData.paperType === "black_book" 
                                    ? "border-indigo-600 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 text-indigo-900 shadow-xl shadow-indigo-600/8" 
                                    : "border-slate-200 bg-slate-50/30 hover:border-slate-300 text-slate-800"
                                }`}
                              >
                                {printingData.paperType === "black_book" && (
                                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[7px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest shadow-md">
                                    ★ Standard
                                  </div>
                                )}
                                <span className="text-3xl mb-2">📘</span>
                                <span className="text-[11px] font-black uppercase tracking-widest mb-1">Regular Paper</span>
                                <span className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Hard Bound Golden Embossed</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPrintingData({...printingData, paperType: "bond_paper"})}
                                className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center text-center relative overflow-hidden group/btn ${
                                  printingData.paperType === "bond_paper" 
                                    ? "border-amber-500 bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 text-amber-950 shadow-xl shadow-amber-500/8" 
                                    : "border-slate-200 bg-slate-50/30 hover:border-slate-300 text-slate-800"
                                }`}
                              >
                                {printingData.paperType === "bond_paper" && (
                                  <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[7px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest shadow-md">
                                    ★ Premium Gold
                                  </div>
                                )}
                                <span className="text-3xl mb-2">📄</span>
                                <span className="text-[11px] font-black uppercase tracking-widest mb-1">Bond Paper</span>
                                <span className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Hard Bound Golden Embossed</span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Number of Copies</label>
                            <div className="flex items-center gap-4 bg-slate-50 rounded-[2rem] p-2 border border-slate-200/60 w-full h-[82px] shadow-sm">
                              <button type="button" onClick={() => setPrintingData({...printingData, copies: Math.max(1, printingData.copies - 1)})} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-slate-500 hover:bg-slate-100 transition-all border border-slate-100 shadow-md">-</button>
                              <span className="flex-1 text-center font-black text-lg text-slate-900">{printingData.copies}</span>
                              <button type="button" onClick={() => setPrintingData({...printingData, copies: printingData.copies + 1})} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-slate-500 hover:bg-slate-100 transition-all border border-slate-100 shadow-md">+</button>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Page Count (21 to 120)</label>
                            <div className="relative">
                              <input 
                                type="number" 
                                placeholder="e.g. 45"
                                value={(printingData.pageCount as any) === "" ? "" : printingData.pageCount} 
                                onChange={(e) => {
                                  const valStr = e.target.value;
                                  if (valStr === "") {
                                    setPrintingData({...printingData, pageCount: "" as any});
                                    return;
                                  }
                                  const val = parseInt(valStr);
                                  setPrintingData({...printingData, pageCount: val});
                                }} 
                                className={`w-full bg-white border-2 rounded-2xl px-8 py-5 text-slate-900 font-black focus:ring-8 outline-none transition-all h-[66px] ${
                                  (printingData.pageCount as any) !== "" && typeof printingData.pageCount === "number" && (printingData.pageCount < 21 || printingData.pageCount > 120)
                                    ? "border-rose-400 focus:border-rose-500 ring-rose-500/10"
                                    : "border-indigo-100/80 focus:border-indigo-500 ring-indigo-600/5"
                                }`} 
                                required 
                              />
                            </div>
                            {printingData.pageCount !== "" && typeof printingData.pageCount === "number" && printingData.pageCount < 21 && (
                              <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black uppercase tracking-widest px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-sm shadow-rose-100/50">
                                ⚠️ Below 21 pages is not available. Please enter 21 to 120 pages.
                              </div>
                            )}
                            {printingData.pageCount !== "" && typeof printingData.pageCount === "number" && printingData.pageCount > 120 && (
                              <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black uppercase tracking-widest px-5 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-sm shadow-rose-100/50">
                                ⚠️ Maximum page count is 120. Please enter 21 to 120 pages.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dynamic Highlight Rate Reference */}
                        <div className="space-y-4 pt-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Interactive Printing Rates Reference (All Pages Colour)</label>
                            <a 
                              href="/rate-chart.jpg" 
                              download="KALVEX_Black_Book_Printing_Rates.jpg" 
                              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 active:translate-y-0 group/down shrink-0"
                            >
                              📥 Download Rate Chart
                            </a>
                          </div>
                          
                          <div onMouseMove={handleMouseMove} onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} className="bg-white border-2 border-indigo-100 rounded-[2.5rem] overflow-hidden shadow-xl relative group/card">
                            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99,102,241,0.06), transparent 75%)" } as any} />
                            <div className="grid grid-cols-3 bg-gradient-to-r from-indigo-50 to-purple-50/80 p-5 border-b border-indigo-100 text-[10px] font-black text-indigo-950 uppercase tracking-[0.15em] text-center">
                              <div>Page Range</div>
                              <div className="flex items-center justify-center gap-1.5 text-indigo-700 font-extrabold">
                                📘 Regular Paper
                              </div>
                              <div className="flex items-center justify-center gap-1.5 text-amber-700 font-extrabold">
                                📄 Bond Paper
                              </div>
                            </div>
                            <div className="max-h-[250px] overflow-y-auto divide-y divide-slate-100/80 font-sans text-xs text-slate-700 custom-scrollbar">
                              {PRINTING_RATES.map((r) => {
                                const isActive = typeof printingData.pageCount === "number" && printingData.pageCount >= r.min && printingData.pageCount <= r.max;
                                return (
                                  <div
                                    key={r.range}
                                    className={`grid grid-cols-3 p-5 text-center transition-all duration-300 items-center ${
                                      isActive 
                                        ? "bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/50 border-y border-indigo-200 text-indigo-950 font-black scale-[1.01] shadow-[0_4px_20px_rgba(99,102,241,0.06)]" 
                                        : "hover:bg-slate-50 text-slate-600"
                                    }`}
                                  >
                                    <div className="flex items-center justify-center gap-2">
                                      {isActive ? (
                                        <span className="relative flex h-2.5 w-2.5">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                                        </span>
                                      ) : (
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                      )}
                                      <span className={isActive ? "text-indigo-600 font-black" : "font-semibold"}>{r.range} Pages</span>
                                    </div>
                                    <div className="font-sans">
                                      <span className={`inline-block px-3 py-1 rounded-lg ${isActive ? "bg-indigo-100/60 text-indigo-700 font-extrabold" : "bg-slate-100/50 text-slate-600"}`}>
                                        ₹{r.blackBook}
                                      </span>
                                    </div>
                                    <div className="font-sans">
                                      <span className={`inline-block px-3 py-1 rounded-lg ${isActive ? "bg-amber-100/60 text-amber-700 font-extrabold" : "bg-slate-100/50 text-slate-600"}`}>
                                        ₹{r.bondPaper}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Call & WhatsApp Helper Support Widget */}
                        <div onMouseMove={handleMouseMove} onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} className="bg-gradient-to-r from-emerald-50 to-teal-50/30 border-2 border-emerald-200 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden group/card">
                          <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16,185,129,0.06), transparent 75%)" } as any} />
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.758.459 3.477 1.332 5.006L2 22l5.166-1.356c1.47.8 3.12 1.218 4.834 1.218h.005c5.505 0 9.988-4.482 9.988-9.988C22 7.482 17.518 2 12.012 2zm6.002 14.394c-.246.696-1.442 1.34-1.996 1.396-.54.054-1.056.277-3.418-.654-2.846-1.12-4.63-4.004-4.772-4.195-.14-.19-1.144-1.52-1.144-2.898 0-1.38.718-2.06.974-2.344.256-.284.56-.355.748-.355.188 0 .376.002.538.01.17.008.397-.065.62.482.23.563.784 1.913.852 2.053.067.14.112.304.018.493-.093.188-.14.304-.277.463-.138.16-.29.355-.415.477-.138.136-.282.285-.122.56.16.276.71 1.168 1.523 1.89.696.618 1.282.88 1.564 1.018.282.138.444.112.61-.082.164-.194.717-.833.91-1.12.193-.287.387-.24.653-.142.266.098 1.69.797 1.98.94.29.142.484.212.553.33.07.12.07.696-.176 1.392z"/>
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Need Direct Help?</p>
                              <p className="text-xs font-bold text-slate-600">Chat with our Printing Desk on WhatsApp</p>
                            </div>
                          </div>
                          <a 
                            href="https://wa.me/917620153491?text=Hi%20Kalvex%20team,%20I%20want%20to%20inquire%20about%20Final%20Year%20Black%20Book%20Printing." 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 shrink-0 animate-pulse-slow"
                          >
                            💬 Call & WhatsApp
                          </a>
                        </div>

                        {/* Cost Calculator Section */}
                        <div 
                          onMouseMove={handleMouseMove} 
                          onTouchMove={handleTouchMove} 
                          onTouchStart={handleTouchMove} 
                          className="p-10 rounded-[2.5rem] border-2 transition-all duration-500 shadow-xl relative overflow-hidden group/card bg-gradient-to-br from-white via-indigo-50/10 to-purple-50/20 border-indigo-200/80 hover:border-indigo-400 shadow-indigo-650/5"
                        >
                          <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 group-active/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" 
                            style={{ 
                              background: "radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99,102,241,0.06), transparent 75%)"
                            } as any} 
                          />
                          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] -z-10 bg-indigo-500/5" />
                          
                          <div className="flex justify-between items-center pb-5 border-b border-slate-200/80">
                            <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-600">Unit Printing Cost (per copy)</span>
                            <span className="text-2xl font-black text-indigo-600">
                              ₹{getRate(typeof printingData.pageCount === "number" ? printingData.pageCount : 21, printingData.paperType as any)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-600">
                              Copies Subtotal ({printingData.copies} x ₹{getRate(typeof printingData.pageCount === "number" ? printingData.pageCount : 21, printingData.paperType as any)})
                            </span>
                            <span className="text-xl font-black text-slate-800">
                              ₹{getRate(typeof printingData.pageCount === "number" ? printingData.pageCount : 21, printingData.paperType as any) * printingData.copies}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-5 border-b border-slate-200/80">
                            <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-600">Maharashtra Shipping Charges (Flat)</span>
                            <span className="text-xl font-black text-slate-700">₹100</span>
                          </div>
                          
                          <div className="pt-6 px-6 sm:px-8 pb-6 mt-6 rounded-[2rem] border-2 bg-indigo-50/70 border-indigo-150 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-inner">
                            <div className="text-left">
                              <span className="text-xs font-black uppercase tracking-[0.2em] block text-indigo-700">Grand Total</span>
                              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Pan Maharashtra Tracked Delivery</span>
                            </div>
                            <span className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 drop-shadow-[0_2px_15px_rgba(99,102,241,0.12)]">
                              ₹{calculatedPrice}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div 
                        key="printing-step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                      >
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient Name</label>
                            <input type="text" placeholder="Full Name" value={printingData.recipientName} onChange={(e) => setPrintingData({...printingData, recipientName: e.target.value})} className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-8 py-5 text-slate-900 font-bold focus:ring-8 ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 h-[66px]" required />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</label>
                            <input type="tel" placeholder="10-digit mobile number" value={printingData.phone} onChange={(e) => setPrintingData({...printingData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-8 py-5 text-slate-900 font-bold focus:ring-8 ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 h-[66px]" required />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Maharashtra District (Shipping only in MH)</label>
                            <select value={printingData.shippingZone} onChange={(e) => setPrintingData({...printingData, shippingZone: e.target.value})} className="w-full bg-slate-50 border-2 border-indigo-100/45 focus:border-indigo-500 rounded-2xl px-8 py-5 text-slate-900 font-bold focus:ring-8 ring-indigo-600/5 outline-none transition-all h-[66px]">
                              {MAHARASHTRA_DISTRICTS.map((dist) => (
                                <option key={dist} value={dist}>{dist}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Village / Locality / City</label>
                            <input type="text" placeholder="e.g. Wakad or Someshwar Village" value={printingData.city} onChange={(e) => setPrintingData({...printingData, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-8 py-5 text-slate-900 font-bold focus:ring-8 ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 h-[66px]" required />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping Address & Landmark</label>
                            <input type="text" placeholder="Flat/House No, Building name, Near temple..." value={printingData.address} onChange={(e) => setPrintingData({...printingData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-8 py-5 text-slate-900 font-bold focus:ring-8 ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 h-[66px]" required />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping Pincode</label>
                            <input type="text" placeholder="e.g. 411001" value={printingData.pincode} onChange={(e) => setPrintingData({...printingData, pincode: e.target.value})} className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-8 py-5 text-slate-900 font-bold focus:ring-8 ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 h-[66px]" required />
                          </div>
                        </div>

                        {/* Expected Delivery Date Selection Widget */}
                        <div className="space-y-4 pt-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Expected Delivery Target</label>
                          <div className="grid grid-cols-3 gap-6">
                            {[
                              { id: "Urgent (1 Day)", label: "⚡ Urgent", desc: "1 Day Delivery (+₹150)" },
                              { id: "Standard (2 Days)", label: "📦 Standard", desc: "1-2 Days Delivery" },
                              { id: "Custom", label: "📅 Custom Date", desc: "Choose date" }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setPrintingData({ ...printingData, expectedDelivery: opt.id })}
                                className={`p-6 rounded-[1.8rem] border-2 transition-all flex flex-col items-center justify-center text-center relative overflow-hidden h-[82px] ${
                                  printingData.expectedDelivery === opt.id
                                    ? "border-indigo-600 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 text-indigo-900 shadow-md shadow-indigo-600/5"
                                    : "border-slate-100 bg-slate-50/40 text-slate-650 hover:border-slate-200"
                                }`}
                              >
                                <span className="text-xs font-black uppercase tracking-wider mb-1">{opt.label}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{opt.desc}</span>
                              </button>
                            ))}
                          </div>
                          {printingData.expectedDelivery === "Custom" && (
                            <div className="mt-4">
                              <input
                                type="date"
                                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                                value={printingData.expectedDeliveryCustom}
                                onChange={(e) => setPrintingData({ ...printingData, expectedDeliveryCustom: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-8 py-5 text-slate-900 font-bold focus:ring-8 ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 h-[66px]"
                                required
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div 
                        key="printing-step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                      >
                        {!paymentSuccess ? (
                          <div className="space-y-10">
                            {/* Receipt Summary Card */}
                            <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 border-2 border-indigo-100 rounded-[3rem] p-10 shadow-xl text-slate-800">
                              <h3 className="font-heading font-black text-2xl text-slate-900 uppercase tracking-tight mb-6 pb-4 border-b border-indigo-100/60 flex items-center justify-between">
                                <span>🛒 Order Summary Receipt</span>
                                <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-4 py-1.5 rounded-full font-black">MH Delivery Only</span>
                              </h3>
                              
                              <div className="grid md:grid-cols-2 gap-8 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <div className="space-y-3.5">
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Cover Title</span>
                                    <span className="text-slate-800 font-black text-right max-w-[200px] line-clamp-1">{printingData.projectTitle}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Paper Selected</span>
                                    <span className="text-indigo-600 font-black">{printingData.paperType === "black_book" ? "📘 Regular Paper" : "📄 Bond Paper"}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Pages & Copies</span>
                                    <span className="text-slate-800 font-black">{printingData.pageCount} Pages (x{printingData.copies} {printingData.copies > 1 ? "Copies" : "Copy"})</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Expected Delivery</span>
                                    <span className="text-amber-600 font-black">{printingData.expectedDelivery === "Custom" ? printingData.expectedDeliveryCustom : printingData.expectedDelivery}</span>
                                  </div>
                                </div>
                                <div className="space-y-3.5">
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Recipient</span>
                                    <span className="text-slate-800 font-black">{printingData.recipientName}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Phone</span>
                                    <span className="text-slate-800 font-black">{printingData.phone}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>District & City</span>
                                    <span className="text-slate-800 font-black">{printingData.shippingZone}, {printingData.city}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Address</span>
                                    <span className="text-slate-800 font-black text-right max-w-[200px] line-clamp-1">{printingData.address}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-10 p-6 bg-white border-2 border-indigo-50/80 rounded-2xl flex justify-between items-center shadow-sm">
                                <div>
                                  <span className="text-xs font-black uppercase tracking-[0.2em] block text-indigo-700">Total Amount Due</span>
                                  <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Including shipping & taxes</span>
                                </div>
                                <span className="text-4xl font-black text-indigo-650">₹{calculatedPrice}</span>
                              </div>
                            </div>

                            {/* Proceed to Pay CTA */}
                            <div className="text-center space-y-6">
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> SECURE 256-BIT ENCRYPTED RAZORPAY TRANSACTION
                              </p>
                              <button
                                type="button"
                                onClick={handleRazorpayPayment}
                                disabled={paying}
                                className="w-full h-18 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-[0.25em] rounded-[1.5rem] shadow-xl shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-3"
                              >
                                {paying ? (
                                  <>
                                    <Loader2 className="w-6 h-6 animate-spin" /> Launching Razorpay Secure Tunnel...
                                  </>
                                ) : (
                                  <>
                                    💳 Pay Securely with Razorpay (₹{calculatedPrice})
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Successful Payment Tracking Progress Screen */
                          <div className="space-y-12 py-6 text-center">
                            {/* Animated Success Badge */}
                            <div className="w-28 h-28 bg-emerald-50 border-2 border-emerald-200 text-emerald-605 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl relative overflow-hidden group">
                              <Check className="w-12 h-12 text-emerald-600" />
                              <div className="absolute inset-0 rounded-[2.5rem] border-4 border-emerald-500 animate-ping opacity-10" />
                            </div>

                            <div className="space-y-3">
                              <h3 className="font-heading font-black text-4xl text-slate-900 tracking-tight uppercase">
                                Payment <span className="text-emerald-600 font-black">Successful!</span>
                              </h3>
                              <p className="text-slate-450 text-xs font-black uppercase tracking-widest">
                                Order ID: <span className="text-slate-800">{createdOrderNumber}</span>
                              </p>
                              <p className="text-slate-500 text-sm font-bold max-w-md mx-auto">
                                Thank you for your order! Your document is queued for premium gold embossed hard bound printing.
                              </p>
                            </div>

                            {/* Best-in-Class Interactive Tracking Progress Bar */}
                            <div className="max-w-xl mx-auto bg-slate-50 border border-slate-150 rounded-[3rem] p-8 md:p-10 shadow-inner relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-[50px] pointer-events-none" />
                              
                              <p className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full inline-block font-black uppercase tracking-widest mb-10">
                                📦 Real-time Shipment Tracker
                              </p>
                              
                              <div className="relative">
                                {/* Tracking Line Background */}
                                <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 rounded-full -z-10" />
                                {/* Active progress fill */}
                                <div className="absolute top-5 left-8 w-[66%] h-1 bg-emerald-500 rounded-full -z-10 transition-all duration-1000 animate-pulse" />
                                
                                <div className="grid grid-cols-4 gap-2">
                                  {[
                                    { step: 1, label: "Paid", emoji: "💳", active: true, done: true },
                                    { step: 2, label: "Received", emoji: "📥", active: true, done: true },
                                    { step: 3, label: "Printing", emoji: "🖨️", active: true, done: false, pulse: true },
                                    { step: 4, label: "Transit", emoji: "🚚", active: false, done: false }
                                  ].map((track) => (
                                    <div key={track.step} className="flex flex-col items-center">
                                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg border-2 shadow-sm transition-all duration-500 ${
                                        track.done 
                                          ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10 scale-105"
                                          : track.pulse
                                            ? "bg-indigo-650 border-indigo-650 text-white scale-110 shadow-lg shadow-indigo-650/20 animate-bounce"
                                            : "bg-white border-slate-200 text-slate-400"
                                      }`}>
                                        {track.done ? "✓" : track.emoji}
                                      </div>
                                      <span className={`text-[8px] font-black uppercase tracking-wider mt-3 ${
                                        track.done 
                                          ? "text-emerald-600 font-extrabold" 
                                          : track.pulse 
                                            ? "text-indigo-650 font-extrabold"
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
                                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest h-14 px-8 rounded-xl transition-all shadow-md"
                              >
                                📂 Go to Orders Dashboard
                              </Link>
                              <button 
                                type="button"
                                onClick={() => {
                                  // Reset back to Step 1 for a new print configuration
                                  setStep(1);
                                  setPaymentSuccess(false);
                                  setPrintingData({
                                    ...printingData,
                                    projectTitle: "",
                                    recipientName: "",
                                    phone: "",
                                    address: "",
                                    city: "",
                                    pincode: "",
                                    expectedDelivery: "Standard (2 Days)",
                                    expectedDeliveryCustom: ""
                                  });
                                  setPdfFileName("");
                                }} 
                                className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-655 text-[10px] font-black uppercase tracking-widest h-14 px-8 rounded-xl transition-all"
                              >
                                🔄 Print Another Book
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <>
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
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{data.fields.topicLabel}</label>
                            <input type="text" placeholder={data.fields.topicPlaceholder} value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-slate-900 font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200" required />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deadline Target</label>
                            <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-slate-900 font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all" required />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{data.fields.scopeLabel}</label>
                          <input type="text" placeholder={data.fields.scopePlaceholder} value={formData.wordCount} onChange={(e) => setFormData({...formData, wordCount: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-slate-900 font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200" required />
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                      >
                        <div className="space-y-8">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">What do you need?</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {data.deliverables.map((item: string) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleDeliverable(item)}
                                className={`p-6 rounded-3xl border-2 transition-all duration-500 flex items-center justify-between group ${
                                  formData.deliverables.includes(item) 
                                    ? "border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-600/5" 
                                    : "border-slate-100 bg-slate-50 hover:border-slate-200"
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.deliverables.includes(item) ? "bg-blue-600 text-white" : "bg-white text-slate-300"}`}>
                                    <Check className="w-5 h-5" />
                                  </div>
                                  <span className={`text-[11px] font-black uppercase tracking-widest text-left ${formData.deliverables.includes(item) ? "text-slate-900" : "text-slate-400"}`}>
                                    {item}
                                  </span>
                                </div>
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border-2 ${formData.deliverables.includes(item) ? "bg-blue-600 border-blue-600 text-white scale-110" : "bg-white border-slate-100 text-transparent"}`}>
                                  <Check className="w-3 h-3" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Guidelines</label>
                          <textarea rows={5} placeholder="Include any specific rules, formats, or preferences..." value={formData.guidelines} onChange={(e) => setFormData({...formData, guidelines: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-slate-900 font-black focus:ring-8 ring-blue-600/5 focus:border-blue-600 outline-none transition-all placeholder:text-slate-200 resize-none" />
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                      >
                        {!paymentSuccess ? (
                          <div className="space-y-10">
                            {/* Receipt Summary Card */}
                            <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 border-2 border-indigo-100 rounded-[3rem] p-10 shadow-xl text-slate-800">
                              <h3 className="font-heading font-black text-2xl text-slate-900 uppercase tracking-tight mb-6 pb-4 border-b border-indigo-100/60 flex items-center justify-between">
                                <span>📋 Order Configuration Receipt</span>
                                <span className="text-xs text-indigo-650 bg-indigo-50 border border-indigo-100/50 px-4 py-1.5 rounded-full font-black">Verified Service</span>
                              </h3>
                              
                              <div className="grid md:grid-cols-2 gap-8 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <div className="space-y-3.5">
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Service Title</span>
                                    <span className="text-slate-800 font-black text-right max-w-[200px] line-clamp-1">{serviceDetails.title}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Project Topic</span>
                                    <span className="text-indigo-600 font-black text-right max-w-[200px] line-clamp-1">{formData.topic}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Deadline Target</span>
                                    <span className="text-slate-800 font-black">{formData.deadline}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-150 pb-2">
                                    <span>Scope / Volume</span>
                                    <span className="text-slate-800 font-black">{formData.wordCount}</span>
                                  </div>
                                </div>
                                <div className="space-y-3.5">
                                  <div className="flex flex-col gap-2">
                                    <span>Selected Deliverables:</span>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                      {formData.deliverables.map((d) => (
                                        <span key={d} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-black uppercase px-2.5 py-1 rounded-lg">
                                          ✓ {d}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2 pt-2">
                                    <span>Guidelines:</span>
                                    <span className="text-slate-800 font-bold lowercase normal-case text-[10px] leading-relaxed line-clamp-2 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                                      {formData.guidelines || "No additional guidelines provided."}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-10 p-6 bg-white border-2 border-indigo-50/80 rounded-2xl flex justify-between items-center shadow-sm">
                                <div>
                                  <span className="text-xs font-black uppercase tracking-[0.2em] block text-indigo-700">Total Amount Due</span>
                                  <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Standard package rate</span>
                                </div>
                                <span className="text-4xl font-black text-indigo-650">₹{calculatedPrice.toLocaleString()}</span>
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
                                  className="flex-[2] h-18 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-[0.25em] rounded-[1.5rem] shadow-xl shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                  {paying ? (
                                    <>
                                      <Loader2 className="w-6 h-6 animate-spin" /> Tunneling...
                                    </>
                                  ) : (
                                    <>
                                      💳 Pay Securely (₹{calculatedPrice.toLocaleString()})
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Successful Payment Tracking Progress Screen */
                          <div className="space-y-12 py-6 text-center">
                            {/* Animated Success Badge */}
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
                                Thank you for your order! Your request has been queued in the Kalvex Expert Dashboard.
                              </p>
                            </div>

                            {/* Best-in-Class Interactive Tracking Progress Bar for Research/Projects */}
                            <div className="max-w-xl mx-auto bg-slate-50/80 backdrop-blur-md border border-slate-200/60 rounded-[3rem] p-8 md:p-10 shadow-inner relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-[50px] pointer-events-none" />
                              
                              <p className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full inline-block font-black uppercase tracking-widest mb-10">
                                🎯 Real-time Project Tracker
                              </p>
                              
                              <div className="relative">
                                {/* Tracking Line Background */}
                                <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 rounded-full -z-10" />
                                {/* Active progress fill */}
                                <div className="absolute top-5 left-8 w-[66%] h-1 bg-emerald-500 rounded-full -z-10 transition-all duration-1000 animate-pulse" />
                                
                                <div className="grid grid-cols-4 gap-2">
                                  {[
                                    { step: 1, label: "Paid", emoji: "💳", active: true, done: true },
                                    { step: 2, label: "Confirmed", emoji: "🎯", active: true, done: true },
                                    { step: 3, label: "Working", emoji: "✍️", active: true, done: false, pulse: true },
                                    { step: 4, label: "Delivery", emoji: "📁", active: false, done: false }
                                  ].map((track) => (
                                    <div key={track.step} className="flex flex-col items-center">
                                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg border-2 shadow-sm transition-all duration-500 ${
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
                                  // Reset back to Step 1 for a new configuration
                                  setStep(1);
                                  setPaymentSuccess(false);
                                  setFormData({
                                    topic: "",
                                    wordCount: "",
                                    deadline: "",
                                    guidelines: "",
                                    deliverables: []
                                  });
                                }} 
                                className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest h-14 px-8 rounded-xl transition-all bg-white flex-1"
                              >
                                🔄 Book Another
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>

              {step < 3 && (
                <div className="flex flex-col sm:flex-row gap-6 pt-12">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="border-slate-100 text-slate-400 h-16 px-12 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all duration-500">
                      Back
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    disabled={loading || !isPageCountValid} 
                    className={`h-16 px-16 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl group ${
                      !isPageCountValid
                        ? "bg-rose-600/90 text-white cursor-not-allowed ml-auto border border-rose-200/50 shadow-rose-200/20"
                        : step < 3 
                          ? "bg-slate-900 hover:bg-indigo-600 text-white shadow-slate-900/20 ml-auto" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 w-full"
                    }`}
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 mr-4 animate-spin" /> Submitting...</>
                    ) : !isPageCountValid ? (
                      "⚠️ Enter Valid Page Count (21-120)"
                    ) : step < 3 ? (
                      <>Next Step <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
