"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(defaultView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-up">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex items-center justify-between border-b border-border/50">
          <h2 className="text-2xl font-bold text-foreground">
            {view === "login" ? "Soo Gal" : "Samayso Account"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {view === "login" ? (
            <LoginForm onSwitchToRegister={() => setView("register")} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setView("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
