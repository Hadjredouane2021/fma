"use client";
import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT } from "@/lib/admin-upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryHorizontal, Loader2, Save, Trash2, ArrowLeft, ArrowRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonUploadLabel } from "@/lib/button-styles";
import type { GalleryCategory, GalleryItem, GalleryTitle } from "@/lib/galleries";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm";

export default function GalleryAdminForm({
  category,
  uploadFolder,
  label,
  initial,
  initialTitle,
  showPhotoTitles = false,
}: {
  category: GalleryCategory;
  uploadFolder: string;
  label: string;
  initial: GalleryItem[];
  initialTitle: GalleryTitle;
  showPhotoTitles?: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState<GalleryTitle>(initialTitle);
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: GalleryItem[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", uploadFolder);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { setError(data.message || "Échec de l'upload"); continue; }
        if (typeof data.url === "string") uploaded.push({ url: data.url, link: "" });
      }
      if (uploaded.length > 0) setItems((prev) => [...prev, ...uploaded]);
    } catch {
      setError("Erreur réseau lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const setLink = (i: number, link: string) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, link } : it)));

  const setPhotoTitle = (i: number, lang: keyof GalleryTitle, value: string) =>
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i
          ? { ...it, photoTitle: { fr: "", en: "", ar: "", ...it.photoTitle, [lang]: value } }
          : it
      )
    );

  const move = (i: number, dir: -1 | 1) => {
    setItems((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/admin/site/gallery/${category}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, items }),
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
      <h2 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
        <GalleryHorizontal className="w-4 h-4" />
        Galerie — {label}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">Titre (FR)</label>
          <input type="text" value={title.fr} onChange={(e) => setTitle((t) => ({ ...t, fr: e.target.value }))} className={inputBase} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">Titre (EN)</label>
          <input type="text" value={title.en} onChange={(e) => setTitle((t) => ({ ...t, en: e.target.value }))} className={inputBase} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">Titre (AR)</label>
          <input type="text" dir="rtl" value={title.ar} onChange={(e) => setTitle((t) => ({ ...t, ar: e.target.value }))} className={inputBase} />
        </div>
      </div>

      <div className="mb-4">
        <label className={cn(buttonUploadLabel, "inline-flex items-center gap-2", uploading && "opacity-60 pointer-events-none")}>
          <input type="file" accept={ADMIN_IMAGE_ACCEPT} multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Envoi…</> : "Ajouter des photos"}
        </label>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
          {items.map((item, i) => (
            <div key={`${item.url}-${i}`} className="rounded-xl overflow-hidden border border-[var(--border)]">
              <div className="relative aspect-square">
                <Image src={item.url} alt={`Photo ${i + 1}`} fill className="object-cover" unoptimized={item.url.startsWith("/uploads")} />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/50 p-1.5">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-white p-1 rounded hover:bg-white/20 disabled:opacity-30">
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => removeAt(i)} className="text-white p-1 rounded hover:bg-red-600/80">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-white p-1 rounded hover:bg-white/20 disabled:opacity-30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-2 flex items-center gap-2 bg-[var(--bg)]">
                <Link2 className="w-3.5 h-3.5 text-[var(--text-3)] shrink-0" />
                <input
                  type="text"
                  value={item.link}
                  onChange={(e) => setLink(i, e.target.value)}
                  className={cn(inputBase, "py-1.5 text-xs")}
                  placeholder="Lien (https://… ou /fr/page)"
                />
              </div>
              {showPhotoTitles && (
                <div className="p-2 pt-0 space-y-1.5 bg-[var(--bg)]">
                  <input
                    type="text"
                    value={item.photoTitle?.fr ?? ""}
                    onChange={(e) => setPhotoTitle(i, "fr", e.target.value)}
                    className={cn(inputBase, "py-1.5 text-xs")}
                    placeholder="Titre (FR)"
                  />
                  <input
                    type="text"
                    value={item.photoTitle?.en ?? ""}
                    onChange={(e) => setPhotoTitle(i, "en", e.target.value)}
                    className={cn(inputBase, "py-1.5 text-xs")}
                    placeholder="Titre (EN)"
                  />
                  <input
                    type="text"
                    dir="rtl"
                    value={item.photoTitle?.ar ?? ""}
                    onChange={(e) => setPhotoTitle(i, "ar", e.target.value)}
                    className={cn(inputBase, "py-1.5 text-xs")}
                    placeholder="Titre (AR)"
                  />
                </div>
              )}
            </div>
          ))}
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
