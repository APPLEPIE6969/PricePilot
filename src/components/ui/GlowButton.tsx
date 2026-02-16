"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface GlowButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export function GlowButton({
  children,
  className,
  variant = "primary",
  isLoading = false,
  ...props
}: GlowButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20",
    secondary: "bg-white/10 hover:bg-white/20 border border-white/10 shadow-white/5",
    danger: "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-500/20",
    ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border-transparent",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg text-white",
        variants[variant],
        isLoading && "opacity-80 cursor-not-allowed",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
      {variant === "primary" && !isLoading && (
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-50" />
      )}
    </motion.button>
  );
}
