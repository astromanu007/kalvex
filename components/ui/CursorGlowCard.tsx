"use client";

import { motion, useMotionValue, useMotionTemplate, HTMLMotionProps } from "framer-motion";
import React from "react";

interface CursorGlowCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  glowColor?: "blue" | "amber" | "emerald" | "purple" | "pink" | "indigo" | "rose" | "slate";
  innerClassName?: string;
  animateY?: boolean;
}

const COLOR_MAP = {
  blue: {
    radial: "rgba(37, 99, 235, 0.18)",
    border: "rgba(37, 99, 235, 0.8)",
    baseBorder: "border-2 border-blue-500/40 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]",
    glowBase: "from-blue-500/10 via-indigo-500/5 to-transparent",
  },
  amber: {
    radial: "rgba(245, 158, 11, 0.18)",
    border: "rgba(245, 158, 11, 0.8)",
    baseBorder: "border-2 border-amber-500/40 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    glowBase: "from-amber-500/10 via-yellow-500/5 to-transparent",
  },
  emerald: {
    radial: "rgba(16, 185, 129, 0.18)",
    border: "rgba(16, 185, 129, 0.8)",
    baseBorder: "border-2 border-emerald-500/40 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    glowBase: "from-emerald-500/10 via-teal-500/5 to-transparent",
  },
  purple: {
    radial: "rgba(139, 92, 246, 0.18)",
    border: "rgba(139, 92, 246, 0.8)",
    baseBorder: "border-2 border-purple-500/40 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]",
    glowBase: "from-purple-500/10 via-pink-500/5 to-transparent",
  },
  pink: {
    radial: "rgba(236, 72, 153, 0.18)",
    border: "rgba(236, 72, 153, 0.8)",
    baseBorder: "border-2 border-pink-500/40 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]",
    glowBase: "from-pink-500/10 via-rose-500/5 to-transparent",
  },
  indigo: {
    radial: "rgba(79, 70, 229, 0.18)",
    border: "rgba(79, 70, 229, 0.8)",
    baseBorder: "border-2 border-indigo-500/40 hover:border-indigo-550 hover:shadow-[0_0_20px_rgba(79,70,229,0.25)]",
    glowBase: "from-indigo-500/10 via-violet-500/5 to-transparent",
  },
  rose: {
    radial: "rgba(244, 63, 94, 0.18)",
    border: "rgba(244, 63, 94, 0.8)",
    baseBorder: "border-2 border-rose-500/40 hover:border-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.25)]",
    glowBase: "from-rose-500/10 via-pink-500/5 to-transparent",
  },
  slate: {
    radial: "rgba(15, 23, 42, 0.1)",
    border: "rgba(15, 23, 42, 0.4)",
    baseBorder: "border-2 border-slate-300 hover:border-slate-500 hover:shadow-[0_0_20px_rgba(15,23,42,0.15)]",
    glowBase: "from-slate-200/20 via-slate-100/10 to-transparent",
  },
};

export default function CursorGlowCard({
  children,
  glowColor = "indigo",
  className = "",
  innerClassName = "",
  animateY = true,
  ...props
}: CursorGlowCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const theme = COLOR_MAP[glowColor];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={animateY ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative rounded-[2rem] p-[2px] flex flex-col overflow-hidden bg-gradient-to-br transition-all duration-300 ${className.includes("bg-") ? "" : "bg-white"} ${theme.baseBorder} ${className}`}
      {...props}
    >
      {/* Outer Border Glow layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              160px circle at ${mouseX}px ${mouseY}px,
              ${theme.border},
              transparent 80%
            )
          `,
        }}
      />

      {/* Inner card background container */}
      <div className={`rounded-[30px] p-6 flex flex-col w-full h-full relative z-10 overflow-hidden ${innerClassName.includes("bg-") ? "" : "bg-white"} ${innerClassName}`}>
        {/* Content */}
        <div className="relative z-20 w-full h-full flex flex-col">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
