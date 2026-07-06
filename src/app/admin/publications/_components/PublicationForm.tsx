"use client";
import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT, ADMIN_IMAGE_FORMATS_LABEL } from "@/lib/admin-upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, generateSlug } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive, buttonUploadLabel } from "@/lib/button-styles";
import { primaryLocalizedText, publicationTitle } from "@/lib/localized-content";

interface PublicationFormProps {
  initialData?: Record<string, unknown>;
}

const TYPES = [
  { value: "chiffres-cles",   label: "Chiffres clés" },
  { value: "faits-marquants", label: "Faits marquants" },
  { value: "courrier",        label: "Le Courrier de l'assurance" },
  { value: "autre",           label: "Autre" },
];

const TABS = [
  { key: "fr" as const, flag: "🇫🇷", label: "Français", dir: "ltr" as const },
  { key: "en" as const, flag: "🇬🇧", label: "English", dir: "ltr" as const },
  { key: "ar" as const, flag: "🇲🇦", label: "العربية", dir: "rtl" as const },
];

type Lang = "fr" | "en" | "ar";

export default function PublicationForm({ initialData }: PublicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState<Lang | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Lang>("fr");
  const [form, setForm] = useState({
    titleFr:       (initialData?.titleFr as string)        || "",
    titleEn:       (initialData?.titleEn as string)        || "",
    titleAr:       (initialData?.titleAr as string)        || "",
    slug:          (initialData?.slug as string)           || "",
    type:          (initialData?.type as string)           || "chiffres-cles",
    descriptionFr: (initialData?.descriptionFr as string)  || "",
    descriptionEn: (initialData?.descriptionEn as string)  || "",
    descriptionAr: (initialData?.descriptionAr as string)  || "",
    pdfFileFr:     (initialData?.pdfFileFr as string)      || (initialData?.pdfFile as string) || "",
    pdfFileEn:     (initialData?.pdfFileEn as string)      || "",
    pdfFileAr:     (initialData?.pdfFileAr as string)      || "",
    readMoreUrlFr: (initialData?.readMoreUrlFr as string)  || (initialData?.readMoreUrl as string) || "",
    readMoreUrlEn: (initialData?.readMoreUrlEn as string)  || "",
    readMoreUrlAr: (initialData?.readMoreUrlAr as string)  || "",
    coverImage:    (initialData?.coverImage as string)     || "",
    year:          (initialData?.year as number)?.toString() || new Date().getFullYear().toString(),
    status:        (initialData?.status as string)         || "DRAFT",
    featured:      (initialData?.featured as boolean)      || false,
    announcePopup: (initialData?.announcePopup as boolean) || false,
  });

  const isEdit = Boolean(initialData?.id);
  const currentTab = TABS.find((t) => t.key === tab)!;

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      titleFr: val,
      slug: prev.slug || generateSlug(val),
    }));
  };

  const handleLocalizedTitleChange = (lang: "en" | "ar", val: string) => {
    setForm((prev) => ({
      ...prev,
      ...(lang === "en" ? { titleEn: val } : { titleAr: val }),
      slug: prev.slug || generateSlug(val),
    }));
  };

  const resolvePrimaryTitle = () =>
    primaryLocalizedText({ fr: form.titleFr, en: form.titleEn, ar: form.titleAr });

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

  const PDF_FIELDS = { fr: "pdfFileFr", en: "pdfFileEn", ar: "pdfFileAr" } as const;
  const READ_MORE_FIELDS = { fr: "readMoreUrlFr", en: "readMoreUrlEn", ar: "readMoreUrlAr" } as const;

  const handlePdfUpload = async (lang: Lang, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingPdf(lang);
    setError("");
    try {
      const url = await uploadToFolder(file, "publications");
      if (url) {
        const field = PDF_FIELDS[lang];
        setForm((prev) => ({ ...prev, [field]: url }));
      }
    } catch {
      setError("Erreur réseau lors de l’upload du PDF");
    } finally {
      setUploadingPdf(null);
    }
  };

  const renderPdfBlock = (lang: Lang) => {
    const field = PDF_FIELDS[lang];
    const value = form[field];
    const isUploading = uploadingPdf === lang;
    const pdfLabel =
      lang === "ar" ? "ملف PDF" : lang === "en" ? "PDF file" : "Fichier PDF";
    const readMoreLabel =
      lang === "ar" ? "رابط « اقرأ المزيد »" : lang === "en" ? "« Read more » link" : "Lien « Lire la suite »";
    const readMoreFieldKey = READ_MORE_FIELDS[lang];
    const readMoreValue = form[readMoreFieldKey];

    return (
      <>
        <div>
          <label className={label}>{readMoreLabel}</label>
          <p className="text-xs text-[var(--text-3)] mb-2">
            {lang === "ar"
              ? "رابط خارجي أو صفحة كاملة لهذه اللغة."
              : lang === "en"
                ? "External URL or full page for this language."
                : "URL externe ou page complète pour cette langue."}
          </p>
          <input
            type="text"
            value={readMoreValue}
            onChange={(e) => setForm((prev) => ({ ...prev, [readMoreFieldKey]: e.target.value }))}
            className={input}
            placeholder="https://…"
          />
        </div>
        <div>
          <label className={label}>{pdfLabel}</label>
          <p className="text-xs text-[var(--text-3)] mb-2">
            {lang === "ar"
              ? "رابط أو استيراد (PDF فقط، بحد أقصى 20 ميغابايت)."
              : lang === "en"
                ? "URL or upload (PDF only, max 20 MB)."
                : "URL ou import (PDF uniquement, max 20 Mo)."}
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
              className={`${input} flex-1 min-w-0`}
              placeholder="https://… ou rempli après import"
              disabled={isUploading}
            />
            <label className={`${importBtn} ${isUploading ? "opacity-60 pointer-events-none" : ""}`}>
              <input
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => handlePdfUpload(lang, e)}
                disabled={isUploading}
              />
              {isUploading
                ? lang === "ar"
                  ? "جاري الإرسال…"
                  : lang === "en"
                    ? "Uploading…"
                    : "Envoi…"
                : lang === "ar"
                  ? "استيراد PDF"
                  : lang === "en"
                    ? "Upload PDF"
                    : "Importer un PDF"}
            </label>
          </div>
          {value ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[var(--blue)] hover:underline"
              >
                {lang === "ar" ? "فتح PDF" : lang === "en" ? "Open PDF" : "Ouvrir / télécharger le PDF"}
              </a>
              <button
                type="button"
                className="text-xs font-semibold text-red-600 hover:underline"
                onClick={() => setForm((prev) => ({ ...prev, [field]: "" }))}
              >
                {lang === "ar" ? "إزالة" : lang === "en" ? "Remove" : "Retirer"}
              </button>
            </div>
          ) : null}
        </div>
      </>
    );
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
    const primaryTitle = resolvePrimaryTitle();
    if (!primaryTitle) {
      setError("Renseignez un titre dans au moins une langue (FR, EN ou AR).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const slug = form.slug.trim() || generateSlug(primaryTitle);
      const payload = {
        ...form,
        titleFr: form.titleFr.trim(),
        titleEn: form.titleEn.trim() || null,
        titleAr: form.titleAr.trim() || null,
        descriptionFr: form.descriptionFr.trim() || null,
        descriptionEn: form.descriptionEn.trim() || null,
        descriptionAr: form.descriptionAr.trim() || null,
        pdfFileFr: form.pdfFileFr.trim() || null,
        pdfFileEn: form.pdfFileEn.trim() || null,
        pdfFileAr: form.pdfFileAr.trim() || null,
        readMoreUrlFr: form.readMoreUrlFr.trim() || null,
        readMoreUrlEn: form.readMoreUrlEn.trim() || null,
        readMoreUrlAr: form.readMoreUrlAr.trim() || null,
        slug,
        year: form.year ? Number(form.year) : null,
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
  const importBtn = buttonUploadLabel;
  const busy = uploadingPdf !== null || uploadingCover;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className={`${card} space-y-6`}>
        {/* Onglets langue — contrôlent le contenu éditorial ci-dessous */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setTab(t.key);
                  setError("");
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium",
                  tab === t.key ? buttonTabActive : buttonTabInactive
                )}
              >
                {t.flag} {t.label}
              </button>
            ))}
          </div>
          {form.status === "PUBLISHED" ? (
            <a
              href={`/${tab}/publications?type=${encodeURIComponent(form.type)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Eye className="h-3.5 w-3.5" />
              Aperçu site ({currentTab.label})
            </a>
          ) : null}
        </div>
        <p className="text-xs text-[var(--text-3)]">
          Chaque onglet enregistre le titre, la description, le lien et le PDF de sa langue. Sur le site public, chaque locale affiche ses textes avec repli sur le français si absent.
        </p>

        <div className="space-y-4" dir={currentTab.dir}>
          <div>
            <label className={label}>
              {tab === "ar" ? "العنوان" : tab === "en" ? "Title" : "Titre"} *
            </label>
            {tab === "fr" && (
              <>
                <input
                  type="text"
                  value={form.titleFr}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={input}
                  placeholder="Titre de la publication"
                />
              </>
            )}
            {tab === "en" && (
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => handleLocalizedTitleChange("en", e.target.value)}
                className={input}
                placeholder="Publication title in English…"
              />
            )}
            {tab === "ar" && (
              <input
                type="text"
                value={form.titleAr}
                onChange={(e) => handleLocalizedTitleChange("ar", e.target.value)}
                className={input}
                placeholder="عنوان المنشور بالعربية…"
              />
            )}
            {(form.slug || publicationTitle(form, tab)) && (
              <p className="mt-1 font-mono text-xs text-[var(--text-3)]">
                /{tab}/publications?type={form.type}
                {form.slug ? (
                  <>
                    {" "}
                    — <span className="text-[var(--blue)]">{form.slug}</span>
                  </>
                ) : null}
              </p>
            )}
          </div>

          <div>
            <label className={label}>
              {tab === "ar" ? "الوصف" : tab === "en" ? "Description" : "Description"}
            </label>
            {tab === "fr" && (
              <textarea
                rows={3}
                value={form.descriptionFr}
                onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
                className={`${input} resize-none`}
                placeholder="Description courte…"
              />
            )}
            {tab === "en" && (
              <textarea
                rows={3}
                value={form.descriptionEn}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                className={`${input} resize-none`}
                placeholder="Short description…"
              />
            )}
            {tab === "ar" && (
              <textarea
                rows={3}
                value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                className={`${input} resize-none`}
                placeholder="وصف قصير…"
              />
            )}
          </div>

          {tab === "fr" ? renderPdfBlock("fr") : null}
          {tab === "en" ? renderPdfBlock("en") : null}
          {tab === "ar" ? renderPdfBlock("ar") : null}
        </div>

        <div className="border-t border-[var(--border)] pt-6 space-y-4">
          <h3 className="font-bold text-[var(--text-1)] text-sm">Paramètres</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={`${input} font-mono`}
              />
            </div>
            <div>
              <label className={label}>Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={input}>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Année</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className={input}
                min="2000"
                max="2099"
              />
            </div>
            <div>
              <label className={label}>Statut</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={input}>
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
              </select>
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
