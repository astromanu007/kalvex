import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText, Briefcase, ShieldCheck, Cpu, Award, Zap, Lightbulb, Clock, RefreshCw, BadgeCheck } from "lucide-react";

const SERVICES = [
  {
    slug: "phd-thesis",
    icon: BookOpen,
    title: "PhD Thesis Writing",
    shortDesc: "End-to-end writing, structuring, and formatting for your doctoral thesis as per university norms.",
    color: "text-accent-primary",
    bg: "bg-accent-primary/10",
    deliverables: ["Full thesis draft", "iThenticate report", "Free revisions", "Reference formatting"],
  },
  {
    slug: "research-paper",
    icon: FileText,
    title: "Research Paper Publication",
    shortDesc: "High-impact papers written and submitted to IEEE, Scopus, Springer, and more.",
    color: "text-accent-secondary",
    bg: "bg-accent-secondary/10",
    deliverables: ["Journal-ready manuscript", "Plagiarism report", "Cover letter drafting", "Submission support"],
  },
  {
    slug: "final-year-report",
    icon: Briefcase,
    title: "Final Year Project Report",
    shortDesc: "Professionally formatted project reports aligned with your university guidelines.",
    color: "text-accent-warning",
    bg: "bg-accent-warning/10",
    deliverables: ["Formatted PDF + DOCX", "Reference management", "Chapter-by-chapter review", "Turnaround in 5–7 days"],
  },
  {
    slug: "design-patent",
    icon: ShieldCheck,
    title: "Design Patent Filing",
    shortDesc: "Protect the visual appearance of your product with an official Indian Design Patent via Controller General of Patents.",
    color: "text-accent-success",
    bg: "bg-accent-success/10",
    deliverables: ["Representation sheets", "Locarno classification", "Disclosure document", "Official form filing"],
  },
  {
    slug: "utility-patent",
    icon: Cpu,
    title: "Utility Patent Drafting",
    shortDesc: "Robust claims and specification drafting for functional engineering inventions.",
    color: "text-accent-primary",
    bg: "bg-accent-primary/10",
    deliverables: ["Complete specification", "Claims draft", "Abstract & drawings", "Prior art search"],
  },
  {
    slug: "copyright",
    icon: Award,
    title: "Copyright Registration",
    shortDesc: "Register your software code, literary works, artistic designs, or technical manuals.",
    color: "text-accent-danger",
    bg: "bg-accent-danger/10",
    deliverables: ["Government registration", "Digital certificate", "Registered work copy", "3–4 week turnaround"],
  },
  {
    slug: "trademark",
    icon: Zap,
    title: "Trademark Registration",
    shortDesc: "Register your startup logo, brand name, or tagline across India under the Trademarks Act.",
    color: "text-accent-warning",
    bg: "bg-accent-warning/10",
    deliverables: ["TM search report", "Application filing", "Govt. fee included", "Status tracking"],
  },
  {
    slug: "mini-project",
    icon: Lightbulb,
    title: "Mini Project",
    shortDesc: "Pre-built or custom mini projects for 3rd and 4th semester students with complete source code.",
    color: "text-accent-secondary",
    bg: "bg-accent-secondary/10",
    deliverables: ["Full source code", "Documentation", "PPT slides", "Demo video"],
  },
  {
    slug: "major-project",
    icon: Cpu,
    title: "Major / Capstone Project",
    shortDesc: "Complex final year engineering projects across all domains — CS, E&TC, Mech, Civil, and more.",
    color: "text-accent-success",
    bg: "bg-accent-success/10",
    deliverables: ["Custom development", "Source code + report", "Demo & presentation", "6-month support"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-text-primary mb-4">Our Services</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            End-to-end academic and technical support for engineering students, researchers, and innovators.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {[
            { icon: BadgeCheck, text: "100% Plagiarism Free" },
            { icon: Clock, text: "On-time Delivery" },
            { icon: RefreshCw, text: "Free Revisions" },
            { icon: ShieldCheck, text: "Strict Confidentiality" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2 bg-bg-card border border-border rounded-full px-5 py-2.5 text-sm font-medium text-text-primary">
              <b.icon className="w-4 h-4 text-accent-success" /> {b.text}
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div key={service.slug} className="group bg-bg-card border border-border rounded-2xl p-6 hover:border-accent-primary/40 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-5`}>
                <service.icon className={`w-6 h-6 ${service.color}`} />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">{service.title}</h2>
              <p className="text-text-secondary text-sm mb-5 flex-grow leading-relaxed">{service.shortDesc}</p>

              <div className="mb-6">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">What&apos;s Included</p>
                <ul className="space-y-1.5">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-success flex-shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={`/services/${service.slug}`}>
                <Button className="w-full bg-bg-surface hover:bg-accent-primary/10 border border-border hover:border-accent-primary text-text-primary hover:text-accent-primary rounded-xl transition-all gap-2 text-sm">
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-3xl p-10 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Need Something Custom?</h2>
          <p className="text-text-secondary text-base mb-8 max-w-lg mx-auto">
            Tell us your exact requirements and we&apos;ll match you with the right expert, priced fairly.
          </p>
          <Link href="/contact">
            <Button className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow h-12 px-8 rounded-xl">
              Request Custom Quote
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
