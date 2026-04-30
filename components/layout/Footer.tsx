import Link from "next/link";
import { Linkedin, Twitter, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                KALVEX
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              India's #1 Platform for Engineering Excellence. Your trusted partner for projects, research, patents, and components.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary hover:text-accent-secondary hover:bg-accent-secondary/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary hover:text-accent-danger hover:bg-accent-danger/10 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Our Services</h3>
            <ul className="space-y-3">
              {[
                { name: "PhD Thesis Writing", href: "/services/phd-thesis" },
                { name: "Research Paper Publication", href: "/services/research-paper" },
                { name: "Design Patent Auto-Drafter", href: "/patent-drafter" },
                { name: "Copyright & Trademark", href: "/ipr" },
                { name: "Mini & Major Projects", href: "/projects" },
                { name: "Electronics Store", href: "/electronics" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-text-secondary text-sm hover:text-accent-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              {["About Us", "Blog", "Careers", "Contact", "FAQ", "Privacy Policy", "Terms of Service", "Refund Policy"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="text-text-secondary text-sm hover:text-accent-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Connect</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
                <span className="text-text-secondary text-sm">Tech Park, Hinjewadi Phase 1, Pune, Maharashtra 411057</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent-primary shrink-0" />
                <a href="mailto:support@kalvex.in" className="text-text-secondary text-sm hover:text-accent-primary transition-colors">support@kalvex.in</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent-primary shrink-0" />
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-text-secondary text-sm hover:text-accent-success transition-colors">WhatsApp Support</a>
              </li>
            </ul>
            
            <div className="mt-8 p-4 bg-bg-surface rounded-xl border border-border flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-accent-success rounded-sm"></div> {/* Placeholder for Razorpay logo icon */}
              <span className="text-xs font-mono font-medium text-text-primary">100% Secure Payments via Razorpay</span>
            </div>
          </div>

        </div>

        <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-text-muted text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Kalvex Technologies. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-text-muted text-sm font-mono">
            <span>Made with <span className="text-accent-secondary">❤</span> in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
