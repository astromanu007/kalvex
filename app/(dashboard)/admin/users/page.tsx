"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Shield, Mail, Search, 
  Filter, Download, MoreVertical, CheckCircle, 
  Clock, AlertCircle, ChevronRight, UserPlus,
  Loader2, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { getUsers, updateUserRole } from "@/app/actions/admin";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    const res = await getUsers();
    if (res.success) setUsers(res.users || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    // Basic cycle: USER -> STUDENT -> EXPERT -> ADMIN (manual)
    const roles = ["USER", "STUDENT", "EXPERT", "WRITER", "DEVELOPER", "ADMIN"];
    const currentIndex = roles.indexOf(currentRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    
    if (confirm(`Change user role to ${nextRole}?`)) {
      const res = await updateUserRole(userId, nextRole);
      if (res.success) {
        toast.success(`User role updated to ${nextRole}`);
        fetchUsers();
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const filteredUsers = users.filter(u => 
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.maskedId || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-medium text-sm">Manage user accounts, roles, and platform permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl px-6 h-12 border-slate-200 font-bold text-xs uppercase tracking-widest">
            <Download className="w-4 h-4 mr-2" /> Export Users
          </Button>
          <Button onClick={fetchUsers} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20">
            Refresh Table
          </Button>
        </div>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Admin Accounts", value: users.filter(u => u.role === 'ADMIN').length, icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Expert Accounts", value: users.filter(u => u.role === 'EXPERT').length, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "New Registrations", value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 86400000)).length, icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          placeholder="Search by name, email, or user ID..." 
          className="pl-12 h-16 rounded-2xl border-slate-100 bg-white focus:ring-slate-900/10 text-lg font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <Loader2 className="w-12 h-12 text-slate-900 animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading user directory...</p>
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center font-black text-lg">
                        {(user.name || "U").charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name || "Anonymous User"}</p>
                        <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => handleRoleChange(user.id, user.role)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        user.role === 'ADMIN' ? 'bg-slate-900 text-white' :
                        user.role === 'EXPERT' ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-50 text-slate-400'
                      }`}
                    >
                      {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <Key className="w-3 h-3" />}
                      {user.role}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-[10px] font-mono font-bold bg-slate-50 px-3 py-1 rounded-lg text-slate-400">
                      {user.maskedId || "UNREGISTERED"}
                    </code>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredUsers.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200">
              <Users className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">No Users Found</h3>
              <p className="text-slate-400 font-medium max-w-xs">No users matched your search criteria.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Helper to use Star icon since it wasn't imported in the list but used in stats
function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
