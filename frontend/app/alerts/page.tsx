"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertBadge } from "@/components/cards/AlertBadge";
import { LoadingSkeleton } from "@/components/cards/LoadingSkeleton";
import { useAlerts, useGenerateAlerts } from "@/lib/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Clock, BellRing, Play, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/lib/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function AlertsPage() {
  const { data: alerts, isLoading, refetch } = useAlerts();
  const generateMutation = useGenerateAlerts();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  const handleGenerate = async () => {
    await generateMutation.mutateAsync();
    refetch();
  };

  const handleProcessAlerts = async () => {
    setProcessing(true);
    try {
      // Generate alerts from operational logs
      await api.generateAlertsFromLogs();
      
      // Refresh alerts list
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      refetch();
      
      alert("Alerts generated successfully from operational logs!");
    } catch (error) {
      console.error("Alert generation failed:", error);
      alert("Alert generation failed. Please check console for details.");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSkeleton />
      </AppLayout>
    );
  }

  const sortedAlerts = [...(alerts || [])].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (
      (severityOrder[a.severity as keyof typeof severityOrder] ?? 99) -
      (severityOrder[b.severity as keyof typeof severityOrder] ?? 99)
    );
  });

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and resolve real-time safety incidents.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="bg-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleProcessAlerts}
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
                Generate Alerts from Logs
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Alerts Timeline */}
      <div className="space-y-4 max-w-4xl">
        <AnimatePresence>
          {sortedAlerts.map((alert, index) => (
            <motion.div
              key={alert.alert_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className={`w-full sm:w-2 ${
                    alert.severity === 'HIGH' || alert.severity === 'CRITICAL' ? 'bg-red-500' : 
                    alert.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <AlertBadge
                              severity={alert.severity}
                              pulsing={alert.severity === "HIGH" || alert.severity === "CRITICAL"}
                            />
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                              {alert.type}
                            </span>
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-900 mt-2">
                            {alert.message}
                          </CardTitle>
                        </div>
                        {alert.resolved && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Detected {formatDistanceToNow(new Date(alert.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedAlerts.length === 0 && (
          <Card className="bg-gray-50 border-dashed border-2 border-gray-200 shadow-none">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <BellRing className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Active Alerts</h3>
              <p className="text-muted-foreground">Everything is running smoothly. Great job!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
