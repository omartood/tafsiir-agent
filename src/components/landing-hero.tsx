"use client";

import { Sparkles, ArrowRight, BookOpen, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VerseOfTheDay } from "@/components/verse-of-the-day";
interface LandingHeroProps {
  onStartChat: () => void;
}

export function LandingHero({ onStartChat }: LandingHeroProps) {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl filter animate-pulse-glow" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-3xl filter animate-float delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-8 animate-fade-up">
        
        {/* Bismillah */}
        <div className="animate-fade-up opacity-0" style={{ animationDelay: "100ms" }}>
          <p className="bismillah text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gold drop-shadow-sm select-none">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="mt-4 text-sm font-medium tracking-widest text-muted-foreground uppercase opacity-80">
            Magaca Allaah, Naxariis Guud iyo mid Gaar ahba Naxariista
          </p>
        </div>

        {/* Hero Content */}
        <div className="space-y-6 pt-6 animate-fade-up opacity-0" style={{ animationDelay: "300ms" }}>
          <div className="relative inline-block">
             <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full"></div>
             <h1 className="relative text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Tafsiirka <span className="text-gradient">Qur'aanka</span>
            </h1>
          </div>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground/80 sm:text-xl leading-relaxed">
            Baro macnaha qoto-dheer ee Qur'aanka Kariimka ah. 
            Weydii su'aalo ku saabsan aayadaha, tafsiirka, iyo tarjumaadda Af-Soomaaliga.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground/80">
            <span>114 Suurad</span>
            <span>6,236 Aayad</span>
            <span>Tarjumaad Af-Soomaali</span>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              "Tafsiirka Aayadaha", 
              "Macnaha Suuradaha", 
              "Asbaab al-Nuzuul", 
              "Akhriska Qur'aanka"
            ].map((tag, i) => (
              <span 
                key={i}
                className="inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-sm font-medium text-primary shadow-sm glass backdrop-blur-sm"
              >
                <Sparkles size={12} className="mr-1.5 text-gold" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA block: buttons → tagline → quick links */}
        <div className="flex flex-col items-center gap-6 pt-8 animate-fade-up opacity-0" style={{ animationDelay: "500ms" }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Button 
              onClick={onStartChat}
              size="lg" 
              className="group relative h-14 min-w-[200px] overflow-hidden rounded-full text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 golden-glow gradient-premium border-0"
            >
              <span className="relative z-10 flex items-center gap-2">
                Bilaab Wada-hadal
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 hidden group-hover:block animate-shimmer" />
            </Button>
            <Link href="/quran/1">
              <Button variant="outline" size="lg" className="rounded-full border-primary/30 text-primary hover:bg-primary/10 h-14 px-6">
                <BookOpen size={18} className="mr-2" />
                Bilaab Suurat Al-Faatixa
              </Button>
            </Link>
          </div>

          <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2.5 text-center">
              <Shield size={14} className="shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground/90 leading-snug">
                Caawiye AI oo loogu talagalay Qur'aanka • Tarjumaad la aqoonsan yahay • Jawaab ku saleeysan Qur'aanka (ma ah ChatGPT/Gemini oo soo tuura)
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
              <Link href="/search" className="hover:text-primary transition-colors">
                Raadi
              </Link>
              <span className="text-border">·</span>
              <Link href="/quran" className="hover:text-primary transition-colors">
                Qur'aanka
              </Link>
              <span className="text-border">·</span>
              <Link href="/docs" className="hover:text-primary transition-colors">
                Dukumentiyada API
              </Link>
            </div>
          </div>
        </div>

        {/* Verse of the day */}
        <div className="w-full max-w-xl mx-auto pt-8 animate-fade-up opacity-0" style={{ animationDelay: "600ms" }}>
          <VerseOfTheDay />
        </div>
      </div>
    </div>
  );
}
