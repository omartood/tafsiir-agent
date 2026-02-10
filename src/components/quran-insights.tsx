"use client";

import { Users, Info, TrendingUp, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Muuse (c.s)", count: 189, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Muxammad (s.c.w)", count: 169, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Ibraahiim (c.s)", count: 107, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Nuux (c.s)", count: 71, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Ciise (c.s)", count: 56, color: "text-rose-500", bg: "bg-rose-500/10" },
  { label: "Yuusuf (c.s)", count: 52, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export function QuranInsights() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <TrendingUp size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Xogta iyo Stat-ka</h2>
          <p className="text-sm text-muted-foreground">Tirakoobka Nabiyada iyo xogta muhiimka ah.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx}
            className={cn(
              "p-4 rounded-2xl border border-border/50 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg group",
              stat.bg
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <Users size={18} className={stat.color} />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-background/50 border border-border/50">
                Aayadood
              </span>
            </div>
            <div className="text-2xl font-black mb-1">{stat.count}</div>
            <div className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border/50 bg-card/30 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Wadarta Suuradaha</div>
            <div className="text-2xl font-bold">114 Suuradood</div>
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-border/50 bg-card/30 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Info size={24} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Wadarta Aayadaha</div>
            <div className="text-2xl font-bold">6,236 Aayadood</div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-xs text-muted-foreground italic">
        * Tirakoobkan wuxuu ku salaysan yahay inta jeer ee magacyada laga helay tarjumada Soomaaliga ee app-ka.
      </p>
    </div>
  );
}
