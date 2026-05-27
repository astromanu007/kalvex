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
    if (confirm("Are you sure you want to delete this product? This will remove it from the store.")) {
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
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
      toast.success("Store inventory updated");
      fetchProducts();
    } else {
      toast.error("Failed to update product");
      throw new Error(res.error);
    }
  };

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "sku", label: "SKU" },
    { 
      key: "price", 
      label: "Price", 
      render: (val: number) => <span className="font-heading font-black text-slate-900 text-lg">₹{val.toLocaleString()}</span> 
    },
    { key: "stock", label: "Stock Level" },
    { 
      key: "isActive", 
      label: "Status",
      render: (val: boolean) => (
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
          val ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
        }`}>
          {val ? "Active" : "Inactive"}
        </span>
      )
    },
  ];

  const fields = [
    { key: "name", label: "Product Name", type: "text", placeholder: "e.g. Raspberry Pi 5 - 8GB" },
    { key: "sku", label: "SKU / Code", type: "text", placeholder: "KVX-SBC-005" },
    { 
      key: "category", 
      label: "Product Category", 
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
    { key: "price", label: "Price (INR)", type: "number" },
    { key: "mrp", label: "MRP Valuation", type: "number" },
    { key: "stock", label: "Stock Quantity", type: "number" },
    { key: "description", label: "Product Description", type: "textarea" },
    { key: "specs", label: "Technical Specifications (JSON Format)", type: "textarea", placeholder: '{"Processor": "Broadcom BCM2712", "RAM": "8GB LPDDR4X"}' },
    { key: "images", label: "Product Image URLs", type: "array" },
    { key: "isActive", label: "Product Status", type: "select", options: [{ label: "Active / Publish", value: true }, { label: "Inactive / Keep Draft", value: false }] },
  ];

  return (
    <>
      <EntityDashboard
        title="Store Inventory"
        subtitle="Manage lab hardware kits, microcontrollers, and electronic components."
        entities={products}
        columns={columns as any}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <EntityForm
        title={selectedProduct ? "Edit Product Details" : "Add New Product"}
        fields={fields as any}
        initialData={selectedProduct ? { ...selectedProduct, specs: JSON.stringify(selectedProduct.specs, null, 2) } : null}
        onSave={handleSave}
        onClose={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />
    </>
  );
}
