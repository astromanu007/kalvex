"use client";

import { useState, useEffect } from "react";
import { EntityDashboard } from "@/components/admin/EntityDashboard";
import { EntityForm } from "@/components/admin/EntityForm";
import { getServices, upsertService, deleteService } from "@/app/actions/entities";
import { toast } from "sonner";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const fetchServices = async () => {
    setLoading(true);
    const res = await getServices();
    if (res.success) setServices(res.services || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service? This action is irreversible.")) {
      const res = await deleteService(id);
      if (res.success) {
        toast.success("Service deleted successfully");
        fetchServices();
      } else {
        toast.error("Failed to delete service");
      }
    }
  };

  const handleSave = async (data: any) => {
    const res = await upsertService(data);
    if (res.success) {
      toast.success("Service updated successfully");
      fetchServices();
    } else {
      toast.error("Failed to save service");
      throw new Error(res.error);
    }
  };

  const columns = [
    { key: "title", label: "Service Name" },
    { key: "category", label: "Category" },
    { key: "icon", label: "Icon Name" },
    { 
      key: "deliverables", 
      label: "Deliverables", 
      render: (val: string[]) => (
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {val?.length || 0} Deliverables
        </span>
      )
    },
  ];

  const fields = [
    { key: "title", label: "Service Name", type: "text", placeholder: "e.g. Design Patent Drafting" },
    { 
      key: "category", 
      label: "Service Category", 
      type: "select", 
      options: [
        { label: "IPR & Legal", value: "IPR" },
        { label: "Academic Research", value: "Academic" },
        { label: "Technical Development", value: "Development" },
        { label: "Design & UX", value: "Design" },
      ]
    },
    { key: "description", label: "Service Description", type: "textarea" },
    { key: "deliverables", label: "Service Deliverables", type: "array" },
    { key: "icon", label: "Lucide Icon Key", type: "text", placeholder: "Shield, FileText, etc." },
    { key: "color", label: "Icon Color CSS Class", type: "text", placeholder: "text-blue-600" },
    { key: "bg", label: "Background CSS Class", type: "text", placeholder: "bg-blue-600/10" },
    { key: "glow", label: "Hover Shadow CSS Class", type: "text", placeholder: "group-hover:shadow-blue-600/20" },
  ];

  return (
    <>
      <EntityDashboard
        title="Services Management"
        subtitle="Manage professional platform services, pricing, and details."
        entities={services}
        columns={columns as any}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <EntityForm
        title={selectedService ? "Edit Service Details" : "Create New Service"}
        fields={fields as any}
        initialData={selectedService}
        onSave={handleSave}
        onClose={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />
    </>
  );
}
