"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LoaderPinwheel, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/common/PageSpinner";
import { cn } from "@/lib/utils";
import { buttonUploadLabel } from "@/lib/button-styles";
import { spinnerImageUnoptimized, type SiteSpinnerSettings } from "@/lib/site-spinner";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm";

export default function SpinnerLogoForm({ initial }: { initial: SiteSpinnerSettings }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "site-spinner");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.message as string) || "Échec de l'upload");
        return;
      }
      if (typeof data.url === "string") setImageUrl(data.url);
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
      const res = await fetch("/api/admin/site/spinner-logo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
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
        <LoaderPinwheel className="h-4 w-4" />
        Logo du spinner (chargement)
      </h2>
      <p className="relative z-10 mb-6 text-xs text-[var(--text-3)]">
        Image affichée au centre du spinner lors de la navigation et du chargement des pages (site public et admin).
        Formats : JPEG, PNG, WebP, GIF ou SVG. Taille recommandée : carré, fond transparent ou blanc.
      </p>

      <div className="relative z-10 space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
            Image du spinner
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={cn(inputBase, "flex-1 font-mono text-sm")}
              placeholder="/logo-fma-spinner.png"
              disabled={uploading}
            />
            <label className={cn(buttonUploadLabel, uploading && "pointer-events-none opacity-60")}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="sr-only"
                onChange={handleUpload}
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                </>
              ) : (
                "Importer"
              )}
            </label>
          </div>
        </div>

        {imageUrl ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-white p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">Aperçu image</p>
              <Image
                src={imageUrl}
                alt="Aperçu spinner"
                width={120}
                height={120}
                className="mx-auto h-auto max-h-24 w-auto max-w-full object-contain"
                unoptimized={spinnerImageUnoptimized(imageUrl)}
              />
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">Aperçu spinner</p>
              <PageSpinner imageUrl={imageUrl} className="min-h-0 py-0" label="" />
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
            Spinner enregistré.
          </div>
        ) : null}

        <Button type="button" variant="primary" onClick={handleSave} isLoading={saving} disabled={uploading}>
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
