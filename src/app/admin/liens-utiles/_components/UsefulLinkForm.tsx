"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const fieldGroupCard = "rounded-xl border border-[var(--border)] p-4 space-y-3";

export type UsefulLinkFormInitial = {
  id: string;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  url: string;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  category: string | null;
  icon: string | null;
  order: number;
  active: boolean;
};

interface UsefulLinkFormProps {
  initial?: UsefulLinkFormInitial | null;
  defaultOrder?: number;
}

export default function UsefulLinkForm({ initial, defaultOrder = 0 }: UsefulLinkFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    titleFr: initial?.titleFr ?? "",
    titleEn: initial?.titleEn ?? "",
    titleAr: initial?.titleAr ?? "",
    url: initial?.url ?? "",
    descriptionFr: initial?.descriptionFr ?? "",
    descriptionEn: initial?.descriptionEn ?? "",
    descriptionAr: initial?.descriptionAr ?? "",
    category: initial?.category ?? "",
    icon: initial?.icon ?? "",
    order: initial?.order ?? defaultOrder,
    active: initial?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/admin/useful-links/${initial!.id}` : "/api/admin/useful-links";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/liens-utiles");
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
        <h3 className="text-sm font-bold text-primary">Titres</h3>
        <div>
          <label className={labelCls}>Titre (FR) — obligatoire</label>
          <input
            type="text"
            value={form.titleFr}
            onChange={(e) => setForm((p) => ({ ...p, titleFr: e.target.value }))}
            className={inputBase}
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
        <h3 className="text-sm font-bold text-primary">Lien</h3>
        <div>
          <label className={labelCls}>URL — obligatoire</label>
          <input
            type="text"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            className={`${inputBase} font-mono text-sm`}
            placeholder="https://…"
            required
          />
        </div>
        <div>
          <label className={labelCls}>Catégorie (slug d’affichage)</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className={inputBase}
            placeholder="gouvernement, regulateurs, associations…"
          />
          <p className="mt-1 text-xs text-[var(--text-3)]">Regroupe les liens sur la page publique (titre de section capitalisé).</p>
        </div>
        <div>
          <label className={labelCls}>Icône (optionnel)</label>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
            className={inputBase}
            placeholder="Emoji ou caractère — réservé usage futur"
          />
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
            <label className={labelCls}>Ordre dans la catégorie</label>
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
        <Button type="button" variant="outline" onClick={() => router.push("/admin/liens-utiles")} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
