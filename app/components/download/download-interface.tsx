"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Zap, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFileContext } from "@/app/context/FileContext";

interface ProcessedFile {
  file_id: string;
  output_filename: string;
  summary: string;
  processed_at: string;
}

interface OutputFile {
  filename: string;
  size: number;
  created: string;
}

export default function DownloadInterface() {
  const { selectedFileId, selectedFileName } = useFileContext();
  const [fileId, setFileId] = useState(selectedFileId || "");
  const [instructions, setInstructions] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [availableFiles, setAvailableFiles] = useState<OutputFile[]>([]);
  const { toast } = useToast();

  // Carregar arquivos disponíveis
  useEffect(() => {
    fetchAvailableFiles();
  }, []);

  const fetchAvailableFiles = async () => {
    try {
      const res = await fetch("/api/download/list");
      if (res.ok) {
        const data = await res.json();
        setAvailableFiles(data.files || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const processFile = async () => {
    if (!fileId.trim()) {
      toast({
        title: "File ID required",
        description: "Enter a file ID",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const res = await fetch("/api/download/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: fileId,
          processing_instructions: instructions || undefined,
        }),
      });
      if (!res.ok) throw new Error("Processing failed");

      const result: ProcessedFile = await res.json();
      setProcessedFiles((prev) => [result, ...prev]);
      toast({
        title: "Processing completed",
        description: "File is ready for download",
      });

      await fetchAvailableFiles();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Processing failed",
        description: err.message || "Try again",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadFile = async (filename: string) => {
    try {
      const res = await fetch(`/api/download/file/${filename}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: `${filename} is being downloaded`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Download failed",
        description: err.message || "Try again",
        variant: "destructive",
      });
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleString();
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Process File */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Process File
          </CardTitle>
          <CardDescription>
            Enter a file ID to process it with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>File ID</Label>
            <Input
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              placeholder={
                selectedFileName
                  ? `Using: ${selectedFileName}`
                  : "Enter file ID"
              }
              disabled={processing}
            />
          </div>
          <div className="space-y-2">
            <Label>Instructions (Optional)</Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              disabled={processing}
            />
          </div>
          <Button
            onClick={processFile}
            disabled={processing || !fileId.trim()}
            className="w-full"
          >
            {processing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Process File
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recently Processed */}
      {processedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Recently Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{file.output_filename}</p>
                    <p className="text-sm text-muted-foreground">
                      Processed: {formatDate(file.processed_at)}
                    </p>
                  </div>
                  <Button
                    onClick={() => downloadFile(file.output_filename)}
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Files */}
      {availableFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Available Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableFiles.map((file) => (
                <div
                  key={file.filename}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{file.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {formatDate(file.created)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(file.filename)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No files fallback */}
      {availableFiles.length === 0 && processedFiles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Download className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">No processed files yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload and process a file to see download options here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
