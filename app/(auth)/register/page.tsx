"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, GraduationCap, Code, PenTool, Building2, ArrowRight } from "lucide-react";

export default function RegisterHubPage() {
  const router = useRouter();

  const roles = [
    { id: "user", label: "General User", icon: User, desc: "For professionals, startups, and hobbyists looking to buy components or order services." },
    { id: "student", label: "Student", icon: GraduationCap, desc: "For engineering and college students. Get access to projects, reports, and discounts." },
    { id: "writer", label: "Expert Writer", icon: PenTool, desc: "Apply to join our network of academic and patent writers. Earn per project." },
    { id: "developer", label: "Developer", icon: Code, desc: "Apply to become a Kalvex Partner Developer. Build custom projects and get paid." },
    { id: "affiliate", label: "Affiliate", icon: Building2, desc: "Promote Kalvex and earn commissions on every successful referral." },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-2xl bg-bg-card p-8 rounded-2xl border border-border shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-secondary/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="text-center mb-10">
          <h1 className="font-heading font-bold text-3xl mb-3">Create Your Account</h1>
          <p className="text-text-secondary text-sm">Select how you want to use Kalvex</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => (
            <Link key={r.id} href={`/register/${r.id}`}>
              <div className="group h-full p-6 rounded-xl border border-border bg-bg-surface hover:border-accent-primary hover:bg-accent-primary/5 transition-all duration-300 flex flex-col items-start cursor-pointer hover:shadow-glow">
                <r.icon className="w-8 h-8 text-text-primary group-hover:text-accent-primary transition-colors mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">{r.label}</h3>
                <p className="text-text-secondary text-xs mb-4 flex-grow">{r.desc}</p>
                <div className="mt-auto text-accent-primary text-sm font-medium flex items-center group-hover:underline">
                  Join as {r.label} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center border-t border-border pt-6">
          <p className="text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-primary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
