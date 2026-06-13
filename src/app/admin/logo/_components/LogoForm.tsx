"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonUploadLabel } from "@/lib/button-styles";
import { siteLogoImageUnoptimized, type SiteLogoSettings } from "@/lib/site-logo";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm";

export default function LogoForm({ initial }: { initial: SiteLogoSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
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
      fd.append("folder", "site-logo");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.message as string) || "Échec de l'upload");
        return;
      }
      if (typeof data.url === "string") setForm((p) => ({ ...p, imageUrl: data.url }));
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
      const res = await fetch("/api/admin/site/logo", {
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
        <ImageIcon className="h-4 w-4" />
        Logo du site (header & footer)
      </h2>
      <p className="relative z-10 mb-6 text-xs text-[var(--text-3)]">
        Image officielle FMA (JPEG, PNG, WebP, GIF ou SVG). Affichée dans l&apos;en-tête et le pied de page.
      </p>

      <div className="relative z-10 space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
            Image du logo
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              className={cn(inputBase, "flex-1 font-mono text-sm")}
              placeholder="/logo-fma-full.png"
              disabled={uploading}
            />
            <label className={cn(buttonUploadLabel, uploading && "pointer-events-none opacity-60")}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
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

        {form.imageUrl ? (
          <div className="rounded-xl border border-[var(--border)] bg-white p-4">
            <Image
              src={form.imageUrl}
              alt="Aperçu logo FMA"
              width={320}
              height={120}
              className="h-auto max-h-24 w-auto max-w-full object-contain"
              unoptimized={siteLogoImageUnoptimized(form.imageUrl)}
            />
          </div>
        ) : null}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
            Lien au clic (optionnel)
          </label>
          <input
            type="url"
            value={form.linkUrl}
            onChange={(e) => setForm((p) => ({ ...p, linkUrl: e.target.value }))}
            className={inputBase}
            placeholder="Vide = page d'accueil (/fr, /en, /ar)"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
            Logo enregistré.
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
