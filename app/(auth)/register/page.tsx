"use client";

import Link from "next/link";
import { User, GraduationCap, Code, PenTool, Building2, ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const ROLES = [
  {
    id: "user",
    label: "Client Node",
    icon: User,
    desc: "For professionals, startups, and innovators procuring components or commissioning advanced engineering services.",
    accent: "blue"
  },
  {
    id: "student",
    label: "Research Node",
    icon: GraduationCap,
    desc: "For engineering students and academic researchers accessing institutional projects, reports, and priority discounts.",
    accent: "slate"
  },
  {
    id: "writer",
    label: "Scholar Node",
    icon: PenTool,
    desc: "Apply to join our elite network of academic and patent writers. Earn per high-stakes research commission.",
    accent: "blue"
  },
  {
    id: "developer",
    label: "Engineer Node",
    icon: Code,
    desc: "Apply as a KALVEX Partner Engineer. Build proprietary systems, prototypes, and platforms at scale.",
    accent: "slate"
  },
  {
    id: "affiliate",
    label: "Alliance Node",
    icon: Building2,
    desc: "Promote KALVEX and earn institutional commissions on every verified referral conversion.",
    accent: "blue"
  },
];

export default function RegisterHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-40 pb-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-600/5 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-20 space-y-6"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Shield className="w-4 h-4" /> Node Initialization
          </div>
          <h1 className="font-heading font-black text-6xl text-slate-900 tracking-tighter">
            Select Your <span className="text-blue-600">Classification</span>
          </h1>
          <p className="text-slate-400 font-bold text-xl max-w-xl mx-auto">
            Choose the node type that defines your role within the KALVEX institutional ecosystem.
          </p>
        </motion.div>

        {/* Role Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {ROLES.map((r) => (
            <motion.div key={r.id} variants={fadeInUp} whileHover={{ y: -12 }}>
              <Link href={`/register/${r.id}`} className="block group">
                <div className="h-full p-10 rounded-[3rem] border-2 border-slate-100 bg-white hover:border-blue-600/30 hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/3 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />

                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 shadow-xl ${
                    r.accent === "blue" ? "bg-blue-600 shadow-blue-600/20" : "bg-slate-900 shadow-slate-900/20"
                  }`}>
                    <r.icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-grow space-y-4 mb-8">
                    <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{r.label}</h3>
                    <p className="text-slate-400 text-[13px] font-bold leading-relaxed">{r.desc}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-blue-600 transition-colors pt-6 border-t border-slate-50">
                    Initialize Node <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
            Already authorized?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 transition-colors">
              Access your Node
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
