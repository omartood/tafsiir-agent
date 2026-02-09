"use client";

import { Navbar } from "@/components/navbar";
import { IslamicPattern } from "@/components/islamic-decorations";
import { FileCode } from "lucide-react";

const baseUrl = typeof window !== "undefined" ? `${window.location.origin}/api/quran` : "/api/quran";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <IslamicPattern />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileCode size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">
              Quran API Documentation
            </h1>
            <p className="text-muted-foreground/80 text-sm mt-0.5">
              Public API for the Holy Quran with Somali translation
            </p>
          </div>
        </div>

        <div className="space-y-10 text-foreground/90">
          {/* Overview */}
          <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-3">Overview</h2>
            <p className="text-muted-foreground/80 leading-relaxed mb-4">
              The Tafsiir Quran API serves the complete Quran (114 surahs) with Arabic text and Somali translation (tarjumaad).
              All endpoints are <strong>GET</strong> and return JSON. No authentication required.
            </p>
            <div className="rounded-xl bg-muted/30 p-4 font-mono text-sm">
              <p className="text-muted-foreground/60 mb-1">Base URL</p>
              <code className="text-primary break-all">{baseUrl}</code>
            </div>
          </section>

          {/* 1. API Info */}
          <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-3">1. API Info</h2>
            <p className="text-muted-foreground/80 mb-4">
              Get API name, version, and list of available endpoints.
            </p>
            <div className="space-y-3">
              <div>
                <code className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">GET /api/quran</code>
                <p className="text-xs text-muted-foreground mt-1">No query parameters</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm text-muted-foreground">{`{
  "name": "Tafsiir Quran API",
  "version": "1.0",
  "description": "Public API for the Holy Quran with Somali translation",
  "endpoints": [...],
  "usage": { "listSurahs": "...", "getSurah": "...", "getAyah": "..." }
}`}</pre>
              </div>
            </div>
          </section>

          {/* 2. List surahs */}
          <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-3">2. List all surahs</h2>
            <p className="text-muted-foreground/80 mb-4">
              Returns metadata for all 114 surahs (number, Arabic name, transliteration, ayah count, Makki/Madani).
            </p>
            <div className="space-y-3">
              <code className="text-sm px-2 py-1 rounded bg-primary/10 text-primary block w-fit">GET /api/quran/surahs</code>
              <div className="rounded-xl bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm text-muted-foreground">{`{
  "total": 114,
  "surahs": [
    {
      "number": 1,
      "name": "الفاتحة",
      "nameTransliteration": "Al-Faatixa",
      "ayahCount": 7,
      "type": "Makki"
    },
    ...
  ]
}`}</pre>
              </div>
            </div>
          </section>

          {/* 3. Get surah */}
          <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-3">3. Get a surah (all verses)</h2>
            <p className="text-muted-foreground/80 mb-4">
              Returns all verses of a surah. Use surah number 1–114.
            </p>
            <div className="space-y-3">
              <div>
                <code className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">GET /api/quran?surah=1</code>
                <span className="text-muted-foreground/60 text-sm ml-2">or</span>
                <code className="text-sm px-2 py-1 rounded bg-primary/10 text-primary ml-2">GET /api/quran/surahs/1</code>
              </div>
              <div className="rounded-xl bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm text-muted-foreground">{`{
  "surah": 1,
  "verses": [
    {
      "id": "1",
      "sura": "1",
      "aya": "1",
      "arabic_text": "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
      "translation": "1. Waxaan Ku billaabi Magaca Alle...",
      "footnotes": ""
    },
    ...
  ]
}`}</pre>
              </div>
              <p className="text-xs text-muted-foreground">
                Alternative path response includes <code className="bg-muted px-1 rounded">surahName</code>, <code className="bg-muted px-1 rounded">surahNameArabic</code>, <code className="bg-muted px-1 rounded">ayahCount</code>, <code className="bg-muted px-1 rounded">type</code>.
              </p>
            </div>
          </section>

          {/* 4. Get single ayah */}
          <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-3">4. Get a single ayah (verse)</h2>
            <p className="text-muted-foreground/80 mb-4">
              Returns one verse by surah and ayah number.
            </p>
            <div className="space-y-3">
              <div>
                <code className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">GET /api/quran?surah=1&ayah=2</code>
                <span className="text-muted-foreground/60 text-sm ml-2">or</span>
                <code className="text-sm px-2 py-1 rounded bg-primary/10 text-primary ml-2">GET /api/quran/surahs/1?ayah=2</code>
              </div>
              <div className="rounded-xl bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm text-muted-foreground">{`{
  "surah": 1,
  "ayah": 2,
  "verse": {
    "id": "2",
    "sura": "1",
    "aya": "2",
    "arabic_text": "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ",
    "translation": "2. Ammaan idilkeed iyo mahad waxaa leh Allaah...",
    "footnotes": ""
  }
}`}</pre>
              </div>
            </div>
          </section>

          {/* Error responses */}
          <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-3">Error responses</h2>
            <p className="text-muted-foreground/80 mb-4">
              All errors return JSON with an <code className="bg-muted px-1 rounded">error</code> message.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>400</strong> — Bad request (e.g. surah not 1–114, missing required param)</li>
              <li><strong>404</strong> — Surah or ayah not found</li>
              <li><strong>500</strong> — Internal server error</li>
            </ul>
          </section>

          {/* Quick reference */}
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-xl font-bold mb-3">Quick reference</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="py-2 pr-4 font-semibold">Endpoint</th>
                  <th className="py-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground/80">
                <tr className="border-b border-border/30">
                  <td className="py-2 pr-4 font-mono text-xs">GET /api/quran</td>
                  <td className="py-2">API info</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-2 pr-4 font-mono text-xs">GET /api/quran?surah=N</td>
                  <td className="py-2">All verses of surah N (1–114)</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-2 pr-4 font-mono text-xs">GET /api/quran?surah=N&ayah=A</td>
                  <td className="py-2">Single verse: surah N, ayah A</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-2 pr-4 font-mono text-xs">GET /api/quran/surahs</td>
                  <td className="py-2">List 114 surahs metadata</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-2 pr-4 font-mono text-xs">GET /api/quran/surahs/N</td>
                  <td className="py-2">All verses of surah N</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">GET /api/quran/surahs/N?ayah=A</td>
                  <td className="py-2">Single verse: surah N, ayah A</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}
