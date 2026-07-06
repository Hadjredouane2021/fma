"use client";

import Image from "next/image";
import { ADMIN_IMAGE_ACCEPT } from "@/lib/admin-upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import { ADMIN_LOCALE_TABS, type AdminLocale } from "@/lib/admin-locale";
import { TEAM_DEPARTMENTS } from "@/lib/team-member-site";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const fieldGroupCard = "rounded-xl border border-[var(--border)] p-4 space-y-3";
const card = "bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6";

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
  const [tab, setTab] = useState<AdminLocale>("fr");
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

  const currentTab = ADMIN_LOCALE_TABS.find((t) => t.key === tab)!;

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

  const isDirection = form.department === "direction";
  const isComite = form.department === "comite_directeur";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className={`${card} space-y-6`}>
        <div className="flex flex-wrap gap-2">
          {ADMIN_LOCALE_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium",
                tab === t.key ? buttonTabActive : buttonTabInactive
              )}
            >
              {t.flag} {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--text-3)]">
          Champs enregistrés en BDD par langue. Sur le site public, chaque locale affiche ses textes avec repli sur le français si absent — même logique que les publications.
          {isDirection
            ? " Service « équipe opérationnelle » : nom et fonction visibles dans l’organigramme."
            : isComite
              ? " Service « comité directeur » : seul le nom (et la photo) est affiché."
              : null}
        </p>

        <div className="space-y-4" dir={currentTab.dir}>
          <div>
            <label className={labelCls}>
              {tab === "ar" ? "الاسم" : tab === "en" ? "Name" : "Nom"}
              {tab === "fr" ? " — obligatoire" : ""}
            </label>
            {tab === "fr" && (
              <input
                type="text"
                value={form.nameFr}
                onChange={(e) => setForm((p) => ({ ...p, nameFr: e.target.value }))}
                className={inputBase}
                required
              />
            )}
            {tab === "en" && (
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
                className={inputBase}
                placeholder="Name in English…"
              />
            )}
            {tab === "ar" && (
              <input
                type="text"
                value={form.nameAr}
                onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))}
                className={inputBase}
                placeholder="الاسم بالعربية…"
              />
            )}
          </div>

          <div>
            <label className={labelCls}>
              {tab === "ar" ? "الوظيفة" : tab === "en" ? "Title" : "Fonction"}
              {isComite ? " (regroupement admin)" : ""}
            </label>
            {isComite ? (
              <p className="mb-2 text-xs text-[var(--text-3)]">
                Non affichée sur le site pour le comité directeur — utilisée en interne pour les libellés de groupe.
              </p>
            ) : isDirection ? (
              <p className="mb-2 text-xs text-[var(--text-3)]">
                Affichée sous le nom dans l’organigramme de l’équipe opérationnelle.
              </p>
            ) : null}
            {tab === "fr" && (
              <input
                type="text"
                value={form.titleFr}
                onChange={(e) => setForm((p) => ({ ...p, titleFr: e.target.value }))}
                className={inputBase}
              />
            )}
            {tab === "en" && (
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))}
                className={inputBase}
                placeholder="Job title in English…"
              />
            )}
            {tab === "ar" && (
              <input
                type="text"
                value={form.titleAr}
                onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))}
                className={inputBase}
                placeholder="المسمى الوظيفي بالعربية…"
              />
            )}
          </div>
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
          <label className={labelCls}>Service / section sur le site</label>
          <select
            value={form.department}
            onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
            className={inputBase}
          >
            <option value={TEAM_DEPARTMENTS.comite_directeur.dbValue}>
              {TEAM_DEPARTMENTS.comite_directeur.adminLabel} — {TEAM_DEPARTMENTS.comite_directeur.siteFields}
            </option>
            <option value={TEAM_DEPARTMENTS.direction.dbValue}>
              {TEAM_DEPARTMENTS.direction.adminLabel} — {TEAM_DEPARTMENTS.direction.siteFields}
            </option>
          </select>
          <p className="mt-2 text-xs text-[var(--text-3)]">
            Valeur enregistrée en BDD dans <code className="text-[var(--text-2)]">department</code>.
            Seuls les membres <strong>actifs</strong> apparaissent sur <code className="text-[var(--text-2)]">/fr/la-fma</code>.
          </p>
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
