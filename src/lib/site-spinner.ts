import { DB_KEYS } from "@/lib/db-keys";

export type SiteSpinnerSettings = {
  imageUrl: string;
};

export const DEFAULT_SITE_SPINNER: SiteSpinnerSettings = {
  imageUrl: "/logo-fma-spinner.png",
};

export function normalizeSiteSpinner(input: unknown): SiteSpinnerSettings {
  if (!input || typeof input !== "object") return DEFAULT_SITE_SPINNER;
  const d = input as Partial<SiteSpinnerSettings>;
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
  return {
    imageUrl: str(d.imageUrl, DEFAULT_SITE_SPINNER.imageUrl),
  };
}

export async function getSiteSpinner(): Promise<SiteSpinnerSettings> {
  const { prisma } = await import("@/lib/prisma");
  const row = await prisma.setting.findUnique({ where: { key: DB_KEYS.SITE_SPINNER } }).catch(() => null);
  if (!row) return DEFAULT_SITE_SPINNER;
  try {
    return normalizeSiteSpinner(JSON.parse(row.value));
  } catch {
    return DEFAULT_SITE_SPINNER;
  }
}

export function spinnerImageUnoptimized(url: string): boolean {
  return url.startsWith("/uploads") || /\.svg(\?|#|$)/i.test(url);
}
