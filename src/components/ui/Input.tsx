"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface InputProps extends HTMLMotionProps<"input"> {
  label?: string;
  className?: string;
  error?: string;
}

export function Input({ label, className, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2 relative">
      {label && <label className="text-sm font-medium text-gray-400">{label}</label>}
      <div className="relative group">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          className={cn(
            "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none transition-all duration-300",
            "text-white placeholder:text-gray-500",
            "focus:border-blue-500/50 focus:bg-white/10 focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]",
            "hover:border-white/20",
            error && "border-red-500/50 focus:border-red-500/50",
            className
          )}
          {...props}
        />
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-md" />
      </div>
      {error && <span className="text-xs text-red-400 animate-pulse">{error}</span>}
    </div>
  );
}
