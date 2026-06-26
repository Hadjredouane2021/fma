"use client";
import { useState } from "react";
import { ADMIN_IMAGE_ACCEPT, ADMIN_IMAGE_FORMATS_LABEL } from "@/lib/admin-upload";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, ImageOff, ImagePlus, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HomeHeroBackgroundPreview } from "@/components/admin/HomeHeroBackgroundPreview";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive, buttonFilterActive, buttonFilterInactive } from "@/lib/button-styles";
import {
  createEmptyHomeKeyFigure,
  HOME_KEY_FIGURES_MAX,
  HOME_KEY_FIGURES_MIN,
  type HomeKeyFigureValueSource,
} from "@/lib/home-site-public";
import type { HeroBackgroundType, HomeContent, Locale } from "@/lib/site-content";

const TABS: { key: Locale; flag: string; label: string; dir: "ltr" | "rtl" }[] = [
  { key: "fr", flag: "🇫🇷", label: "Français", dir: "ltr" },
  { key: "en", flag: "🇬🇧", label: "English",  dir: "ltr" },
  { key: "ar", flag: "🇲🇦", label: "العربية",  dir: "rtl" },
];

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls =
  "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const card =
  "bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6";

const VALUE_SOURCE_OPTIONS: { value: HomeKeyFigureValueSource; label: string }[] = [
  { value: "manual", label: "Valeur manuelle" },
  { value: "contribution", label: "Taux de contribution (%)" },
  { value: "revenue", label: "Chiffre d'affaires (tableau)" },
];

export default function HomeContentForm({
  initial,
  chiffresClesRows = [],
}: {
  initial: HomeContent;
  chiffresClesRows?: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [content, setContent] = useState<HomeContent>(initial);
  const [tab, setTab] = useState<Locale>("fr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingKeyFiguresImg, setUploadingKeyFiguresImg] = useState(false);

  const currentTab = TABS.find((t) => t.key === tab)!;

  const setBadgeFor    = (lang: Locale, v: string) => setContent((c) => ({ ...c, badge:    { ...c.badge,    [lang]: v } }));
  const setTitleFor    = (lang: Locale, v: string) => setContent((c) => ({ ...c, title:    { ...c.title,    [lang]: v } }));
  const setSubtitleFor = (lang: Locale, v: string) => setContent((c) => ({ ...c, subtitle: { ...c.subtitle, [lang]: v } }));
  const setKeyFiguresEyebrow = (lang: Locale, v: string) =>
    setContent((c) => ({
      ...c,
      keyFiguresSection: {
        ...c.keyFiguresSection,
        eyebrow: { ...c.keyFiguresSection.eyebrow, [lang]: v },
      },
    }));
  const setKeyFiguresCaption = (lang: Locale, v: string) =>
    setContent((c) => ({
      ...c,
      keyFiguresSection: {
        ...c.keyFiguresSection,
        figureCaption: { ...c.keyFiguresSection.figureCaption, [lang]: v },
      },
    }));
  const setKeyFiguresImage = (imageUrl: string) =>
    setContent((c) => ({
      ...c,
      keyFiguresSection: { ...c.keyFiguresSection, imageUrl },
    }));

  const setCtaLabel = (idx: 1 | 2, lang: Locale, v: string) =>
    setContent((c) => {
      const key = idx === 1 ? "cta1" : "cta2";
      return { ...c, [key]: { ...c[key], label: { ...c[key].label, [lang]: v } } } as HomeContent;
    });
  const setCtaHref = (idx: 1 | 2, v: string) =>
    setContent((c) => {
      const key = idx === 1 ? "cta1" : "cta2";
      return { ...c, [key]: { ...c[key], href: v } } as HomeContent;
    });

  const setKeyFigure = (idx: number, patch: Partial<HomeContent["keyFigures"][number]>) =>
    setContent((c) => {
      const next = [...c.keyFigures];
      next[idx] = { ...next[idx], ...patch } as HomeContent["keyFigures"][number];
      return { ...c, keyFigures: next };
    });
  const setKeyFigureLabel = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.keyFigures];
      next[idx] = { ...next[idx], label: { ...next[idx].label, [lang]: v } };
      return { ...c, keyFigures: next };
    });
  const setKeyFigureDescription = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.keyFigures];
      next[idx] = { ...next[idx], description: { ...next[idx].description, [lang]: v } };
      return { ...c, keyFigures: next };
    });
  const setKeyFigureStackGroup = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.keyFigures];
      const current = next[idx].stackGroup ?? { fr: "", en: "", ar: "" };
      next[idx] = { ...next[idx], stackGroup: { ...current, [lang]: v } };
      return { ...c, keyFigures: next };
    });

  const setGlobalFigure = (patch: Partial<HomeContent["keyFiguresSection"]["globalFigure"]>) =>
    setContent((c) => ({
      ...c,
      keyFiguresSection: { ...c.keyFiguresSection, globalFigure: { ...c.keyFiguresSection.globalFigure, ...patch } },
    }));
  const setGlobalFigureLabel = (lang: Locale, v: string) =>
    setContent((c) => ({
      ...c,
      keyFiguresSection: {
        ...c.keyFiguresSection,
        globalFigure: {
          ...c.keyFiguresSection.globalFigure,
          label: { ...c.keyFiguresSection.globalFigure.label, [lang]: v },
        },
      },
    }));
  const setGlobalFigureDescription = (lang: Locale, v: string) =>
    setContent((c) => ({
      ...c,
      keyFiguresSection: {
        ...c.keyFiguresSection,
        globalFigure: {
          ...c.keyFiguresSection.globalFigure,
          description: { ...c.keyFiguresSection.globalFigure.description, [lang]: v },
        },
      },
    }));
  const addKeyFigure = () =>
    setContent((c) => {
      if (c.keyFigures.length >= HOME_KEY_FIGURES_MAX) return c;
      return { ...c, keyFigures: [...c.keyFigures, createEmptyHomeKeyFigure()] };
    });
  const removeKeyFigure = (idx: number) =>
    setContent((c) => {
      if (c.keyFigures.length <= HOME_KEY_FIGURES_MIN) return c;
      return { ...c, keyFigures: c.keyFigures.filter((_, i) => i !== idx) };
    });

  const setHeroBgType = (type: HeroBackgroundType) =>
    setContent((c) => ({ ...c, hero: { ...c.hero, background: { ...c.hero.background, type } } }));
  const setHeroBgColor = (color: string) =>
    setContent((c) => ({ ...c, hero: { ...c.hero, background: { ...c.hero.background, color } } }));
  const setHeroBgImage = (imageUrl: string) =>
    setContent((c) => ({ ...c, hero: { ...c.hero, background: { ...c.hero.background, imageUrl } } }));
  const setHeroOverlays = (showOverlays: boolean) =>
    setContent((c) => ({ ...c, hero: { ...c.hero, background: { ...c.hero.background, showOverlays } } }));

  const handleKeyFiguresImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingKeyFiguresImg(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "key-figures-hero");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok) {
        setError(data.message || "Échec de l'upload");
        return;
      }
      if (typeof data.url === "string") setKeyFiguresImage(data.url);
    } catch {
      setError("Erreur réseau lors de l'upload");
    } finally {
      setUploadingKeyFiguresImg(false);
    }
  };

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingBg(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "hero-backgrounds");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok) {
        setError(data.message || "Échec de l'upload");
        return;
      }
      if (typeof data.url === "string") {
        setHeroBgImage(data.url);
        setHeroBgType("image");
      }
    } catch {
      setError("Erreur réseau lors de l'upload");
    } finally {
      setUploadingBg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSuccess(true);
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

  const handleReset = () => {
    setContent(initial);
    setError("");
    setSuccess(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-5xl">
      {/* ── Tabs langues + textes localisés ── */}
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2">
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
          <a
            href={`/${tab}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Eye className="w-3.5 h-3.5" />
            Aperçu du site en {TABS.find((t) => t.key === tab)!.label}
          </a>
        </div>

        <div className="space-y-6" dir={currentTab.dir}>
          <div>
            <label className={labelCls}>
              {tab === "ar" ? "الشارة" : "Badge"}
              <span className="text-[var(--text-3)] font-normal normal-case ml-1">
                (petite étiquette au-dessus du titre)
              </span>
            </label>
            <input
              type="text"
              value={content.badge[tab]}
              onChange={(e) => setBadgeFor(tab, e.target.value)}
              className={inputBase}
            />
          </div>

          <div>
            <label className={labelCls}>
              {tab === "ar" ? "العنوان الرئيسي" : tab === "en" ? "Main title" : "Titre principal"}
            </label>
            <input
              type="text"
              value={content.title[tab]}
              onChange={(e) => setTitleFor(tab, e.target.value)}
              className={`${inputBase} text-base font-semibold`}
            />
          </div>

          <div>
            <label className={labelCls}>
              {tab === "ar" ? "العنوان الفرعي" : tab === "en" ? "Subtitle" : "Sous-titre"}
            </label>
            <textarea
              rows={3}
              value={content.subtitle[tab]}
              onChange={(e) => setSubtitleFor(tab, e.target.value)}
              className={`${inputBase} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                {tab === "ar" ? "زر رقم 1 (الكلمات)" : tab === "en" ? "Button 1 (label)" : "Bouton 1 (libellé)"}
              </label>
              <input
                type="text"
                value={content.cta1.label[tab]}
                onChange={(e) => setCtaLabel(1, tab, e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelCls}>
                {tab === "ar" ? "زر رقم 2 (الكلمات)" : tab === "en" ? "Button 2 (label)" : "Bouton 2 (libellé)"}
              </label>
              <input
                type="text"
                value={content.cta2.label[tab]}
                onChange={(e) => setCtaLabel(2, tab, e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Fond du hero (non multilingue) ── */}
      <section className={`${card} space-y-5`}>
        <div>
          <h3 className="font-bold text-[var(--text-1)] text-sm">Fond du hero</h3>
          <p className="text-xs text-[var(--text-3)] mt-1">
            Personnalise le fond de la grande section d'accueil. Tu peux garder le rendu par défaut,
            choisir une couleur unie ou téléverser une image.
          </p>
        </div>

        {/* Type de fond — 3 boutons-radio stylisés. */}
        <div className="grid grid-cols-3 gap-2">
          {([
            { key: "default", label: "Par défaut" },
            { key: "color",   label: "Couleur unie" },
            { key: "image",   label: "Image" },
          ] as { key: HeroBackgroundType; label: string }[]).map((opt) => {
            const selected = content.hero.background.type === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setHeroBgType(opt.key)}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-sm font-medium border transition-all",
                  selected ? buttonFilterActive : buttonFilterInactive
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Conditionnel : color picker. */}
        {content.hero.background.type === "color" && (
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div>
              <label className={labelCls}>Couleur</label>
              <input
                type="color"
                value={
                  /^#[0-9a-f]{6}$/i.test(content.hero.background.color)
                    ? content.hero.background.color
                    : "#ffffff"
                }
                onChange={(e) => setHeroBgColor(e.target.value)}
                className="h-12 w-20 rounded-xl border border-[var(--border)] bg-[var(--bg)] cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className={labelCls}>
                Valeur CSS
                <span className="text-[var(--text-3)] font-normal normal-case ml-1">
                  (hex, rgb(), ou variable comme <code className="font-mono">var(--brand)</code>)
                </span>
              </label>
              <input
                type="text"
                value={content.hero.background.color}
                onChange={(e) => setHeroBgColor(e.target.value)}
                className={`${inputBase} font-mono text-sm`}
                placeholder="#ffffff"
              />
            </div>
          </div>
        )}

        {/* Conditionnel : upload + preview image. */}
        {content.hero.background.type === "image" && (
          <div className="space-y-3">
            <label className={labelCls}>Image de fond</label>
            {content.hero.background.imageUrl ? (
              <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
                <HomeHeroBackgroundPreview src={content.hero.background.imageUrl} />
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] bg-[var(--bg)] px-3 py-2">
                  <code className="text-xs font-mono text-[var(--text-3)] truncate max-w-full">
                    {content.hero.background.imageUrl}
                  </code>
                  <div className="flex gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-2)] hover:bg-[var(--bg-alt)] transition-colors">
                      <ImagePlus className="w-3.5 h-3.5" />
                      Remplacer
                      <input
                        type="file"
                        accept={ADMIN_IMAGE_ACCEPT}
                        onChange={handleHeroBgUpload}
                        className="hidden"
                        disabled={uploadingBg}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setHeroBgImage("")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <ImageOff className="w-3.5 h-3.5" />
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-alt)] hover:border-primary/40 transition-colors px-6 py-10 text-center">
                {uploadingBg ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-sm font-semibold text-[var(--text-2)]">Envoi en cours…</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-6 h-6 text-[var(--text-3)]" />
                    <span className="text-sm font-semibold text-[var(--text-2)]">Cliquer pour téléverser une image</span>
                    <span className="text-xs text-[var(--text-3)]">
                      {ADMIN_IMAGE_FORMATS_LABEL} — max 16&nbsp;Mo. Recommandé&nbsp;: 2560×1440&nbsp;px (moins de 3000&nbsp;px de large).
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept={ADMIN_IMAGE_ACCEPT}
                  onChange={handleHeroBgUpload}
                  className="hidden"
                  disabled={uploadingBg}
                />
              </label>
            )}
          </div>
        )}

        {/* Toggle décorations. */}
        <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-[var(--border)]">
          <input
            type="checkbox"
            checked={content.hero.background.showOverlays}
            onChange={(e) => setHeroOverlays(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[var(--border)] text-primary focus:ring-primary/20"
          />
          <span className="flex-1">
            <span className="block text-sm font-semibold text-[var(--text-1)]">
              Afficher les décorations
            </span>
            <span className="block text-xs text-[var(--text-3)] mt-0.5">
              Halos colorés et texture de bruit subtile par-dessus le fond. Désactive pour un rendu net,
              utile avec une image de fond.
            </span>
          </span>
        </label>
      </section>

      {/* ── Destinations des boutons (non multilingue) ── */}
      <section className={`${card} space-y-4`}>
        <h3 className="font-bold text-[var(--text-1)] text-sm">Destinations des boutons</h3>
        <p className="text-xs text-[var(--text-3)]">
          Chemin relatif à la langue. Exemple&nbsp;: <code className="font-mono">la-fma</code> →{" "}
          <code className="font-mono">/fr/la-fma</code>, <code className="font-mono">/en/la-fma</code>, …
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Lien du bouton 1</label>
            <input
              type="text"
              value={content.cta1.href}
              onChange={(e) => setCtaHref(1, e.target.value)}
              className={`${inputBase} font-mono text-sm`}
              placeholder="la-fma"
            />
            <p className="text-xs text-[var(--text-3)] mt-1 font-mono">
              /fr/<span className="text-[var(--blue)]">{content.cta1.href}</span>
            </p>
          </div>
          <div>
            <label className={labelCls}>Lien du bouton 2</label>
            <input
              type="text"
              value={content.cta2.href}
              onChange={(e) => setCtaHref(2, e.target.value)}
              className={`${inputBase} font-mono text-sm`}
              placeholder="publications"
            />
            <p className="text-xs text-[var(--text-3)] mt-1 font-mono">
              /fr/<span className="text-[var(--blue)]">{content.cta2.href}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Chiffres clés ── */}
      <section className={`${card} space-y-5`}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-bold text-[var(--text-1)] text-sm">
              Chiffres clés ({content.keyFigures.length}/{HOME_KEY_FIGURES_MAX})
            </h3>
            <p className="text-xs text-[var(--text-3)] mt-1">
              Choisissez par carte : valeur manuelle (ex. 8,7 Mds) ou liaison vers{" "}
              <a href="/admin/chiffres-cles" className="font-semibold text-primary hover:underline">
                Chiffres clés
              </a>
              {" "}(taux % ou CA du tableau).
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addKeyFigure}
            disabled={content.keyFigures.length >= HOME_KEY_FIGURES_MAX}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter une valeur
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div dir={currentTab.dir}>
            <label className={labelCls}>
              Titre de la section
              <span className="text-[var(--text-3)] font-normal normal-case ml-1">(majuscules sur le site)</span>
            </label>
            <input
              type="text"
              value={content.keyFiguresSection.eyebrow[tab]}
              onChange={(e) => setKeyFiguresEyebrow(tab, e.target.value)}
              className={inputBase}
              placeholder="Chiffres clés S1 2024"
            />
          </div>
          <div dir={currentTab.dir}>
            <label className={labelCls}>Légende sous chaque chiffre</label>
            <input
              type="text"
              value={content.keyFiguresSection.figureCaption[tab]}
              onChange={(e) => setKeyFiguresCaption(tab, e.target.value)}
              className={inputBase}
              placeholder="des primes émises"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Image illustrative (colonne gauche)</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={content.keyFiguresSection.imageUrl}
              onChange={(e) => setKeyFiguresImage(e.target.value)}
              className={`${inputBase} font-mono text-sm flex-1`}
              placeholder="/key-figures-growth.png"
            />
            <label
              className={cn(
                "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-semibold text-[var(--text-1)] transition-colors hover:bg-[var(--hover-bg)]",
                uploadingKeyFiguresImg && "pointer-events-none opacity-60"
              )}
            >
              <input type="file" accept={ADMIN_IMAGE_ACCEPT} className="hidden" onChange={handleKeyFiguresImgUpload} disabled={uploadingKeyFiguresImg} />
              {uploadingKeyFiguresImg ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              Importer
            </label>
          </div>
          {content.keyFiguresSection.imageUrl && (
            <div className="relative mt-3 h-40 w-28 overflow-hidden rounded-xl border border-[var(--border)]">
              <Image src={content.keyFiguresSection.imageUrl} alt="Aperçu chiffres clés" fill className="object-cover" unoptimized={content.keyFiguresSection.imageUrl.startsWith("/uploads")} />
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-3" dir={currentTab.dir}>
          <h4 className="text-xs font-bold uppercase tracking-wide text-primary">
            Carte « Chiffre d&apos;affaires global »
            <span className="text-[var(--text-3)] font-normal normal-case ml-1">
              (affichée au-dessus de la grille ; valeur manuelle vide = masquée. Liaison possible vers le{" "}
              <a href="/admin/chiffres-cles" className="font-semibold text-primary hover:underline">tableau Chiffres clés</a>.)
            </span>
          </h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className={labelCls}>Source de la valeur</label>
              <select
                value={content.keyFiguresSection.globalFigure.valueSource}
                onChange={(e) =>
                  setGlobalFigure({
                    valueSource: e.target.value as HomeKeyFigureValueSource,
                    chiffresClesRowId: e.target.value === "manual" ? "" : content.keyFiguresSection.globalFigure.chiffresClesRowId,
                  })
                }
                className={inputBase}
              >
                {VALUE_SOURCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {content.keyFiguresSection.globalFigure.valueSource !== "manual" && (
              <div>
                <label className={labelCls}>Ligne Chiffres clés</label>
                <select
                  value={content.keyFiguresSection.globalFigure.chiffresClesRowId}
                  onChange={(e) => setGlobalFigure({ chiffresClesRowId: e.target.value })}
                  className={inputBase}
                >
                  <option value="">— Choisir une ligne —</option>
                  {chiffresClesRows.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_160px_1fr]">
            <div>
              <label className={labelCls}>
                Valeur
                {content.keyFiguresSection.globalFigure.valueSource === "contribution" && (
                  <span className="text-[var(--text-3)] font-normal normal-case ml-1">(depuis taux %)</span>
                )}
              </label>
              <input
                type="text"
                value={content.keyFiguresSection.globalFigure.value}
                onChange={(e) => setGlobalFigure({ value: e.target.value })}
                className={`${inputBase} font-bold`}
                placeholder="64269.4"
                disabled={content.keyFiguresSection.globalFigure.valueSource === "contribution"}
              />
            </div>
            <div>
              <label className={labelCls}>Suffixe</label>
              <input
                type="text"
                value={content.keyFiguresSection.globalFigure.valueSource === "contribution" ? "%" : content.keyFiguresSection.globalFigure.suffix}
                onChange={(e) => setGlobalFigure({ suffix: e.target.value })}
                className={inputBase}
                placeholder="MDH"
                disabled={content.keyFiguresSection.globalFigure.valueSource === "contribution"}
              />
            </div>
            <div>
              <label className={labelCls}>Libellé ({currentTab.label})</label>
              <input
                type="text"
                value={content.keyFiguresSection.globalFigure.label[tab]}
                onChange={(e) => setGlobalFigureLabel(tab, e.target.value)}
                className={inputBase}
                placeholder="Chiffre d'affaires global"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>
              Description dépliable ({currentTab.label})
              <span className="text-[var(--text-3)] font-normal normal-case ml-1">(affichée au clic sur le chevron, optionnel)</span>
            </label>
            <textarea
              rows={2}
              value={content.keyFiguresSection.globalFigure.description[tab]}
              onChange={(e) => setGlobalFigureDescription(tab, e.target.value)}
              className={inputBase}
            />
          </div>
        </div>

        <div className="space-y-3" dir={currentTab.dir}>
          {content.keyFigures.map((fig, idx) => {
            const linked = fig.valueSource !== "manual";
            const valueLocked = fig.valueSource === "contribution";
            return (
            <div
              key={idx}
              className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-3"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Source de la valeur</label>
                  <select
                    value={fig.valueSource}
                    onChange={(e) =>
                      setKeyFigure(idx, {
                        valueSource: e.target.value as HomeKeyFigureValueSource,
                        chiffresClesRowId: e.target.value === "manual" ? "" : fig.chiffresClesRowId,
                      })
                    }
                    className={inputBase}
                  >
                    {VALUE_SOURCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                {linked && (
                  <div>
                    <label className={labelCls}>Ligne Chiffres clés</label>
                    <select
                      value={fig.chiffresClesRowId}
                      onChange={(e) => setKeyFigure(idx, { chiffresClesRowId: e.target.value })}
                      className={inputBase}
                    >
                      <option value="">— Choisir une ligne —</option>
                      {chiffresClesRows.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[120px_160px_1fr_auto]">
              <div>
                <label className={labelCls}>
                  Valeur
                  {valueLocked && (
                    <span className="text-[var(--text-3)] font-normal normal-case ml-1">(depuis taux %)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={fig.value}
                  onChange={(e) => setKeyFigure(idx, { value: e.target.value })}
                  className={`${inputBase} font-bold`}
                  placeholder="47"
                  disabled={valueLocked}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Suffixe
                  <span className="text-[var(--text-3)] font-normal normal-case ml-1">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={fig.valueSource === "contribution" ? "%" : fig.suffix}
                  onChange={(e) => setKeyFigure(idx, { suffix: e.target.value })}
                  className={inputBase}
                  placeholder="ex. Mds MAD, +, ans…"
                  disabled={fig.valueSource === "contribution"}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Libellé ({currentTab.label})
                </label>
                <input
                  type="text"
                  value={fig.label[tab]}
                  onChange={(e) => setKeyFigureLabel(idx, tab, e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>
                  Groupe empilé ({currentTab.label})
                  <span className="text-[var(--text-3)] font-normal normal-case ml-1">
                    (même texte sur des cartes consécutives = pile verticale sous ce titre)
                  </span>
                </label>
                <input
                  type="text"
                  value={fig.stackGroup?.[tab] ?? ""}
                  onChange={(e) => setKeyFigureStackGroup(idx, tab, e.target.value)}
                  className={inputBase}
                  placeholder="ex. RÉASSURANCE EXCLUSIVE"
                />
              </div>
              <div className="flex items-end justify-end md:pb-1">
                <button
                  type="button"
                  onClick={() => removeKeyFigure(idx)}
                  disabled={content.keyFigures.length <= HOME_KEY_FIGURES_MIN}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:pointer-events-none disabled:opacity-40 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60"
                  title="Supprimer ce chiffre"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only md:not-sr-only">Supprimer</span>
                </button>
              </div>
              </div>
              <div>
                <label className={labelCls}>
                  Description dépliable ({currentTab.label})
                  <span className="text-[var(--text-3)] font-normal normal-case ml-1">(affichée au clic sur le chevron, optionnel)</span>
                </label>
                <textarea
                  rows={2}
                  value={fig.description[tab]}
                  onChange={(e) => setKeyFigureDescription(idx, tab, e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* ── Feedback ── */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-300">
          ⚠️ {error}
        </div>
      )}
      {success && !error && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/60 rounded-xl px-4 py-3 text-sm text-green-700 dark:text-green-300">
          ✅ Contenu mis à jour. Les changements seront visibles sur le site dès la prochaine requête (cache invalidé).
        </div>
      )}

      <div className="flex flex-wrap gap-3 pb-4">
        <Button type="submit" variant="primary" isLoading={loading} size="lg">
          <Save className="w-4 h-4" />
          Enregistrer
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
          Annuler les changements
        </Button>
      </div>
    </form>
  );
}
