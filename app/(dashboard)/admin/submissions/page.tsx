"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, Users, MessageSquare, Search, 
  Filter, Download, Trash2, CheckCircle, 
  Clock, AlertCircle, ChevronRight, ArrowUpRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { getSubmissions, getNewsletterSubscribers, updateSubmissionStatus, deleteSubmission } from "@/app/actions/admin";
import { toast } from "sonner";

export default function AdminSubmissionsPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "newsletter">("contact");
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subRes, newsRes] = await Promise.all([getSubmissions(), getNewsletterSubscribers()]);
      if (subRes.success) setContactSubmissions(subRes.submissions || []);
      if (newsRes.success) setNewsletterSubscribers(newsRes.subscribers || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "UNREAD" ? "READ" : "ARCHIVED";
    const res = await updateSubmissionStatus(id, nextStatus);
    if (res.success) {
      toast.success("Inquiry status updated");
      fetchData();
    }
  };

  const handleDelete = async (id: string, type: "contact" | "newsletter") => {
    if (confirm("Are you sure you want to delete this record?")) {
      const res = await deleteSubmission(id);
      if (res.success) {
        toast.success("Record deleted successfully");
        fetchData();
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const filteredContacts = contactSubmissions.filter(s => 
    (s.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNews = newsletterSubscribers.filter(s => 
    (s.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Submissions & Inquiries</h1>
          <p className="text-slate-500 font-medium text-sm">View and manage contact form inquiries and newsletter subscriptions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl px-6 h-12 border-slate-200 font-bold text-xs uppercase tracking-widest">
            <Download className="w-4 h-4 mr-2" /> Export Data
          </Button>
          <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20">
            Refresh Inquiries
          </Button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("contact")}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "contact" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            Contact Inquiries
          </button>
          <button 
            onClick={() => setActiveTab("newsletter")}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "newsletter" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            Newsletter Leads
          </button>
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search submissions..." 
            className="pl-12 h-14 rounded-2xl border-slate-100 bg-white focus:ring-blue-600/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitter Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Inquiries...</p>
                  </td>
                </tr>
              ) : activeTab === "contact" ? (
                filteredContacts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                          {(item.fullName || "U").charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.fullName}</p>
                          <p className="text-xs text-slate-400 font-medium">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        {item.inquiryType}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                      {item.createdAt ? format(new Date(item.createdAt), "MMM dd, yyyy • HH:mm") : "N/A"}
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleStatusChange(item.id, item.status)}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${item.status === 'UNREAD' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                      >
                        {item.status === 'UNREAD' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {item.status}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(item.id, "contact")} className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 transition-all shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.email}</p>
                          <p className="text-xs text-slate-400 font-medium">Verified Subscriber</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        NEWSLETTER
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                      {item.createdAt ? format(new Date(item.createdAt), "MMM dd, yyyy • HH:mm") : "N/A"}
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle className="w-3 h-3" /> {item.isActive ? "ACTIVE" : "UNSUBSCRIBED"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(item.id, "newsletter")} className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 transition-all shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State / Loading */}
        {!isLoading && (activeTab === "contact" ? filteredContacts.length : filteredNews.length) === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200">
              <AlertCircle className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">No Submissions Found</h3>
              <p className="text-slate-400 font-medium max-w-xs">There are no new submissions to display.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
