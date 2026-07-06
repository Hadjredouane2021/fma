import type { Locale } from "@/types";

/** Valeurs `department` en BDD → sections affichées sur /[locale]/la-fma */
export const TEAM_DEPARTMENTS = {
  comite_directeur: {
    dbValue: "comite_directeur",
    adminLabel: "Comité directeur",
    publicSectionFr: "Le Comité Directeur",
    publicSectionEn: "The Board of Directors",
    publicSectionAr: "المجلس التوجيهي",
    siteFields: "nom (+ photo)",
  },
  direction: {
    dbValue: "direction",
    adminLabel: "Équipe opérationnelle",
    publicSectionFr: "L'Équipe Opérationnelle",
    publicSectionEn: "The Operational Team",
    publicSectionAr: "الفريق التشغيلي",
    siteFields: "nom + fonction",
  },
} as const;

export type TeamDepartmentKey = keyof typeof TEAM_DEPARTMENTS;

export function teamDepartmentLabel(department: string | null | undefined): string {
  if (department === "comite_directeur") return TEAM_DEPARTMENTS.comite_directeur.adminLabel;
  if (department === "direction") return TEAM_DEPARTMENTS.direction.adminLabel;
  return department?.trim() || "—";
}

export function teamDepartmentPublicSection(department: string | null | undefined, locale: Locale): string {
  if (department === "comite_directeur") {
    const d = TEAM_DEPARTMENTS.comite_directeur;
    return locale === "ar" ? d.publicSectionAr : locale === "en" ? d.publicSectionEn : d.publicSectionFr;
  }
  if (department === "direction") {
    const d = TEAM_DEPARTMENTS.direction;
    return locale === "ar" ? d.publicSectionAr : locale === "en" ? d.publicSectionEn : d.publicSectionFr;
  }
  return department?.trim() || "—";
}

export function isKnownTeamDepartment(department: string | null | undefined): department is TeamDepartmentKey {
  return department === "comite_directeur" || department === "direction";
}
