"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthModal } from "@/components/auth/auth-modal";
import { BookOpen, MessageSquare, Info, Menu, X, FileCode, Search, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/utils/supabase/client";

const navLinks = [
  { href: "/", label: "Bogga Hore", icon: null },
  { href: "/quran", label: "Qur'aanka", icon: BookOpen },
  { href: "/search", label: "Raadi", icon: Search },
  { href: "/chat", label: "Wada-hadal", icon: MessageSquare },
  { href: "/docs", label: "API Docs", icon: FileCode },
  { href: "/about", label: "Ku Saabsan", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const { session, isPending, user, profile } = useAuth();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.svg"
            alt="Tafsiir AI"
            width={40}
            height={40}
            className="rounded-xl shadow-lg transition-transform group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight text-gradient leading-tight">
              Tafsiir AI
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Caawiye Qur'aan
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span className="flex items-center gap-2">
                  {link.icon && <link.icon size={16} />}
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Auth Section - Desktop */}
          {!isPending && (
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <div className="flex items-center gap-3">
                  {/* Streak display */}
                  {profile && profile.streak_count > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold animate-pulse-slow">
                      <span className="text-sm">🔥</span>
                      <span>{profile.streak_count}</span>
                    </div>
                  )}

                  <Link 
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary overflow-hidden border border-primary/20">
                      {profile?.avatar_url ? (
                        <Image 
                          src={profile.avatar_url} 
                          alt="Avatar" 
                          width={24} 
                          height={24} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={14} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground max-w-[120px] truncate group-hover:text-primary transition-colors">
                      {profile?.full_name || user?.user_metadata?.full_name || user?.email}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className={cn(
                      "p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                    )}
                    title="Ka bax"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthView("login");
                      setAuthModalOpen(true);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                      "text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                    )}
                  >
                    <LogIn size={16} />
                    Soo Gal
                  </button>
                  <button
                    onClick={() => {
                      setAuthView("register");
                      setAuthModalOpen(true);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                      "bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                    )}
                  >
                    <UserPlus size={16} />
                    Isdiiwaangeli
                  </button>
                </>
              )}
            </div>
          )}
          
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border/40 bg-card/95 backdrop-blur-xl animate-fade-up">
          <div className="flex flex-col p-3 gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.icon && <link.icon size={18} />}
                  {link.label}
                </Link>
              );
            })}
            
            {/* Auth Section - Mobile */}
            {!isPending && (
              <div className="flex flex-col gap-2 pt-3 mt-3 border-t border-border/40">
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary overflow-hidden border border-primary/10">
                        {profile?.avatar_url ? (
                          <Image 
                            src={profile.avatar_url} 
                            alt="Avatar" 
                            width={40} 
                            height={40} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground truncate">
                            {profile?.full_name || user?.user_metadata?.full_name || user?.email}
                          </p>
                          {profile && profile.streak_count > 0 && (
                            <span className="text-xs">🔥 {profile.streak_count}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                        "text-red-500 hover:bg-red-500/10 transition-all"
                      )}
                    >
                      <LogOut size={18} />
                      Ka bax
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthView("login");
                        setAuthModalOpen(true);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                        "text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                      )}
                    >
                      <LogIn size={18} />
                      Soo Gal
                    </button>
                    <button
                      onClick={() => {
                        setAuthView("register");
                        setAuthModalOpen(true);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                        "bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                      )}
                    >
                      <UserPlus size={18} />
                      Isdiiwaangeli
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultView={authView}
      />
    </header>
  );
}
