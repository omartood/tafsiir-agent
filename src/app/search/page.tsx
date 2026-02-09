"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { IslamicPattern } from "@/components/islamic-decorations";
import { Search as SearchIcon, BookOpen } from "lucide-react";

interface SearchResult {
  surah: number;
  ayah: number;
  verse: { arabic_text: string; translation: string };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    setLoading(true);
    setSearched(true);
    fetch("/api/quran/search?q=" + encodeURIComponent(q))
      .then((r) => r.json())
      .then((d) => setResults(d.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-background relative">
      <IslamicPattern />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gradient">
            Raadi Qur'aanka
          </h1>
          <p className="text-muted-foreground/80 mt-2">
            Raadi aayadaha ee tarjumaadda ama qoraalka Carabiga
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative mb-10">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Geli eray (ugu yaraan 2 xaraf)..."
            className="w-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm pl-12 pr-4 py-4 text-base outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
            minLength={2}
          />
          <button
            type="submit"
            disabled={loading || query.trim().length < 2}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "..." : "Raadi"}
          </button>
        </form>

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p>Wax aayah ah lama helin</p>
            <p className="text-sm mt-1">Isku day eray kale</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground/70">
              {results.length} natiijo
            </p>
            {results.map((r, i) => (
              <Link
                key={i}
                href={`/quran/${r.surah}?ayah=${r.ayah}`}
                className="block rounded-2xl border border-border/50 bg-card/40 p-5 transition-all hover:bg-card/70 hover:border-primary/20"
              >
                <p className="font-arabic text-xl text-right text-foreground/90 mb-2" dir="rtl">
                  {r.verse.arabic_text}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {r.verse.translation}
                </p>
                <p className="text-xs text-primary mt-2">
                  Suurat {r.surah} • Aayah {r.ayah}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
