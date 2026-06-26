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
