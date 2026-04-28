"use client";
import { useState } from "react";
import XrayAnnotator from "./XrayAnnotator";

type AnalysisResult = {
  predictions: {
    x: number;
    y: number;
    width: number;
    height: number;
    class: string;
    confidence: number;
  }[];
  top: string;
  confidence: number;
};

export default function XrayPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/ai-analysis/xray", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6 text-foreground">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          AI X-Ray Analysis
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Upload an X-ray image and get instant AI-assisted findings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Image Upload</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select a valid X-ray image file to begin.
            </p>
          </div>

          <div className="border-2 border-dashed border-border p-6 rounded-xl text-center bg-muted/40">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-accent-foreground file:font-medium hover:file:opacity-90"
            />
            {previewUrl && !result && (
              <img
                src={previewUrl}
                alt="X-ray preview"
                className="mt-4 max-h-72 mx-auto rounded-xl shadow-sm"
              />
            )}
          </div>

          <button
            onClick={uploadAndAnalyze}
            disabled={!file || loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-95 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Start Instant Analysis"}
          </button>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card p-6 min-h-[360px]">
          {result ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-card-foreground">Analysis Result</h2>
              <XrayAnnotator
                imageUrl={previewUrl!}
                predictions={result.predictions}
              />
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="w-full sm:w-auto bg-secondary text-secondary-foreground py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                View Larger
              </button>
              <div className="p-4 bg-accent/50 rounded-xl border border-border">
                <p className="text-lg">
                  Preliminary Diagnosis:{" "}
                  <span className="font-bold">{result.top}</span>
                </p>
                <p className="text-muted-foreground mt-1">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground italic text-center">
              Upload an X-ray image to start automatic analysis.
            </div>
          )}
        </div>
      </div>

      {isZoomOpen && previewUrl && result && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-card rounded-2xl border border-border p-4 md:p-6 overflow-auto">
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90"
            >
              Close
            </button>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Expanded X-Ray View
            </h3>
            <XrayAnnotator imageUrl={previewUrl} predictions={result.predictions} />
          </div>
        </div>
      )}
    </div>
  );
}
