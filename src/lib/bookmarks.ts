const KEY = "tafsiir_bookmarks";

export interface Bookmark {
  surah: number;
  ayah: number;
  arabic_text: string;
  translation: string;
  surahName?: string;
}

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBookmark(b: Bookmark): void {
  const list = getBookmarks();
  if (list.some((x) => x.surah === b.surah && x.ayah === b.ayah)) return;
  list.unshift(b);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100)));
}

export function removeBookmark(surah: number, ayah: number): void {
  const list = getBookmarks().filter((x) => !(x.surah === surah && x.ayah === ayah));
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function isBookmarked(surah: number, ayah: number): boolean {
  return getBookmarks().some((x) => x.surah === surah && x.ayah === ayah);
}
