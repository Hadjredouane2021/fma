/**
 * Charte graphique FMA — couleurs officielles (RVB).
 * Source unique pour le site, Tailwind et les thèmes admin.
 */

export const FMA_RGB = {
  /** Principales */
  burgundy: [148, 31, 73] as const,
  mauve: [154, 150, 174] as const,
  graphite: [88, 88, 87] as const,
  /** Secondaires */
  taupe: [179, 153, 136] as const,
  blue: [58, 123, 171] as const,
  pale: [199, 216, 229] as const,
} as const;

function rgbToHex([r, g, b]: readonly [number, number, number]): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export const FMA_HEX = {
  burgundy: rgbToHex(FMA_RGB.burgundy),
  mauve: rgbToHex(FMA_RGB.mauve),
  graphite: rgbToHex(FMA_RGB.graphite),
  taupe: rgbToHex(FMA_RGB.taupe),
  blue: rgbToHex(FMA_RGB.blue),
  pale: rgbToHex(FMA_RGB.pale),
} as const;

/** Alias utilisés par le thème dynamique (SiteThemeStyle). */
export const FMA_BRAND_COLORS = {
  brand: FMA_HEX.burgundy,
  mauve: FMA_HEX.mauve,
  graphite: FMA_HEX.graphite,
  gold: FMA_HEX.taupe,
  blue: FMA_HEX.blue,
  pale: FMA_HEX.pale,
} as const;

export type FmaBrandColorKey = keyof typeof FMA_BRAND_COLORS;
