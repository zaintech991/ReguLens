"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { ComplianceChart } from "@/components/charts/ComplianceChart";
import { LoadingSkeleton } from "@/components/cards/LoadingSkeleton";
import { useComplianceTrends } from "@/lib/hooks";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const { data: trendsData, isLoading } = useComplianceTrends(30);

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics Overview
        </h1>
        <p className="text-muted-foreground">
          Deep dive into compliance metrics and safety trends.
        </p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Safety Score
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">98.2%</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Incident Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0.4</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -12% decrease
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Time
            </CardTitle>
            <Activity className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12m</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average alert resolution
            </p>
          </CardContent>
        </Card>
      </div>

      {trendsData && (
        <ComplianceChart
          trends={trendsData.trends}
          violationsByCategory={trendsData.violations_by_category}
        />
      )}
    </AppLayout>
  );
}
