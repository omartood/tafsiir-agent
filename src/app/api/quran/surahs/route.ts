import { NextResponse } from "next/server";
import { surahList } from "@/lib/surah-meta";

export async function GET() {
  try {
    return NextResponse.json({
      total: 114,
      surahs: surahList.map((s) => ({
        number: s.number,
        name: s.name,
        nameTransliteration: s.nameTransliteration,
        ayahCount: s.ayahCount,
        type: s.type,
      })),
    });
  } catch (error) {
    console.error("Quran surahs API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
