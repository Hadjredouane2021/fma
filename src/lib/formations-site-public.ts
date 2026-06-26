import { normalizeLaFmaIcon } from "@/lib/la-fma-icon";

export interface LocalizedString {
  fr: string;
  en: string;
  ar: string;
}

export interface FormationFeature {
  fr: string;
  en: string;
  ar: string;
}

export const FORMATION_FORMATS = ["presentiel", "distanciel", "hybride"] as const;
export type FormationFormat = (typeof FORMATION_FORMATS)[number];

export interface FormationItem {
  id: string;
  icon: string;
  color: string;
  active: boolean;
  title: LocalizedString;
  description: LocalizedString;
  /** Lien inscription ou « En savoir plus ». */
  link?: string;
  registrationUrl?: string;
  detailContent?: LocalizedString;
  features: FormationFeature[];
  startDate?: string;
  endDate?: string;
  location?: string;
  duration?: string;
  format?: FormationFormat | "";
  level?: string;
  organizer?: string;
  price?: string;
}

export interface FormationFaqItem {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface FormationsContent {
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroBadge: LocalizedString;
  formationsSectionTitle: LocalizedString;
  faqTitle: LocalizedString;
  ctaTitle: LocalizedString;
  ctaButton: LocalizedString;
  formations: FormationItem[];
  faq: FormationFaqItem[];
}

export const FORMATION_ICON_OPTIONS = [
  "GraduationCap",
  "BookOpen",
  "Presentation",
  "Users",
  "Award",
  "Calendar",
  "Monitor",
  "Building2",
  "Globe",
  "Briefcase",
] as const;

export type FormationIconName = (typeof FORMATION_ICON_OPTIONS)[number];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function createEmptyFeature(): FormationFeature {
  return { fr: "", en: "", ar: "" };
}

export function createEmptyFormation(): FormationItem {
  return {
    id: uid(),
    icon: "GraduationCap",
    color: "bg-primary",
    active: true,
    title: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "", ar: "" },
    link: "",
    registrationUrl: "",
    detailContent: { fr: "", en: "", ar: "" },
    features: [],
    startDate: "",
    endDate: "",
    location: "",
    duration: "",
    format: "",
    level: "",
    organizer: "",
    price: "",
  };
}

export function createEmptyFaqItem(): FormationFaqItem {
  return {
    id: uid(),
    question: { fr: "", en: "", ar: "" },
    answer: { fr: "", en: "", ar: "" },
  };
}

export function filterActiveFormations(formations: FormationItem[]): FormationItem[] {
  return formations.filter((f) => f.active !== false);
}

export function sortFormationsByDate(formations: FormationItem[]): FormationItem[] {
  return [...formations].sort((a, b) => {
    const da = a.startDate ? Date.parse(a.startDate) : 0;
    const db = b.startDate ? Date.parse(b.startDate) : 0;
    return db - da;
  });
}

export function resolveFormationLink(link: string | undefined, locale: string): string {
  const trimmed = link?.trim() ?? "";
  if (!trimmed) return `/${locale}/contact`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `/${locale}/${trimmed.replace(/^\/+/, "")}`;
}

export function isFormationLucideIcon(icon: string): icon is FormationIconName {
  return (FORMATION_ICON_OPTIONS as readonly string[]).includes(icon);
}

export const DEFAULT_FORMATIONS_CONTENT: FormationsContent = {
  heroTitle: {
    fr: "Formations",
    en: "Training",
    ar: "التدريبات",
  },
  heroSubtitle: {
    fr: "Développez vos compétences avec les programmes de formation de la FMA",
    en: "Develop your skills with FMA training programmes",
    ar: "طوّر مهاراتك مع برامج التدريب التي تقدمها الاتحاد",
  },
  heroBadge: {
    fr: "Formation",
    en: "Training",
    ar: "تدريب",
  },
  formationsSectionTitle: {
    fr: "Nos formations",
    en: "Our training courses",
    ar: "دوراتنا التدريبية",
  },
  faqTitle: {
    fr: "Foire aux questions",
    en: "FAQ",
    ar: "الأسئلة الشائعة",
  },
  ctaTitle: {
    fr: "Une question sur nos formations ?",
    en: "Questions about our training?",
    ar: "لديك سؤال حول دوراتنا؟",
  },
  ctaButton: {
    fr: "Contactez-nous",
    en: "Contact us",
    ar: "اتصل بنا",
  },
  formations: [],
  faq: [
    {
      id: "faq-1",
      question: {
        fr: "Comment s'inscrire à une formation ?",
        en: "How do I register for a training course?",
        ar: "كيف أسجّل في دورة تدريبية؟",
      },
      answer: {
        fr: "Cliquez sur « S'inscrire » sur la fiche de la formation concernée ou contactez-nous pour être orienté vers le bon programme.",
        en: "Click « Register » on the relevant course card or contact us to be directed to the right programme.",
        ar: "انقر على « التسجيل » في بطاقة الدورة المعنية أو اتصل بنا لتوجيهك إلى البرنامج المناسب.",
      },
    },
    {
      id: "faq-2",
      question: {
        fr: "Les formations sont-elles certifiantes ?",
        en: "Are the courses certified?",
        ar: "هل الدورات معتمدة؟",
      },
      answer: {
        fr: "Selon le programme, une attestation ou certification peut être délivrée en fin de formation. Les détails figurent sur chaque fiche.",
        en: "Depending on the programme, a certificate may be issued upon completion. Details are provided on each course card.",
        ar: "حسب البرنامج، قد تُمنح شهادة في نهاية الدورة. التفاصيل متوفرة في كل بطاقة دورة.",
      },
    },
  ],
};

export const FORMATIONS_KEY = "formations_content";
export const FORMATIONS_MAX = 24;
export const FAQ_MAX = 12;

const str = (v: unknown, fb = "") => (typeof v === "string" ? v : fb);

function normLS(v: unknown, fb: LocalizedString): LocalizedString {
  if (!v || typeof v !== "object") return fb;
  const d = v as Record<string, unknown>;
  return { fr: str(d.fr, fb.fr), en: str(d.en, fb.en), ar: str(d.ar, fb.ar) };
}

function normFeature(f: unknown): FormationFeature | null {
  if (!f || typeof f !== "object") return null;
  const d = f as Record<string, unknown>;
  return { fr: str(d.fr), en: str(d.en), ar: str(d.ar) };
}

function normFormat(v: unknown): FormationFormat | "" {
  const s = str(v);
  return (FORMATION_FORMATS as readonly string[]).includes(s) ? (s as FormationFormat) : "";
}

function normFormation(f: unknown, defaultFormations: FormationItem[]): FormationItem | null {
  if (!f || typeof f !== "object") return null;
  const d = f as Record<string, unknown>;
  const id = str(d.id) || uid();
  const fallback = defaultFormations.find((df) => df.id === id);
  const features = Array.isArray(d.features)
    ? ((d.features as unknown[]).map(normFeature).filter(Boolean) as FormationFeature[])
    : fallback?.features ?? [];
  let detailContent = normLS(d.detailContent, fallback?.detailContent ?? { fr: "", en: "", ar: "" });
  if (!detailContent.fr.trim() && fallback?.detailContent?.fr?.trim()) {
    detailContent = fallback.detailContent;
  }
  return {
    id,
    icon: normalizeLaFmaIcon(str(d.icon, fallback?.icon ?? "GraduationCap")),
    color: str(d.color, fallback?.color ?? "bg-primary"),
    active: d.active !== false,
    title: normLS(d.title, fallback?.title ?? { fr: "", en: "", ar: "" }),
    description: normLS(d.description, fallback?.description ?? { fr: "", en: "", ar: "" }),
    features,
    link: str(d.link, fallback?.link ?? ""),
    registrationUrl: str(d.registrationUrl, fallback?.registrationUrl ?? ""),
    detailContent,
    startDate: str(d.startDate, fallback?.startDate ?? ""),
    endDate: str(d.endDate, fallback?.endDate ?? ""),
    location: str(d.location, fallback?.location ?? ""),
    duration: str(d.duration, fallback?.duration ?? ""),
    format: normFormat(d.format) || fallback?.format || "",
    level: str(d.level, fallback?.level ?? ""),
    organizer: str(d.organizer, fallback?.organizer ?? ""),
    price: str(d.price, fallback?.price ?? ""),
  };
}

function normFaq(f: unknown, defaultFaq: FormationFaqItem[]): FormationFaqItem | null {
  if (!f || typeof f !== "object") return null;
  const d = f as Record<string, unknown>;
  const id = str(d.id) || uid();
  const fallback = defaultFaq.find((df) => df.id === id);
  return {
    id,
    question: normLS(d.question, fallback?.question ?? { fr: "", en: "", ar: "" }),
    answer: normLS(d.answer, fallback?.answer ?? { fr: "", en: "", ar: "" }),
  };
}

export function normalizeFormationsContent(input: unknown): FormationsContent {
  const def = DEFAULT_FORMATIONS_CONTENT;
  if (!input || typeof input !== "object") return def;
  const d = input as Record<string, unknown>;
  const formations = Array.isArray(d.formations)
    ? ((d.formations as unknown[]).map((f) => normFormation(f, def.formations)).filter(Boolean) as FormationItem[])
    : def.formations;
  const faq = Array.isArray(d.faq)
    ? ((d.faq as unknown[]).map((f) => normFaq(f, def.faq)).filter(Boolean) as FormationFaqItem[])
    : def.faq;
  return {
    heroTitle: normLS(d.heroTitle, def.heroTitle),
    heroSubtitle: normLS(d.heroSubtitle, def.heroSubtitle),
    heroBadge: normLS(d.heroBadge, def.heroBadge),
    formationsSectionTitle: normLS(d.formationsSectionTitle, def.formationsSectionTitle),
    faqTitle: normLS(d.faqTitle, def.faqTitle),
    ctaTitle: normLS(d.ctaTitle, def.ctaTitle),
    ctaButton: normLS(d.ctaButton, def.ctaButton),
    formations,
    faq: faq.length ? faq : def.faq,
  };
}

/** Importe les lignes Prisma legacy vers le modèle CMS (première ouverture admin). */
export function prismaFormationToItem(row: {
  id: string;
  titleFr: string;
  titleEn: string | null;
  titleAr: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  organizer: string | null;
  duration: string | null;
  format: string | null;
  level: string | null;
  price: string | null;
  startDate: Date | null;
  endDate: Date | null;
  location: string | null;
  registrationUrl: string | null;
  status: string;
}): FormationItem {
  const toDate = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
  return {
    id: row.id,
    icon: "GraduationCap",
    color: "bg-primary",
    active: row.status === "PUBLISHED",
    title: {
      fr: row.titleFr,
      en: row.titleEn || "",
      ar: row.titleAr || "",
    },
    description: {
      fr: row.descriptionFr || "",
      en: row.descriptionEn || "",
      ar: row.descriptionAr || "",
    },
    registrationUrl: row.registrationUrl || "",
    link: "",
    detailContent: { fr: "", en: "", ar: "" },
    features: [],
    startDate: toDate(row.startDate),
    endDate: toDate(row.endDate),
    location: row.location || "",
    duration: row.duration || "",
    format: normFormat(row.format),
    level: row.level || "",
    organizer: row.organizer || "",
    price: row.price || "",
  };
}
