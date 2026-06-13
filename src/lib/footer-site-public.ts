import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";

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
};

export async function getFooterContent(): Promise<FooterContent> {
  const row = await prisma.setting.findUnique({ where: { key: DB_KEYS.FOOTER_CONTENT } }).catch(() => null);
  if (!row) return DEFAULT_FOOTER_CONTENT;
  try {
    const d = JSON.parse(row.value) as Partial<FooterContent>;
    const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
    return {
      descriptionFr: str(d.descriptionFr, DEFAULT_FOOTER_CONTENT.descriptionFr),
      descriptionEn: str(d.descriptionEn, DEFAULT_FOOTER_CONTENT.descriptionEn),
      descriptionAr: str(d.descriptionAr, DEFAULT_FOOTER_CONTENT.descriptionAr),
      address: str(d.address, DEFAULT_FOOTER_CONTENT.address),
      phone: str(d.phone, DEFAULT_FOOTER_CONTENT.phone),
      email: str(d.email, DEFAULT_FOOTER_CONTENT.email),
      facebook: str(d.facebook, DEFAULT_FOOTER_CONTENT.facebook),
      linkedin: str(d.linkedin, DEFAULT_FOOTER_CONTENT.linkedin),
      twitter: str(d.twitter, DEFAULT_FOOTER_CONTENT.twitter),
      youtube: str(d.youtube, DEFAULT_FOOTER_CONTENT.youtube),
    };
  } catch {
    return DEFAULT_FOOTER_CONTENT;
  }
}
