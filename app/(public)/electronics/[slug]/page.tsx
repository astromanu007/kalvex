"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Heart, ShoppingCart, ArrowLeft, Shield, Zap, Info, Check, 
  MapPin, Truck, Star, Package, Eye, Sparkles, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

// Local static database matching the main electronics page index
const PRODUCTS = [
  // Development Boards
  { id: "1", name: "Raspberry Pi 5 8GB RAM", sku: "KVX-SBC-005", price: 8500, mrp: 9200, category: "Development Boards", stock: 15, rating: 4.8, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600", desc: "The latest generation Raspberry Pi 5 featuring a 2.4GHz quad-core 64-bit Arm Cortex-A76 CPU, dual 4Kp60 HDMI display outputs, and a massive 8GB of LPDDR4X RAM. Ideal for high-stakes edge computing, IoT gateways, and heavy prototyping.", brand: "Raspberry Pi Foundation", voltage: "5V DC via USB-C", current: "5A recommended" },
  { id: "2", name: "Arduino Uno R4 WiFi", sku: "KVX-SBC-004", price: 2450, mrp: 2800, category: "Development Boards", stock: 120, rating: 4.9, image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=600", desc: "The ultimate 32-bit MCU development board, combining the processing power of the RA4M1 microprocessor from Renesas with wireless connectivity via an ESP32-S3. Built-in 12x8 LED matrix for visual feedback.", brand: "Arduino Original", voltage: "5V to 24V", current: "500mA" },
  { id: "3", name: "ESP32-S3 DevKitC-1", sku: "KVX-MOD-033", price: 550, mrp: 750, category: "Development Boards", stock: 45, rating: 4.7, image: "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&q=80&w=600", desc: "An entry-level development board equipped with ESP32-S3-WROOM-1, a powerful Wi-Fi + Bluetooth LE MCU module that targets a wide variety of rich applications, such as neural network computing and voice processing.", brand: "Espressif Systems", voltage: "3.3V / 5V", current: "500mA" },
  { id: "4", name: "Jetson Orin Nano Developer Kit", sku: "KVX-SBC-009", price: 45000, mrp: 48000, category: "Development Boards", stock: 5, rating: 5.0, image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600", desc: "NVIDIA Jetson Orin Nano Developer Kit sets a new standard for entry-level AI and edge robotics. Deliver up to 40 TOPS of AI performance for computer vision, object detection, and deep learning algorithms.", brand: "NVIDIA", voltage: "9V to 20V DC", current: "3.5A" },
  { id: "5", name: "STM32 Blue Pill (STM32F103C8T6)", sku: "KVX-SBC-032", price: 280, mrp: 400, category: "Development Boards", stock: 300, rating: 4.3, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600", desc: "A cost-effective STM32 minimum system microcontroller development board. Highly popular in academia for advanced embedded systems courses using ARM Cortex-M3 architecture.", brand: "STMicroelectronics", voltage: "3.3V / 5V", current: "150mA" },
  { id: "41", name: "BeagleBone Black Rev C", sku: "KVX-SBC-010", price: 5800, mrp: 6500, category: "Development Boards", stock: 20, rating: 4.6, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600", desc: "A high-performance Linux-ready single board computer (SBC) designed for developers and hobbyists. Equipped with an AM335x 1GHz ARM Cortex-A8 processor, 512MB DDR3 RAM, and 4GB eMMC flash memory.", brand: "BeagleBoard", voltage: "5V DC", current: "2A" },
  { id: "42", name: "Teensy 4.1 USB Development Board", sku: "KVX-SBC-041", price: 3200, mrp: 3800, category: "Development Boards", stock: 15, rating: 4.9, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600", desc: "Features an ARM Cortex-M7 processor at 600 MHz, with an NXP i.MXRT1062 chip. The highest performance microcontroller development platform available in a compact breadboard-friendly form factor.", brand: "PJRC", voltage: "3.3V to 5.5V", current: "100mA" },

  // Sensors
  { id: "6", name: "MPU6050 6-Axis Gyro/Accel", sku: "KVX-SEN-605", price: 180, mrp: 250, category: "Sensors", stock: 150, rating: 4.6, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600", desc: "A complete 6-axis MotionTracking device that combines a 3-axis gyroscope, 3-axis accelerometer, and a Digital Motion Processor (DMP) all in a tiny integrated module. Ideal for self-balancing robots and drones.", brand: "TDK InvenSense", voltage: "3.3V to 5V", current: "5mA" },
  { id: "7", name: "DHT22 Digital Temp & Humidity", sku: "KVX-SEN-022", price: 320, mrp: 450, category: "Sensors", stock: 80, rating: 4.5, image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=600", desc: "A highly reliable, calibrated, high-precision digital temperature and relative humidity sensor. Provides standard digital single-bus signal output, making integration with Arduino extremely straightforward.", brand: "Aosong Electronics", voltage: "3.3V to 5.5V", current: "2.5mA" },
  { id: "8", name: "HC-SR04 Ultrasonic Sensor", sku: "KVX-SEN-004", price: 85, mrp: 120, category: "Sensors", stock: 500, rating: 4.4, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600", desc: "Provides 2cm to 400cm non-contact measurement functionality with high ranging accuracy. The module includes ultrasonic transmitters, receiver, and control circuit. An absolute staple in robotics.", brand: "Kalvex Certified", voltage: "5V DC", current: "15mA" },
  { id: "9", name: "BMP280 Barometric Pressure", sku: "KVX-SEN-280", price: 150, mrp: 220, category: "Sensors", stock: 200, rating: 4.7, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600", desc: "An absolute barometric pressure sensor designed specifically for mobile applications. Combines high accuracy, low power consumption, and long-term stability in a miniature LGA package.", brand: "Bosch Sensortec", voltage: "1.8V to 3.6V", current: "3.6uA" },
  { id: "10", name: "TCS3200 Color Sensor Module", sku: "KVX-SEN-320", price: 350, mrp: 500, category: "Sensors", stock: 40, rating: 4.2, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600", desc: "A complete color light-to-frequency converter that combines configurable silicon photodiodes and a current-to-frequency converter on a single monolithic CMOS integrated circuit. Great for sorting lines.", brand: "TAOS", voltage: "2.7V to 5.5V", current: "10mA" },
  { id: "43", name: "VL53L0X Time of Flight Sensor", sku: "KVX-SEN-530", price: 450, mrp: 600, category: "Sensors", stock: 65, rating: 4.8, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600", desc: "A new-generation Time-of-Flight (ToF) laser-ranging module housed in the smallest package on the market today, providing accurate distance measurement regardless of the target's reflectance.", brand: "STMicroelectronics", voltage: "2.8V to 5V", current: "20mA" },
  { id: "44", name: "MQ-2 Gas & Smoke Sensor", sku: "KVX-SEN-002", price: 120, mrp: 180, category: "Sensors", stock: 120, rating: 4.3, image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=600", desc: "Suitable for detecting LPG, i-butane, propane, methane, alcohol, hydrogen, and smoke. High sensitivity, fast response, stable, and long-lasting sensor, complete with dual output (analog and digital threshold).", brand: "Kalvex Certified", voltage: "5V DC", current: "150mA" },
  { id: "45", name: "RC522 RFID Reader Module", sku: "KVX-MOD-522", price: 280, mrp: 400, category: "Sensors", stock: 85, rating: 4.6, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600", desc: "A highly integrated transmission module for contactless communication at 13.56 MHz. Supports ISO 14443A keys and cards, perfect for RFID-based locks, security clearance systems, and logistics trackers.", brand: "NXP", voltage: "3.3V DC", current: "30mA" },

  // Modules
  { id: "11", name: "L298N Motor Driver Module", sku: "KVX-MOD-015", price: 150, mrp: 200, category: "Modules", stock: 120, rating: 4.5, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600", desc: "A high power motor driver module perfect for driving DC Motors and Stepper Motors. It uses the popular L298N Dual H-Bridge driver IC and includes a built-in 5V regulator for external control circuits.", brand: "Kalvex Certified", voltage: "5V to 35V", current: "2A per channel" },
  { id: "12", name: "SIM800L GSM/GPRS Module", sku: "KVX-MOD-800", price: 450, mrp: 650, category: "Modules", stock: 0, rating: 4.1, image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=600", desc: "A miniature cellular module that allows for GPRS transmission, sending/receiving SMS, and making/receiving voice calls. Exceptionally compact size, ideal for remote sensor nodes.", brand: "SIMCom", voltage: "3.4V to 4.4V", current: "2A peak" },
  { id: "13", name: "NEO-6M GPS Module with Antenna", sku: "KVX-MOD-006", price: 850, mrp: 1200, category: "Modules", stock: 35, rating: 4.6, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600", desc: "A stand-alone GPS receiver featuring high-performance u-blox 6 positioning engines. Comes with an active high-gain ceramic patch antenna for outstanding indoor and outdoor tracking capability.", brand: "u-blox", voltage: "3.3V to 5V", current: "45mA" },
  { id: "14", name: "nRF24L01+ Wireless Transceiver", sku: "KVX-MOD-241", price: 120, mrp: 180, category: "Modules", stock: 400, rating: 4.4, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600", desc: "A single chip 2.4GHz transceiver with an embedded baseband protocol engine (Enhanced ShockBurst™), designed for ultra low power wireless applications in industrial and consumer markets.", brand: "Nordic Semiconductor", voltage: "1.9V to 3.6V", current: "11.5mA" },
  { id: "15", name: "DS3231 RTC Precision Clock", sku: "KVX-MOD-231", price: 180, mrp: 300, category: "Modules", stock: 90, rating: 4.8, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600", desc: "A low-cost, extremely accurate I2C real-time clock (RTC) with an integrated temperature-compensated crystal oscillator (TCXO) and crystal. Perfect for academic lab loggers and timers.", brand: "Maxim Integrated", voltage: "3.3V to 5.5V", current: "200uA" },

  // Displays
  { id: "16", name: "0.96 inch OLED Display I2C", sku: "KVX-DIS-096", price: 250, mrp: 350, category: "Displays", stock: 150, rating: 4.9, image: "https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?auto=format&fit=crop&q=80&w=600", desc: "A brilliant, high-contrast monochrome graphic OLED display panel with an I2C interface. Self-luminous, requiring no backlight, delivering deep blacks and clean bright blue/white layouts.", brand: "Solomon Systech", voltage: "3.3V to 5V", current: "20mA" },
  { id: "17", name: "16x2 LCD with I2C Module", sku: "KVX-DIS-162", price: 280, mrp: 400, category: "Displays", stock: 200, rating: 4.6, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600", desc: "A classical 16-character by 2-line alphanumeric LCD display with a pre-soldered I2C backpack interface. Reduces pin count from 16 to just 4, saving invaluable microcontroller GPIO headers.", brand: "Kalvex Certified", voltage: "5V DC", current: "50mA" },
  { id: "18", name: "2.4 inch TFT LCD Touch", sku: "KVX-DIS-240", price: 650, mrp: 850, category: "Displays", stock: 25, rating: 4.3, image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=600", desc: "A gorgeous, responsive multi-color TFT LCD module with 240x320 pixels resolution. Integrated resistive touch screen controller and SD card slot for loading dynamic interface asset files.", brand: "ILITEK", voltage: "3.3V / 5V", current: "150mA" },
  { id: "19", name: "Nextion 4.3 inch HMI Display", sku: "KVX-DIS-430", price: 3200, mrp: 4500, category: "Displays", stock: 12, rating: 4.7, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600", desc: "A Seamless Human Machine Interface (HMI) display solution that provides a control and visualization interface between a human and a process, machine, or environment. Programmable via serial commands.", brand: "ITEAD Studio", voltage: "5V DC", current: "250mA" },
  { id: "20", name: "8x8 LED Matrix (MAX7219)", sku: "KVX-DIS-888", price: 180, mrp: 280, category: "Displays", stock: 100, rating: 4.5, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600", desc: "Features a serial input/output common-cathode display driver that interfaces microprocessors to an 8x8 red LED dot matrix. Can be cascaded with other modules to make ticker boards.", brand: "Kalvex Certified", voltage: "5V DC", current: "300mA" },

  // Motors & Drivers
  { id: "21", name: "NEMA 17 Stepper Motor", sku: "KVX-MOT-017", price: 850, mrp: 1100, category: "Motors & Drivers", stock: 60, rating: 4.7, image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=600", desc: "High torque, hybrid bipolar stepping motor with a NEMA 17 size mounting frame. 1.8-degree step angle (200 steps/revolution). Exceptional choice for 3D printers, CNC machines, and robotic arms.", brand: "LDO Motors", voltage: "12V - 24V (via Driver)", current: "1.5A" },
  { id: "22", name: "SG90 Micro Servo Motor", sku: "KVX-MOT-090", price: 120, mrp: 180, category: "Motors & Drivers", stock: 1000, rating: 4.4, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600", desc: "Lightweight, high-quality micro servo motor. Great for robot joints, mechanical locks, or pan-and-tilt assemblies. Rotates approximately 180 degrees (90 in each direction).", brand: "TowerPro", voltage: "4.8V to 6V", current: "220mA" },
  { id: "23", name: "MG996R High Torque Servo", sku: "KVX-MOT-996", price: 450, mrp: 600, category: "Motors & Drivers", stock: 45, rating: 4.6, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600", desc: "Metal gear, dual ball bearing high-torque servo motor. Outstanding choice for steering assemblies in RC cars, robotic gripper claws, or mechanical actuators requiring high load handling.", brand: "TowerPro", voltage: "4.8V to 7.2V", current: "800mA stall" },
  { id: "24", name: "DRV8825 Stepper Driver", sku: "KVX-MOD-825", price: 150, mrp: 220, category: "Motors & Drivers", stock: 120, rating: 4.3, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600", desc: "A microstepping stepper motor driver carrier board based on TI's DRV8825 IC. Offers adjustable current limiting, overcurrent protection, and 6 microstep resolutions down to 1/32-step.", brand: "Texas Instruments", voltage: "8.2V to 45V", current: "1.5A per phase" },
  { id: "25", name: "A4988 Stepper Driver Module", sku: "KVX-MOD-498", price: 95, mrp: 150, category: "Motors & Drivers", stock: 300, rating: 4.1, image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600", desc: "A complete microstepping motor driver with built-in translator for easy operation. Designed to operate bipolar stepper motors in full-, half-, quarter-, eighth-, and sixteenth-step modes.", brand: "Allegro Microsystems", voltage: "8V to 35V", current: "1A per phase" }
];

export default function ProductDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { data: session } = useSession();

  // Find product in local DB
  const product = useMemo(() => {
    return PRODUCTS.find(p => p.id === slug) || PRODUCTS[0];
  }, [slug]);

  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "schematic" | "reviews">("overview");
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Pincode details state
  const [pincode, setPincode] = useState("");
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<{
    status: "success" | "error";
    message: string;
    carrier: string;
    speed: string;
  } | null>(null);

  // Spotlight Ref for tracking mouse coordinates
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync wishlist state initially
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kalvex_saved");
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) {
          setWishlisted(items.some((i: any) => i.id === product.id));
        }
      }
    } catch (err) {}
  }, [product]);

  // Image effects simulation
  const images = useMemo(() => {
    return [
      { url: product.image, label: "Procurement Main" },
      { url: product.image, label: "Board Inspection", filterClass: "brightness-110 contrast-125 saturate-150" },
      { url: product.image, label: "Blueprint Layout", filterClass: "invert-[0.95] hue-rotate-180 brightness-[0.85] sepia-[0.1] saturate-[1.8]" },
      { url: product.image, label: "Laboratory Package", filterClass: "sepia-[0.15] contrast-[0.95] brightness-[1.02]" }
    ];
  }, [product]);

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  // Pincode handler
  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeResult({
        status: "error",
        message: "Invalid entry. Enter a valid 6-digit postal pincode.",
        carrier: "",
        speed: ""
      });
      return;
    }

    setIsCheckingPincode(true);
    setPincodeResult(null);

    setTimeout(() => {
      setIsCheckingPincode(false);
      const isWesternIndia = pincode.startsWith("4");
      
      if (isWesternIndia) {
        setPincodeResult({
          status: "success",
          message: `Rapid transit hub detected. Premium delivery active.`,
          carrier: "BlueDart Aviation Express",
          speed: "Estimated Delivery: 24-48 Hours (Guaranteed)"
        });
      } else {
        setPincodeResult({
          status: "success",
          message: `Standard shipping active. Dispatched from Central reserve.`,
          carrier: "Delhivery Surface Premium",
          speed: "Estimated Delivery: 3-4 Days"
        });
      }
    }, 1000);
  };

  // Cart Handlers
  const handleAddToCart = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    try {
      const stored = localStorage.getItem("kalvex_cart");
      let items: any[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(items)) items = [];

      const existing = items.find((item: any) => item.id === product.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + qty;
      } else {
        items.push({
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
      localStorage.setItem("kalvex_cart", JSON.stringify(items));
      window.dispatchEvent(new Event("kalvex-cart-updated"));
      
      const toast = document.createElement("div");
      toast.className = "fixed bottom-8 right-8 z-[500] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans text-xs font-bold uppercase tracking-wider border border-white/20";
      toast.innerHTML = `<span class="bg-white/20 p-1.5 rounded-lg text-white">✓</span> ${qty}x ${product.name} added to procurement inventory`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.className += " animate-out fade-out duration-300";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } catch (err) {
      alert("Failed to update cart inventory.");
    }
  };

  const handleBuyNow = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    handleAddToCart();
    router.push("/cart");
  };

  // Toggle Wishlist
  const toggleWishlist = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const saved = localStorage.getItem("kalvex_saved");
      let items = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(items)) items = [];

      const exists = items.some((i: any) => i.id === product.id);
      let updatedItems = [];
      if (exists) {
        updatedItems = items.filter((i: any) => i.id !== product.id);
        setWishlisted(false);
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
        updatedItems = items;
        setWishlisted(true);
      }

      localStorage.setItem("kalvex_saved", JSON.stringify(updatedItems));
      window.dispatchEvent(new Event("kalvex-wishlist-updated"));
      
      const toast = document.createElement("div");
      toast.className = "fixed bottom-8 right-8 z-[500] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans text-xs font-bold uppercase tracking-wider";
      toast.innerHTML = exists 
        ? `<span class="text-slate-400">×</span> Removed from wishlist.` 
        : `<span class="text-pink-500">❤️</span> Added to wishlist.`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.className += " animate-out fade-out duration-300";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } catch (err) {}
  };

  // Border Spotlight Coordinate Calculations
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    wrapperRef.current.style.setProperty("--mouse-x", `${x}px`);
    wrapperRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="min-h-screen pt-40 pb-32 bg-slate-50/50 relative overflow-hidden font-sans">
      
      {/* Decorative Shifting Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-blue-400/10 blur-[100px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] rounded-full bg-pink-400/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-2/3 left-1/2 w-80 h-80 rounded-full bg-indigo-400/10 blur-[80px] pointer-events-none -z-10" />

      {/* Grid Pattern Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Breadcrumb Back Navigation */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/electronics">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-white text-slate-600 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest rounded-2xl py-6 px-6 border border-slate-100/50 shadow-sm hover:shadow-md bg-white/40 backdrop-blur-md">
              <ArrowLeft className="w-4 h-4 text-indigo-500 animate-pulse" /> Back to Store Catalog
            </Button>
          </Link>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:flex items-center gap-2">
            <span>Store</span> <span className="text-slate-300">&gt;</span> 
            <span>{product.category}</span> <span className="text-slate-300">&gt;</span> 
            <span className="text-slate-600 font-bold">{product.sku}</span>
          </div>
        </div>

        {/* Dynamic Rainbow Spotlight Border Wrapper */}
        <div
          ref={wrapperRef}
          onMouseMove={handleMouseMove}
          className="group/detail relative p-[2px] rounded-[3rem] overflow-hidden bg-slate-200/40 hover:bg-transparent shadow-2xl transition-all duration-700 max-w-7xl mx-auto"
        >
          {/* Dynamic Shifting Border Gradient */}
          <div 
            className="absolute inset-0 opacity-0 group-hover/detail:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
            style={{
              background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), #3b82f6 0%, #6366f1 25%, #a855f7 50%, #ec4899 75%, transparent 100%)`,
            }}
          />

          {/* Core White Card */}
          <div className="relative z-10 bg-white/95 backdrop-blur-3xl rounded-[2.9rem] p-8 md:p-14 transition-colors duration-500">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Left Column: Image Angle Explorer */}
              <div className="space-y-8">
                
                <div className="relative aspect-square rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-blue-50/20 border border-slate-100 overflow-hidden group/zoom flex items-center justify-center shadow-inner">
                  
                  {/* Glowing dynamic sale tag */}
                  {discount > 0 && (
                    <div className="absolute top-6 left-6 z-20">
                      <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white text-[10px] font-black px-4 py-2.5 rounded-xl shadow-lg shadow-pink-500/20 uppercase tracking-widest flex items-center gap-1.5 animate-bounce">
                        <Sparkles className="w-3.5 h-3.5" /> Special {discount}% OFF
                      </span>
                    </div>
                  )}

                  <motion.img
                    key={selectedImageIndex}
                    src={images[selectedImageIndex].url}
                    alt={product.name}
                    className={`w-[75%] h-[75%] object-contain transition-all duration-750 group-hover/zoom:scale-110 ${images[selectedImageIndex].filterClass || ""}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* High Tech interactive tag */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300 bg-slate-900/90 text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md">
                    <Eye className="w-4 h-4 text-blue-400 animate-pulse" /> Laboratory Inspect
                  </div>
                </div>

                {/* Shifting views thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-2xl bg-slate-50 border-2 overflow-hidden flex items-center justify-center p-2 relative transition-all duration-350 hover:scale-[1.03] ${
                        selectedImageIndex === idx 
                          ? "border-indigo-500 bg-indigo-50/10 shadow-lg shadow-indigo-500/10 scale-95" 
                          : "border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200"
                      }`}
                    >
                      <img 
                        src={img.url} 
                        alt={img.label} 
                        className={`w-[85%] h-[85%] object-contain ${img.filterClass || ""}`} 
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-900/50 text-[6px] font-black text-white text-center py-0.5 truncate uppercase tracking-widest hidden md:block">
                        {img.label.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Dynamic Price panel and checkout hooks */}
              <div className="flex flex-col justify-between space-y-8">
                
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-md shadow-indigo-500/15">
                      {product.category}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                      SKU: {product.sku}
                    </span>
                  </div>

                  <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating star matrix */}
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 text-yellow-400 fill-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-200"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                      {product.rating} Rating (Institutional Grade Verified)
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 w-full my-6" />

                  {/* Colorful Shifting Pricing Box */}
                  <div className="relative bg-gradient-to-r from-blue-50/50 via-indigo-50/20 to-pink-50/30 p-6 rounded-[2.2rem] border border-indigo-100/30 overflow-hidden group/pricing">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white font-black text-[7px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-bl-2xl shadow-md">
                      Special Rate Active
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Institutional Price</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">₹{product.price.toLocaleString()}</span>
                        <span className="text-sm font-semibold text-slate-400 line-through">₹{product.mrp.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100/80 px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Save ₹{(product.mrp - product.price).toLocaleString()} ({discount}% Off)
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    {product.desc}
                  </p>
                </div>

                {/* Pincode logistics tracker with vibrant colors */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-[2.2rem] p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500 animate-bounce" />
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Verify Procurement Dispatch Speed</span>
                  </div>

                  <form onSubmit={handlePincodeCheck} className="flex gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit postal pincode..."
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 outline-none text-slate-950 font-bold text-xs flex-grow placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all uppercase tracking-[0.15em] shadow-sm"
                    />
                    <Button
                      type="submit"
                      disabled={isCheckingPincode}
                      className="bg-slate-900 text-white font-black text-xs uppercase tracking-widest px-6 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg active:scale-98"
                    >
                      {isCheckingPincode ? "Calibrating..." : "Verify"}
                    </Button>
                  </form>

                  <AnimatePresence mode="wait">
                    {pincodeResult && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={`p-5 rounded-2xl border flex gap-3 text-xs shadow-sm ${
                          pincodeResult.status === "success" 
                            ? "bg-gradient-to-r from-emerald-50/60 to-teal-50/30 border-emerald-200 text-emerald-800" 
                            : "bg-red-50/50 border-red-200 text-red-800"
                        }`}
                      >
                        {pincodeResult.status === "success" ? (
                          <>
                            <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                            <div className="space-y-1">
                              <p className="font-black uppercase tracking-[0.08em] text-[11px]">{pincodeResult.speed}</p>
                              <p className="font-bold opacity-80 text-[10px] uppercase tracking-wide">
                                Express Link: {pincodeResult.carrier} | {pincodeResult.message}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Info className="w-5 h-5 text-red-600 shrink-0" />
                            <p className="font-bold uppercase tracking-wider leading-relaxed">{pincodeResult.message}</p>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Procurement quantities and button animations */}
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Procurement Stock</p>
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                          RESERVE ALLOCATED ({product.stock} Units)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          OUT OF STOCK
                        </span>
                      )}
                    </div>

                    {/* Quantity selectors */}
                    {product.stock > 0 && (
                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-1.5 shadow-sm">
                        <button
                          onClick={() => setQty(prev => Math.max(1, prev - 1))}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-slate-800 hover:bg-slate-200 transition-colors shadow-sm"
                        >
                          -
                        </button>
                        <span className="font-black text-slate-950 text-sm px-3">{qty}</span>
                        <button
                          onClick={() => setQty(prev => Math.min(product.stock, prev + 1))}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-slate-800 hover:bg-slate-200 transition-colors shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                    
                    {/* Buy now shifting gradient button */}
                    <button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white font-black text-[11px] uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-indigo-600/10 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Instant Procurement
                    </button>

                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      variant="outline"
                      className="flex-1 border-slate-200 hover:bg-slate-50 hover:text-slate-950 font-black text-[11px] uppercase tracking-widest h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-sm bg-white"
                    >
                      <ShoppingCart className="w-4 h-4 text-indigo-500" /> Add to Cart
                    </Button>

                    <Button
                      onClick={toggleWishlist}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shrink-0 active:scale-[0.98] ${
                        wishlisted 
                          ? "bg-pink-50 border-pink-100 text-pink-500 hover:bg-pink-100 hover:border-pink-200" 
                          : "bg-white border-slate-200 text-slate-400 hover:text-pink-500 hover:border-slate-350"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${wishlisted ? "fill-pink-500 text-pink-500" : ""}`} />
                    </Button>
                  </div>

                </div>

              </div>

            </div>

            {/* Spec Matrix Drawer */}
            <div className="mt-20 pt-16 border-t border-slate-100 relative">
              
              <div className="flex border-b border-slate-100 gap-8 overflow-x-auto pb-4 scrollbar-none">
                {[
                  { id: "overview", label: "Product Architecture", icon: Info },
                  { id: "specs", label: "Technical Specs", icon: Package },
                  { id: "schematic", label: "Board Pinout CAD", icon: Zap },
                  { id: "reviews", label: "Verified Reviews", icon: Star }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 pb-2 text-[10px] font-black uppercase tracking-[0.2em] relative group whitespace-nowrap ${
                        isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-950"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-indigo-500" />
                      <span>{tab.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="active-spec-tab"
                          className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Drawer Content */}
              <div className="py-8 min-h-[300px]">
                
                <AnimatePresence mode="wait">
                  
                  {/* Overview */}
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6 max-w-4xl"
                    >
                      <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">Institutional Architecture & Product Standards</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed leading-loose">
                        {product.name} is engineered to meet strict industrial thresholds and high-stakes laboratory research standard configurations. The board incorporates precision micro-traces built to precise tolerances to secure failure-free operation in sensitive academic experiments and professional engineering systems.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        {[
                          { title: "Institutional Safety Protocols", desc: "Equipped with high-fidelity reset fuses and complete reverse polarity protection modules to safeguard laboratory testing environments." },
                          { title: "Premium Calibration Standards", desc: "Supplied directly by Kalvex premium certified industrial factories. Programmatically pre-tested for complete signal integrity." },
                          { title: "Academic Document Docket", desc: "Accompanied by robust schematics and datasheet logs, ideal for citations inside BTech/MTech/PhD thesis write-ups." },
                          { title: "Premium Core Construction", desc: "Constructed utilizing high-grade FR4 multi-layer fiberglass baseboards with gold-plated pads for long-term electrical reliability." }
                        ].map((card, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-slate-50/50 to-blue-50/20 p-6 rounded-2xl border border-slate-100 flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                              <Check className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider mb-1">{card.title}</h4>
                              <p className="text-slate-500 text-xs font-medium leading-relaxed">{card.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Technical specs (removed warranty) */}
                  {activeTab === "specs" && (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">Procurement Specification Matrix</h3>
                      
                      <div className="border border-slate-100 rounded-3xl overflow-hidden max-w-2xl bg-white shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <tbody>
                            {[
                              { key: "SKU CODE", value: product.sku },
                              { key: "BRAND / DEVELOPER", value: product.brand || "Kalvex Certified" },
                              { key: "OPERATING VOLTAGE", value: product.voltage || "5V DC" },
                              { key: "CURRENT CONSUMPTION", value: product.current || "500mA max" },
                              { key: "PROCUREMENT CATEGORY", value: product.category },
                              { key: "RATING THRESHOLD", value: `${product.rating} / 5.0` },
                              { key: "SAFETY SYSTEM STATUS", value: "ACTIVE - Programmatically Verified" }
                            ].map((row, idx) => (
                              <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3 bg-slate-50/30">
                                  {row.key}
                                </td>
                                <td className="px-6 py-4 text-xs font-black text-slate-800 uppercase tracking-wider">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {/* CAD Schematics */}
                  {activeTab === "schematic" && (
                    <motion.div
                      key="schematic"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">Board Pinout CAD</h3>
                          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">Vibrant Programmatic Vector Preview</p>
                        </div>
                        <Button className="bg-indigo-600 text-white font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                          Download Vector Package (SVG)
                        </Button>
                      </div>

                      {/* CAD Screen */}
                      <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-8 md:p-12 flex items-center justify-center relative overflow-hidden group/cad shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
                        
                        <div className="relative z-10 w-full max-w-md bg-slate-900 border border-indigo-500/20 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(99,102,241,0.05)]">
                          <div className="w-full flex justify-between text-[8px] font-mono text-indigo-400/80 border-b border-indigo-500/10 pb-4">
                            <span>Ref: CAD-2026-X8</span>
                            <span>KALVEX LABS VECTOR LABS</span>
                          </div>

                          <div className="w-40 h-40 rounded-xl bg-slate-950 border-2 border-dashed border-indigo-500/30 flex items-center justify-center flex-col gap-2 relative animate-pulse">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono text-[7px] px-2 py-0.5 rounded uppercase tracking-wider shadow">
                              Core MCU
                            </div>
                            
                            {/* Pin nodes */}
                            <div className="absolute inset-y-8 -left-3 flex flex-col justify-between">
                              {[1, 2, 3].map(i => <div key={i} className="w-3 h-0.5 bg-indigo-500/40" />)}
                            </div>
                            <div className="absolute inset-y-8 -right-3 flex flex-col justify-between">
                              {[1, 2, 3].map(i => <div key={i} className="w-3 h-0.5 bg-indigo-500/40" />)}
                            </div>

                            <span className="font-mono text-white text-[10px] font-black">{product.sku}</span>
                            <span className="font-mono text-indigo-400 text-[8px]">{product.brand?.toUpperCase()}</span>
                          </div>

                          <div className="w-full grid grid-cols-3 gap-3 text-center">
                            <div className="bg-slate-950/80 border border-indigo-500/10 rounded p-2 text-[8px] font-mono text-indigo-400">
                              Power Bus<br/>5V / 3.3V
                            </div>
                            <div className="bg-slate-950/80 border border-indigo-500/10 rounded p-2 text-[8px] font-mono text-indigo-400">
                              Logic Bus<br/>I2C / SPI
                            </div>
                            <div className="bg-slate-950/80 border border-indigo-500/10 rounded p-2 text-[8px] font-mono text-indigo-400">
                              Safety Shield<br/>Programmatic
                            </div>
                          </div>

                          <p className="text-center font-mono text-[8px] text-slate-500 mt-2">
                            © 2026 KALVEX LABS PVT. LTD. ALL REGISTERED SCHEMATICS SECURED.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Reviews */}
                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">Verified Academic Reviews</h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50/10 border border-slate-100 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-sm">
                          <span className="text-5xl font-black text-slate-900 tracking-tight">{product.rating}</span>
                          <div className="flex gap-1 text-yellow-400 fill-yellow-400 my-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Out of 5.0 Stars
                          </span>
                        </div>

                        <div className="col-span-2 space-y-4">
                          {[
                            { name: "Prof. R. Deshmukh", title: "Principal Investigator, IoT Lab", rating: 5, body: "Exceptional build quality. We procured 15 of these boards for our advanced embedded sensory research project. Duty cycles are absolutely stable under high thermal variations.", inst: "IIT Bombay" },
                            { name: "Ananya Iyer", title: "M.Tech Scholar (Electronics)", rating: 4, body: "Programmatic initialization worked instantly out of the box with standard Arduino and ESP libraries. Highly recommended due to pre-soldered I2C backpack arrays.", inst: "COEP Pune" }
                          ].map((rev, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative hover:border-indigo-500/20 transition-all duration-300">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">{rev.name}</h4>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{rev.title} - {rev.inst}</p>
                                </div>
                                <div className="flex gap-0.5 text-yellow-400 fill-yellow-400">
                                  {[...Array(rev.rating)].map((_, s) => (
                                    <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-slate-500 text-xs font-semibold leading-relaxed italic">
                                "{rev.body}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
