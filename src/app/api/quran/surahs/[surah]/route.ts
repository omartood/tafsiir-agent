import { NextRequest, NextResponse } from "next/server";
import { getVerses, getVerse } from "@/lib/quran-data";
import { surahList } from "@/lib/surah-meta";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ surah: string }> }
) {
  try {
    const { surah: surahParam } = await params;
    const surahNum = Number(surahParam);
    const ayahParam = req.nextUrl.searchParams.get("ayah");

    if (surahNum < 1 || surahNum > 114 || Number.isNaN(surahNum)) {
      return NextResponse.json(
        { error: "Surah number must be between 1 and 114" },
        { status: 400 }
      );
    }

    const meta = surahList.find((s) => s.number === surahNum);

    // Single ayah
    if (ayahParam !== null && ayahParam !== undefined && ayahParam !== "") {
      const ayahNum = Number(ayahParam);
      const verse = getVerse(surahNum, ayahNum);
      if (!verse) {
        return NextResponse.json({ error: "Ayah not found" }, { status: 404 });
      }
      return NextResponse.json({
        surah: surahNum,
        surahName: meta?.nameTransliteration,
        ayah: ayahNum,
        verse,
      });
    }

    // Full surah
    const verses = getVerses(surahNum);
    if (!verses.length) {
      return NextResponse.json({ error: "Surah not found" }, { status: 404 });
    }
    return NextResponse.json({
      surah: surahNum,
      surahName: meta?.nameTransliteration,
      surahNameArabic: meta?.name,
      ayahCount: meta?.ayahCount,
      type: meta?.type,
      verses,
    });
  } catch (error) {
    console.error("Quran surah API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
