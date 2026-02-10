"use client";

import { useState, useEffect } from "react";
import { Plus, MessageSquare, Settings, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Heart, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IslamicPattern } from "@/components/islamic-decorations";
import Link from "next/link";
import Image from "next/image";
import { getBookmarks, type Bookmark } from "@/lib/bookmarks";
import { ThemeSwitcher } from "./theme-switcher";


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

const KEYDIYEY_OPEN_KEY = "tafsiir_sidebar_keydiyey_open";

function getStoredBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v !== null ? v === "1" : fallback;
  } catch {
    return fallback;
  }
}

export interface ChatConversationItem {
  id: string;
  title: string;
  updatedAt: number;
}

interface SidebarPropsExtended extends SidebarProps {
  conversations?: ChatConversationItem[];
  currentConversationId?: string | null;
  onNewChat?: () => void;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
}

export function Sidebar({ isOpen, setIsOpen, className, conversations = [], currentConversationId = null, onNewChat, onSelectConversation, onDeleteConversation }: SidebarPropsExtended) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [keydiyeyOpen, setKeydiyeyOpen] = useState(true);

  useEffect(() => {
    setKeydiyeyOpen(getStoredBool(KEYDIYEY_OPEN_KEY, true));
  }, []);

  const toggleKeydiyey = () => {
    setKeydiyeyOpen((prev) => {
      const next = !prev;
      try { localStorage.setItem(KEYDIYEY_OPEN_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (isOpen) setBookmarks(getBookmarks());
    const onStorage = () => setBookmarks(getBookmarks());
    window.addEventListener("storage", onStorage);
    window.addEventListener("tafsiir-bookmarks-changed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("tafsiir-bookmarks-changed", onStorage);
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar: on mobile hidden when closed; on desktop minimized to icon strip when closed */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-2xl transition-all duration-300 ease-in-out",
          "md:relative md:translate-x-0",
          isOpen ? "w-72 translate-x-0" : "w-16 -translate-x-full md:translate-x-0 md:w-16",
          className
        )}
      >
        <IslamicPattern variant="subtle" className="opacity-30" />

        {/* Minimized view (desktop only, when collapsed) */}
        <div className={cn("hidden md:flex flex-col flex-1 items-center py-3 gap-1 min-w-0", isOpen && "md:hidden")}>
          <Link href="/" className="rounded-lg p-2 hover:bg-muted/50 transition-colors" title="Tafsiir AI">
            <Image src="/logo.svg" alt="Tafsiir AI" width={28} height={28} className="rounded-md" />
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} title="Fur sidebar (Expand)" aria-label="Expand sidebar" className="h-9 w-9 rounded-lg">
            <ChevronRight size={18} />
          </Button>
          <div className="h-px w-8 bg-border/50 my-1" />
          <Button variant="ghost" size="icon" onClick={() => onNewChat?.()} title="Wada-hadal Cusub" className="h-9 w-9 rounded-lg">
            <Plus size={18} />
          </Button>
          <button onClick={() => setIsOpen(true)} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground" title="Dhowaan">
            <MessageSquare size={18} />
          </button>
          <button onClick={() => setIsOpen(true)} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground" title="Keydiyey">
            <Heart size={18} className="text-red-500/70" />
          </button>
          <Link href="/settings" className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground mt-auto" title="Dookhyada">
            <Settings size={18} />
          </Link>
        </div>

        {/* Full sidebar (when expanded) */}
        {isOpen && (
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            <>
              {/* Header: logo + collapse (minimize) button */}
              <div className="relative z-10 flex items-center justify-between p-4 border-b border-border/40 shrink-0">
                <Link href="/" className="flex items-center gap-2 group min-w-0">
                  <Image src="/logo.svg" alt="Tafsiir AI" width={32} height={32} className="rounded-lg shadow-sm shrink-0" />
                  <span className="font-bold text-lg tracking-tight truncate">Tafsiir AI</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  title="Yarayn sidebar (Minimize sidebar)"
                  aria-label="Minimize sidebar"
                  className="shrink-0"
                >
                  <ChevronLeft size={20} />
                </Button>
              </div>

              {/* New Chat Button */}
              <div className="relative z-10 p-4 shrink-0">
                <Button
                  className="w-full justify-start gap-3 rounded-xl py-6 gradient-premium shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all"
                  onClick={() => onNewChat?.()}
                >
                  <Plus size={20} />
                  <span className="font-medium">Wada-hadal Cusub</span>
                </Button>
              </div>

              {/* Recent Chats */}
              <div className="relative z-10 flex-1 overflow-y-auto px-3 py-2 min-h-0">
                <div className="text-xs font-semibold text-muted-foreground/60 mb-2 px-2 uppercase tracking-wider">
                  Dhowaan
                </div>
                {conversations.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-muted-foreground/60">
                    Weli ma jiraan wada hadal. Bilaab mid cusub.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((chat) => (
                      <div
                        key={chat.id}
                        className={cn(
                          "group/item w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all text-left",
                          currentConversationId === chat.id
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectConversation?.(chat.id)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <MessageSquare size={16} className="shrink-0 text-muted-foreground/70 group-hover/item:text-primary transition-colors" />
                          <span className="truncate">{chat.title}</span>
                        </button>
                        {onDeleteConversation && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(chat.id);
                            }}
                            className="shrink-0 p-1.5 rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            title="Tirtir (Delete)"
                            aria-label="Tirtir wada-hadalkan"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: Keydiyey (collapsible) + Settings */}
              <div className="relative z-10 p-4 border-t border-border/40 space-y-2 shrink-0">
                <button
                  onClick={toggleKeydiyey}
                  className="w-full flex items-center justify-between gap-2 rounded-lg px-2 py-2.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider hover:bg-muted/40 hover:text-muted-foreground transition-colors"
                >
                  <span>Keydsan</span>
                  {keydiyeyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {keydiyeyOpen && (
                  <>
                    {bookmarks.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-muted-foreground/60">
                        Wax aayad ah lama keydin. Ku dar aayad suuradaha marka aad akhrisato.
                      </p>
                    ) : (
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {bookmarks.slice(0, 20).map((b, i) => (
                          <Link
                            key={i}
                            href={`/quran/${b.surah}?ayah=${b.ayah}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group"
                          >
                            <Heart size={14} className="text-red-500/70 shrink-0" fill="currentColor" />
                            <span className="truncate flex-1">
                              {b.surahName || `Suurad ${b.surah}`} : {b.ayah}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group"
                >
                  <Settings size={16} className="text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>Dookhyada</span>
                </Link>

                <ThemeSwitcher />

                <div className="mt-4 flex items-center gap-3 px-3 pt-4 border-t border-border/30">
                  <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground shrink-0">
                    <User size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium">Koontada</span>
                  </div>
                </div>
              </div>
            </>
          </div>
        )}
      </aside>

      {/* Expand button: only on mobile when sidebar is closed (desktop uses minimized strip) */}
      {!isOpen && (
        <div className="fixed left-4 top-4 z-50 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="h-10 w-10 rounded-xl bg-card/80 backdrop-blur shadow-md hover:bg-card border-border/50"
          >
            <ChevronRight size={20} className="text-muted-foreground" />
          </Button>
        </div>
      )}
    </>
  );
}
