"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { IslamicPattern } from "@/components/islamic-decorations";
import { useAuth } from "@/components/auth-provider";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { updateProfile } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Calendar, User, Mail, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, profile, isPending } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/");
    }
    if (profile) {
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url);
    }
  }, [user, profile, isPending, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);
    try {
      await updateProfile(user.id, {
        full_name: fullName,
        avatar_url: avatarUrl,
      });
      setMessage({ type: "success", text: "Macluumaadkaagii si guul leh ayaa loo keydiyey." });
      // Minor delay to show success before potentially refreshing or just letting the user see it
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ type: "error", text: "Waan ka xunnahay, khalad ayaa dhacay inta la lgu guda jiray keydinta." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative">
      <IslamicPattern />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link 
          href="/settings" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Stats */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md p-8 flex flex-col items-center">
              <AvatarUpload 
                userId={user.id} 
                url={avatarUrl} 
                onUpload={(url) => setAvatarUrl(url)} 
              />
              
              <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-foreground">
                  {profile?.full_name || user.user_metadata?.full_name || "Isticmaale"}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="w-full h-px bg-border/50 my-6" />

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                  <span className="text-2xl">🔥</span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{profile?.streak_count || 0}</span>
                  <span className="text-[10px] uppercase font-bold text-orange-600/70">Streak</span>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                  <Trophy size={24} className="text-primary" />
                  <span className="text-lg font-bold text-primary">Cusub</span>
                  <span className="text-[10px] uppercase font-bold text-primary/70">Level</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Calendar size={14} />
                Activity Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Xubinnimada:</span>
                  <span className="font-medium">{new Date(user.created_at).toLocaleDateString("so-SO")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Activity Dhowaan:</span>
                  <span className="font-medium">
                    {profile?.last_active_at ? new Date(profile.last_active_at).toLocaleDateString("so-SO") : "Maanta"}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-2">
            <section className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-md p-8 h-full">
              <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <User className="text-primary" />
                Profile-kaaga
              </h1>
              <p className="text-muted-foreground text-sm mb-8">
                Halkan ka beddel macluumaadkaaga gaarka ah si uu app-ku kuugu garto.
              </p>

              {message && (
                <div className={cn(
                  "mb-8 p-4 rounded-2xl border text-sm animate-in fade-in slide-in-from-top-4",
                  message.type === "success" ? "bg-primary/10 border-primary/20 text-primary" : "bg-destructive/10 border-destructive/20 text-destructive"
                )}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-foreground px-1">
                    Magaca oo Buuxa
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Gali magacaaga"
                      className="pl-10 h-12 bg-background/50"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground px-1">
                    Email-ka (Lama beddeli karo)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="pl-10 h-12 bg-muted/50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-base font-bold transition-all hover:scale-[1.02]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Keydinaya...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Keydi Isbedelada
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
