const KEY = "tafsiir_read_surahs";

export function getReadSurahs(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markSurahRead(surah: number): void {
  const set = new Set(getReadSurahs());
  set.add(surah);
  localStorage.setItem(KEY, JSON.stringify([...set]));
}

export function getReadCount(): number {
  return getReadSurahs().length;
}

export function clearReadProgress(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
