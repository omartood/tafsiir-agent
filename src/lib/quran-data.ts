import path from "path";
import fs from "fs";

export type Verse = {
  id: string;
  sura: string;
  aya: string;
  arabic_text: string;
  translation: string;
  footnotes: string;
};

type QuranData = Record<string, { result: Verse[] }>;
let cache: QuranData | null = null;

export function loadQuran(): QuranData {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "data", "quran.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cache = JSON.parse(raw);
  return cache!;
}

export function getVerses(surah: number): Verse[] {
  const data = loadQuran();
  const surahData = data[String(surah)];
  const verses = Array.isArray(surahData)
    ? surahData
    : (surahData?.result ?? []);
  return verses;
}

export function getVerse(surah: number, ayah: number): Verse | null {
  const verses = getVerses(surah);
  return verses.find((v) => v.aya === String(ayah)) ?? null;
}
