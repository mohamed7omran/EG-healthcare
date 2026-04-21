"use client";
import { useEffect, useRef } from "react";

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

export default function XrayAnnotator({
  imageUrl,
  predictions,
}: {
  imageUrl: string;
  predictions: Prediction[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // ضبط أبعاد الكانفاس لتناسب الصورة الأصلية
      canvas.width = img.width;
      canvas.height = img.height;

      // رسم الصورة الأساسية
      ctx.drawImage(img, 0, 0);

      // رسم كل مربع راجع من الـ AI
      predictions.forEach((pred) => {
        // تحويل إحداثيات روبوفلو (السنتر) لإحداثيات رسم (الركن العلوي)
        const rectX = pred.x - pred.width / 2;
        const rectY = pred.y - pred.height / 2;

        // إعداد شكل المربع
        ctx.strokeStyle = "#ef4444"; // لون أحمر
        ctx.lineWidth = 4;
        ctx.strokeRect(rectX, rectY, pred.width, pred.height);

        // إضافة نص التشخيص
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 20px Arial";
        ctx.fillText(
          `${pred.class} (${(pred.confidence * 100).toFixed(0)}%)`,
          rectX,
          rectY > 20 ? rectY - 10 : rectY + 20,
        );
      });
    };
  }, [imageUrl, predictions]);

  return (
    <div className="relative inline-block w-full overflow-hidden rounded-lg border shadow-lg bg-black">
      <canvas ref={canvasRef} className="max-w-full h-auto mx-auto" />
    </div>
  );
}
