"use client";

import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT } from "@/lib/admin-upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const fieldGroupCard = "rounded-xl border border-[var(--border)] p-4 space-y-3";

export type TeamMemberFormInitial = {
  id: string;
  nameFr: string;
  nameEn: string | null;
  nameAr: string | null;
  titleFr: string | null;
  titleEn: string | null;
  titleAr: string | null;
  photo: string | null;
  email: string | null;
  department: string | null;
  bioFr: string | null;
  bioEn: string | null;
  bioAr: string | null;
  order: number;
  active: boolean;
};

interface TeamMemberFormProps {
  initial?: TeamMemberFormInitial | null;
  defaultOrder?: number;
}

export default function TeamMemberForm({ initial, defaultOrder = 0 }: TeamMemberFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nameFr: initial?.nameFr ?? "",
    nameEn: initial?.nameEn ?? "",
    nameAr: initial?.nameAr ?? "",
    titleFr: initial?.titleFr ?? "",
    titleEn: initial?.titleEn ?? "",
    titleAr: initial?.titleAr ?? "",
    photo: initial?.photo ?? "",
    email: initial?.email ?? "",
    department: initial?.department || "direction",
    bioFr: initial?.bioFr ?? "",
    bioEn: initial?.bioEn ?? "",
    bioAr: initial?.bioAr ?? "",
    order: initial?.order ?? defaultOrder,
    active: initial?.active ?? true,
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "team");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.message as string) || "Échec de l’upload");
        return;
      }
      if (typeof data.url === "string") setForm((p) => ({ ...p, photo: data.url }));
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
      const url = isEdit ? `/api/admin/team/${initial!.id}` : "/api/admin/team";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/equipe");
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
          <label className={labelCls}>Nom (FR) — obligatoire</label>
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
        <h3 className="text-sm font-bold text-primary">Fonction</h3>
        <div>
          <label className={labelCls}>Intitulé (FR)</label>
          <input
            type="text"
            value={form.titleFr}
            onChange={(e) => setForm((p) => ({ ...p, titleFr: e.target.value }))}
            className={inputBase}
          />
        </div>
        <div>
          <label className={labelCls}>Intitulé (EN)</label>
          <input
            type="text"
            value={form.titleEn}
            onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))}
            className={inputBase}
          />
        </div>
        <div>
          <label className={labelCls}>Intitulé (AR)</label>
          <input
            type="text"
            value={form.titleAr}
            onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))}
            className={inputBase}
            dir="rtl"
          />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Photo & contact</h3>
        <div>
          <label className={labelCls}>URL photo (après upload ou lien)</label>
          <input
            type="text"
            value={form.photo}
            onChange={(e) => setForm((p) => ({ ...p, photo: e.target.value }))}
            className={inputBase}
            placeholder="/uploads/team/…"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-2 text-xs font-semibold text-primary hover:bg-[var(--bg-surface)]">
              <input type="file" accept={ADMIN_IMAGE_ACCEPT} className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              {uploading ? "Envoi…" : "Choisir une image"}
            </label>
            {form.photo ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[var(--border)]">
                <Image src={form.photo} alt="" fill className="object-cover" sizes="64px" unoptimized={form.photo.startsWith("/uploads")} />
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <label className={labelCls}>E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={inputBase}
          />
        </div>
        <div>
          <label className={labelCls}>Service / département</label>
          <p className="mb-2 text-xs text-[var(--text-3)]">
            Valeurs reconnues : <strong>comite_directeur</strong> → section « Le Comité Directeur » · <strong>direction</strong> (ou autre) → section « L’Équipe Opérationnelle ».
          </p>
          <input
            type="text"
            value={form.department}
            onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
            className={inputBase}
            placeholder="direction"
          />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Biographie (optionnel)</h3>
        <div>
          <label className={labelCls}>Bio (FR)</label>
          <textarea
            rows={4}
            value={form.bioFr}
            onChange={(e) => setForm((p) => ({ ...p, bioFr: e.target.value }))}
            className={inputBase}
          />
        </div>
        <div>
          <label className={labelCls}>Bio (EN)</label>
          <textarea
            rows={4}
            value={form.bioEn}
            onChange={(e) => setForm((p) => ({ ...p, bioEn: e.target.value }))}
            className={inputBase}
          />
        </div>
        <div>
          <label className={labelCls}>Bio (AR)</label>
          <textarea
            rows={4}
            value={form.bioAr}
            onChange={(e) => setForm((p) => ({ ...p, bioAr: e.target.value }))}
            className={inputBase}
            dir="rtl"
          />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Publication</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Ordre d’affichage</label>
            <p className="mb-2 text-xs text-[var(--text-3)]">
              Organigramme : chiffre des dizaines = ligne (ex. <strong>60</strong> → ligne 6), chiffre des unités = position gauche→droite (ex. <strong>60, 61, 62</strong>). Valeur simple (ex. <strong>1</strong>, <strong>2</strong>) = ligne seule.
            </p>
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
        <Button type="button" variant="outline" onClick={() => router.push("/admin/equipe")} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
