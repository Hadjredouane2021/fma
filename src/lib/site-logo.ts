export type SiteLogoSettings = {
  imageUrl: string;
  /** Lien au clic — vide = page d'accueil */
  linkUrl: string;
};

export const DEFAULT_SITE_LOGO: SiteLogoSettings = {
  imageUrl: "/logo-fma-full.png",
  linkUrl: "",
};

export function normalizeSiteLogo(input: unknown): SiteLogoSettings {
  if (!input || typeof input !== "object") return DEFAULT_SITE_LOGO;
  const d = input as Partial<SiteLogoSettings>;
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
  return {
    imageUrl: str(d.imageUrl, DEFAULT_SITE_LOGO.imageUrl),
    linkUrl: str(d.linkUrl, DEFAULT_SITE_LOGO.linkUrl),
  };
}

export function resolveLogoHref(linkUrl: string, locale: string): string {
  if (linkUrl.trim()) return linkUrl.trim();
  return `/${locale}`;
}

export function isSiteLogoSvg(url: string): boolean {
  return /\.svg(\?|#|$)/i.test(url);
}

/** next/image : SVG et fichiers locaux uploadés */
export function siteLogoImageUnoptimized(url: string): boolean {
  return url.startsWith("/uploads") || isSiteLogoSvg(url);
}
