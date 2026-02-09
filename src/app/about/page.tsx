"use client";

import { Navbar } from "@/components/navbar";
import { IslamicPattern } from "@/components/islamic-decorations";
import Link from "next/link";
import { BookOpen, Cpu, Globe, Heart, Github, Shield, Zap } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: BookOpen,
    title: "Qur'aan oo buuxa",
    description: "114-ka Suuradood oo dhan oo leh qoraalka Carabiga iyo tarjumaadda Af-Soomaaliga.",
  },
  {
    icon: Cpu,
    title: "Tafsiir AI",
    description: "Caawiye AI-ga waxaa lagu tababaray Af-Soomaali nadiif ah. Weydii su'aalo ku saabsan aayadaha, macnahooda, iyo tafsiirkooda wuxuuna kuu jawaabaa jawaab sax ah.",
  },
  {
    icon: Globe,
    title: "Af-Soomaali",
    description: "Tarjumaadda ugu saxda badan ee Qur'aanka Af-Soomaaliga, laga helay ilo la isku halleyn karo.",
  },
  {
    icon: Heart,
    title: "Bilaash",
    description: "App-kan waa bilaash oo waxaa loogu talagalay in uu Ummadda u fududeeyo barashada Qur'aanka.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <IslamicPattern />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Image
            src="/logo.svg"
            alt="Tafsiir AI"
            width={80}
            height={80}
            className="mx-auto rounded-2xl shadow-2xl"
          />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
            Ku saabsan Tafsiir AI
          </h1>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Tafsiir AI waa app-ka ugu horreeya ee AI ku shaqeeya oo loogu talagalay 
            in uu dadka Soomaaliyeed u fududeeyo akhriska iyo fahamka Qur'aanka Kariimka.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 mb-16">
          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 space-y-3 transition-all hover:bg-card/70 hover:border-primary/10 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Why Tafsiir AI vs other AIs */}
        <div className="mb-16 space-y-4">
          <h2 className="text-xl font-bold text-foreground text-center">Maxaa ka duwan Tafsiir AI?</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Shield size={22} className="text-primary" />
                <span className="font-semibold text-foreground">Tafsiir AI</span>
              </div>
              <p className="text-sm text-muted-foreground/90 leading-relaxed">
                Waa Caawiye AI loogu talagalay Qur'aanka oo lagu tababaray tafsiirka iyo tarjumaadda. Waxaa uu ku saleeyaa jawaabaha Qur'aanka iyo ilo la aqoonsan yahay — ma bixinayo wax aan ka soo bixin Qur'aanka. Tarjumaad iyo tafsiir Af-Soomaali ah oo la isku halleyn karo.
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Zap size={22} className="text-muted-foreground" />
                <span className="font-semibold text-foreground/80">ChatGPT, Gemini, iwm.</span>
              </div>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Waa AI guud oo loogu talagalay wax kasta. Markaad weydiiso tafsiir Qur'aan, inta badan waxay soo saaraan jawaab aan la hubin (out of the box) oo aan ku tiirsanayn ilo Qur'aan ah oo cad — sidaas darteed jawaabuhu way khaldami karaan.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-8 text-center space-y-4">
          <p className="bismillah text-2xl text-gold/80">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h2 className="text-2xl font-bold text-foreground">Ujeedkeenna</h2>
          <p className="text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Ujeedkeennu waa in aan u fududeeyno dadka Soomaaliyeed in ay fahmaan Qur'aanka 
            Kariimka iyagoo adeegsanaya teknoolajiyadda casriga ah. Waxaan rabnaa in qof kasta 
            oo Soomaali ah uu helo tarjumaad iyo tafsiir sax ah oo Af-Soomaali ku qoran.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground/80">Teknoolajiyadda</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Next.js", "Gemini AI", "Memvid", "Tailwind CSS", "TypeScript"].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/50 bg-card/60 px-4 py-1.5 text-sm font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Developed by & Repo */}
        <div className="mt-16 pt-8 border-t border-border/40 text-center space-y-3">
          <p className="text-muted-foreground/80">
            Waxaa horumariyey <strong className="text-foreground/90">ToodMind</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="https://github.com/toodmind/tafsiir-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/80 hover:border-primary/20 transition-all"
            >
              <Github size={18} />
              Keydka Mashruuca
            </Link>
            <Link
              href="https://github.com/toodmind/tafsiir-agent/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/80 hover:border-primary/20 transition-all"
            >
              Soo dir fikrad
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
