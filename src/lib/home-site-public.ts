/** Constantes et helpers « page d'accueil » utilisables depuis des Client Components. */

export const HOME_KEY_FIGURES_MIN = 1;
export const HOME_KEY_FIGURES_MAX = 8;

export type HomeKeyFigureValueSource = "manual" | "contribution" | "revenue";

export type HomeKeyFigureShape = {
  value: string;
  suffix: string;
  label: { fr: string; en: string; ar: string };
  /** Manuelle = valeur/suffixe saisis ci-dessous ; contribution/revenue = ligne du tableau Chiffres clés. */
  valueSource: HomeKeyFigureValueSource;
  /** ID de la ligne dans Admin → Chiffres clés (ignoré si source manuelle). */
  chiffresClesRowId: string;
  /** Texte affiché en dépliant la carte (chevron). Vide = pas de détail. */
  description: { fr: string; en: string; ar: string };
  stackGroup?: { fr: string; en: string; ar: string };
};

export function createEmptyHomeKeyFigure(): HomeKeyFigureShape {
  return {
    value: "",
    suffix: "",
    label: { fr: "", en: "", ar: "" },
    valueSource: "manual",
    chiffresClesRowId: "",
    description: { fr: "", en: "", ar: "" },
    stackGroup: { fr: "", en: "", ar: "" },
  };
}

export type HomeGlobalFigureShape = {
  value: string;
  suffix: string;
  label: { fr: string; en: string; ar: string };
  description: { fr: string; en: string; ar: string };
  /** Manuelle = valeur/suffixe saisis ci-dessous ; contribution/revenue = ligne du tableau Chiffres clés. */
  valueSource: HomeKeyFigureValueSource;
  /** ID de la ligne dans Admin → Chiffres clés (ignoré si source manuelle). */
  chiffresClesRowId: string;
};

export function createEmptyHomeGlobalFigure(): HomeGlobalFigureShape {
  return {
    value: "",
    suffix: "",
    label: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "", ar: "" },
    valueSource: "manual",
    chiffresClesRowId: "",
  };
}
