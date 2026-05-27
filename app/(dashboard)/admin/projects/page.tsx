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
    if (confirm("Are you sure you want to delete this project? This will remove it from the public directory.")) {
      const res = await deleteProject(id);
      if (res.success) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleSave = async (data: any) => {
    const res = await upsertProject(data);
    if (res.success) {
      toast.success("Project list updated");
      fetchProjects();
    } else {
      toast.error("Failed to update projects");
      throw new Error(res.error);
    }
  };

  const columns = [
    { key: "title", label: "Project Title" },
    { key: "type", label: "Category" },
    { key: "branch", label: "Department / Branch" },
    { 
      key: "price", 
      label: "Price", 
      render: (val: number) => <span className="font-heading font-black text-slate-900 text-lg">₹{val.toLocaleString()}</span> 
    },
    { key: "purchases", label: "Sales Count" },
    { 
      key: "isActive", 
      label: "Status",
      render: (val: boolean) => (
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
          val ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-rose-50 text-rose-600 border-rose-100"
        }`}>
          {val ? "Active" : "Archived"}
        </span>
      )
    },
  ];

  const fields = [
    { key: "title", label: "Project Title", type: "text", placeholder: "e.g. AI-Enhanced Autonomous Drone" },
    { 
      key: "type", 
      label: "Project Category", 
      type: "select", 
      options: [
        { label: "Mini Project", value: "MINI" },
        { label: "Major Project", value: "MAJOR" },
        { label: "Final Year Thesis", value: "FINAL_YEAR" },
      ]
    },
    { key: "branch", label: "Engineering Branch", type: "text", placeholder: "CSE / ECE / MECH / AI" },
    { key: "year", label: "Academic Year", type: "number" },
    { key: "price", label: "Price (INR)", type: "number" },
    { key: "mrp", label: "MRP Valuation", type: "number" },
    { key: "abstract", label: "Project Abstract / Summary", type: "textarea" },
    { key: "techStack", label: "Technology Stack", type: "array" },
    { key: "deliverables", label: "Project Deliverables", type: "array" },
    { key: "thumbnail", label: "Thumbnail Image URL", type: "text" },
    { key: "demoVideoUrl", label: "Demo Video Link", type: "text" },
    { key: "downloadUrl", label: "Source Code Link", type: "text" },
    { key: "isActive", label: "Project Status", type: "select", options: [{ label: "Active / Published", value: true }, { label: "Archived / Draft", value: false }] },
  ];

  return (
    <>
      <EntityDashboard
        title="Project Catalog"
        subtitle="Manage student engineering projects and source code listings."
        entities={projects}
        columns={columns as any}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <EntityForm
        title={selectedProject ? "Edit Project Details" : "Create New Project"}
        fields={fields as any}
        initialData={selectedProject}
        onSave={handleSave}
        onClose={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />
    </>
  );
}
