import { NextRequest, NextResponse } from "next/server";
import { getVerses } from "@/lib/quran-data";

const MAX_RESULTS = 50;

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim();
    if (!q || q.length < 2) {
      return NextResponse.json(
        { error: "Query 'q' required (min 2 characters)" },
        { status: 400 }
      );
    }
    const lower = q.toLowerCase();
    const results: { surah: number; ayah: number; verse: any }[] = [];
    for (let s = 1; s <= 114; s++) {
      const verses = getVerses(s);
      for (const v of verses) {
        const match =
          v.translation.toLowerCase().includes(lower) ||
          v.arabic_text.includes(q);
        if (match) {
          results.push({
            surah: s,
            ayah: Number(v.aya),
            verse: v,
          });
          if (results.length >= MAX_RESULTS) break;
        }
      }
      if (results.length >= MAX_RESULTS) break;
    }
    return NextResponse.json({ query: q, total: results.length, results });
  } catch (error) {
    console.error("Quran search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
