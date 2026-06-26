export type AdminThemeColors = {
  primary: string;
  accent: string;
  sidebar: string;
  background: string;
};

export type AdminThemeSettings = {
  presetId: string | null;
  light: AdminThemeColors;
  dark: AdminThemeColors;
};

export const DEFAULT_ADMIN_THEME: AdminThemeSettings = {
  presetId: "rose-violet",
  light: { primary: "#a84370", accent: "#f1c4e6", sidebar: "#f3e4f6", background: "#faf5fa" },
  dark: { primary: "#a3004c", accent: "#463753", sidebar: "#181117", background: "#221d27" },
};

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function hex(v: unknown, fb: string): string {
  return typeof v === "string" && HEX_RE.test(v.trim()) ? v.trim() : fb;
}

function normalizeColors(input: unknown, fb: AdminThemeColors): AdminThemeColors {
  const d = (input ?? {}) as Partial<AdminThemeColors>;
  return {
    primary: hex(d.primary, fb.primary),
    accent: hex(d.accent, fb.accent),
    sidebar: hex(d.sidebar, fb.sidebar),
    background: hex(d.background, fb.background),
  };
}

export function normalizeAdminTheme(input: unknown): AdminThemeSettings {
  if (!input || typeof input !== "object") return DEFAULT_ADMIN_THEME;
  const d = input as Partial<AdminThemeSettings>;
  return {
    presetId: typeof d.presetId === "string" ? d.presetId : null,
    light: normalizeColors(d.light, DEFAULT_ADMIN_THEME.light),
    dark: normalizeColors(d.dark, DEFAULT_ADMIN_THEME.dark),
  };
}

export type AdminThemePreset = {
  id: string;
  label: string;
  light: AdminThemeColors;
  dark: AdminThemeColors;
};

export const ADMIN_THEME_PRESETS: AdminThemePreset[] = [
  {
    id: "rose-violet",
    label: "Rose violet (par défaut)",
    light: DEFAULT_ADMIN_THEME.light,
    dark: DEFAULT_ADMIN_THEME.dark,
  },
  {
    id: "bleu-acier",
    label: "Bleu acier",
    light: { primary: "#2454a8", accent: "#cfe0f6", sidebar: "#e7eef8", background: "#f6f9fd" },
    dark: { primary: "#3f7fd6", accent: "#2a3f5c", sidebar: "#141d2b", background: "#1b2433" },
  },
  {
    id: "vert-sauge",
    label: "Vert sauge",
    light: { primary: "#3f6e52", accent: "#d6e8da", sidebar: "#eaf3ec", background: "#f6faf7" },
    dark: { primary: "#5fa97c", accent: "#2a3f31", sidebar: "#141f17", background: "#1b261e" },
  },
  {
    id: "ambre-neutre",
    label: "Ambre neutre",
    light: { primary: "#9a6a2f", accent: "#f3e1c4", sidebar: "#f7eedd", background: "#fbf7ef" },
    dark: { primary: "#c98f44", accent: "#473522", sidebar: "#221a12", background: "#2a2118" },
  },
];
