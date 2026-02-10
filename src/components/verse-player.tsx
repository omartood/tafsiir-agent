"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VersePlayerProps {
  surah: number;
  ayah: number;
  className?: string;
}

export function VersePlayer({ surah, ayah, className }: VersePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchAudio = async () => {
    setIsLoading(true);
    try {
      // Using Quran.com API v4
      // Recitation ID 7 is Mishary Rashid Alafasy
      const response = await fetch(`https://api.quran.com/api/v4/recitations/7/by_ayah/${surah}:${ayah}`);
      const data = await response.json();
      
      if (data.audio_files && data.audio_files.length > 0) {
        let url = data.audio_files[0].url;
        if (!url.startsWith('http')) {
          url = `https://audio.quran.com/${url}`;
        }
        setAudioUrl(url);
        return url;
      }
    } catch (error) {
      console.error("Error fetching recitation:", error);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const togglePlay = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    let currentUrl = audioUrl;
    if (!currentUrl) {
      currentUrl = await fetchAudio();
    }

    if (currentUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <audio ref={audioRef} src={audioUrl || ""} />
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlay}
        disabled={isLoading}
        className={cn(
          "h-8 w-8 rounded-full transition-all",
          isPlaying ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        {isLoading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={14} fill="currentColor" />
        ) : (
          <Play size={14} fill="currentColor" className="ml-0.5" />
        )}
      </Button>
      <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-tighter">
        Recitation {surah}:{ayah}
      </span>
    </div>
  );
}
