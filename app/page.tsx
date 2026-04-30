import Link from "next/link";
import ThreeBackground from "@/components/hero/ThreeBackground";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Cpu, ShieldCheck, Briefcase, Award, Zap, Lightbulb, FileText, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* SECTION 1 - HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <ThreeBackground />
        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 max-w-5xl text-text-primary drop-shadow-lg">
            India&apos;s #1 Platform for Engineering Excellence
          </h1>
          <p className="text-lg md:text-xl text-text-primary/90 mb-10 max-w-2xl drop-shadow-md">
            Components &middot; Projects &middot; Thesis &middot; Patents &middot; Research Papers
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/services">
              <Button size="lg" className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow h-14 px-8 text-lg rounded-xl">
                Explore Services
              </Button>
            </Link>
            <Link href="/electronics">
              <Button variant="outline" size="lg" className="border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10 h-14 px-8 text-lg rounded-xl bg-bg-card/50 backdrop-blur-md">
                Browse Components
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full bg-bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-6">
            <div className="flex flex-col items-center">
              <span className="font-heading font-bold text-3xl text-accent-primary">10,000+</span>
              <span className="text-sm text-text-secondary mt-1">Students</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading font-bold text-3xl text-accent-secondary">500+</span>
              <span className="text-sm text-text-secondary mt-1">Projects</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading font-bold text-3xl text-accent-success">50+</span>
              <span className="text-sm text-text-secondary mt-1">Expert Writers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading font-bold text-3xl text-accent-warning">4.9&starf;</span>
              <span className="text-sm text-text-secondary mt-1">Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - WHO WE ARE */}
      <section className="py-24 bg-bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-5xl mb-6">Empowering Indian Innovators</h2>
            <div className="space-y-6 text-text-secondary text-lg leading-relaxed max-w-3xl mx-auto">
              <p>
                At Kalvex, we believe that brilliant minds shouldn&apos;t be held back by formatting rules, missing components, or complex patent filings. We are India&apos;s premier academic and technical support ecosystem designed exclusively for engineering students, researchers, and early-stage startups.
              </p>
              <p>
                From sourcing hard-to-find electronic components for your IoT prototype to auto-drafting official Indian Design Patents via AI, we handle the friction so you can focus on the innovation.
              </p>
              <p>
                Our platform connects you with vetted industry experts under a strict cloak of anonymity—ensuring 100% originality, confidentiality, and academic integrity.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-accent-primary" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Innovation First</h3>
              <p className="text-text-secondary text-sm">Providing cutting-edge tools like our AI Patent Drafter to accelerate your journey from idea to IP.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-success/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-accent-success" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Trust &amp; Privacy</h3>
              <p className="text-text-secondary text-sm">Identity masking ensures neither party knows the other, guaranteeing unbiased work and complete privacy.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-warning/10 flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-accent-warning" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Excellence Delivered</h3>
              <p className="text-text-secondary text-sm">Every delivery comes with strict quality checks, free revisions, and iThenticate plagiarism reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - SERVICES */}
      <section className="py-24 bg-bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-5xl mb-4">What We Do For You</h2>
            <p className="text-text-secondary text-lg">Comprehensive academic and professional support</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: BookOpen, title: "PhD Thesis", desc: "End-to-end writing, editing, and formatting for your doctoral thesis." },
              { icon: FileText, title: "Research Paper", desc: "High-impact papers targeted for IEEE, Scopus, and Springer journals." },
              { icon: Briefcase, title: "Final Year Report", desc: "Professionally formatted project reports as per university guidelines." },
              { icon: ShieldCheck, title: "Design Patent", desc: "Protect the visual appearance of your product with official filing." },
              { icon: Cpu, title: "Utility Patent", desc: "Drafting robust claims for your functional engineering inventions." },
              { icon: Award, title: "Copyright", desc: "Secure your software code, literary works, or technical manuals." },
              { icon: Zap, title: "Trademark", desc: "Register your startup logo or brand name across India." },
              { icon: Lightbulb, title: "Mini Project", desc: "Pre-built or custom mini projects with complete source code." },
              { icon: Cpu, title: "Major Project", desc: "Complex final year engineering projects across all domains." },
            ].map((service, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-bg-card border border-border hover:border-accent-primary/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-bg-surface flex items-center justify-center mb-6 group-hover:bg-accent-primary/10 transition-colors">
                  <service.icon className="w-6 h-6 text-text-primary group-hover:text-accent-primary transition-colors" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">{service.title}</h3>
                <p className="text-text-secondary text-sm mb-6 flex-grow">{service.desc}</p>
                <Link href={`/services/${service.title.toLowerCase().replace(/ /g, '-')}`}>
                  <Button variant="ghost" className="p-0 hover:bg-transparent text-accent-primary font-medium flex items-center">
                    Get Quote <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - HOW IT WORKS */}
      <section className="py-24 bg-bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-5xl mb-4">How It Works</h2>
            <p className="text-text-secondary text-lg">From concept to completion in 4 simple steps</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: "01", title: "Tell Us What You Need", desc: "Fill out a simple form detailing your requirements, deadlines, and formatting guidelines." },
                { step: "02", title: "We Match You", desc: "Our system assigns your task to a verified subject matter expert under a masked identity." },
                { step: "03", title: "Track Progress Live", desc: "Chat directly with your assigned expert, review drafts, and request revisions seamlessly." },
                { step: "04", title: "Receive & Download", desc: "Download the final, plagiarism-checked deliverables securely from your dashboard." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-bg-primary border-4 border-bg-card flex items-center justify-center shadow-lg mb-6 relative">
                    <span className="font-heading font-bold text-2xl text-accent-primary">{item.step}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-3">{item.title}</h3>
                  <p className="text-text-secondary text-sm px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - ELECTRONICS STORE PREVIEW */}
      <section className="py-24 bg-bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-5xl mb-4">Our Components Store</h2>
              <p className="text-text-secondary text-lg">Premium hardware for your next big build</p>
            </div>
            <Link href="/electronics" className="mt-6 md:mt-0">
              <Button variant="outline" className="border-border">
                Shop All Components <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder Products */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-border/50 group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="h-48 bg-gray-100 relative p-4 flex items-center justify-center">
                  <div className="absolute top-3 left-3 bg-accent-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                    SENSORS
                  </div>
                  <Cpu className="w-16 h-16 text-gray-400 opacity-50" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-accent-primary transition-colors">Ultrasonic Distance Sensor HC-SR04 Module</h3>
                  <p className="font-mono text-xs text-gray-500 mb-3">SKU: KVX-SEN-001</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-accent-primary text-lg">₹85.00</span>
                      <span className="text-xs text-gray-500 line-through">₹120.00</span>
                    </div>
                    <span className="text-xs font-medium text-accent-success bg-accent-success/10 px-2 py-1 rounded-md">In Stock</span>
                  </div>
                  <Button className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg">Add to Cart</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 - AI DESIGN PATENT TEASER */}
      <section className="py-24 bg-[#0A0A22] border-y border-accent-primary/20 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center justify-center space-x-2 bg-accent-primary/10 border border-accent-primary/30 text-accent-primary px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Kalvex AI Labs</span>
          </div>
          <h2 className="font-heading font-extrabold text-4xl md:text-6xl text-white mb-6">
            Auto-Draft Your Design Patent in Minutes
          </h2>
          <p className="text-text-secondary text-xl mb-10 max-w-2xl mx-auto">
            Upload your product views. Our AI suggests the exact Locarno classification and instantly generates your official Representation Sheet &amp; Disclosure Document.
          </p>
          <Link href="/patent-drafter">
            <Button size="lg" className="bg-white text-accent-primary hover:bg-gray-100 h-14 px-10 text-lg rounded-xl shadow-glow font-semibold">
              Try Auto-Drafter Now
            </Button>
          </Link>
        </div>
      </section>

      {/* SECTION 7 - TRUSTED PARTNERS MARQUEE */}
      <section className="py-12 bg-bg-card overflow-hidden">
        <div className="container mx-auto px-4 mb-8">
          <p className="text-center text-sm font-semibold text-text-muted uppercase tracking-widest">Trusted by students &amp; professionals across</p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex items-center space-x-16">
            {/* CSS Marquee Implementation */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
              <div key={i} className="text-2xl font-heading font-bold text-border inline-block px-4">
                INSTITUTE {i}
              </div>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center space-x-16">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
              <div key={`dup-${i}`} className="text-2xl font-heading font-bold text-border inline-block px-4">
                INSTITUTE {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 - TESTIMONIALS */}
      <section className="py-24 bg-bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-5xl mb-4">What Our Users Say</h2>
            <p className="text-text-secondary text-lg">Real reviews from verified engineering students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Rahul S.", college: "VIT Pune", branch: "Computer Engg.", text: "The quality of the final year report was exceptional. They followed all the university guidelines perfectly and delivered 2 days before the deadline." },
              { name: "Priya M.", college: "COEP", branch: "E&TC Engg.", text: "I was struggling with my major project code. The expert assigned to me not only fixed the bugs but provided a detailed explanation document. Highly recommended!" },
              { name: "Ankit D.", college: "SRM Institute", branch: "Mech Engg.", text: "Used the AI Design Patent drafter for my CAD model. Got the official formatted sheets in literally 5 minutes. Saved me thousands in attorney fees." },
            ].map((review, i) => (
              <div key={i} className="bg-bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col">
                <div className="flex items-center space-x-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-accent-warning text-lg">&starf;</span>
                  ))}
                </div>
                <p className="text-text-primary text-base italic mb-8 flex-grow">&quot;{review.text}&quot;</p>
                <div className="flex items-center space-x-4 pt-6 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center font-bold text-accent-primary">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-xs text-text-secondary">{review.branch} &middot; {review.college}</p>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle className="w-5 h-5 text-accent-success" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 - CTA BANNER */}
      <section className="py-24 bg-bg-primary">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-accent-primary to-accent-secondary rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
            
            <div className="relative z-10">
              <h2 className="font-heading font-extrabold text-3xl md:text-5xl mb-6">Start Your Project Today</h2>
              <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of engineers who trust Kalvex to bring their ideas to life. Get a free consultation for your custom requirements.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-accent-primary hover:bg-gray-100 h-14 px-8 text-lg rounded-xl w-full sm:w-auto font-semibold">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg rounded-xl w-full sm:w-auto bg-transparent">
                    Get Free Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
