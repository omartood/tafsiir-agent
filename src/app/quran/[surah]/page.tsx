"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { IslamicPattern } from "@/components/islamic-decorations";
import { surahList } from "@/lib/surah-meta";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface Verse {
  id: string;
  sura: string;
  aya: string;
  arabic_text: string;
  translation: string;
  footnotes: string;
}

export default function SurahDetailPage() {
  const params = useParams();
  const surahNum = Number(params.surah);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  const meta = surahList.find((s) => s.number === surahNum);
  const prevSurah = surahNum > 1 ? surahList[surahNum - 2] : null;
  const nextSurah = surahNum < 114 ? surahList[surahNum] : null;

  useEffect(() => {
    async function loadVerses() {
      try {
        const res = await fetch("/api/quran?surah=" + surahNum);
        const data = await res.json();
        const raw = data.verses;
        setVerses(Array.isArray(raw) ? raw : []);
      } catch {
        setVerses([]);
      } finally {
        setLoading(false);
      }
    }
    if (surahNum >= 1 && surahNum <= 114) {
      loadVerses();
    } else {
      setLoading(false);
    }
  }, [surahNum]);

  if (!meta) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
          <BookOpen size={48} className="mb-4 opacity-30" />
          <p className="text-lg">Surah lama helin</p>
          <Link href="/quran" className="mt-4 text-primary hover:underline text-sm">
            Ku noqo liiska suuradaha
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <IslamicPattern />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Surah Header */}
        <div className="text-center mb-10 space-y-3">
          <Link
            href="/quran"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ChevronLeft size={16} /> Suuradaha
          </Link>

          <div className="space-y-2">
            <span className={cn(
              "inline-block text-xs font-medium uppercase tracking-wider px-2 py-1 rounded",
              meta.type === "Makki" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"
            )}>
              {meta.type} • {meta.ayahCount} Aayah
            </span>
            <h1 className="font-arabic text-5xl sm:text-6xl text-gold drop-shadow-sm">
              {meta.name}
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient">
              {meta.nameTransliteration}
            </h2>
            <p className="text-muted-foreground/60 text-sm">
              Suuradda {meta.number}-aad ee Qur'aanka
            </p>
          </div>
        </div>

        {/* Bismillah (not for Surah 9) */}
        {surahNum !== 9 && surahNum !== 1 && (
          <div className="text-center mb-8">
            <p className="bismillah text-2xl sm:text-3xl text-gold/80 select-none">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        )}

        {/* Verses */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-card/40 border border-border/30 p-6 space-y-3">
                <div className="h-6 bg-muted/50 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-muted/30 rounded w-full" />
                <div className="h-4 bg-muted/30 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {verses.map((verse) => (
              <div
                key={verse.id}
                className="group rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 sm:p-6 transition-all hover:bg-card/70 hover:border-primary/10"
              >
                {/* Ayah number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                    {verse.aya}
                  </span>
                </div>

                {/* Arabic text */}
                <p className="font-arabic text-2xl sm:text-3xl leading-loose text-foreground/90 text-right mb-4 select-all" dir="rtl">
                  {verse.arabic_text}
                </p>

                {/* Translation */}
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {verse.translation}
                </p>

                {/* Footnotes */}
                {verse.footnotes && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <p className="text-xs text-muted-foreground/60 leading-relaxed">
                      {verse.footnotes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border/40">
          {prevSurah ? (
            <Link
              href={`/quran/${prevSurah.number}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <div>
                <p className="text-xs text-muted-foreground/50">Suuradda hore</p>
                <p className="font-medium">{prevSurah.nameTransliteration}</p>
              </div>
            </Link>
          ) : <div />}

          {nextSurah ? (
            <Link
              href={`/quran/${nextSurah.number}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group text-right"
            >
              <div>
                <p className="text-xs text-muted-foreground/50">Suuradda xigta</p>
                <p className="font-medium">{nextSurah.nameTransliteration}</p>
              </div>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}
