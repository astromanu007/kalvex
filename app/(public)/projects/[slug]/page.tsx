"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Heart, ShoppingBag, ArrowLeft, ShieldCheck, Zap, Info, Check, 
  MapPin, Truck, Star, Code, Cpu, BookOpen, Layers, Copy, CheckCircle, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

// Local static database matching the main projects page index
const PROJECTS = [
  {
    id: "p1",
    title: "AI-Based Smart Agriculture System",
    category: "Internet of Things",
    type: "Major Project",
    price: 4999,
    mrp: 8999,
    rating: 4.9,
    reviews: 128,
    tech: ["Python", "Arduino", "LoRaWAN"],
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
    features: ["Real-time soil analysis", "Automated irrigation"],
    sku: "KVX-IOT-S01",
    abstract: "This system presents an automated internet-connected farming ecosystem leveraging machine learning to predict soil health and drive intelligent actuator control loops. Using sensory indicators for moisture, NPK ratios, and ambient temperature, the MCU processes data edges and relays telemetry via long-range LoRa channels.",
    code: `// Kalvex IoT Smart Agriculture Core Script
#include <SPI.h>
#include <LoRa.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

const int moisturePin = A0;
const int relayPin = 8;

void setup() {
  Serial.begin(115200);
  pinMode(relayPin, OUTPUT);
  dht.begin();
  
  if (!LoRa.begin(868E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  Serial.println("Kalvex Node Initialized Successfully.");
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int moisture = analogRead(moisturePin);
  
  // Intelligence moisture scale threshold
  if (moisture > 700) {
    digitalWrite(relayPin, HIGH); // Open irrigation valve
  } else {
    digitalWrite(relayPin, LOW);  // Close valve
  }
  
  // Pack telemetry
  LoRa.beginPacket();
  LoRa.print("T:"); LoRa.print(t);
  LoRa.print("|H:"); LoRa.print(h);
  LoRa.print("|M:"); LoRa.print(moisture);
  LoRa.endPacket();
  
  delay(10000); // Sample every 10 seconds
}`
  },
  {
    id: "p2",
    title: "Blockchain Secure Voting Platform",
    category: "Cybersecurity",
    type: "Final Year Project",
    price: 5499,
    mrp: 9999,
    rating: 4.8,
    reviews: 94,
    tech: ["Ethereum", "Solidity", "Next.js"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    features: ["Immutable records", "Biometric auth"],
    sku: "KVX-SEC-V04",
    abstract: "A highly resilient smart-contract based electronic voting structure designed to eliminate centralized tampering in student council and organizational elections. Programmed via Solidity and connected using Web3 providers, it validates digital identities before recording ballots irreversibly.",
    code: `// Kalvex Blockchain Voting Smart Contract
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KalvexVotingSystem {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    
    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    
    event votedEvent(uint indexed _candidateId);
    
    constructor() {
        addCandidate("Candidate 1 - Major Node");
        addCandidate("Candidate 2 - Secondary Node");
    }
    
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
    
    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "Voter has already cast a ballot.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate destination.");
        
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        
        emit votedEvent(_candidateId);
    }
}`
  },
  {
    id: "p3",
    title: "Autonomous Warehouse Robot",
    category: "Robotics",
    type: "Minor Project",
    price: 2999,
    mrp: 5999,
    rating: 4.7,
    reviews: 56,
    tech: ["ROS", "LiDAR", "Raspberry Pi"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    features: ["SLAM implementation", "Obstacle avoidance"],
    sku: "KVX-ROB-R09",
    abstract: "An autonomous vehicular robotics project implementing Simultaneous Localization and Mapping (SLAM) inside mock environments. Integrated with LiDAR spatial scanners and processed using the Robot Operating System (ROS) core framework.",
    code: `# Kalvex Autonomous Navigation Path Planner
import rospy
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan

def scan_callback(msg):
    # Front sector ranging calculation
    front_ranges = msg.ranges[160:200]
    min_dist = min(front_ranges)
    
    cmd = Twist()
    if min_dist < 0.5:
        # Obstacle detected - spin robot safely
        cmd.linear.x = 0.0
        cmd.angular.z = 0.5
        rospy.loginfo("Obstacle Block - Re-routing path")
    else:
        # Path clean - drive linear
        cmd.linear.x = 0.2
        cmd.angular.z = 0.0
        
    pub.publish(cmd)

rospy.init_node('kalvex_path_planner')
pub = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
sub = rospy.Subscriber('/scan', LaserScan, scan_callback)
rospy.spin()`
  },
  {
    id: "p4",
    title: "Smart Grid Energy Management",
    category: "Electrical",
    type: "Mini Project",
    price: 1999,
    mrp: 3999,
    rating: 4.6,
    reviews: 42,
    tech: ["MATLAB", "IoT", "React"],
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    features: ["Load forecasting", "Billing system"],
    sku: "KVX-ELE-G02",
    abstract: "Smart metering and load management project simulation detailing how smart grids dynamically adjust to consumption spikes. It forecasts power loads using MATLAB modules and relays dashboard telemetry in real-time.",
    code: `% Kalvex Grid Load Optimization Model
function [optimized_dispatch] = optimizeGrid(load_demands, renewable_gen)
    num_hours = length(load_demands);
    optimized_dispatch = zeros(num_hours, 1);
    
    for h = 1:num_hours
        net_demand = load_demands(h) - renewable_gen(h);
        if net_demand > 0
            % Supplement from reserve thermal batteries
            optimized_dispatch(h) = net_demand;
        else
            % Excess power routed to grid storage array
            optimized_dispatch(h) = 0;
            fprintf('Hour %d: Surplus energy saved to grid storage.\\n', h);
        end
    end
end`
  },
  {
    id: "p5",
    title: "Neural Network Traffic Control",
    category: "Machine Learning",
    type: "Major Project",
    price: 6499,
    mrp: 11999,
    rating: 5.0,
    reviews: 215,
    tech: ["TensorFlow", "OpenCV", "Flask"],
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=800",
    features: ["Object detection", "Dynamic signal timing"],
    sku: "KVX-ML-T88",
    abstract: "An AI-powered smart intersection system featuring computerized vehicle classification. Using computer vision models, it tracks real-time traffic volume and adjusts green-light sequences to eliminate static timers.",
    code: `# Kalvex AI Traffic Counter & Object Tracker
import cv2
import numpy as np

# Load pre-trained Kalvex Object Classifier
net = cv2.dnn.readNet("yolov4-tiny-kalvex.weights", "yolov4-tiny-kalvex.cfg")
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

cap = cv2.VideoCapture("intersection_feed.mp4")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    
    height, width, channels = frame.shape
    blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
    net.setInput(blob)
    outs = net.forward(output_layers)
    
    vehicle_count = 0
    # Process detections...
    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5 and class_id == 2: # Vehicle index
                vehicle_count += 1
                
    cv2.putText(frame, f"Vehicles: {vehicle_count}", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Intersection Analysis", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()`
  }
];

export default function ProjectDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { data: session } = useSession();

  // Find project in database
  const project = useMemo(() => {
    return PROJECTS.find(p => p.id === slug) || PROJECTS[0];
  }, [slug]);

  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "code" | "chapters">("overview");
  const [wishlisted, setWishlisted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Dynamic customization add-ons options
  const [addOnKit, setAddOnKit] = useState(false);
  const [addOnBook, setAddOnBook] = useState(false);
  const [addOnViva, setAddOnViva] = useState(false);

  // Pincode details state
  const [pincode, setPincode] = useState("");
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<{
    status: "success" | "error";
    message: string;
    speed: string;
  } | null>(null);

  // Spotlight card ref
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Calculate customized price
  const finalPrice = useMemo(() => {
    let base = project.price;
    if (addOnKit) base += 3500;
    if (addOnBook) base += 1500;
    if (addOnViva) base += 2500;
    return base;
  }, [project.price, addOnKit, addOnBook, addOnViva]);

  const finalMrp = useMemo(() => {
    let base = project.mrp;
    if (addOnKit) base += 5000;
    if (addOnBook) base += 2000;
    if (addOnViva) base += 3500;
    return base;
  }, [project.mrp, addOnKit, addOnBook, addOnViva]);

  const discount = Math.round(((finalMrp - finalPrice) / finalMrp) * 100);

  // Sync wishlist status
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kalvex_saved");
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) {
          setWishlisted(items.some((i: any) => i.id === project.id));
        }
      }
    } catch (err) {}
  }, [project]);

  // Pincode check
  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeResult({
        status: "error",
        message: "Invalid entry. Enter a valid 6-digit postal pincode.",
        speed: ""
      });
      return;
    }

    setIsCheckingPincode(true);
    setPincodeResult(null);

    setTimeout(() => {
      setIsCheckingPincode(false);
      const isWestern = pincode.startsWith("4");
      if (isWestern) {
        setPincodeResult({
          status: "success",
          message: "Rapid academic kit transit available. Dispatched via BlueDart Express.",
          speed: "Estimated Delivery: 24-48 Hours (Direct to home/college)"
        });
      } else {
        setPincodeResult({
          status: "success",
          message: "Standard academic kit transit available. Dispatched via Delhivery Surface.",
          speed: "Estimated Delivery: 3-4 Days"
        });
      }
    }, 900);
  };

  // Add to Procurement Cart
  const handleAddToCart = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const stored = localStorage.getItem("kalvex_cart");
      let items: any[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(items)) items = [];

      // Pack project with selected add-ons in name for dashboard checkout clarity
      let finalName = project.title;
      let selectedAddons = [];
      if (addOnKit) selectedAddons.push("Hardware Kit");
      if (addOnBook) selectedAddons.push("Black Book Printing");
      if (addOnViva) selectedAddons.push("Viva Online Prep");
      if (selectedAddons.length > 0) {
        finalName += ` (${selectedAddons.join(" + ")})`;
      }

      const existing = items.find((item: any) => item.id === project.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
        existing.name = finalName;
        existing.price = finalPrice;
        existing.mrp = finalMrp;
      } else {
        items.push({
          id: project.id,
          name: finalName,
          sku: project.sku,
          price: finalPrice,
          mrp: finalMrp,
          category: project.category,
          qty: 1,
          image: project.image,
        });
      }

      localStorage.setItem("kalvex_cart", JSON.stringify(items));
      window.dispatchEvent(new Event("kalvex-cart-updated"));

      const toast = document.createElement("div");
      toast.className = "fixed bottom-8 right-8 z-[500] bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-650 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 font-sans text-xs font-bold uppercase tracking-wider";
      toast.innerHTML = `<span class="bg-white/20 p-1.5 rounded-lg text-white">✓</span> Project ${project.title} added to procurement cart`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.className += " animate-out fade-out duration-300";
        setTimeout(() => toast.remove(), 300);
      }, 3000);

    } catch (err) {
      alert("Failed to add to cart");
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

      const exists = items.some((i: any) => i.id === project.id);
      let updatedItems = [];
      if (exists) {
        updatedItems = items.filter((i: any) => i.id !== project.id);
        setWishlisted(false);
      } else {
        items.push({
          id: project.id,
          name: project.title,
          sku: project.sku,
          price: project.price,
          mrp: project.mrp,
          category: project.category,
          qty: 1,
          image: project.image,
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

  // Copy code handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.code || "");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
        
        {/* Navigation back button */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/projects">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-white text-slate-600 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest rounded-2xl py-6 px-6 border border-slate-100/50 shadow-sm hover:shadow-md bg-white/40 backdrop-blur-md">
              <ArrowLeft className="w-4 h-4 text-indigo-500 animate-pulse" /> Back to Projects Marketplace
            </Button>
          </Link>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:flex items-center gap-2">
            <span>Marketplace</span> <span className="text-slate-300">&gt;</span> 
            <span>{project.category}</span> <span className="text-slate-300">&gt;</span> 
            <span className="text-slate-600 font-bold">{project.sku}</span>
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

          {/* Core Card (Light Mode Luxury) */}
          <div className="relative z-10 bg-white/95 backdrop-blur-3xl rounded-[2.9rem] p-8 md:p-14 transition-colors duration-500">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Left Column: Image Area */}
              <div className="space-y-8">
                <div className="relative aspect-[5/4] rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/detail:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-slate-900/90 text-white text-[9px] font-black px-4.5 py-2.5 rounded-xl shadow-lg uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" /> {project.type}
                    </span>
                  </div>
                </div>

                {/* Technical data metrics dashboard */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "Advanced", desc: "Complexity Level", icon: Cpu, color: "text-blue-600 bg-blue-50" },
                    { value: "120+ Hrs", desc: "Development Lab", icon: Zap, color: "text-amber-600 bg-amber-50" },
                    { value: "80+ Pages", desc: "IEEE Black Book", icon: BookOpen, color: "text-purple-600 bg-purple-50" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-1.5 shadow-sm">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color} shrink-0`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest leading-none mt-1">
                        {item.value}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Customization selection and buy pathways */}
              <div className="flex flex-col justify-between space-y-8">
                
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-md">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                      SKU: {project.sku}
                    </span>
                  </div>

                  <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
                    {project.title}
                  </h1>

                  {/* Star rating matrix */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 text-yellow-400 fill-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      {project.rating} ({project.reviews} Peer Submissions verified)
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 w-full my-6" />

                  {/* Add-ons Selector (Removed Warranty reference) */}
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Procurement Customizations & Tiers
                    </p>
                    
                    <div className="grid gap-3">
                      {[
                        {
                          id: "kit",
                          title: "Full Hardware Component Kit (+₹3,500)",
                          desc: "Get all physical sensors, microcontroller boards, transceivers, and accessories to build the kit physically.",
                          state: addOnKit,
                          setter: setAddOnKit
                        },
                        {
                          id: "book",
                          title: "Hardbound Black Book Printing (+₹1,500)",
                          desc: "Institutional standard gold-embossed hardbound black book prints dispatched to your location.",
                          state: addOnBook,
                          setter: setAddOnBook
                        },
                        {
                          id: "viva",
                          title: "1-on-1 Online Viva Prep Session (+₹2,500)",
                          desc: "Dedicated session with academic PhD experts to prepare you for presentation viva questions.",
                          state: addOnViva,
                          setter: setAddOnViva
                        }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => opt.setter(!opt.state)}
                          className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                            opt.state 
                              ? "bg-indigo-50/40 border-indigo-500 shadow-sm" 
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="relative w-5 h-5 shrink-0 mt-0.5">
                            <input 
                              type="checkbox" 
                              checked={opt.state} 
                              onChange={() => {}} 
                              className="peer absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className={`w-full h-full border-2 rounded transition-all ${
                              opt.state ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                            }`} />
                            <Check className={`absolute inset-0.5 text-white scale-0 transition-transform ${
                              opt.state ? "scale-100" : ""
                            }`} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">{opt.title}</h4>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Math Container */}
                  <div className="relative bg-gradient-to-r from-blue-50/50 via-indigo-50/20 to-pink-50/30 p-6 rounded-[2.2rem] border border-indigo-100/30 overflow-hidden mt-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Procurement Total</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-slate-900 tracking-tight">₹{finalPrice.toLocaleString()}</span>
                        <span className="text-sm font-bold text-slate-400 line-through">₹{finalMrp.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100/80 px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5">
                        Save {(discount)}% Off with Selected Tiers
                      </span>
                    </div>
                  </div>

                </div>

                {/* Transit check */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-[2.2rem] p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500 animate-bounce" />
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Verify Kit Logistics Speed</span>
                  </div>

                  <form onSubmit={handlePincodeCheck} className="flex gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit postal pincode..."
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 outline-none text-slate-950 font-bold text-xs flex-grow placeholder:text-slate-300 focus:border-indigo-500 transition-all uppercase tracking-[0.15em] shadow-sm"
                    />
                    <Button
                      type="submit"
                      disabled={isCheckingPincode}
                      className="bg-slate-900 text-white font-black text-xs uppercase tracking-widest px-6 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg active:scale-98"
                    >
                      {isCheckingPincode ? "Calculating..." : "Verify"}
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
                              <p className="font-black uppercase tracking-wider">{pincodeResult.speed}</p>
                              <p className="font-bold opacity-80 text-[10px] uppercase tracking-wide">
                                {pincodeResult.message}
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

                {/* Actions */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white font-black text-[11px] uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-indigo-600/10 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      Instant Procurement
                    </button>

                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      className="flex-1 border-slate-200 hover:bg-slate-50 hover:text-slate-950 font-black text-[11px] uppercase tracking-widest h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-sm bg-white"
                    >
                      <ShoppingBag className="w-4 h-4 text-indigo-500" /> Add to cart
                    </Button>

                    <Button
                      onClick={toggleWishlist}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all shrink-0 active:scale-[0.98] ${
                        wishlisted 
                          ? "bg-pink-50 border-pink-100 text-pink-500 hover:bg-pink-100 hover:border-pink-200" 
                          : "bg-white border-slate-200 text-slate-400 hover:text-pink-500 hover:border-slate-350 bg-white"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${wishlisted ? "fill-pink-500 text-pink-500" : ""}`} />
                    </Button>
                  </div>
                </div>

              </div>

            </div>

            {/* Spec Matrix tabs */}
            <div className="mt-20 pt-16 border-t border-slate-100 relative">
              
              <div className="flex border-b border-slate-100 gap-8 overflow-x-auto pb-4 scrollbar-none">
                {[
                  { id: "overview", label: "Full Abstract", icon: Info },
                  { id: "architecture", label: "System Design CAD", icon: Layers },
                  { id: "code", label: "Source Code Preview", icon: Code },
                  { id: "chapters", label: "IEEE Thesis Outline", icon: BookOpen }
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
                          layoutId="active-project-tab"
                          className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab drawer (Removed all warranty references) */}
              <div className="py-8 min-h-[300px]">
                <AnimatePresence mode="wait">
                  
                  {/* Abstract Overview */}
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6 max-w-4xl"
                    >
                      <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">Academic Abstract & Learning Targets</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed leading-loose">
                        {project.abstract}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        {[
                          { title: "Target Department Branches", desc: "Electronics, Computer Science, Robotics, Information Technology, and Mechatronics Engineering courses." },
                          { title: "Standard Learning Outcomes", desc: "Understand real-time sensory calibration, web sockets connection protocols, embedded H-Bridge calculations, and firmware design." },
                          { title: "IEEE Citation Standard", desc: "Constructed directly following recent IEEE transactions papers. Delivers authentic citations and literature surveys." },
                          { title: "Viva Readiness Package", desc: "Includes comprehensive viva preparation blueprints with standard examiner questions and perfect scoring answers." }
                        ].map((card, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-slate-50/50 to-blue-50/20 p-6 rounded-2xl border border-slate-100 flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                              <CheckCircle className="w-5 h-5" />
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

                  {/* System Architecture SVG drawing */}
                  {activeTab === "architecture" && (
                    <motion.div
                      key="architecture"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">Standard Block Diagram CAD</h3>
                      
                      <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-8 md:p-12 flex items-center justify-center relative overflow-hidden group/cad shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
                        
                        <div className="relative z-10 w-full max-w-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                          
                          {/* Block 1 */}
                          <div className="bg-slate-900 border border-indigo-500/20 rounded-xl p-5 text-center flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.05)] w-40 flex-shrink-0">
                            <Cpu className="w-5 h-5 text-indigo-400 animate-bounce" />
                            <span className="font-mono text-[10px] text-white font-bold">Input Sensor Mesh</span>
                            <span className="font-mono text-[8px] text-slate-500">Analog/Digital Telemetry</span>
                          </div>

                          {/* Line */}
                          <div className="w-8 h-px bg-dashed bg-indigo-500/30 hidden md:block" />

                          {/* Block 2 */}
                          <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-6 text-center flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.1)] w-48 flex-shrink-0 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono text-[7px] px-2 py-0.5 rounded uppercase shadow">
                              Core Processor
                            </div>
                            <span className="font-mono text-[10px] text-white font-bold">{project.sku} Node</span>
                            <span className="font-mono text-[8px] text-indigo-400">{project.tech.join(" / ")}</span>
                          </div>

                          {/* Line */}
                          <div className="w-8 h-px bg-dashed bg-indigo-500/30 hidden md:block" />

                          {/* Block 3 */}
                          <div className="bg-slate-900 border border-indigo-500/20 rounded-xl p-5 text-center flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.05)] w-40 flex-shrink-0">
                            <Layers className="w-5 h-5 text-indigo-400" />
                            <span className="font-mono text-[10px] text-white font-bold">Web API Dashboard</span>
                            <span className="font-mono text-[8px] text-slate-500">JSON Web Telemetry</span>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Clean Light-Theme Code Sandbox */}
                  {activeTab === "code" && (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">Interactive Code Sandbox</h3>
                          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">VERIFIED SCRIPTS COMPILE PREVIEW</p>
                        </div>
                        <Button 
                          onClick={handleCopyCode}
                          className="bg-indigo-650 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Code
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Light-theme professional code canvas */}
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
                        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-850">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-black">
                            {project.tech.includes("Python") ? "main.py" : "firmware.ino"}
                          </span>
                        </div>
                        <pre className="p-6 md:p-8 font-mono text-[11px] text-slate-350 overflow-x-auto leading-relaxed custom-scrollbar max-h-[350px]">
                          <code>
                            {project.code || "// Core Code Preview"}
                          </code>
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {/* IEEE Thesis outline timeline */}
                  {activeTab === "chapters" && (
                    <motion.div
                      key="chapters"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">IEEE Black Book Document Index</h3>
                      
                      <div className="relative border-l-2 border-indigo-100 ml-4 pl-8 space-y-8 pt-2">
                        {[
                          { num: "Abstract", title: "Project Abstract & Problem Declarations" },
                          { num: "Chapter 1", title: "Introduction & Systematic Targets mapping" },
                          { num: "Chapter 2", title: "Literature Survey & Detailed Peer Citations review" },
                          { num: "Chapter 3", title: "System Architecture, Flowcharts, & Circuits Designing" },
                          { num: "Chapter 4", title: "Hardware Assemblies / Firmware implementations" },
                          { num: "Chapter 5", title: "System Output Results, Graphs, & Comparative Analysis" },
                          { num: "Chapter 6", title: "Conclusions, Future Scope, & Authentic References Index" }
                        ].map((chap, idx) => (
                          <div key={idx} className="relative group/timeline">
                            <div className="absolute -left-[42px] top-0.5 w-6 h-6 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center shadow-sm group-hover/timeline:border-pink-500 transition-colors">
                              <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover/timeline:bg-pink-500 transition-colors" />
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                                {chap.num}
                              </span>
                              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider mt-0.5">
                                {chap.title}
                              </h4>
                            </div>
                          </div>
                        ))}
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
