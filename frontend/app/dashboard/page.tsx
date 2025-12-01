"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardGrid } from "@/components/cards/DashboardGrid";
import { ComplianceChart } from "@/components/charts/ComplianceChart";
import { RiskHeatmap, RecentActivity, ComplianceGauge } from "@/components/charts/AnalyticsWidgets";
import { LoadingSkeleton } from "@/components/cards/LoadingSkeleton";
import { DocumentUpload } from "@/components/ui/DocumentUpload";
import { Card, CardContent } from "@/components/ui/card";
import { useComplianceTrends, useAlerts, useDocuments } from "@/lib/hooks";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Share2, Play, Loader2, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardPage() {
  const { data: trendsData, isLoading: trendsLoading } = useComplianceTrends(30);
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: documents, isLoading: documentsLoading } = useDocuments();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  const handleRunPipeline = async () => {
    setProcessing(true);
    try {
      const result = await api.runFullPipeline(true, 10, 50);
      
      // Refresh all data
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["compliance-trends"] });
      
      alert(`Pipeline completed! Generated ${result.documents_generated} documents, analyzed ${result.documents_analyzed} documents, and created ${result.alerts_generated} alerts.`);
    } catch (error) {
      console.error("Pipeline failed:", error);
      alert("Pipeline processing failed. Please check console for details.");
    } finally {
      setProcessing(false);
    }
  };

  if (trendsLoading || alertsLoading || documentsLoading) {
    return (
      <AppLayout>
        <LoadingSkeleton />
      </AppLayout>
    );
  }

  const averageCompliance = trendsData?.average_compliance || 0;
  const totalViolations = trendsData?.total_violations || 0;
  const totalAlerts = alerts?.length || 0;
  const totalDocuments = documents?.length || 0;

  // Show empty state if no documents
  const hasData = totalDocuments > 0;

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Executive Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time insights into operational compliance and safety metrics.
          </p>
        </div>
        <div className="flex gap-3">
          {hasData && (
            <Button
              onClick={handleRunPipeline}
              disabled={processing}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run AI Pipeline
                </>
              )}
            </Button>
          )}
          {hasData && (
            <>
              <Button variant="outline" className="bg-white">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="bg-white">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {!hasData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to ReguLens
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Upload your first compliance document to start generating analytics and insights.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Or initialize with sample documents to explore the system.
            </p>
          </div>
          <div className="space-y-4">
            <DocumentUpload
              onUploadComplete={() => {
                // Data will refresh automatically via query invalidation
              }}
            />
            <div className="text-center">
              <Button
                onClick={async () => {
                  setProcessing(true);
                  try {
                    await api.initializeSamples(20);
                    queryClient.invalidateQueries({ queryKey: ["documents"] });
                    queryClient.invalidateQueries({ queryKey: ["compliance-trends"] });
                    await Promise.all([
                      queryClient.refetchQueries({ queryKey: ["documents"] }),
                      queryClient.refetchQueries({ queryKey: ["compliance-trends"] }),
                    ]);
                    alert("Sample documents initialized! Analytics are being generated.");
                  } catch (error) {
                    console.error("Initialization failed:", error);
                    alert("Failed to initialize samples. Please try again.");
                  } finally {
                    setProcessing(false);
                  }
                }}
                disabled={processing}
                variant="outline"
                className="bg-white"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Initialize with Sample Documents
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Upload Section */}
          <DocumentUpload />

          {/* Top Row: Key Metrics */}
          <DashboardGrid
            averageCompliance={averageCompliance}
            totalViolations={totalViolations}
            totalAlerts={totalAlerts}
            totalDocuments={totalDocuments}
          />

          {/* Main Content: Large Charts on Left, Widgets on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Side: Large Charts (4/5 width) */}
            <div className="lg:col-span-4 space-y-6">
              {trendsData && trendsData.trends && trendsData.trends.length > 0 ? (
                <ComplianceChart
                  trends={trendsData.trends}
                  violationsByCategory={trendsData.violations_by_category || {}}
                />
              ) : (
                <Card className="border border-gray-100 shadow-sm bg-white/80 backdrop-blur-sm">
                  <CardContent className="flex items-center justify-center h-[450px]">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">No compliance data available yet.</p>
                      <p className="text-sm text-muted-foreground">Upload documents to see trends and violations.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Side: Widgets (1/5 width) */}
            <div className="lg:col-span-1 space-y-6">
              <ComplianceGauge score={Math.round(averageCompliance)} />
              <RiskHeatmap />
            </div>
          </div>

          {/* Bottom Row: Additional Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <div className="lg:col-span-1">
              {/* Additional metric or widget can go here */}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
