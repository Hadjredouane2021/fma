import type { LocalizedString } from "@/lib/la-fma-site-public";
import { DB_KEYS } from "@/lib/db-keys";

export type ContactContent = {
  heroBadge: LocalizedString;
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  address: string;
  phone: string;
  email: string;
  hours: LocalizedString;
  mapEmbedUrl: string;
  formTitle: LocalizedString;
};

export const DEFAULT_CONTACT_CONTENT: ContactContent = {
  heroBadge: { fr: "Nous écrire", en: "Get in touch", ar: "اتصل بنا" },
  heroTitle: { fr: "Contactez-nous", en: "Contact Us", ar: "اتصل بنا" },
  heroSubtitle: {
    fr: "Notre équipe est à votre écoute",
    en: "Our team is here for you",
    ar: "فريقنا في خدمتك",
  },
  address: "83, Avenue des Forces Armées Royales\nCasablanca 20100, Maroc",
  phone: "+212 5 22 20 14 15 / +212 5 22 20 14 16",
  email: "contact@fma.org.ma",
  hours: {
    fr: "Lun – Ven : 09h00 – 17h00",
    en: "Mon – Fri: 09:00 – 17:00",
    ar: "الاثنين - الجمعة: 09:00 - 17:00",
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3322.843!2d-7.6191!3d33.5897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM1JzIyLjkiTiA3wrAzNycwOC43Ilc!5e0!3m2!1sfr!2sma!4v1234567890",
  formTitle: { fr: "Envoyer le message", en: "Send message", ar: "إرسال الرسالة" },
};

function localizedFallback(input: Partial<LocalizedString> | undefined, fallback: LocalizedString): LocalizedString {
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
  if (!input) return fallback;
  return {
    fr: str(input.fr, fallback.fr),
    en: str(input.en, fallback.en),
    ar: str(input.ar, fallback.ar),
  };
}

export function normalizeContactContent(input: unknown): ContactContent {
  if (!input || typeof input !== "object") return DEFAULT_CONTACT_CONTENT;
  const d = input as Partial<ContactContent>;
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
  return {
    heroBadge: localizedFallback(d.heroBadge, DEFAULT_CONTACT_CONTENT.heroBadge),
    heroTitle: localizedFallback(d.heroTitle, DEFAULT_CONTACT_CONTENT.heroTitle),
    heroSubtitle: localizedFallback(d.heroSubtitle, DEFAULT_CONTACT_CONTENT.heroSubtitle),
    address: str(d.address, DEFAULT_CONTACT_CONTENT.address),
    phone: str(d.phone, DEFAULT_CONTACT_CONTENT.phone),
    email: str(d.email, DEFAULT_CONTACT_CONTENT.email),
    hours: localizedFallback(d.hours, DEFAULT_CONTACT_CONTENT.hours),
    mapEmbedUrl: str(d.mapEmbedUrl, DEFAULT_CONTACT_CONTENT.mapEmbedUrl),
    formTitle: localizedFallback(d.formTitle, DEFAULT_CONTACT_CONTENT.formTitle),
  };
}

export async function getContactContent(): Promise<ContactContent> {
  const { prisma } = await import("@/lib/prisma");
  const row = await prisma.setting.findUnique({ where: { key: DB_KEYS.CONTACT_CONTENT } }).catch(() => null);
  if (!row) return DEFAULT_CONTACT_CONTENT;
  try {
    return normalizeContactContent(JSON.parse(row.value));
  } catch {
    return DEFAULT_CONTACT_CONTENT;
  }
}
