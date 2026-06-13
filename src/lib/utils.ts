import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Locale } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale
): string {
  const localeKey = `${field}${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof T;
  const frKey = `${field}Fr` as keyof T;
  return (obj[localeKey] as string) || (obj[frKey] as string) || "";
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | string, locale: Locale = "fr"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const localeMap = { fr: "fr-MA", en: "en-US", ar: "ar-MA" };
  return d.toLocaleDateString(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function buildMetaTitle(title: string, suffix = "FMA - Fédération Marocaine de l'Assurance"): string {
  return `${title} | ${suffix}`;
}

export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`;
}
