"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import { ADMIN_LOCALE_TABS, type AdminLocale } from "@/lib/admin-locale";
import type { FooterContent } from "@/lib/footer-site-public";

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const card = "bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4";

type LocalizedFooterKey =
  | "description"
  | "navigationTitle"
  | "usefulLinksTitle"
  | "contactTitle"
  | "address"
  | "copyrightOrg"
  | "copyrightRights";

const localizedFieldKey = (base: LocalizedFooterKey, lang: AdminLocale): keyof FooterContent =>
  `${base}${lang === "fr" ? "Fr" : lang === "en" ? "En" : "Ar"}` as keyof FooterContent;

export default function FooterForm({ initial }: { initial: FooterContent }) {
  const router = useRouter();
  const [form, setForm] = useState<FooterContent>(initial);
  const [tab, setTab] = useState<AdminLocale>("fr");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const currentTab = ADMIN_LOCALE_TABS.find((t) => t.key === tab)!;

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const setLocalized = (base: LocalizedFooterKey, lang: AdminLocale, value: string) => {
    const key = localizedFieldKey(base, lang);
    setForm((p) => ({ ...p, [key]: value }));
  };

  const set = (key: keyof FooterContent, value: string) => setForm((p) => ({ ...p, [key]: value }));

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
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.message || "Erreur");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h3 className="text-sm font-bold text-primary">Textes du footer</h3>
          <div className="flex flex-wrap gap-2">
            {ADMIN_LOCALE_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-sm font-medium",
                  tab === t.key ? buttonTabActive : buttonTabInactive
                )}
              >
                {t.flag} {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <a
            href={`/${tab}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Eye className="h-3.5 w-3.5" />
            Aperçu site ({currentTab.label})
          </a>
        </div>
        <p className="text-xs text-[var(--text-3)] mb-4">
          Champs affichés selon la langue active sur le site public, avec repli sur le français si absent (EN/AR).
          Téléphone, e-mail et réseaux sociaux sont communs à toutes les langues.
        </p>

        <div className="space-y-4" dir={currentTab.dir}>
          <div>
            <label className={labelCls}>Description sous le logo ({tab.toUpperCase()})</label>
            <textarea
              rows={3}
              value={form[localizedFieldKey("description", tab)]}
              onChange={(e) => setLocalized("description", tab, e.target.value)}
              className={inputBase}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Titre colonne navigation ({tab.toUpperCase()})</label>
              <input
                type="text"
                value={form[localizedFieldKey("navigationTitle", tab)]}
                onChange={(e) => setLocalized("navigationTitle", tab, e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelCls}>Titre colonne liens utiles ({tab.toUpperCase()})</label>
              <input
                type="text"
                value={form[localizedFieldKey("usefulLinksTitle", tab)]}
                onChange={(e) => setLocalized("usefulLinksTitle", tab, e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Titre colonne contact ({tab.toUpperCase()})</label>
            <input
              type="text"
              value={form[localizedFieldKey("contactTitle", tab)]}
              onChange={(e) => setLocalized("contactTitle", tab, e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className={labelCls}>Adresse ({tab.toUpperCase()})</label>
            <textarea
              rows={2}
              value={form[localizedFieldKey("address", tab)]}
              onChange={(e) => setLocalized("address", tab, e.target.value)}
              className={inputBase}
            />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-alt)]/50 p-4 space-y-4">
            <p className="text-xs font-semibold text-primary">Barre du bas — copyright</p>
            <p className="text-xs text-[var(--text-3)]">
              L’année est ajoutée automatiquement sur le site (ex. © {new Date().getFullYear()} …).
            </p>
            <div>
              <label className={labelCls}>Nom de l’organisme ({tab.toUpperCase()})</label>
              <input
                type="text"
                value={form[localizedFieldKey("copyrightOrg", tab)]}
                onChange={(e) => setLocalized("copyrightOrg", tab, e.target.value)}
                className={inputBase}
                placeholder="Fédération Marocaine de l'Assurance"
              />
            </div>
            <div>
              <label className={labelCls}>Mention droits ({tab.toUpperCase()})</label>
              <input
                type="text"
                value={form[localizedFieldKey("copyrightRights", tab)]}
                onChange={(e) => setLocalized("copyrightRights", tab, e.target.value)}
                className={inputBase}
                placeholder={tab === "ar" ? "جميع الحقوق محفوظة" : tab === "en" ? "All rights reserved" : "Tous droits réservés"}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Coordonnées (toutes langues)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Téléphone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={inputBase}
              placeholder="+212 5 22 … (plusieurs numéros séparés par |)"
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputBase}
              placeholder="contact@fma.org.ma"
            />
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

      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}
      {success ? <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Enregistré avec succès.</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setForm(initial);
            setSuccess(false);
            setError("");
          }}
          disabled={loading}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Annuler
        </Button>
      </div>
    </form>
  );
}
