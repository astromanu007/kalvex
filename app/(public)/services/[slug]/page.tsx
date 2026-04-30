"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Upload, ShieldCheck, Clock, FileText, Loader2 } from "lucide-react";
import { createOrder } from "@/app/actions/orders";

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Mock data for the specific service based on slug
  const serviceDetails = {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    basePrice: 12500,
    delivery: "14-21 Days",
    desc: "Complete end-to-end writing, editing, and formatting services strictly adhering to your university's guidelines.",
  };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    topic: "", wordCount: "", deadline: "",
    guidelines: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    // Convert generic slug to a matching enum ServiceType
    // This is naive; normally we'd pass explicit IDs
    const serviceTypeRaw = slug.toUpperCase().replace(/-/g, "_");
    
    const req = `Topic: ${formData.topic}\nWords/Pages: ${formData.wordCount}\nGuidelines: ${formData.guidelines}`;
    
    const res = await createOrder({
      serviceType: serviceTypeRaw as any,
      requirements: req,
      amount: serviceDetails.basePrice,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    });

    setLoading(false);
    if (res.success) {
      router.push("/dashboard/orders");
    } else {
      alert(res.error || "Failed to submit request.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-primary">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/services" className="inline-flex items-center text-sm text-text-secondary hover:text-accent-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Link>

        <div className="bg-bg-card border border-border rounded-3xl p-8 md:p-12 mb-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
              Service
            </div>
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-text-primary mb-4">
              {serviceDetails.title}
            </h1>
            <p className="text-text-secondary text-lg mb-6 leading-relaxed">
              {serviceDetails.desc}
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 bg-bg-surface px-4 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-accent-warning" /> Est. {serviceDetails.delivery}
              </div>
              <div className="flex items-center gap-2 bg-bg-surface px-4 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-accent-success" /> Identity Masked
              </div>
            </div>
          </div>
          <div className="w-full md:w-72 bg-bg-surface border border-border rounded-2xl p-6 text-center shrink-0">
            <p className="text-sm text-text-secondary mb-2">Starting from</p>
            <p className="font-mono font-bold text-3xl text-accent-primary mb-4">₹{serviceDetails.basePrice.toLocaleString()}</p>
            <p className="text-xs text-text-muted mb-6">Final price depends on complexity and deadline.</p>
          </div>
        </div>

        {/* Multi-step Order Form */}
        <div className="bg-bg-card border border-border rounded-3xl p-8 md:p-12">
          <h2 className="font-heading font-bold text-2xl mb-8">Request a Quote</h2>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex flex-col gap-2">
                <div className={`h-1.5 rounded-full ${step >= s ? "bg-accent-primary" : "bg-bg-surface"}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s ? "text-accent-primary" : "text-text-muted"}`}>
                  Step {s}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-medium text-lg mb-4">Project Requirements</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Topic / Domain</label>
                  <input type="text" placeholder="e.g. Machine Learning in Healthcare" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Word Count / Pages</label>
                    <input type="text" placeholder="e.g. 15,000 words" value={formData.wordCount} onChange={(e) => setFormData({...formData, wordCount: e.target.value})} className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Required Deadline</label>
                    <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-medium text-lg mb-4">Detailed Guidelines</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Specific Instructions & Guidelines</label>
                  <textarea rows={5} placeholder="Describe any specific formatting (IEEE, APA), required tools, or constraints..." value={formData.guidelines} onChange={(e) => setFormData({...formData, guidelines: e.target.value})} className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reference Files (Optional)</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent-primary hover:bg-accent-primary/5 transition-all">
                    <Upload className="w-6 h-6 text-text-muted mx-auto mb-2" />
                    <p className="text-sm font-medium">Click to upload university guidelines or base papers</p>
                    <p className="text-xs text-text-muted mt-1">PDF, DOCX, maximum 10MB</p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-bg-surface border border-border rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-accent-primary/10 text-accent-primary rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Review Request</h3>
                    <p className="text-sm text-text-secondary mt-1">Our experts will review your requirements and provide a fixed quote within 2-4 hours.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-accent-warning/5 border border-accent-warning/20 p-4 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-accent-warning flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary leading-relaxed">
                    By submitting this request, you agree to our anonymity policy. Do not share personal contact details (phone, email) with the assigned expert.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6 mt-6 border-t border-border">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="border-border rounded-xl px-6">
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="submit" className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow rounded-xl px-8 ml-auto">
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow rounded-xl px-8 ml-auto">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Request"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
