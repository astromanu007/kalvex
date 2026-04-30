"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Ghost, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
          <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20 select-none">
            404
          </h1>
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Ghost className="w-24 h-24 text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-current" />
            Path Not Found
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Lost in the <span className="text-blue-500">Multiverse?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto font-medium">
            The page you're looking for has vanished into the digital void. Let's get you back to reality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/">
            <Button className="bg-white hover:bg-slate-200 text-slate-950 h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest group transition-all duration-500 hover:scale-105 shadow-2xl shadow-white/10">
              <Home className="w-4 h-4 mr-3" />
              Back to Home
            </Button>
          </Link>
          <Button 
            onClick={() => window.history.back()}
            variant="outline" 
            className="border-white/10 text-white hover:bg-white/5 h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-3" />
            Go Back
          </Button>
        </motion.div>

        {/* Decorative 3D Elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-white/5 rounded-full rotate-45 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 border border-white/5 rounded-full -rotate-12 pointer-events-none" />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-slate-600">
        <Sparkles className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">KALVEX Elite Infrastructure</span>
      </div>
    </div>
  );
}
