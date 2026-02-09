"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { IslamicPattern } from "@/components/islamic-decorations";
import { surahList } from "@/lib/surah-meta";
import { getBookmarks, addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks";
import { markSurahRead } from "@/lib/reading-progress";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, BookOpen, Copy, Heart, Download, Type } from "lucide-react";

const FONT_KEY = "tafsiir_surah_font";
const DEFAULT_ARABIC = 1.25;
const DEFAULT_TRANS = 1;

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
  const searchParams = useSearchParams();
  const surahNum = Number(params.surah);
  const highlightAyah = searchParams.get("ayah") ? Number(searchParams.get("ayah")) : null;

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [arabicScale, setArabicScale] = useState(DEFAULT_ARABIC);
  const [transScale, setTransScale] = useState(DEFAULT_TRANS);
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const meta = surahList.find((s) => s.number === surahNum);
  const prevSurah = surahNum > 1 ? surahList[surahNum - 2] : null;
  const nextSurah = surahNum < 114 ? surahList[surahNum] : null;

  const refreshBookmarks = useCallback(() => {
    const list = getBookmarks();
    const map: Record<string, boolean> = {};
    list.forEach((b) => {
      map[`${b.surah}-${b.ayah}`] = true;
    });
    setBookmarks(map);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const s = localStorage.getItem(FONT_KEY);
        if (s) {
          const [a, t] = JSON.parse(s);
          if (typeof a === "number") setArabicScale(a);
          if (typeof t === "number") setTransScale(t);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    async function loadVerses() {
      try {
        const res = await fetch("/api/quran?surah=" + surahNum);
        const data = await res.json();
        const raw = data.verses;
        setVerses(Array.isArray(raw) ? raw : []);
        markSurahRead(surahNum);
        refreshBookmarks();
      } catch {
        setVerses([]);
      } finally {
        setLoading(false);
      }
    }
    if (surahNum >= 1 && surahNum <= 114) loadVerses();
    else setLoading(false);
  }, [surahNum, refreshBookmarks]);

  useEffect(() => {
    if (!highlightAyah || verses.length === 0) return;
    const el = verseRefs.current[highlightAyah];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightAyah, verses.length]);

  const handleCopy = (verse: Verse) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/quran/${verse.sura}?ayah=${verse.aya}` : "";
    const text = `${verse.arabic_text}\n\n${verse.translation}\n\n${url}`;
    navigator.clipboard.writeText(text);
  };

  const handleBookmark = (verse: Verse) => {
    const key = `${verse.sura}-${verse.aya}`;
    if (bookmarks[key]) {
      removeBookmark(Number(verse.sura), Number(verse.aya));
    } else {
      addBookmark({
        surah: Number(verse.sura),
        ayah: Number(verse.aya),
        arabic_text: verse.arabic_text,
        translation: verse.translation,
        surahName: meta?.nameTransliteration,
      });
    }
    refreshBookmarks();
    if (typeof window !== "undefined") window.dispatchEvent(new Event("tafsiir-bookmarks-changed"));
  };

  const saveFontPrefs = (a: number, t: number) => {
    localStorage.setItem(FONT_KEY, JSON.stringify([a, t]));
  };

  const handleExport = () => {
    const lines: string[] = [meta?.nameTransliteration || `Surah ${surahNum}`, ""];
    verses.forEach((v) => {
      lines.push(v.arabic_text);
      lines.push(v.translation);
      lines.push("---");
    });
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `surah-${surahNum}-${meta?.nameTransliteration || "quran"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      <div className="print:hidden">
        <IslamicPattern />
        <Navbar />
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 print:py-4">
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
            <h1 className="font-arabic text-5xl sm:text-6xl text-gold drop-shadow-sm" style={{ fontSize: `${arabicScale}rem` }}>
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

        {/* Toolbar: font size + export */}
        <div className="print:hidden flex flex-wrap items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Type size={16} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Qoraalka:</span>
            <button
              onClick={() => {
                const n = Math.max(0.75, arabicScale - 0.25);
                setArabicScale(n);
                saveFontPrefs(n, transScale);
              }}
              className="w-8 h-8 rounded-lg border border-border/50 text-sm font-bold hover:bg-muted/50"
            >
              −
            </button>
            <span className="text-xs w-8 text-center">{Math.round(arabicScale * 100)}%</span>
            <button
              onClick={() => {
                const n = Math.min(2, arabicScale + 0.25);
                setArabicScale(n);
                saveFontPrefs(n, transScale);
              }}
              className="w-8 h-8 rounded-lg border border-border/50 text-sm font-bold hover:bg-muted/50"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Tarjumaad:</span>
            <button
              onClick={() => {
                const n = Math.max(0.75, transScale - 0.25);
                setTransScale(n);
                saveFontPrefs(arabicScale, n);
              }}
              className="w-8 h-8 rounded-lg border border-border/50 text-sm font-bold hover:bg-muted/50"
            >
              −
            </button>
            <span className="text-xs w-8 text-center">{Math.round(transScale * 100)}%</span>
            <button
              onClick={() => {
                const n = Math.min(1.5, transScale + 0.25);
                setTransScale(n);
                saveFontPrefs(arabicScale, n);
              }}
              className="w-8 h-8 rounded-lg border border-border/50 text-sm font-bold hover:bg-muted/50"
            >
              +
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 text-sm font-medium hover:bg-muted/50"
          >
            <Download size={16} />
            Soo deji .txt
          </button>
        </div>

        {surahNum !== 9 && surahNum !== 1 && (
          <div className="text-center mb-8">
            <p className="bismillah text-2xl sm:text-3xl text-gold/80 select-none" style={{ fontSize: `${arabicScale}rem` }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        )}

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
            {verses.map((verse) => {
              const ayahNum = Number(verse.aya);
              const highlighted = highlightAyah === ayahNum;
              const bookmarked = bookmarks[`${verse.sura}-${verse.aya}`];
              return (
                <div
                  key={verse.id}
                  ref={(el) => { verseRefs.current[ayahNum] = el; }}
                  className={cn(
                    "group rounded-2xl border backdrop-blur-sm p-5 sm:p-6 transition-all",
                    highlighted
                      ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20"
                      : "border-border/50 bg-card/40 hover:bg-card/70 hover:border-primary/10"
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {verse.aya}
                    </span>
                    <div className="print:hidden flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(verse)}
                        className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                        title="Copy"
                        aria-label="Copy verse"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleBookmark(verse)}
                        className={cn(
                          "p-2 rounded-lg hover:bg-muted/50",
                          bookmarked ? "text-red-500" : "text-muted-foreground"
                        )}
                        title={bookmarked ? "Remove bookmark" : "Bookmark"}
                        aria-label="Bookmark verse"
                      >
                        <Heart size={16} fill={bookmarked ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  <p
                    className="font-arabic leading-loose text-foreground/90 text-right mb-4 select-all"
                    dir="rtl"
                    style={{ fontSize: `${arabicScale}rem` }}
                  >
                    {verse.arabic_text}
                  </p>

                  <p
                    className="text-muted-foreground leading-relaxed select-all"
                    style={{ fontSize: `${transScale}rem` }}
                  >
                    {verse.translation}
                  </p>

                  {verse.footnotes && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <p className="text-xs text-muted-foreground/60 leading-relaxed">
                        {verse.footnotes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="print:hidden flex items-center justify-between mt-12 pt-6 border-t border-border/40">
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
