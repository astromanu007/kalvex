"use server";

import prisma from "@/lib/prisma";

export async function seedInitialData() {
  try {
    const SERVICES = [
      {
        slug: "phd-thesis",
        icon: "BookOpen",
        title: "PhD Thesis Help",
        description: "End-to-end support and drafting for your doctoral research thesis to meet university standards.",
        deliverables: ["Complete thesis draft", "Plagiarism check", "Unlimited revisions", "Proper formatting"],
        color: "text-blue-600",
        bg: "bg-blue-600/10",
        glow: "group-hover:shadow-blue-600/20"
      },
      {
        slug: "research-paper",
        icon: "FileText",
        title: "Research Papers",
        description: "High-quality research papers ready for IEEE, Scopus, or other major journals.",
        deliverables: ["Ready-to-publish paper", "Plagiarism check", "Peer-review support", "Submission help"],
        color: "text-indigo-600",
        bg: "bg-indigo-600/10",
        glow: "group-hover:shadow-indigo-600/20"
      },
      {
        slug: "final-year-report",
        icon: "Briefcase",
        title: "Final Year Reports",
        description: "Professional project reports, technical manuals, and documentation for your final year.",
        deliverables: ["PDF & Word files", "References sorted", "Quality check", "48-hour delivery"],
        color: "text-orange-600",
        bg: "bg-orange-600/10",
        glow: "group-hover:shadow-orange-600/20"
      },
      {
        slug: "design-patent",
        icon: "ShieldCheck",
        title: "Design Patent Filing",
        description: "Protect the unique visual look and feel of your invention with official registration.",
        deliverables: ["Application forms", "Technical drawings", "Legal drafting", "Government filing"],
        color: "text-emerald-600",
        bg: "bg-emerald-600/10",
        glow: "group-hover:shadow-emerald-600/20"
      },
      {
        slug: "utility-patent",
        icon: "Cpu",
        title: "Utility Patents",
        description: "Technical drafting and claims preparation for your functional engineering inventions.",
        deliverables: ["Complete specification", "Patent claims", "Diagrams", "Prior art search"],
        color: "text-cyan-600",
        bg: "bg-cyan-600/10",
        glow: "group-hover:shadow-cyan-600/20"
      },
      {
        slug: "copyright",
        icon: "Award",
        title: "Copyright Registration",
        description: "Officially register your software code, technical manuals, or creative works.",
        deliverables: ["Government registration", "Digital certificate", "Source copy", "Legal compliance"],
        color: "text-amber-600",
        bg: "bg-amber-600/10",
        glow: "group-hover:shadow-amber-600/20"
      },
      {
        slug: "trademark",
        icon: "Zap",
        title: "Trademark Registration",
        description: "Register your startup logo, brand name, or tagline across India securely.",
        deliverables: ["Trademark search", "Application filing", "Government fees included", "Status tracking"],
        color: "text-rose-600",
        bg: "bg-rose-600/10",
        glow: "group-hover:shadow-rose-600/20"
      },
      {
        slug: "mini-project",
        icon: "Lightbulb",
        title: "Mini Projects",
        description: "Pre-built or custom mini-projects featuring high-quality source code and schematics.",
        deliverables: ["Source code", "Project report", "Presentation", "Working demo"],
        color: "text-violet-600",
        bg: "bg-violet-600/10",
        glow: "group-hover:shadow-violet-600/20"
      },
      {
        slug: "major-project",
        icon: "Cpu",
        title: "Major Projects",
        description: "Complex final-year engineering projects for CS, Electronics, and Robotics students.",
        deliverables: ["Custom development", "Full documentation", "Technical support", "6-month maintenance"],
        color: "text-blue-600",
        bg: "bg-blue-600/10",
        glow: "group-hover:shadow-blue-600/20"
      },
      {
        slug: "writing-writeups",
        icon: "FileText",
        title: "Writing & Writeups",
        description: "Professional technical writeups and documentation starting at ₹5 per page.",
        deliverables: ["Standard (₹5/pg)", "Urgent (₹10/pg)", "Plagiarism report", "Ready to print"],
        color: "text-slate-600",
        bg: "bg-slate-600/10",
        glow: "group-hover:shadow-slate-600/20"
      },
    ];

    const PROJECTS = [
      {
        title: "AI-Based Smart Agriculture System",
        category: "Internet of Things",
        price: 4999,
        mrp: 8999,
        tech: ["Python", "Arduino", "LoRaWAN"],
        image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
        sku: "KVX-IOT-S01"
      },
      {
        title: "Blockchain Secure Voting Platform",
        category: "Cybersecurity",
        price: 5499,
        mrp: 9999,
        tech: ["Ethereum", "Solidity", "Next.js"],
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
        sku: "KVX-SEC-V04"
      },
      {
        title: "Autonomous Warehouse Robot",
        category: "Robotics",
        price: 2999,
        mrp: 5999,
        tech: ["ROS", "LiDAR", "Raspberry Pi"],
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
        sku: "KVX-ROB-R09"
      },
      {
        title: "Smart Grid Energy Management",
        category: "Electrical",
        price: 1999,
        mrp: 3999,
        tech: ["MATLAB", "IoT", "React"],
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
        sku: "KVX-ELE-G02"
      },
      {
        title: "Neural Network Traffic Control",
        category: "Machine Learning",
        price: 6499,
        mrp: 11999,
        tech: ["TensorFlow", "OpenCV", "Flask"],
        image: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=800",
        sku: "KVX-ML-T88"
      },
      {
        title: "Bio-Medical Patient Monitor",
        category: "Internet of Things",
        price: 3499,
        mrp: 6999,
        tech: ["ESP32", "Firebase", "HealthAPI"],
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
        sku: "KVX-BIO-M12"
      }
    ];

    const PRODUCTS = [
      { name: "Raspberry Pi 5 8GB RAM", sku: "KVX-SBC-005", price: 8500, mrp: 9200, category: "Development Boards", stock: 15, image: "/products/pi5.png" },
      { name: "Arduino Uno R4 WiFi", sku: "KVX-SBC-004", price: 2450, mrp: 2800, category: "Development Boards", stock: 120, image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=600" },
      { name: "ESP32-S3 DevKitC-1", sku: "KVX-MOD-033", price: 550, mrp: 750, category: "Development Boards", stock: 45, image: "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&q=80&w=600" },
      { name: "MPU6050 6-Axis Gyro/Accel", sku: "KVX-SEN-605", price: 180, mrp: 250, category: "Sensors", stock: 150, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" },
      { name: "DHT22 Digital Temp & Humidity", sku: "KVX-SEN-022", price: 320, mrp: 450, category: "Sensors", stock: 80, image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=600" },
      { name: "HC-SR04 Ultrasonic Sensor", sku: "KVX-SEN-004", price: 85, mrp: 120, category: "Sensors", stock: 500, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600" },
    ];

    console.log("Seeding Services...");
    for (const s of SERVICES) {
      await prisma.service.upsert({
        where: { slug: s.slug },
        update: {},
        create: { ...s, isActive: true }
      });
    }

    console.log("Seeding Projects...");
    for (const p of PROJECTS) {
      await prisma.project.upsert({
        where: { sku: p.sku },
        update: {},
        create: {
          ...p,
          slug: p.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
          images: [p.image],
          description: `${p.title} - A high-quality engineering project.`,
          isActive: true
        }
      });
    }

    console.log("Seeding Products...");
    for (const pr of PRODUCTS) {
      await prisma.product.upsert({
        where: { sku: pr.sku },
        update: {},
        create: {
          ...pr,
          slug: pr.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
          images: [pr.image],
          description: `${pr.name} component.`,
          specs: {},
          isActive: true
        }
      });
    }

    return { success: true, message: "Initial data seeded successfully!" };
  } catch (error: any) {
    console.error("Seeding error:", error);
    return { success: false, message: error.message };
  }
}
