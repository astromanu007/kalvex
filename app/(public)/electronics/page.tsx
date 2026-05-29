"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Heart, ShoppingCart, Sparkles, Box, Cpu, Zap, Monitor, Settings, Battery, ChevronRight, Shield, ArrowRight, CheckCircle, ShoppingBag, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

const PRODUCTS = [
  // Development Boards
  { id: "1", name: "Raspberry Pi 5 8GB RAM", sku: "KVX-SBC-005", price: 8500, mrp: 9200, category: "Development Boards", stock: 15, rating: 4.8, image: "/products/pi5.png" },
  { id: "2", name: "Arduino Uno R4 WiFi", sku: "KVX-SBC-004", price: 2450, mrp: 2800, category: "Development Boards", stock: 120, rating: 4.9, image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=600" },
  { id: "3", name: "ESP32-S3 DevKitC-1", sku: "KVX-MOD-033", price: 550, mrp: 750, category: "Development Boards", stock: 45, rating: 4.7, image: "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&q=80&w=600" },
  { id: "4", name: "Jetson Orin Nano Developer Kit", sku: "KVX-SBC-009", price: 45000, mrp: 48000, category: "Development Boards", stock: 5, rating: 5.0, image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600" },
  { id: "5", name: "STM32 Blue Pill (STM32F103C8T6)", sku: "KVX-SBC-032", price: 280, mrp: 400, category: "Development Boards", stock: 300, rating: 4.3, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600" },
  { id: "41", name: "BeagleBone Black Rev C", sku: "KVX-SBC-010", price: 5800, mrp: 6500, category: "Development Boards", stock: 20, rating: 4.6, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" },
  { id: "42", name: "Teensy 4.1 USB Development Board", sku: "KVX-SBC-041", price: 3200, mrp: 3800, category: "Development Boards", stock: 15, rating: 4.9, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" },

  // Sensors
  { id: "6", name: "MPU6050 6-Axis Gyro/Accel", sku: "KVX-SEN-605", price: 180, mrp: 250, category: "Sensors", stock: 150, rating: 4.6, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" },
  { id: "7", name: "DHT22 Digital Temp & Humidity", sku: "KVX-SEN-022", price: 320, mrp: 450, category: "Sensors", stock: 80, rating: 4.5, image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=600" },
  { id: "8", name: "HC-SR04 Ultrasonic Sensor", sku: "KVX-SEN-004", price: 85, mrp: 120, category: "Sensors", stock: 500, rating: 4.4, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600" },
  { id: "9", name: "BMP280 Barometric Pressure", sku: "KVX-SEN-280", price: 150, mrp: 220, category: "Sensors", stock: 200, rating: 4.7, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" },
  { id: "10", name: "TCS3200 Color Sensor Module", sku: "KVX-SEN-320", price: 350, mrp: 500, category: "Sensors", stock: 40, rating: 4.2, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" },
  { id: "43", name: "VL53L0X Time of Flight Sensor", sku: "KVX-SEN-530", price: 450, mrp: 600, category: "Sensors", stock: 65, rating: 4.8, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600" },
  { id: "44", name: "MQ-2 Gas & Smoke Sensor", sku: "KVX-SEN-002", price: 120, mrp: 180, category: "Sensors", stock: 120, rating: 4.3, image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=600" },
  { id: "45", name: "RC522 RFID Reader Module", sku: "KVX-MOD-522", price: 280, mrp: 400, category: "Sensors", stock: 85, rating: 4.6, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" },

  // Modules
  { id: "11", name: "L298N Motor Driver Module", sku: "KVX-MOD-015", price: 150, mrp: 200, category: "Modules", stock: 120, rating: 4.5, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600" },
  { id: "12", name: "SIM800L GSM/GPRS Module", sku: "KVX-MOD-800", price: 450, mrp: 650, category: "Modules", stock: 0, rating: 4.1, image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=600" },
  { id: "13", name: "NEO-6M GPS Module with Antenna", sku: "KVX-MOD-006", price: 850, mrp: 1200, category: "Modules", stock: 35, rating: 4.6, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" },
  { id: "14", name: "nRF24L01+ Wireless Transceiver", sku: "KVX-MOD-241", price: 120, mrp: 180, category: "Modules", stock: 400, rating: 4.4, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" },
  { id: "15", name: "DS3231 RTC Precision Clock", sku: "KVX-MOD-231", price: 180, mrp: 300, category: "Modules", stock: 90, rating: 4.8, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600" },

  // Displays
  { id: "16", name: "0.96 inch OLED Display I2C", sku: "KVX-DIS-096", price: 250, mrp: 350, category: "Displays", stock: 150, rating: 4.9, image: "https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?auto=format&fit=crop&q=80&w=600" },
  { id: "17", name: "16x2 LCD with I2C Module", sku: "KVX-DIS-162", price: 280, mrp: 400, category: "Displays", stock: 200, rating: 4.6, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" },
  { id: "18", name: "2.4 inch TFT LCD Touch", sku: "KVX-DIS-240", price: 650, mrp: 850, category: "Displays", stock: 25, rating: 4.3, image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=600" },
  { id: "19", name: "Nextion 4.3 inch HMI Display", sku: "KVX-DIS-430", price: 3200, mrp: 4500, category: "Displays", stock: 12, rating: 4.7, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" },
  { id: "20", name: "8x8 LED Matrix (MAX7219)", sku: "KVX-DIS-888", price: 180, mrp: 280, category: "Displays", stock: 100, rating: 4.5, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" },

  // Motors & Drivers
  { id: "21", name: "NEMA 17 Stepper Motor", sku: "KVX-MOT-017", price: 850, mrp: 1100, category: "Motors & Drivers", stock: 60, rating: 4.7, image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=600" },
  { id: "22", name: "SG90 Micro Servo Motor", sku: "KVX-MOT-090", price: 120, mrp: 180, category: "Motors & Drivers", stock: 1000, rating: 4.4, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" },
  { id: "23", name: "MG996R High Torque Servo", sku: "KVX-MOT-996", price: 450, mrp: 600, category: "Motors & Drivers", stock: 45, rating: 4.6, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" },
  { id: "24", name: "DRV8825 Stepper Driver", sku: "KVX-MOD-825", price: 150, mrp: 220, category: "Motors & Drivers", stock: 120, rating: 4.3, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600" },
  { id: "25", name: "A4988 Stepper Driver Module", sku: "KVX-MOD-498", price: 95, mrp: 150, category: "Motors & Drivers", stock: 300, rating: 4.1, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600" },

  // Power Supply
  { id: "26", name: "12V 5A Power Adapter", sku: "KVX-PWR-125", price: 450, mrp: 600, category: "Power Supply", stock: 85, rating: 4.5, image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=600" },
  { id: "27", name: "LM2596 Buck Converter", sku: "KVX-MOD-259", price: 85, mrp: 150, category: "Power Supply", stock: 250, rating: 4.7, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" },
  { id: "28", name: "TP4056 Lipo Charger Module", sku: "KVX-MOD-405", price: 45, mrp: 80, category: "Power Supply", stock: 500, rating: 4.8, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" },
  { id: "29", name: "3.7V 2000mAh Li-po Battery", sku: "KVX-PWR-037", price: 380, mrp: 550, category: "Power Supply", stock: 30, rating: 4.2, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600" },
  { id: "30", name: "MeanWell 24V 10A PSU", sku: "KVX-PWR-241", price: 2850, mrp: 3500, category: "Power Supply", stock: 8, rating: 4.9, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600" },

  // Passive Components
  { id: "31", name: "Resistor Assortment Kit (600pcs)", sku: "KVX-PAS-001", price: 250, mrp: 450, category: "Passive Components", stock: 100, rating: 4.8, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600" },
  { id: "32", name: "Ceramic Capacitor Kit", sku: "KVX-PAS-002", price: 180, mrp: 300, category: "Passive Components", stock: 150, rating: 4.6, image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=600" },
  { id: "33", name: "Electrolytic Capacitor Kit", sku: "KVX-PAS-003", price: 350, mrp: 550, category: "Passive Components", stock: 80, rating: 4.7, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" },
  { id: "34", name: "Tactile Push Button Set", sku: "KVX-PAS-004", price: 85, mrp: 150, category: "Passive Components", stock: 300, rating: 4.5, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" },
  { id: "35", name: "5mm LED RGB Common Cathode", sku: "KVX-PAS-005", price: 15, mrp: 30, category: "Passive Components", stock: 1000, rating: 4.4, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600" },

  // Hardware & Tools
  { id: "36", name: "Precision Screwdriver Set", sku: "KVX-TLS-001", price: 850, mrp: 1200, category: "Hardware & Tools", stock: 45, rating: 4.9, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600" },
  { id: "37", name: "Adjustable Soldering Iron Kit", sku: "KVX-TLS-002", price: 1200, mrp: 1800, category: "Hardware & Tools", stock: 25, rating: 4.7, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600" },
  { id: "38", name: "Digital Multimeter (Auto-range)", sku: "KVX-TLS-003", price: 1450, mrp: 2200, category: "Hardware & Tools", stock: 15, rating: 4.8, image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=600" },
  { id: "39", name: "Breadboard 830 Points (MB102)", sku: "KVX-TLS-004", price: 120, mrp: 200, category: "Hardware & Tools", stock: 400, rating: 4.6, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" },
  { id: "40", name: "Jumper Wire Kit (M-M, M-F, F-F)", sku: "KVX-TLS-005", price: 180, mrp: 300, category: "Hardware & Tools", stock: 500, rating: 4.5, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" }
];

const CATEGORIES = [
  "All Products",
  "Development Boards",
  "Modules",
  "Sensors",
  "Displays",
  "Motors & Drivers",
  "Power Supply",
  "Passive Components",
  "Hardware & Tools"
];

export default function ElectronicsStore() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Relevance");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const syncWishlist = () => {
      try {
        const saved = localStorage.getItem("kalvex_saved");
        if (saved) {
          const items = JSON.parse(saved);
          if (Array.isArray(items)) {
            setWishlist(items);
          }
        } else {
          setWishlist([]);
        }
      } catch (err) {}
    };

    syncWishlist();
    window.addEventListener("kalvex-wishlist-updated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("kalvex-wishlist-updated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const toggleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const saved = localStorage.getItem("kalvex_saved");
      let items = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(items)) items = [];

      const exists = items.some((i: any) => i.id === product.id);
      if (exists) {
        items = items.filter((i: any) => i.id !== product.id);
      } else {
        items.push({
          ...product,
          qty: 1,
        });
      }

      localStorage.setItem("kalvex_saved", JSON.stringify(items));
      window.dispatchEvent(new Event("kalvex-wishlist-updated"));
      
      const toast = document.createElement("div");
      toast.className = "fixed bottom-8 right-8 z-[500] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans text-xs font-bold uppercase tracking-wider";
      toast.innerHTML = exists 
        ? `<span class="text-slate-400">×</span> Removed from wishlist.` 
        : `<span class="text-red-500">❤️</span> Added to wishlist.`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.className += " animate-out fade-out duration-300";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } catch (err) {}
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === "All Products" || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMinPrice = minPrice === "" || p.price >= parseInt(minPrice);
      const matchesMaxPrice = maxPrice === "" || p.price <= parseInt(maxPrice);
      const matchesStock = !inStockOnly || p.stock > 0;

      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock;
    });

    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Top Rated") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, minPrice, maxPrice, inStockOnly, sortBy]);

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!session) {
      router.push("/login");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      
      let itemsAdded = 0;
      const stored = localStorage.getItem("kalvex_cart");
      let cartItems: any[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(cartItems)) cartItems = [];

      lines.forEach((line) => {
        const [sku, qtyStr] = line.split(',').map(s => s.trim());
        if (!sku) return;
        
        const qty = parseInt(qtyStr) || 1;
        const product = PRODUCTS.find(p => p.sku.toUpperCase() === sku.toUpperCase());
        
        if (product) {
          const existing = cartItems.find((item: any) => item.id === product.id);
          if (existing) {
            existing.qty = (existing.qty || 1) + qty;
          } else {
            cartItems.push({
              id: product.id,
              name: product.name,
              sku: product.sku,
              price: product.price,
              mrp: product.mrp,
              category: product.category,
              qty: qty,
              image: product.image,
            });
          }
          itemsAdded++;
        }
      });

      if (itemsAdded > 0) {
        localStorage.setItem("kalvex_cart", JSON.stringify(cartItems));
        window.dispatchEvent(new Event("kalvex-cart-updated"));
        
        const toast = document.createElement("div");
        toast.className = "fixed bottom-8 right-8 z-[500] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans text-xs font-bold uppercase tracking-wider";
        toast.innerHTML = `<span class="text-emerald-500">✓</span> Bulk Upload Success: ${itemsAdded} products added to cart.`;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.className += " animate-out fade-out duration-300";
          setTimeout(() => toast.remove(), 300);
        }, 3000);
        setIsBulkUploadOpen(false);
      } else {
        alert("No valid products found in the CSV. Please ensure the format is SKU,Qty.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddToCart = (product: any) => {
    if (!session) {
      router.push("/login");
      return;
    }
    try {
      const stored = localStorage.getItem("kalvex_cart");
      let items: any[] = [];
      if (stored) {
        items = JSON.parse(stored);
      }
      if (!Array.isArray(items)) {
        items = [];
      }
      const existing = items.find((item: any) => item.id === product.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        items.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          mrp: product.mrp,
          category: product.category,
          qty: 1,
          image: product.image,
        });
      }
      localStorage.setItem("kalvex_cart", JSON.stringify(items));
      window.dispatchEvent(new Event("kalvex-cart-updated"));
      
      // MNC Style premium toast feedback
      const toast = document.createElement("div");
      toast.className = "fixed bottom-8 right-8 z-[500] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans text-xs font-bold uppercase tracking-wider";
      toast.innerHTML = `<span class="text-emerald-500">✓</span> ${product.name} added to your procurement inventory`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.className += " animate-out fade-out duration-300";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to update cart inventory.");
    }
  };

  const clearFilters = () => {
    setSelectedCategory("All Products");
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen pt-[105px] pb-32 bg-slate-50 transition-colors duration-500">
      {/* Diwali Special Marquee - Elite Dynamic Reactive Bar (Slim Version) */}
      <motion.div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
        }}
        onTouchMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const touch = e.touches[0];
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
        }}
        onTouchStart={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const touch = e.touches[0];
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
        }}
        className="group/marquee w-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 border-b border-orange-400/30 overflow-hidden py-1.5 shadow-md relative z-30 cursor-pointer transition-all duration-500 mb-10"
      >
        {/* Cursor Spotlight Effect */}
        <div className="absolute inset-0 opacity-0 group-hover/marquee:opacity-100 group-active/marquee:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.25), transparent 40%)`,
          }} />

        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap gap-12 items-center relative z-0"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-12 group-hover/marquee:[animation-play-state:paused]">
              <span className="text-white text-[13px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="text-lg animate-bounce">🪔</span> DIWALI SPECIAL: 10% OFF ON ALL ELECTRONIC COMPONENTS
                <motion.span
                  whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
                  className="bg-white/20 px-3 py-1 rounded-lg border border-white/30 ml-2 backdrop-blur-md"
                >
                  CODE: DIWALI10
                </motion.span>
                <span className="text-lg animate-bounce">🪔</span>
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-white/80 text-[13px] font-bold uppercase tracking-[0.15em]">
                Limited Time Offer • Institutional Standard Components • Premium Quality
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col xl:flex-row justify-between items-end mb-16 gap-12"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl shadow-blue-600/20">
              <ShoppingBag className="w-4 h-4" /> Electronics Store
            </div>
            <h1 className="font-heading font-black text-5xl md:text-6xl text-slate-900 tracking-tight">
              Electronic <span className="text-blue-600">Components</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-xl">
              High-quality electronics, sensors, and development boards for your engineering projects and prototypes.
            </p>
          </div>

          <div className="w-full xl:w-[500px] relative group">
            <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <input
              type="text"
              placeholder="Search components, modules, or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-32 py-5 text-slate-900 font-medium text-sm focus:ring-4 ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 shadow-lg shadow-slate-900/5 relative z-10"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-5 top-5 group-focus-within:text-blue-600 transition-colors z-20" />
            <Button className="absolute right-2 top-2 bottom-2 h-auto px-6 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md z-20">
              Search
            </Button>
          </div>

          <Button 
            onClick={() => setIsBulkUploadOpen(true)}
            className="hidden xl:flex bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-200 font-bold text-sm h-16 px-6 rounded-2xl items-center gap-3 shadow-sm transition-all"
          >
            <UploadCloud className="w-5 h-5" />
            Bulk CSV Upload
          </Button>
        </motion.div>

        {/* Mobile Bulk Upload Button */}
        <div className="xl:hidden w-full mb-10">
          <Button 
            onClick={() => setIsBulkUploadOpen(true)}
            className="w-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-200 font-bold text-sm h-14 rounded-2xl flex items-center justify-center gap-3 shadow-sm transition-all"
          >
            <UploadCloud className="w-5 h-5" />
            Bulk CSV Upload
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Sidebar Filters */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full lg:w-72 shrink-0 lg:sticky lg:top-32"
          >
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-blue-600" /> Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Box className="w-4 h-4 text-slate-400" /> Categories
                </h4>
                <div className="space-y-3">
                  {CATEGORIES.map((cat, i) => (
                    <label key={i} className="flex items-center text-sm font-medium text-slate-600 cursor-pointer hover:text-blue-600 transition-colors group">
                      <div className="relative w-4 h-4 mr-3 shrink-0">
                        <input
                          type="radio"
                          name="category"
                          className="peer absolute inset-0 opacity-0 cursor-pointer"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                        />
                        <div className="w-full h-full border-2 border-slate-300 rounded-full bg-white peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all" />
                        <div className="absolute inset-1 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                      <span className={selectedCategory === cat ? "text-blue-600 font-bold" : ""}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-400" /> Price Range
                </h4>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-[11px] font-black outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-[11px] font-black outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="flex items-center text-sm font-medium text-slate-600 cursor-pointer hover:text-emerald-600 transition-colors group">
                  <div className="relative w-4 h-4 mr-3 shrink-0">
                    <input
                      type="checkbox"
                      className="peer absolute inset-0 opacity-0 cursor-pointer"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <div className="w-full h-full border-2 border-slate-300 rounded bg-white peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-all" />
                    <CheckCircle className="absolute -inset-0.5 w-5 h-5 text-white scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span>In-Stock Only</span>
                </label>
              </div>
            </div>
          </motion.aside>

          {/* Product Grid */}
          <main className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Showing <span className="text-slate-900">1-{filteredProducts.length}</span> of {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 outline-none cursor-pointer appearance-none pr-8 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTQ0NzhmIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[center_right_0.75rem] bg-[length:1rem]"
                >
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => {
                  const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);

                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200 group hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-full relative"
                    >
                      {/* Visual Area */}
                      <div className="relative h-60 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
                            {p.category}
                          </span>
                        </div>

                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={(e) => toggleWishlist(p, e)}
                            className={`w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:shadow-md transition-all border border-slate-200 ${
                              wishlist.some(i => i.id === p.id) ? "text-red-500 bg-red-50" : "text-slate-400 hover:text-red-500"
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${wishlist.some(i => i.id === p.id) ? "fill-red-500" : ""}`} />
                          </button>
                        </div>

                        <div className="w-full h-full flex items-center justify-center bg-white">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>

                      {/* Specifications */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="space-y-1 mb-4">
                          <div className="text-xs font-semibold text-slate-400">{p.sku}</div>
                          <Link href={`/electronics/${p.id}`}>
                            <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{p.name}</h3>
                          </Link>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <svg key={s} className={`w-4 h-4 ${s <= Math.round(p.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-slate-500">{p.rating} Rating</span>
                        </div>

                        <div className="mt-auto space-y-5">
                          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-slate-900 text-2xl">₹{p.price.toLocaleString()}</span>
                              <span className="text-sm text-slate-400 line-through">₹{p.mrp.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">{discount}% OFF</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                              {p.stock > 0 ? (
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-xs font-semibold text-emerald-600">In Stock</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-red-500" />
                                  <span className="text-xs font-semibold text-red-600">Out of Stock</span>
                                </div>
                              )}
                            </div>

                            <Button
                              onClick={() => handleAddToCart(p)}
                              disabled={p.stock === 0}
                              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${p.stock > 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-100 text-slate-400"}`}
                            >
                              <ShoppingCart className="w-4 h-4" /> Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-32 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Box className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">No products found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search query to find what you're looking for.</p>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="mt-4 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-16 flex justify-center">
                <nav className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg text-slate-500" disabled>&lt;</Button>
                  <div className="flex items-center gap-1 px-2">
                    <Button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold">1</Button>
                    <Button variant="ghost" className="w-10 h-10 rounded-lg text-slate-600 font-medium hover:bg-slate-100">2</Button>
                    <Button variant="ghost" className="w-10 h-10 rounded-lg text-slate-600 font-medium hover:bg-slate-100">3</Button>
                    <span className="px-2 text-slate-400">...</span>
                    <Button variant="ghost" className="w-10 h-10 rounded-lg text-slate-600 font-medium hover:bg-slate-100">12</Button>
                  </div>
                  <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg text-slate-500 hover:bg-slate-50">&gt;</Button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {isBulkUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsBulkUploadOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-lg shadow-2xl relative z-10"
            >
              <button 
                onClick={() => setIsBulkUploadOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 mb-6">
                <UploadCloud className="w-8 h-8 text-emerald-600" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-2">Bulk CSV Upload</h2>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                Save time by uploading your lab's procurement list directly. 
                Upload a standard <code>.csv</code> file formatted with <strong className="text-slate-800">SKU, Quantity</strong> per row.
              </p>

              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-emerald-500 mx-auto mb-4 transition-colors" />
                <p className="text-sm font-bold text-slate-600 group-hover:text-emerald-700">
                  Click to browse or drag and drop your file here
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-2">Maximum file size 5MB. CSV format only.</p>
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef}
                  onChange={handleBulkUpload}
                  className="hidden" 
                />
              </div>

              <div className="mt-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Example Format:</h4>
                <div className="font-mono text-xs text-slate-500 space-y-1">
                  <p>KVX-SBC-005, 5</p>
                  <p>KVX-MOD-015, 20</p>
                  <p>KVX-SEN-022, 12</p>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
