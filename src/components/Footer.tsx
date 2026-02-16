"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 py-12">
      <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-white font-bold text-xs">PP</span>
          </div>
          <p>© {new Date().getFullYear()} PricePilot. AI-Powered Price Intelligence.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">API</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
