"use client";

import { cn } from "@/lib/utils";
import { Sparkles, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { VersePlayer } from "./verse-player";
import { VerseCardGenerator } from "./verse-card-generator";


const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
function getTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getTextFromChildren).join("");
  if (children && typeof children === "object" && "props" in children) return getTextFromChildren((children as any).props?.children);
  return "";
}

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
          {isUser ? (
            <div className="whitespace-pre-wrap font-outfit">
              {message.content}
            </div>
          ) : (
            <div className="chat-message-assistant-content prose prose-sm dark:prose-invert max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-strong:text-foreground prose-strong:font-semibold">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Handle custom HTML div for Arabic verses (<div class="arabic-verse">)
                  div: ({ node, className, children, ...props }) => {
                    const isArabicVerse = className === "arabic-verse";
                    return (
                      <div
                        className={cn(
                          className,
                          isArabicVerse && "my-6 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center font-arabic text-3xl leading-[2.2] text-foreground/90 shadow-inner"
                        )}
                        dir={isArabicVerse ? "rtl" : undefined}
                        {...props}
                      >
                        {children}
                      </div>
                    );
                  },
                  // Enhanced headings
                  h3: ({ node, children, ...props }) => (
                    <h3 className="text-lg font-bold text-primary/90 flex items-center gap-2 border-b border-border/30 pb-2 mt-6 mb-4" {...props}>
                      {children}
                    </h3>
                  ),
                  // Improved text: detect if paragraph is mostly Arabic
                  // Improved text: detect if paragraph is primarily Arabic
                  p: ({ node, children, ...props }) => {
                    const textContent = getTextFromChildren(children);
                    const isArabic = ARABIC_REGEX.test(textContent);
                    
                    if (isArabic) {
                      // Try to find a verse reference in the near context if possible
                      const verseMatch = textContent.match(/(\d{1,3}):(\d{1,3})/);
                      
                      return (
                        <div className="my-6 space-y-3">
                          <div 
                            className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center font-arabic text-3xl leading-[2.2] text-foreground/90 shadow-inner"
                            dir="rtl"
                          >
                            {children}
                          </div>
                          {verseMatch && (
                            <div className="flex justify-center gap-2">
                              <VersePlayer 
                                surah={parseInt(verseMatch[1])} 
                                ayah={parseInt(verseMatch[2])} 
                              />
                              <VerseCardGenerator 
                                arabic={textContent}
                                somali="" 
                                reference={`${verseMatch[1]}:${verseMatch[2]}`}
                              />
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <p className="leading-relaxed my-3 text-foreground/90" {...props}>
                        {children}
                      </p>
                    );
                  },
                  // Lists
                  ul: ({ node, children, ...props }) => (
                    <ul className="list-disc pl-5 my-4 space-y-2" {...props}>{children}</ul>
                  ),
                  ol: ({ node, children, ...props }) => (
                    <ol className="list-decimal pl-5 my-4 space-y-2" {...props}>{children}</ol>
                  ),
                  // Horizontal rule
                  hr: ({ node, ...props }) => (
                    <hr className="my-6 border-t border-border/40" {...props} />
                  ),
                  // Bold text
                  strong: ({ node, children, ...props }) => (
                    <strong className="font-semibold text-primary/80" {...props}>
                      {children}
                    </strong>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
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
