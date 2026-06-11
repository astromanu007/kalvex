"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Shield, Mail, Search,
  Download, MoreVertical, Clock,
  Loader2, Key, Trash2, UserCog, X, Check,
  Star, UserCheck, Github, Linkedin, Globe,
  MapPin, GraduationCap, Briefcase, ExternalLink, Calendar, Phone, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { getUsers, updateUserRole, deleteUser } from "@/app/actions/admin";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const ROLES = ["USER", "STUDENT", "WRITER", "DEVELOPER", "ADMIN", "AFFILIATE"] as const;

const ROLE_STYLES: Record<string, string> = {
  ADMIN:     "bg-slate-900 text-white",
  DEVELOPER: "bg-blue-600 text-white",
  WRITER:    "bg-indigo-50 text-indigo-600 border border-indigo-200",
  STUDENT:   "bg-emerald-50 text-emerald-600 border border-emerald-200",
  AFFILIATE: "bg-amber-50 text-amber-600 border border-amber-200",
  USER:      "bg-slate-55 text-slate-500 border border-slate-200",
};

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    const res = await getUsers();
    if (res.success) setUsers(res.users || []);
    else toast.error("Failed to load users");
    setIsLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChangingRole(userId);
    const res = await updateUserRole(userId, newRole);
    if (res.success) {
      toast.success(`Role changed to ${newRole}`);
      fetchUsers();
      // Update selectedUser if open
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser((prev: any) => ({ ...prev, role: newRole }));
      }
    } else {
      toast.error("Failed to update role");
    }
    setChangingRole(null);
    setOpenMenuId(null);
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Permanently delete user "${name}"? This will remove all their orders too.`)) return;
    setDeletingId(userId);
    const res = await deleteUser(userId);
    if (res.success) {
      toast.success("User deleted successfully");
      if (selectedUser?.id === userId) setSelectedUser(null);
      fetchUsers();
    } else {
      toast.error(res.message || "Failed to delete user");
    }
    setDeletingId(null);
    setOpenMenuId(null);
  };

  const filteredUsers = users.filter(u =>
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.maskedId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCards = [
    { label: "Total Users",       value: users.length,                                                      color: "bg-blue-50 text-blue-600",    icon: Users },
    { label: "Admin Accounts",    value: users.filter(u => u.role === "ADMIN").length,                      color: "bg-slate-900 text-white",     icon: Shield },
    { label: "Experts",           value: users.filter(u => ["WRITER","DEVELOPER"].includes(u.role)).length, color: "bg-indigo-50 text-indigo-600",icon: Star },
    { label: "Clients / Students",value: users.filter(u => ["USER","STUDENT"].includes(u.role)).length,     color: "bg-emerald-50 text-emerald-600",icon: UserCheck },
  ];

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">User Directory</h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm">Manage accounts, assign roles, and control platform permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchUsers} className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl px-6 h-12 font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all">
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center flex-shrink-0`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        <Input
          placeholder="Search by name, email, role, or user ID..."
          className="pl-11 h-14 rounded-2xl border-slate-100 bg-white focus:ring-blue-600/10 text-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/40">
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Orders</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Registered</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest hidden xl:table-cell">User ID</th>
                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <Loader2 className="w-10 h-10 text-slate-200 animate-spin mx-auto mb-3" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Loading Users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <Users className="w-12 h-12 text-slate-100 mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Users Found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => setSelectedUser(user)}
                    className="hover:bg-slate-50/70 transition-colors group relative cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center font-black text-white flex-shrink-0 border border-slate-100 shadow-sm">
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-650 transition-colors">{user.name || "Anonymous"}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${ROLE_STYLES[user.role] || ROLE_STYLES.USER}`}>
                        {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                        {(user.role === "WRITER" || user.role === "DEVELOPER") && <Key className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <span className="text-sm font-black text-slate-900">{user._count?.orders ?? 0}</span>
                    </td>
                    <td className="px-6 py-5 text-[10px] text-slate-400 font-medium hidden lg:table-cell">
                      {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-5 hidden xl:table-cell">
                      <code className="text-[9px] font-mono font-bold bg-slate-50 px-2 py-1 rounded-lg text-slate-400 border border-slate-100">
                        {user.maskedId || "—"}
                      </code>
                    </td>
                    <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block" ref={openMenuId === user.id ? menuRef : undefined}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all"
                          disabled={deletingId === user.id || changingRole === user.id}
                        >
                          {(deletingId === user.id || changingRole === user.id)
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <MoreVertical className="w-4 h-4" />
                          }
                        </button>

                        <AnimatePresence>
                          {openMenuId === user.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.92, y: -8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.92, y: -8 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-12 z-50 w-64 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-900/10 overflow-hidden"
                            >
                                {/* User info header */}
                              <div className="px-4 py-3 bg-slate-50/60 border-b border-slate-100 text-left">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</p>
                                <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{user.name || user.email}</p>
                              </div>

                              <div className="p-1.5 border-b border-slate-100">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
                                >
                                  <Users className="w-3.5 h-3.5" />
                                  View Full Profile
                                </button>
                              </div>

                              {/* Role options (only for ADMIN) */}
                              {(session?.user as any)?.role === "ADMIN" && (
                                <div className="p-2 space-y-0.5 text-left">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-450 px-3 py-1">Change Role</p>
                                  {ROLES.map((role) => (
                                    <button
                                      key={role}
                                      onClick={() => handleRoleChange(user.id, role)}
                                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        user.role === role
                                          ? "bg-slate-900 text-white"
                                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                      }`}
                                    >
                                      <span className="flex items-center gap-2">
                                        {role === "ADMIN" && <Shield className="w-3 h-3" />}
                                        {(role === "WRITER" || role === "DEVELOPER") && <UserCog className="w-3 h-3" />}
                                        {(role === "USER" || role === "STUDENT") && <Users className="w-3 h-3" />}
                                        {role === "AFFILIATE" && <Star className="w-3 h-3" />}
                                        {role}
                                      </span>
                                      {user.role === role && <Check className="w-3 h-3" />}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Danger zone (only for ADMIN) */}
                              {(session?.user as any)?.role === "ADMIN" && (
                                <div className="p-2 border-t border-slate-100">
                                  <button
                                    onClick={() => handleDelete(user.id, user.name || user.email)}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all text-left"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Delete User
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Slide-out Detailed Profile Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Sidebar drawer container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-[60] w-full max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-100 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center font-black text-white shadow-md">
                    {(selectedUser.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-heading font-black text-base text-slate-900 leading-tight truncate max-w-[280px]">
                      {selectedUser.name || "Anonymous User"}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Expert ID: <span className="font-mono text-indigo-650">{selectedUser.maskedId || "KV-U0000"}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-10 h-10 bg-white border border-slate-150 rounded-2xl flex items-center justify-center text-slate-450 hover:text-slate-900 hover:border-slate-350 shadow-sm transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                
                {/* Account Type Card */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300 block mb-1">Platform Role</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${ROLE_STYLES[selectedUser.role] || ROLE_STYLES.USER}`}>
                        {selectedUser.role === "ADMIN" && <Shield className="w-3.5 h-3.5" />}
                        {selectedUser.role}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300 block mb-1">Total Assigned Orders</span>
                      <span className="text-3xl font-mono font-black">{selectedUser._count?.orders ?? 0}</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 mt-5 pt-4 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> Joined {format(new Date(selectedUser.createdAt), "dd MMM yyyy")}</span>
                    <span className="text-indigo-400">Verified System Profile</span>
                  </div>
                </div>

                {/* Basic Details Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-2">Basic Contact & Location Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Registered Email</span>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 break-all">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {selectedUser.email}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Phone Connection</span>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {selectedUser.phone || "Not Configured"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Home City / Location</span>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {selectedUser.city || "Not Provided"}
                      </span>
                    </div>
                    {selectedUser.college && (
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Affiliated College</span>
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {selectedUser.college} {selectedUser.branch ? `(${selectedUser.branch})` : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Info (If WRITER or DEVELOPER) */}
                {["WRITER", "DEVELOPER"].includes(selectedUser.role) && (
                  <div className="space-y-5 pt-2">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-2">Developer / Expert Portfolio</h3>
                    
                    {/* Experience Info */}
                    <div className="flex items-center gap-5 p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-650 shrink-0 shadow-sm">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Years of Experience</span>
                        <span className="text-sm font-black text-slate-800 uppercase tracking-wider mt-0.5">
                          {selectedUser.experienceYears ? `${selectedUser.experienceYears} Years Active` : "Not Configured"}
                        </span>
                      </div>
                    </div>

                    {/* Social / Portfolio Links */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* GitHub */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">GitHub Profile</span>
                        {selectedUser.githubUrl ? (
                          <a href={selectedUser.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-850 hover:underline flex items-center gap-1.5">
                            <Github className="w-3.5 h-3.5 text-slate-700 shrink-0" /> GitHub Repo <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-450 font-semibold flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-slate-300" /> None</span>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">LinkedIn Profile</span>
                        {selectedUser.linkedinUrl ? (
                          <a href={selectedUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-850 hover:underline flex items-center gap-1.5">
                            <Linkedin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> LinkedIn <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-450 font-semibold flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-slate-300" /> None</span>
                        )}
                      </div>

                      {/* Personal Website */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Personal Website</span>
                        {selectedUser.portfolioUrl || selectedUser.website ? (
                          <a href={selectedUser.portfolioUrl || selectedUser.website} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-850 hover:underline flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Portfolio Website <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-450 font-semibold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-300" /> None</span>
                        )}
                      </div>

                      {/* Resume / Sample Work URL */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Sample Work / Resume</span>
                        {selectedUser.sampleWorkUrl ? (
                          <a href={selectedUser.sampleWorkUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-850 hover:underline flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" /> View Resume <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-450 font-semibold flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-slate-300" /> None</span>
                        )}
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="space-y-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Technologies & Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedUser.skills && selectedUser.skills.length > 0 ? (
                          selectedUser.skills.map((skill: string) => (
                            <span key={skill} className="text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-650 border border-indigo-150 px-2 py-0.5 rounded-md">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-450 font-medium">None added</span>
                        )}
                      </div>
                    </div>

                    {/* Specializations Tags */}
                    <div className="space-y-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Specializations</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedUser.specializations && selectedUser.specializations.length > 0 ? (
                          selectedUser.specializations.map((spec: string) => (
                            <span key={spec} className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-650 border border-blue-150 px-2 py-0.5 rounded-md">
                              {spec}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-450 font-medium">None added</span>
                        )}
                      </div>
                    </div>

                    {/* Domain Expertise Tags */}
                    <div className="space-y-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Domain Expertise</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedUser.domainExpertise && selectedUser.domainExpertise.length > 0 ? (
                          selectedUser.domainExpertise.map((domain: string) => (
                            <span key={domain} className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-650 border border-emerald-150 px-2 py-0.5 rounded-md">
                              {domain}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-450 font-medium">None added</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
