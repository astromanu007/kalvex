"use client";

import { useSession } from "next-auth/react";
import { HelpCircle, Mail, MessageSquare, PhoneCall, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpIntelPage() {
  const { data: session } = useSession();

  const FAQS = [
    { q: "How long does a Black Book printing order take?", a: "Standard delivery across Maharashtra takes 2 days. Urgent printing option compiles and delivers within 24 hours." },
    { q: "Can I directly communicate with my assigned writer or developer?", a: "Yes, once your order payment is verified, you can access the 'Messages' secure corridor to message your assigned expert." },
    { q: "Is my payment safe?", a: "Yes, all transactions are secured and processed using institutional Razorpay checkout layers. No credit card details are ever stored on our servers." },
    { q: "How do I claim student discount benefits?", a: "Register using a valid student email or upload your student ID inside the 'Academic Info' tab in your Profile page." }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-slate-900">Help & Support</h1>
        <p className="text-slate-400 text-sm mt-1">Get immediate answers, platform documentation, and contact our desk</p>
      </div>

      {/* FAQs list */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-indigo-650" />
          <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Frequently Asked Questions</h3>
        </div>

        <div className="grid gap-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/60 space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Q: {faq.q}</h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact desk widgets */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* WhatsApp widget */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50/20 border border-emerald-100 rounded-[2rem] p-8 space-y-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-emerald-800 uppercase tracking-wider">WhatsApp Printing Desk</h3>
            <p className="text-[10px] font-semibold text-emerald-600 leading-relaxed uppercase tracking-wider mt-1">
              Connect directly with our printing department for immediate black book layouts updates and proofing reviews.
            </p>
          </div>
          <a
            href="https://wa.me/917620153491?text=Hi%20Kalvex%20team,%20I%20have%20an%20active%20order%20and%2520need%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5"
          >
            💬 Open WhatsApp Chat
          </a>
        </div>

        {/* Email support widget */}
        <div className="bg-slate-950 text-white rounded-[2rem] p-8 space-y-5 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-slate-100 uppercase tracking-wider">Email Intel Desk</h3>
              <p className="text-[10px] font-semibold text-slate-400 leading-relaxed uppercase tracking-wider mt-1">
                For custom thesis developments, patent drafting, academic inquiries, or invoice revisions.
              </p>
            </div>
          </div>
          <a
            href="mailto:support@kalvex.com"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 w-max shadow-lg shadow-indigo-600/10 hover:-translate-y-0.5"
          >
            ✉️ Email Support
          </a>
        </div>
      </div>
    </div>
  );
}
