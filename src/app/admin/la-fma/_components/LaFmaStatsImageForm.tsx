"use client";
import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT } from "@/lib/admin-upload";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonUploadLabel } from "@/lib/button-styles";
import { PAGE_HERO_PREVIEW_CLASS, PAGE_HERO_SIZE_HINT } from "@/lib/page-hero";
import {
  DEFAULT_LA_FMA_STATS_IMAGES,
  type LaFmaStatsImages,
} from "@/lib/la-fma-stats-image";
import type { Locale } from "@/types";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm font-mono";

type LaFmaStatsImageFormProps = {
  initial?: LaFmaStatsImages;
  activeTab: Locale;
  /** Intégré dans la carte multilingue (LaFmaContentForm). */
  embedded?: boolean;
};

export default function LaFmaStatsImageForm({
  initial = DEFAULT_LA_FMA_STATS_IMAGES,
  activeTab,
  embedded = false,
}: LaFmaStatsImageFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<LaFmaStatsImages>(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const imageUrl = images[activeTab];

  useEffect(() => {
    setImages(initial);
  }, [initial]);

  const setForTab = (lang: Locale, value: string) => {
    setImages((prev) => ({ ...prev, [lang]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "la-fma-stats");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Échec de l'upload");
        return;
      }
      if (typeof data.url === "string") setForTab(activeTab, data.url);
    } catch {
      setError("Erreur réseau lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/la-fma-stats", {
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

  const tabLabel =
    activeTab === "ar" ? "العربية" : activeTab === "en" ? "English" : "Français";

  const body = (
    <>
      <p className="text-xs text-[var(--text-3)] mb-4">
        Photo d&apos;en-tête pour l&apos;onglet <strong>{tabLabel}</strong> sur{" "}
        <code className="text-[var(--text-2)]">/{activeTab}/la-fma</code>. Sur EN/AR, repli sur la photo FR si vide.
        Taille recommandée&nbsp;: <span className="text-[var(--text-2)]">{PAGE_HERO_SIZE_HINT}</span>.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setForTab(activeTab, e.target.value)}
          className={`${inputBase} flex-1`}
          placeholder={`/uploads/la-fma-stats/… (${activeTab.toUpperCase()}, vide = défaut ou repli FR)`}
          disabled={uploading}
        />
        <label
          className={cn(
            buttonUploadLabel,
            "inline-flex items-center gap-2",
            uploading && "opacity-60 pointer-events-none"
          )}
        >
          <input type="file" accept={ADMIN_IMAGE_ACCEPT} className="hidden" onChange={handleUpload} disabled={uploading} />
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi…
            </>
          ) : (
            "Importer une photo"
          )}
        </label>
      </div>

      {imageUrl ? (
        <div className={cn("mb-4", PAGE_HERO_PREVIEW_CLASS)}>
          <Image
            src={imageUrl}
            alt={`Aperçu ${activeTab}`}
            fill
            className="object-cover object-center"
            unoptimized={imageUrl.startsWith("/uploads")}
          />
          <button
            type="button"
            onClick={() => setForTab(activeTab, "")}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-lg p-1.5 hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="button"
          variant="primary"
          shape="rounded"
          size={embedded ? "sm" : "md"}
          onClick={handleSave}
          disabled={saving || uploading}
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
    </>
  );

  if (embedded) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-alt)]/40 p-4 mt-4">
        <h4 className="text-xs font-bold text-primary mb-1 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5" />
          Image — {activeTab.toUpperCase()}
        </h4>
        {body}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 mb-8">
      <h2 className="text-sm font-bold text-primary mb-1 flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        Image — {activeTab.toUpperCase()}
      </h2>
      {body}
    </div>
  );
}
