"use client";

import { useSession } from "next-auth/react";
import { Star, MessageSquare, ShieldAlert, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReviewsPage() {
  const { data: session } = useSession();

  const REVIEWS = [
    { id: "REV-102", service: "PhD Thesis Consultation", rating: 5, comment: "Exceptional assistance! The technical review and references mapping saved me weeks of manual drafting.", date: "2026-05-24", verified: true },
    { id: "REV-045", service: "Black Book Printing", rating: 5, comment: "The gold foil embossing and premium bond paper quality are amazing. Super quick 24 hours home delivery.", date: "2026-05-18", verified: true }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-slate-900">My Reviews</h1>
        <p className="text-slate-400 text-sm mt-1">Check reviews you've written, and view platform feedback badges</p>
      </div>

      {/* Summary Row */}
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { label: "Average Rating", value: "5.0", desc: "Based on all reviews", icon: Star, color: "text-amber-500 bg-amber-50" },
          { label: "Total Submissions", value: REVIEWS.length.toString(), desc: "Verified testimonials", icon: MessageSquare, color: "text-indigo-600 bg-indigo-50" },
          { label: "Trust Score", value: "100%", desc: "Complete NDAs maintained", icon: Award, color: "text-emerald-600 bg-emerald-50" }
        ].map((block) => (
          <div key={block.label} className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${block.color}`}>
              <block.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-mono font-black text-slate-800">{block.value}</span>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{block.label}</h4>
              <p className="text-[8px] font-bold text-slate-350 uppercase tracking-widest mt-1">{block.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Review Section */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-6">
        <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider">Submitted Reviews</h3>
        
        <div className="divide-y divide-slate-100">
          {REVIEWS.map((rev) => (
            <div key={rev.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1 rounded-lg">
                    {rev.id}
                  </span>
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-wide">
                    {rev.service}
                  </span>
                </div>
                
                <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-2xl">
                  "{rev.comment}"
                </p>
                
                <div className="flex items-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  <span>Reviewed on {rev.date}</span>
                  {rev.verified && <span className="text-emerald-500 font-extrabold flex items-center gap-1">✓ Verified Purchase</span>}
                </div>
              </div>

              {/* Rating block */}
              <div className="flex gap-1 shrink-0 pt-1">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
