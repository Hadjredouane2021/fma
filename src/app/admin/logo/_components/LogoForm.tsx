"use client";

import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT, ADMIN_IMAGE_FORMATS_LABEL } from "@/lib/admin-upload";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader2, Moon, Save, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonUploadLabel } from "@/lib/button-styles";
import { siteLogoImageUnoptimized, DEFAULT_SITE_LOGO, type SiteLogoSettings } from "@/lib/site-logo";
import { SiteLogoFromSettings } from "@/components/common/SiteLogo";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm";

type LogoField = "imageUrl" | "imageUrlDark";

export default function LogoForm({ initial }: { initial: SiteLogoSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [uploadingField, setUploadingField] = useState<LogoField | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const uploading = uploadingField !== null;

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const handleUpload = (field: LogoField) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingField(field);
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
      if (typeof data.url === "string") setForm((p) => ({ ...p, [field]: data.url }));
    } catch {
      setError("Erreur réseau lors de l'upload");
    } finally {
      setUploadingField(null);
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
        Images officielles FMA ({ADMIN_IMAGE_FORMATS_LABEL}). Les URLs enregistrées ici alimentent
        directement le header et le footer du site public.
      </p>

      <div className="relative z-10 mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
          Aperçu site public (header)
        </p>
        <SiteLogoFromSettings
          settings={form}
          imageClassName="h-10 w-auto max-w-[13rem] object-contain object-left"
        />
      </div>

      <div className="relative z-10 space-y-6">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
            <Sun className="h-3.5 w-3.5" />
            Logo — mode clair
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              className={cn(inputBase, "flex-1 font-mono text-sm")}
              placeholder="/logo-fma-full.svg"
              disabled={uploading}
            />
            <label
              className={cn(
                buttonUploadLabel,
                uploadingField === "imageUrl" && "pointer-events-none opacity-60"
              )}
            >
              <input
                type="file"
                accept={ADMIN_IMAGE_ACCEPT}
                className="sr-only"
                onChange={handleUpload("imageUrl")}
                disabled={uploading}
              />
              {uploadingField === "imageUrl" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                </>
              ) : (
                "Importer"
              )}
            </label>
          </div>
          {form.imageUrl ? (
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-white p-4">
              <Image
                src={form.imageUrl}
                alt="Aperçu logo mode clair"
                width={320}
                height={120}
                className="h-auto max-h-24 w-auto max-w-full object-contain"
                unoptimized={siteLogoImageUnoptimized(form.imageUrl)}
              />
            </div>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-2)]">
            <Moon className="h-3.5 w-3.5" />
            Logo — mode sombre
          </label>
          <p className="mb-2 text-xs text-[var(--text-3)]">
            Version claire sur fond sombre. Laisser vide pour réutiliser le logo mode clair.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={form.imageUrlDark}
              onChange={(e) => setForm((p) => ({ ...p, imageUrlDark: e.target.value }))}
              className={cn(inputBase, "flex-1 font-mono text-sm")}
              placeholder="/logo-fma-dark.svg"
              disabled={uploading}
            />
            <label
              className={cn(
                buttonUploadLabel,
                uploadingField === "imageUrlDark" && "pointer-events-none opacity-60"
              )}
            >
              <input
                type="file"
                accept={ADMIN_IMAGE_ACCEPT}
                className="sr-only"
                onChange={handleUpload("imageUrlDark")}
                disabled={uploading}
              />
              {uploadingField === "imageUrlDark" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                </>
              ) : (
                "Importer"
              )}
            </label>
          </div>
          {form.imageUrlDark ? (
            <div className="mt-3 rounded-xl border border-neutral-700 bg-neutral-950 p-4">
              <Image
                src={form.imageUrlDark}
                alt="Aperçu logo mode sombre"
                width={320}
                height={120}
                className="h-auto max-h-24 w-auto max-w-full object-contain"
                unoptimized={siteLogoImageUnoptimized(form.imageUrlDark)}
              />
            </div>
          ) : null}
        </div>

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
            Logo enregistré — visible sur le site public après rechargement.
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="primary" onClick={handleSave} isLoading={saving} disabled={uploading}>
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={uploading || saving}
            onClick={() =>
              setForm((p) => ({
                ...p,
                imageUrl: DEFAULT_SITE_LOGO.imageUrl,
                imageUrlDark: DEFAULT_SITE_LOGO.imageUrlDark,
              }))
            }
          >
            Logos par défaut FMA
          </Button>
        </div>
      </div>
    </div>
  );
}
