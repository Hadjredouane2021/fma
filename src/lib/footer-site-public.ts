export interface FooterContent {
  descriptionFr: string;
  descriptionEn: string;
  descriptionAr: string;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  instagram: string;
}

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  descriptionFr: "L'organe représentatif des sociétés d'assurance et de réassurance au Maroc depuis 1958.",
  descriptionEn: "The representative body of insurance and reinsurance companies in Morocco since 1958.",
  descriptionAr: "الهيئة التمثيلية لشركات التأمين وإعادة التأمين في المغرب منذ 1958.",
  address: "83, Avenue des Forces Armées Royales\nCasablanca 20100, Maroc",
  phone: "+212 5 22 20 14 15",
  email: "contact@fma.org.ma",
  facebook: "https://facebook.com/fma.maroc",
  linkedin: "https://linkedin.com/company/fma-maroc",
  twitter: "https://twitter.com/fma_maroc",
  youtube: "https://youtube.com",
  instagram: "https://www.instagram.com/fma_maroc/",
};

/** Découpe plusieurs numéros (séparateurs |, retours ligne, ou enchaînement +212…). */
export function parseFooterPhones(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  return trimmed
    .split(/\s*\|\s*|\n+/)
    .flatMap((segment) =>
      segment
        .split(/(?=\+)/)
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
    )
    .filter(Boolean);
}

export function footerPhoneTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}
