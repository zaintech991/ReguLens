"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2, Clock } from "lucide-react";

// Mock data for the heatmap
const RISK_DATA = [
  { id: "A1", risk: 12, label: "Plant A - North" },
  { id: "A2", risk: 45, label: "Plant A - South" },
  { id: "B1", risk: 88, label: "Plant B - Main" },
  { id: "B2", risk: 23, label: "Plant B - East" },
  { id: "C1", risk: 5, label: "Plant C - West" },
  { id: "C2", risk: 67, label: "Plant C - Core" },
];

const ACTIVITY_DATA = [
  { id: 1, action: "System Audit", user: "System", time: "2m ago", status: "success" },
  { id: 2, action: "Alert Resolved", user: "Sarah W.", time: "15m ago", status: "success" },
  { id: 3, action: "Threshold Exceeded", user: "Sensor 4", time: "1h ago", status: "warning" },
  { id: 4, action: "Report Generated", user: "John D.", time: "2h ago", status: "success" },
  { id: 5, action: "Login Failed", user: "Unknown", time: "3h ago", status: "error" },
];

export function RiskHeatmap() {
  return (
    <Card className="border border-gray-100 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">Facility Risk Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {RISK_DATA.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.label}</span>
                <span>{item.risk}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${
                    item.risk > 75 ? "bg-red-500" : 
                    item.risk > 40 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.risk}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivity() {
  return (
    <Card className="border border-gray-100 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">Recent Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ACTIVITY_DATA.map((item) => (
            <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
              <div className={`p-2 rounded-full ${
                item.status === "success" ? "bg-emerald-50 text-emerald-600" :
                item.status === "warning" ? "bg-amber-50 text-amber-600" :
                "bg-red-50 text-red-600"
              }`}>
                {item.status === "success" ? <CheckCircle2 className="h-4 w-4" /> :
                 item.status === "warning" ? <AlertCircle className="h-4 w-4" /> :
                 <Activity className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.user}</p>
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ComplianceGauge({ score }: { score: number }) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];
  const COLORS = ["#5b4cea", "#f3f4f6"];

  return (
    <Card className="border border-gray-100 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">Overall Health Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-0">
        <div className="h-[180px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={180}
                endAngle={0}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
            <div className="text-4xl font-bold text-gray-900">{score}%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Healthy</div>
          </div>
        </div>
        <p className="text-sm text-center text-muted-foreground mt-[-20px]">
          Your facility is performing above industry average (94%).
        </p>
      </CardContent>
    </Card>
  );
}

