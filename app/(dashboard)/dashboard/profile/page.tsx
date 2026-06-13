"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Camera, Save, GraduationCap, User, Lock, Bell, Briefcase, Github,
  Globe, CheckCircle2, Loader2, Sparkles, Cpu, Award, Shield, Eye,
  Smartphone, MapPin, Check, Plus, Upload, Trash2, ShieldCheck, AlertCircle,
  FileCheck, Star
} from "lucide-react";
import { updateProfile, changePassword, getProfileDetails } from "@/app/actions/user";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isExpert = role === "WRITER" || role === "DEVELOPER";

  const [tab, setTab] = useState<"personal" | "professional" | "academic" | "security" | "notifications" | "sessions">("personal");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile fields state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    college: "",
    branch: "",
    year: "",
    githubUrl: "",
    portfolioUrl: "",
    experienceYears: "",
    linkedinUrl: "",
    sampleWorkUrl: "",
  });

  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpecTag, setNewSpecTag] = useState("");

  const [domainExpertise, setDomainExpertise] = useState<string[]>([]);
  const [newDomainTag, setNewDomainTag] = useState("");

  // Student Interests / Focus Areas (Default options)
  const [studentInterests, setStudentInterests] = useState<string[]>(["Embedded Systems", "Circuit Design", "Thesis Writing"]);
  const [newInterestInput, setNewInterestInput] = useState("");

  // Student ID document mock upload state
  const [uploadedDoc, setUploadedDoc] = useState<string | null>("student_id_card.pdf");
  const [isUploading, setIsUploading] = useState(false);

  // Dynamic profile completion strength calculation
  const profileStrength = (() => {
    let score = 0;
    if (profileData.name) score += 15;
    if (profileData.phone) score += 15;
    if (profileData.city) score += 10;
    if (isExpert) {
      if (domainExpertise.length > 0) score += 20;
      if (techStack.length > 0) score += 20;
      if (profileData.githubUrl || profileData.linkedinUrl) score += 20;
    } else {
      if (profileData.college) score += 20;
      if (profileData.branch) score += 20;
      if (uploadedDoc) score += 20;
    }
    return score;
  })();

  useEffect(() => {
    if (!session?.user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const res = await getProfileDetails();
      if (res.success && res.profile) {
        setProfileData({
          name: res.profile.name || "",
          email: res.profile.email || "",
          phone: res.profile.phone || "",
          city: res.profile.city || "",
          college: res.profile.college || "",
          branch: res.profile.branch || "",
          year: res.profile.year?.toString() || "",
          githubUrl: res.profile.githubUrl || "",
          portfolioUrl: res.profile.portfolioUrl || "",
          experienceYears: res.profile.experienceYears?.toString() || "",
          linkedinUrl: res.profile.linkedinUrl || "",
          sampleWorkUrl: res.profile.sampleWorkUrl || "",
        });
        setTechStack(res.profile.skills || []);
        setSpecializations(res.profile.specializations || []);
        setDomainExpertise(res.profile.domainExpertise || []);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [session]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);

    if (tab === "security") {
      const currentPassword = formData.get("currentPassword") as string;
      const newPassword = formData.get("newPassword") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Please fill in all password fields.");
        setSaving(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match.");
        setSaving(false);
        return;
      }

      const res = await changePassword({ currentPassword, newPassword });
      setSaving(false);
      if (res.success) {
        toast.success("Password updated successfully!");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        e.currentTarget.reset();
      } else {
        toast.error(res.error || "Failed to update password.");
      }
      return;
    }

    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      college: formData.get("college") as string,
      branch: formData.get("branch") as string,
      year: formData.get("year") ? parseInt(formData.get("year") as string) : undefined,
      skills: techStack,
      githubUrl: formData.get("github") as string,
      portfolioUrl: formData.get("website") as string,
      experienceYears: formData.get("experienceYears") ? parseInt(formData.get("experienceYears") as string) : undefined,
      linkedinUrl: formData.get("linkedin") as string,
      sampleWorkUrl: formData.get("sampleWork") as string,
      specializations,
      domainExpertise,
    };

    const res = await updateProfile(data);
    
    setSaving(false);
    if (res.success) {
      toast.success("Profile updated successfully!");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      toast.error(res.error || "Failed to update profile.");
    }
  };

  // Tag helper controls
  const addDomainTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newDomainTag.trim()) {
      e.preventDefault();
      if (!domainExpertise.includes(newDomainTag.trim())) {
        setDomainExpertise([...domainExpertise, newDomainTag.trim()]);
      }
      setNewDomainTag("");
    }
  };

  const removeDomainTag = (tag: string) => {
    setDomainExpertise(domainExpertise.filter(t => t !== tag));
  };

  const addSpecTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSpecTag.trim()) {
      e.preventDefault();
      if (!specializations.includes(newSpecTag.trim())) {
        setSpecializations([...specializations, newSpecTag.trim()]);
      }
      setNewSpecTag("");
    }
  };

  const removeSpecTag = (tag: string) => {
    setSpecializations(specializations.filter(t => t !== tag));
  };

  const addTechTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!techStack.includes(newTag.trim())) {
        setTechStack([...techStack, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const removeTechTag = (tag: string) => {
    setTechStack(techStack.filter(t => t !== tag));
  };

  const addInterestTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newInterestInput.trim()) {
      e.preventDefault();
      if (!studentInterests.includes(newInterestInput.trim())) {
        setStudentInterests([...studentInterests, newInterestInput.trim()]);
      }
      setNewInterestInput("");
    }
  };

  const removeInterestTag = (tag: string) => {
    setStudentInterests(studentInterests.filter(t => t !== tag));
  };

  const handleMockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setUploadedDoc("student_id_card_verified.pdf");
      setIsUploading(false);
      toast.success("Document uploaded successfully!");
    }, 1500);
  };

  const TABS = [
    { id: "personal", label: "Profile Details", icon: User, visible: true },
    { id: "academic", label: "Academic Info", icon: GraduationCap, visible: !isExpert },
    { id: "professional", label: "Professional Bio", icon: Briefcase, visible: isExpert },
    { id: "security", label: "Security & Passwords", icon: Lock, visible: true },
    { id: "notifications", label: "Alerts & Emails", icon: Bell, visible: true },
    { id: "sessions", label: "Active Sessions", icon: Shield, visible: true }
  ] as const;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-650 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Vercel-style Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-indigo-650" /> Account Settings
          </div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
            Personal Workspace
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Configure your identities, verify credentials, and manage sessions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Side: Vercel-style Card and Navigation */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Identity Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-heading font-black text-3xl shadow-xl shadow-indigo-500/10">
                {profileData.name?.charAt(0) ?? "U"}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform border-2 border-white">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-1">
              <h2 className="font-heading font-black text-base text-slate-900 leading-tight">
                {profileData.name || "Workspace Member"}
              </h2>
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-100/50">
                {role ?? "STUDENT"}
              </span>
            </div>

            {/* Profile strength progress bar */}
            <div className="w-full space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-400">
                <span>Profile Strength</span>
                <span className="text-indigo-650">{profileStrength}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" 
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
            </div>

            {/* Static badges */}
            <div className="w-full pt-4 border-t border-slate-100 space-y-2 text-[10px] font-bold">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 uppercase tracking-wider">
                  {isExpert ? "Developer ID" : "Student ID"}
                </span>
                <span className="font-mono text-slate-900 bg-slate-50 px-2 py-0.5 border border-slate-200 rounded">
                  {session?.user?.maskedId ?? "KV-STU-3462"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 uppercase tracking-wider">Status</span>
                <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 font-extrabold text-[8px] uppercase tracking-wider">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Vercel-style Sidebar Navigation */}
          <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-sm space-y-1">
            {TABS.filter(t => t.visible).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                  tab === t.id 
                    ? "bg-slate-950 text-white shadow-md" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <t.icon className="w-4 h-4 shrink-0" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Right Side: Tab Panel Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Personal Info Tab */}
              {tab === "personal" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-heading font-black text-base text-slate-900 uppercase tracking-wider">Profile Information</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Your core contact information and workspace details</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: "Full Name", name: "name", defaultValue: profileData.name, type: "text", placeholder: "e.g. Manish Student" },
                      { label: "Email Address", name: "email", defaultValue: profileData.email, type: "email", disabled: true, placeholder: "e.g. kalvextechnologies@gmail.com" },
                      { label: "Phone Number", name: "phone", defaultValue: profileData.phone, type: "tel", placeholder: "e.g. +91 98765 43210" },
                      { label: "Location / City", name: "city", defaultValue: profileData.city, type: "text", placeholder: "e.g. Mumbai" },
                    ].map(({ label, name, defaultValue, type, disabled, placeholder }) => (
                      <div key={label} className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                        <input 
                          name={name} 
                          type={type} 
                          defaultValue={defaultValue} 
                          disabled={disabled}
                          placeholder={placeholder}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-all" 
                        />
                      </div>
                    ))}
                  </div>

                  {/* Student Focus Chips (Dynamic Interests) */}
                  {!isExpert && (
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Interests & Research Areas (Press Enter to Add)</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        {studentInterests.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-150 px-2.5 py-1.5 rounded-lg">
                            {tag}
                            <button type="button" onClick={() => removeInterestTag(tag)} className="hover:text-red-500 font-extrabold ml-1">&times;</button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="e.g. Internet of Things, Robotics, Circuit Design..."
                          value={newInterestInput}
                          onChange={e => setNewInterestInput(e.target.value)}
                          onKeyDown={addInterestTag}
                          className="bg-transparent border-0 focus:ring-0 focus:outline-none text-xs font-bold text-slate-700 w-full md:w-80 mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Academic Info Tab */}
              {tab === "academic" && !isExpert && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-heading font-black text-base text-slate-900 uppercase tracking-wider">Educational Information</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Manage your student credentials and college affiliations</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: "College / University", name: "college", defaultValue: profileData.college, placeholder: "e.g. VIT Pune" },
                      { label: "Branch / Department", name: "branch", defaultValue: profileData.branch, placeholder: "e.g. Computer Engineering" },
                      { label: "Year of Study", name: "year", defaultValue: profileData.year, placeholder: "e.g. Final Year" },
                    ].map(({ label, name, defaultValue, placeholder }) => (
                      <div key={label} className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">{label}</label>
                        <input 
                          name={name} 
                          defaultValue={defaultValue} 
                          placeholder={placeholder} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 focus:bg-white transition-all" 
                        />
                      </div>
                    ))}
                  </div>

                  {/* Document Vault Mock */}
                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Student Verification Center</h4>
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Upload student ID card to unlock student discount rates</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uploadedDoc ? (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{uploadedDoc}</p>
                              <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-emerald-600 tracking-wider">
                                ✓ Verified Student Status
                              </span>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setUploadedDoc(null)} 
                            className="text-slate-400 hover:text-red-500 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={handleMockUpload}
                          className="border-2 border-dashed border-slate-250 bg-slate-50/50 hover:bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                        >
                          {isUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-slate-400 mb-2" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Upload Student ID</span>
                              <span className="text-[8px] font-semibold text-slate-400 mt-1">PDF, JPG up to 5MB</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Bio Tab (Experts only) */}
              {tab === "professional" && isExpert && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-heading font-black text-base text-slate-900 uppercase tracking-wider">Professional Developer Bio</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Define your domain competence, tech stacks, and hardware expertise</p>
                  </div>

                  <div className="space-y-5">
                    {/* Domain tags */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">Developer Field / Domain Type (Press Enter to Add)</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        {domainExpertise.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-150 px-2.5 py-1 rounded-lg">
                            {tag}
                            <button type="button" onClick={() => removeDomainTag(tag)} className="hover:text-red-500 font-extrabold ml-1">&times;</button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="e.g. Embedded Firmware, PCB Design, Software Developer..."
                          value={newDomainTag}
                          onChange={e => setNewDomainTag(e.target.value)}
                          onKeyDown={addDomainTag}
                          className="bg-transparent border-0 focus:ring-0 focus:outline-none text-xs font-bold text-slate-700 w-full md:w-80 mt-1"
                        />
                      </div>
                    </div>

                    {/* Hardware competence */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">Hardware Competence / Hardware Boards (Press Enter to Add)</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        {specializations.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-150 px-2.5 py-1 rounded-lg">
                            {tag}
                            <button type="button" onClick={() => removeSpecTag(tag)} className="hover:text-red-500 font-extrabold ml-1">&times;</button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="e.g. Arduino, ESP32, STM32, Raspberry Pi, FPGA..."
                          value={newSpecTag}
                          onChange={e => setNewSpecTag(e.target.value)}
                          onKeyDown={addSpecTag}
                          className="bg-transparent border-0 focus:ring-0 focus:outline-none text-xs font-bold text-slate-700 w-full md:w-80 mt-1"
                        />
                      </div>
                    </div>

                    {/* Tech stack tags */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">Technologies & Languages (Press Enter to Add)</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        {techStack.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-150 px-2.5 py-1 rounded-lg">
                            {tag}
                            <button type="button" onClick={() => removeTechTag(tag)} className="hover:text-red-500 font-extrabold ml-1">&times;</button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="e.g. TypeScript, Python, Embedded C, Rust..."
                          value={newTag}
                          onChange={e => setNewTag(e.target.value)}
                          onKeyDown={addTechTag}
                          className="bg-transparent border-0 focus:ring-0 focus:outline-none text-xs font-bold text-slate-700 w-full md:w-80 mt-1"
                        />
                      </div>
                    </div>

                    {/* URL fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">GitHub Profile URL</label>
                        <div className="relative">
                          <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input name="github" type="url" defaultValue={profileData.githubUrl} placeholder="https://github.com/username" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 focus:bg-white transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">LinkedIn Profile URL</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input name="linkedin" type="url" defaultValue={profileData.linkedinUrl} placeholder="https://linkedin.com/in/username" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 focus:bg-white transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">Years of Experience</label>
                        <input name="experienceYears" type="number" min="0" defaultValue={profileData.experienceYears} placeholder="e.g. 3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 focus:bg-white transition-all" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">Portfolio Website</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input name="website" type="url" defaultValue={profileData.portfolioUrl} placeholder="https://mywebsite.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 focus:bg-white transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">Resume / Work Samples Link</label>
                      <div className="relative">
                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input name="sampleWork" type="url" defaultValue={profileData.sampleWorkUrl} placeholder="https://drive.google.com/..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 focus:bg-white transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Password/Security Tab */}
              {tab === "security" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-heading font-black text-base text-slate-900 uppercase tracking-wider">Security Configuration</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Ensure your account uses a strong, unique password</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Current Password", name: "currentPassword" },
                      { label: "New Password", name: "newPassword" },
                      { label: "Confirm New Password", name: "confirmPassword" }
                    ].map((field) => (
                      <div key={field.label} className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">{field.label}</label>
                        <input 
                          name={field.name} 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-650 focus:bg-white transition-all" 
                          required 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences/Alerts Tab */}
              {tab === "notifications" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-heading font-black text-base text-slate-900 uppercase tracking-wider">Alerts & Subscriptions</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Choose which notifications you wish to receive</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Order & Task milestone updates", sub: "Get immediate alerts when project statuses change or payments verify." },
                      { label: "Direct Coordinator Messages", sub: "Notify when coordinator or development assistant sends messages." },
                      { label: "System Announcements & Offers", sub: "Incentive promotions, support news, and seasonal discounts." },
                      { label: "WhatsApp alerts channel", sub: "Receive order tracking progress reports on your phone number." },
                    ].map((pref) => (
                      <div key={pref.label} className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100 last:border-0">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{pref.label}</p>
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-normal">{pref.sub}</p>
                        </div>
                        <div className="relative flex-shrink-0">
                          <input type="checkbox" className="sr-only peer" defaultChecked id={pref.label} />
                          <label htmlFor={pref.label} className="block w-10 h-6 bg-slate-100 border border-slate-250 rounded-full cursor-pointer peer-checked:bg-slate-950 peer-checked:border-slate-950 transition-colors after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 peer-checked:after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-transform peer-checked:after:translate-x-4 after:shadow-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Sessions Tab (Mock Authorized Devices) */}
              {tab === "sessions" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-heading font-black text-base text-slate-900 uppercase tracking-wider">Authorized Sessions</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Manage and revoke active login sessions on your account</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Security Audit</h4>
                        <p className="text-[10px] font-semibold text-slate-400 leading-normal uppercase tracking-wider">
                          If you notice unrecognized device activities, immediately sign out of all other sessions and change your password.
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {[
                        { device: "Chrome / Windows 11", location: "Mumbai, India", current: true, time: "Active Now" },
                        { device: "Safari / iPhone 15 Pro", location: "Mumbai, India", current: false, time: "2 hours ago" },
                      ].map((sess, idx) => (
                        <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-650">
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{sess.device}</span>
                                {sess.current && (
                                  <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-emerald-100/50">
                                    Current Session
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <MapPin className="w-3 h-3 text-slate-350" />
                                <span>{sess.location} · {sess.time}</span>
                              </div>
                            </div>
                          </div>
                          {!sess.current && (
                            <button 
                              type="button" 
                              onClick={() => toast.success("Revoked device session successfully")}
                              className="text-[9px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-155/30 transition-all"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              {tab !== "sessions" && (
                <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                  <Button type="submit" disabled={saving} className="bg-slate-950 hover:bg-indigo-650 text-white rounded-xl h-11 px-8 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                      </>
                    ) : saved ? (
                      <>
                        <Check className="w-4 h-4" /> Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Workspace
                      </>
                    )}
                  </Button>
                </div>
              )}

            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
