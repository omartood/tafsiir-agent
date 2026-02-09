"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface VerseOfTheDayData {
  date: string;
  surah: number;
  surahName: string;
  ayah: number;
  verse: { arabic_text: string; translation: string };
}

export function VerseOfTheDay() {
  const [data, setData] = useState<VerseOfTheDayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quran/verse-of-the-day")
      .then((r) => r.json())
      .then((d) => {
        if (d.verse) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return null;

  return (
    <Link
      href={`/quran/${data.surah}?ayah=${data.ayah}`}
      className="block rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm p-5 transition-all hover:bg-card/70 hover:border-primary/20 hover:shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-primary" />
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          Aayadda Maanta
        </span>
      </div>
      <p className="font-arabic text-xl sm:text-2xl text-right text-foreground/90 leading-relaxed mb-3" dir="rtl">
        {data.verse.arabic_text}
      </p>
      <p className="text-sm text-muted-foreground/90 line-clamp-2">
        {data.verse.translation}
      </p>
      <p className="text-xs text-muted-foreground/60 mt-2">
        Suuurad {data.surahName} • Aayad {data.ayah}
      </p>
    </Link>
  );
}
