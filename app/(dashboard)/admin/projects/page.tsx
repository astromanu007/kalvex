"use client";

import { useState, useEffect } from "react";
import { EntityDashboard } from "@/components/admin/EntityDashboard";
import { EntityForm } from "@/components/admin/EntityForm";
import { getProjects, upsertProject, deleteProject } from "@/app/actions/entities";
import { toast } from "sonner";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await getProjects();
    if (res.success) setProjects(res.projects || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Decommission this project blueprint? This will remove it from the public repository.")) {
      const res = await deleteProject(id);
      if (res.success) {
        toast.success("Project blueprint decommissioned");
        fetchProjects();
      } else {
        toast.error("Failed to decommission blueprint");
      }
    }
  };

  const handleSave = async (data: any) => {
    const res = await upsertProject(data);
    if (res.success) {
      toast.success("Blueprint registry updated");
      fetchProjects();
    } else {
      toast.error("Failed to update registry");
      throw new Error(res.error);
    }
  };

  const columns = [
    { key: "title", label: "Mission Identifier" },
    { key: "type", label: "Classification" },
    { key: "branch", label: "Domain" },
    { 
      key: "price", 
      label: "Valuation", 
      render: (val: number) => <span className="font-heading font-black text-slate-900 text-lg">₹{val.toLocaleString()}</span> 
    },
    { key: "purchases", label: "Deployment Count" },
    { 
      key: "isActive", 
      label: "Registry Status",
      render: (val: boolean) => (
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
          val ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-rose-50 text-rose-600 border-rose-100"
        }`}>
          {val ? "Operational" : "Archived"}
        </span>
      )
    },
  ];

  const fields = [
    { key: "title", label: "Project Mission Title", type: "text", placeholder: "e.g. AI-Enhanced Autonomous Drone" },
    { 
      key: "type", 
      label: "Classification Node", 
      type: "select", 
      options: [
        { label: "Mini Project", value: "MINI" },
        { label: "Major Project", value: "MAJOR" },
        { label: "Final Year Thesis", value: "FINAL_YEAR" },
      ]
    },
    { key: "branch", label: "Engineering Vector", type: "text", placeholder: "CSE / ECE / MECH / AI" },
    { key: "year", label: "Academic Cycle", type: "number" },
    { key: "price", label: "Acquisition Cost (INR)", type: "number" },
    { key: "mrp", label: "Market Valuation (MRP)", type: "number" },
    { key: "abstract", label: "Mission Abstract", type: "textarea" },
    { key: "techStack", label: "Technology Stack Matrix", type: "array" },
    { key: "deliverables", label: "Mission Deliverables", type: "array" },
    { key: "thumbnail", label: "Visual Preview Vector (URL)", type: "text" },
    { key: "demoVideoUrl", label: "Operational Demo Link", type: "text" },
    { key: "downloadUrl", label: "Source Code Payload Link", type: "text" },
    { key: "isActive", label: "Operational Registry Status", type: "select", options: [{ label: "Deploy to Repository", value: true }, { label: "Hold Archived", value: false }] },
  ];

  return (
    <>
      <EntityDashboard
        title="Project Blueprint Matrix"
        subtitle="Manage technical blueprints and academic engineering missions within the KALVEX ecosystem."
        entities={projects}
        columns={columns as any}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <EntityForm
        title={selectedProject ? "Calibrate Mission Blueprint" : "Initialize Mission Blueprint"}
        fields={fields as any}
        initialData={selectedProject}
        onSave={handleSave}
        onClose={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />
    </>
  );
}
