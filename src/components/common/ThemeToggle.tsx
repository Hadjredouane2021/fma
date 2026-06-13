"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonSegmentActive, buttonSegmentInactive } from "@/lib/button-styles";

export function ThemeToggle({ compact = false, topbar = false }: { compact?: boolean; topbar?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    if (topbar) return <div className="h-6 w-6 rounded-full bg-white/10 animate-pulse" />;
    return <div className="theme-toggle animate-pulse opacity-60" />;
  }

  const isDark = resolvedTheme === "dark";

  if (topbar) {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        title={isDark ? "Mode clair" : "Mode sombre"}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all duration-200"
      >
        {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>
    );
  }

  if (compact) {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="theme-toggle"
        aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        title={isDark ? "Mode clair" : "Mode sombre"}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
      {[
        { value: "light",  icon: Sun,     label: "Clair" },
        { value: "system", icon: Monitor, label: "Système" },
        { value: "dark",   icon: Moon,    label: "Sombre" },
      ].map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          aria-label={label}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 transition-all",
            theme === value ? buttonSegmentActive : buttonSegmentInactive
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
