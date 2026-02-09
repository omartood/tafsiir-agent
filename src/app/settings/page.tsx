"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { IslamicPattern } from "@/components/islamic-decorations";
import Link from "next/link";
import {
  Sun,
  Moon,
  Monitor,
  MessageSquare,
  Heart,
  BookOpen,
  Database,
  Info,
  Trash2,
  Download,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAllConversations } from "@/lib/chat-history";
import { getBookmarks, clearAllBookmarks } from "@/lib/bookmarks";
import { clearReadProgress } from "@/lib/reading-progress";
import { cn } from "@/lib/utils";

const FONT_KEY = "tafsiir_surah_font";
const THEME_KEY = "theme";
const KEYDIYEY_OPEN_KEY = "tafsiir_sidebar_keydiyey_open";

type ThemeValue = "light" | "dark" | "system";

function getStoredTheme(): ThemeValue {
  if (typeof window === "undefined") return "system";
  const s = localStorage.getItem(THEME_KEY);
  if (s === "light" || s === "dark" || s === "system") return s;
  return "system";
}

function applyTheme(value: ThemeValue) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, value);
  const d = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark =
    value === "dark" || (value !== "light" && (value === "system" || !value) && d);
  document.documentElement.classList.toggle("dark", dark);
  window.dispatchEvent(new CustomEvent("tafsiir-theme-changed", { detail: { dark } }));
}

function clearAllAppData() {
  try {
    localStorage.removeItem("tafsiir_chat_history");
    localStorage.removeItem("tafsiir_bookmarks");
    localStorage.removeItem("tafsiir_read_surahs");
    localStorage.removeItem(FONT_KEY);
    localStorage.removeItem(KEYDIYEY_OPEN_KEY);
    // Keep theme so user doesn't get surprised
    applyTheme(getStoredTheme());
  } catch {}
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<ThemeValue>("system");
  const [mounted, setMounted] = useState(false);
  const [confirmChat, setConfirmChat] = useState(false);
  const [confirmBookmarks, setConfirmBookmarks] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const [doneMessage, setDoneMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setTheme(getStoredTheme());
  }, []);

  const handleTheme = (value: ThemeValue) => {
    setTheme(value);
    applyTheme(value);
  };

  const handleClearChat = () => {
    if (!confirmChat) {
      setConfirmChat(true);
      return;
    }
    clearAllConversations();
    setConfirmChat(false);
    setDoneMessage("Taariikhda wada-hadalka waa laga tirtiray.");
    setTimeout(() => setDoneMessage(null), 3000);
  };

  const handleClearBookmarks = () => {
    if (!confirmBookmarks) {
      setConfirmBookmarks(true);
      return;
    }
    clearAllBookmarks();
    setConfirmBookmarks(false);
    setDoneMessage("Keydiyeyaasha waa laga tirtiray.");
    setTimeout(() => setDoneMessage(null), 3000);
  };

  const handleExportBookmarks = () => {
    const list = getBookmarks();
    const blob = new Blob([JSON.stringify(list, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tafsiir-keydiyey-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDoneMessage("Keydiyeyaasha waa laga soo saaray.");
    setTimeout(() => setDoneMessage(null), 3000);
  };

  const handleResetFont = () => {
    try {
      localStorage.removeItem(FONT_KEY);
      setDoneMessage("Qaabka qoraalka waa laga noqday mid caadi ah.");
      setTimeout(() => setDoneMessage(null), 3000);
    } catch {}
  };

  const handleClearAll = () => {
    if (!confirmAll) {
      setConfirmAll(true);
      return;
    }
    clearAllAppData();
    setConfirmAll(false);
    setDoneMessage("Dhammaan xogta app-ka waa laga tirtiray.");
    setTimeout(() => setDoneMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <IslamicPattern />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Dookhyada</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Ka beddel qaabka app-ka iyo xogta.
        </p>

        {doneMessage && (
          <div className="mb-6 rounded-xl bg-primary/10 border border-primary/20 text-primary px-4 py-3 text-sm">
            {doneMessage}
          </div>
        )}

        {/* 1. Qaabka (Appearance) */}
        <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Sun size={20} className="text-primary" />
            Qaabka
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Dooro iftiinka bogga: cad, madoow, ama ku xiran qalabkaaga.
          </p>
          {mounted && (
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: "light" as const, label: "Cad", icon: Sun },
                  { value: "dark" as const, label: "Madoow", icon: Moon },
                  { value: "system" as const, label: "Qalab", icon: Monitor },
                ] as const
              ).map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={theme === value ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => handleTheme(value)}
                >
                  <Icon size={16} />
                  {label}
                </Button>
              ))}
            </div>
          )}
        </section>

        {/* 2. Wada-hadalka (Chat) */}
        <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <MessageSquare size={20} className="text-primary" />
            Wada-hadalka
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tirtir dhammaan wada-hadallada Dhowaan. Tani ma noqon doonto.
          </p>
          <Button
            variant={confirmChat ? "destructive" : "outline"}
            size="sm"
            className="gap-2"
            onClick={handleClearChat}
          >
            <Trash2 size={16} />
            {confirmChat ? "Riix mar kale si aad u tirtirto" : "Tirtir dhammaan taariikhda"}
          </Button>
          {confirmChat && (
            <p className="text-xs text-muted-foreground mt-2">
              Riix butoonka mar kale si aad u xaqiijiso.
            </p>
          )}
        </section>

        {/* 3. Keydiyey (Bookmarks) */}
        <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Heart size={20} className="text-primary" />
            Keydiyey
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tirtir keydiyeyaasha aayadaha ama soo saar (export) si aad ugu keydsato.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={confirmBookmarks ? "destructive" : "outline"}
              size="sm"
              className="gap-2"
              onClick={handleClearBookmarks}
            >
              <Trash2 size={16} />
              {confirmBookmarks ? "Riix mar kale si aad u tirtirto" : "Tirtir dhammaan"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExportBookmarks}>
              <Download size={16} />
              Soo saar (export)
            </Button>
          </div>
          {confirmBookmarks && (
            <p className="text-xs text-muted-foreground mt-2">
              Riix butoonka mar kale si aad u xaqiijiso.
            </p>
          )}
        </section>

        {/* 4. Akhriska (Reading) */}
        <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <BookOpen size={20} className="text-primary" />
            Akhriska Qur&apos;aanka
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Noqosii cabbirka qoraalka (Carabi iyo tarjumaad) ee suuradaha ee ugu horreeya.
          </p>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleResetFont}>
            <RotateCcw size={16} />
            Noqosii cabbirka caadiga ah
          </Button>
        </section>

        {/* 5. Xogta (Data) */}
        <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Database size={20} className="text-primary" />
            Xogta
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Xogta (wada-hadallada, keydiyey, taariikhda akhriska) waxaa lagu keydiyaa
            qalabkaaga (localStorage). Ma la wadaaginno server. Tirtir dhammaan haddii aad
            rabto in aad ka bilowato adigoo aan wax la hayn.
          </p>
          <Button
            variant={confirmAll ? "destructive" : "outline"}
            size="sm"
            className="gap-2"
            onClick={handleClearAll}
          >
            <Trash2 size={16} />
            {confirmAll ? "Riix mar kale si aad u tirtirto" : "Tirtir dhammaan xogta"}
          </Button>
          {confirmAll && (
            <p className="text-xs text-muted-foreground mt-2">
              Riix butoonka mar kale si aad u xaqiijiso. Qaabka (cad/madoow) waa la ilaalinayaa.
            </p>
          )}
        </section>

        {/* 6. Ku saabsan (About) */}
        <section className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Info size={20} className="text-primary" />
            Ku saabsan
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tafsiir AI — Caawiye Qur&apos;aan oo ku shaqeeya Af-Soomaali. Tafsiirka iyo
            tarjumaadda Qur&apos;aanka, wada-hadal AI, iyo akhriska suuradaha.
          </p>
          <Link href="/about">
            <Button variant="outline" size="sm" className="gap-2">
              <Info size={16} />
              Bogga Ku saabsan
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
