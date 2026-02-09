"use client";

import { useState } from "react";
import { Plus, MessageSquare, Settings, ChevronLeft, ChevronRight, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IslamicPattern } from "@/components/islamic-decorations";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

export function Sidebar({ isOpen, setIsOpen, className }: SidebarProps) {
  // Mock data for recent chats
  const recentChats = [
    { id: 1, title: "Tafsiirka Suurat Al-Faatixa", date: "Maanta" },
    { id: 2, title: "Macnaha Aayat Al-Kursi", date: "Shalay" },
    { id: 3, title: "Tarjumaadda Suurat Yasiin", date: "Feb 5" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-2xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          !isOpen && "-translate-x-full md:w-0 md:border-r-0 md:opacity-0 md:overflow-hidden",
          className
        )}
      >
        <IslamicPattern variant="subtle" className="opacity-30" />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b border-border/40">
           <Link href="/" className="flex items-center gap-2 group">
              <Image src="/logo.svg" alt="Tafsiir AI" width={32} height={32} className="rounded-lg shadow-sm" />
              <span className="font-bold text-lg tracking-tight">Tafsiir AI</span>
           </Link>
           <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(false)}>
             <ChevronLeft size={20} />
           </Button>
        </div>

        {/* New Chat Button */}
        <div className="relative z-10 p-4">
          <Button 
            className="w-full justify-start gap-3 rounded-xl py-6 gradient-premium shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all"
            onClick={() => {}}
          >
            <Plus size={20} />
            <span className="font-medium">New Chat</span>
          </Button>
        </div>

        {/* Recent Chats */}
        <div className="relative z-10 flex-1 overflow-y-auto px-3 py-2">
          <div className="text-xs font-semibold text-muted-foreground/60 mb-3 px-2 uppercase tracking-wider">
            Recent
          </div>
          <div className="space-y-1">
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group text-left"
              >
                <MessageSquare size={16} className="text-muted-foreground/70 group-hover:text-primary transition-colors" />
                <span className="truncate flex-1">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-4 border-t border-border/40 space-y-2">
           <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group">
             <Heart size={16} className="text-muted-foreground/70 group-hover:text-red-500 transition-colors" />
             <span>Saved Tafsiirs</span>
           </button>
           <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group">
             <Settings size={16} className="text-muted-foreground/70 group-hover:text-primary transition-colors" />
             <span>Settings</span>
           </button>
           
           <div className="mt-4 flex items-center gap-3 px-3 pt-4 border-t border-border/30">
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground">
                 <User size={16} />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-medium">User Account</span>
                 <span className="text-[10px] text-muted-foreground">Free Plan</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Toggle Button (Visible when sidebar is closed on desktop) */}
      {!isOpen && (
        <div className="fixed left-4 top-4 z-50 hidden md:block">
           <Button 
             variant="outline" 
             size="icon" 
             onClick={() => setIsOpen(true)}
             className="h-10 w-10 rounded-xl bg-card/80 backdrop-blur shadow-md hover:bg-card border-border/50"
           >
             <ChevronRight size={20} className="text-muted-foreground" />
           </Button>
        </div>
      )}
    </>
  );
}
