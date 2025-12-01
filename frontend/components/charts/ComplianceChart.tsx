"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const COLORS = ["#5b4cea", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];

interface ComplianceTrend {
  date: string;
  compliance_percentage: number;
  violations: number;
  inspections: number;
}

interface ComplianceChartProps {
  trends: ComplianceTrend[];
  violationsByCategory: Record<string, number>;
}

export function ComplianceChart({ trends, violationsByCategory }: ComplianceChartProps) {
  const pieData = Object.entries(violationsByCategory || {}).map(([name, value]) => ({
    name,
    value,
  }));

  // Handle empty data
  if (!trends || trends.length === 0) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-gray-100 shadow-sm bg-white/80 backdrop-blur-sm h-full">
          <CardContent className="flex items-center justify-center h-[450px]">
            <div className="text-center">
              <p className="text-muted-foreground">No data available. Upload documents to see compliance trends.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm bg-white/80 backdrop-blur-sm h-full">
          <CardContent className="flex items-center justify-center h-[450px]">
            <div className="text-center">
              <p className="text-muted-foreground">No violations data available.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 font-sans">Compliance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5b4cea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5b4cea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12, fontFamily: "var(--font-jakarta)" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12, fontFamily: "var(--font-jakarta)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontFamily: "var(--font-jakarta)",
                      padding: "12px"
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }}/>
                  <Area
                    type="monotone"
                    dataKey="compliance_percentage"
                    stroke="#5b4cea"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCompliance)"
                    name="Compliance %"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 font-sans">Violations by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={8}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontFamily: "var(--font-jakarta)",
                      padding: "12px"
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontFamily: "var(--font-jakarta)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <Card className="border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 font-sans">Violations Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12, fontFamily: "var(--font-jakarta)" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12, fontFamily: "var(--font-jakarta)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontFamily: "var(--font-jakarta)",
                      padding: "12px"
                    }}
                    cursor={{ fill: "#f9fafb" }}
                  />
                  <Legend wrapperStyle={{ fontFamily: "var(--font-jakarta)", paddingTop: "20px" }}/>
                  <Bar 
                    dataKey="violations" 
                    fill="#ef4444" 
                    name="Violations" 
                    radius={[6, 6, 6, 6]}
                    maxBarSize={40}
                  />
                  <Bar 
                    dataKey="inspections" 
                    fill="#10b981" 
                    name="Inspections" 
                    radius={[6, 6, 6, 6]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
