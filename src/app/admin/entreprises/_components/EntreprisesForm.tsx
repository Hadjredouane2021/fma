"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Save, RotateCcw, Plus, Trash2, ChevronDown, ChevronRight, GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { LaFmaIconField } from "@/components/admin/LaFmaIconField";
import {
  type EntreprisesContent,
  type EntrepriseProduct,
  type EntrepriseFeature,
  type EntrepriseFaqItem,
  type EntrepriseProductAudience,
  createEmptyProduct,
  createEmptyFeature,
  createEmptyFaqItem,
  PRODUCTS_MAX,
  FAQ_MAX,
} from "@/lib/entreprises-site-public";

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
  "bg-primary", "bg-accent", "bg-gold", "bg-mauve", "bg-graphite",
  "bg-pale", "bg-primary-400", "bg-primary-600", "bg-blue-500", "bg-emerald-500",
];

const AUDIENCE_OPTIONS: { value: EntrepriseProductAudience; label: string }[] = [
  { value: "entreprises", label: "Entreprises" },
  { value: "professionnels", label: "Professionnels" },
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
  feat: EntrepriseFeature; onChange: (f: EntrepriseFeature) => void; onRemove: () => void; tab: Locale;
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

function ProductRow({ product: p, onChange, onRemove, tab }: {
  product: EntrepriseProduct;
  onChange: (p: EntrepriseProduct) => void;
  onRemove: () => void;
  tab: Locale;
}) {
  const [expanded, setExpanded] = useState(false);
  const updateFeature = (idx: number, f: EntrepriseFeature) => {
    const features = [...p.features]; features[idx] = f;
    onChange({ ...p, features });
  };
  const removeFeature = (idx: number) => onChange({ ...p, features: p.features.filter((_, i) => i !== idx) });
  const addFeature = () => { onChange({ ...p, features: [...p.features, createEmptyFeature()] }); setExpanded(true); };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <GripVertical className="w-4 h-4 text-[var(--text-3)] flex-shrink-0 mt-1 cursor-grab" />
        <div className="flex-1 space-y-3 min-w-0">
          <div>
            <p className={labelCls}>Type d&apos;affichage</p>
            <select
              value={p.audience ?? "entreprises"}
              onChange={(e) => onChange({ ...p, audience: e.target.value as EntrepriseProductAudience })}
              className={inputBase + " max-w-xs"}
            >
              {AUDIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-[var(--text-3)]">
              Détermine la section sur la page publique (Entreprises ou Professionnels).
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <LaFmaIconField
                label="Icône (emoji, image ou nom Lucide)"
                value={p.icon}
                onChange={(v) => onChange({ ...p, icon: v })}
                labelCls={labelCls}
                inputBase={inputBase}
                uploadFolder="entreprises-icons"
                widePreview
                sizeHint="594 × 162 px (ratio 37:10) — idéalement 1188 × 324 px pour les écrans Retina"
              />
            </div>
            <div className="shrink-0">
              <p className={labelCls}>Couleur de fond</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => onChange({ ...p, color: col })}
                    className={`w-6 h-6 rounded-lg ${col} border-2 transition-all ${p.color === col ? "border-[var(--text-1)] scale-110" : "border-transparent"}`}
                    title={col}
                  />
                ))}
              </div>
            </div>
          </div>

          <LocalizedFields label="Titre" value={p.title} onChange={(v) => onChange({ ...p, title: v })} tab={tab} />
          <div>
            <p className={labelCls}>Lien « En savoir plus »</p>
            <input
              type="text"
              value={p.link ?? ""}
              onChange={(e) => onChange({ ...p, link: e.target.value })}
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
              value={p.detailContent?.[tab] ?? ""}
              onChange={(html) =>
                onChange({
                  ...p,
                  detailContent: { fr: "", en: "", ar: "", ...p.detailContent, [tab]: html },
                })
              }
              dir={tab === "ar" ? "rtl" : "ltr"}
            />
          </div>
          <div>
            <p className={labelCls}>Description</p>
            <RichTextEditor
              value={p.description[tab]}
              onChange={(html) => onChange({ ...p, description: { ...p.description, [tab]: html } })}
              dir={tab === "ar" ? "rtl" : "ltr"}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
            >
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              Fonctionnalités ({p.features.length})
            </button>
            {expanded && (
              <div className="mt-2 space-y-2 bg-[var(--bg-alt)] rounded-xl p-3">
                {p.features.map((f, idx) => (
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

function FaqRow({ item, onChange, onRemove, tab }: {
  item: EntrepriseFaqItem;
  onChange: (f: EntrepriseFaqItem) => void;
  onRemove: () => void;
  tab: Locale;
}) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <GripVertical className="w-4 h-4 text-[var(--text-3)] flex-shrink-0 mt-1 cursor-grab" />
        <div className="flex-1 space-y-3 min-w-0">
          <LocalizedFields label="Question" value={item.question} onChange={(v) => onChange({ ...item, question: v })} tab={tab} />
          <LocalizedFields label="Réponse" value={item.answer} onChange={(v) => onChange({ ...item, answer: v })} multiline tab={tab} />
        </div>
        <button type="button" onClick={onRemove} className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex-shrink-0">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function EntreprisesForm({ initial }: { initial: EntreprisesContent }) {
  const router = useRouter();
  const [form, setForm] = useState<EntreprisesContent>(initial);
  const [tab, setTab] = useState<Locale>("fr");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateProduct = (idx: number, p: EntrepriseProduct) => {
    const products = [...form.products]; products[idx] = p; setForm({ ...form, products });
  };
  const removeProduct = (idx: number) => setForm({ ...form, products: form.products.filter((_, i) => i !== idx) });
  const addProduct = (audience: EntrepriseProductAudience = "entreprises") => {
    if (form.products.length < PRODUCTS_MAX) {
      setForm({ ...form, products: [...form.products, createEmptyProduct(audience)] });
    }
  };

  const updateFaq = (idx: number, f: EntrepriseFaqItem) => {
    const faq = [...form.faq]; faq[idx] = f; setForm({ ...form, faq });
  };
  const removeFaq = (idx: number) => setForm({ ...form, faq: form.faq.filter((_, i) => i !== idx) });
  const addFaq = () => {
    if (form.faq.length < FAQ_MAX) setForm({ ...form, faq: [...form.faq, createEmptyFaqItem()] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/entreprises", {
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
      <div className="flex gap-1 border border-[var(--border)] rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? "bg-primary text-white shadow-sm" : "text-[var(--text-2)] hover:bg-[var(--hover-bg)]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Hero</h3>
        <LocalizedFields label="Badge" value={form.heroBadge} onChange={(v) => setForm({ ...form, heroBadge: v })} tab={tab} />
        <LocalizedFields label="Titre" value={form.heroTitle} onChange={(v) => setForm({ ...form, heroTitle: v })} tab={tab} />
        <LocalizedFields label="Sous-titre" value={form.heroSubtitle} onChange={(v) => setForm({ ...form, heroSubtitle: v })} multiline tab={tab} />
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Sections produits (page publique)</h3>
        <LocalizedFields
          label="Titre section Entreprises"
          value={form.entreprisesSectionTitle}
          onChange={(v) => setForm({ ...form, entreprisesSectionTitle: v })}
          tab={tab}
        />
        <LocalizedFields
          label="Titre section Professionnels"
          value={form.professionnelsSectionTitle}
          onChange={(v) => setForm({ ...form, professionnelsSectionTitle: v })}
          tab={tab}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[var(--text-1)]">Produits / solutions ({form.products.length}/{PRODUCTS_MAX})</h3>
        {form.products.map((p, idx) => (
          <ProductRow key={p.id} product={p} onChange={(np) => updateProduct(idx, np)} onRemove={() => removeProduct(idx)} tab={tab} />
        ))}
        {form.products.length < PRODUCTS_MAX && (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => addProduct("entreprises")}
              className="flex items-center gap-2 flex-1 min-w-[12rem] justify-center px-4 py-3 border border-dashed border-[var(--border)] rounded-xl text-sm text-[var(--text-2)] hover:border-primary hover:text-primary transition-colors">
              <Plus className="w-4 h-4" /> Ajouter (Entreprises)
            </button>
            <button type="button" onClick={() => addProduct("professionnels")}
              className="flex items-center gap-2 flex-1 min-w-[12rem] justify-center px-4 py-3 border border-dashed border-[var(--border)] rounded-xl text-sm text-[var(--text-2)] hover:border-primary hover:text-primary transition-colors">
              <Plus className="w-4 h-4" /> Ajouter (Professionnels)
            </button>
          </div>
        )}
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Section FAQ</h3>
        <LocalizedFields label="Titre de section" value={form.faqTitle} onChange={(v) => setForm({ ...form, faqTitle: v })} tab={tab} />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[var(--text-1)]">Questions ({form.faq.length}/{FAQ_MAX})</h3>
        {form.faq.map((f, idx) => (
          <FaqRow key={f.id} item={f} onChange={(nf) => updateFaq(idx, nf)} onRemove={() => removeFaq(idx)} tab={tab} />
        ))}
        {form.faq.length < FAQ_MAX && (
          <button type="button" onClick={addFaq}
            className="flex items-center gap-2 w-full justify-center px-4 py-3 border border-dashed border-[var(--border)] rounded-xl text-sm text-[var(--text-2)] hover:border-primary hover:text-primary transition-colors">
            <Plus className="w-4 h-4" /> Ajouter une question
          </button>
        )}
      </div>

      <div className={card}>
        <h3 className="text-sm font-bold text-primary">Bloc CTA (bas de page)</h3>
        <LocalizedFields label="Titre" value={form.ctaTitle} onChange={(v) => setForm({ ...form, ctaTitle: v })} tab={tab} />
        <LocalizedFields label="Bouton" value={form.ctaButton} onChange={(v) => setForm({ ...form, ctaButton: v })} tab={tab} />
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
