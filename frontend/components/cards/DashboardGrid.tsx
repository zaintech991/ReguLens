"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "./AnimatedNumber";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, CheckCircle, FileText } from "lucide-react";

interface DashboardGridProps {
  averageCompliance: number;
  totalViolations: number;
  totalAlerts: number;
  totalDocuments: number;
}

export function DashboardGrid({
  averageCompliance,
  totalViolations,
  totalAlerts,
  totalDocuments,
}: DashboardGridProps) {
  const cards = [
    {
      title: "Average Compliance",
      value: averageCompliance,
      suffix: "%",
      icon: TrendingUp,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Total Violations",
      value: totalViolations,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Active Alerts",
      value: totalAlerts,
      icon: CheckCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Documents",
      value: totalDocuments,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 bg-white/80 backdrop-blur-sm h-full group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-gray-900 transition-colors">
                  {card.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${card.bgColor} transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
                  <AnimatedNumber
                    value={card.value}
                    suffix={card.suffix}
                    decimals={card.suffix ? 1 : 0}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
