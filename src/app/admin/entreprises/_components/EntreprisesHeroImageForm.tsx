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
import { PAGE_HERO_PREVIEW_CLASS, PAGE_HERO_SIZE_HINT } from "@/lib/page-hero";
import {
  EMPTY_ENTREPRISES_HERO_IMAGE_URLS,
  type EntreprisesHeroImageUrls,
} from "@/lib/entreprises-hero-image";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm font-mono";

export default function EntreprisesHeroImageForm({
  initial = EMPTY_ENTREPRISES_HERO_IMAGE_URLS,
}: {
  initial?: EntreprisesHeroImageUrls;
}) {
  const router = useRouter();
  const [images, setImages] = useState<EntreprisesHeroImageUrls>(initial);
  const [tab, setTab] = useState<AdminLocale>("fr");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const currentTab = ADMIN_LOCALE_TABS.find((t) => t.key === tab)!;
  const imageUrl = images[tab];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "entreprises-hero");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.message || "Échec de l'upload"); return; }
      if (typeof data.url === "string") setImages((prev) => ({ ...prev, [tab]: data.url }));
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
      const res = await fetch("/api/admin/site/entreprises-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images),
      });
      if (res.ok) { setSuccess(true); router.refresh(); }
      else { const d = await res.json().catch(() => ({})); setError(d.message || "Erreur"); }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <h2 className="text-sm font-bold text-primary flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Image hero — page Entreprises &amp; Professionnels
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
      <p className="text-xs text-[var(--text-3)] mb-4">
        Affichée en haut de la page Entreprises &amp; Professionnels pour l&apos;onglet{" "}
        <strong>{currentTab.label}</strong>. Sur EN/AR, repli sur la photo FR si vide.
        <br />
        Taille recommandée&nbsp;: <span className="text-[var(--text-2)]">{PAGE_HERO_SIZE_HINT}</span>.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImages((prev) => ({ ...prev, [tab]: e.target.value }))}
          className={`${inputBase} flex-1`}
          placeholder={`/uploads/entreprises-hero/… (${tab.toUpperCase()})`}
          disabled={uploading}
        />
        <label className={cn(buttonUploadLabel, "inline-flex items-center gap-2", uploading && "opacity-60 pointer-events-none")}>
          <input type="file" accept={ADMIN_IMAGE_ACCEPT} className="hidden" onChange={handleUpload} disabled={uploading} />
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Envoi…</> : "Importer une photo"}
        </label>
      </div>
      {imageUrl && (
        <div className={cn("mb-4", PAGE_HERO_PREVIEW_CLASS)}>
          <Image
            src={imageUrl}
            alt={`Aperçu Entreprises ${tab}`}
            fill
            className="object-cover object-center"
            unoptimized={imageUrl.startsWith("/uploads")}
          />
          <button
            type="button"
            onClick={() => setImages((prev) => ({ ...prev, [tab]: "" }))}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-lg p-1.5 hover:bg-red-700 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-4">
        <Button type="button" variant="primary" shape="rounded" size="md" onClick={handleSave} disabled={saving || uploading} isLoading={saving}>
          {!saving && <Save className="w-4 h-4" />}
          Enregistrer
        </Button>
        {success && <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Enregistré ✓</span>}
        {error && <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span>}
      </div>
    </div>
  );
}
