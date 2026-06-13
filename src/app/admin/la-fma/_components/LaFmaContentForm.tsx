"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { LaFmaIconField } from "@/components/admin/LaFmaIconField";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import type { LaFmaContent, LaFmaOrgBloc, LaFmaValeur } from "@/lib/la-fma-site-public";
import {
  DEFAULT_LA_FMA_CONTENT,
  createEmptyLaFmaMission,
  createEmptyLaFmaOrgBloc,
  createEmptyLaFmaStat,
  createEmptyLaFmaValeur,
  LA_FMA_MISSIONS_MAX,
  LA_FMA_STATS_MAX,
  LA_FMA_STATS_MIN,
  LA_FMA_VALEURS_MAX,
} from "@/lib/la-fma-site-public";
import type { Locale } from "@/lib/site-content";

const TABS: { key: Locale; flag: string; label: string; dir: "ltr" | "rtl" }[] = [
  { key: "fr", flag: "🇫🇷", label: "Français", dir: "ltr" },
  { key: "en", flag: "🇬🇧", label: "English", dir: "ltr" },
  { key: "ar", flag: "🇲🇦", label: "العربية", dir: "rtl" },
];

const inputBase =
  "w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-[var(--text-2)] uppercase tracking-wide mb-2";
const card = "bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6";
/** Même gabarit que les cartes mission / chiffres-clés (bordure arrondie + espacement). */
const fieldGroupCard = "rounded-xl border border-[var(--border)] p-4 space-y-3";
const sectionBlockCard = "rounded-xl border border-[var(--border)] p-4";

function mergeWithDefaults(data: LaFmaContent): LaFmaContent {
  return {
    ...data,
    valeursSectionTitle: data.valeursSectionTitle ?? DEFAULT_LA_FMA_CONTENT.valeursSectionTitle,
    valeursDescription: data.valeursDescription ?? DEFAULT_LA_FMA_CONTENT.valeursDescription,
    valeurs: data.valeurs?.length ? data.valeurs : DEFAULT_LA_FMA_CONTENT.valeurs,
    organisationSectionTitle: data.organisationSectionTitle ?? DEFAULT_LA_FMA_CONTENT.organisationSectionTitle,
    organisationDescription: data.organisationDescription ?? DEFAULT_LA_FMA_CONTENT.organisationDescription,
    orgBlocs: data.orgBlocs?.length ? data.orgBlocs : DEFAULT_LA_FMA_CONTENT.orgBlocs,
  };
}

export default function LaFmaContentForm({ initial }: { initial: LaFmaContent }) {
  const router = useRouter();
  const [content, setContent] = useState<LaFmaContent>(() => mergeWithDefaults(initial));
  const [tab, setTab] = useState<Locale>("fr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const currentTab = TABS.find((t) => t.key === tab)!;

  const setLoc =
    <K extends keyof LaFmaContent>(key: K, lang: Locale, v: string) =>
    setContent((c) => {
      const cur = c[key];
      if (cur && typeof cur === "object" && "fr" in cur && "en" in cur && "ar" in cur) {
        return { ...c, [key]: { ...(cur as LaFmaContent[K] & object), [lang]: v } } as LaFmaContent;
      }
      return c;
    });

  const setStatValue = (idx: number, v: string) =>
    setContent((c) => {
      const next = [...c.stats];
      next[idx] = { ...next[idx], value: v };
      return { ...c, stats: next };
    });
  const setStatLabel = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.stats];
      next[idx] = { ...next[idx], label: { ...next[idx].label, [lang]: v } };
      return { ...c, stats: next };
    });
  const addStat = () =>
    setContent((c) => {
      if (c.stats.length >= LA_FMA_STATS_MAX) return c;
      return { ...c, stats: [...c.stats, createEmptyLaFmaStat()] };
    });
  const removeStat = (idx: number) =>
    setContent((c) => {
      if (c.stats.length <= LA_FMA_STATS_MIN) return c;
      return { ...c, stats: c.stats.filter((_, i) => i !== idx) };
    });

  const setMissionIcon = (idx: number, v: string) =>
    setContent((c) => {
      const next = [...c.missions];
      next[idx] = { ...next[idx], icon: v };
      return { ...c, missions: next };
    });
  const setMissionTitle = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.missions];
      next[idx] = { ...next[idx], title: { ...next[idx].title, [lang]: v } };
      return { ...c, missions: next };
    });
  const setMissionDesc = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.missions];
      next[idx] = { ...next[idx], description: { ...next[idx].description, [lang]: v } };
      return { ...c, missions: next };
    });

  const setValeurIcon = (idx: number, v: string) =>
    setContent((c) => {
      const next = [...c.valeurs];
      next[idx] = { ...next[idx], icon: v };
      return { ...c, valeurs: next };
    });
  const setValeurTitle = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.valeurs];
      next[idx] = { ...next[idx], title: { ...next[idx].title, [lang]: v } };
      return { ...c, valeurs: next };
    });
  const setValeurDesc = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.valeurs];
      next[idx] = { ...next[idx], description: { ...next[idx].description, [lang]: v } };
      return { ...c, valeurs: next };
    });
  const addValeur = () =>
    setContent((c) => {
      if (c.valeurs.length >= LA_FMA_VALEURS_MAX) return c;
      return { ...c, valeurs: [...c.valeurs, createEmptyLaFmaValeur() as LaFmaValeur] };
    });
  const removeValeur = (idx: number) =>
    setContent((c) => {
      if (c.valeurs.length <= 1) return c;
      return { ...c, valeurs: c.valeurs.filter((_, i) => i !== idx) };
    });

  const setOrgBlocTitle = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.orgBlocs];
      next[idx] = { ...next[idx], title: { ...next[idx].title, [lang]: v } };
      return { ...c, orgBlocs: next };
    });
  const setOrgBlocIcon = (idx: number, v: string) =>
    setContent((c) => {
      const next = [...c.orgBlocs];
      next[idx] = { ...next[idx], icon: v };
      return { ...c, orgBlocs: next };
    });
  const setOrgBlocDesc = (idx: number, lang: Locale, v: string) =>
    setContent((c) => {
      const next = [...c.orgBlocs];
      next[idx] = { ...next[idx], description: { ...next[idx].description, [lang]: v } };
      return { ...c, orgBlocs: next };
    });
  const addOrgBloc = () =>
    setContent((c) => ({
      ...c,
      orgBlocs: [...c.orgBlocs, createEmptyLaFmaOrgBloc()],
    }));
  const removeOrgBloc = (idx: number) =>
    setContent((c) => ({ ...c, orgBlocs: c.orgBlocs.filter((_, i) => i !== idx) }));

  const addMission = () => {
    setContent((c) => {
      if (c.missions.length >= LA_FMA_MISSIONS_MAX) return c;
      return { ...c, missions: [...c.missions, createEmptyLaFmaMission()] };
    });
  };

  const removeMission = (idx: number) => {
    setContent((c) => {
      if (c.missions.length <= 1) return c;
      return { ...c, missions: c.missions.filter((_, i) => i !== idx) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/site/la-fma", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { message?: string }).message || "Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Erreur réseau — vérifiez votre connexion");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setContent(initial);
    setError("");
    setSuccess(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-5xl">
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium",
                  tab === t.key ? buttonTabActive : buttonTabInactive
                )}
              >
                {t.flag} {t.label}
              </button>
            ))}
          </div>
          <a
            href={`/${tab}/la-fma`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Eye className="w-3.5 h-3.5" />
            Aperçu La FMA ({TABS.find((t) => t.key === tab)!.label})
          </a>
        </div>

        <div className="space-y-8" dir={currentTab.dir}>
          <div className="border-b border-[var(--border)] pb-6">
            <h3 className="text-sm font-bold text-primary mb-4">Hero (en-tête de page)</h3>
            <div className={sectionBlockCard}>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Badge</label>
                  <input
                    type="text"
                    value={content.heroBadge[tab]}
                    onChange={(e) => setLoc("heroBadge", tab, e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelCls}>Titre</label>
                  <input
                    type="text"
                    value={content.heroTitle[tab]}
                    onChange={(e) => setLoc("heroTitle", tab, e.target.value)}
                    className={`${inputBase} font-semibold`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Sous-titre</label>
                  <textarea
                    rows={3}
                    value={content.heroSubtitle[tab]}
                    onChange={(e) => setLoc("heroSubtitle", tab, e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-[var(--border)] pb-6">
            <h3 className="text-sm font-bold text-primary mb-4">Présentation</h3>
            <div className={sectionBlockCard}>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Titre de section</label>
                  <input
                    type="text"
                    value={content.presentationTitle[tab]}
                    onChange={(e) => setLoc("presentationTitle", tab, e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelCls}>Premier paragraphe</label>
                  <RichTextEditor
                    value={content.presentationP1[tab]}
                    onChange={(html) => setLoc("presentationP1", tab, html)}
                    placeholder="Description de la FMA…"
                    dir={tab === "ar" ? "rtl" : "ltr"}
                  />
                </div>

              </div>
            </div>
          </div>

          <div className="border-b border-[var(--border)] pb-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
              <h3 className="text-sm font-bold text-primary">
                Chiffres ({content.stats.length}/{LA_FMA_STATS_MAX}) — grille à côté de la présentation
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStat}
                disabled={content.stats.length >= LA_FMA_STATS_MAX}
                className="gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Ajouter un chiffre
              </Button>
            </div>
            <p className="text-xs text-[var(--text-3)] mb-4">
              La valeur affichée est la même pour toutes les langues ; le libellé sous le chiffre dépend de l’onglet
              sélectionné ci-dessus. Au moins {LA_FMA_STATS_MIN} chiffre doit rester.
            </p>
            <div className="space-y-6">
              {content.stats.map((s, idx) => (
                <div key={`stat-${idx}`} className={fieldGroupCard}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="text-xs font-semibold text-[var(--text-3)]">
                      Chiffre {idx + 1} / {content.stats.length}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStat(idx)}
                      disabled={content.stats.length <= LA_FMA_STATS_MIN}
                      className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Valeur</label>
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => setStatValue(idx, e.target.value)}
                        className={inputBase}
                        placeholder="1958"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Libellé ({tab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={s.label[tab]}
                        onChange={(e) => setStatLabel(idx, tab, e.target.value)}
                        className={inputBase}
                        placeholder="Année de fondation"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-[var(--border)] pb-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
              <h3 className="text-sm font-bold text-primary">Missions</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMission}
                disabled={content.missions.length >= LA_FMA_MISSIONS_MAX}
                className="gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Ajouter une mission
              </Button>
            </div>
            <p className="text-xs text-[var(--text-3)] mb-4">
              Jusqu’à {LA_FMA_MISSIONS_MAX} missions. Au moins une mission doit rester (suppression impossible sinon).
            </p>
            <div className={`mb-4 ${fieldGroupCard}`}>
              <label className={labelCls}>Titre de section</label>
              <input
                type="text"
                value={content.missionsSectionTitle[tab]}
                onChange={(e) => setLoc("missionsSectionTitle", tab, e.target.value)}
                className={inputBase}
              />
            </div>
            <div className="space-y-6">
              {content.missions.map((m, idx) => (
                <div key={`mission-${idx}`} className={fieldGroupCard}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-[var(--text-3)]">
                      Mission {idx + 1} / {content.missions.length}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMission(idx)}
                      disabled={content.missions.length <= 1}
                      className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </Button>
                  </div>
                  <LaFmaIconField
                    value={m.icon}
                    onChange={(v) => setMissionIcon(idx, v)}
                    label="Icône (photo ou emoji)"
                    labelCls={labelCls}
                    inputBase={inputBase}
                  />
                  <div>
                    <label className={labelCls}>Titre ({tab.toUpperCase()})</label>
                    <input
                      type="text"
                      value={m.title[tab]}
                      onChange={(e) => setMissionTitle(idx, tab, e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Description ({tab.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={m.description[tab]}
                      onChange={(e) => setMissionDesc(idx, tab, e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-[var(--border)] pb-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
              <h3 className="text-sm font-bold text-primary">Valeurs</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addValeur}
                disabled={content.valeurs.length >= LA_FMA_VALEURS_MAX}
                className="gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Ajouter une valeur
              </Button>
            </div>
            <div className={`mb-4 ${fieldGroupCard}`}>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Titre de section ({tab.toUpperCase()})</label>
                  <input
                    type="text"
                    value={content.valeursSectionTitle[tab]}
                    onChange={(e) => setLoc("valeursSectionTitle", tab, e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description ({tab.toUpperCase()})</label>
                  <textarea
                    rows={3}
                    value={content.valeursDescription[tab]}
                    onChange={(e) => setLoc("valeursDescription", tab, e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {content.valeurs.map((v, idx) => (
                <div key={`valeur-${idx}`} className={fieldGroupCard}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-[var(--text-3)]">
                      Valeur {idx + 1} / {content.valeurs.length}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeValeur(idx)}
                      disabled={content.valeurs.length <= 1}
                      className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </Button>
                  </div>
                  <LaFmaIconField
                    value={v.icon}
                    onChange={(val) => setValeurIcon(idx, val)}
                    label="Icône (photo ou emoji)"
                    labelCls={labelCls}
                    inputBase={inputBase}
                  />
                  <div>
                    <label className={labelCls}>Titre ({tab.toUpperCase()})</label>
                    <input
                      type="text"
                      value={v.title[tab]}
                      onChange={(e) => setValeurTitle(idx, tab, e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-[var(--border)] pb-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
              <h3 className="text-sm font-bold text-primary">Organisation</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOrgBloc}
                className="gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Ajouter un bloc
              </Button>
            </div>
            <div className={`mb-4 ${fieldGroupCard}`}>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Titre de section ({tab.toUpperCase()})</label>
                  <input
                    type="text"
                    value={content.organisationSectionTitle[tab]}
                    onChange={(e) => setLoc("organisationSectionTitle", tab, e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {content.orgBlocs.map((b, idx) => (
                <div key={idx} className={fieldGroupCard}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-[var(--text-3)]">Bloc {idx + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOrgBloc(idx)}
                      disabled={content.orgBlocs.length <= 1}
                      className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </Button>
                  </div>
                  <LaFmaIconField
                    value={b.icon ?? ""}
                    onChange={(val) => setOrgBlocIcon(idx, val)}
                    label="Icône (photo ou emoji)"
                    labelCls={labelCls}
                    inputBase={inputBase}
                  />
                  <div>
                    <label className={labelCls}>Titre ({tab.toUpperCase()})</label>
                    <input
                      type="text"
                      value={b.title[tab]}
                      onChange={(e) => setOrgBlocTitle(idx, tab, e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Description ({tab.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={b.description[tab]}
                      onChange={(e) => setOrgBlocDesc(idx, tab, e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-primary mb-4">Autres titres de section</h3>
            <div className="space-y-6">
              <div className={fieldGroupCard}>
                <label className={labelCls}>Bloc Direction (si des membres d’équipe sont affichés)</label>
                <input
                  type="text"
                  value={content.directionSectionTitle[tab]}
                  onChange={(e) => setLoc("directionSectionTitle", tab, e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className={fieldGroupCard}>
                <label className={labelCls}>Bloc Membres (logos)</label>
                <input
                  type="text"
                  value={content.membersSectionTitle[tab]}
                  onChange={(e) => setLoc("membersSectionTitle", tab, e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Enregistré avec succès.</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} disabled={loading} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Annuler les modifications
        </Button>
      </div>
    </form>
  );
}
