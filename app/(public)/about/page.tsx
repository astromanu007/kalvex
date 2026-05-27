"use client";

import React from "react";
import {
  Target, Users, Award, ShieldCheck,
  ArrowRight, Globe, Zap, Heart, Sparkles, Building2, Shield, Fingerprint,
  Cpu, Rocket, Lightbulb, Workflow, Star, Instagram, Linkedin, Twitter
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion, useScroll, useTransform, useInView, useAnimation } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Sphere, MeshDistortMaterial, Float, Stars, PerspectiveCamera,
  Icosahedron, MeshWobbleMaterial, Torus, Environment, Points, PointMaterial
} from "@react-three/drei";
import * as THREE from "three";

function InstitutionalCore({ lightMode }: { lightMode?: boolean }) {
  const pointsRef = React.useRef<THREE.Points>(null);
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.05;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = -t * 0.03;
      meshRef.current.rotation.y = t * 0.02;
    }
  });

  const mainColor = lightMode ? "#4f46e5" : "#8b5cf6";
  const pointColor = lightMode ? "#3b82f6" : "#ec4899";

  return (
    <group>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Data Point Cloud */}
        <Points ref={pointsRef}>
          <sphereGeometry args={[6, 64, 64]} />
          <PointMaterial
            transparent
            color={pointColor}
            size={0.08}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={lightMode ? 0.2 : 0.4}
          />
        </Points>

        {/* Crystalline Core Structure */}
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[4, 0]} />
          <meshStandardMaterial
            color={mainColor}
            wireframe
            transparent
            opacity={lightMode ? 0.1 : 0.2}
            emissive={mainColor}
            emissiveIntensity={lightMode ? 1 : 2}
          />
        </mesh>
      </Float>

      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={lightMode ? 2 : 1} />
      <pointLight position={[10, 10, 10]} intensity={lightMode ? 5 : 3} color={mainColor} />
    </group>
  );
}

function DynamicGrid() {
  return (
    <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 p-8 opacity-30 pointer-events-none">
      {[...Array(144)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.15, 0.6, 0.15],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.3)]"
        />
      ))}
    </div>
  );
}

function CosmosBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />

      {/* 3D Floating Anomalies */}
      <Float speed={4} rotationIntensity={1.5} floatIntensity={2}>
        <Icosahedron args={[1, 0]} position={[-4, 2, -2]} scale={0.8}>
          <MeshDistortMaterial color="#3b82f6" speed={5} distort={0.5} emissive="#1d4ed8" emissiveIntensity={2} wireframe />
        </Icosahedron>
      </Float>

      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <Icosahedron args={[1, 0]} position={[5, -2, -3]} scale={1.2}>
          <MeshDistortMaterial color="#10b981" speed={4} distort={0.4} emissive="#059669" emissiveIntensity={2} wireframe />
        </Icosahedron>
      </Float>

      <Float speed={5} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[1, 32, 32]} position={[0, -3, -5]} scale={0.5}>
          <meshStandardMaterial color="#6366f1" emissive="#4338ca" emissiveIntensity={5} wireframe />
        </Sphere>
      </Float>

      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#3b82f6" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#10b981" />
    </Canvas>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  const { scrollYProgress } = useScroll();

  const stats = [
    { label: "Engineering Assets", value: "500+", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Institutional Experts", value: "50+", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "IP Applications", value: "120+", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Strategic Success", value: "99%", icon: Target, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const team = [
    {
      firstName: "Manish Avishkar",
      lastName: "Dhatrak",
      fullName: "Manish Avishkar Dhatrak",
      role: "Chief Executive Officer",
      quote: "Engineering is the bridge between pure science and the practical needs of humanity. At KALVEX, we build that bridge every day.",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1000",
      accent: "from-blue-600/30 via-indigo-600/10 to-cyan-400/5",
      gradient: "from-blue-700 via-indigo-600 to-cyan-500",
      iconColor: "text-blue-600"
    },
    {
      firstName: "Samarth Bharat",
      lastName: "Jadhav",
      fullName: "Samarth Bharat Jadhav",
      role: "Chief Technology Officer",
      quote: "Technology should be invisible yet indispensable. We focus on building tools that empower creators without getting in their way.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000",
      accent: "from-emerald-600/30 via-teal-600/10 to-lime-400/5",
      gradient: "from-emerald-700 via-teal-600 to-lime-500",
      iconColor: "text-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white transition-colors duration-500 overflow-hidden text-slate-900">
      {/* Refined Hero Section: The Elite Engineering Hub */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-white">
        {/* Elite Ambient Atmosphere */}
        <div className="absolute top-0 right-0 w-[80rem] h-[80rem] bg-blue-100/40 rounded-full -z-10 blur-[180px] -translate-y-1/2 translate-x-1/4 opacity-50 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[60rem] h-[60rem] bg-indigo-100/30 rounded-full -z-10 blur-[150px] translate-y-1/2 -translate-x-1/4 opacity-40" />
        <div className="absolute top-1/4 left-0 w-1.5 h-96 bg-gradient-to-b from-blue-600/0 via-blue-600 to-blue-600/0 -z-10 opacity-30 shadow-[0_0_30px_rgba(37,99,235,0.5)]" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-24 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-6 space-y-12"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-2xl border-2 border-blue-50 text-blue-600 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-blue-900/5">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <Building2 className="w-4 h-4" /> Institutional Hub
              </motion.div>

              <div className="space-y-8">
                <motion.h1 variants={fadeInUp} className="text-6xl md:text-7xl lg:text-8xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
                  Engineering <br />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent italic">Excellence.</span>
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-xl text-slate-400 font-bold leading-relaxed max-w-xl border-l-4 border-blue-600/10 pl-8 group-hover:border-blue-600 transition-all duration-700">
                  KALVEX is your premier platform for <span className="text-slate-900">high-impact research</span>, elite project execution, and institutional patent strategy.
                </motion.p>
              </div>

              <motion.div variants={fadeInUp} className="flex flex-row items-center gap-6 pt-6">
                <Link href="/services" className="group relative flex items-center gap-5 bg-slate-900 text-white px-8 h-18 md:h-20 rounded-2xl md:rounded-3xl transition-all duration-500 hover:bg-blue-600 hover:scale-105 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
                  <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.25em] relative z-10">Explore Services</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center relative z-10 group-hover:bg-white group-hover:text-blue-600 transition-all duration-500 group-hover:rotate-12">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </Link>

                <Link href="/projects" className="group relative flex items-center gap-5 bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-600 px-8 h-18 md:h-20 rounded-2xl md:rounded-3xl transition-all duration-500 hover:border-blue-600/50 hover:text-blue-600 shadow-lg shadow-slate-900/5 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.25em] relative z-10">Marketplace</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center relative z-10 group-hover:bg-blue-50 transition-all duration-500 group-hover:-rotate-12">
                    <Workflow className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
              className="lg:col-span-6 relative flex justify-end"
            >
              <div className="relative p-4 max-w-lg w-full">
                {/* Advanced Image Framework */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-emerald-600/5 rounded-[4rem] blur-3xl opacity-50" />
                <div className="relative rounded-[4rem] overflow-hidden border-[12px] border-white shadow-[0_64px_128px_-32px_rgba(15,23,42,0.15)] bg-white group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200"
                    className="w-full aspect-[4/5] object-cover transition-transform duration-[3s] group-hover:scale-105"
                    alt="Institutional Excellence"
                  />

                  {/* Floating Tech Specs Grid Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-3 translate-y-24 group-hover:translate-y-0 transition-transform duration-700 delay-100 z-20">
                    <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-xl">
                      <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Status</p>
                      <p className="text-[11px] font-black text-slate-900 uppercase">Operational</p>
                    </div>
                    <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-xl">
                      <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Precision</p>
                      <p className="text-[11px] font-black text-slate-900 uppercase">99.9% Core</p>
                    </div>
                  </div>
                </div>

                {/* Security Badge: The Glass Titan */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 group/badge z-30"
                >
                  <div className="absolute inset-0 bg-blue-600/20 rounded-[2rem] blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-white/95 backdrop-blur-2xl px-8 py-6 rounded-[2.5rem] border-2 border-blue-50 shadow-2xl flex items-center gap-4 transition-all duration-500 hover:border-blue-600">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600/60 leading-none mb-1">Security</p>
                      <p className="text-xs font-black text-slate-900 tracking-tight uppercase">Titan Protocol</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Section: The High-Impact Intelligence Grid */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.05)_0%,transparent_50%)] -z-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] -z-10" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                whileHover={{
                  y: -20,
                  transition: { duration: 0.5, ease: "easeOut" }
                }}
                className={`group bg-white/80 backdrop-blur-xl rounded-[4rem] p-12 border-2 border-white shadow-2xl shadow-slate-900/5 transition-all duration-700 cursor-default relative overflow-hidden
                  ${i === 0 ? "hover:border-blue-500/50 hover:shadow-blue-600/10" : ""}
                  ${i === 1 ? "hover:border-emerald-500/50 hover:shadow-emerald-600/10" : ""}
                  ${i === 2 ? "hover:border-purple-500/50 hover:shadow-purple-600/10" : ""}
                  ${i === 3 ? "hover:border-orange-500/50 hover:shadow-orange-600/10" : ""}
                `}
              >
                {/* Dynamic Internal Glow */}
                <div className={`absolute -inset-40 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 blur-[100px] -z-10
                  ${i === 0 ? "bg-blue-600" : ""}
                  ${i === 1 ? "bg-emerald-600" : ""}
                  ${i === 2 ? "bg-purple-600" : ""}
                  ${i === 3 ? "bg-orange-600" : ""}
                `} />

                <div className={`w-20 h-20 rounded-3xl ${stat.bg} ${stat.color} flex items-center justify-center mb-10 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 shadow-xl
                  ${i === 0 ? "group-hover:bg-blue-600 group-hover:text-white" : ""}
                  ${i === 1 ? "group-hover:bg-emerald-600 group-hover:text-white" : ""}
                  ${i === 2 ? "group-hover:bg-purple-600 group-hover:text-white" : ""}
                  ${i === 3 ? "group-hover:bg-orange-600 group-hover:text-white" : ""}
                `}>
                  <stat.icon className="w-10 h-10" />
                </div>

                <div className={`text-6xl font-black text-slate-900 mb-4 tracking-tighter transition-colors duration-700
                  ${i === 0 ? "group-hover:text-blue-600" : ""}
                  ${i === 1 ? "group-hover:text-emerald-600" : ""}
                  ${i === 2 ? "group-hover:text-purple-600" : ""}
                  ${i === 3 ? "group-hover:text-orange-600" : ""}
                `}>
                  {stat.value}
                </div>

                <div className="text-[11px] text-slate-400 font-black uppercase tracking-[0.4em] group-hover:text-slate-900 transition-colors duration-700">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Fantastic Visionaries Section: The Elite Leadership Core */}
      <section className="py-16 relative overflow-hidden bg-white">
        {/* Advanced Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.03)_0%,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(16,185,129,0.03)_0%,transparent_50%)] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] -z-10" />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-400 rounded-full blur-[120px] -z-20"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-emerald-400 rounded-full blur-[100px] -z-20"
        />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-4 bg-slate-50 border border-slate-100 px-8 py-3 rounded-2xl shadow-xl shadow-slate-900/5 backdrop-blur-xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em]">The Visionaries</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-black text-slate-900 font-heading tracking-tighter leading-[0.85]"
              >
                Meet Our <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">Founders.</span>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute -bottom-4 left-0 h-2 bg-gradient-to-r from-blue-600 to-transparent rounded-full opacity-30"
                  />
                </span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-slate-400 font-bold text-lg max-w-2xl mx-auto leading-relaxed pt-4"
            >
              Bridging the gap between <span className="text-slate-900">pioneering science</span> and <span className="text-slate-900">commercial excellence.</span>
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: i * 0.2 }}
                className="group relative"
              >
                {/* 3D Interactive Card Core */}
                <motion.div
                  whileHover={{
                    y: -15,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
                  }}
                  className="relative z-20 flex flex-col"
                >
                  {/* The Massive Frame */}
                  <div className="relative aspect-[4/5] rounded-[4rem] md:rounded-[5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(15,23,42,0.1)] border-[10px] border-white bg-slate-50 transition-all duration-1000">
                    {/* Soothing Glow Accent */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${member.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-1000 z-10`} />

                    <img
                      src={member.image}
                      alt={member.fullName}
                      className="w-full h-full object-cover grayscale-[0.4] brightness-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
                    />

                    {/* Social HUD - More Subtle */}
                    <div className="absolute top-8 right-8 flex flex-col gap-4 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-700 z-20">
                      {[
                        { Icon: Linkedin, color: "hover:bg-[#0077b5]" },
                        { Icon: Twitter, color: "hover:bg-[#1DA1F2]" },
                        { Icon: Instagram, color: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]" }
                      ].map((social, idx) => (
                        <button key={idx} className={`w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl flex items-center justify-center text-slate-600 hover:text-white transition-all duration-500 hover:scale-110 active:scale-95 ${social.color}`}>
                          <social.Icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Glass Content Plate */}
                  <div className="mt-10 px-4 md:px-8 space-y-8 relative">
                    {/* Subtle Vertical Accent */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full opacity-10 group-hover:opacity-100 transition-all duration-1000
                      ${i === 0 ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.3)]"}
                    `} />

                    <div className="space-y-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-2">
                          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight transition-transform duration-700">
                            {member.firstName} <br />
                            <span className={`bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent italic`}>
                              {member.lastName}
                            </span>
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-blue-600/60 font-black uppercase tracking-[0.4em] text-[8px]">{member.role}</span>
                            <div className="h-[1px] flex-1 bg-slate-100/50" />
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ rotate: 180, scale: 1.1 }}
                          className={`w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center ${member.iconColor} shadow-md group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shrink-0`}
                        >
                          <Star className="w-8 h-8" />
                        </motion.div>
                      </div>

                      <div className="relative pt-2">
                        <Sparkles className={`absolute -top-2 -left-4 w-10 h-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 ${member.iconColor}`} />
                        <p className="text-xl text-slate-400 font-bold leading-relaxed italic relative z-10 pl-4 group-hover:text-slate-500 transition-colors duration-500">
                          &ldquo;{member.quote}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Ambient Shadow/Glow Background */}
                <div className={`absolute inset-20 blur-[120px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 -z-10
                  ${i === 0 ? "bg-blue-600" : "bg-emerald-600"}
                `} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Global Mission: Professional Clean Grid */}
      <section className="py-24 bg-slate-50/50 relative">
        {/* TOP animated line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent overflow-hidden">
          <motion.div
            className="absolute top-0 h-full w-40 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"
            style={{ filter: "blur(3px)" }}
            animate={{ x: ["-160px", "110vw"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
          />
        </div>
        {/* BOTTOM animated line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent overflow-hidden">
          <motion.div
            className="absolute top-0 h-full w-40 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"
            style={{ filter: "blur(3px)" }}
            animate={{ x: ["-160px", "110vw"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 0.5, delay: 0.6 }}
          />
          <motion.div
            className="absolute top-0 h-full w-16 bg-white/80"
            animate={{ x: ["-64px", "110vw"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 0.5, delay: 0.6 }}
          />
        </div>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-12 mb-20">
            <div className="space-y-6">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">The KALVEX Way</p>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
                Professional Engineering <br />
                for <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent italic">Global Impact.</span>
              </h2>
              <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">
                We help you solve technical challenges with professional solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
              {[
                { title: "High Quality Support", desc: "Technical support for every project from start to finish.", icon: ShieldCheck },
                { title: "Secure Ownership", desc: "Your ideas and inventions stay yours with our secure platform.", icon: Fingerprint }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-8 p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-blue-600/20 transition-all group shadow-sm hover:shadow-xl text-left">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-400 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-Width Institutional Typography Showcase: 3D Kinetic Text + Animated Border */}
        <div className="relative w-full py-20 md:py-28 bg-transparent group flex items-center justify-center">

          {/* TOP animated line — boosted visibility */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent overflow-hidden">
            <motion.div
              className="absolute top-0 h-full w-40 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"
              style={{ filter: "blur(3px)" }}
              animate={{ x: ["-160px", "110vw"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
            />
            <motion.div
              className="absolute top-0 h-full w-16 bg-white/80"
              animate={{ x: ["-64px", "110vw"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
            />
          </div>

          {/* BOTTOM animated line — same as top */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent overflow-hidden">
            <motion.div
              className="absolute top-0 h-full w-40 bg-gradient-to-r from-transparent via-blue-500 to-purple-500"
              style={{ filter: "blur(3px)" }}
              animate={{ x: ["-160px", "110vw"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 0.5, delay: 0.6 }}
            />
            <motion.div
              className="absolute top-0 h-full w-16 bg-white/80"
              animate={{ x: ["-64px", "110vw"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 0.5, delay: 0.6 }}
            />
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-10 max-w-5xl"
            >
              {/* Floating Status Indicator */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-4 bg-transparent mx-auto"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <span className="text-blue-600 font-black text-[11px] uppercase tracking-[0.8em]">Core System Active</span>
              </motion.div>

              {/* Fantastic 3D Jumping Heading */}
              <div className="relative">
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 100, rotateX: 60, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        damping: 12,
                        stiffness: 100,
                        duration: 1.2
                      }
                    }
                  }}
                  whileHover={{
                    scale: 1.02,
                    rotateY: 5,
                    rotateX: -5,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.1] cursor-default pb-2"
                >
                  <span className="block mb-2">Institutional</span>
                  <motion.span
                    animate={{
                      y: [0, -15, 0],
                      textShadow: [
                        "0 0 0px rgba(59,130,246,0)",
                        "0 20px 40px rgba(59,130,246,0.2)",
                        "0 0 0px rgba(59,130,246,0)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent italic px-2"
                  >
                    Intelligence.
                  </motion.span>
                </motion.h3>

                {/* Subtle Decorative Accents */}
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400/10 blur-[80px] rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.1, 1, 1.1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                  className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-400/10 blur-[80px] rounded-full"
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-slate-400 text-lg md:text-xl font-bold leading-relaxed mx-auto max-w-2xl"
              >
                Experience the live heartbeat of our engineering infrastructure, where global data flows in a seamless holographic mesh.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* High-Impact Global CTA: Full-Width Horizontal Banner */}
      <section className="relative overflow-hidden bg-[#020617] w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative py-16 md:py-24 overflow-hidden bg-transparent w-full"
        >
          {/* Internal Solid Base */}
          <div className="absolute inset-0 bg-slate-950 -z-30" />

          {/* Cosmos Starfield Background */}
          <div className="absolute inset-0 z-[-25] opacity-50 pointer-events-none">
            <CosmosBackground />
          </div>

          {/* Dynamic Pattern Overlay */}
          <DynamicGrid />

          {/* Moving Institutional Gradients */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/40 via-indigo-600/20 to-transparent blur-[140px] -z-10"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1.4, 1, 1.4],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-600/30 via-blue-600/10 to-transparent blur-[140px] -z-10"
          />

          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none -z-10" />

          {/* Content Core */}
          <div className="relative z-10 container mx-auto px-6 max-w-7xl flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-3xl px-12 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl group/tag"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping" />
              </div>
              <span className="text-blue-100 font-black text-xs uppercase tracking-[0.6em]">Initialize Your Vision</span>
            </motion.div>

            <div className="space-y-6">
              <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter">
                Start Your <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent italic">Journey.</span>
              </h2>
              <p className="text-lg md:text-2xl text-slate-400 font-bold leading-tight max-w-4xl mx-auto">
                Partner with KALVEX to transform your <span className="text-white">technical vision</span> into <br className="hidden md:block" />
                <span className="text-white font-black italic">global engineering excellence.</span>
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 pt-4">
              <Link href="/contact" className="group/btn relative flex items-center gap-10 bg-white text-slate-900 px-16 h-28 rounded-[3rem] transition-all duration-700 hover:scale-105 hover:shadow-[0_60px_100px_-20px_rgba(59,130,246,0.3)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-emerald-600/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
                <span className="font-black text-2xl uppercase tracking-tighter relative z-10">Get In Touch</span>
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white relative z-10 group-hover/btn:bg-blue-600 group-hover/btn:rotate-12 transition-all duration-500">
                  <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                </div>
              </Link>

              <Link href="/services" className="group/link flex items-center gap-6 text-white/60 hover:text-white transition-all duration-500">
                <div className="w-16 h-16 rounded-3xl border-2 border-white/10 flex items-center justify-center group-hover/link:border-blue-400 group-hover/link:bg-blue-400/10 transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-1">Our Protocol</p>
                  <p className="text-sm font-black uppercase tracking-widest">Master Strategy</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
