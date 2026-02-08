"use client";

import { cn } from "@/lib/utils";
import { Sparkles, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex w-full gap-4 animate-fade-up group md:px-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar (Left for Assistant) */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10">
            <Sparkles size={16} />
          </div>
        </div>
      )}

      {/* Message Bubble + Actions */}
      <div className={cn(
        "relative max-w-[85%] sm:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div
          className={cn(
            "relative px-6 py-4 shadow-sm text-[15px] leading-relaxed",
            isUser 
              ? "rounded-[20px] rounded-br-md bg-gradient-to-br from-primary to-primary/90 text-white shadow-primary/20" 
              : "rounded-[20px] rounded-bl-md bg-card border border-border/50 text-foreground"
          )}
        >
          <div className="whitespace-pre-wrap font-outfit">
            {message.content}
          </div>
        </div>

        {/* Message Actions (Copy, etc.) - Only for Assistant for now */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </Button>
          </div>
        )}
      </div>

      {/* Avatar (Right for User) */}
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="h-9 w-9 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-foreground shadow-sm">
            <User size={16} />
          </div>
        </div>
      )}
    </div>
  );
}
