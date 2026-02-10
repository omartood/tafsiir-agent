"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, List, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarPattern } from "@/components/islamic-decorations";
import { VerseOfTheDay } from "@/components/verse-of-the-day";
import { QuranInsights } from "@/components/quran-insights";
import Image from "next/image";

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  const suggestions = [
    {
      icon: Search,
      text: "Tafsiirka Suurat Al-Faatixa",
      label: "Raadi Tafsiir",
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      icon: BookOpen,
      text: "Tarjum Suurat Al-Mulk af Soomaaliga",
      label: "Tarjumaad",
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      icon: List,
      text: "Maxay ka dhigan tahay Aayat Al-Kursi?",
      label: "Macnaha Aayadaha",
      color: "text-amber-500 bg-amber-500/10",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 w-full h-full min-h-[50vh] animate-fade-up">
      <div className="text-center space-y-6 mb-12 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
          <StarPattern className="w-64 h-64 text-primary animate-spin-slow" />
        </div>
        
        <div className="relative inline-flex mb-4 group">
           <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500" />
           <Image src="/logo.svg" alt="Tafsiir AI" width={80} height={80} className="relative z-10 rounded-2xl shadow-2xl" />
        </div>

        <div className="space-y-4 max-w-lg mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient-shimmer">
            Tafsiir AI
          </h1>
          <p className="text-lg text-muted-foreground/80 leading-relaxed font-light">
            Caawiye gaar ah ee tafsiirka iyo tarjumaadda Qur'aanka. 
            Weydii wax kasta oo ku saabsan aayadaha Qur'aanka.
          </p>
        </div>

        <div className="w-full max-w-xl mt-8">
          <VerseOfTheDay />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {suggestions.map((item, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(item.text)}
            className="group relative flex flex-col items-start p-5 h-auto text-left rounded-2xl border border-border/50 bg-card/40 hover:bg-card/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute right-0 top-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
               <ArrowRight size={18} className="text-primary/50 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
            
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-colors", item.color)}>
              <item.icon size={20} />
            </div>
            
            <div>
              <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-1 block">
                {item.label}
              </span>
              <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">
                {item.text}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="w-full mt-12 py-12 border-t border-border/20">
        <QuranInsights />
      </div>
    </div>
  );
}
