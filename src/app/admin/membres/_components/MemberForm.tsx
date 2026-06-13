"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const fieldGroupCard = "rounded-xl border border-[var(--border)] p-4 space-y-3";

export type MemberFormInitial = {
  id: string;
  nameFr: string;
  nameEn: string | null;
  nameAr: string | null;
  logo: string | null;
  website: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  category: string | null;
  order: number;
  active: boolean;
};

interface MemberFormProps {
  initial?: MemberFormInitial | null;
  defaultOrder?: number;
}

export default function MemberForm({ initial, defaultOrder = 0 }: MemberFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nameFr: initial?.nameFr ?? "",
    nameEn: initial?.nameEn ?? "",
    nameAr: initial?.nameAr ?? "",
    logo: initial?.logo ?? "",
    website: initial?.website ?? "",
    descriptionFr: initial?.descriptionFr ?? "",
    descriptionEn: initial?.descriptionEn ?? "",
    descriptionAr: initial?.descriptionAr ?? "",
    category: initial?.category ?? "",
    order: initial?.order ?? defaultOrder,
    active: initial?.active ?? true,
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "members");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.message as string) || "Échec de l’upload");
        return;
      }
      if (typeof data.url === "string") setForm((p) => ({ ...p, logo: data.url }));
    } catch {
      setError("Erreur réseau lors de l’upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/admin/members/${initial!.id}` : "/api/admin/members";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/membres");
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
        <h3 className="text-sm font-bold text-primary">Identité</h3>
        <div>
          <label className={labelCls}>Raison sociale (FR) — obligatoire</label>
          <input
            type="text"
            value={form.nameFr}
            onChange={(e) => setForm((p) => ({ ...p, nameFr: e.target.value }))}
            className={inputBase}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Nom (EN)</label>
          <input
            type="text"
            value={form.nameEn}
            onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
            className={inputBase}
          />
        </div>
        <div>
          <label className={labelCls}>Nom (AR)</label>
          <input
            type="text"
            value={form.nameAr}
            onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))}
            className={inputBase}
            dir="rtl"
          />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Logo & liens</h3>
        <div>
          <label className={labelCls}>URL du logo</label>
          <input
            type="text"
            value={form.logo}
            onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
            className={inputBase}
            placeholder="/uploads/members/…"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-2 text-xs font-semibold text-primary hover:bg-[var(--bg-surface)]">
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              {uploading ? "Envoi…" : "Téléverser un logo"}
            </label>
            {form.logo ? (
              <div className="relative h-12 w-28 overflow-hidden rounded border border-[var(--border)] bg-[var(--bg-alt)]">
                <Image src={form.logo} alt="" fill className="object-contain p-1" sizes="112px" unoptimized={form.logo.startsWith("/uploads")} />
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <label className={labelCls}>Site web</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
            className={inputBase}
            placeholder="https://"
          />
        </div>
        <div>
          <label className={labelCls}>Catégorie (slug interne)</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className={inputBase}
            placeholder="assureurs, reassureurs…"
          />
          <p className="mt-1 text-xs text-[var(--text-3)]">Champ libre pour vos filtres ou exports ; la page La FMA affiche tous les membres actifs (max. 12 par ordre).</p>
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Description (optionnel)</h3>
        <div>
          <label className={labelCls}>Description (FR)</label>
          <textarea rows={3} value={form.descriptionFr} onChange={(e) => setForm((p) => ({ ...p, descriptionFr: e.target.value }))} className={inputBase} />
        </div>
        <div>
          <label className={labelCls}>Description (EN)</label>
          <textarea rows={3} value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} className={inputBase} />
        </div>
        <div>
          <label className={labelCls}>Description (AR)</label>
          <textarea rows={3} value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} className={inputBase} dir="rtl" />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Publication</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Ordre d’affichage</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
              className={inputBase}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--text-2)]">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                className="h-4 w-4 rounded border-[var(--border)] text-primary focus:ring-primary/30"
              />
              Visible sur le site (actif)
            </label>
          </div>
        </div>
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
        <Button type="button" variant="outline" onClick={() => router.push("/admin/membres")} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
