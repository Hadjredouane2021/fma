"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Save, RotateCcw, Plus, Trash2, ChevronDown, ChevronRight, GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { LaFmaIconField } from "@/components/admin/LaFmaIconField";
import { PAGE_HERO_SIZE_HINT } from "@/lib/page-hero";
import {
  type ParticuliersContent,
  type InsuranceCard,
  type InsuranceFeature,
  createEmptyCard,
  createEmptyFeature,
  CARDS_MAX,
} from "@/lib/particuliers-site-public";

type Locale = "fr" | "en" | "ar";
const TABS: { key: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { key: "fr", label: "Français", dir: "ltr" },
  { key: "en", label: "English",  dir: "ltr" },
  { key: "ar", label: "العربية",  dir: "rtl" },
];

const inputBase =
  "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1";
const card = "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4";

const COLOR_OPTIONS = [
  "bg-primary", "bg-accent", "bg-gold", "bg-mauve", "bg-graphite",
  "bg-pale", "bg-primary-400", "bg-primary-600", "bg-blue-500", "bg-emerald-500",
];

function LocalizedFields({
  label, value, onChange, multiline = false, tab,
}: {
  label: string;
  value: { fr: string; en: string; ar: string };
  onChange: (v: { fr: string; en: string; ar: string }) => void;
  multiline?: boolean;
  tab: Locale;
}) {
  const dir = tab === "ar" ? "rtl" : "ltr";
  return (
    <div>
      <p className={labelCls}>{label}</p>
      {multiline ? (
        <textarea
          rows={3}
          dir={dir}
          value={value[tab]}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          className={inputBase}
        />
      ) : (
        <input
          type="text"
          dir={dir}
          value={value[tab]}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          className={inputBase}
        />
      )}
    </div>
  );
}

function FeatureRow({ feat, onChange, onRemove, tab }: {
  feat: InsuranceFeature; onChange: (f: InsuranceFeature) => void; onRemove: () => void; tab: Locale;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        dir={tab === "ar" ? "rtl" : "ltr"}
        value={feat[tab]}
        onChange={(e) => onChange({ ...feat, [tab]: e.target.value })}
        className={inputBase + " flex-1"}
        placeholder={tab === "ar" ? "ميزة..." : tab === "en" ? "Feature..." : "Fonctionnalité..."}
      />
      <button type="button" onClick={onRemove} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex-shrink-0">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function CardRow({ card: c, onChange, onRemove, tab }: {
  card: InsuranceCard; onChange: (c: InsuranceCard) => void; onRemove: () => void; tab: Locale;
}) {
  const [expanded, setExpanded] = useState(false);
  const updateFeature = (idx: number, f: InsuranceFeature) => {
    const features = [...c.features]; features[idx] = f;
    onChange({ ...c, features });
  };
  const removeFeature = (idx: number) => onChange({ ...c, features: c.features.filter((_, i) => i !== idx) });
  const addFeature = () => { onChange({ ...c, features: [...c.features, createEmptyFeature()] }); setExpanded(true); };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <GripVertical className="w-4 h-4 text-[var(--text-3)] flex-shrink-0 mt-1 cursor-grab" />
        <div className="flex-1 space-y-3 min-w-0">
          {/* Icon + color */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <LaFmaIconField
                label="Icône (emoji ou image)"
                value={c.icon}
                onChange={(v) => onChange({ ...c, icon: v })}
                labelCls={labelCls}
                inputBase={inputBase}
                uploadFolder="particuliers-icons"
                widePreview
                sizeHint={PAGE_HERO_SIZE_HINT}
              />
            </div>
            <div className="shrink-0">
              <p className={labelCls}>Couleur de fond</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => onChange({ ...c, color: col })}
                    className={`w-6 h-6 rounded-lg ${col} border-2 transition-all ${c.color === col ? "border-[var(--text-1)] scale-110" : "border-transparent"}`}
                    title={col}
                  />
                ))}
              </div>
            </div>
          </div>

          <LocalizedFields label="Titre" value={c.title} onChange={(v) => onChange({ ...c, title: v })} tab={tab} />
          <div>
            <p className={labelCls}>Lien « En savoir plus »</p>
            <input
              type="text"
              value={c.link ?? ""}
              onChange={(e) => onChange({ ...c, link: e.target.value })}
              className={inputBase}
              placeholder="/fr/contact ou https://… (vide = page contact)"
            />
            <p className="mt-1 text-[10px] text-[var(--text-3)]">
              Chemin interne (<code className="text-[var(--text-2)]">/fr/contact</code>) ou URL externe.
            </p>
          </div>
          <div>
            <p className={labelCls}>Contenu modal « En savoir plus » ({tab.toUpperCase()})</p>
            <p className="mb-2 text-[10px] text-[var(--text-3)]">
              Si renseigné, ouvre une fenêtre modale au clic. Prioritaire sur le lien ci-dessus.
            </p>
            <RichTextEditor
              value={c.detailContent?.[tab] ?? ""}
              onChange={(html) =>
                onChange({
                  ...c,
                  detailContent: { fr: "", en: "", ar: "", ...c.detailContent, [tab]: html },
                })
              }
              dir={tab === "ar" ? "rtl" : "ltr"}
            />
          </div>
          <div>
            <p className={labelCls}>Description</p>
            <RichTextEditor
              value={c.description[tab]}
              onChange={(html) => onChange({ ...c, description: { ...c.description, [tab]: html } })}
              dir={tab === "ar" ? "rtl" : "ltr"}
            />
          </div>

          {/* Features */}
          <div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
            >
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              Fonctionnalités ({c.features.length})
            </button>
            {expanded && (
              <div className="mt-2 space-y-2 bg-[var(--bg-alt)] rounded-xl p-3">
                {c.features.map((f, idx) => (
                  <FeatureRow key={idx} feat={f} onChange={(nf) => updateFeature(idx, nf)} onRemove={() => removeFeature(idx)} tab={tab} />
                ))}
                <button type="button" onClick={addFeature} className="flex items-center gap-1 text-xs text-primary hover:underline font-medium mt-1">
                  <Plus className="w-3 h-3" /> Ajouter
                </button>
              </div>
            )}
          </div>
        </div>
        <button type="button" onClick={onRemove} className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex-shrink-0">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ParticuliersForm({ initial }: { initial: ParticuliersContent }) {
  const router = useRouter();
  const [form, setForm] = useState<ParticuliersContent>(initial);
  const [tab, setTab] = useState<Locale>("fr");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateCard = (idx: number, c: InsuranceCard) => {
    const cards = [...form.cards]; cards[idx] = c; setForm({ ...form, cards });
  };
  const removeCard = (idx: number) => setForm({ ...form, cards: form.cards.filter((_, i) => i !== idx) });
  const addCard = () => { if (form.cards.length < CARDS_MAX) setForm({ ...form, cards: [...form.cards, createEmptyCard()] }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/particuliers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSuccess(true); router.refresh(); }
      else { const d = await res.json().catch(() => ({})); setError(d.message || "Erreur"); }
    } catch { setError("Erreur réseau"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Onglets langue */}
      <div className="flex gap-1 border border-[var(--border)] rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? "bg-primary text-white shadow-sm" : "text-[var(--text-2)] hover:bg-[var(--hover-bg)]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Hero</h3>
        <LocalizedFields label="Badge" value={form.heroBadge} onChange={(v) => setForm({ ...form, heroBadge: v })} tab={tab} />
        <LocalizedFields label="Titre" value={form.heroTitle} onChange={(v) => setForm({ ...form, heroTitle: v })} tab={tab} />
        <LocalizedFields label="Sous-titre" value={form.heroSubtitle} onChange={(v) => setForm({ ...form, heroSubtitle: v })} multiline tab={tab} />
      </div>

      {/* CTA */}
      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Bloc CTA (bas de page)</h3>
        <LocalizedFields label="Titre" value={form.ctaTitle} onChange={(v) => setForm({ ...form, ctaTitle: v })} tab={tab} />
        <LocalizedFields label="Sous-titre" value={form.ctaSubtitle} onChange={(v) => setForm({ ...form, ctaSubtitle: v })} tab={tab} />
        <LocalizedFields label="Bouton" value={form.ctaButton} onChange={(v) => setForm({ ...form, ctaButton: v })} tab={tab} />
      </div>

      {/* Cartes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-1)]">Cartes d&apos;assurance ({form.cards.length}/{CARDS_MAX})</h3>
        </div>
        {form.cards.map((c, idx) => (
          <CardRow key={c.id} card={c} onChange={(nc) => updateCard(idx, nc)} onRemove={() => removeCard(idx)} tab={tab} />
        ))}
        {form.cards.length < CARDS_MAX && (
          <button type="button" onClick={addCard}
            className="flex items-center gap-2 w-full justify-center px-4 py-3 border border-dashed border-[var(--border)] rounded-xl text-sm text-[var(--text-2)] hover:border-primary hover:text-primary transition-colors">
            <Plus className="w-4 h-4" /> Ajouter une carte
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
      {success && <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Enregistré avec succès.</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </Button>
        <Button type="button" variant="outline" onClick={() => { setForm(initial); setSuccess(false); setError(""); }} disabled={loading} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Annuler
        </Button>
      </div>
    </form>
  );
}
