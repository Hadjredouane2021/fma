"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generateSlug } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const fieldGroupCard = "rounded-xl border border-[var(--border)] p-4 space-y-3";

function toDateInputValue(d: string | Date | null | undefined): string {
  if (d == null) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
}

export type ConventionFormInitial = {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  pdfFile: string | null;
  category: string | null;
  signedAt: Date | string | null;
  status: string;
  order: number;
};

interface ConventionFormProps {
  initial?: ConventionFormInitial | null;
  defaultOrder?: number;
}

export default function ConventionForm({ initial, defaultOrder = 0 }: ConventionFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    titleFr: initial?.titleFr ?? "",
    titleEn: initial?.titleEn ?? "",
    titleAr: initial?.titleAr ?? "",
    descriptionFr: initial?.descriptionFr ?? "",
    descriptionEn: initial?.descriptionEn ?? "",
    descriptionAr: initial?.descriptionAr ?? "",
    pdfFile: initial?.pdfFile ?? "",
    category: initial?.category ?? "",
    signedAt: toDateInputValue(initial?.signedAt ?? null),
    status: initial?.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    order: initial?.order ?? defaultOrder,
  });

  const uploadPdf = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "conventions");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError((data.message as string) || "Échec de l’upload PDF");
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
      const url = await uploadPdf(file);
      if (url) setForm((p) => ({ ...p, pdfFile: url }));
    } catch {
      setError("Erreur réseau lors de l’upload");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      ...form,
      signedAt: form.signedAt || null,
    };
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/admin/conventions/${initial!.id}` : "/api/admin/conventions";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/conventions");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data.message as string) || "Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Erreur réseau — vérifiez votre connexion");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Identification</h3>
        <div>
          <label className={labelCls}>Titre (FR) — obligatoire</label>
          <input
            type="text"
            value={form.titleFr}
            onChange={(e) => {
              const v = e.target.value;
              setForm((p) => ({
                ...p,
                titleFr: v,
                ...(!isEdit ? { slug: p.slug || generateSlug(v) } : {}),
              }));
            }}
            className={inputBase}
            required
          />
        </div>
        <div>
          <label className={labelCls}>
            Slug URL
            <span className="text-[var(--text-3)] font-normal normal-case ml-1">(unique, minuscules)</span>
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              }))
            }
            className={`${inputBase} font-mono text-sm`}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Titre (EN)</label>
          <input type="text" value={form.titleEn} onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))} className={inputBase} />
        </div>
        <div>
          <label className={labelCls}>Titre (AR)</label>
          <input type="text" value={form.titleAr} onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))} className={inputBase} dir="rtl" />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Contenu</h3>
        <div>
          <label className={labelCls}>Description (FR)</label>
          <RichTextEditor
            value={form.descriptionFr}
            onChange={(html) => setForm((p) => ({ ...p, descriptionFr: html }))}
            placeholder="Rédigez la description en français…"
          />
        </div>
        <div>
          <label className={labelCls}>Description (EN)</label>
          <RichTextEditor value={form.descriptionEn} onChange={(html) => setForm((p) => ({ ...p, descriptionEn: html }))} placeholder="Description in English…" />
        </div>
        <div>
          <label className={labelCls}>Description (AR)</label>
          <RichTextEditor value={form.descriptionAr} onChange={(html) => setForm((p) => ({ ...p, descriptionAr: html }))} placeholder="الوصف بالعربية…" dir="rtl" />
        </div>
        <div>
          <label className={labelCls}>Catégorie</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className={inputBase}
            placeholder="ex. Collective, Branche…"
          />
        </div>
        <div>
          <label className={labelCls}>Date de signature (optionnel)</label>
          <input type="date" value={form.signedAt} onChange={(e) => setForm((p) => ({ ...p, signedAt: e.target.value }))} className={inputBase} />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Document PDF</h3>
        <div>
          <label className={labelCls}>URL du PDF</label>
          <input type="text" value={form.pdfFile} onChange={(e) => setForm((p) => ({ ...p, pdfFile: e.target.value }))} className={`${inputBase} font-mono text-sm`} placeholder="/uploads/conventions/…" />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-2 text-xs font-semibold text-primary hover:bg-[var(--bg-surface)]">
              <FileText className="h-3.5 w-3.5" />
              <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={uploadingPdf} />
              {uploadingPdf ? "Envoi…" : "Téléverser un PDF"}
            </label>
            {form.pdfFile ? (
              <a href={form.pdfFile} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline">
                Aperçu du fichier
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Publication</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Statut</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "DRAFT" | "PUBLISHED" }))}
              className={inputBase}
            >
              <option value="PUBLISHED">Publié (visible sur le site)</option>
              <option value="DRAFT">Brouillon</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Ordre d’affichage</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
              className={inputBase}
            />
          </div>
        </div>
        <p className="text-xs text-[var(--text-3)]">Seules les conventions au statut « Publié » apparaissent sur la page publique.</p>
      </div>

      {error ? (
        <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Enregistrer" : "Créer"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/conventions")} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
