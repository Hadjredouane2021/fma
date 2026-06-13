import { cn } from "@/lib/utils";

/** Carte plate — bordure légère, sans relief */
export const glassCard = "glass-liquid rounded-2xl";
export const glassCardSm = "glass-liquid rounded-xl";
export const glassCardLg = "glass-liquid rounded-3xl";

/** Contenu au-dessus des reflets glass */
export const glassContent = "relative z-10";

/** Petite tuile icône glass */
export const glassIconTile =
  "glass-panel rounded-xl flex items-center justify-center flex-shrink-0";

export function glassCardClass(...extra: (string | false | undefined)[]) {
  return cn(glassCard, ...extra);
}
