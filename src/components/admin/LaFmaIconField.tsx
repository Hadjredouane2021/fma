"use client";

import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT, ADMIN_IMAGE_FORMATS_LABEL } from "@/lib/admin-upload";
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
  /** Mise en page réduite pour aligner l’icône avec un autre champ sur la même ligne. */
  compact?: boolean;
  /** Champ affiché à droite de l’input icône (même ligne). */
  suffix?: React.ReactNode;
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
  compact = false,
  suffix,
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

  const previewBox = isImage ? (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-alt)]",
        suffix
          ? "h-10 w-10"
          : widePreview
            ? "aspect-[37/10] w-full max-w-xs sm:max-w-sm"
            : "h-14 w-14"
      )}
    >
      <Image
        src={value}
        alt=""
        fill
        className={cn("object-contain", widePreview ? "object-center p-2" : "p-1")}
        sizes={widePreview ? "320px" : suffix ? "40px" : "56px"}
        unoptimized={isLaFmaUploadIcon(value)}
      />
    </div>
  ) : value ? (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-alt)]",
        suffix ? "h-10 w-10 text-2xl" : "h-14 w-14 text-3xl"
      )}
    >
      {value}
    </span>
  ) : null;

  const iconInput = (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(normalizeLaFmaIcon(e.target.value))}
      className={cn(inputBase, isImage && "font-mono text-sm", suffix && "w-[4.5rem] shrink-0 px-2 text-center")}
      placeholder={isImage ? `/uploads/${uploadFolder}/…` : "📌"}
    />
  );

  const uploadRow = (
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
          accept={ADMIN_IMAGE_ACCEPT}
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
  );

  return (
    <div className={compact || suffix ? "min-w-0" : undefined}>
      {suffix ? (
        <>
          <div className="grid grid-cols-[auto_minmax(4.5rem,5.5rem)_minmax(0,1fr)] items-end gap-3">
            {previewBox ?? <span className="h-10 w-10 shrink-0" aria-hidden />}
            <div className="space-y-2">
              <label className={labelCls}>{label}</label>
              {iconInput}
            </div>
            <div className="min-w-0 space-y-2">{suffix}</div>
          </div>
          <div className="mt-2">{uploadRow}</div>
          {uploadError ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {uploadError}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <label className={labelCls}>{label}</label>
          {!compact ? (
            <p className="mb-2 text-xs text-[var(--text-3)]">
              Téléversez une image ({ADMIN_IMAGE_FORMATS_LABEL}) ou saisissez un emoji.
              {sizeHint ? (
                <>
                  {" "}
                  Taille recommandée&nbsp;: <span className="text-[var(--text-2)]">{sizeHint}</span>.
                </>
              ) : null}
            </p>
          ) : null}
          <div className={cn("flex flex-wrap items-start gap-3", compact && "gap-2")}>
            {previewBox}
            <div className="min-w-0 flex-1 space-y-2">
              {iconInput}
              {uploadRow}
              {uploadError ? (
                <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                  {uploadError}
                </p>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
