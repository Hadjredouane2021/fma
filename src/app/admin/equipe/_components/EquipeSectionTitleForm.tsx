"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import { ADMIN_LOCALE_TABS, type AdminLocale } from "@/lib/admin-locale";
import type { LocalizedString } from "@/lib/la-fma-site-public";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";

export function EquipeSectionTitleForm({ initial }: { initial: LocalizedString }) {
  const router = useRouter();
  const [title, setTitle] = useState<LocalizedString>(initial);
  const [tab, setTab] = useState<AdminLocale>("fr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const currentTab = ADMIN_LOCALE_TABS.find((t) => t.key === tab)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/equipe/section-title", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directionSectionTitle: title }),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data.message as string) || "Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm dark:shadow-none"
    >
      <h3 className="mb-1 text-sm font-bold text-primary">Titre de section sur La FMA</h3>
      <p className="mb-4 text-xs text-[var(--text-3)]">
        Titre affiché au-dessus de l’organigramme (membres avec service « direction », actifs) sur{" "}
        <code className="text-[var(--text-2)]">/[locale]/la-fma</code>.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {ADMIN_LOCALE_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-sm font-medium",
              tab === t.key ? buttonTabActive : buttonTabInactive
            )}
          >
            {t.flag} {t.label}
          </button>
        ))}
      </div>
      <div dir={currentTab.dir}>
        <label className={labelCls}>Titre ({tab.toUpperCase()})</label>
        <input
          type="text"
          value={title[tab]}
          onChange={(e) => setTitle((p) => ({ ...p, [tab]: e.target.value }))}
          className={inputBase}
          placeholder={
            tab === "fr"
              ? "L'Équipe Opérationnelle"
              : tab === "en"
                ? "The Operational Team"
                : "الفريق التشغيلي"
          }
        />
      </div>
      {error ? (
        <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">Titre enregistré.</p>
      ) : null}
      <div className="mt-4">
        <Button type="submit" variant="primary" size="sm" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer le titre
        </Button>
      </div>
    </form>
  );
}
