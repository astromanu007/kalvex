"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, Sparkles, GraduationCap, 
  CheckCircle2, Clock, ShieldCheck, 
  Cpu, FileText, Check, Landmark, AlertCircle, RefreshCw
} from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
} as const;

interface Question {
  q: string;
  opts: string[];
  ans: number;
}

const SCREENING_QUESTIONS: Record<string, Question[]> = {
  "Computer Science / AIML": [
    { q: "What is the primary loss function used for binary classification tasks?", opts: ["Mean Squared Error", "Binary Cross-Entropy", "Categorical Cross-Entropy", "Huber Loss"], ans: 1 },
    { q: "Which learning rate scheduler decreases learning rate by a factor of 10 periodically?", opts: ["Cosine Annealing", "StepLR", "ReduceLROnPlateau", "ExponentialLR"], ans: 1 },
    { q: "What does the self-attention mechanism in Transformers compute?", opts: ["Convolutional filters", "Scaled dot-product weights", "Recurrent hidden states", "MaxPooling coordinates"], ans: 1 },
    { q: "In Python, which keyword allows generators to delegate operations to another generator?", opts: ["yield from", "delegate", "yield", "await"], ans: 0 }
  ],
  "Electronics & IoT": [
    { q: "Which communication protocol uses exactly two lines (SDA and SCL)?", opts: ["SPI", "UART", "I2C", "CAN Bus"], ans: 2 },
    { q: "What is the typical operating voltage range of an ESP32 microcontroller module?", opts: ["5.0V - 12.0V", "1.8V - 3.6V", "3.3V - 5.0V", "12.0V - 24V"], ans: 1 },
    { q: "What component is used to prevent high-frequency noise from corrupting analog sensor readings?", opts: ["Decoupling Capacitor", "Flyback Diode", "Pull-up Resistor", "Zener Diode"], ans: 0 },
    { q: "Which ADC resolution offers 4096 discrete voltage mapping levels?", opts: ["8-bit", "10-bit", "12-bit", "16-bit"], ans: 2 }
  ],
  "Biotechnology & Life Sciences": [
    { q: "Which molecular method is widely used to selectively amplify target DNA sequences?", opts: ["ELISA", "Polymerase Chain Reaction (PCR)", "Western Blotting", "SDS-PAGE"], ans: 1 },
    { q: "What codon serves as the universal translation initiation signal in mRNA?", opts: ["UAA", "UAG", "AUG", "UGA"], ans: 2 },
    { q: "In genetic engineering, which enzymes function as molecular scissors to cut DNA?", opts: ["Ligases", "Polymerases", "Restriction Endonucleases", "Helicases"], ans: 2 },
    { q: "What model organism is primarily utilized for exploring eukaryotic cellular molecular biology?", opts: ["E. coli", "Saccharomyces cerevisiae", "Arabidopsis thaliana", "Caenorhabditis elegans"], ans: 1 }
  ]
};

export default function ApplyExpertPage() {
  const { width, height } = useWindowSize();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("Computer Science / AIML");

  // Form Profile States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("");

  // Test Simulation States
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testActive, setTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [score, setScore] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<"PASS" | "FAIL" | null>(null);

  // Mock Sandbox State
  const [claimedOrders, setClaimedOrders] = useState<string[]>([]);
  const [walletBalance, setWalletBalance] = useState(12400);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (testActive && timeLeft === 0) {
      evaluateTest();
    }
    return () => clearTimeout(timer);
  }, [testActive, timeLeft]);

  const handleStartTest = () => {
    setAnswers({});
    setTimeLeft(180);
    setTestActive(true);
    setStep(2);
  };

  const evaluateTest = () => {
    setTestActive(false);
    const questions = SCREENING_QUESTIONS[domain] || SCREENING_QUESTIONS["Computer Science / AIML"];
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.ans) {
        correct++;
      }
    });
    const percentage = (correct / questions.length) * 100;
    setScore(percentage);
    if (percentage >= 75) {
      setTestResult("PASS");
    } else {
      setTestResult("FAIL");
    }
  };

  const claimOrder = (id: string) => {
    if (!claimedOrders.includes(id)) {
      setClaimedOrders([...claimedOrders, id]);
    }
  };

  const handleWithdrawal = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setWalletBalance(0);
      setWithdrawSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-40 pb-32 bg-slate-50 relative overflow-hidden font-sans text-slate-800">
      <Navbar />
      {testResult === "PASS" && step === 3 && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} gravity={0.2} style={{ zIndex: 100 }} />}

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Recruitment Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-emerald-600/15">
            💼 Experts & Freelancers Workspace
          </div>
          <h1 className="font-heading font-black text-5xl md:text-7xl text-slate-900 tracking-tight leading-[0.9] uppercase">
            Join the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-650 drop-shadow-[0_0_20px_rgba(16,185,129,0.15)]">Kalvex Elite</span> Desk
          </h1>
          <p className="text-slate-450 text-base font-bold max-w-2xl mx-auto leading-relaxed">
            Apply as an expert research advisor, scientific copywriter, or electronics engineer. Get vetted, claim tasks, and secure high-value milestone payouts!
          </p>
        </motion.div>

        {/* Dynamic Wizard Steps */}
        <div className="bg-white border-2 border-emerald-100/60 rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group/card">
          <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" style={{ background: "radial-gradient(600px circle at 50% 50%, rgba(16,185,129,0.02), transparent 75%)" }} />

          {/* Stepper progress */}
          <div className="flex items-center gap-6 w-full max-w-md mx-auto mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 space-y-3">
                <div className={`h-1.5 rounded-full transition-all duration-700 ${step >= s ? "bg-emerald-600 shadow-lg shadow-emerald-600/20" : "bg-slate-100"}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest block text-center ${step >= s ? "text-emerald-600" : "text-slate-350"}`}>
                  {s === 1 ? "Profile" : s === 2 ? "Screening Exam" : "Verified Portal"}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* STEP 1: Profile Application */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="font-heading font-black text-2xl text-slate-900 uppercase">Apply to the Desk</h3>
                  <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Fill in your academic profile to initiate the vetting process</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <input type="text" placeholder="Dr. Sarah Jenkins" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" required />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                    <input type="email" placeholder="sarah.jenkins@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highest Academic Degree</label>
                    <input type="text" placeholder="PhD in ECE / M.Tech in AIML" value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" required />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Domain Expertise</label>
                    <select value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all">
                      <option value="Computer Science / AIML">Computer Science / AIML</option>
                      <option value="Electronics & IoT">Electronics & IoT</option>
                      <option value="Biotechnology & Life Sciences">Biotechnology & Life Sciences</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Brief Research Background / Industry Experience</label>
                  <textarea rows={4} placeholder="Summarize your prior publications, coding/hardware projects, or academic advising experience..." value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none" required />
                </div>

                <Button onClick={handleStartTest} disabled={!name || !email || !degree || !experience} className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-emerald-600/15">
                  Begin Vetting Screening Test ⚡
                </Button>
              </motion.div>
            )}

            {/* STEP 2: Screening MCQ Test */}
            {step === 2 && testActive && (
              <motion.div key="step2-active" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading font-black text-2xl text-slate-900 uppercase">Screening Exam</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Domain: {domain}</p>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-pulse" /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} min left
                  </div>
                </div>

                {/* MCQs List */}
                <div className="space-y-10">
                  {(SCREENING_QUESTIONS[domain] || SCREENING_QUESTIONS["Computer Science / AIML"]).map((q, qIdx) => (
                    <div key={qIdx} className="space-y-4">
                      <p className="text-sm font-black text-slate-900 flex items-start gap-3">
                        <span className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs shrink-0">{qIdx + 1}</span>
                        {q.q}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3 pl-9">
                        {q.opts.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => setAnswers({ ...answers, [qIdx]: oIdx })}
                            className={`p-4 rounded-xl border-2 transition-all font-bold text-xs text-left ${
                              answers[qIdx] === oIdx
                                ? "border-emerald-600 bg-emerald-50/40 text-slate-900"
                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-100"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={evaluateTest} className="w-full h-16 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-slate-900/10 mt-6">
                  Submit Exam & Grade 📝
                </Button>
              </motion.div>
            )}

            {/* STEP 2: Exam Score Results FAIL/PASS */}
            {step === 2 && !testActive && testResult && (
              <motion.div key="step2-result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center py-10 space-y-8">
                {testResult === "PASS" ? (
                  <>
                    <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-200 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-lg relative overflow-hidden group">
                      <Check className="w-10 h-10" />
                      <div className="absolute inset-0 rounded-[2.5rem] border-4 border-emerald-500 animate-ping opacity-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading font-black text-3xl text-slate-900 uppercase">Vetting Test Passed!</h3>
                      <p className="text-emerald-600 text-xs font-black uppercase tracking-widest">Score: {score}% (Pass threshold: 75%)</p>
                      <p className="text-slate-450 text-sm font-bold max-w-md mx-auto mt-2 leading-relaxed">
                        Fantastic job! Your scientific and analytical domain expertise meets our elite writing quality requirements. Your profile is verified.
                      </p>
                    </div>
                    <Button onClick={() => setStep(3)} className="w-full max-w-sm h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-emerald-600/15">
                      Enter Vetted Expert Dashboard Workspace ➜
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-rose-50 border-2 border-rose-200 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-lg">
                      <AlertCircle className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading font-black text-3xl text-slate-900 uppercase">Test Unsuccessful</h3>
                      <p className="text-rose-600 text-xs font-black uppercase tracking-widest">Score: {score}% (Required: 75%)</p>
                      <p className="text-slate-450 text-sm font-bold max-w-md mx-auto mt-2 leading-relaxed">
                        Unfortunately, your answers did not satisfy our minimum quality benchmarks for scientific copywriters. You can review and attempt again.
                      </p>
                    </div>
                    <Button onClick={() => setStep(1)} className="w-full max-w-sm h-16 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-slate-900/10">
                      🔄 Try Again
                    </Button>
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 3: Vetted Expert Dashboard Sandbox */}
            {step === 3 && testResult === "PASS" && (
              <motion.div key="step3-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                      👨‍🔬
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-black text-xl text-slate-900 uppercase tracking-wide">{name}</h3>
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5" /> VETTED EXPERT
                        </span>
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Domain Specialist / Vetted Researcher</p>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-3xl text-right flex items-center gap-4 min-w-[200px] justify-between shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-[20px]" />
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Wallet Balance</p>
                      <p className="text-xl font-heading font-black tracking-tight text-white mt-1">₹{walletBalance.toLocaleString()}</p>
                    </div>
                    {walletBalance > 0 ? (
                      <button
                        onClick={handleWithdrawal}
                        disabled={withdrawing}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {withdrawing ? "Transferring..." : "Withdraw"}
                      </button>
                    ) : (
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                        ✓ Transfer Completed
                      </span>
                    )}
                  </div>
                </div>

                {withdrawSuccess && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl flex items-start gap-4">
                    <Landmark className="w-5 h-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider">UPI Instant Payout Complete</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mt-1">₹12,400 has been transferred successfully to your registered bank account via UPI instant escrow network.</p>
                    </div>
                  </motion.div>
                )}

                {/* Available Client Tasks Bidding Portal */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">🛒 Active Client Orders Queue ({5 - claimedOrders.length} available)</h4>
                  <div className="grid gap-4">
                    {[
                      { id: "ORD-988392", title: "Wireless Sensor Network Thesis Writing", scope: "120 Pages / 4 Chapters", payout: 8500, time: "Fulfillment target: 12 days", client: "Mumbai Dept" },
                      { id: "ORD-122485", title: "SPSS Data Analysis on Clinical Datasets", scope: "Simulation & Reporting", payout: 5200, time: "Fulfillment target: 5 days", client: "Pune Dept" },
                      { id: "ORD-993201", title: "Smart Crop Irrigation IoT Project Coding", scope: "ESP32 Software & Schematic", payout: 4800, time: "Fulfillment target: 3 days", client: "Nashik Dept" },
                      { id: "ORD-554289", title: "Research Paper Review & Layout Formatting", scope: "IEEE Two‑Column Refactoring", payout: 2400, time: "Fulfillment target: 2 days", client: "Individual" }
                    ].map((order) => (
                      <div key={order.id} className={`bg-white border-2 rounded-[2rem] p-6 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg ${claimedOrders.includes(order.id) ? "border-slate-100 opacity-60 pointer-events-none" : "border-slate-100/80 hover:border-emerald-200"}`}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{order.id}</span>
                            <span className="bg-slate-50 border border-slate-100 px-3 py-0.5 rounded-full text-[8px] font-bold text-slate-500 uppercase tracking-widest">{order.client}</span>
                          </div>
                          <p className="text-sm font-black text-slate-900">{order.title}</p>
                          <div className="flex items-center gap-4 text-[9px] font-bold text-slate-450 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-350" /> {order.scope}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-350" /> {order.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 justify-between md:justify-end">
                          <div className="text-left md:text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Payout Fee</p>
                            <p className="text-lg font-heading font-black text-emerald-600">₹{order.payout.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => claimOrder(order.id)}
                            className="h-12 bg-slate-900 hover:bg-emerald-600 text-white shadow-md font-black text-[9px] uppercase tracking-widest px-6 rounded-xl transition-all"
                          >
                            Claim Task ⚡
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Claimed Tasks Workspace */}
                {claimedOrders.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-10 border-t border-slate-150">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">📂 Active Claimed Tasks Workspace ({claimedOrders.length})</h4>
                    <div className="grid gap-4">
                      {claimedOrders.map((id) => (
                        <div key={id} className="bg-emerald-50/20 border border-emerald-100 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{id}</span>
                              <span className="bg-emerald-100/50 text-emerald-800 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">IN PROGRESS</span>
                            </div>
                            <p className="text-sm font-black text-slate-900">
                              {id === "ORD-988392" ? "Wireless Sensor Network Thesis Writing" :
                               id === "ORD-122485" ? "SPSS Data Analysis on Clinical Datasets" :
                               id === "ORD-993201" ? "Smart Crop Irrigation IoT Project Coding" :
                               "Research Paper Review & Layout Formatting"}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Drafting files... Payout locked securely in escrow ledger.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              // Simulate file submission
                              alert("File successfully submitted for client and admin verification!");
                              setClaimedOrders(claimedOrders.filter(o => o !== id));
                              setWalletBalance(prev => prev + 4500); // add simulated task fee
                            }}
                            className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase tracking-widest px-6 rounded-xl transition-all shadow-md"
                          >
                            Submit Draft Work 📤
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
