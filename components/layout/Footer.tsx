import Link from "next/link";
import { Linkedin, Twitter, Instagram, Youtube, MapPin, Mail, Phone, CheckCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Column 1: Brand */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center font-heading font-black text-white shadow-2xl shadow-slate-900/20 group-hover:bg-blue-600 transition-all duration-500">K</div>
              <span className="font-heading font-black text-2xl tracking-tighter text-slate-900">
                KALVEX
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              India&apos;s premier ecosystem for Engineering Excellence. Bridging the gap between academic innovation and industrial standards.
            </p>
            <div className="flex items-center space-x-4">
              {[
                { icon: Linkedin, color: "hover:text-[#0077B5]" },
                { icon: Twitter, color: "hover:text-[#1DA1F2]" },
                { icon: Instagram, color: "hover:text-[#E4405F]" },
                { icon: Youtube, color: "hover:text-[#FF0000]" },
              ].map((social, i) => (
                <a key={i} href="#" className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 ${social.color} hover:bg-white hover:shadow-xl transition-all duration-300`}>
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Professional Services</h3>
            <ul className="space-y-4">
              {[
                { name: "PhD Thesis Guidance", href: "/services/phd-thesis" },
                { name: "IEEE Paper Drafting", href: "/services/research-paper" },
                { name: "AI Design Patent Lab", href: "/patent-drafter" },
                { name: "IPR & Copyrights", href: "/ipr" },
                { name: "Major Project Engineering", href: "/projects" },
                { name: "Precision Components", href: "/electronics" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-600 text-[13px] font-bold hover:text-blue-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Governance */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Institutional</h3>
            <ul className="space-y-4">
              {["About Us", "Institutional Blog", "Career Openings", "Contact Support", "Legal Policy", "Terms of Use"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="text-slate-600 text-[13px] font-bold hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">Headquarters</h3>
            <ul className="space-y-5">
              <li className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-slate-600 text-[13px] font-medium leading-relaxed">Tech Park, Hinjewadi Phase 1, Pune, MH 411057</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <a href="mailto:official@kalvex.in" className="text-slate-600 text-[13px] font-bold hover:text-blue-600 transition-colors">official@kalvex.in</a>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 text-[13px] font-bold hover:text-emerald-600 transition-colors">WhatsApp Support</a>
              </li>
            </ul>
            
            <div className="mt-10 p-5 bg-slate-900 rounded-3xl flex items-center gap-4 shadow-2xl shadow-slate-900/20">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Protocol</p>
                <p className="text-xs font-bold text-white">Razorpay Encrypted</p>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Kalvex Institutional Technologies.
          </p>
          <div className="flex items-center space-x-8 text-slate-400 text-[11px] font-black uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
            <div className="h-4 w-px bg-slate-100" />
            <span className="flex items-center gap-2">Build with <span className="text-blue-600">Precision</span> in Pune</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

