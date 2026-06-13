import { normalizeLaFmaIcon } from "@/lib/la-fma-icon";

export interface LocalizedString {
  fr: string;
  en: string;
  ar: string;
}

export interface EntrepriseFeature {
  fr: string;
  en: string;
  ar: string;
}

/** Public cible du produit — sert au tri sur la page Entreprises. */
export const ENTREPRISE_PRODUCT_AUDIENCES = ["entreprises", "professionnels"] as const;
export type EntrepriseProductAudience = (typeof ENTREPRISE_PRODUCT_AUDIENCES)[number];

export interface EntrepriseProduct {
  id: string;
  icon: string;
  color: string;
  /** Affichage dans la section Entreprises ou Professionnels. */
  audience: EntrepriseProductAudience;
  title: LocalizedString;
  description: LocalizedString;
  /** Lien du bouton « En savoir plus ». Vide = page contact. Ignoré si contenu modal renseigné. */
  link?: string;
  /** Contenu HTML affiché dans une modale au clic sur « En savoir plus ». */
  detailContent?: LocalizedString;
  features: EntrepriseFeature[];
}

export interface EntrepriseFaqItem {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface EntreprisesContent {
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroBadge: LocalizedString;
  entreprisesSectionTitle: LocalizedString;
  professionnelsSectionTitle: LocalizedString;
  faqTitle: LocalizedString;
  ctaTitle: LocalizedString;
  ctaButton: LocalizedString;
  products: EntrepriseProduct[];
  faq: EntrepriseFaqItem[];
}

/** Noms d'icônes Lucide (legacy) — compatibilité produits par défaut. */
export const ENTREPRISE_ICON_OPTIONS = [
  "Building2",
  "Truck",
  "Users",
  "Globe",
  "Factory",
  "Briefcase",
  "Shield",
  "Landmark",
  "HeartPulse",
  "Wallet",
] as const;

export type EntrepriseIconName = (typeof ENTREPRISE_ICON_OPTIONS)[number];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function createEmptyFeature(): EntrepriseFeature {
  return { fr: "", en: "", ar: "" };
}

export function createEmptyProduct(audience: EntrepriseProductAudience = "entreprises"): EntrepriseProduct {
  return {
    id: uid(),
    icon: "Building2",
    color: "bg-primary",
    audience,
    title: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "", ar: "" },
    link: "",
    detailContent: { fr: "", en: "", ar: "" },
    features: [],
  };
}

export function filterEntrepriseProductsByAudience(
  products: EntrepriseProduct[],
  audience: EntrepriseProductAudience
): EntrepriseProduct[] {
  return products.filter((p) => (p.audience ?? "entreprises") === audience);
}

export function createEmptyFaqItem(): EntrepriseFaqItem {
  return {
    id: uid(),
    question: { fr: "", en: "", ar: "" },
    answer: { fr: "", en: "", ar: "" },
  };
}

/** Résout le href du bouton « En savoir plus » d'un produit. */
export function resolveEntrepriseProductLink(link: string | undefined, locale: string): string {
  const trimmed = link?.trim() ?? "";
  if (!trimmed) return `/${locale}/contact`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `/${locale}/${trimmed.replace(/^\/+/, "")}`;
}

export function isEntrepriseLucideIcon(icon: string): icon is EntrepriseIconName {
  return (ENTREPRISE_ICON_OPTIONS as readonly string[]).includes(icon);
}

export const DEFAULT_ENTREPRISES_CONTENT: EntreprisesContent = {
  heroTitle: {
    fr: "Entreprises & Professionnels",
    en: "Businesses & Professionals",
    ar: "المؤسسات والمهنيون",
  },
  heroSubtitle: {
    fr: "Des solutions d'assurance adaptées aux besoins de votre entreprise",
    en: "Insurance solutions tailored to your business needs",
    ar: "حلول تأمينية مصممة لاحتياجات مؤسستك",
  },
  heroBadge: {
    fr: "Entreprises",
    en: "Businesses",
    ar: "المؤسسات",
  },
  entreprisesSectionTitle: {
    fr: "Entreprises",
    en: "Businesses",
    ar: "المؤسسات",
  },
  professionnelsSectionTitle: {
    fr: "Professionnels",
    en: "Professionals",
    ar: "المهنيون",
  },
  faqTitle: {
    fr: "Foire aux questions",
    en: "FAQ",
    ar: "الأسئلة الشائعة",
  },
  ctaTitle: {
    fr: "Besoin d'aide ?",
    en: "Need help?",
    ar: "تحتاج مساعدة؟",
  },
  ctaButton: {
    fr: "Contactez-nous",
    en: "Contact us",
    ar: "اتصل بنا",
  },
  products: [
    {
      id: "multirisque",
      icon: "Building2",
      color: "bg-primary",
      audience: "entreprises",
      title: { fr: "Multirisque Professionnelle", en: "Professional Multi-Risk", ar: "متعدد المخاطر المهنية" },
      description: {
        fr: "Protégez vos locaux, votre matériel et votre activité contre tous les risques.",
        en: "Protect your premises, equipment and business against all risks.",
        ar: "احمِ مقرك ومعداتك ونشاطك من جميع المخاطر.",
      },
      features: [],
    },
    {
      id: "transport",
      icon: "Truck",
      color: "bg-accent",
      audience: "entreprises",
      title: { fr: "Transport & Logistique", en: "Transport & Logistics", ar: "النقل والخدمات اللوجستية" },
      description: {
        fr: "Assurance marchandises transportées, flotte automobile professionnelle.",
        en: "Cargo insurance and professional vehicle fleet cover.",
        ar: "تأمين البضائع المنقولة وأسطول المركبات المهنية.",
      },
      features: [],
    },
    {
      id: "groupe",
      icon: "Users",
      color: "bg-gold",
      audience: "entreprises",
      title: { fr: "Assurance Groupe", en: "Group Insurance", ar: "التأمين الجماعي" },
      description: {
        fr: "Protégez vos collaborateurs avec des garanties santé, prévoyance et retraite.",
        en: "Protect your employees with health, welfare and retirement benefits.",
        ar: "احمِ موظفيك بضمانات الصحة والتقاعد والحماية الاجتماعية.",
      },
      features: [],
    },
    {
      id: "rc",
      icon: "Globe",
      color: "bg-mauve",
      audience: "professionnels",
      title: { fr: "Responsabilité Civile", en: "Civil Liability", ar: "المسؤولية المدنية" },
      description: {
        fr: "Couvrez votre responsabilité envers les tiers dans l'exercice de votre activité.",
        en: "Cover your liability to third parties in the course of your business.",
        ar: "غطّ مسؤوليتك تجاه الغير أثناء ممارسة نشاطك.",
      },
      features: [],
    },
    {
      id: "industriel",
      icon: "Factory",
      color: "bg-graphite",
      audience: "entreprises",
      title: { fr: "Risques Industriels", en: "Industrial Risks", ar: "المخاطر الصناعية" },
      description: {
        fr: "Solutions sur-mesure pour les grandes entreprises et les risques complexes.",
        en: "Tailored solutions for large companies and complex risks.",
        ar: "حلول مخصصة للمؤسسات الكبرى والمخاطر المعقدة.",
      },
      features: [],
    },
    {
      id: "credit",
      icon: "Briefcase",
      color: "bg-primary-400",
      audience: "entreprises",
      title: { fr: "Assurance Crédit", en: "Credit Insurance", ar: "تأمين الائتمان" },
      description: {
        fr: "Protégez votre entreprise contre les risques d'impayés de vos clients.",
        en: "Protect your business against the risk of customer non-payment.",
        ar: "احمِ مؤسستك من مخاطر عدم سداد عملائك.",
      },
      features: [],
    },
  ],
  faq: [
    {
      id: "faq-1",
      question: {
        fr: "Quelle assurance est obligatoire pour mon entreprise ?",
        en: "What insurance is mandatory for my business?",
        ar: "ما هو التأمين الإلزامي لمؤسستي؟",
      },
      answer: {
        fr: "La responsabilité civile professionnelle est généralement obligatoire selon votre secteur d'activité. L'assurance automobile est également obligatoire pour votre flotte.",
        en: "Professional liability insurance is generally mandatory depending on your sector. Motor insurance is also required for your fleet.",
        ar: "المسؤولية المدنية المهنية إلزامية عادة حسب قطاع نشاطكم. كما أن تأمين السيارات إلزامي لأسطولكم.",
      },
    },
    {
      id: "faq-2",
      question: {
        fr: "Comment choisir la bonne assurance pour mon entreprise ?",
        en: "How do I choose the right insurance for my business?",
        ar: "كيف أختار التأمين المناسب لمؤسستي؟",
      },
      answer: {
        fr: "Identifiez vos risques principaux, évaluez vos besoins de couverture et comparez les offres des sociétés membres de la FMA. Un courtier peut vous accompagner.",
        en: "Identify your main risks, assess your coverage needs and compare offers from FMA member companies. A broker can guide you.",
        ar: "حددوا مخاطركم الرئيسية، قيّموا احتياجات التغطية وقارنوا عروض شركات أعضاء الاتحاد. يمكن لوسيط مساعدتكم.",
      },
    },
    {
      id: "faq-3",
      question: {
        fr: "Qu'est-ce que l'assurance multirisque professionnelle couvre ?",
        en: "What does professional multi-risk insurance cover?",
        ar: "ماذا يغطي التأمين متعدد المخاطر المهنية؟",
      },
      answer: {
        fr: "Elle couvre généralement vos locaux, votre matériel, vos marchandises, votre responsabilité civile et les pertes d'exploitation en cas de sinistre.",
        en: "It generally covers your premises, equipment, goods, civil liability and business interruption in the event of a claim.",
        ar: "يغطي عادة مقركم ومعداتكم وبضائعكم والمسؤولية المدنية وخسائر النشاط عند وقوع حادث.",
      },
    },
  ],
};

export const ENTREPRISES_KEY = "entreprises_content";
export const PRODUCTS_MAX = 12;
export const FAQ_MAX = 12;

const str = (v: unknown, fb = "") => (typeof v === "string" ? v : fb);

function normLS(v: unknown, fb: LocalizedString): LocalizedString {
  if (!v || typeof v !== "object") return fb;
  const d = v as Record<string, unknown>;
  return { fr: str(d.fr, fb.fr), en: str(d.en, fb.en), ar: str(d.ar, fb.ar) };
}

function normFeature(f: unknown): EntrepriseFeature | null {
  if (!f || typeof f !== "object") return null;
  const d = f as Record<string, unknown>;
  return { fr: str(d.fr), en: str(d.en), ar: str(d.ar) };
}

function normAudience(v: unknown, fb: EntrepriseProductAudience = "entreprises"): EntrepriseProductAudience {
  const s = str(v, fb);
  return (ENTREPRISE_PRODUCT_AUDIENCES as readonly string[]).includes(s)
    ? (s as EntrepriseProductAudience)
    : fb;
}

function normProduct(p: unknown, defaultProducts: EntrepriseProduct[]): EntrepriseProduct | null {
  if (!p || typeof p !== "object") return null;
  const d = p as Record<string, unknown>;
  const id = str(d.id) || uid();
  const fallback = defaultProducts.find((dp) => dp.id === id);
  const features = Array.isArray(d.features)
    ? (d.features as unknown[]).map(normFeature).filter(Boolean) as EntrepriseFeature[]
    : fallback?.features ?? [];
  let detailContent = normLS(d.detailContent, fallback?.detailContent ?? { fr: "", en: "", ar: "" });
  if (!detailContent.fr.trim() && fallback?.detailContent?.fr?.trim()) {
    detailContent = fallback.detailContent;
  }
  return {
    id,
    icon: normalizeLaFmaIcon(str(d.icon, fallback?.icon ?? "Building2")),
    color: str(d.color, fallback?.color ?? "bg-primary"),
    audience: normAudience(d.audience, fallback?.audience ?? "entreprises"),
    title: normLS(d.title, fallback?.title ?? { fr: "", en: "", ar: "" }),
    description: normLS(d.description, fallback?.description ?? { fr: "", en: "", ar: "" }),
    features,
    link: str(d.link, fallback?.link ?? ""),
    detailContent,
  };
}

function normFaq(f: unknown, defaultFaq: EntrepriseFaqItem[]): EntrepriseFaqItem | null {
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

export function normalizeEntreprisesContent(input: unknown): EntreprisesContent {
  const def = DEFAULT_ENTREPRISES_CONTENT;
  if (!input || typeof input !== "object") return def;
  const d = input as Record<string, unknown>;
  const products = Array.isArray(d.products)
    ? (d.products as unknown[]).map((p) => normProduct(p, def.products)).filter(Boolean) as EntrepriseProduct[]
    : def.products;
  const faq = Array.isArray(d.faq)
    ? (d.faq as unknown[]).map((f) => normFaq(f, def.faq)).filter(Boolean) as EntrepriseFaqItem[]
    : def.faq;
  return {
    heroTitle: normLS(d.heroTitle, def.heroTitle),
    heroSubtitle: normLS(d.heroSubtitle, def.heroSubtitle),
    heroBadge: normLS(d.heroBadge, def.heroBadge),
    entreprisesSectionTitle: normLS(d.entreprisesSectionTitle, def.entreprisesSectionTitle),
    professionnelsSectionTitle: normLS(d.professionnelsSectionTitle, def.professionnelsSectionTitle),
    faqTitle: normLS(d.faqTitle, def.faqTitle),
    ctaTitle: normLS(d.ctaTitle, def.ctaTitle),
    ctaButton: normLS(d.ctaButton, def.ctaButton),
    products: products.length ? products : def.products,
    faq: faq.length ? faq : def.faq,
  };
}
