import { NextRequest, NextResponse } from "next/server";
import { getVerses, getVerse } from "@/lib/quran-data";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://tafsiir.vercel.app";

export async function GET(req: NextRequest) {
  try {
    const surah = req.nextUrl.searchParams.get("surah");
    const ayah = req.nextUrl.searchParams.get("ayah");

    // No params: return API info
    if (!surah) {
      return NextResponse.json({
        name: "Tafsiir Quran API",
        version: "1.0",
        description: "Public API for the Holy Quran with Somali translation (tarjumaad af Soomaaliga).",
        baseUrl: `${BASE}/api/quran`,
        endpoints: [
          {
            path: "GET /api/quran",
            description: "API info (this response) or get verses: ?surah=1 or ?surah=1&ayah=2",
          },
          {
            path: "GET /api/quran/surahs",
            description: "List all 114 surahs with metadata",
          },
          {
            path: "GET /api/quran/surahs/[surah]",
            description: "Get all verses of a surah. Optional ?ayah=N for single verse",
          },
        ],
        usage: {
          listSurahs: `${BASE}/api/quran/surahs`,
          getSurah: `${BASE}/api/quran?surah=1`,
          getAyah: `${BASE}/api/quran?surah=1&ayah=2`,
          getSurahAlt: `${BASE}/api/quran/surahs/1`,
          getAyahAlt: `${BASE}/api/quran/surahs/1?ayah=2`,
        },
      });
    }

    const surahNum = Number(surah);
    if (surahNum < 1 || surahNum > 114) {
      return NextResponse.json({ error: "Surah number must be between 1 and 114" }, { status: 400 });
    }

    // Single ayah
    if (ayah !== null && ayah !== undefined && ayah !== "") {
      const ayahNum = Number(ayah);
      const verse = getVerse(surahNum, ayahNum);
      if (!verse) {
        return NextResponse.json({ error: "Ayah not found" }, { status: 404 });
      }
      return NextResponse.json({
        surah: surahNum,
        ayah: ayahNum,
        verse,
      });
    }

    // Full surah
    const verses = getVerses(surahNum);
    if (!verses.length) {
      return NextResponse.json({ error: "Surah not found" }, { status: 404 });
    }
    return NextResponse.json({ surah: surahNum, verses });
  } catch (error) {
    console.error("Quran API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
