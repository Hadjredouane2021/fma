import type { Locale } from "@/types";

export type LocalizedTextFields = {
  fr?: string | null;
  en?: string | null;
  ar?: string | null;
};

/**
 * Texte pour la locale active.
 * Affiche le champ de la langue courante ; repli uniquement sur le français si absent (EN/AR).
 */
export function localizedText(fields: LocalizedTextFields, locale: Locale): string {
  const fr = fields.fr?.trim() || "";
  const en = fields.en?.trim() || "";
  const ar = fields.ar?.trim() || "";

  if (locale === "ar") return ar || fr;
  if (locale === "en") return en || fr;
  return fr;
}

export function hasAnyLocalizedText(fields: LocalizedTextFields): boolean {
  return Boolean(fields.fr?.trim() || fields.en?.trim() || fields.ar?.trim());
}

/** Premier titre non vide (slug, validation admin). */
export function primaryLocalizedText(fields: LocalizedTextFields): string {
  return fields.fr?.trim() || fields.en?.trim() || fields.ar?.trim() || "";
}

export type TeamMemberTextFields = {
  nameFr: string;
  nameEn?: string | null;
  nameAr?: string | null;
  titleFr?: string | null;
  titleEn?: string | null;
  titleAr?: string | null;
  department?: string | null;
};

/** Nom affiché sur /la-fma (repli FR pour EN/AR). */
export function teamMemberName(member: TeamMemberTextFields, locale: Locale): string {
  return localizedText({ fr: member.nameFr, en: member.nameEn, ar: member.nameAr }, locale);
}

/** Fonction affichée sur l’organigramme direction (repli FR pour EN/AR). */
export function teamMemberTitle(member: TeamMemberTextFields, locale: Locale): string {
  return localizedText({ fr: member.titleFr, en: member.titleEn, ar: member.titleAr }, locale);
}

export type TeamMemberLocaleLevel = "native" | "partial" | "fallback";

/**
 * État de traduction par langue, aligné sur le rendu public :
 * - native : textes propres à la langue en BDD
 * - partial : nom traduit mais fonction encore en repli FR (organigramme direction)
 * - fallback : nom en repli FR (comme sur le site si EN/AR absents)
 */
export function teamMemberLocaleLevel(
  member: TeamMemberTextFields,
  locale: Locale
): TeamMemberLocaleLevel {
  if (locale === "fr") return member.nameFr?.trim() ? "native" : "fallback";

  const nameNative = Boolean((locale === "en" ? member.nameEn : member.nameAr)?.trim());
  if (!nameNative) return "fallback";

  const showsTitle = member.department === "direction";
  if (!showsTitle) return "native";

  const titleNative = Boolean((locale === "en" ? member.titleEn : member.titleAr)?.trim());
  if (!titleNative && member.titleFr?.trim()) return "partial";
  return "native";
}

export function teamMemberFieldUsesFallback(
  member: TeamMemberTextFields,
  locale: Locale,
  field: "name" | "title"
): boolean {
  if (locale === "fr") return false;
  if (field === "name") {
    return !(locale === "en" ? member.nameEn : member.nameAr)?.trim();
  }
  return !(locale === "en" ? member.titleEn : member.titleAr)?.trim();
}

export type FmaMemberTextFields = {
  nameFr: string;
  nameEn?: string | null;
  nameAr?: string | null;
};

/** Raison sociale affichée sur /la-fma (alt logo ou texte de repli, repli FR pour EN/AR). */
export function fmaMemberName(member: FmaMemberTextFields, locale: Locale): string {
  return localizedText({ fr: member.nameFr, en: member.nameEn, ar: member.nameAr }, locale);
}

export function fmaMemberLocaleLevel(member: FmaMemberTextFields, locale: Locale): TeamMemberLocaleLevel {
  if (locale === "fr") return member.nameFr?.trim() ? "native" : "fallback";
  return (locale === "en" ? member.nameEn : member.nameAr)?.trim() ? "native" : "fallback";
}

export function fmaMemberNameUsesFallback(member: FmaMemberTextFields, locale: Locale): boolean {
  if (locale === "fr") return false;
  return !(locale === "en" ? member.nameEn : member.nameAr)?.trim();
}

export type PublicationTextFields = {
  titleFr: string;
  titleEn?: string | null;
  titleAr?: string | null;
};

export function publicationTitle(publication: PublicationTextFields, locale: Locale): string {
  return localizedText(
    { fr: publication.titleFr, en: publication.titleEn, ar: publication.titleAr },
    locale
  );
}

export function publicationLocaleLevel(
  publication: PublicationTextFields,
  locale: Locale
): TeamMemberLocaleLevel {
  if (locale === "fr") return publication.titleFr?.trim() ? "native" : "fallback";
  return (locale === "en" ? publication.titleEn : publication.titleAr)?.trim() ? "native" : "fallback";
}

export function publicationTitleUsesFallback(publication: PublicationTextFields, locale: Locale): boolean {
  if (locale === "fr") return false;
  return !(locale === "en" ? publication.titleEn : publication.titleAr)?.trim();
}

export type FmaMemberCategoryLabel = {
  slug: string;
  label: LocalizedTextFields;
};

/** Libellé de groupe affiché sur /la-fma (slug BDD → libellé traduit). */
export function fmaMemberCategoryLabel(
  categorySlug: string | null | undefined,
  locale: Locale,
  categories: FmaMemberCategoryLabel[],
  otherLabel: LocalizedTextFields
): string {
  const key = categorySlug?.trim() || "";
  if (!key) return localizedText(otherLabel, locale);
  const found = categories.find((c) => c.slug === key);
  if (found) return localizedText(found.label, locale);
  return key;
}
