"use client";

import { Shield, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-base", container: "gap-2" },
    md: { icon: "w-8 h-8", text: "text-lg", container: "gap-2.5" },
    lg: { icon: "w-12 h-12", text: "text-2xl", container: "gap-3" },
  };

  const sizeClasses = sizes[size];

  return (
    <div className={`flex items-center ${sizeClasses.container} ${className}`}>
      <motion.div
        className={`relative ${sizeClasses.icon} bg-gradient-to-br from-primary via-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30`}
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Shield className="w-4/5 h-4/5" strokeWidth={2.5} />
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 shadow-md"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle2 className="w-2.5 h-2.5 text-white" fill="currentColor" />
        </motion.div>
      </motion.div>
      {showText && (
        <motion.span
          className={`font-bold ${sizeClasses.text} bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          ReguLens
        </motion.span>
      )}
    </div>
  );
}

