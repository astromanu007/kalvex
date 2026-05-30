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
    // Stage custom array images from individual forms
    data.images = [
      data.imageMain || "",
      data.imageInspection || "",
      data.imageBlueprint || "",
      data.imagePackage || ""
    ].filter(Boolean);

    // Save technical specs JSON
    data.specs = {
      voltage: data.voltage || "5V DC",
      current: data.current || "500mA max",
      cadRef: data.cadRef || data.sku || "",
      pinoutPins: data.pinoutPins || "",
      pinoutSafety: data.pinoutSafety || "ACTIVE - Programmatically Verified"
    };

    // Remove form specific keys to match Prisma models
    delete data.imageMain;
    delete data.imageInspection;
    delete data.imageBlueprint;
    delete data.imagePackage;
    delete data.voltage;
    delete data.current;
    delete data.cadRef;
    delete data.pinoutPins;
    delete data.pinoutSafety;

    const res = await upsertProduct(data);
    if (res.success) {
      toast.success("Store inventory updated");
      fetchProducts();
    } else {
      toast.error("Failed to update product: " + res.error);
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
    { key: "brand", label: "Manufacturer Brand", type: "text", placeholder: "e.g. Raspberry Pi Foundation" },
    { key: "price", label: "Procurement Price (INR)", type: "number" },
    { key: "mrp", label: "MRP Valuation (INR)", type: "number" },
    { key: "stock", label: "Available Stock Reserve", type: "number" },
    { key: "rating", label: "Visual Star Rating (1.0 to 5.0)", type: "number" },
    { key: "description", label: "Detailed Product Description", type: "textarea" },
    
    // Custom Multi-Angle Image fields
    { key: "imageMain", label: "Main Product Image URL (View 1)", type: "text", placeholder: "HTTPS link to image" },
    { key: "imageInspection", label: "Board Inspection Image URL (View 2)", type: "text", placeholder: "HTTPS link to view 2" },
    { key: "imageBlueprint", label: "CAD Blueprint Image URL (View 3)", type: "text", placeholder: "HTTPS link to view 3" },
    { key: "imagePackage", label: "Procurement Package Image URL (View 4)", type: "text", placeholder: "HTTPS link to view 4" },
    
    // Custom electrical specs & pinouts
    { key: "voltage", label: "Operating Voltage Specification", type: "text", placeholder: "e.g. 5V DC via USB-C" },
    { key: "current", label: "Current Consumption Specification", type: "text", placeholder: "e.g. 5A recommended" },
    { key: "cadRef", label: "CAD Vector Pinout Reference Code", type: "text", placeholder: "e.g. CAD-RPI5-X01" },
    { key: "pinoutPins", label: "On-Board Pin names (Comma-separated)", type: "text", placeholder: "GPIO2, GPIO3, I2C, SPI, VCC, GND" },
    { key: "pinoutSafety", label: "Safety System Protocals details", type: "text", placeholder: "e.g. ACTIVE - Dual Fuse Protected" },
    
    { key: "isActive", label: "Product Status", type: "select", options: [{ label: "Active / Publish", value: true }, { label: "Inactive / Keep Draft", value: false }] },
  ];

  // Map database entity model parameters to frontend individual fields
  const getMappedInitialData = () => {
    if (!selectedProduct) return null;
    const specsObj = selectedProduct.specs && typeof selectedProduct.specs === "object" ? selectedProduct.specs : {};
    
    return {
      ...selectedProduct,
      imageMain: selectedProduct.images?.[0] || "",
      imageInspection: selectedProduct.images?.[1] || "",
      imageBlueprint: selectedProduct.images?.[2] || "",
      imagePackage: selectedProduct.images?.[3] || "",
      voltage: (specsObj as any).voltage || "",
      current: (specsObj as any).current || "",
      cadRef: (specsObj as any).cadRef || "",
      pinoutPins: (specsObj as any).pinoutPins || "",
      pinoutSafety: (specsObj as any).pinoutSafety || ""
    };
  };

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
        initialData={getMappedInitialData()}
        onSave={handleSave}
        onClose={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />
    </>
  );
}
