"use client";
import { useState } from "react";
import XrayAnnotator from "./XrayAnnotator";

export default function XrayPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // عرض أولي للصورة
      setResult(null);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // الباك إند بتاعك على بورت 8000
      const response = await fetch("http://localhost:8000/ai-analysis/xray", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        نظام تحليل الأشعة الذكي - EGhealthcare
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* الجانب الأيسر: رفع الصورة */}
        <div className="space-y-4">
          <div className="border-2 border-dashed p-6 rounded-lg text-center bg-gray-50">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500"
            />
            {previewUrl && !result && (
              <img src={previewUrl} className="mt-4 max-h-64 mx-auto rounded" />
            )}
          </div>

          <button
            onClick={uploadAndAnalyze}
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "جاري التحليل..." : "بدء التحليل الفوري"}
          </button>
        </div>

        {/* الجانب الأيمن: النتائج */}
        <div className="bg-white p-6 rounded-lg shadow border">
          {result ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                النتيجة المكتشفة:
              </h2>
              <XrayAnnotator
                imageUrl={previewUrl!}
                predictions={result.predictions}
              />
              <div className="p-4 bg-blue-50 rounded">
                <p className="text-lg">
                  التشخيص الأولي:{" "}
                  <span className="font-bold">{result.top}</span>
                </p>
                <p>نسبة التأكد: {(result.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              ارفع صورة الأشعة لبدء التحليل التلقائي
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
