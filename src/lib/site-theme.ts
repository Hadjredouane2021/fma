import { FMA_BRAND_COLORS, FMA_HEX } from "./fma-brand-colors";

export type SiteThemeColors = {
  brand: string;
  blue: string;
  mauve: string;
  gold: string;
  graphite: string;
  pale: string;
};

export type SiteThemeSettings = {
  presetId: string | null;
  light: SiteThemeColors;
  dark: SiteThemeColors;
};

export const DEFAULT_SITE_THEME: SiteThemeSettings = {
  presetId: "classique-fma",
  light: { ...FMA_BRAND_COLORS },
  dark: { brand: "#e07a96", blue: "#8ec4e8", mauve: "#b2aec2", gold: "#d4c4b8", graphite: "#a8a8a6", pale: "#3a4a5a" },
};

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function hex(v: unknown, fb: string): string {
  return typeof v === "string" && HEX_RE.test(v.trim()) ? v.trim() : fb;
}

function normalizeColors(input: unknown, fb: SiteThemeColors): SiteThemeColors {
  const d = (input ?? {}) as Partial<SiteThemeColors>;
  return {
    brand: hex(d.brand, fb.brand),
    blue: hex(d.blue, fb.blue),
    mauve: hex(d.mauve, fb.mauve),
    gold: hex(d.gold, fb.gold),
    graphite: hex(d.graphite, fb.graphite),
    pale: hex(d.pale, fb.pale),
  };
}

export function normalizeSiteTheme(input: unknown): SiteThemeSettings {
  if (!input || typeof input !== "object") return DEFAULT_SITE_THEME;
  const d = input as Partial<SiteThemeSettings>;
  return {
    presetId: typeof d.presetId === "string" ? d.presetId : null,
    light: normalizeColors(d.light, DEFAULT_SITE_THEME.light),
    dark: normalizeColors(d.dark, DEFAULT_SITE_THEME.dark),
  };
}

export type SiteThemePreset = {
  id: string;
  label: string;
  light: SiteThemeColors;
  dark: SiteThemeColors;
};

export const SITE_THEME_PRESETS: SiteThemePreset[] = [
  {
    id: "classique-fma",
    label: "Classique FMA",
    light: DEFAULT_SITE_THEME.light,
    dark: DEFAULT_SITE_THEME.dark,
  },
  {
    id: "ocean-corporate",
    label: "Océan corporate",
    light: { brand: "#1d4ed8", blue: "#0891b2", mauve: "#64748b", gold: "#b8a369", graphite: "#475569", pale: "#cfe6ee" },
    dark: { brand: "#5b8def", blue: "#38bdf8", mauve: "#94a3b8", gold: "#d8c79a", graphite: "#a8b4c2", pale: "#1f3a44" },
  },
  {
    id: "emeraude-institutionnel",
    label: "Émeraude institutionnel",
    light: { brand: "#0f6e4f", blue: "#2c8c7a", mauve: "#7c8a8a", gold: "#bfa14a", graphite: "#4a5650", pale: "#cfe6dd" },
    dark: { brand: "#3fbf8e", blue: "#52c9b3", mauve: "#a3b3b3", gold: "#e3cd7a", graphite: "#a9b6b0", pale: "#1f3a32" },
  },
  {
    id: "ardoise-premium",
    label: "Ardoise premium",
    light: { brand: "#4b3f72", blue: "#3a7bab", mauve: "#8b7e9e", gold: "#bfa98a", graphite: "#544c63", pale: "#d6d0e3" },
    dark: { brand: "#8d7ec9", blue: "#8ec4e8", mauve: "#b9aecb", gold: "#dccda9", graphite: "#b3acc0", pale: "#352f44" },
  },
];
