import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import {
  createEmptyLaFmaMission,
  createEmptyLaFmaStat,
  createEmptyLaFmaValeur,
  LA_FMA_STATS_MIN,
  LA_FMA_STATS_MAX,
  LA_FMA_MISSIONS_MAX,
  LA_FMA_VALEURS_MAX,
  DEFAULT_LA_FMA_CONTENT,
  type LaFmaContent,
  type LaFmaStat,
  type LaFmaMission,
  type LaFmaValeur,
  type LaFmaOrgBloc,
} from "@/lib/la-fma-site-public";
export type { LaFmaContent, LaFmaStat, LaFmaMission, LaFmaValeur, LaFmaOrgBloc } from "@/lib/la-fma-site-public";
export { DEFAULT_LA_FMA_CONTENT } from "@/lib/la-fma-site-public";
import { normalizeLaFmaIcon } from "@/lib/la-fma-icon";
import {
  createEmptyHomeKeyFigure,
  createEmptyHomeGlobalFigure,
  HOME_KEY_FIGURES_MAX,
  HOME_KEY_FIGURES_MIN,
} from "@/lib/home-site-public";
import { unstable_cache, revalidateTag } from "next/cache";

export {
  createEmptyHomeKeyFigure,
  createEmptyHomeGlobalFigure,
  HOME_KEY_FIGURES_MAX,
  HOME_KEY_FIGURES_MIN,
} from "@/lib/home-site-public";

/* ────────────────────────────────────────────────────────────────────────
 * Site Content — contenus éditoriaux statiques pilotés depuis l'admin.
 *
 * Stockage : modèle `Setting` (clé/valeur/group) avec une valeur JSON.
 *   - Pas de migration nécessaire.
 *   - Une seule entrée par "section" (ex. home_content, footer_content, …).
 *
 * Lecture : `unstable_cache` + tag invalidé à chaque sauvegarde.
 *
 * Fallback : si la DB est vide ou un champ manque, on retourne les valeurs
 *            par défaut (= textes utilisés historiquement) → zéro régression.
 *
 * Extensible : ajouter une nouvelle section = nouveau type + 2 fonctions
 *              (get*, save*) sur le même pattern.
 * ──────────────────────────────────────────────────────────────────────── */

export type Locale = "fr" | "en" | "ar";

export interface LocalizedString {
  fr: string;
  en: string;
  ar: string;
}

export interface HomeCTA {
  label: LocalizedString;
  /** Chemin relatif au locale, ex. "la-fma" ou "publications". */
  href: string;
}

export type HomeKeyFigureValueSource = import("@/lib/home-site-public").HomeKeyFigureValueSource;

export interface HomeKeyFigure {
  /** Valeur numérique affichée en gros (ex. "47"). Texte libre. */
  value: string;
  /** Suffixe accolé à la valeur (ex. « Mds MAD », « + »). Chaîne vide autorisée. */
  suffix: string;
  label: LocalizedString;
  valueSource: HomeKeyFigureValueSource;
  chiffresClesRowId: string;
  /** Texte affiché en dépliant la carte (chevron). Vide = pas de détail. */
  description: LocalizedString;
  /** Regroupement vertical : même clé (FR) sur des cartes consécutives = pile sous un titre commun. */
  stackGroup?: LocalizedString;
}

export interface HomeGlobalFigure {
  /** Valeur numérique de la grande carte (ex. "64269.4"). */
  value: string;
  /** Suffixe (ex. « MDH »). */
  suffix: string;
  label: LocalizedString;
  description: LocalizedString;
  valueSource: HomeKeyFigureValueSource;
  chiffresClesRowId: string;
}

export interface HomeKeyFiguresSection {
  /** Titre de la section (affiché en majuscules). */
  eyebrow: LocalizedString;
  /** Image illustrative à gauche (URL publique). */
  imageUrl: string;
  /** Légende sous chaque chiffre (ex. « des primes émises »). */
  figureCaption: LocalizedString;
  /** Grande carte "Chiffre d'affaires global" affichée au-dessus de la grille. */
  globalFigure: HomeGlobalFigure;
}

export type HeroBackgroundType = "default" | "color" | "image";

export interface HomeHeroBackground {
  /** "default" = on garde le rendu original (var(--bg) + halos),
   *  "color"   = couleur unie configurable,
   *  "image"   = image de fond (cover, centrée). */
  type: HeroBackgroundType;
  /** Couleur CSS (utilisée si type === "color"). Format libre : "#1a1a1a", "var(--brand)", "rgb(…)". */
  color: string;
  /** URL d'image publique (utilisée si type === "image"). Vide si non définie. */
  imageUrl: string;
  /** Affiche par-dessus le fond les halos radiaux + la texture de bruit. */
  showOverlays: boolean;
}

export interface HomeContent {
  badge: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  cta1: HomeCTA;
  cta2: HomeCTA;
  /** Chiffres clés (1 à 8). */
  keyFigures: HomeKeyFigure[];
  keyFiguresSection: HomeKeyFiguresSection;
  hero: { background: HomeHeroBackground };
}

/* ── Valeurs par défaut (reflètent l'état initial du site) ── */
export const DEFAULT_HOME_CONTENT: HomeContent = {
  badge: {
    fr: "Depuis 1958 — Le secteur de l'assurance au Maroc",
    en: "Since 1958 — Insurance in Morocco",
    ar: "منذ 1958 — قطاع التأمين في المغرب",
  },
  title: {
    fr: "Fédération Marocaine de l'Assurance",
    en: "Moroccan Insurance Federation",
    ar: "الاتحاد المغربي للتأمين",
  },
  subtitle: {
    fr: "L'organe représentatif du secteur de l'assurance au Maroc depuis 1958",
    en: "The representative body of the insurance sector in Morocco since 1958",
    ar: "الهيئة التمثيلية لقطاع التأمين في المغرب منذ 1958",
  },
  cta1: {
    label: { fr: "Découvrir la FMA", en: "Discover FMA", ar: "اكتشف الاتحاد" },
    href: "la-fma",
  },
  cta2: {
    label: { fr: "Nos publications", en: "Our publications", ar: "منشوراتنا" },
    href: "publications",
  },
  keyFigures: [
    { value: "47", suffix: " Mds MAD", label: { fr: "Chiffre d'affaires", en: "Revenue",            ar: "رقم الأعمال" }, valueSource: "manual", chiffresClesRowId: "", description: { fr: "", en: "", ar: "" }, stackGroup: { fr: "", en: "", ar: "" } },
    { value: "25", suffix: "+",        label: { fr: "Compagnies membres",  en: "Member companies",   ar: "الشركات الأعضاء" }, valueSource: "manual", chiffresClesRowId: "", description: { fr: "", en: "", ar: "" }, stackGroup: { fr: "", en: "", ar: "" } },
    { value: "5",  suffix: " M+",      label: { fr: "Contrats souscrits",  en: "Policies",           ar: "العقود" }, valueSource: "manual", chiffresClesRowId: "", description: { fr: "", en: "", ar: "" }, stackGroup: { fr: "", en: "", ar: "" } },
    { value: "65", suffix: " ans",     label: { fr: "D'expérience",        en: "Years of experience", ar: "سنة من الخبرة" }, valueSource: "manual", chiffresClesRowId: "", description: { fr: "", en: "", ar: "" }, stackGroup: { fr: "", en: "", ar: "" } },
  ],
  keyFiguresSection: {
    eyebrow: {
      fr: "Chiffres clés S1 2024",
      en: "Key figures H1 2024",
      ar: "أرقام رئيسية النصف الأول 2024",
    },
    imageUrl: "/key-figures-growth.png",
    figureCaption: {
      fr: "des primes émises",
      en: "of premiums issued",
      ar: "من الأقساط المكتتبة",
    },
    globalFigure: {
      value: "",
      suffix: "",
      label: { fr: "Chiffre d'affaires global", en: "Global revenue", ar: "رقم الأعمال الإجمالي" },
      description: { fr: "", en: "", ar: "" },
      valueSource: "manual",
      chiffresClesRowId: "",
    },
  },
  hero: {
    background: {
      type: "default",
      color: "#ffffff",
      imageUrl: "",
      showOverlays: true,
    },
  },
};

const HOME_KEY = DB_KEYS.HOME_CONTENT;
const HOME_TAG = "site-content:home";

/* ── Helpers ── */
function localizedFallback(
  input: Partial<LocalizedString> | undefined,
  fallback: LocalizedString
): LocalizedString {
  return {
    fr: input?.fr?.trim() || fallback.fr,
    en: input?.en?.trim() || fallback.en,
    ar: input?.ar?.trim() || fallback.ar,
  };
}

/** Titre chiffres clés : vide si enregistré vide ; défaut uniquement si la section n'a jamais été sauvegardée. */
function normalizeKeyFiguresEyebrow(
  section: Partial<HomeKeyFiguresSection> | undefined
): LocalizedString {
  const defaults = DEFAULT_HOME_CONTENT.keyFiguresSection.eyebrow;
  if (section === undefined) return { ...defaults };
  const eyebrow = section.eyebrow;
  if (eyebrow === undefined) return { fr: "", en: "", ar: "" };
  return {
    fr: typeof eyebrow.fr === "string" ? eyebrow.fr.trim() : "",
    en: typeof eyebrow.en === "string" ? eyebrow.en.trim() : "",
    ar: typeof eyebrow.ar === "string" ? eyebrow.ar.trim() : "",
  };
}

function normalizeGlobalFigure(input: unknown): HomeGlobalFigure {
  const def = DEFAULT_HOME_CONTENT.keyFiguresSection.globalFigure;
  if (!input || typeof input !== "object") return { ...def };
  const d = input as Partial<HomeGlobalFigure>;
  const valueSource: HomeKeyFigureValueSource =
    d.valueSource === "contribution" || d.valueSource === "revenue" || d.valueSource === "manual"
      ? d.valueSource
      : def.valueSource;
  return {
    value: (d.value ?? "").toString().trim(),
    suffix: typeof d.suffix === "string" ? d.suffix.trim() : "",
    label: localizedFallback(d.label as Partial<LocalizedString> | undefined, def.label),
    description: localizedFallback(d.description as Partial<LocalizedString> | undefined, { fr: "", en: "", ar: "" }),
    valueSource,
    chiffresClesRowId: typeof d.chiffresClesRowId === "string" ? d.chiffresClesRowId : def.chiffresClesRowId,
  };
}

const ALLOWED_HERO_BG_TYPES: readonly HeroBackgroundType[] = ["default", "color", "image"] as const;

function normalizeHeroBackground(input: unknown): HomeHeroBackground {
  const def = DEFAULT_HOME_CONTENT.hero.background;
  if (!input || typeof input !== "object") return { ...def };
  const d = input as Partial<HomeHeroBackground>;

  const type: HeroBackgroundType = ALLOWED_HERO_BG_TYPES.includes(d.type as HeroBackgroundType)
    ? (d.type as HeroBackgroundType)
    : def.type;

  return {
    type,
    color: (typeof d.color === "string" && d.color.trim()) ? d.color.trim() : def.color,
    imageUrl: typeof d.imageUrl === "string" ? d.imageUrl.trim() : def.imageUrl,
    showOverlays: typeof d.showOverlays === "boolean" ? d.showOverlays : def.showOverlays,
  };
}

/** Garantit une structure complète et valide, comble les champs manquants. */
export function normalizeHomeContent(input: unknown): HomeContent {
  if (!input || typeof input !== "object") return DEFAULT_HOME_CONTENT;
  const d = input as Partial<HomeContent>;

  const figs = Array.isArray(d.keyFigures) ? d.keyFigures : [];
  const keyFigures: HomeKeyFigure[] = figs
    .slice(0, HOME_KEY_FIGURES_MAX)
    .map((raw, i) => {
      const f = raw as Partial<HomeKeyFigure> | undefined;
      const def = DEFAULT_HOME_CONTENT.keyFigures[i] ?? createEmptyHomeKeyFigure();
      const suffix =
        f != null && typeof f === "object" && "suffix" in f && typeof f.suffix === "string"
          ? f.suffix.trim()
          : def.suffix;
      const valueSource =
        f?.valueSource === "contribution" || f?.valueSource === "revenue" || f?.valueSource === "manual"
          ? f.valueSource
          : def.valueSource;
      return {
        value: (f?.value ?? "").toString().trim() || def.value,
        suffix,
        label: localizedFallback(f?.label as Partial<LocalizedString> | undefined, def.label),
        valueSource,
        chiffresClesRowId: typeof f?.chiffresClesRowId === "string" ? f.chiffresClesRowId : def.chiffresClesRowId,
        description: localizedFallback(
          f?.description as Partial<LocalizedString> | undefined,
          def.description ?? { fr: "", en: "", ar: "" }
        ),
        stackGroup: localizedFallback(
          f?.stackGroup as Partial<LocalizedString> | undefined,
          def.stackGroup ?? { fr: "", en: "", ar: "" }
        ),
      };
    });

  if (keyFigures.length === 0) {
    keyFigures.push(...DEFAULT_HOME_CONTENT.keyFigures);
  }
  while (keyFigures.length < HOME_KEY_FIGURES_MIN) {
    keyFigures.push(createEmptyHomeKeyFigure());
  }

  return {
    badge:    localizedFallback(d.badge,    DEFAULT_HOME_CONTENT.badge),
    title:    localizedFallback(d.title,    DEFAULT_HOME_CONTENT.title),
    subtitle: localizedFallback(d.subtitle, DEFAULT_HOME_CONTENT.subtitle),
    cta1: {
      label: localizedFallback(d.cta1?.label, DEFAULT_HOME_CONTENT.cta1.label),
      href: (d.cta1?.href ?? "").trim() || DEFAULT_HOME_CONTENT.cta1.href,
    },
    cta2: {
      label: localizedFallback(d.cta2?.label, DEFAULT_HOME_CONTENT.cta2.label),
      href: (d.cta2?.href ?? "").trim() || DEFAULT_HOME_CONTENT.cta2.href,
    },
    keyFigures,
    keyFiguresSection: {
      eyebrow: normalizeKeyFiguresEyebrow(d.keyFiguresSection),
      imageUrl:
        typeof d.keyFiguresSection?.imageUrl === "string" && d.keyFiguresSection.imageUrl.trim()
          ? d.keyFiguresSection.imageUrl.trim()
          : DEFAULT_HOME_CONTENT.keyFiguresSection.imageUrl,
      figureCaption: localizedFallback(
        d.keyFiguresSection?.figureCaption,
        DEFAULT_HOME_CONTENT.keyFiguresSection.figureCaption
      ),
      globalFigure: normalizeGlobalFigure(d.keyFiguresSection?.globalFigure),
    },
    hero: {
      background: normalizeHeroBackground(d.hero?.background),
    },
  };
}

/* ── Lecture (cachée, partagée entre les requêtes) ──
 * Note : la clé de cache est versionnée. Bump le suffixe (v2, v3, …) à chaque
 * changement de forme du HomeContent pour éviter de servir des valeurs cachées
 * incompatibles avec le nouveau schéma. */
export const getHomeContent = unstable_cache(
  async (): Promise<HomeContent> => {
    try {
      const row = await prisma.setting.findUnique({ where: { key: HOME_KEY } });
      if (!row) return DEFAULT_HOME_CONTENT;
      const parsed: unknown = JSON.parse(row.value);
      return normalizeHomeContent(parsed);
    } catch (e) {
      console.error("[site-content] getHomeContent failed, falling back to defaults:", e);
      return DEFAULT_HOME_CONTENT;
    }
  },
  ["site-content:home:v5"],
  { tags: [HOME_TAG], revalidate: 300 }
);

/* ── Écriture (admin seulement) ── */
export async function saveHomeContent(input: unknown): Promise<HomeContent> {
  const normalized = normalizeHomeContent(input);
  const value = JSON.stringify(normalized);
  await prisma.setting.upsert({
    where: { key: HOME_KEY },
    update: { value, group: "home" },
    create: { key: HOME_KEY, value, group: "home" },
  });
  revalidateTag(HOME_TAG);
  return normalized;
}

/* ── La FMA (page institutionnelle) ── */

// Types, DEFAULT et constantes exportés depuis la-fma-site-public.ts (Client-safe)

const LA_FMA_KEY = DB_KEYS.LA_FMA_CONTENT;
const LA_FMA_TAG = "site-content:la-fma";

function normalizeLaFmaStat(input: unknown, fallback: LaFmaStat): LaFmaStat {
  if (!input || typeof input !== "object") return { ...fallback };
  const s = input as Partial<LaFmaStat>;
  return {
    value: (s.value ?? "").toString().trim() || fallback.value,
    label: localizedFallback(s.label as Partial<LocalizedString> | undefined, fallback.label),
  };
}

function normalizeLaFmaMission(input: unknown, fallback: LaFmaMission): LaFmaMission {
  if (!input || typeof input !== "object") return { ...fallback };
  const m = input as Partial<LaFmaMission>;
  return {
    icon: normalizeLaFmaIcon((m.icon ?? "").toString().trim()) || fallback.icon,
    title: localizedFallback(m.title as Partial<LocalizedString> | undefined, fallback.title),
    description: localizedFallback(
      m.description as Partial<LocalizedString> | undefined,
      fallback.description
    ),
  };
}

function normalizeLaFmaValeur(input: unknown, fallback: LaFmaValeur): LaFmaValeur {
  if (!input || typeof input !== "object") return { ...fallback };
  const v = input as Partial<LaFmaValeur>;
  return {
    icon: normalizeLaFmaIcon((v.icon ?? "").toString().trim()) || fallback.icon,
    title: localizedFallback(v.title as Partial<LocalizedString> | undefined, fallback.title),
    description: localizedFallback(v.description as Partial<LocalizedString> | undefined, fallback.description),
  };
}

function normalizeOrgBloc(input: unknown, fallback: LaFmaOrgBloc): LaFmaOrgBloc {
  if (!input || typeof input !== "object") return { ...fallback };
  const b = input as Partial<LaFmaOrgBloc>;
  return {
    icon: normalizeLaFmaIcon((b.icon ?? "").toString().trim()) || fallback.icon,
    title: localizedFallback(b.title as Partial<LocalizedString> | undefined, fallback.title),
    description: localizedFallback(b.description as Partial<LocalizedString> | undefined, fallback.description),
  };
}

export function normalizeLaFmaContent(input: unknown): LaFmaContent {
  if (!input || typeof input !== "object") return DEFAULT_LA_FMA_CONTENT;
  const d = input as Partial<LaFmaContent>;

  const statsIn = Array.isArray(d.stats) ? d.stats : [];
  const emptyStat = createEmptyLaFmaStat();
  const stats: LaFmaStat[] =
    statsIn.length === 0
      ? DEFAULT_LA_FMA_CONTENT.stats.map((def, i) => normalizeLaFmaStat(statsIn[i], def))
      : statsIn
          .slice(0, LA_FMA_STATS_MAX)
          .map((s) => normalizeLaFmaStat(s, emptyStat));
  while (stats.length < LA_FMA_STATS_MIN) {
    stats.push(createEmptyLaFmaStat());
  }

  const missionsIn = Array.isArray(d.missions) ? d.missions : [];
  const emptyMission = createEmptyLaFmaMission();
  const missions: LaFmaMission[] =
    missionsIn.length === 0
      ? DEFAULT_LA_FMA_CONTENT.missions.map((def, i) => normalizeLaFmaMission(missionsIn[i], def))
      : missionsIn
          .slice(0, LA_FMA_MISSIONS_MAX)
          .map((m) => normalizeLaFmaMission(m, emptyMission));

  const valeursIn = Array.isArray(d.valeurs) ? d.valeurs : [];
  const emptyValeur = createEmptyLaFmaValeur();
  const valeurs: LaFmaValeur[] =
    valeursIn.length === 0
      ? DEFAULT_LA_FMA_CONTENT.valeurs
      : valeursIn
          .slice(0, LA_FMA_VALEURS_MAX)
          .map((v) => normalizeLaFmaValeur(v, emptyValeur));

  const orgBlocsIn = Array.isArray(d.orgBlocs) ? d.orgBlocs : [];
  const emptyOrgBloc: LaFmaOrgBloc = { icon: "📌", title: { fr: "", en: "", ar: "" }, description: { fr: "", en: "", ar: "" } };
  const orgBlocs: LaFmaOrgBloc[] =
    orgBlocsIn.length === 0
      ? DEFAULT_LA_FMA_CONTENT.orgBlocs
      : orgBlocsIn.map((b) => normalizeOrgBloc(b, emptyOrgBloc));

  return {
    heroBadge: localizedFallback(d.heroBadge, DEFAULT_LA_FMA_CONTENT.heroBadge),
    heroTitle: localizedFallback(d.heroTitle, DEFAULT_LA_FMA_CONTENT.heroTitle),
    heroSubtitle: localizedFallback(d.heroSubtitle, DEFAULT_LA_FMA_CONTENT.heroSubtitle),
    presentationTitle: localizedFallback(d.presentationTitle, DEFAULT_LA_FMA_CONTENT.presentationTitle),
    presentationP1: localizedFallback(d.presentationP1, DEFAULT_LA_FMA_CONTENT.presentationP1),
    presentationP2: localizedFallback(d.presentationP2, DEFAULT_LA_FMA_CONTENT.presentationP2),
    stats,
    missionsSectionTitle: localizedFallback(
      d.missionsSectionTitle,
      DEFAULT_LA_FMA_CONTENT.missionsSectionTitle
    ),
    missions,
    valeursSectionTitle: localizedFallback(
      d.valeursSectionTitle,
      DEFAULT_LA_FMA_CONTENT.valeursSectionTitle
    ),
    valeursDescription: localizedFallback(
      d.valeursDescription,
      DEFAULT_LA_FMA_CONTENT.valeursDescription
    ),
    valeurs,
    organisationSectionTitle: localizedFallback(
      d.organisationSectionTitle,
      DEFAULT_LA_FMA_CONTENT.organisationSectionTitle
    ),
    organisationDescription: localizedFallback(
      d.organisationDescription,
      DEFAULT_LA_FMA_CONTENT.organisationDescription
    ),
    orgBlocs,
    directionSectionTitle: localizedFallback(
      d.directionSectionTitle,
      DEFAULT_LA_FMA_CONTENT.directionSectionTitle
    ),
    membersSectionTitle: localizedFallback(
      d.membersSectionTitle,
      DEFAULT_LA_FMA_CONTENT.membersSectionTitle
    ),
  };
}

export const getLaFmaContent = unstable_cache(
  async (): Promise<LaFmaContent> => {
    try {
      const row = await prisma.setting.findUnique({ where: { key: LA_FMA_KEY } });
      if (!row) return DEFAULT_LA_FMA_CONTENT;
      const parsed: unknown = JSON.parse(row.value);
      return normalizeLaFmaContent(parsed);
    } catch (e) {
      console.error("[site-content] getLaFmaContent failed, falling back to defaults:", e);
      return DEFAULT_LA_FMA_CONTENT;
    }
  },
  ["site-content:la-fma:v2"],
  { tags: [LA_FMA_TAG], revalidate: 300 }
);

export async function saveLaFmaContent(input: unknown): Promise<LaFmaContent> {
  const normalized = normalizeLaFmaContent(input);
  const value = JSON.stringify(normalized);
  await prisma.setting.upsert({
    where: { key: LA_FMA_KEY },
    update: { value, group: "site" },
    create: { key: LA_FMA_KEY, value, group: "site" },
  });
  revalidateTag(LA_FMA_TAG);
  return normalized;
}
