"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (!saved && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className={cn(
        "relative h-10 w-10 rounded-full flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95",
        "bg-gradient-to-br from-secondary/30 to-secondary/10",
        "hover:from-secondary/50 hover:to-secondary/20",
        "border border-secondary/30",
        "text-primary dark:text-secondary",
        "shadow-sm hover:shadow-md"
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        <Sun
          size={20}
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          )}
        />
        <Moon
          size={20}
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          )}
        />
      </div>
    </button>
  );
}
