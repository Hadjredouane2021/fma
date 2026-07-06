import type { LaFmaMemberCategory, LocalizedString } from "@/lib/la-fma-site-public";

/** Anciennes valeurs texte → slug BDD (données historiques). */
const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  "entreprises d'assurances": "assureurs",
  "entreprises d'assurance": "assureurs",
  "sociétés d'assurance": "assureurs",
  "societes d'assurance": "assureurs",
  "compagnies d'assurance": "assureurs",
  assureurs: "assureurs",
  "réassureurs": "reassureurs",
  reassureurs: "reassureurs",
  "entreprises takaful": "takaful",
  takaful: "takaful",
  "شركات التأمين التكافلي": "takaful",
  "entreprises d'assistance": "assistance",
  assistance: "assistance",
  "شركات المساعدة": "assistance",
  "entreprises pratiquant exclusivement l'assurance crédit": "assurance-credit",
  "entreprises pratiquant exclusivement l'assurance credit": "assurance-credit",
  "companies operating exclusively in credit insurance": "assurance-credit",
  "الشركات التي تمارس التأمين الائتماني حصريًا": "assurance-credit",
  "الشركات التي تمارس التأمين الائتماني حصريا": "assurance-credit",
};

export function resolveMemberCategorySlug(
  raw: string | null | undefined,
  categories: LaFmaMemberCategory[]
): string {
  const key = raw?.trim() || "";
  if (!key) return "";

  if (categories.some((c) => c.slug === key)) return key;

  const alias = LEGACY_CATEGORY_ALIASES[key.toLowerCase()];
  if (alias && categories.some((c) => c.slug === alias)) return alias;

  const lower = key.toLowerCase();
  for (const c of categories) {
    const labels = [c.label.fr, c.label.en, c.label.ar].map((l) => l?.trim().toLowerCase()).filter(Boolean);
    if (labels.includes(lower)) return c.slug;
  }

  return key;
}

export type MemberCategoryConfig = {
  categories: LaFmaMemberCategory[];
  otherLabel: LocalizedString;
  extraSlugs: string[];
};
