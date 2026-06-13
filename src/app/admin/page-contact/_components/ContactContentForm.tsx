"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import {
  DEFAULT_CONTACT_CONTENT,
  type ContactContent,
} from "@/lib/contact-site-public";
import type { LocalizedString } from "@/lib/la-fma-site-public";

type Locale = "fr" | "en" | "ar";

const TABS: { key: Locale; flag: string; label: string; dir: "ltr" | "rtl" }[] = [
  { key: "fr", flag: "🇫🇷", label: "Français", dir: "ltr" },
  { key: "en", flag: "🇬🇧", label: "English", dir: "ltr" },
  { key: "ar", flag: "🇲🇦", label: "العربية", dir: "rtl" },
];

const LOCALIZED_KEYS: { key: keyof Pick<ContactContent, "heroBadge" | "heroTitle" | "heroSubtitle" | "hours" | "formTitle">; label: string }[] = [
  { key: "heroBadge", label: "Badge du hero" },
  { key: "heroTitle", label: "Titre du hero" },
  { key: "heroSubtitle", label: "Sous-titre du hero" },
  { key: "hours", label: "Horaires d'ouverture" },
  { key: "formTitle", label: "Titre du formulaire" },
];

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const card = "bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4";

export default function ContactContentForm({ initial }: { initial: ContactContent }) {
  const router = useRouter();
  const [form, setForm] = useState<ContactContent>(initial);
  const [tab, setTab] = useState<Locale>("fr");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const currentTab = TABS.find((t) => t.key === tab)!;

  const setLocalized = (key: keyof ContactContent, lang: Locale, value: string) =>
    setForm((p) => ({
      ...p,
      [key]: { ...(p[key] as LocalizedString), [lang]: value },
    }));

  const setField = (key: keyof ContactContent, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError((d.message as string) || "Erreur");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Textes multilingues</h3>
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn("rounded-xl px-4 py-2 text-sm font-medium transition-all", tab === t.key ? buttonTabActive : buttonTabInactive)}
            >
              {t.flag} {t.label}
            </button>
          ))}
        </div>
        <div dir={currentTab.dir} className="space-y-4">
          {LOCALIZED_KEYS.map(({ key, label }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              {key === "heroSubtitle" || key === "hours" ? (
                <textarea
                  rows={2}
                  value={(form[key] as LocalizedString)[tab]}
                  onChange={(e) => setLocalized(key, tab, e.target.value)}
                  className={inputBase}
                />
              ) : (
                <input
                  type="text"
                  value={(form[key] as LocalizedString)[tab]}
                  onChange={(e) => setLocalized(key, tab, e.target.value)}
                  className={inputBase}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Coordonnées</h3>
        <div>
          <label className={labelCls}>Adresse</label>
          <textarea rows={3} value={form.address} onChange={(e) => setField("address", e.target.value)} className={inputBase} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Téléphone</label>
            <input type="text" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className={inputBase} />
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Carte Google Maps</h3>
        <div>
          <label className={labelCls}>URL d&apos;intégration (iframe src)</label>
          <textarea
            rows={3}
            value={form.mapEmbedUrl}
            onChange={(e) => setField("mapEmbedUrl", e.target.value)}
            className={cn(inputBase, "font-mono text-xs")}
            placeholder="https://www.google.com/maps/embed?pb=…"
          />
        </div>
        <p className="text-xs text-[var(--text-3)]">
          Sur Google Maps : Partager → Intégrer une carte → copier l&apos;URL du paramètre <code className="text-[var(--text-2)]">src</code> de l&apos;iframe.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
          Page contact enregistrée.
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" isLoading={loading}>
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setForm(DEFAULT_CONTACT_CONTENT);
            setError("");
            setSuccess(false);
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser le formulaire
        </Button>
      </div>
    </form>
  );
}
