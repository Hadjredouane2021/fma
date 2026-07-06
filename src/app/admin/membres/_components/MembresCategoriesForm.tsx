"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import { ADMIN_LOCALE_TABS, type AdminLocale } from "@/lib/admin-locale";
import {
  createEmptyLaFmaMemberCategory,
  type LaFmaMemberCategory,
  type LocalizedString,
} from "@/lib/la-fma-site-public";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";

type MembresCategoriesFormProps = {
  initialCategories: LaFmaMemberCategory[];
  initialOtherLabel: LocalizedString;
};

export function MembresCategoriesForm({ initialCategories, initialOtherLabel }: MembresCategoriesFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<LaFmaMemberCategory[]>(initialCategories);
  const [otherLabel, setOtherLabel] = useState<LocalizedString>(initialOtherLabel);
  const [tab, setTab] = useState<AdminLocale>("fr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const currentTab = ADMIN_LOCALE_TABS.find((t) => t.key === tab)!;

  useEffect(() => {
    setCategories(initialCategories);
    setOtherLabel(initialOtherLabel);
  }, [initialCategories, initialOtherLabel]);

  const setCategorySlug = (idx: number, slug: string) =>
    setCategories((list) => list.map((c, i) => (i === idx ? { ...c, slug } : c)));

  const setCategoryLabel = (idx: number, lang: AdminLocale, value: string) =>
    setCategories((list) =>
      list.map((c, i) => (i === idx ? { ...c, label: { ...c.label, [lang]: value } } : c))
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/membres/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberCategories: categories, memberCategoryOtherLabel: otherLabel }),
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
      <h3 className="mb-1 text-sm font-bold text-primary">Catégories (groupes sur La FMA)</h3>
      <p className="mb-4 text-xs text-[var(--text-3)]">
        Le <strong>slug</strong> correspond au champ catégorie de chaque membre en BDD. Les libellés s’affichent comme titres de groupe sur{" "}
        <code className="text-[var(--text-2)]">/[locale]/la-fma</code>.
      </p>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
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
        <a
          href={`/${tab}/la-fma`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <Eye className="h-3.5 w-3.5" />
          Aperçu La FMA ({currentTab.label})
        </a>
      </div>

      <div className="space-y-4" dir={currentTab.dir}>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-alt)]/50 p-4">
          <label className={labelCls}>Sans catégorie ({tab.toUpperCase()})</label>
          <input
            type="text"
            value={otherLabel[tab]}
            onChange={(e) => setOtherLabel((p) => ({ ...p, [tab]: e.target.value }))}
            className={inputBase}
            placeholder={tab === "fr" ? "Autres" : tab === "en" ? "Other" : "أخرى"}
          />
        </div>

        {categories.map((cat, idx) => (
          <div key={`cat-${idx}`} className="rounded-lg border border-[var(--border)] bg-[var(--bg-alt)]/50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[var(--text-3)]">Catégorie {idx + 1}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCategories((list) => list.filter((_, i) => i !== idx))}
                disabled={categories.length <= 1}
                className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </Button>
            </div>
            <div>
              <label className={labelCls}>Slug (BDD)</label>
              <input
                type="text"
                value={cat.slug}
                onChange={(e) => setCategorySlug(idx, e.target.value)}
                className={inputBase}
                placeholder="assureurs"
                dir="ltr"
              />
            </div>
            <div>
              <label className={labelCls}>Libellé ({tab.toUpperCase()})</label>
              <input
                type="text"
                value={cat.label[tab]}
                onChange={(e) => setCategoryLabel(idx, tab, e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCategories((list) => [...list, createEmptyLaFmaMemberCategory()])}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Ajouter une catégorie
        </Button>
      </div>

      {error ? (
        <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">Catégories enregistrées.</p>
      ) : null}
      <div className="mt-4">
        <Button type="submit" variant="primary" size="sm" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer les catégories
        </Button>
      </div>
    </form>
  );
}
