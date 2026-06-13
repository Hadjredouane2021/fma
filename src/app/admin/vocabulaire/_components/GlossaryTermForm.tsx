"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const fieldGroupCard = "rounded-xl border border-[var(--border)] p-4 space-y-3";

function suggestedLetter(termFr: string): string {
  const t = termFr.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const m = t.match(/[A-Za-z]/);
  return m ? m[0].toUpperCase() : "?";
}

export type GlossaryTermFormInitial = {
  id: string;
  termFr: string;
  termEn: string | null;
  termAr: string | null;
  definitionFr: string;
  definitionEn: string | null;
  definitionAr: string | null;
  letter: string;
  order: number;
};

interface GlossaryTermFormProps {
  initial?: GlossaryTermFormInitial | null;
  defaultOrder?: number;
}

export default function GlossaryTermForm({ initial, defaultOrder = 0 }: GlossaryTermFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    termFr: initial?.termFr ?? "",
    termEn: initial?.termEn ?? "",
    termAr: initial?.termAr ?? "",
    definitionFr: initial?.definitionFr ?? "",
    definitionEn: initial?.definitionEn ?? "",
    definitionAr: initial?.definitionAr ?? "",
    letter: initial?.letter ?? "",
    order: initial?.order ?? defaultOrder,
  });

  const letterHint = suggestedLetter(form.termFr);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const letter = (form.letter.trim().toUpperCase().slice(0, 3) || letterHint).slice(0, 3);
    const payload = { ...form, letter };
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/admin/glossary/${initial!.id}` : "/api/admin/glossary";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/vocabulaire");
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
        <h3 className="text-sm font-bold text-primary">Terme</h3>
        <div>
          <label className={labelCls}>Terme (FR) — obligatoire</label>
          <input
            type="text"
            value={form.termFr}
            onChange={(e) => setForm((p) => ({ ...p, termFr: e.target.value }))}
            className={inputBase}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Terme (EN)</label>
          <input type="text" value={form.termEn} onChange={(e) => setForm((p) => ({ ...p, termEn: e.target.value }))} className={inputBase} />
        </div>
        <div>
          <label className={labelCls}>Terme (AR)</label>
          <input type="text" value={form.termAr} onChange={(e) => setForm((p) => ({ ...p, termAr: e.target.value }))} className={inputBase} dir="rtl" />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Définition</h3>
        <div>
          <label className={labelCls}>Définition (FR) — obligatoire</label>
          <textarea rows={5} value={form.definitionFr} onChange={(e) => setForm((p) => ({ ...p, definitionFr: e.target.value }))} className={inputBase} required />
        </div>
        <div>
          <label className={labelCls}>Définition (EN)</label>
          <textarea rows={5} value={form.definitionEn} onChange={(e) => setForm((p) => ({ ...p, definitionEn: e.target.value }))} className={inputBase} />
        </div>
        <div>
          <label className={labelCls}>Définition (AR)</label>
          <textarea rows={5} value={form.definitionAr} onChange={(e) => setForm((p) => ({ ...p, definitionAr: e.target.value }))} className={inputBase} dir="rtl" />
        </div>
      </div>

      <div className={fieldGroupCard}>
        <h3 className="text-sm font-bold text-primary">Classement</h3>
        <div>
          <label className={labelCls}>
            Lettre de section
            <span className="text-[var(--text-3)] font-normal normal-case ml-1">(vide = « {letterHint} »)</span>
          </label>
          <input
            type="text"
            value={form.letter}
            onChange={(e) => setForm((p) => ({ ...p, letter: e.target.value }))}
            className={`${inputBase} max-w-[6rem] font-mono uppercase`}
            maxLength={3}
            placeholder={letterHint}
          />
          <p className="mt-1 text-xs text-[var(--text-3)]">Regroupe les entrées sur la page publique Vocabulaire (ancres A, B, …).</p>
        </div>
        <div>
          <label className={labelCls}>Ordre dans la lettre</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
            className={`${inputBase} max-w-[8rem]`}
          />
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
        <Button type="button" variant="outline" onClick={() => router.push("/admin/vocabulaire")} disabled={loading}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
