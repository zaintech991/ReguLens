"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/cards/LoadingSkeleton";
import { useDocuments, useAnalyzeDocument } from "@/lib/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Sparkles, X, Filter, Play, Loader2, AlertTriangle } from "lucide-react";
import type { DocumentAnalysis } from "@/lib/api";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

export default function DocumentsPage() {
  const { data: documents, isLoading } = useDocuments();
  const analyzeMutation = useAnalyzeDocument();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysis | null>(null);
  const [processing, setProcessing] = useState(false);

  const categories = Array.from(new Set(documents?.map((doc) => doc.category) || []));

  const filteredDocuments = documents?.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAnalyze = async (documentId: string) => {
    try {
      const result = await analyzeMutation.mutateAsync(documentId);
      setAnalysisResult(result);
      setSelectedDocument(documentId);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleProcessAll = async () => {
    setProcessing(true);
    try {
      // First generate new synthetic data
      await api.generateSyntheticData(10, 50);
      
      // Then analyze all documents
      await api.analyzeAllDocuments();
      
      // Refresh documents list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      
      alert("Processing complete! New documents generated and analyzed.");
    } catch (error) {
      console.error("Processing failed:", error);
      alert("Processing failed. Please check console for details.");
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

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Documents
          </h1>
          <p className="text-muted-foreground">
            Manage and analyze your regulatory documents with AI.
          </p>
        </div>
        <Button
          onClick={handleProcessAll}
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
              Generate & Process Data
            </>
          )}
        </Button>
      </motion.div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Filter className="h-4 w-4 text-muted-foreground mr-1" />
          <Button
            variant={selectedCategory === null ? "secondary" : "ghost"}
            onClick={() => setSelectedCategory(null)}
            size="sm"
            className="rounded-full"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDocuments?.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white h-full flex flex-col group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">{doc.category}</Badge>
                    <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary/10 transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {doc.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-500 mt-2">
                    {doc.body}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end mt-4">
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs text-muted-foreground">
                      {new Date(doc.published_at).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
                      onClick={() => handleAnalyze(doc.id)}
                      disabled={analyzeMutation.isPending}
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Analysis Modal */}
      <AnimatePresence>
        {analysisResult && selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setAnalysisResult(null);
              setSelectedDocument(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-gray-100"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">AI Analysis Results</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setAnalysisResult(null);
                    setSelectedDocument(null);
                  }}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Compliance Score</h3>
                    <div className="text-4xl font-bold text-primary">
                      {analysisResult.compliance_score}%
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Risk Assessment</h3>
                    <Badge
                      className={`px-4 py-1 text-sm ${
                        analysisResult.risk_level === "HIGH"
                          ? "bg-red-100 text-red-700 hover:bg-red-100"
                          : analysisResult.risk_level === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          : "bg-green-100 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {analysisResult.risk_level} Risk
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Extracted Rules
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {analysisResult.extracted_rules.map((rule, idx) => (
                      <div key={idx} className="p-4 border-b border-gray-100 last:border-0 flex gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p className="text-sm leading-relaxed">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {analysisResult.inconsistencies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Potential Issues
                    </h3>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl overflow-hidden">
                      {analysisResult.inconsistencies.map((inc, idx) => (
                        <div key={idx} className="p-4 border-b border-amber-100 last:border-0 flex gap-3 text-amber-800">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                          <p className="text-sm leading-relaxed">{inc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
