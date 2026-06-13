"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { buttonUploadLabel } from "@/lib/button-styles";
import { isLaFmaIconImage, isLaFmaUploadIcon, normalizeLaFmaIcon } from "@/lib/la-fma-icon";
import { cn } from "@/lib/utils";

type LaFmaIconFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  labelCls: string;
  inputBase: string;
  /** Dossier d'upload autorisé (voir /api/admin/upload). */
  uploadFolder?: string;
  /** Indication de dimensions recommandées (affichée sous le champ). */
  sizeHint?: string;
  /** Aperçu large (ratio carte) au lieu du carré 56×56. */
  widePreview?: boolean;
};

export function LaFmaIconField({
  value: rawValue,
  onChange,
  label = "Icône",
  labelCls,
  inputBase,
  uploadFolder = "la-fma-icons",
  sizeHint,
  widePreview = false,
}: LaFmaIconFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const value = normalizeLaFmaIcon(rawValue);
  const isImage = isLaFmaIconImage(value);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", uploadFolder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok) {
        setUploadError(data.message || "Échec de l’upload");
        return;
      }
      if (typeof data.url === "string") onChange(normalizeLaFmaIcon(data.url));
    } catch {
      setUploadError("Erreur réseau lors de l’upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <p className="mb-2 text-xs text-[var(--text-3)]">
        Téléversez une image (PNG, JPG, WebP, GIF) ou saisissez un emoji.
        {sizeHint ? (
          <>
            {" "}
            Taille recommandée&nbsp;: <span className="text-[var(--text-2)]">{sizeHint}</span>.
          </>
        ) : null}
      </p>
      <div className="flex flex-wrap items-start gap-3">
        {isImage ? (
          <div
            className={cn(
              "relative shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-alt)]",
              widePreview ? "aspect-[37/10] w-full max-w-xs sm:max-w-sm" : "h-14 w-14"
            )}
          >
            <Image
              src={value}
              alt=""
              fill
              className={cn("object-contain", widePreview ? "object-center p-2" : "p-1")}
              sizes={widePreview ? "320px" : "56px"}
              unoptimized={isLaFmaUploadIcon(value)}
            />
          </div>
        ) : value ? (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] text-3xl">
            {value}
          </span>
        ) : null}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(normalizeLaFmaIcon(e.target.value))}
            className={cn(inputBase, isImage && "font-mono text-sm")}
            placeholder={isImage ? `/uploads/${uploadFolder}/…` : "📌"}
          />
          <div className="flex flex-wrap items-center gap-2">
            <label
              className={cn(
                buttonUploadLabel,
                "inline-flex items-center gap-2",
                uploading && "pointer-events-none opacity-60"
              )}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi…
                </>
              ) : (
                "Téléverser une photo"
              )}
            </label>
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
              >
                Supprimer
              </button>
            ) : null}
          </div>
          {uploadError ? (
            <p className="text-xs text-red-600 dark:text-red-400" role="alert">
              {uploadError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
