"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Palette, Check } from "lucide-react";

const themes = [
  { id: "default", name: "Default (Emerald)", class: "" },
  { id: "ottoman", name: "Ottoman (Red)", class: "theme-ottoman" },
  { id: "andalusian", name: "Andalusian (Azure)", class: "theme-andalusian" },
  { id: "mogadishu", name: "Mogadishu (Ocean)", class: "theme-mogadishu" },
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("default");

  useEffect(() => {
    const saved = localStorage.getItem("app-theme") || "default";
    setCurrentTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    // Remove all theme classes
    themes.forEach((t) => {
      if (t.class) document.documentElement.classList.remove(t.class);
    });

    // Add new theme class if it exists
    if (theme.class) document.documentElement.classList.add(theme.class);
    
    localStorage.setItem("app-theme", themeId);
    setCurrentTheme(themeId);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Palette size={14} />
        <span>Style & Themes</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            variant="ghost"
            size="sm"
            className={cn(
              "justify-between w-full h-9 px-3 font-medium transition-all group",
              currentTheme === theme.id 
                ? "bg-primary/10 text-primary hover:bg-primary/15" 
                : "hover:bg-muted/50"
            )}
            onClick={() => applyTheme(theme.id)}
          >
            <span className="flex items-center gap-2">
              <span className={cn(
                "h-2.5 w-2.5 rounded-full",
                theme.id === "default" && "bg-[#047857]",
                theme.id === "ottoman" && "bg-[#800000]",
                theme.id === "andalusian" && "bg-[#0047AB]",
                theme.id === "mogadishu" && "bg-[#1E90FF]"
              )} />
              {theme.name}
            </span>
            {currentTheme === theme.id && <Check size={14} className="animate-scale-in" />}
          </Button>
        ))}
      </div>
    </div>
  );
}
