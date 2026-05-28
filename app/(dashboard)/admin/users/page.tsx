"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Shield, Mail, Search,
  Download, MoreVertical, Clock,
  Loader2, Key, Trash2, UserCog, X, Check,
  Star, UserCheck
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
  USER:      "bg-slate-50 text-slate-400 border border-slate-200",
};

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    <div className="space-y-8 pb-20">
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
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group relative">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center font-black text-slate-900 flex-shrink-0 border border-slate-100">
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.name || "Anonymous"}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
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
                    <td className="px-6 py-5 text-right">
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
                              <div className="px-4 py-3 bg-slate-50/60 border-b border-slate-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</p>
                                <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{user.name || user.email}</p>
                              </div>

                              {/* Role options (only for ADMIN) */}
                              {(session?.user as any)?.role === "ADMIN" && (
                                <div className="p-2 space-y-0.5">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-1">Change Role</p>
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
                                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
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
    </div>
  );
}
