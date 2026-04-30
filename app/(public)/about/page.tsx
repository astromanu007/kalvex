import React from "react";
import { 
  Target, Users, Award, ShieldCheck, 
  ArrowRight, Globe, Zap, Heart 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const stats = [
    { label: "Engineering Projects", value: "500+", icon: Zap },
    { label: "Expert Consultants", value: "50+", icon: Users },
    { label: "Global Patents Filed", value: "120+", icon: Award },
    { label: "Success Rate", value: "99%", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 dark:bg-blue-900/10 rounded-l-[100px] -z-10 blur-3xl" />
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold font-heading mb-6 dark:text-white leading-tight">
              Pioneering the Future of <span className="text-blue-600">Engineering & IP</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              KALVEX is India's premier platform dedicated to bridging the gap between innovative ideas and professional engineering execution. We empower students, researchers, and startups with the tools they need to build, protect, and scale.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                <Link href="/services">Our Services <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-200 dark:border-slate-800 dark:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 px-8">
                <Link href="/projects">Explore Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-4 transition-transform group-hover:scale-110">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-blue-600 rounded-[40px] rotate-3 absolute inset-0 opacity-10 blur-2xl" />
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" 
                alt="Engineering Excellence" 
                className="rounded-[40px] shadow-2xl relative z-10 hover:-rotate-1 transition-transform duration-500"
              />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold dark:text-white mb-4 font-heading">Our Core Mission</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  To democratize engineering excellence by providing a unified ecosystem where complex technical challenges meet world-class solutions. We believe that every great invention deserves a perfect prototype and a legally sound patent.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Identity Protection", desc: "Your innovative ideas are safe with our masked identity protocols.", icon: ShieldCheck },
                  { title: "Expert Vetting", desc: "Every project is handled by industry-certified engineering experts.", icon: Award },
                  { title: "Global Reach", desc: "Helping Indian innovation reach global patent offices.", icon: Globe },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-16 font-heading">Values that Drive Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Integrity", desc: "We maintain absolute transparency and trust in every engineering consultation.", icon: ShieldCheck },
              { title: "Innovation", desc: "Constant pushing of technical boundaries to deliver state-of-the-art results.", icon: Zap },
              { title: "Inclusion", desc: "Making high-end engineering services accessible to every aspiring inventor.", icon: Heart },
            ].map((value, i) => (
              <div key={i} className="p-10 rounded-[32px] bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-blue-600 rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/40">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 -z-10" />
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-heading">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join thousands of engineers and inventors who are building the future on KALVEX today.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 rounded-2xl font-bold shadow-xl transition-all hover:scale-105">
                <Link href="/register">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
