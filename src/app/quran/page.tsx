"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { IslamicPattern } from "@/components/islamic-decorations";
import { surahList } from "@/lib/surah-meta";
import { juzStarts } from "@/lib/juz";
import { getReadCount } from "@/lib/reading-progress";
import { cn } from "@/lib/utils";
import { Search, BookOpen, Layers } from "lucide-react";

export default function QuranPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Makki" | "Madani">("all");
  const [view, setView] = useState<"surahs" | "juz">("surahs");
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    setReadCount(getReadCount());
  }, []);

  const filtered = surahList.filter((s) => {
    const matchesSearch =
      s.name.includes(search) ||
      s.nameTransliteration.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString() === search;
    const matchesFilter = filter === "all" || s.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background relative">
      <IslamicPattern />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
            Qur'aanka Kariimka
          </h1>
          <p className="text-muted-foreground/80 text-lg max-w-xl mx-auto">
            Akhriso 114-ka Surah ee Qur'aanka oo leh tarjumaad af Soomaali ah.
          </p>
          {/* Reading progress */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-full max-w-xs h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary/80 rounded-full transition-all duration-300"
                style={{ width: `${(readCount / 114) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground/80">
              {readCount} / 114 surah akhriyey
            </p>
          </div>
        </div>

        {/* View toggle: Surahs | Juz */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setView("surahs")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              view === "surahs" ? "bg-primary/10 text-primary border border-primary/20" : "bg-card/60 text-muted-foreground border border-border/50 hover:bg-muted/50"
            )}
          >
            <BookOpen size={16} /> Suuradaha
          </button>
          <button
            onClick={() => setView("juz")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              view === "juz" ? "bg-primary/10 text-primary border border-primary/20" : "bg-card/60 text-muted-foreground border border-border/50 hover:bg-muted/50"
            )}
          >
            <Layers size={16} /> 30-ka Jus
          </button>
        </div>

        {/* Search & Filters (only for surahs view) */}
        {view === "surahs" && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Raadi suurad... (magac ama nambar)"
                className="w-full rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/40"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "Makki", "Madani"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    filter === f
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-card/60 text-muted-foreground border border-border/50 hover:bg-muted/50"
                  )}
                >
                  {f === "all" ? "Dhammaan" : f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Juz Grid */}
        {view === "juz" && (
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 mb-8">
            {juzStarts.map(([surahNum, ayahNum], i) => {
              const juzNum = i + 1;
              const meta = surahList.find((s) => s.number === surahNum);
              return (
                <Link
                  key={juzNum}
                  href={`/quran/${surahNum}?ayah=${ayahNum}`}
                  className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 p-4 transition-all hover:bg-card/80 hover:border-primary/20 hover:shadow-lg"
                >
                  <span className="text-2xl font-bold text-primary">{juzNum}</span>
                  <span className="text-xs text-muted-foreground mt-1">Jus {juzNum}</span>
                  <span className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {meta?.nameTransliteration} {ayahNum}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Surah Grid */}
        {view === "surahs" && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((surah) => (
            <Link
              key={surah.number}
              href={`/quran/${surah.number}`}
              className="group relative flex items-center gap-4 rounded-2xl border border-border/50 bg-card/40 p-4 transition-all duration-300 hover:bg-card/80 hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Number badge */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                {surah.number}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {surah.nameTransliteration}
                  </h3>
                  <span className="font-arabic text-base text-muted-foreground/70 shrink-0">
                    {surah.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded",
                    surah.type === "Makki" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"
                  )}>
                    {surah.type}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60">
                    {surah.ayahCount} aayadood
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}

        {view === "surahs" && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground/60">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Suurad lama helin</p>
            <p className="text-sm mt-1">Isku day raadin kale</p>
          </div>
        )}
      </main>
    </div>
  );
}
