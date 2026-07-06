"use client";

import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT } from "@/lib/admin-upload";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import { ADMIN_LOCALE_TABS, type AdminLocale } from "@/lib/admin-locale";
import { localizedText } from "@/lib/localized-content";
import {
  DEFAULT_LA_FMA_CONTENT,
  DEFAULT_MEMBER_CATEGORIES,
  type LaFmaMemberCategory,
} from "@/lib/la-fma-site-public";
import { resolveMemberCategorySlug, type MemberCategoryConfig } from "@/lib/member-categories-shared";
import type { Locale } from "@/types";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const fieldGroupCard = "rounded-xl border border-[var(--border)] p-4 space-y-3";
const card = "bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6";

export type MemberFormInitial = {
  id: string;
  nameFr: string;
  nameEn: string | null;
  nameAr: string | null;
  logo: string | null;
  website: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  category: string | null;
  order: number;
  active: boolean;
};

interface MemberFormProps {
  initial?: MemberFormInitial | null;
  defaultOrder?: number;
  categoryConfig?: MemberCategoryConfig;
}

function defaultCategoryConfig(): MemberCategoryConfig {
  return {
    categories: DEFAULT_MEMBER_CATEGORIES,
    otherLabel: DEFAULT_LA_FMA_CONTENT.memberCategoryOtherLabel,
    extraSlugs: [],
  };
}

export default function MemberForm({
  initial,
  defaultOrder = 0,
  categoryConfig = defaultCategoryConfig(),
}: MemberFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [tab, setTab] = useState<AdminLocale>("fr");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { categories, otherLabel, extraSlugs } = categoryConfig;
  const resolvedInitialCategory = useMemo(
    () => resolveMemberCategorySlug(initial?.category, categories),
    [initial?.category, categories]
  );

  const [form, setForm] = useState({
    nameFr: initial?.nameFr ?? "",
    nameEn: initial?.nameEn ?? "",
    nameAr: initial?.nameAr ?? "",
    logo: initial?.logo ?? "",
    website: initial?.website ?? "",
    descriptionFr: initial?.descriptionFr ?? "",
    descriptionEn: initial?.descriptionEn ?? "",
    descriptionAr: initial?.descriptionAr ?? "",
    category: resolvedInitialCategory,
    order: initial?.order ?? defaultOrder,
    active: initial?.active ?? true,
  });

  const currentTab = ADMIN_LOCALE_TABS.find((t) => t.key === tab)!;
  const l = tab as Locale;
  const knownSlugs = new Set(categories.map((c) => c.slug));
  const categoryIsKnown = !form.category || knownSlugs.has(form.category);
  const categoryLabel =
    tab === "ar" ? "الفئة" : tab === "en" ? "Category" : "Catégorie";

  const categoryOptions = useMemo(() => {
    const options: { slug: string; label: string }[] = categories.map((c) => ({
      slug: c.slug,
      label: localizedText(c.label, l),
    }));
    for (const slug of extraSlugs) {
      if (!knownSlugs.has(slug)) {
        options.push({ slug, label: slug });
      }
    }
    if (form.category && !knownSlugs.has(form.category) && !extraSlugs.includes(form.category)) {
      options.push({ slug: form.category, label: form.category });
    }
    return options;
  }, [categories, extraSlugs, form.category, knownSlugs, l]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "members");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.message as string) || "Échec de l’upload");
        return;
      }
      if (typeof data.url === "string") setForm((p) => ({ ...p, logo: data.url }));
    } catch {
      setError("Erreur réseau lors de l’upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/admin/members/${initial!.id}` : "/api/admin/members";
      const category = resolveMemberCategorySlug(form.category, categories);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category }),
      });
      if (res.ok) {
        router.push("/admin/membres");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data.message as string) || "Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Erreur réseau — vérifiez votre connexion");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className={`${card} space-y-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {ADMIN_LOCALE_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium",
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
        <p className="text-xs text-[var(--text-3)]">
          Raison sociale et libellé de catégorie selon la langue active. Le slug de catégorie reste commun à toutes les langues en BDD ; les traductions des groupes se gèrent sur la page Membres FMA.
        </p>
        <div className="space-y-4" dir={currentTab.dir}>
          <div>
            <label className={labelCls}>
              {tab === "ar" ? "الاسم" : tab === "en" ? "Company name" : "Raison sociale"}
              {tab === "fr" ? " — obligatoire" : ""}
            </label>
            {tab === "fr" && (
              <input
                type="text"
                value={form.nameFr}
                onChange={(e) => setForm((p) => ({ ...p, nameFr: e.target.value }))}
                className={inputBase}
                required
              />
            )}
            {tab === "en" && (
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
                className={inputBase}
                placeholder="Company name in English…"
              />
            )}
            {tab === "ar" && (
              <input
                type="text"
                value={form.nameAr}
                onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))}
                className={inputBase}
                placeholder="اسم الشركة بالعربية…"
              />
            )}
          </div>

          <div>
            <label className={labelCls}>{categoryLabel}</label>
            <select
              value={categoryIsKnown ? form.category : "__custom__"}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "__custom__") return;
                setForm((p) => ({ ...p, category: value }));
              }}
              className={inputBase}
            >
              <option value="">{localizedText(otherLabel, l)}</option>
              {categoryOptions.map((opt) => (
                <option key={opt.slug} value={opt.slug}>
                  {opt.label}
                </option>
              ))}
              {!categoryIsKnown && form.category ? (
                <option value="__custom__">{form.category}</option>
              ) : null}
            </select>
            {!categoryIsKnown ? (
              <input
                type="text"
                list="member-category-slugs"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className={cn(inputBase, "mt-2")}
                placeholder="assureurs, reassureurs…"
                dir="ltr"
              />
            ) : null}
            <datalist id="member-category-slugs">
              {categories.map((c: LaFmaMemberCategory) => (
                <option key={c.slug} value={c.slug} />
              ))}
              {extraSlugs.map((slug) => (
                <option key={slug} value={slug} />
              ))}
            </datalist>
            {form.category ? (
              <p className="mt-1 font-mono text-[10px] text-[var(--text-3)]" dir="ltr">
                slug BDD : {form.category}
              </p>
            ) : null}
            {initial?.category && initial.category !== resolvedInitialCategory ? (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Ancienne valeur « {initial.category} » convertie en slug « {resolvedInitialCategory} » à l’enregistrement.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Logo & liens</h3>
        <div>
          <label className={labelCls}>URL du logo</label>
          <input
            type="text"
            value={form.logo}
            onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
            className={inputBase}
            placeholder="/uploads/members/…"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-2 text-xs font-semibold text-primary hover:bg-[var(--bg-surface)]">
              <input type="file" accept={ADMIN_IMAGE_ACCEPT} className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              {uploading ? "Envoi…" : "Téléverser un logo"}
            </label>
            {form.logo ? (
              <div className="relative h-12 w-28 overflow-hidden rounded border border-[var(--border)] bg-[var(--bg-alt)]">
                <Image src={form.logo} alt="" fill className="object-contain p-1" sizes="112px" unoptimized={form.logo.startsWith("/uploads")} />
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <label className={labelCls}>Site web</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
            className={inputBase}
            placeholder="https://"
          />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Description (optionnel)</h3>
        <p className="text-xs text-[var(--text-3)]">Stockée en BDD — non affichée sur la page La FMA actuellement.</p>
        <div>
          <label className={labelCls}>Description (FR)</label>
          <textarea rows={3} value={form.descriptionFr} onChange={(e) => setForm((p) => ({ ...p, descriptionFr: e.target.value }))} className={inputBase} />
        </div>
        <div>
          <label className={labelCls}>Description (EN)</label>
          <textarea rows={3} value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} className={inputBase} />
        </div>
        <div>
          <label className={labelCls}>Description (AR)</label>
          <textarea rows={3} value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} className={inputBase} dir="rtl" />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Publication</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Ordre d’affichage</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
              className={inputBase}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--text-2)]">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                className="h-4 w-4 rounded border-[var(--border)] text-primary focus:ring-primary/30"
              />
              Visible sur le site (actif)
            </label>
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Enregistrer" : "Créer"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/membres")} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
