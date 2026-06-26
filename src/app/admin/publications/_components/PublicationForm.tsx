"use client";
import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT, ADMIN_IMAGE_FORMATS_LABEL } from "@/lib/admin-upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive, buttonUploadLabel } from "@/lib/button-styles";
import { generateSlug } from "@/lib/utils";

interface PublicationFormProps {
  initialData?: Record<string, unknown>;
}

const TYPES = [
  { value: "chiffres-cles",   label: "Chiffres clés" },
  { value: "faits-marquants", label: "Faits marquants" },
  { value: "courrier",        label: "Le Courrier de l'assurance" },
  { value: "autre",           label: "Autre" },
];

export default function PublicationForm({ initialData }: PublicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"fr" | "en" | "ar">("fr");
  const [form, setForm] = useState({
    titleFr:       (initialData?.titleFr as string)        || "",
    titleEn:       (initialData?.titleEn as string)        || "",
    titleAr:       (initialData?.titleAr as string)        || "",
    slug:          (initialData?.slug as string)           || "",
    type:          (initialData?.type as string)           || "chiffres-cles",
    descriptionFr: (initialData?.descriptionFr as string)  || "",
    descriptionEn: (initialData?.descriptionEn as string)  || "",
    descriptionAr: (initialData?.descriptionAr as string)  || "",
    pdfFile:       (initialData?.pdfFile as string)        || "",
    coverImage:    (initialData?.coverImage as string)     || "",
    readMoreUrl:   (initialData?.readMoreUrl as string)    || "",
    year:          (initialData?.year as number)?.toString() || new Date().getFullYear().toString(),
    status:        (initialData?.status as string)         || "DRAFT",
    featured:      (initialData?.featured as boolean)      || false,
    announcePopup: (initialData?.announcePopup as boolean) || false,
  });

  const isEdit = Boolean(initialData?.id);

  const handleTitleChange = (val: string) => {
    setForm({ ...form, titleFr: val, slug: form.slug || generateSlug(val) });
  };

  const uploadToFolder = async (file: File, folder: string): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError((data.message as string) || "Échec de l’upload");
      return null;
    }
    return typeof data.url === "string" ? data.url : null;
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingPdf(true);
    setError("");
    try {
      const url = await uploadToFolder(file, "publications");
      if (url) setForm((prev) => ({ ...prev, pdfFile: url }));
    } catch {
      setError("Erreur réseau lors de l’upload du PDF");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingCover(true);
    setError("");
    try {
      const url = await uploadToFolder(file, "publications-covers");
      if (url) setForm((prev) => ({ ...prev, coverImage: url }));
    } catch {
      setError("Erreur réseau lors de l’upload de la couverture");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : null,
        readMoreUrl: form.readMoreUrl.trim() || null,
      };
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `/api/admin/publications/${initialData!.id}`
        : "/api/admin/publications";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/publications");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Erreur réseau");
    }
    setLoading(false);
  };

  const input = "w-full px-4 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
  const label = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-1.5";
  const card = "bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6";
  const importBtn =
    buttonUploadLabel;

  const TABS = [
    { key: "fr" as const, flag: "🇫🇷", label: "Français" },
    { key: "en" as const, flag: "🇬🇧", label: "English" },
    { key: "ar" as const, flag: "🇲🇦", label: "العربية" },
  ];

  const busy = uploadingPdf || uploadingCover;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Lang tabs */}
      <div className={card}>
        <div className="flex gap-2 mb-5">
          {TABS.map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium", tab === t.key ? buttonTabActive : buttonTabInactive)}>
              {t.flag} {t.label}
            </button>
          ))}
        </div>

        {tab === "fr" && (
          <div className="space-y-4">
            <div>
              <label className={label}>Titre (FR) *</label>
              <input type="text" required value={form.titleFr} onChange={(e) => handleTitleChange(e.target.value)} className={input} placeholder="Titre de la publication" />
            </div>
            <div>
              <label className={label}>Description (FR)</label>
              <textarea rows={3} value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} className={`${input} resize-none`} placeholder="Description courte…" />
            </div>
          </div>
        )}
        {tab === "en" && (
          <div className="space-y-4">
            <div>
              <label className={label}>Title (EN)</label>
              <input type="text" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className={input} />
            </div>
            <div>
              <label className={label}>Description (EN)</label>
              <textarea rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} className={`${input} resize-none`} />
            </div>
          </div>
        )}
        {tab === "ar" && (
          <div className="space-y-4" dir="rtl">
            <div>
              <label className={label}>العنوان (AR)</label>
              <input type="text" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className={input} />
            </div>
            <div>
              <label className={label}>وصف (AR)</label>
              <textarea rows={3} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} className={`${input} resize-none`} />
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className={`${card} space-y-4`}>
        <h3 className="font-bold text-[var(--text-1)]">Paramètres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Slug *</label>
            <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={input} />
          </div>
          <div>
            <label className={label}>Type *</label>
            <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={input}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Année</label>
            <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={input} min="2000" max="2099" />
          </div>
          <div>
            <label className={label}>Statut</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={input}>
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={label}>Lien « Lire la suite »</label>
            <p className="text-xs text-[var(--text-3)] mb-2">
              URL externe ou page complète (article, rapport en ligne, etc.). Affichée sur la carte publique.
            </p>
            <input
              type="url"
              value={form.readMoreUrl}
              onChange={(e) => setForm({ ...form, readMoreUrl: e.target.value })}
              className={input}
              placeholder="https://…"
            />
          </div>

          <div className="md:col-span-2">
            <label className={label}>Fichier PDF</label>
            <p className="text-xs text-[var(--text-3)] mb-2">URL ou import (PDF uniquement, max 20&nbsp;Mo).</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={form.pdfFile}
                onChange={(e) => setForm({ ...form, pdfFile: e.target.value })}
                className={`${input} flex-1 min-w-0`}
                placeholder="https://… ou rempli après import"
                disabled={uploadingPdf}
              />
              <label className={`${importBtn} ${uploadingPdf ? "opacity-60 pointer-events-none" : ""}`}>
                <input type="file" accept="application/pdf" className="sr-only" onChange={handlePdfUpload} disabled={uploadingPdf} />
                {uploadingPdf ? "Envoi…" : "Importer un PDF"}
              </label>
            </div>
            {form.pdfFile ? (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={form.pdfFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[var(--blue)] hover:underline"
                >
                  Ouvrir / télécharger le PDF
                </a>
                <button type="button" className="text-xs font-semibold text-red-600 hover:underline" onClick={() => setForm({ ...form, pdfFile: "" })}>
                  Retirer
                </button>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label className={label}>Image de couverture</label>
            <p className="text-xs text-[var(--text-3)] mb-2">URL ou import ({ADMIN_IMAGE_FORMATS_LABEL} — max 4&nbsp;Mo).</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className={`${input} flex-1 min-w-0`}
                placeholder="https://… ou rempli après import"
                disabled={uploadingCover}
              />
              <label className={`${importBtn} ${uploadingCover ? "opacity-60 pointer-events-none" : ""}`}>
                <input
                  type="file"
                  accept={ADMIN_IMAGE_ACCEPT}
                  className="sr-only"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                />
                {uploadingCover ? "Envoi…" : "Importer une image"}
              </label>
            </div>
            {form.coverImage ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Image
                  src={form.coverImage}
                  alt="Prévisualisation couverture"
                  width={320}
                  height={128}
                  className="h-28 w-auto max-w-[280px] rounded-lg border border-[var(--border)] object-cover bg-[var(--bg-surface)]"
                  unoptimized={form.coverImage.startsWith("http")}
                />
                <button type="button" className="text-xs font-semibold text-red-600 hover:underline" onClick={() => setForm({ ...form, coverImage: "" })}>
                  Retirer l’image
                </button>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-primary" />
            <label htmlFor="featured" className="text-sm font-medium text-[var(--text-1)]">Publication mise en avant</label>
          </div>
          <div className="md:col-span-2 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)]/50 p-4">
            <input
              type="checkbox"
              id="announcePopup"
              checked={form.announcePopup}
              onChange={(e) => setForm({ ...form, announcePopup: e.target.checked })}
              className="mt-0.5 h-4 w-4 accent-primary"
              disabled={form.status !== "PUBLISHED"}
            />
            <div>
              <label htmlFor="announcePopup" className="text-sm font-medium text-[var(--text-1)] cursor-pointer">
                📢 Popup d&apos;annonce sur le site
              </label>
              <p className="mt-1 text-xs text-[var(--text-3)]">
                Affiche une fenêtre modale aux visiteurs (une seule annonce active à la fois, actualité ou publication). Réservé aux publications publiées.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" variant="primary" isLoading={loading} size="lg" disabled={busy}>
          {isEdit ? "Mettre à jour" : "Créer la publication"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
      </div>
    </form>
  );
}
