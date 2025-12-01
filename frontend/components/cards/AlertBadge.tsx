"use client";

import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AlertBadgeProps {
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  className?: string;
  pulsing?: boolean;
}

export function AlertBadge({ severity, className, pulsing = false }: AlertBadgeProps) {
  const severityConfig = {
    LOW: {
      label: "Low",
      icon: Info,
      className: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm",
      iconColor: "text-blue-600",
    },
    MEDIUM: {
      label: "Medium",
      icon: AlertCircle,
      className: "bg-amber-50 text-amber-700 border-amber-200 shadow-sm",
      iconColor: "text-amber-600",
    },
    HIGH: {
      label: "High",
      icon: AlertTriangle,
      className: "bg-orange-50 text-orange-700 border-orange-200 shadow-sm",
      iconColor: "text-orange-600",
    },
    CRITICAL: {
      label: "Critical",
      icon: XCircle,
      className: "bg-red-50 text-red-700 border-red-200 shadow-sm",
      iconColor: "text-red-600",
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.div
      animate={pulsing && severity === "HIGH" ? {
        scale: [1, 1.02, 1],
        filter: ["drop-shadow(0 0 0px rgba(249, 115, 22, 0))", "drop-shadow(0 0 4px rgba(249, 115, 22, 0.3))", "drop-shadow(0 0 0px rgba(249, 115, 22, 0))"]
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Badge
        variant="outline"
        className={cn(
          "flex items-center gap-1.5 border px-2.5 py-1 font-medium rounded-md transition-colors",
          config.className,
          className
        )}
      >
        <Icon className={cn("h-3.5 w-3.5", config.iconColor)} />
        <span>{config.label}</span>
      </Badge>
    </motion.div>
  );
}
