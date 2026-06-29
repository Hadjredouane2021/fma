export type SiteLogoSettings = {
  imageUrl: string;
  /** Logo affiché en mode sombre — vide = même image que le mode clair */
  imageUrlDark: string;
  /** Lien au clic — vide = page d'accueil */
  linkUrl: string;
};

export const DEFAULT_SITE_LOGO: SiteLogoSettings = {
  imageUrl: "/logo-fma-full.svg",
  imageUrlDark: "/logo-fma-dark.svg",
  linkUrl: "",
};

const DEFAULT_LIGHT_LOGOS = new Set([
  DEFAULT_SITE_LOGO.imageUrl,
  "/logo-fma-full.png",
]);

const DEFAULT_DARK_LOGOS = new Set([
  DEFAULT_SITE_LOGO.imageUrlDark,
  "/logo-fma-dark.png",
]);

/** Variante blanche d’un SVG uploadé (même viewBox que le logo clair). */
export function pairedDarkLogoUrl(lightUrl: string): string | null {
  if (!lightUrl.endsWith(".svg")) return null;
  if (lightUrl.startsWith("/uploads/")) {
    return lightUrl.replace(/\.svg$/i, "-dark.svg");
  }
  return null;
}

export function normalizeSiteLogo(input: unknown): SiteLogoSettings {
  if (!input || typeof input !== "object") return DEFAULT_SITE_LOGO;
  const d = input as Partial<SiteLogoSettings>;
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
  const strOptional = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const imageUrl = str(d.imageUrl, DEFAULT_SITE_LOGO.imageUrl);
  const imageUrlDarkRaw = strOptional(d.imageUrlDark);
  const imageUrlDark =
    imageUrlDarkRaw
    || (
      imageUrl === DEFAULT_SITE_LOGO.imageUrl || imageUrl === "/logo-fma-full.png"
        ? DEFAULT_SITE_LOGO.imageUrlDark
        : ""
    );
  return {
    imageUrl,
    imageUrlDark,
    linkUrl: strOptional(d.linkUrl),
  };
}

export function resolveSiteLogoSources(
  settings: Pick<SiteLogoSettings, "imageUrl" | "imageUrlDark">
): { light: string; dark: string } {
  const light = settings.imageUrl || DEFAULT_SITE_LOGO.imageUrl;
  let dark = settings.imageUrlDark || light;
  if (dark === "/logo-fma-dark.png") dark = "/logo-fma-dark.svg";

  // Logo clair personnalisé + logo sombre par défaut → variante -dark.svg (même proportions)
  if (DEFAULT_DARK_LOGOS.has(dark) && !DEFAULT_LIGHT_LOGOS.has(light)) {
    const paired = pairedDarkLogoUrl(light);
    if (paired) dark = paired;
  }

  return { light, dark };
}

export function resolveLogoHref(linkUrl: string, locale: string): string {
  if (linkUrl.trim()) return linkUrl.trim();
  return `/${locale}`;
}

export function isSiteLogoSvg(url: string): boolean {
  return /\.svg(\?|#|$)/i.test(url);
}

/** next/image : SVG, uploads et logos statiques FMA */
export function siteLogoImageUnoptimized(url: string): boolean {
  return url.startsWith("/uploads") || url.startsWith("/logo-fma") || isSiteLogoSvg(url);
}
