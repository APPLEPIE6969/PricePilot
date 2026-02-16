"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "BUY" | "WAIT" | "HIGH" | "NEW";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    BUY: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      glow: "shadow-emerald-500/20",
      label: "BUY NOW",
    },
    WAIT: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      glow: "shadow-amber-500/20",
      label: "WAIT",
    },
    HIGH: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      glow: "shadow-red-500/20",
      label: "PRICE HIGH",
    },
    NEW: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      glow: "shadow-blue-500/20",
      label: "NEW",
    },
  };

  const style = styles[status] || styles.WAIT;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg",
        style.bg,
        style.text,
        style.border,
        style.glow
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
      {style.label}
    </motion.span>
  );
}
