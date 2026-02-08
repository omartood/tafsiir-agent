"use client";

import { BookOpen, Star, BookMarked, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { IslamicPattern } from "@/components/islamic-decorations";
import { LandingHero } from "@/components/landing-hero";
import { useRouter } from "next/navigation";

const sampleQuestions = [
  {
    icon: BookOpen,
    title: "Suuradda Al-Faatixa",
    question: "Maxay ka dhigan tahay Suuradda Al-Faatixa?",
  },
  {
    icon: Star,
    title: "Aayatul Kursi",
    question: "Maxay tahay muhiimadda Aayatul Kursi?",
  },
  {
    icon: BookMarked,
    title: "Tafsiirka Surah",
    question: "Faahfaahi Suurat Yasiin",
  },
];

export default function Home() {
  const router = useRouter();

  const handleStartChat = () => {
    router.push("/chat");
  };

  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-background">
      {/* Background Pattern */}
      <IslamicPattern />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-border/50 px-4 py-3 sm:px-6 sm:py-4 glass">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="relative flex h-11 w-11 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-emerald-600 opacity-90" />
            <div className="absolute inset-0 rounded-xl golden-glow" />
            <BookOpen size={22} className="relative z-10 text-white" />
          </div>
          
          {/* Title */}
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gradient sm:text-2xl">
              Tafsiir AI
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Qur'aan Assistant
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex min-h-full flex-col items-center justify-center px-4 py-8">
            
            <LandingHero onStartChat={handleStartChat} />

            {/* Sample Questions */}
            <div className="w-full max-w-4xl grid gap-4 pt-8 pb-12 sm:grid-cols-3 animate-fade-up opacity-0" style={{ animationDelay: "700ms" }}>
                {sampleQuestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={handleStartChat}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300",
                      "glass hover-lift border border-primary/10",
                      "hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-colors group-hover:from-primary group-hover:to-emerald-600 group-hover:text-white shadow-sm">
                        <item.icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                          {item.question}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
            
            <footer className="w-full text-center pb-6 opacity-60">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Sparkles size={10} /> 
                    Designed for Ummah with AI 
                    <Sparkles size={10} />
                </p>
            </footer>
        </div>
      </div>
    </main>
  );
}
