import { localizedText } from "@/lib/localized-content";
import type { Locale } from "@/types";

export interface FooterContent {
  descriptionFr: string;
  descriptionEn: string;
  descriptionAr: string;
  navigationTitleFr: string;
  navigationTitleEn: string;
  navigationTitleAr: string;
  usefulLinksTitleFr: string;
  usefulLinksTitleEn: string;
  usefulLinksTitleAr: string;
  contactTitleFr: string;
  contactTitleEn: string;
  contactTitleAr: string;
  addressFr: string;
  addressEn: string;
  addressAr: string;
  copyrightOrgFr: string;
  copyrightOrgEn: string;
  copyrightOrgAr: string;
  copyrightRightsFr: string;
  copyrightRightsEn: string;
  copyrightRightsAr: string;
  phone: string;
  email: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  instagram: string;
}

const DEFAULT_ADDRESS = "83, Avenue des Forces Armées Royales\nCasablanca 20100, Maroc";

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  descriptionFr: "L'organe représentatif des sociétés d'assurance et de réassurance au Maroc depuis 1958.",
  descriptionEn: "The representative body of insurance and reinsurance companies in Morocco since 1958.",
  descriptionAr: "الهيئة التمثيلية لشركات التأمين وإعادة التأمين في المغرب منذ 1958.",
  navigationTitleFr: "Navigation",
  navigationTitleEn: "Navigation",
  navigationTitleAr: "التنقل",
  usefulLinksTitleFr: "Liens utiles",
  usefulLinksTitleEn: "Useful links",
  usefulLinksTitleAr: "روابط مفيدة",
  contactTitleFr: "Contact",
  contactTitleEn: "Contact",
  contactTitleAr: "اتصل بنا",
  addressFr: DEFAULT_ADDRESS,
  addressEn: DEFAULT_ADDRESS,
  addressAr: DEFAULT_ADDRESS,
  copyrightOrgFr: "Fédération Marocaine de l'Assurance",
  copyrightOrgEn: "Moroccan Insurance Federation",
  copyrightOrgAr: "الاتحاد المغربي للتأمين",
  copyrightRightsFr: "Tous droits réservés",
  copyrightRightsEn: "All rights reserved",
  copyrightRightsAr: "جميع الحقوق محفوظة",
  phone: "+212 5 22 20 14 15",
  email: "contact@fma.org.ma",
  facebook: "https://facebook.com/fma.maroc",
  linkedin: "https://linkedin.com/company/fma-maroc",
  twitter: "https://twitter.com/fma_maroc",
  youtube: "https://youtube.com",
  instagram: "https://www.instagram.com/fma_maroc/",
};

export function normalizeFooterContent(input: unknown): FooterContent {
  if (!input || typeof input !== "object") return DEFAULT_FOOTER_CONTENT;
  const d = input as Partial<FooterContent> & { address?: string };
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
  const legacyAddress = str(d.address, DEFAULT_FOOTER_CONTENT.addressFr);

  return {
    descriptionFr: str(d.descriptionFr, DEFAULT_FOOTER_CONTENT.descriptionFr),
    descriptionEn: str(d.descriptionEn, DEFAULT_FOOTER_CONTENT.descriptionEn),
    descriptionAr: str(d.descriptionAr, DEFAULT_FOOTER_CONTENT.descriptionAr),
    navigationTitleFr: str(d.navigationTitleFr, DEFAULT_FOOTER_CONTENT.navigationTitleFr),
    navigationTitleEn: str(d.navigationTitleEn, DEFAULT_FOOTER_CONTENT.navigationTitleEn),
    navigationTitleAr: str(d.navigationTitleAr, DEFAULT_FOOTER_CONTENT.navigationTitleAr),
    usefulLinksTitleFr: str(d.usefulLinksTitleFr, DEFAULT_FOOTER_CONTENT.usefulLinksTitleFr),
    usefulLinksTitleEn: str(d.usefulLinksTitleEn, DEFAULT_FOOTER_CONTENT.usefulLinksTitleEn),
    usefulLinksTitleAr: str(d.usefulLinksTitleAr, DEFAULT_FOOTER_CONTENT.usefulLinksTitleAr),
    contactTitleFr: str(d.contactTitleFr, DEFAULT_FOOTER_CONTENT.contactTitleFr),
    contactTitleEn: str(d.contactTitleEn, DEFAULT_FOOTER_CONTENT.contactTitleEn),
    contactTitleAr: str(d.contactTitleAr, DEFAULT_FOOTER_CONTENT.contactTitleAr),
    addressFr: str(d.addressFr, legacyAddress),
    addressEn: str(d.addressEn, legacyAddress),
    addressAr: str(d.addressAr, legacyAddress),
    copyrightOrgFr: str(d.copyrightOrgFr, DEFAULT_FOOTER_CONTENT.copyrightOrgFr),
    copyrightOrgEn: str(d.copyrightOrgEn, DEFAULT_FOOTER_CONTENT.copyrightOrgEn),
    copyrightOrgAr: str(d.copyrightOrgAr, DEFAULT_FOOTER_CONTENT.copyrightOrgAr),
    copyrightRightsFr: str(d.copyrightRightsFr, DEFAULT_FOOTER_CONTENT.copyrightRightsFr),
    copyrightRightsEn: str(d.copyrightRightsEn, DEFAULT_FOOTER_CONTENT.copyrightRightsEn),
    copyrightRightsAr: str(d.copyrightRightsAr, DEFAULT_FOOTER_CONTENT.copyrightRightsAr),
    phone: str(d.phone, DEFAULT_FOOTER_CONTENT.phone),
    email: str(d.email, DEFAULT_FOOTER_CONTENT.email),
    facebook: str(d.facebook, DEFAULT_FOOTER_CONTENT.facebook),
    linkedin: str(d.linkedin, DEFAULT_FOOTER_CONTENT.linkedin),
    twitter: str(d.twitter, DEFAULT_FOOTER_CONTENT.twitter),
    youtube: str(d.youtube, DEFAULT_FOOTER_CONTENT.youtube),
    instagram: str(d.instagram, DEFAULT_FOOTER_CONTENT.instagram),
  };
}

export function footerDescription(content: FooterContent, locale: Locale): string {
  return localizedText(
    { fr: content.descriptionFr, en: content.descriptionEn, ar: content.descriptionAr },
    locale
  );
}

export function footerNavigationTitle(content: FooterContent, locale: Locale): string {
  return localizedText(
    { fr: content.navigationTitleFr, en: content.navigationTitleEn, ar: content.navigationTitleAr },
    locale
  );
}

export function footerUsefulLinksTitle(content: FooterContent, locale: Locale): string {
  return localizedText(
    { fr: content.usefulLinksTitleFr, en: content.usefulLinksTitleEn, ar: content.usefulLinksTitleAr },
    locale
  );
}

export function footerContactTitle(content: FooterContent, locale: Locale): string {
  return localizedText(
    { fr: content.contactTitleFr, en: content.contactTitleEn, ar: content.contactTitleAr },
    locale
  );
}

export function footerAddress(content: FooterContent, locale: Locale): string {
  return localizedText(
    { fr: content.addressFr, en: content.addressEn, ar: content.addressAr },
    locale
  );
}

export function footerCopyrightOrg(content: FooterContent, locale: Locale): string {
  return localizedText(
    { fr: content.copyrightOrgFr, en: content.copyrightOrgEn, ar: content.copyrightOrgAr },
    locale
  );
}

export function footerCopyrightRights(content: FooterContent, locale: Locale): string {
  return localizedText(
    { fr: content.copyrightRightsFr, en: content.copyrightRightsEn, ar: content.copyrightRightsAr },
    locale
  );
}

/** Ligne complète : © {année} {organisme}. {droits}. */
export function footerCopyrightLine(content: FooterContent, locale: Locale, year = new Date().getFullYear()): string {
  const org = footerCopyrightOrg(content, locale);
  const rights = footerCopyrightRights(content, locale);
  if (!org && !rights) return `© ${year}`;
  if (!rights) return `© ${year} ${org}.`;
  if (!org) return `© ${year} ${rights}.`;
  return `© ${year} ${org}. ${rights}.`;
}

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
