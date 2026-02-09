import { NextRequest, NextResponse } from "next/server";
import { loadQuran } from "@/lib/quran-data";
import { surahList } from "@/lib/surah-meta";

/** Deterministic "random" verse for a given date (same verse all day). */
export async function GET(req: NextRequest) {
  try {
    const dateParam = req.nextUrl.searchParams.get("date");
    const dateStr = dateParam || new Date().toISOString().slice(0, 10);
    const seed = dateStr.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
    const data = loadQuran();
    const totalSurahs = 114;
    const surahIndex = seed % totalSurahs;
    const meta = surahList[surahIndex];
    if (!meta) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const surahNum = meta.number;
    const surahData = data[String(surahNum)];
    const verses = Array.isArray(surahData) ? surahData : (surahData?.result ?? []);
    if (!verses.length) {
      return NextResponse.json({ error: "No verses" }, { status: 404 });
    }
    const ayahIndex = (seed * 31) % verses.length;
    const verse = verses[ayahIndex];
    return NextResponse.json({
      date: dateStr,
      surah: surahNum,
      surahName: meta.nameTransliteration,
      surahNameArabic: meta.name,
      ayah: Number(verse.aya),
      verse,
    });
  } catch (error) {
    console.error("Verse of the day API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
