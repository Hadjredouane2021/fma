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
};

export function createEmptyHomeKeyFigure(): HomeKeyFigureShape {
  return {
    value: "",
    suffix: "",
    label: { fr: "", en: "", ar: "" },
    valueSource: "manual",
    chiffresClesRowId: "",
  };
}
