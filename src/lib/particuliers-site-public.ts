import { ACCIDENT_INSURANCE_DETAIL_FR, ASSISTANCE_INSURANCE_DETAIL_FR, AUTO_INSURANCE_DETAIL_FR, HEALTH_INSURANCE_DETAIL_FR, HOME_INSURANCE_DETAIL_FR, LIFE_INSURANCE_DETAIL_FR, SAVINGS_INSURANCE_DETAIL_FR } from "@/lib/particuliers-auto-detail-fr";
import { normalizeLaFmaIcon } from "@/lib/la-fma-icon";

export interface LocalizedString { fr: string; en: string; ar: string; }

export interface InsuranceFeature { fr: string; en: string; ar: string; }

export interface InsuranceCard {
  id: string;
  icon: string;
  color: string;
  title: LocalizedString;
  description: LocalizedString;
  features: InsuranceFeature[];
  /** Lien du bouton « En savoir plus » (URL absolue ou chemin interne). Vide = page contact. Ignoré si contenu modal renseigné. */
  link?: string;
  /** Contenu HTML affiché dans une modale au clic sur « En savoir plus ». */
  detailContent?: LocalizedString;
}

export interface ParticuliersContent {
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroBadge: LocalizedString;
  ctaTitle: LocalizedString;
  ctaSubtitle: LocalizedString;
  ctaButton: LocalizedString;
  cards: InsuranceCard[];
}

function uid() { return Math.random().toString(36).slice(2, 9); }

export function createEmptyCard(): InsuranceCard {
  return {
    id: uid(),
    icon: "🛡️",
    color: "bg-primary",
    title: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "", ar: "" },
    features: [],
    link: "",
    detailContent: { fr: "", en: "", ar: "" },
  };
}

/** Résout le href du bouton « En savoir plus » d'une carte. */
export function resolveInsuranceCardLink(link: string | undefined, locale: string): string {
  const trimmed = link?.trim() ?? "";
  if (!trimmed) return `/${locale}/contact`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `/${locale}/${trimmed.replace(/^\/+/, "")}`;
}

export function createEmptyFeature(): InsuranceFeature {
  return { fr: "", en: "", ar: "" };
}

export const DEFAULT_PARTICULIERS_CONTENT: ParticuliersContent = {
  heroTitle:   { fr: "Espace Particuliers", en: "Individuals", ar: "فضاء الأفراد" },
  heroSubtitle:{ fr: "Découvrez les solutions d'assurance adaptées à vos besoins personnels.", en: "Discover insurance solutions tailored to your personal needs.", ar: "اكتشف حلول التأمين المناسبة لاحتياجاتك الشخصية." },
  heroBadge:   { fr: "Particuliers", en: "Individuals", ar: "الأفراد" },
  ctaTitle:    { fr: "Vous avez une question ?", en: "Have a question?", ar: "هل لديك سؤال؟" },
  ctaSubtitle: { fr: "Notre équipe est à votre disposition.", en: "Our team is here to help.", ar: "فريقنا متاح للإجابة." },
  ctaButton:   { fr: "Nous contacter", en: "Contact us", ar: "اتصل بنا" },
  cards: [
    {
      id: "auto", icon: "🚗", color: "bg-accent",
      title:       { fr: "Assurance Automobile",         en: "Car Insurance",            ar: "تأمين السيارات" },
      description: { fr: "L'assurance automobile est obligatoire au Maroc. Elle couvre votre responsabilité civile et protège votre véhicule contre les accidents, le vol et les catastrophes naturelles.", en: "Car insurance is mandatory in Morocco. It covers your civil liability and protects your vehicle against accidents, theft and natural disasters.", ar: "يعد تأمين السيارات إلزامياً في المغرب. يغطي مسؤوليتك المدنية ويحمي سيارتك من الحوادث والسرقة والكوارث الطبيعية." },
      features: [
        { fr: "Responsabilité civile obligatoire", en: "Mandatory civil liability",   ar: "المسؤولية المدنية الإلزامية" },
        { fr: "Dommages tous accidents",            en: "All-risk damage",             ar: "تغطية جميع الحوادث" },
        { fr: "Vol et incendie",                    en: "Theft and fire",              ar: "السرقة والحريق" },
        { fr: "Bris de glace",                      en: "Glass breakage",              ar: "تكسر الزجاج" },
        { fr: "Assistance 24h/24",                  en: "24/7 assistance",             ar: "مساعدة على مدار الساعة" },
      ],
      detailContent: {
        fr: AUTO_INSURANCE_DETAIL_FR,
        en: "",
        ar: "",
      },
    },
    {
      id: "accident", icon: "⚠️", color: "bg-gold",
      title:       { fr: "Individuel Accident",           en: "Individual Accident",      ar: "الحوادث الفردية" },
      description: { fr: "Cette garantie vous protège en cas d'accident corporel survenu dans votre vie quotidienne, professionnelle ou lors de vos loisirs.", en: "This cover protects you in the event of a bodily accident occurring in your daily life, at work or during leisure activities.", ar: "يحميك هذا الضمان في حالة وقوع حادث جسدي في حياتك اليومية أو المهنية أو أثناء أوقات الفراغ." },
      features: [
        { fr: "Incapacité temporaire",   en: "Temporary incapacity",     ar: "العجز المؤقت" },
        { fr: "Invalidité permanente",   en: "Permanent disability",     ar: "العجز الدائم" },
        { fr: "Décès accidentel",        en: "Accidental death",         ar: "الوفاة الحادثة" },
        { fr: "Frais médicaux",          en: "Medical expenses",         ar: "المصاريف الطبية" },
        { fr: "Remboursement soins",     en: "Care reimbursement",       ar: "استرداد تكاليف العلاج" },
      ],
      detailContent: {
        fr: ACCIDENT_INSURANCE_DETAIL_FR,
        en: "",
        ar: "",
      },
    },
    {
      id: "health", icon: "❤️", color: "bg-primary",
      title:       { fr: "Assurance Maladie",             en: "Health Insurance",         ar: "التأمين الصحي" },
      description: { fr: "L'assurance maladie couvre tout ou partie de vos dépenses de santé : consultations, hospitalisations, médicaments et soins dentaires.", en: "Health insurance covers all or part of your healthcare costs: consultations, hospitalisations, medicines and dental care.", ar: "يغطي التأمين الصحي كل أو جزء من نفقاتك الصحية: الاستشارات والاستشفاء والأدوية وتطبيب الأسنان." },
      features: [
        { fr: "Hospitalisation et chirurgie", en: "Hospitalisation & surgery", ar: "الاستشفاء والجراحة" },
        { fr: "Consultations médicales",      en: "Medical consultations",      ar: "الاستشارات الطبية" },
        { fr: "Médicaments",                  en: "Medicines",                  ar: "الأدوية" },
        { fr: "Soins dentaires",              en: "Dental care",                ar: "تطبيب الأسنان" },
        { fr: "Optique",                      en: "Optics",                     ar: "البصريات" },
      ],
      detailContent: {
        fr: HEALTH_INSURANCE_DETAIL_FR,
        en: "",
        ar: "",
      },
    },
    {
      id: "life", icon: "🛡️", color: "bg-mauve",
      title:       { fr: "Assurance Décès & Emprunteur",  en: "Life & Borrower Insurance", ar: "تأمين الوفاة" },
      description: { fr: "Protégez vos proches et vos engagements financiers grâce aux assurances décès et emprunteur.", en: "Protect your loved ones and financial commitments with life and borrower insurance.", ar: "احمِ أحبائك والتزاماتك المالية بفضل تأمين الوفاة وتأمين المقترض." },
      features: [
        { fr: "Capital décès",           en: "Death benefit",        ar: "رأس مال الوفاة" },
        { fr: "Rente éducation",         en: "Education annuity",    ar: "معاش التعليم" },
        { fr: "Assurance emprunteur",    en: "Borrower insurance",   ar: "تأمين المقترض" },
        { fr: "Invalidité totale",       en: "Total disability",     ar: "العجز الكلي" },
        { fr: "Perte d'emploi",          en: "Job loss",             ar: "فقدان العمل" },
      ],
      detailContent: {
        fr: LIFE_INSURANCE_DETAIL_FR,
        en: "",
        ar: "",
      },
    },
    {
      id: "savings", icon: "💰", color: "bg-primary-400",
      title:       { fr: "Épargne & Retraite",            en: "Savings & Retirement",     ar: "الادخار والتقاعد" },
      description: { fr: "Constituez une épargne sur le long terme et préparez votre retraite grâce aux contrats d'assurance-vie et de capitalisation.", en: "Build long-term savings and prepare for retirement with life insurance and capitalisation contracts.", ar: "كوّن ادخاراً على المدى الطويل وأعدّ لتقاعدك بفضل عقود التأمين على الحياة والرسملة." },
      features: [
        { fr: "Plan d'épargne retraite",       en: "Retirement savings plan",   ar: "خطة الادخار للتقاعد" },
        { fr: "Assurance-vie",                 en: "Life insurance",            ar: "التأمين على الحياة" },
        { fr: "Contrats de capitalisation",    en: "Capitalisation contracts",  ar: "عقود الرسملة" },
        { fr: "Rente viagère",                 en: "Life annuity",              ar: "المعاش المدى الحياة" },
        { fr: "Transmission de patrimoine",    en: "Wealth transfer",           ar: "نقل الثروة" },
      ],
      detailContent: {
        fr: SAVINGS_INSURANCE_DETAIL_FR,
        en: "",
        ar: "",
      },
    },
    {
      id: "assistance", icon: "☂️", color: "bg-pale",
      title:       { fr: "Assistance",                    en: "Assistance",               ar: "المساعدة" },
      description: { fr: "Des services d'assistance disponibles 24h/24 et 7j/7 en cas de sinistre, de problème médical ou de panne.", en: "Assistance services available 24/7 in the event of a claim, medical problem or breakdown.", ar: "خدمات المساعدة متاحة على مدار الساعة في حالة الحوادث أو المشاكل الطبية أو الأعطال." },
      features: [
        { fr: "Assistance dépannage",    en: "Breakdown assistance",  ar: "مساعدة الأعطال" },
        { fr: "Assistance médicale",     en: "Medical assistance",    ar: "المساعدة الطبية" },
        { fr: "Assistance juridique",    en: "Legal assistance",      ar: "المساعدة القانونية" },
        { fr: "Rapatriement",            en: "Repatriation",          ar: "الترحيل" },
        { fr: "Hébergement d'urgence",   en: "Emergency accommodation",ar: "إيواء الطوارئ" },
      ],
      detailContent: {
        fr: ASSISTANCE_INSURANCE_DETAIL_FR,
        en: "",
        ar: "",
      },
    },
    {
      id: "home-ins", icon: "🏠", color: "bg-graphite",
      title:       { fr: "Multirisque Habitation",        en: "Home Insurance",           ar: "تأمين المسكن" },
      description: { fr: "Protégez votre logement et son contenu contre les incendies, dégâts des eaux, vols et catastrophes naturelles.", en: "Protect your home and its contents against fires, water damage, theft and natural disasters.", ar: "احمِ مسكنك ومحتوياته من الحرائق وأضرار المياه والسرقة والكوارث الطبيعية." },
      features: [
        { fr: "Incendie et explosion",        en: "Fire and explosion",        ar: "الحريق والانفجار" },
        { fr: "Dégâts des eaux",              en: "Water damage",              ar: "أضرار المياه" },
        { fr: "Vol et vandalisme",            en: "Theft and vandalism",       ar: "السرقة والتخريب" },
        { fr: "Catastrophes naturelles",      en: "Natural disasters",         ar: "الكوارث الطبيعية" },
        { fr: "Responsabilité civile",        en: "Civil liability",           ar: "المسؤولية المدنية" },
      ],
      detailContent: {
        fr: HOME_INSURANCE_DETAIL_FR,
        en: "",
        ar: "",
      },
    },
  ],
};

export const PARTICULIERS_KEY = "particuliers_content";
export const CARDS_MAX = 12;

const str = (v: unknown, fb = "") => (typeof v === "string" ? v : fb);

function normLS(v: unknown, fb: LocalizedString): LocalizedString {
  if (!v || typeof v !== "object") return fb;
  const d = v as Record<string, unknown>;
  return { fr: str(d.fr, fb.fr), en: str(d.en, fb.en), ar: str(d.ar, fb.ar) };
}

function normFeature(f: unknown): InsuranceFeature | null {
  if (!f || typeof f !== "object") return null;
  const d = f as Record<string, unknown>;
  return { fr: str(d.fr), en: str(d.en), ar: str(d.ar) };
}

function normCard(c: unknown, defaultCards: InsuranceCard[]): InsuranceCard | null {
  if (!c || typeof c !== "object") return null;
  const d = c as Record<string, unknown>;
  const id = str(d.id) || Math.random().toString(36).slice(2, 9);
  const fallback = defaultCards.find((dc) => dc.id === id);
  const features = Array.isArray(d.features)
    ? (d.features as unknown[]).map(normFeature).filter(Boolean) as InsuranceFeature[]
    : fallback?.features ?? [];
  let detailContent = normLS(d.detailContent, fallback?.detailContent ?? { fr: "", en: "", ar: "" });
  if (!detailContent.fr.trim() && fallback?.detailContent?.fr?.trim()) {
    detailContent = fallback.detailContent;
  }
  return {
    id,
    icon: normalizeLaFmaIcon(str(d.icon, fallback?.icon ?? "🛡️")),
    color: str(d.color, fallback?.color ?? "bg-primary"),
    title: normLS(d.title, fallback?.title ?? { fr: "", en: "", ar: "" }),
    description: normLS(d.description, fallback?.description ?? { fr: "", en: "", ar: "" }),
    features,
    link: str(d.link, fallback?.link ?? ""),
    detailContent,
  };
}

export function normalizeParticuliersContent(input: unknown): ParticuliersContent {
  const def = DEFAULT_PARTICULIERS_CONTENT;
  if (!input || typeof input !== "object") return def;
  const d = input as Record<string, unknown>;
  const cards = Array.isArray(d.cards)
    ? (d.cards as unknown[]).map((c) => normCard(c, def.cards)).filter(Boolean) as InsuranceCard[]
    : def.cards;
  return {
    heroTitle: normLS(d.heroTitle, def.heroTitle),
    heroSubtitle: normLS(d.heroSubtitle, def.heroSubtitle),
    heroBadge: normLS(d.heroBadge, def.heroBadge),
    ctaTitle: normLS(d.ctaTitle, def.ctaTitle),
    ctaSubtitle: normLS(d.ctaSubtitle, def.ctaSubtitle),
    ctaButton: normLS(d.ctaButton, def.ctaButton),
    cards: cards.length ? cards : def.cards,
  };
}
