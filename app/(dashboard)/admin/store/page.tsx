"use client";

import { useState, useEffect } from "react";
import { EntityDashboard } from "@/components/admin/EntityDashboard";
import { EntityForm } from "@/components/admin/EntityForm";
import { getProducts, upsertProduct, deleteProduct } from "@/app/actions/entities";
import { toast } from "sonner";

export default function AdminStorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getProducts();
    if (res.success) setProducts(res.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Decommission this inventory unit? This will remove it from the global marketplace.")) {
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success("Inventory unit decommissioned");
        fetchProducts();
      } else {
        toast.error("Failed to decommission unit");
      }
    }
  };

  const handleSave = async (data: any) => {
    // Ensure specs is JSON
    if (typeof data.specs === "string") {
      try {
        data.specs = JSON.parse(data.specs);
      } catch (e) {
        toast.error("Invalid JSON in Specifications field");
        throw new Error("Invalid Specs JSON");
      }
    }
    
    const res = await upsertProduct(data);
    if (res.success) {
      toast.success("Inventory registry updated");
      fetchProducts();
    } else {
      toast.error("Failed to update registry");
      throw new Error(res.error);
    }
  };

  const columns = [
    { key: "name", label: "Node Identifier" },
    { key: "category", label: "Classification" },
    { key: "sku", label: "Serial Index" },
    { 
      key: "price", 
      label: "Valuation", 
      render: (val: number) => <span className="font-heading font-black text-slate-900 text-lg">₹{val.toLocaleString()}</span> 
    },
    { key: "stock", label: "Availability" },
    { 
      key: "isActive", 
      label: "Node Status",
      render: (val: boolean) => (
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
          val ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
        }`}>
          {val ? "Operational" : "Offline"}
        </span>
      )
    },
  ];

  const fields = [
    { key: "name", label: "Hardware Node Name", type: "text", placeholder: "e.g. Raspberry Pi 5 - 8GB" },
    { key: "sku", label: "Institutional SKU", type: "text", placeholder: "KVX-SBC-005" },
    { 
      key: "category", 
      label: "Component Domain", 
      type: "select", 
      options: [
        { label: "SBCs & Controllers", value: "Development Boards" },
        { label: "Sensors & Actuators", value: "Sensors" },
        { label: "Power & Energy", value: "Power Supply" },
        { label: "Interface & Display", value: "Displays" },
        { label: "Integrated Modules", value: "Modules" },
        { label: "Passive Elements", value: "Passive Components" },
        { label: "Tools & Equipment", value: "Hardware & Tools" },
      ]
    },
    { key: "price", label: "Market Valuation (INR)", type: "number" },
    { key: "mrp", label: "List Valuation (MRP)", type: "number" },
    { key: "stock", label: "Inventory Density", type: "number" },
    { key: "description", label: "Technical Narrative", type: "textarea" },
    { key: "specs", label: "Technical Matrix (JSON Format)", type: "textarea", placeholder: '{"Processor": "Broadcom BCM2712", "RAM": "8GB LPDDR4X"}' },
    { key: "images", label: "Visual Asset Vectors (URLs)", type: "array" },
    { key: "isActive", label: "Operational Registry Status", type: "select", options: [{ label: "Deploy to Market", value: true }, { label: "Hold Offline", value: false }] },
  ];

  return (
    <>
      <EntityDashboard
        title="Inventory Control Matrix"
        subtitle="Manage hardware nodes and electronic component distribution across the global store."
        entities={products}
        columns={columns as any}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <EntityForm
        title={selectedProduct ? "Calibrate Hardware Node" : "Initialize Hardware Node"}
        fields={fields as any}
        initialData={selectedProduct ? { ...selectedProduct, specs: JSON.stringify(selectedProduct.specs, null, 2) } : null}
        onSave={handleSave}
        onClose={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />
    </>
  );
}
