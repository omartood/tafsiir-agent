"use client";

import { useRef, useState } from "react";
import { Download, Share2, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { cn } from "@/lib/utils";

interface VerseCardGeneratorProps {
  arabic: string;
  somali: string;
  reference: string;
}

export function VerseCardGenerator({ arabic, somali, reference }: VerseCardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Download the image
      const link = document.createElement("a");
      link.download = `verse-${reference.replace(":", "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
      setShowCard(false);
    }
  };

  const shareImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Convert to blob
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `verse-${reference.replace(":", "-")}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Qur'aan ${reference}`,
          text: somali.substring(0, 100),
        });
      } else {
        // Fallback to download
        await generateImage();
      }
    } catch (error) {
      console.error("Failed to share image:", error);
    } finally {
      setIsGenerating(false);
      setShowCard(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowCard(true)}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
          "bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        )}
      >
        <Share2 size={14} />
        Wadaag
      </button>

      {showCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-2xl p-6 max-w-lg w-full space-y-4">
            {/* Preview Card */}
            <div
              ref={cardRef}
              className="w-full aspect-square bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-2xl p-8 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-100">Tafsiir AI</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-800 px-3 py-1 rounded-full">
                  {reference}
                </span>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                  <p className="text-center font-arabic text-3xl leading-[2.2] text-emerald-900 dark:text-emerald-100" dir="rtl">
                    {arabic}
                  </p>
                </div>

                <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed text-center">
                  {somali.length > 200 ? somali.substring(0, 200) + "..." : somali}
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Qur'aanka Kariimka ah • Tarjumada Af-Soomaaliga
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCard(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm font-medium"
              >
                Xir
              </button>
              <button
                onClick={generateImage}
                disabled={isGenerating}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl",
                  "bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
                )}
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                Soo Dejiso
              </button>
              <button
                onClick={shareImage}
                disabled={isGenerating}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl",
                  "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                )}
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
                Wadaag
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
