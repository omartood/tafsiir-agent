"use client";

import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
            In the Name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>

        {/* Hero Content */}
        <div className="space-y-6 pt-6 animate-fade-up opacity-0" style={{ animationDelay: "300ms" }}>
          <div className="relative inline-block">
             <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full"></div>
             <h1 className="relative text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Tafsiir <span className="text-gradient">Qur'aanka</span>
            </h1>
          </div>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground/80 sm:text-xl leading-relaxed">
            Discover the profound meanings of the Holy Quran through AI-powered Tafsir. 
            Ask questions, explore verses, and deepen your understanding in Somali.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              "Tafsiirka Aayadaha", 
              "Asbaabta Nuzoolka", 
              "Siirada Nabiga (NNKH)", 
              "Fatwo & Fiqhi"
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

        {/* CTA Actions */}
        <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row animate-fade-up opacity-0" style={{ animationDelay: "500ms" }}>
          <Button 
            onClick={onStartChat}
            size="lg" 
            className="group relative h-14 min-w-[200px] overflow-hidden rounded-full text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 golden-glow gradient-premium border-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Chatting
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 hidden group-hover:block animate-shimmer" />
          </Button>
          
          <p className="max-w-xs text-xs text-muted-foreground/60">
            Powered by Gemini Pro • Authentic Sources
          </p>
        </div>
      </div>
    </div>
  );
}
