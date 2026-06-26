"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { FooterContent } from "@/lib/footer-site-public";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const card = "bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4";

export default function FooterForm({ initial }: { initial: FooterContent }) {
  const router = useRouter();
  const [form, setForm] = useState<FooterContent>(initial);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FooterContent, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSuccess(true); router.refresh(); }
      else { const d = await res.json().catch(() => ({})); setError(d.message || "Erreur"); }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Description</h3>
        <div>
          <label className={labelCls}>Description (FR)</label>
          <textarea rows={3} value={form.descriptionFr} onChange={(e) => set("descriptionFr", e.target.value)} className={inputBase} />
        </div>
        <div>
          <label className={labelCls}>Description (EN)</label>
          <textarea rows={3} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} className={inputBase} />
        </div>
        <div>
          <label className={labelCls}>Description (AR)</label>
          <textarea rows={3} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} className={inputBase} dir="rtl" />
        </div>
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Coordonnées</h3>
        <div>
          <label className={labelCls}>Adresse</label>
          <textarea rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} className={inputBase} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Téléphone</label>
            <input type="text" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputBase} placeholder="+212 5 22 … (plusieurs numéros séparés par |)" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputBase} placeholder="contact@fma.org.ma" />
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Réseaux sociaux</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Facebook</label>
            <input type="url" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} className={inputBase} placeholder="https://facebook.com/…" />
          </div>
          <div>
            <label className={labelCls}>LinkedIn</label>
            <input type="url" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} className={inputBase} placeholder="https://linkedin.com/…" />
          </div>
          <div>
            <label className={labelCls}>Twitter / X</label>
            <input type="url" value={form.twitter} onChange={(e) => set("twitter", e.target.value)} className={inputBase} placeholder="https://twitter.com/…" />
          </div>
          <div>
            <label className={labelCls}>Instagram</label>
            <input type="url" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} className={inputBase} placeholder="https://instagram.com/…" />
          </div>
          <div>
            <label className={labelCls}>YouTube</label>
            <input type="url" value={form.youtube} onChange={(e) => set("youtube", e.target.value)} className={inputBase} placeholder="https://youtube.com/…" />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
      {success && <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Enregistré avec succès.</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </Button>
        <Button type="button" variant="outline" onClick={() => { setForm(initial); setSuccess(false); setError(""); }} disabled={loading} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Annuler
        </Button>
      </div>
    </form>
  );
}
