"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  ADMIN_THEME_PRESETS,
  type AdminThemeColors,
  type AdminThemeSettings,
} from "@/lib/admin-theme";

const inputBase =
  "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

const COLOR_FIELDS: { key: keyof AdminThemeColors; label: string }[] = [
  { key: "primary", label: "Couleur principale" },
  { key: "accent", label: "Accent" },
  { key: "sidebar", label: "Fond de la barre latérale" },
  { key: "background", label: "Fond général" },
];

export default function AdminThemeForm({ initial }: { initial: AdminThemeSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [customizing, setCustomizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const applyPreset = (presetId: string) => {
    const preset = ADMIN_THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setForm({ presetId: preset.id, light: preset.light, dark: preset.dark });
  };

  const setColor = (mode: "light" | "dark", key: keyof AdminThemeColors, value: string) => {
    setForm((p) => ({ ...p, presetId: null, [mode]: { ...p[mode], [key]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/theme/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError((d.message as string) || "Erreur");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-liquid max-w-2xl rounded-2xl p-6 card-hover">
      <h2 className="relative z-10 mb-1 flex items-center gap-2 text-sm font-bold text-primary">
        <Palette className="h-4 w-4" />
        Couleurs de l&apos;administration
      </h2>
      <p className="relative z-10 mb-6 text-xs text-[var(--text-3)]">
        Palette utilisée dans l&apos;espace d&apos;administration uniquement, en mode clair et sombre.
      </p>

      <div className="relative z-10 space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
            Préréglages
          </label>
          <div className="flex flex-wrap gap-3">
            {ADMIN_THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors",
                  form.presetId === preset.id
                    ? "border-primary bg-primary/10"
                    : "border-[var(--border)] hover:border-primary/40"
                )}
              >
                <span className="flex -space-x-1">
                  {Object.values(preset.light).map((c, i) => (
                    <span
                      key={i}
                      className="h-4 w-4 rounded-full border border-white"
                      style={{ background: c }}
                    />
                  ))}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    form.presetId === preset.id ? "text-primary" : "text-[var(--text-2)]"
                  )}
                >
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCustomizing((v) => !v)}
          className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
        >
          {customizing ? "Masquer la personnalisation" : "Personnaliser les couleurs"}
        </button>

        {customizing ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(["light", "dark"] as const).map((mode) => (
              <div key={mode} className="space-y-3 rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
                  {mode === "light" ? "Mode clair" : "Mode sombre"}
                </p>
                {COLOR_FIELDS.map(({ key, label }) => (
                  <div key={key}>
                    <label className="mb-1 block text-[11px] text-[var(--text-3)]">{label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form[mode][key]}
                        onChange={(e) => setColor(mode, key, e.target.value)}
                        className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--bg)]"
                      />
                      <input
                        type="text"
                        value={form[mode][key]}
                        onChange={(e) => setColor(mode, key, e.target.value)}
                        className={inputBase}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
            Couleurs de l&apos;administration enregistrées.
          </div>
        ) : null}

        <Button type="button" variant="primary" onClick={handleSave} isLoading={saving}>
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
