import { DB_KEYS } from "@/lib/db-keys";

export interface LocalizedString {
  fr: string;
  en: string;
  ar: string;
}

export interface RevenueStructureRow {
  id: string;
  category: LocalizedString;
  /** Montant en millions de dirhams (nombre, ex. "29561.6") */
  revenue: string;
  /** Part en % (nombre, ex. "46.0") */
  contribution: string;
  /** Somme automatique des lignes référencées (ex. Assurance non vie). */
  aggregateRowIds?: string[];
}

/** Lignes détaillées incluses dans « Assurance non vie » par défaut. */
export const NON_VIE_AGGREGATE_ROW_IDS = [
  "auto",
  "corp",
  "at",
  "inc",
  "acc",
  "autres",
  "trans",
  "rea",
  "rc",
  "gcec",
  "tech",
] as const;

export interface ChiffresClesContent {
  title: LocalizedString;
  unitNote: LocalizedString;
  columnCategory: LocalizedString;
  columnRevenue: LocalizedString;
  columnContribution: LocalizedString;
  totalLabel: LocalizedString;
  rows: RevenueStructureRow[];
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function createEmptyRow(): RevenueStructureRow {
  return {
    id: uid(),
    category: { fr: "", en: "", ar: "" },
    revenue: "",
    contribution: "",
    aggregateRowIds: [],
  };
}

export function createNonVieAggregateRow(): RevenueStructureRow {
  return {
    id: "non-vie",
    category: {
      fr: "Assurance non vie",
      en: "Non-life insurance",
      ar: "تأمين غير الحياة",
    },
    revenue: "",
    contribution: "",
    aggregateRowIds: [...NON_VIE_AGGREGATE_ROW_IDS],
  };
}

export function isAggregateRow(row: RevenueStructureRow): boolean {
  return Array.isArray(row.aggregateRowIds) && row.aggregateRowIds.length > 0;
}

export function resolveRowValues(
  row: RevenueStructureRow,
  allRows: RevenueStructureRow[],
  visiting = new Set<string>()
): { revenue: number; contribution: number } {
  if (isAggregateRow(row)) {
    if (visiting.has(row.id)) return { revenue: 0, contribution: 0 };
    visiting.add(row.id);
    let revenue = 0;
    let contribution = 0;
    for (const id of row.aggregateRowIds!) {
      const child = allRows.find((r) => r.id === id);
      if (!child) continue;
      const v = resolveRowValues(child, allRows, visiting);
      revenue += v.revenue;
      contribution += v.contribution;
    }
    return { revenue, contribution };
  }
  return {
    revenue: parseAmount(row.revenue),
    contribution: parseAmount(row.contribution),
  };
}

const ROWS_DEFAULT: RevenueStructureRow[] = [
  { id: "vie", category: { fr: "Assurances Vie et Capitalisation", en: "Life and Capitalisation Insurance", ar: "تأمينات الحياة والادخار" }, revenue: "29561.6", contribution: "46.0" },
  { id: "auto", category: { fr: "Automobile", en: "Motor", ar: "السيارات" }, revenue: "16178.5", contribution: "25.2" },
  { id: "corp", category: { fr: "Accidents Corporels", en: "Personal Accident", ar: "حوادث الأشخاص" }, revenue: "6015.4", contribution: "9.4" },
  { id: "at", category: { fr: "Accidents du Travail et MP", en: "Work Accidents & Occupational Disease", ar: "حوادث الشغل والأمراض المهنية" }, revenue: "2852.3", contribution: "4.4" },
  { id: "inc", category: { fr: "Incendie", en: "Fire", ar: "الحريق" }, revenue: "2513.3", contribution: "3.9" },
  { id: "acc", category: { fr: "Assistance - Crédit - Caution", en: "Assistance - Credit - Surety", ar: "المساعدة - الائتمان - الكفالة" }, revenue: "2009.3", contribution: "3.1" },
  { id: "autres", category: { fr: "Autres Opérations Non Vie", en: "Other Non-Life Operations", ar: "عمليات أخرى غير الحياة" }, revenue: "1098.7", contribution: "1.7" },
  { id: "trans", category: { fr: "Transport", en: "Transport", ar: "النقل" }, revenue: "809.7", contribution: "1.3" },
  { id: "rea", category: { fr: "Acceptations en réassurance", en: "Reinsurance Acceptances", ar: "قبولات إعادة التأمين" }, revenue: "950.4", contribution: "1.5" },
  { id: "rc", category: { fr: "Responsabilité Civile Générale", en: "General Liability", ar: "المسؤولية المدنية العامة" }, revenue: "874.6", contribution: "1.4" },
  { id: "gcec", category: { fr: "GCEC (*)", en: "GCEC (*)", ar: "GCEC (*)" }, revenue: "694.2", contribution: "1.1" },
  { id: "tech", category: { fr: "Risques Techniques", en: "Engineering Risks", ar: "المخاطر التقنية" }, revenue: "711.4", contribution: "1.1" },
];

export const DEFAULT_CHIFFRES_CLES_CONTENT: ChiffresClesContent = {
  title: {
    fr: "STRUCTURE DU CHIFFRE D'AFFAIRES",
    en: "REVENUE STRUCTURE",
    ar: "هيكلة رقم الأعمال",
  },
  unitNote: {
    fr: "En millions de dirhams",
    en: "In millions of dirhams",
    ar: "بالملايين من الدرهم",
  },
  columnCategory: { fr: "", en: "", ar: "" },
  columnRevenue: { fr: "Chiffre d'Affaires", en: "Revenue", ar: "رقم الأعمال" },
  columnContribution: { fr: "Contribution", en: "Share", ar: "المساهمة" },
  totalLabel: { fr: "Total", en: "Total", ar: "المجموع" },
  rows: ROWS_DEFAULT,
};

export const CHIFFRES_CLES_KEY = DB_KEYS.CHIFFRES_CLES_CONTENT;
export const ROWS_MAX = 20;
export const ROWS_MIN = 1;

export function parseAmount(value: string): number {
  const cleaned = value.replace(/\s/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatAmountFr(value: string | number, decimals = 1): string {
  const n = typeof value === "number" ? value : parseAmount(value);
  return n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPercentFr(value: string | number, decimals = 1): string {
  const n = typeof value === "number" ? value : parseAmount(value);
  return `${n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`;
}

export function sumRevenue(rows: RevenueStructureRow[]): number {
  return rows
    .filter((r) => !isAggregateRow(r))
    .reduce((acc, r) => acc + parseAmount(r.revenue), 0);
}

export function sumContribution(rows: RevenueStructureRow[]): number {
  return rows
    .filter((r) => !isAggregateRow(r))
    .reduce((acc, r) => acc + parseAmount(r.contribution), 0);
}

function normLS(v: unknown, fb: LocalizedString): LocalizedString {
  const str = (x: unknown, d: string) => (typeof x === "string" ? x : d);
  if (!v || typeof v !== "object") return fb;
  const d = v as Record<string, unknown>;
  return { fr: str(d.fr, fb.fr), en: str(d.en, fb.en), ar: str(d.ar, fb.ar) };
}

function normAggregateIds(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((id): id is string => typeof id === "string" && id.trim().length > 0);
}

function normRow(r: unknown): RevenueStructureRow | null {
  if (!r || typeof r !== "object") return null;
  const d = r as Record<string, unknown>;
  const aggregateRowIds = normAggregateIds(d.aggregateRowIds);
  return {
    id: typeof d.id === "string" && d.id ? d.id : uid(),
    category: normLS(d.category, { fr: "", en: "", ar: "" }),
    revenue: typeof d.revenue === "string" ? d.revenue : String(d.revenue ?? ""),
    contribution: typeof d.contribution === "string" ? d.contribution : String(d.contribution ?? ""),
    ...(aggregateRowIds.length ? { aggregateRowIds } : {}),
  };
}

export function normalizeChiffresClesContent(input: unknown): ChiffresClesContent {
  const def = DEFAULT_CHIFFRES_CLES_CONTENT;
  if (!input || typeof input !== "object") return def;
  const d = input as Record<string, unknown>;
  const rows = Array.isArray(d.rows)
    ? (d.rows as unknown[]).map(normRow).filter(Boolean) as RevenueStructureRow[]
    : def.rows;
  return {
    title: normLS(d.title, def.title),
    unitNote: normLS(d.unitNote, def.unitNote),
    columnCategory: normLS(d.columnCategory, def.columnCategory),
    columnRevenue: normLS(d.columnRevenue, def.columnRevenue),
    columnContribution: normLS(d.columnContribution, def.columnContribution),
    totalLabel: normLS(d.totalLabel, def.totalLabel),
    rows: rows.length ? rows : def.rows,
  };
}

type HomeKeyFigureLike = {
  value: string;
  suffix: string;
  label: { fr: string; en: string; ar: string };
  valueSource?: "manual" | "contribution" | "revenue";
  chiffresClesRowId?: string;
  description?: { fr: string; en: string; ar: string };
};

/** Résout la valeur affichée d'une carte d'accueil (manuelle ou liée au tableau Chiffres clés). */
export function resolveHomeKeyFigure(
  fig: HomeKeyFigureLike,
  chiffresCles: ChiffresClesContent,
  locale: "fr" | "en" | "ar"
): { value: string; suffix: string; label: string; description: string } {
  const label = fig.label[locale]?.trim() || fig.label.fr;
  const description = fig.description?.[locale]?.trim() || fig.description?.fr?.trim() || "";
  const row = fig.chiffresClesRowId
    ? chiffresCles.rows.find((r) => r.id === fig.chiffresClesRowId)
    : undefined;

  if (row && fig.valueSource === "contribution") {
    const { contribution } = resolveRowValues(row, chiffresCles.rows);
    const value = contribution > 0
      ? contribution.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      : row.contribution.replace(/%/g, "").trim() || fig.value;
    return {
      value,
      suffix: "%",
      label: label || row.category[locale] || row.category.fr,
      description,
    };
  }

  if (row && fig.valueSource === "revenue") {
    const { revenue } = resolveRowValues(row, chiffresCles.rows);
    const mds = revenue > 0 ? revenue / 1000 : parseAmount(row.revenue) / 1000;
    const formatted = Number.isFinite(mds) && mds > 0
      ? mds.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      : fig.value;
    return {
      value: formatted,
      suffix: fig.suffix || " Mds",
      label: label || row.category[locale] || row.category.fr,
      description,
    };
  }

  return { value: fig.value, suffix: fig.suffix, label, description };
}
