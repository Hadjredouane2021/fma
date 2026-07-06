export interface MenuLabel {
  fr: string;
  en: string;
  ar: string;
}

export interface MenuChild {
  id: string;
  labelFr: string;
  labelEn: string;
  labelAr: string;
  href: string;
}

export interface MenuItem {
  id: string;
  labelFr: string;
  labelEn: string;
  labelAr: string;
  href: string;
  children: MenuChild[];
}

export interface MenuContent {
  items: MenuItem[];
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export const DEFAULT_MENU_CONTENT: MenuContent = {
  items: [
    { id: "home", labelFr: "Accueil", labelEn: "Home", labelAr: "الرئيسية", href: "/[locale]", children: [] },
    { id: "fma", labelFr: "La FMA", labelEn: "The FMA", labelAr: "الاتحاد", href: "/[locale]/la-fma", children: [] },
    {
      id: "publications",
      labelFr: "Publications",
      labelEn: "Publications",
      labelAr: "المنشورات",
      href: "/[locale]/publications?type=chiffres-cles",
      children: [
        { id: "keyFigures", labelFr: "Chiffres clés", labelEn: "Key Figures", labelAr: "أرقام رئيسية", href: "/[locale]/publications?type=chiffres-cles" },
        { id: "highlights", labelFr: "Faits marquants", labelEn: "Highlights", labelAr: "أبرز الأحداث", href: "/[locale]/publications?type=faits-marquants" },
        { id: "newsletter_magazine", labelFr: "Le courrier de l'assurance", labelEn: "Insurance Newsletter", labelAr: "نشرة التأمين", href: "/[locale]/publications?type=courrier" },
        { id: "news", labelFr: "Actualités", labelEn: "News", labelAr: "الأخبار", href: "/[locale]/actualites" },
      ],
    },
    {
      id: "discover",
      labelFr: "Découvrir le secteur",
      labelEn: "Discover the Sector",
      labelAr: "اكتشف القطاع",
      href: "/[locale]/decouvrir-le-secteur",
      children: [
        { id: "conventions", labelFr: "Conventions professionnelles", labelEn: "Professional Conventions", labelAr: "الاتفاقيات المهنية", href: "/[locale]/decouvrir-le-secteur/conventions" },
        { id: "usefulLinks", labelFr: "Liens utiles", labelEn: "Useful Links", labelAr: "روابط مفيدة", href: "/[locale]/decouvrir-le-secteur/liens-utiles" },
        { id: "formations", labelFr: "Formations", labelEn: "Training", labelAr: "التدريبات", href: "/[locale]/decouvrir-le-secteur/formations" },
        { id: "vocabulary", labelFr: "Vocabulaire utile", labelEn: "Useful Vocabulary", labelAr: "المعجم التأميني", href: "/[locale]/decouvrir-le-secteur/vocabulaire" },
      ],
    },
    { id: "individuals", labelFr: "Particuliers", labelEn: "Individuals", labelAr: "الأفراد", href: "/[locale]/particuliers", children: [] },
    { id: "businesses", labelFr: "Entreprises & Professionnels", labelEn: "Businesses & Professionals", labelAr: "المؤسسات والمهنيون", href: "/[locale]/entreprises", children: [] },
    { id: "contact", labelFr: "Contact", labelEn: "Contact", labelAr: "اتصل بنا", href: "/[locale]/contact", children: [] },
  ],
};

export function createEmptyMenuItem(): MenuItem {
  return { id: uid(), labelFr: "", labelEn: "", labelAr: "", href: "", children: [] };
}

export function createEmptyMenuChild(): MenuChild {
  return { id: uid(), labelFr: "", labelEn: "", labelAr: "", href: "" };
}

export function resolveHref(href: string, locale: string): string {
  return href.replace(/\[locale\]/g, locale);
}

function strLabel(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeMenuChild(
  input: unknown,
  fallback?: MenuChild
): MenuChild | null {
  if (!input || typeof input !== "object") return fallback ?? null;
  const d = input as Partial<MenuChild>;
  const id = typeof d.id === "string" && d.id ? d.id : fallback?.id;
  if (!id) return null;

  const labelFr = strLabel(d.labelFr, fallback?.labelFr ?? "");
  return {
    id,
    labelFr,
    labelEn: strLabel(d.labelEn, fallback?.labelEn ?? labelFr),
    labelAr: strLabel(d.labelAr, fallback?.labelAr ?? labelFr),
    href: typeof d.href === "string" ? d.href : fallback?.href ?? "",
  };
}

function normalizeMenuItem(input: unknown, fallback?: MenuItem): MenuItem | null {
  if (!input || typeof input !== "object") return fallback ?? null;
  const d = input as Partial<MenuItem>;
  const id = typeof d.id === "string" && d.id ? d.id : fallback?.id;
  if (!id) return null;

  const labelFr = strLabel(d.labelFr, fallback?.labelFr ?? "");
  const fallbackChildren = fallback?.children ?? [];
  const rawChildren = Array.isArray(d.children) ? d.children : [];
  const children = rawChildren.length
    ? rawChildren
        .map((child, index) =>
          normalizeMenuChild(child, fallbackChildren.find((c) => c.id === (child as MenuChild).id) ?? fallbackChildren[index])
        )
        .filter((child): child is MenuChild => child !== null)
    : fallbackChildren;

  return {
    id,
    labelFr,
    labelEn: strLabel(d.labelEn, fallback?.labelEn ?? labelFr),
    labelAr: strLabel(d.labelAr, fallback?.labelAr ?? labelFr),
    href: typeof d.href === "string" ? d.href : fallback?.href ?? "",
    children,
  };
}

/** Fusionne le menu BDD avec les libellés par défaut (notamment AR). */
export function normalizeMenuContent(input: unknown): MenuContent {
  if (!input || typeof input !== "object") return DEFAULT_MENU_CONTENT;
  const d = input as Partial<MenuContent>;
  if (!Array.isArray(d.items) || d.items.length === 0) return DEFAULT_MENU_CONTENT;

  const items = d.items
    .map((item) =>
      normalizeMenuItem(item, DEFAULT_MENU_CONTENT.items.find((f) => f.id === (item as MenuItem).id))
    )
    .filter((item): item is MenuItem => item !== null);

  return items.length > 0 ? { items } : DEFAULT_MENU_CONTENT;
}
