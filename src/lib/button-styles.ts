import { cn } from "@/lib/utils";

/** Classes de base partagées par tous les boutons (focus, disabled, transition). */
export const buttonBase =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--brand)_45%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

export const buttonPrimary = cn(
  "text-white",
  "bg-[var(--brand)] hover:brightness-[0.92]",
  "shadow-[0_4px_16px_color-mix(in_srgb,var(--brand)_32%,transparent)]",
  "dark:bg-gradient-to-br dark:from-[var(--brand)] dark:to-[var(--blue)]",
  "dark:hover:brightness-110",
  "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_28px_color-mix(in_srgb,var(--blue)_30%,transparent)]"
);

export const buttonSecondary = cn(
  "text-white bg-[var(--blue)] hover:brightness-95",
  "shadow-[0_4px_14px_color-mix(in_srgb,var(--blue)_28%,transparent)]",
  "dark:bg-gradient-to-br dark:from-[var(--blue)] dark:to-[var(--blue-light)] dark:hover:brightness-110"
);

export const buttonOutline = cn(
  "border-2 bg-transparent",
  "border-[color-mix(in_srgb,var(--brand)_55%,var(--border))] text-[var(--brand)]",
  "hover:bg-[var(--brand)] hover:text-white hover:border-[var(--brand)]",
  "dark:border-[color-mix(in_srgb,var(--blue)_45%,var(--border))] dark:text-[var(--blue)]",
  "dark:hover:bg-[var(--blue)] dark:hover:text-white dark:hover:border-[var(--blue)]"
);

export const buttonGhost = "text-[var(--text-1)] hover:bg-[var(--hover-bg)]";

export const buttonGold =
  "bg-gradient-to-br from-gold to-gold/90 text-white hover:brightness-105 shadow-md";

export const buttonDangerGhost = cn(
  "text-[var(--text-3)]",
  "hover:bg-red-50 hover:text-red-500",
  "dark:hover:bg-red-950/40 dark:hover:text-red-400"
);

export const buttonTabActive = cn(buttonPrimary, "shadow-sm");

export const buttonTabInactive = cn(
  "bg-[var(--bg-surface)] text-[var(--text-2)] border border-[var(--border)]",
  "hover:bg-[var(--bg-alt)] hover:text-[var(--text-1)] transition-all",
  "dark:hover:border-[color-mix(in_srgb,var(--blue)_25%,var(--border))]"
);

export const buttonFilterActive = cn(buttonPrimary, "border border-transparent");

export const buttonFilterInactive = cn(
  "bg-[var(--bg-surface)] text-[var(--text-2)] border border-[var(--border)]",
  "hover:border-[color-mix(in_srgb,var(--brand)_30%,var(--border))] hover:bg-[var(--bg-alt)] hover:text-[var(--text-1)] transition-colors",
  "dark:hover:border-[color-mix(in_srgb,var(--blue)_28%,var(--border))]"
);

/** Bouton outline pour labels de téléversement (admin). */
export const buttonUploadLabel = cn(
  buttonOutline,
  "cursor-pointer shrink-0 whitespace-nowrap rounded-xl px-4 py-3 text-sm"
);

/** État actif toolbar éditeur riche. */
export const buttonToolbarActive = cn(buttonPrimary, "rounded-lg p-1.5 shadow-none");

export const buttonToolbarInactive = cn(
  "rounded-lg p-1.5 text-[var(--text-2)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-1)]"
);

/** Sélecteur compact (langue, thème, pagination carrée). */
export const buttonSegmentActive = cn(buttonTabActive, "rounded-lg text-xs font-medium");

export const buttonSegmentInactive = cn(
  buttonTabInactive,
  "rounded-lg text-xs font-medium hover:bg-[var(--hover-bg)]"
);

export const buttonSizes = {
  pill: {
    sm: "px-5 py-2 text-sm rounded-full",
    md: "px-6 py-2.5 text-sm rounded-full",
    lg: "px-8 py-3.5 text-base rounded-full min-h-[3rem]",
  },
  rounded: {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-8 py-3.5 text-base rounded-xl min-h-[3rem]",
  },
} as const;

export type ButtonShape = keyof typeof buttonSizes;
export type ButtonSize = keyof typeof buttonSizes.pill;
