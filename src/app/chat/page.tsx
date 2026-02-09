"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IslamicPattern } from "@/components/islamic-decorations";
import { Sidebar } from "@/components/chat-sidebar";
import { EmptyState } from "@/components/empty-state";
import { ChatMessage } from "@/components/chat-message";
import {
  getConversations,
  getConversation,
  addConversation,
  updateConversation,
  deleteConversation,
  createTitleFromFirstMessage,
  type ChatMessage as StoredMessage,
} from "@/lib/chat-history";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<{ id: string; title: string; updatedAt: number }[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const refreshConversations = useCallback(() => {
    setConversations(
      getConversations().map((c) => ({ id: c.id, title: c.title, updatedAt: c.updatedAt }))
    );
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    if (currentConversationId === null) {
      setMessages([]);
      return;
    }
    const conv = getConversation(currentConversationId);
    setMessages(conv ? conv.messages : []);
  }, [currentConversationId]);

  // Pre-fill input from ?q= (e.g. from landing sample questions)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q?.trim()) setInput(q.trim());
  }, [searchParams]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const userMessage = { role: "user" as const, content: userMsg };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    let assistantContent: string;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      assistantContent = data.error ? `Khalad: ${data.error}` : data.text ?? "";
    } catch {
      assistantContent = "Khalad farsamo ayaa dhacay. Fadlan isku day mar kale.";
    }
    const assistantMessage = { role: "assistant" as const, content: assistantContent };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);

    // Persist to chat history
    if (currentConversationId === null) {
      const newConv = addConversation({
        title: createTitleFromFirstMessage(userMsg),
        messages: [userMessage, assistantMessage],
      });
      setCurrentConversationId(newConv.id);
    } else {
      const prev = getConversation(currentConversationId)?.messages ?? [];
      updateConversation(currentConversationId, {
        messages: [...prev, userMessage, assistantMessage],
      });
    }
    refreshConversations();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Optional: Auto-submit or focus
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <IslamicPattern />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={() => {
          setCurrentConversationId(null);
          setMessages([]);
        }}
        onSelectConversation={(id) => setCurrentConversationId(id)}
        onDeleteConversation={(id) => {
          deleteConversation(id);
          refreshConversations();
          if (currentConversationId === id) {
            setCurrentConversationId(null);
            setMessages([]);
          }
        }}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full h-full transition-all duration-300">
        
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-4 md:hidden border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-20">
           <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
             <Menu size={20} />
           </Button>
           <h1 className="font-semibold">Tafsiir Chat</h1>
           <Button
             variant="ghost"
             size="icon"
             onClick={() => { setCurrentConversationId(null); setMessages([]); }}
           >
             <Plus size={20} />
           </Button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto w-full relative">
          <div className="max-w-4xl mx-auto w-full min-h-full flex flex-col pb-4">
            
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <EmptyState onSuggestionClick={handleSuggestionClick} />
              </div>
            ) : (
              <div className="flex-1 p-4 space-y-8 pt-10">
                {messages.map((msg, i) => (
                   <ChatMessage key={i} message={msg} />
                ))}

                {isLoading && (
                  <div className="flex justify-start px-4 animate-fade-up">
                    <div className="flex items-center gap-2 p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
                      <span className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} className="h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="relative z-20 p-4 pb-6 w-full max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/5 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Weydii su'aal ku saabsan tafsiirka..."
              rows={1}
              className="w-full bg-transparent px-6 py-4 pr-16 text-base outline-none resize-none max-h-[200px] placeholder:text-muted-foreground/50 scrollbar-hide"
            />
            
            <div className="absolute right-2 bottom-2">
              <Button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-xl transition-all duration-300",
                  input.trim() ? "gradient-premium shadow-lg shadow-primary/20 hover:scale-105" : "bg-muted text-muted-foreground hover:bg-muted"
                )}
              >
                <Send size={18} className={cn(isLoading && "animate-pulse")} />
              </Button>
            </div>
          </div>
          <div className="text-center mt-3">
             <p className="text-[10px] text-muted-foreground/40 font-medium">
               Tafsiir AI • Waxaa lagu tababaray Af-Soomaali nadiif ah.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChatPageFallback() {
  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <IslamicPattern />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageFallback />}>
      <ChatPageContent />
    </Suspense>
  );
}
