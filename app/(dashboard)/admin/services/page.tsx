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
    if (confirm("Terminate this service protocol? This action is irreversible.")) {
      const res = await deleteService(id);
      if (res.success) {
        toast.success("Service protocol terminated");
        fetchServices();
      } else {
        toast.error("Failed to terminate protocol");
      }
    }
  };

  const handleSave = async (data: any) => {
    const res = await upsertService(data);
    if (res.success) {
      toast.success("Protocol parameters updated");
      fetchServices();
    } else {
      toast.error("Failed to save protocol");
      throw new Error(res.error);
    }
  };

  const columns = [
    { key: "title", label: "Service Protocol" },
    { key: "category", label: "Classification" },
    { key: "icon", label: "Vector Icon" },
    { 
      key: "deliverables", 
      label: "Node Outputs", 
      render: (val: string[]) => (
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {val?.length || 0} Parameters
        </span>
      )
    },
  ];

  const fields = [
    { key: "title", label: "Service Protocol Name", type: "text", placeholder: "e.g. Design Patent Drafting" },
    { 
      key: "category", 
      label: "Classification Domain", 
      type: "select", 
      options: [
        { label: "IPR & Legal", value: "IPR" },
        { label: "Academic Research", value: "Academic" },
        { label: "Technical Development", value: "Development" },
        { label: "Design & UX", value: "Design" },
      ]
    },
    { key: "description", label: "Detailed Protocol Specifications", type: "textarea" },
    { key: "deliverables", label: "Service Deliverables (Vectors)", type: "array" },
    { key: "icon", label: "Lucide Vector Key", type: "text", placeholder: "Shield, FileText, etc." },
    { key: "color", label: "Primary Accent Class", type: "text", placeholder: "text-blue-600" },
    { key: "bg", label: "Secondary Accent Class", type: "text", placeholder: "bg-blue-600/10" },
    { key: "glow", label: "Photonic Shadow Class", type: "text", placeholder: "group-hover:shadow-blue-600/20" },
  ];

  return (
    <>
      <EntityDashboard
        title="Service Control Matrix"
        subtitle="Calibrate professional service protocols and expert deployment nodes."
        entities={services}
        columns={columns as any}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <EntityForm
        title={selectedService ? "Calibrate Protocol Node" : "Initialize Service Node"}
        fields={fields as any}
        initialData={selectedService}
        onSave={handleSave}
        onClose={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />
    </>
  );
}
