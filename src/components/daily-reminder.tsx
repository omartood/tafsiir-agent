"use client";

import { useEffect, useState } from "react";
import { Bell, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyReminderProps {
  onClose?: () => void;
}

export function DailyReminder({ onClose }: DailyReminderProps) {
  const [verse, setVerse] = useState<{ arabic: string; somali: string; reference: string } | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    // Check if we should show today's reminder
    const lastShown = localStorage.getItem("lastReminderDate");
    const today = new Date().toDateString();
    
    if (lastShown !== today) {
      setShowReminder(true);
      loadDailyVerse();
      localStorage.setItem("lastReminderDate", today);
    }
  }, []);

  const loadDailyVerse = async () => {
    try {
      const response = await fetch("/quran.json");
      const data = await response.json();
      
      // Get all verses
      const allVerses: any[] = [];
      Object.keys(data).forEach((suraKey) => {
        const suraData = data[suraKey];
        if (suraData && Array.isArray(suraData.result)) {
          suraData.result.forEach((v: any) => {
            allVerses.push({
              arabic: v.arabic_text,
              somali: v.translation,
              reference: `${v.sura}:${v.aya}`,
            });
          });
        }
      });

      // Select a random verse based on today's date (deterministic)
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
      const randomIndex = dayOfYear % allVerses.length;
      
      setVerse(allVerses[randomIndex]);
    } catch (error) {
      console.error("Failed to load daily verse:", error);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === "granted") {
        showNotification();
      }
    }
  };

  const showNotification = () => {
    if (verse && Notification.permission === "granted") {
      new Notification("Aayada Maanta 📖", {
        body: `${verse.reference}: ${verse.somali.substring(0, 100)}...`,
        icon: "/logo.svg",
        badge: "/logo.svg",
      });
    }
  };

  const handleClose = () => {
    setShowReminder(false);
    onClose?.();
  };

  if (!showReminder || !verse) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-up">
      <div className="rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BookOpen size={18} />
            </div>
            <h3 className="font-bold text-foreground">Aayada Maanta</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
              {verse.reference}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-center font-arabic text-2xl leading-[2] text-foreground/90" dir="rtl">
              {verse.arabic}
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {verse.somali}
          </p>

          {notificationPermission === "default" && (
            <button
              onClick={requestNotificationPermission}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl",
                "bg-primary text-primary-foreground font-medium text-sm",
                "hover:bg-primary/90 transition-colors"
              )}
            >
              <Bell size={16} />
              Ogolow Notifications
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
