import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-[80vh] bg-slate-50 pt-40 pb-32 px-4 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-600/5 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-3xl mx-auto text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] hover:border-blue-600/20">
        <div className="absolute inset-0 bg-blue-600/3 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] pointer-events-none" />
        <div className="inline-flex items-center gap-3 bg-blue-600/10 text-blue-600 px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/5">
          <Sparkles className="w-5 h-5" /> Legal
        </div>
        <h1 className="font-heading font-black text-6xl text-slate-900 tracking-tight">
          Terms of <span className="text-blue-600">Service</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xl mx-auto">
          Our terms and conditions are currently being reviewed by our legal team. Check back soon.
        </p>
        <div className="pt-8">
          <Link href="/" className="inline-flex items-center justify-center bg-slate-900 hover:bg-blue-600 text-white rounded-xl px-8 h-12 font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-600/20 text-sm">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
