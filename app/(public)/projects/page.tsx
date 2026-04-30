"use client";

import { useState } from "react";
import { 
  Search, Filter, ShoppingBag, Download, 
  Cpu, Code, GraduationCap, ChevronRight,
  Star, Clock, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    tech: ["Python", "Arduino", "LoRaWAN", "OpenCV"],
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
    features: ["Real-time soil analysis", "Automated irrigation", "Mobile app control"]
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
    tech: ["Ethereum", "Solidity", "Next.js", "Web3.js"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    features: ["Immutable records", "Biometric auth", "Real-time results"]
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
    tech: ["ROS", "C++", "LiDAR", "Raspberry Pi"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    features: ["SLAM implementation", "Obstacle avoidance", "Path planning"]
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
    features: ["Load forecasting", "Renewable integration", "Billing system"]
  }
];

const CATEGORIES = ["All", "Internet of Things", "Cybersecurity", "Robotics", "Electrical", "Machine Learning"];

export default function ProjectShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProjects = PROJECTS.filter(p => 
    (selectedCategory === "All" || p.category === selectedCategory) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.tech.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6">
            Project <span className="text-accent-primary">Marketplace</span>
          </h1>
          <p className="text-lg text-text-secondary">
            Ready-to-deploy engineering projects with full documentation, 
            source code, and hardware diagrams.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="text"
              placeholder="Search by title, tech stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-card border border-border rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-accent-primary transition-colors shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl border transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                  ? "bg-accent-primary border-accent-primary text-white shadow-glow" 
                  : "bg-bg-card border-border text-text-secondary hover:border-accent-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div key={project.id} className="group bg-bg-card border border-border rounded-[2rem] overflow-hidden hover:border-accent-primary/30 transition-all duration-500 hover:shadow-2xl">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
                    {project.type}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-accent-warning fill-accent-warning" />
                  <span className="text-sm font-bold text-text-primary">{project.rating}</span>
                  <span className="text-xs text-text-muted">({project.reviews} reviews)</span>
                </div>

                <h3 className="font-heading font-bold text-xl text-text-primary mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-accent-primary transition-colors">
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map(t => (
                    <span key={t} className="text-[10px] font-medium bg-bg-surface text-text-secondary px-2.5 py-1 rounded-lg border border-border">
                      {t}
                    </span>
                  ))}
                </div>

                <ul className="space-y-2 mb-8">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                      <ChevronRight className="w-4 h-4 text-accent-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">Starting from</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-mono font-bold text-text-primary">₹{project.price.toLocaleString()}</span>
                      <span className="text-sm text-text-muted line-through">₹{project.mrp.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button className="bg-accent-primary hover:bg-accent-primary/90 text-white shadow-glow h-12 w-12 rounded-2xl">
                    <ShoppingBag className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Trust Bar */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 p-12 bg-bg-surface rounded-[3rem] border border-border">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center">
              <Download className="w-8 h-8 text-accent-primary" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg">Instant Download</h4>
              <p className="text-xs text-text-secondary">Get source code immediately after payment.</p>
            </div>
          </div>
          <div className="flex items-center gap-5 border-y md:border-y-0 md:border-x border-border py-8 md:py-0 md:px-8">
            <div className="w-16 h-16 rounded-2xl bg-accent-secondary/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-accent-secondary" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg">Verified Code</h4>
              <p className="text-xs text-text-secondary">All projects are tested by senior engineers.</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-accent-warning/10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-accent-warning" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg">Report & PPT</h4>
              <p className="text-xs text-text-secondary">Comprehensive documentation included.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
