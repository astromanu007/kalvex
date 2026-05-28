"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Search,
  MoreVertical,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { getAllBookings, updateBookingStatus, assignBooking } from "@/app/actions/bookings";
import { getUsers } from "@/app/actions/admin";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-600 border border-blue-200",
  IN_PROGRESS: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  COMPLETED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  CANCELLED: "bg-red-50 text-red-600 border border-red-200",
};

export default function AdminBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const [bookingsRes, usersRes] = await Promise.all([
      getAllBookings(),
      getUsers()
    ]);
    
    if (bookingsRes.success) setBookings(bookingsRes.bookings || []);
    else toast.error("Failed to load bookings");

    if (usersRes.success) {
      const devs = (usersRes.users || []).filter((u: any) => u.role === "DEVELOPER" || u.role === "ADMIN");
      setDevelopers(devs);
    }
    
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (bookingId: string, newStatus: any) => {
    const res = await updateBookingStatus({ bookingId, status: newStatus });
    if (res.success) {
      toast.success(`Booking status updated to ${newStatus}`);
      fetchData();
    } else {
      toast.error("Failed to update status");
    }
    setOpenMenuId(null);
  };

  const handleAssign = async (bookingId: string, developerId: string) => {
    const res = await assignBooking({ bookingId, assignedToId: developerId });
    if (res.success) {
      toast.success(`Booking assigned successfully`);
      fetchData();
    } else {
      toast.error("Failed to assign booking");
    }
    setOpenMenuId(null);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.serviceType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Bookings Overview</h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm">Manage service requests, assign tasks to developers, and track progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchData} className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl px-6 h-12 font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all">
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <Input
            placeholder="Search bookings by ID, service, or email..."
            className="pl-11 h-14 rounded-2xl border-slate-100 bg-white focus:ring-indigo-600/10 text-sm font-medium w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-shrink-0 w-full sm:w-auto relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto pl-11 pr-8 h-14 rounded-2xl border-slate-100 bg-white text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white shadow-2xl shadow-slate-900/5 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 backdrop-blur-sm">
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Service Info</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Assigned To</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Created</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <Loader2 className="w-10 h-10 text-indigo-300 animate-spin mx-auto mb-3" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Loading Bookings...</p>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <CalendarDays className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Bookings Found</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-indigo-50/10 transition-colors group relative">
                    <td className="px-6 py-5 max-w-[200px]">
                      <div className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">
                        {booking.serviceType.replace(/_/g, " ")}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">ID: {booking.id.slice(-8)}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 uppercase flex-shrink-0">
                          {booking.user?.name ? booking.user.name.charAt(0) : "U"}
                        </div>
                        <div className="truncate max-w-[150px]">
                          <p className="text-xs font-bold text-slate-800 truncate">{booking.user?.name || "Unknown"}</p>
                          <p className="text-[9px] text-slate-500 truncate">{booking.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING}`}>
                        {booking.status === "COMPLETED" && <CheckCircle className="w-3 h-3" />}
                        {booking.status === "PENDING" && <Clock className="w-3 h-3" />}
                        {booking.status === "CANCELLED" && <AlertCircle className="w-3 h-3" />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {booking.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-slate-800">{booking.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                      {format(new Date(booking.createdAt), "dd MMM, yyyy")}
                    </td>
                    <td className="px-6 py-5 text-right relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === booking.id ? null : booking.id)}
                        className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-slate-900 hover:shadow-md transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {openMenuId === booking.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-6 top-14 z-50 w-56 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-2xl shadow-indigo-900/10 overflow-hidden text-left"
                          >
                            <div className="p-3 bg-slate-50 border-b border-slate-100">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</p>
                            </div>
                            
                            <div className="p-2 max-h-48 overflow-y-auto">
                              <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400 px-2 py-1">Set Status</p>
                              {["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(st => (
                                <button
                                  key={st}
                                  onClick={() => handleStatusChange(booking.id, st)}
                                  className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${booking.status === st ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                  {st}
                                </button>
                              ))}
                              
                              <div className="h-px bg-slate-100 my-2" />
                              <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400 px-2 py-1">Assign Developer</p>
                              {developers.map(dev => (
                                <button
                                  key={dev.id}
                                  onClick={() => handleAssign(booking.id, dev.id)}
                                  className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${booking.assignedToId === dev.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                  {dev.name || dev.email.split('@')[0]}
                                </button>
                              ))}
                              {developers.length === 0 && (
                                <div className="px-3 py-2 text-[9px] text-slate-400">No developers found</div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
