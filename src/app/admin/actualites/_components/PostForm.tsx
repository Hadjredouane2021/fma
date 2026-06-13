"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive, buttonUploadLabel } from "@/lib/button-styles";
import { generateSlug } from "@/lib/utils";
import type { Category } from "@/types";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-[var(--border)] rounded-xl bg-[var(--bg-surface)] animate-pulse h-48" />
  ),
});

interface PostFormProps {
  categories: Category[];
  initialData?: Record<string, unknown>;
}

export default function PostForm({ categories, initialData }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"fr" | "en" | "ar">("fr");

  const [form, setForm] = useState({
    titleFr:        (initialData?.titleFr as string)        || "",
    titleEn:        (initialData?.titleEn as string)        || "",
    titleAr:        (initialData?.titleAr as string)        || "",
    slug:           (initialData?.slug as string)           || "",
    excerptFr:      (initialData?.excerptFr as string)      || "",
    excerptEn:      (initialData?.excerptEn as string)      || "",
    excerptAr:      (initialData?.excerptAr as string)      || "",
    contentFr:      (initialData?.contentFr as string)      || "",
    contentEn:      (initialData?.contentEn as string)      || "",
    contentAr:      (initialData?.contentAr as string)      || "",
    status:         (initialData?.status as string)         || "DRAFT",
    publishedAt:    initialData?.publishedAt
      ? new Date(initialData.publishedAt as string).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    featured:       (initialData?.featured as boolean)      || false,
    categoryId:     (initialData?.categoryId as string)     || "",
    seoTitle:       (initialData?.seoTitle as string)       || "",
    seoDescription: (initialData?.seoDescription as string) || "",
    featuredImage:  (initialData?.featuredImage as string)  || "",
  });

  const isEdit = Boolean(initialData?.id);

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, titleFr: val, slug: f.slug || generateSlug(val) }));
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingImage(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "posts");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.message as string) || "Échec de l’upload");
        return;
      }
      if (typeof data.url === "string") setForm((prev) => ({ ...prev, featuredImage: data.url }));
    } catch {
      setError("Erreur réseau lors de l’upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/admin/posts/${initialData!.id}` : "/api/admin/posts";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/actualites");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Erreur réseau — vérifiez votre connexion");
    }
    setLoading(false);
  };

  const inputBase = "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
  const label = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
  const card = "bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6";

  const TABS = [
    { key: "fr" as const, flag: "🇫🇷", label: "Français", dir: "ltr" as const },
    { key: "en" as const, flag: "🇬🇧", label: "English",  dir: "ltr" as const },
    { key: "ar" as const, flag: "🇲🇦", label: "العربية",   dir: "rtl" as const },
  ];

  const currentTab = TABS.find((t) => t.key === tab)!;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── Language tabs ── */}
      <div className={card}>
        <div className="flex gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium",
                tab === t.key ? buttonTabActive : buttonTabInactive
              )}
            >
              {t.flag} {t.label}
            </button>
          ))}
        </div>

        <div className={tab === "ar" ? "space-y-6" : "space-y-6"} dir={currentTab.dir}>

          {/* Titre */}
          <div>
            <label className={label}>
              {tab === "ar" ? "العنوان" : tab === "en" ? "Title" : "Titre"} *
            </label>
            {tab === "fr" && (
              <>
                <input
                  type="text"
                  required
                  value={form.titleFr}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={`${inputBase} text-[13px] font-semibold font-['Segoe_UI_Emoji']`}
                  placeholder="Titre de l'article en français…"
                />
                {form.slug && (
                  <p className="text-xs text-[var(--text-3)] mt-1 font-mono">
                    /fr/actualites/<span className="text-[var(--blue)]">{form.slug}</span>
                  </p>
                )}
              </>
            )}
            {tab === "en" && (
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className={`${inputBase} text-[13px] font-semibold font-['Segoe_UI_Emoji']`}
                placeholder="Article title in English…"
              />
            )}
            {tab === "ar" && (
              <input
                type="text"
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                className={`${inputBase} text-[13px] font-semibold font-['Segoe_UI_Emoji']`}
                placeholder="عنوان المقال بالعربية…"
              />
            )}
          </div>

          {/* Extrait */}
          <div>
            <label className={label}>
              {tab === "ar" ? "ملخص" : tab === "en" ? "Excerpt" : "Extrait"}
              <span className="text-[var(--text-3)] font-normal normal-case ml-1">
                (résumé affiché dans les listes)
              </span>
            </label>
            {tab === "fr" && (
              <RichTextEditor
                value={form.excerptFr}
                onChange={(html) => setForm({ ...form, excerptFr: html })}
                placeholder="Résumé court de l'article (2-3 phrases)…"
                dir="ltr"
                minHeight="100px"
              />
            )}
            {tab === "en" && (
              <RichTextEditor
                value={form.excerptEn}
                onChange={(html) => setForm({ ...form, excerptEn: html })}
                placeholder="Short article summary (2-3 sentences)…"
                dir="ltr"
                minHeight="100px"
              />
            )}
            {tab === "ar" && (
              <RichTextEditor
                value={form.excerptAr}
                onChange={(html) => setForm({ ...form, excerptAr: html })}
                placeholder="ملخص قصير للمقال (2-3 جمل)…"
                dir="rtl"
                minHeight="100px"
              />
            )}
          </div>

          {/* Contenu */}
          <div>
            <label className={label}>
              {tab === "ar" ? "المحتوى" : tab === "en" ? "Content" : "Contenu"} *
            </label>
            {tab === "fr" && (
              <RichTextEditor
                value={form.contentFr}
                onChange={(html) => setForm({ ...form, contentFr: html })}
                placeholder="Rédigez le contenu complet de l'article…"
                dir="ltr"
                minHeight="320px"
              />
            )}
            {tab === "en" && (
              <RichTextEditor
                value={form.contentEn}
                onChange={(html) => setForm({ ...form, contentEn: html })}
                placeholder="Write the full article content…"
                dir="ltr"
                minHeight="320px"
              />
            )}
            {tab === "ar" && (
              <RichTextEditor
                value={form.contentAr}
                onChange={(html) => setForm({ ...form, contentAr: html })}
                placeholder="اكتب محتوى المقال الكامل…"
                dir="rtl"
                minHeight="320px"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Settings ── */}
      <div className={`${card} space-y-4`}>
        <h3 className="font-bold text-[var(--text-1)] text-sm">Paramètres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Slug *</label>
            <input
              type="text" required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={`${inputBase} font-mono text-sm`}
            />
          </div>
          <div>
            <label className={label}>Catégorie</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputBase}>
              <option value="">— Aucune —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.nameFr}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Statut</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputBase}>
              <option value="DRAFT">📝 Brouillon</option>
              <option value="PUBLISHED">✅ Publié</option>
            </select>
          </div>
          <div>
            <label className={label}>Date de publication</label>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              className={inputBase}
            />
          </div>
          <div className="md:col-span-2">
            <label className={label}>Image principale</label>
            <p className="text-xs text-[var(--text-3)] mb-2">
              Saisissez une URL ou importez un fichier (max 4&nbsp;Mo — JPEG, PNG, WebP, GIF).
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-stretch">
              <input
                type="text"
                value={form.featuredImage}
                onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                className={`${inputBase} flex-1 min-w-0`}
                placeholder="https://… ou remplie après import"
                disabled={uploadingImage}
              />
              <label
                className={cn(buttonUploadLabel, uploadingImage && "opacity-60 pointer-events-none")}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={handleFeaturedImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage ? "Envoi…" : "Importer une image"}
              </label>
            </div>
            {form.featuredImage ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Image
                  src={form.featuredImage}
                  alt="Prévisualisation"
                  width={320}
                  height={128}
                  className="h-24 w-auto max-w-[280px] rounded-lg border border-[var(--border)] object-cover bg-[var(--bg-surface)]"
                  unoptimized={form.featuredImage.startsWith("http")}
                />
                <button
                  type="button"
                  className="text-xs font-semibold text-red-600 hover:underline"
                  onClick={() => setForm({ ...form, featuredImage: "" })}
                >
                  Retirer l’image
                </button>
              </div>
            ) : null}
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-primary" />
            <label htmlFor="featured" className="text-sm font-medium text-[var(--text-1)] cursor-pointer">⭐ Article à la une</label>
          </div>
        </div>
      </div>

      {/* ── SEO ── */}
      <div className={`${card} space-y-4`}>
        <h3 className="font-bold text-[var(--text-1)] text-sm">SEO</h3>
        <div>
          <label className={label}>Titre SEO <span className="text-[var(--text-3)] font-normal normal-case">{form.seoTitle.length}/60</span></label>
          <input type="text" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className={inputBase} maxLength={60} placeholder="Titre optimisé pour Google…" />
        </div>
        <div>
          <label className={label}>Meta description <span className="text-[var(--text-3)] font-normal normal-case">{form.seoDescription.length}/160</span></label>
          <textarea rows={2} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className={`${inputBase} resize-none`} maxLength={160} placeholder="Description pour les moteurs de recherche…" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      <div className="flex gap-4 pb-4">
        <Button type="submit" variant="primary" isLoading={loading} size="lg" disabled={uploadingImage}>
          {isEdit ? "💾 Mettre à jour" : "🚀 Publier l'article"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
      </div>
    </form>
  );
}
