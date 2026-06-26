"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { LaFmaIconField } from "@/components/admin/LaFmaIconField";
import { PAGE_HERO_SIZE_HINT } from "@/lib/page-hero";
import {
  type FormationsContent,
  type FormationItem,
  type FormationFeature,
  type FormationFaqItem,
  type FormationFormat,
  createEmptyFormation,
  createEmptyFeature,
  createEmptyFaqItem,
  FORMATIONS_MAX,
  FAQ_MAX,
  FORMATION_FORMATS,
} from "@/lib/formations-site-public";

type Locale = "fr" | "en" | "ar";
const TABS: { key: Locale; label: string }[] = [
  { key: "fr", label: "Français" },
  { key: "en", label: "English" },
  { key: "ar", label: "العربية" },
];

const inputBase =
  "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1";
const card = "bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4";

const COLOR_OPTIONS = [
  "bg-primary",
  "bg-accent",
  "bg-gold",
  "bg-mauve",
  "bg-graphite",
  "bg-pale",
  "bg-primary-400",
  "bg-primary-600",
  "bg-blue-500",
  "bg-emerald-500",
];

const FORMAT_LABELS: Record<FormationFormat, string> = {
  presentiel: "Présentiel",
  distanciel: "Distanciel",
  hybride: "Hybride",
};

function LocalizedFields({
  label,
  value,
  onChange,
  multiline = false,
  tab,
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

function FeatureRow({
  feat,
  onChange,
  onRemove,
  tab,
}: {
  feat: FormationFeature;
  onChange: (f: FormationFeature) => void;
  onRemove: () => void;
  tab: Locale;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        dir={tab === "ar" ? "rtl" : "ltr"}
        value={feat[tab]}
        onChange={(e) => onChange({ ...feat, [tab]: e.target.value })}
        className={inputBase + " flex-1"}
        placeholder={tab === "ar" ? "نقطة..." : tab === "en" ? "Point..." : "Point clé..."}
      />
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function FormationRow({
  formation: f,
  onChange,
  onRemove,
  tab,
}: {
  formation: FormationItem;
  onChange: (f: FormationItem) => void;
  onRemove: () => void;
  tab: Locale;
}) {
  const [expanded, setExpanded] = useState(false);
  const updateFeature = (idx: number, feat: FormationFeature) => {
    const features = [...f.features];
    features[idx] = feat;
    onChange({ ...f, features });
  };
  const removeFeature = (idx: number) => onChange({ ...f, features: f.features.filter((_, i) => i !== idx) });
  const addFeature = () => {
    onChange({ ...f, features: [...f.features, createEmptyFeature()] });
    setExpanded(true);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="flex items-start gap-3 p-4">
        <GripVertical className="mt-1 h-4 w-4 shrink-0 cursor-grab text-[var(--text-3)]" />
        <div className="min-w-0 flex-1 space-y-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--text-2)]">
            <input
              type="checkbox"
              checked={f.active !== false}
              onChange={(e) => onChange({ ...f, active: e.target.checked })}
              className="h-4 w-4 rounded border-[var(--border)] text-primary focus:ring-primary/30"
            />
            Visible sur le site (publiée)
          </label>

          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <LaFmaIconField
                label="Visuel (emoji, image ou nom Lucide)"
                value={f.icon}
                onChange={(v) => onChange({ ...f, icon: v })}
                labelCls={labelCls}
                inputBase={inputBase}
                uploadFolder="formations-icons"
                widePreview
                sizeHint={PAGE_HERO_SIZE_HINT}
              />
            </div>
            <div className="shrink-0">
              <p className={labelCls}>Couleur de fond</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => onChange({ ...f, color: col })}
                    className={`h-6 w-6 rounded-lg ${col} border-2 transition-all ${f.color === col ? "scale-110 border-[var(--text-1)]" : "border-transparent"}`}
                    title={col}
                  />
                ))}
              </div>
            </div>
          </div>

          <LocalizedFields label="Titre" value={f.title} onChange={(v) => onChange({ ...f, title: v })} tab={tab} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className={labelCls}>Date de début</p>
              <input
                type="date"
                value={f.startDate ?? ""}
                onChange={(e) => onChange({ ...f, startDate: e.target.value })}
                className={inputBase}
              />
            </div>
            <div>
              <p className={labelCls}>Date de fin</p>
              <input
                type="date"
                value={f.endDate ?? ""}
                onChange={(e) => onChange({ ...f, endDate: e.target.value })}
                className={inputBase}
              />
            </div>
            <div>
              <p className={labelCls}>Lieu</p>
              <input
                type="text"
                value={f.location ?? ""}
                onChange={(e) => onChange({ ...f, location: e.target.value })}
                className={inputBase}
              />
            </div>
            <div>
              <p className={labelCls}>Durée</p>
              <input
                type="text"
                value={f.duration ?? ""}
                onChange={(e) => onChange({ ...f, duration: e.target.value })}
                className={inputBase}
                placeholder="3 jours"
              />
            </div>
            <div>
              <p className={labelCls}>Format</p>
              <select
                value={f.format ?? ""}
                onChange={(e) => onChange({ ...f, format: e.target.value as FormationFormat | "" })}
                className={inputBase}
              >
                <option value="">—</option>
                {FORMATION_FORMATS.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {FORMAT_LABELS[fmt]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className={labelCls}>Niveau</p>
              <input
                type="text"
                value={f.level ?? ""}
                onChange={(e) => onChange({ ...f, level: e.target.value })}
                className={inputBase}
                placeholder="debutant, intermediaire, avance…"
              />
            </div>
            <div>
              <p className={labelCls}>Organisateur</p>
              <input
                type="text"
                value={f.organizer ?? ""}
                onChange={(e) => onChange({ ...f, organizer: e.target.value })}
                className={inputBase}
              />
            </div>
            <div>
              <p className={labelCls}>Tarif</p>
              <input
                type="text"
                value={f.price ?? ""}
                onChange={(e) => onChange({ ...f, price: e.target.value })}
                className={inputBase}
              />
            </div>
          </div>

          <div>
            <p className={labelCls}>URL d&apos;inscription</p>
            <input
              type="text"
              value={f.registrationUrl ?? ""}
              onChange={(e) => onChange({ ...f, registrationUrl: e.target.value })}
              className={inputBase}
              placeholder="https://…"
            />
          </div>
          <div>
            <p className={labelCls}>Lien « En savoir plus »</p>
            <input
              type="text"
              value={f.link ?? ""}
              onChange={(e) => onChange({ ...f, link: e.target.value })}
              className={inputBase}
              placeholder="/fr/contact ou https://… (vide = page contact)"
            />
          </div>
          <div>
            <p className={labelCls}>Contenu modal « En savoir plus » ({tab.toUpperCase()})</p>
            <RichTextEditor
              value={f.detailContent?.[tab] ?? ""}
              onChange={(html) =>
                onChange({
                  ...f,
                  detailContent: { fr: "", en: "", ar: "", ...f.detailContent, [tab]: html },
                })
              }
              dir={tab === "ar" ? "rtl" : "ltr"}
            />
          </div>
          <div>
            <p className={labelCls}>Description ({tab.toUpperCase()})</p>
            <RichTextEditor
              value={f.description[tab]}
              onChange={(html) => onChange({ ...f, description: { ...f.description, [tab]: html } })}
              dir={tab === "ar" ? "rtl" : "ltr"}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]"
            >
              {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              Points clés ({f.features.length})
            </button>
            {expanded && (
              <div className="mt-2 space-y-2 rounded-xl bg-[var(--bg-alt)] p-3">
                {f.features.map((feat, idx) => (
                  <FeatureRow
                    key={idx}
                    feat={feat}
                    onChange={(nf) => updateFeature(idx, nf)}
                    onRemove={() => removeFeature(idx)}
                    tab={tab}
                  />
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" /> Ajouter
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-xl p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function FaqRow({
  item,
  onChange,
  onRemove,
  tab,
}: {
  item: FormationFaqItem;
  onChange: (f: FormationFaqItem) => void;
  onRemove: () => void;
  tab: Locale;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="flex items-start gap-3 p-4">
        <GripVertical className="mt-1 h-4 w-4 shrink-0 cursor-grab text-[var(--text-3)]" />
        <div className="min-w-0 flex-1 space-y-3">
          <LocalizedFields
            label="Question"
            value={item.question}
            onChange={(v) => onChange({ ...item, question: v })}
            tab={tab}
          />
          <LocalizedFields
            label="Réponse"
            value={item.answer}
            onChange={(v) => onChange({ ...item, answer: v })}
            multiline
            tab={tab}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-xl p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function FormationsForm({ initial }: { initial: FormationsContent }) {
  const router = useRouter();
  const [form, setForm] = useState<FormationsContent>(initial);
  const [tab, setTab] = useState<Locale>("fr");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateFormation = (idx: number, f: FormationItem) => {
    const formations = [...form.formations];
    formations[idx] = f;
    setForm({ ...form, formations });
  };
  const removeFormation = (idx: number) =>
    setForm({ ...form, formations: form.formations.filter((_, i) => i !== idx) });
  const addFormation = () => {
    if (form.formations.length < FORMATIONS_MAX) {
      setForm({ ...form, formations: [...form.formations, createEmptyFormation()] });
    }
  };

  const updateFaq = (idx: number, f: FormationFaqItem) => {
    const faq = [...form.faq];
    faq[idx] = f;
    setForm({ ...form, faq });
  };
  const removeFaq = (idx: number) => setForm({ ...form, faq: form.faq.filter((_, i) => i !== idx) });
  const addFaq = () => {
    if (form.faq.length < FAQ_MAX) setForm({ ...form, faq: [...form.faq, createEmptyFaqItem()] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/formations", {
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
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="flex w-fit gap-1 rounded-xl border border-[var(--border)] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${tab === t.key ? "bg-primary text-white shadow-sm" : "text-[var(--text-2)] hover:bg-[var(--hover-bg)]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Hero</h3>
        <LocalizedFields
          label="Badge"
          value={form.heroBadge}
          onChange={(v) => setForm({ ...form, heroBadge: v })}
          tab={tab}
        />
        <LocalizedFields
          label="Titre"
          value={form.heroTitle}
          onChange={(v) => setForm({ ...form, heroTitle: v })}
          tab={tab}
        />
        <LocalizedFields
          label="Sous-titre"
          value={form.heroSubtitle}
          onChange={(v) => setForm({ ...form, heroSubtitle: v })}
          multiline
          tab={tab}
        />
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Section formations</h3>
        <LocalizedFields
          label="Titre de section"
          value={form.formationsSectionTitle}
          onChange={(v) => setForm({ ...form, formationsSectionTitle: v })}
          tab={tab}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[var(--text-1)]">
          Formations ({form.formations.length}/{FORMATIONS_MAX})
        </h3>
        {form.formations.map((f, idx) => (
          <FormationRow
            key={f.id}
            formation={f}
            onChange={(nf) => updateFormation(idx, nf)}
            onRemove={() => removeFormation(idx)}
            tab={tab}
          />
        ))}
        {form.formations.length < FORMATIONS_MAX && (
          <button
            type="button"
            onClick={addFormation}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--text-2)] transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Ajouter une formation
          </button>
        )}
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Section FAQ</h3>
        <LocalizedFields
          label="Titre de section"
          value={form.faqTitle}
          onChange={(v) => setForm({ ...form, faqTitle: v })}
          tab={tab}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[var(--text-1)]">
          Questions ({form.faq.length}/{FAQ_MAX})
        </h3>
        {form.faq.map((f, idx) => (
          <FaqRow
            key={f.id}
            item={f}
            onChange={(nf) => updateFaq(idx, nf)}
            onRemove={() => removeFaq(idx)}
            tab={tab}
          />
        ))}
        {form.faq.length < FAQ_MAX && (
          <button
            type="button"
            onClick={addFaq}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--text-2)] transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Ajouter une question
          </button>
        )}
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Bloc CTA (bas de page)</h3>
        <LocalizedFields
          label="Titre"
          value={form.ctaTitle}
          onChange={(v) => setForm({ ...form, ctaTitle: v })}
          tab={tab}
        />
        <LocalizedFields
          label="Bouton"
          value={form.ctaButton}
          onChange={(v) => setForm({ ...form, ctaButton: v })}
          tab={tab}
        />
      </div>

      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}
      {success ? <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Enregistré avec succès.</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
          <RotateCcw className="h-4 w-4" /> Annuler
        </Button>
      </div>
    </form>
  );
}
