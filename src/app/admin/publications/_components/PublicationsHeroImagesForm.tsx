"use client";
import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT } from "@/lib/admin-upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonUploadLabel } from "@/lib/button-styles";
import { ADMIN_LOCALE_TABS, type AdminLocale } from "@/lib/admin-locale";
import { GALLERY_CATEGORIES, GALLERY_CONFIG, type GalleryCategory } from "@/lib/galleries";
import { PAGE_HERO_PREVIEW_CLASS, PAGE_HERO_SIZE_HINT } from "@/lib/page-hero";
import type {
  PublicationHeroType,
  PublicationsHeroImages,
} from "@/lib/publications-hero-images";

const TYPES = [
  { key: "chiffres-cles", label: "Chiffres clés" },
  { key: "faits-marquants", label: "Faits marquants" },
  { key: "courrier", label: "Le Courrier de l'assurance" },
  ...GALLERY_CATEGORIES.map((category) => ({
    key: category,
    label: GALLERY_CONFIG[category].title.fr,
  })),
] as const;

type PubType = "chiffres-cles" | "faits-marquants" | "courrier" | GalleryCategory;

const inputBase =
  "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

export default function PublicationsHeroImagesForm({
  initial,
}: {
  initial: PublicationsHeroImages;
}) {
  const router = useRouter();
  const [images, setImages] = useState<PublicationsHeroImages>(initial);
  const [tab, setTab] = useState<AdminLocale>("fr");
  const [uploading, setUploading] = useState<PubType | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const currentTab = ADMIN_LOCALE_TABS.find((t) => t.key === tab)!;

  const setForType = (typeKey: PublicationHeroType, value: string) => {
    setImages((prev) => ({
      ...prev,
      [typeKey]: { ...prev[typeKey], [tab]: value },
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, typeKey: PubType) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(typeKey);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "publications-hero");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Échec de l'upload");
        return;
      }
      if (typeof data.url === "string") setForType(typeKey, data.url);
    } catch {
      setError("Erreur réseau lors de l'upload");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/publications-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.message || "Erreur");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 mb-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-primary flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Images hero par type de publication
        </h2>
        <div className="flex gap-2">
          {ADMIN_LOCALE_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                tab === t.key
                  ? "bg-primary text-white border-primary"
                  : "bg-[var(--bg-surface)] text-[var(--text-2)] border-[var(--border)] hover:bg-[var(--bg-alt)] hover:text-[var(--text-1)]"
              )}
            >
              {t.flag} {t.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-[var(--text-3)]">
        Photo d&apos;en-tête par type pour l&apos;onglet <strong>{currentTab.label}</strong> (
        <code className="text-[var(--text-2)]">/{tab}/publications?type=…</code>). Sur EN/AR, repli sur la photo FR si vide.
        Taille recommandée&nbsp;: <span className="text-[var(--text-2)]">{PAGE_HERO_SIZE_HINT}</span>.
        L&apos;image <strong className="text-[var(--text-2)]">Chiffres clés</strong> est aussi modifiable dans{" "}
        <a href="/admin/chiffres-cles" className="font-semibold text-primary hover:underline">
          Admin → Chiffres clés
        </a>
        .
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TYPES.map(({ key: typeKey, label }) => {
          const url = images[typeKey][tab];
          const isUploading = uploading === typeKey;
          return (
            <div key={typeKey} className="space-y-2">
              <p className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide">
                {label} — {tab.toUpperCase()}
              </p>

              <div
                className={cn(
                  PAGE_HERO_PREVIEW_CLASS,
                  !url && "bg-[var(--bg-alt)] flex items-center justify-center"
                )}
              >
                {url ? (
                  <>
                    <Image
                      src={url}
                      alt={`${label} ${tab}`}
                      fill
                      className="object-cover"
                      unoptimized={url.startsWith("/uploads")}
                    />
                    <button
                      type="button"
                      onClick={() => setForType(typeKey, "")}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-lg p-1.5 hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-[var(--text-3)]" />
                )}
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => setForType(typeKey, e.target.value)}
                className={inputBase}
                placeholder={`/uploads/publications-hero/… (${tab.toUpperCase()})`}
                disabled={isUploading}
              />

              <label
                className={cn(
                  buttonUploadLabel,
                  "flex items-center gap-2 justify-center w-full",
                  isUploading && "opacity-60 pointer-events-none"
                )}
              >
                <input
                  type="file"
                  accept={ADMIN_IMAGE_ACCEPT}
                  className="hidden"
                  onChange={(e) => handleUpload(e, typeKey)}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Envoi…
                  </>
                ) : (
                  "Importer une photo"
                )}
              </label>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button
          type="button"
          variant="primary"
          shape="rounded"
          size="md"
          onClick={handleSave}
          disabled={saving || !!uploading}
          isLoading={saving}
        >
          {!saving && <Save className="w-4 h-4" />}
          Enregistrer les images
        </Button>
        {success ? (
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Enregistré ✓</span>
        ) : null}
        {error ? <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span> : null}
      </div>
    </div>
  );
}
