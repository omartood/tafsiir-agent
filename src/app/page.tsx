"use client";

import { useState } from "react";
import { BookOpen, Star, BookMarked, Sparkles, MessageCircle, CheckCircle, Share2, MessageSquare, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { IslamicPattern } from "@/components/islamic-decorations";
import { LandingHero } from "@/components/landing-hero";
import { useRouter } from "next/navigation";

const howItWorks = [
  { icon: BookOpen, step: "1", title: "Akhri Qur'aanka", desc: "Browso 114-ka surah ee tarjumaad af Soomaaliga." },
  { icon: MessageCircle, step: "2", title: "Weydii su'aal", desc: "Weydii wax kasta oo ku saabsan aayadaha iyo tafsiirka." },
  { icon: CheckCircle, step: "3", title: "Hel jawaab", desc: "AI-gu wuxuu kuu jawaabaa jawaab sax ah waayo waxaa lagu train gareeyay af Soomaali nadiif ah." },
];

const sampleQuestions = [
  {
    icon: BookOpen,
    title: "Suurat Al-Faatixa",
    question: "Tafsiirka Suuradda Al-Faatixa ee af Soomaaliga",
  },
  {
    icon: Star,
    title: "Suurat Al-Baqarah",
    question: "Maxay ka dhigan tahay Aayat Al-Kursi?",
  },
  {
    icon: BookMarked,
    title: "Suurat Yasiin",
    question: "Tarjum iyo tafsiir Suurat Yasiin",
  },
];

export default function Home() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleStartChat = (prefillQuestion?: string) => {
    if (prefillQuestion?.trim()) {
      router.push("/chat?q=" + encodeURIComponent(prefillQuestion.trim()));
    } else {
      router.push("/chat");
    }
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-background">
      {/* Background Pattern */}
      <IslamicPattern />
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex min-h-full flex-col items-center justify-center px-4 py-8">
            
            <LandingHero onStartChat={handleStartChat} />

            {/* How it works */}
            <div className="w-full max-w-4xl mx-auto pt-4 pb-8 animate-fade-up opacity-0" style={{ animationDelay: "650ms" }}>
              <h2 className="text-center text-lg font-semibold text-foreground/90 mb-6">
                Sida ay u shaqeyso
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {howItWorks.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center p-5 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/50 transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                      <item.icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-primary/80 mb-1">Tallaabada {item.step}</span>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground/80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Tafsiir AI vs other AIs */}
            <div className="w-full max-w-4xl mx-auto pt-2 pb-8 animate-fade-up opacity-0" style={{ animationDelay: "680ms" }}>
              <h2 className="text-center text-lg font-semibold text-foreground/90 mb-4">
                Maxaa ka duwan Tafsiir AI?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield size={20} className="text-primary" />
                    <span className="font-semibold text-foreground">Tafsiir AI</span>
                  </div>
                  <p className="text-sm text-muted-foreground/90 leading-relaxed">
                    Waa <strong className="text-foreground/90">AI-agent loogu talagalay Qur'aanka</strong> oo lagu tababaray tafsiirka iyo tarjumaadda. Waxaa uu ku saleeyaa jawaabaha <strong className="text-foreground/90">Qur'aanka iyo ilo la aqoonsan yahay</strong> — ma bixinayo wax aan ka soo bixin Qur'aanka.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-card/30 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap size={20} className="text-muted-foreground" />
                    <span className="font-semibold text-foreground/80">ChatGPT, Gemini, iwm.</span>
                  </div>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed">
                    Waa <strong className="text-foreground/80">AI guud</strong> oo loogu talagalay wax kasta. Markaad weydiiso tafsiir, inta badan waxay <strong className="text-foreground/80">soo saaraan jawaab laga soo tuuray</strong> (out of the box) oo aan ku tiirsanayn ilo Qur'aan ah oo cad — sidaas darteed jawaabuhu way khaldamaan karaan.
                  </p>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground/70 mt-3 max-w-xl mx-auto">
                Tafsiir AI wuxuu kuu bixinayaa jawaab lagu xaqiijiyay tarjumaad iyo tafsiir af Soomaali ah oo la isku halleyn karo.
              </p>
            </div>

            {/* Sample Questions */}
            <div className="w-full max-w-4xl grid gap-4 pt-8 pb-12 sm:grid-cols-3 animate-fade-up opacity-0" style={{ animationDelay: "700ms" }}>
                {sampleQuestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStartChat(item.question)}
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
            
            <footer className="w-full text-center pb-8 space-y-4">
                <p className="text-xs text-muted-foreground/80">
                  Loogu talagalay af Soomaaliga
                </p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
                    <Sparkles size={10} /> 
                    Tafsiirka iyo Tarjumaadda Qur'aanka 
                    <Sparkles size={10} />
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground border border-border/50 hover:bg-muted/50 hover:text-foreground transition-all"
                  >
                    <Share2 size={14} />
                    {copied ? "Link waa la koobiyey" : "Wadaag qof kale"}
                  </button>
                  <a
                    href="https://github.com/toodmind/tafsiir-agent/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground border border-border/50 hover:bg-muted/50 hover:text-foreground transition-all"
                  >
                    <MessageSquare size={14} />
                    Soo dir fikrad
                  </a>
                </div>
            </footer>
        </div>
      </div>
    </main>
  );
}
