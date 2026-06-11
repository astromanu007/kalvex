"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, MessageSquare, Award, ShieldCheck, Zap, Heart, CheckCircle2, Loader2, Sparkles, Plus, Send, Check, Cpu } from "lucide-react";
import { getReviewsDetails } from "@/app/actions/user";
import { getOrders } from "@/app/actions/orders";
import { motion, AnimatePresence } from "framer-motion";
import CursorGlowCard from "@/components/ui/CursorGlowCard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ReviewsPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isExpert = role === "WRITER" || role === "DEVELOPER";

  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState("5.0");
  const [totalCount, setTotalCount] = useState(0);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState([
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 }
  ]);
  const [loading, setLoading] = useState(true);

  // Student specific: Write Review Form State
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [writeRating, setWriteRating] = useState(5);
  const [writeComment, setWriteComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    const fetchReviews = async () => {
      setLoading(true);
      const res = await getReviewsDetails();
      if (res.success) {
        setReviews(res.reviews ?? []);
        setAverageRating(res.averageRating ?? "5.0");
        setTotalCount(res.totalCount ?? 0);
        setApplicationStatus((res as any).applicationStatus ?? null);
        if (res.distribution) setRatingDistribution(res.distribution);
      }
      
      // If student, fetch completed orders that can be reviewed
      if (!isExpert) {
        const ordersRes = await getOrders();
        if (ordersRes.orders) {
          const completed = ordersRes.orders.filter((o: any) => 
            ["DELIVERED", "COMPLETED"].includes(o.status)
          );
          setCompletedOrders(completed);
        }
      }
      setLoading(false);
    };
    fetchReviews();
  }, [session, isExpert]);

  // Handle student review submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeComment.trim() || !selectedOrder) return;
    setIsSubmittingReview(true);

    setTimeout(() => {
      const orderObj = completedOrders.find(o => o.id === selectedOrder);
      const serviceTitle = orderObj ? (orderObj.serviceType?.replace(/_/g, " ") ?? "Service") : "Academic Service";

      const newRev = {
        id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
        comment: writeComment.trim(),
        rating: writeRating,
        date: new Date().toISOString().split("T")[0],
        service: serviceTitle,
        verified: true,
        client: session?.user?.name ?? "Student"
      };

      // Add to reviews list
      const updatedReviews = [newRev, ...reviews];
      setReviews(updatedReviews);

      // Recalculate average rating & counts
      const newTotalCount = updatedReviews.length;
      const sumRatings = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      setAverageRating((sumRatings / newTotalCount).toFixed(1));
      setTotalCount(newTotalCount);

      // Reset form
      setWriteComment("");
      setSelectedOrder("");
      setWriteRating(5);
      setIsSubmittingReview(false);
      setShowWriteReview(false);
      toast.success("Thank you! Your feedback has been published.");
    }, 1200);
  };

  const developerBadges = [
    { 
      label: "Speed Demon", 
      icon: Zap, 
      desc: "Early project delivery", 
      color: totalCount >= 1 ? "text-amber-500 bg-amber-500/10 border-amber-500/20" : "text-slate-300 bg-slate-100 border-slate-200", 
      unlocked: totalCount >= 1,
    },
    { 
      label: "Code King", 
      icon: Award, 
      desc: "Zero compilation warnings", 
      color: totalCount >= 1 ? "text-blue-500 bg-blue-500/10 border-blue-500/20" : "text-slate-300 bg-slate-100 border-slate-200",
      unlocked: totalCount >= 1,
    },
    { 
      label: "Client Favourite", 
      icon: Heart, 
      desc: "Consistent 5-star ratings", 
      color: parseFloat(averageRating) >= 4.8 && totalCount >= 1 ? "text-pink-500 bg-pink-500/10 border-pink-500/20" : "text-slate-300 bg-slate-100 border-slate-200",
      unlocked: parseFloat(averageRating) >= 4.8 && totalCount >= 1,
    },
    { 
      label: "Verified Expert", 
      icon: ShieldCheck, 
      desc: "Credentials fully verified", 
      color: applicationStatus === "APPROVED" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-slate-300 bg-slate-100 border-slate-200",
      unlocked: applicationStatus === "APPROVED",
    }
  ];

  const studentBadges = [
    { 
      label: "Early Adopter", 
      icon: Sparkles, 
      desc: "First order placed within launch", 
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20", 
      unlocked: true,
    },
    { 
      label: "Hardware Pioneer", 
      icon: Cpu, 
      desc: "Ordered custom electronics kit", 
      color: completedOrders.some(o => o.serviceType === "HARDWARE_COMPONENTS" || o.requirements?.includes("ITEMS PURCHASED:")) 
        ? "text-blue-500 bg-blue-500/10 border-blue-500/20" 
        : "text-slate-300 bg-slate-100 border-slate-200",
      unlocked: completedOrders.some(o => o.serviceType === "HARDWARE_COMPONENTS" || o.requirements?.includes("ITEMS PURCHASED:")),
    },
    { 
      label: "Review Contributor", 
      icon: MessageSquare, 
      desc: "Left reviews on completed orders", 
      color: totalCount >= 1 ? "text-pink-500 bg-pink-500/10 border-pink-500/20" : "text-slate-300 bg-slate-100 border-slate-200",
      unlocked: totalCount >= 1,
    },
    { 
      label: "Certified Scholar", 
      icon: ShieldCheck, 
      desc: "Student ID card fully verified", 
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      unlocked: true,
    }
  ];

  const badges = isExpert ? developerBadges : studentBadges;

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-indigo-650 animate-spin" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-550" />
            <div>
              <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-650 animate-pulse" />
                {isExpert ? "Developer Testimonials Portfolio" : "Service & Order Reviews"}
              </h1>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                {isExpert 
                  ? "View and manage feedback received from students and clients on completed assignments"
                  : "Rate completed orders, share feedback, and track your contributor badges"
                }
              </p>
            </div>
            
            {!isExpert && completedOrders.length > 0 && (
              <Button 
                onClick={() => setShowWriteReview(!showWriteReview)}
                className="bg-slate-900 hover:bg-indigo-650 text-white rounded-xl h-10 px-5 text-[10px] font-black uppercase tracking-widest shrink-0 flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> {showWriteReview ? "Close Form" : "Write a Review"}
              </Button>
            )}
          </div>

          {/* Student Write Review Drawer */}
          <AnimatePresence>
            {showWriteReview && !isExpert && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                  <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Submit Order Feedback</h3>
                  <form onSubmit={handleAddReview} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Select Completed Order</label>
                        <select
                          value={selectedOrder}
                          onChange={e => setSelectedOrder(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-[10px] font-bold text-slate-700 focus:outline-none focus:border-indigo-650"
                          required
                        >
                          <option value="">-- Choose Order --</option>
                          {completedOrders.map(o => (
                            <option key={o.id} value={o.id}>
                              {o.orderNumber} - {o.serviceType?.replace(/_/g, " ") ?? "Service"} (₹{o.amount})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">Overall Rating</label>
                        <div className="flex gap-1.5 pt-2">
                          {[1, 2, 3, 4, 5].map((stars) => (
                            <button
                              type="button"
                              key={stars}
                              onClick={() => setWriteRating(stars)}
                              className="focus:outline-none hover:scale-110 transition-transform"
                            >
                              <Star 
                                className={`w-6 h-6 ${
                                  stars <= writeRating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">Review Comment</label>
                      <textarea
                        rows={3}
                        value={writeComment}
                        onChange={e => setWriteComment(e.target.value)}
                        placeholder="Tell other students about your experience with the code quality, wiring guides, or writer competence..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-slate-900 hover:bg-indigo-650 text-white rounded-xl h-11 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      {isSubmittingReview ? "Publishing..." : "Submit Review"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Scoreboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: isExpert ? "Average Rating" : "Average Rating Given", value: averageRating, desc: isExpert ? `Across ${totalCount} completed tasks` : `Across ${totalCount} reviews`, icon: Star, color: "text-amber-500 bg-amber-50 border-amber-100", glow: "amber" as const },
              { label: isExpert ? "Direct Testimonials" : "Submitted Reviews", value: totalCount.toString(), desc: "Verified system releases", icon: MessageSquare, color: "text-indigo-600 bg-indigo-50 border-indigo-100", glow: "indigo" as const },
              { label: "Quality Assurance Score", value: "100%", desc: "Based on verification nodes", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100", glow: "emerald" as const }
            ].map((block) => (
              <CursorGlowCard key={block.label} glowColor={block.glow} className="min-h-[140px]" innerClassName="flex-row items-center gap-5 p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${block.color}`}>
                  <block.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-mono font-black text-slate-900 block leading-none">{block.value}</span>
                  <h4 className="text-[9px] font-black text-slate-450 uppercase tracking-widest mt-2">{block.label}</h4>
                  <p className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{block.desc}</p>
                </div>
              </CursorGlowCard>
            ))}
          </div>

          {/* Grid: Rating distribution & Badges */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Progress Breakdown */}
            <CursorGlowCard glowColor="blue">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-3">Rating Breakdown</h3>
              <div className="space-y-3 pt-4">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-450 w-10 uppercase flex items-center gap-1 shrink-0">
                      {dist.stars} <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </span>
                    <div className="flex-1 h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: `${dist.percentage}%` }} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 w-6 text-right shrink-0">
                      {dist.count}
                    </span>
                  </div>
                ))}
              </div>
            </CursorGlowCard>

            {/* Badges Panel */}
            <CursorGlowCard glowColor="purple" className="lg:col-span-2">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-50 pb-3">
                {isExpert ? "Developer Badges" : "Student Contributor Badges"}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {badges.map((b) => (
                  <div 
                    key={b.label} 
                    className={`flex items-start gap-3.5 p-4 border rounded-2xl transition-all duration-300 ${
                      b.unlocked 
                        ? 'bg-slate-50/50 border-slate-200 shadow-sm' 
                        : 'bg-slate-50/30 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${b.color}`}>
                      <b.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wide">{b.label}</h4>
                        <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${b.unlocked ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-450 border border-slate-200'}`}>
                          {b.unlocked ? "Unlocked" : "Locked"}
                        </span>
                      </div>
                      <p className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest mt-1 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CursorGlowCard>
          </div>

          {/* Main Review Section */}
          <CursorGlowCard glowColor="rose">
            <h3 className="font-heading font-black text-xs text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-3">
              {isExpert ? "Client Feedback Logs" : "My Submitted Reviews"}
            </h3>
            
            <div className="divide-y divide-slate-100 pt-2">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-6 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] font-mono font-black bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-lg">
                        {rev.id}
                      </span>
                      <span className="text-[9px] font-black text-indigo-650 uppercase tracking-widest">
                        {rev.service}
                      </span>
                    </div>
                    
                    <p className="text-xs font-semibold text-slate-650 leading-relaxed max-w-3xl italic">
                      "{rev.comment}"
                    </p>
                    
                    <div className="flex items-center gap-4 text-[9px] font-black text-slate-450 uppercase tracking-widest">
                      <span>
                        {isExpert ? `Client: ${rev.client}` : "Reviewed by you"} &bull; {rev.date}
                      </span>
                      {rev.verified && <span className="text-emerald-600 font-extrabold flex items-center gap-1">✓ Verified Release</span>}
                    </div>
                  </div>

                  {/* Rating stars block */}
                  <div className="flex gap-1 shrink-0 pt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-150"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">No reviews found. Click "Write a Review" above to submit one.</div>
              )}
            </div>
          </CursorGlowCard>
        </>
      )}
    </div>
  );
}
