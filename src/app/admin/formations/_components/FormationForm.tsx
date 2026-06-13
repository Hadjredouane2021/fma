"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
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

export type FormationFormInitial = {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  organizer: string | null;
  duration: string | null;
  format: string | null;
  level: string | null;
  price: string | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  location: string | null;
  registrationUrl: string | null;
  status: string;
};

export default function FormationForm({ initial }: { initial?: FormationFormInitial | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    titleFr: initial?.titleFr ?? "",
    titleEn: initial?.titleEn ?? "",
    titleAr: initial?.titleAr ?? "",
    descriptionFr: initial?.descriptionFr ?? "",
    descriptionEn: initial?.descriptionEn ?? "",
    descriptionAr: initial?.descriptionAr ?? "",
    organizer: initial?.organizer ?? "",
    duration: initial?.duration ?? "",
    format: initial?.format ?? "presentiel",
    level: initial?.level ?? "",
    price: initial?.price ?? "",
    startDate: toDateInputValue(initial?.startDate ?? null),
    endDate: toDateInputValue(initial?.endDate ?? null),
    location: initial?.location ?? "",
    registrationUrl: initial?.registrationUrl ?? "",
    status: initial?.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      ...form,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/admin/formations/${initial!.id}` : "/api/admin/formations";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/formations");
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
              setForm((p) => ({ ...p, titleFr: v, ...(!isEdit ? { slug: p.slug || generateSlug(v) } : {}) }));
            }}
            className={inputBase}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Slug URL <span className="text-[var(--text-3)] font-normal normal-case ml-1">(unique, minuscules)</span></label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))}
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
        <h3 className="text-sm font-bold text-primary">Description</h3>
        <div>
          <label className={labelCls}>Description (FR)</label>
          <RichTextEditor value={form.descriptionFr} onChange={(html) => setForm((p) => ({ ...p, descriptionFr: html }))} placeholder="Description en français…" />
        </div>
        <div>
          <label className={labelCls}>Description (EN)</label>
          <RichTextEditor value={form.descriptionEn} onChange={(html) => setForm((p) => ({ ...p, descriptionEn: html }))} placeholder="Description in English…" />
        </div>
        <div>
          <label className={labelCls}>Description (AR)</label>
          <RichTextEditor value={form.descriptionAr} onChange={(html) => setForm((p) => ({ ...p, descriptionAr: html }))} placeholder="الوصف بالعربية…" dir="rtl" />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Détails</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Organisateur</label>
            <input type="text" value={form.organizer} onChange={(e) => setForm((p) => ({ ...p, organizer: e.target.value }))} className={inputBase} placeholder="FMA, CNIA…" />
          </div>
          <div>
            <label className={labelCls}>Durée</label>
            <input type="text" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} className={inputBase} placeholder="2 jours, 16h…" />
          </div>
          <div>
            <label className={labelCls}>Format</label>
            <select value={form.format} onChange={(e) => setForm((p) => ({ ...p, format: e.target.value }))} className={inputBase}>
              <option value="presentiel">Présentiel</option>
              <option value="distanciel">Distanciel</option>
              <option value="hybride">Hybride</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Niveau</label>
            <select value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))} className={inputBase}>
              <option value="">— Non précisé —</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Date de début</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className={inputBase} />
          </div>
          <div>
            <label className={labelCls}>Date de fin</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className={inputBase} />
          </div>
          <div>
            <label className={labelCls}>Lieu</label>
            <input type="text" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className={inputBase} placeholder="Casablanca, En ligne…" />
          </div>
          <div>
            <label className={labelCls}>Prix</label>
            <input type="text" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className={inputBase} placeholder="Gratuit, 2500 MAD…" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Lien d'inscription</label>
          <input type="url" value={form.registrationUrl} onChange={(e) => setForm((p) => ({ ...p, registrationUrl: e.target.value }))} className={inputBase} placeholder="https://…" />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Publication</h3>
        <div>
          <label className={labelCls}>Statut</label>
          <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className={inputBase}>
            <option value="PUBLISHED">Publié (visible sur le site)</option>
            <option value="DRAFT">Brouillon</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Enregistrer" : "Créer"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/formations")} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
