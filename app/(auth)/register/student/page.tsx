"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function StudentRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    college: "", department: "", branch: "", year: "", city: "",
    password: "", confirmPassword: "", referralCode: ""
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }
    
    // Step 3 -> 4: Submit to API and show OTP verification
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-lg bg-bg-card p-8 rounded-2xl border border-border shadow-card relative overflow-hidden">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">Student Registration</h1>
          <p className="text-text-secondary text-sm">Join Kalvex to access exclusive academic resources</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-bg-surface -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent-primary -z-10 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s ? "bg-accent-primary text-white shadow-glow" : "bg-bg-surface text-text-muted border border-border"
              }`}
            >
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>

        {step < 4 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Phone Number</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">College Name</label>
                  <input type="text" required value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Branch</label>
                    <input type="text" required value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" placeholder="e.g. CS, E&TC" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Year of Study</label>
                    <select required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary">
                      <option value="">Select Year</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Final Year</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">City</label>
                  <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
                  <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Confirm Password</label>
                  <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Referral Code (Optional)</label>
                  <input type="text" value={formData.referralCode} onChange={e => setFormData({...formData, referralCode: e.target.value})} className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" />
                </div>
                <div className="flex items-start mt-4">
                  <input type="checkbox" id="terms" required className="mt-1 mr-2" />
                  <label htmlFor="terms" className="text-xs text-text-secondary">
                    I agree to the <a href="/terms" className="text-accent-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-accent-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 mt-4 border-t border-border">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handlePrev} className="border-border">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              ) : (
                <Link href="/register">
                  <Button type="button" variant="ghost">Cancel</Button>
                </Link>
              )}
              
              <Button type="submit" disabled={loading} className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow">
                {loading ? "Processing..." : step === 3 ? "Create Account" : "Continue"} 
                {!loading && step < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOTPVerify} className="space-y-6 animate-in fade-in zoom-in duration-300 text-center">
            <div>
              <div className="w-16 h-16 bg-accent-success/10 text-accent-success rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Verify Your Email</h3>
              <p className="text-sm text-text-secondary mb-6">We&apos;ve sent a 6-digit OTP to {formData.email}</p>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold bg-bg-input border border-border rounded-lg focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" />
                ))}
              </div>
              
              <p className="text-xs text-text-secondary mb-6">Didn&apos;t receive code? <button type="button" className="text-accent-primary hover:underline">Resend OTP</button></p>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white h-12 shadow-glow">
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
