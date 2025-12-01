"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface DocumentUploadProps {
  onUploadComplete?: () => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileSelect = (file: File) => {
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      setUploadedFile(file);
      setUploadSuccess(false);
    } else {
      alert("Please upload a .txt file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      const result = await api.uploadDocument(uploadedFile);
      
      // Force refresh all data
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["compliance-trends"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      
      // Force refetch immediately
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["documents"] }),
        queryClient.refetchQueries({ queryKey: ["compliance-trends"] }),
      ]);
      
      setUploadSuccess(true);
      setUploadedFile(null);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        {uploadSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Uploaded Successfully!</h3>
            <p className="text-sm text-muted-foreground">Your document has been processed and analytics are being generated.</p>
          </motion.div>
        ) : uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload & Analyze
                </>
              )}
            </Button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`text-center transition-all ${
              isDragging ? "scale-105" : ""
            }`}
          >
            <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${
              isDragging ? "bg-primary/20" : "bg-primary/10"
            }`}>
              <Upload className={`w-10 h-10 transition-colors ${
                isDragging ? "text-primary" : "text-primary/60"
              }`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Compliance Document
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Drag and drop your document here, or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileInput}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="bg-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Select File
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported format: .txt files
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

