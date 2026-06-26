import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import {
  DEFAULT_FOOTER_CONTENT,
  type FooterContent,
} from "@/lib/footer-site-public";
import {
  DEFAULT_MENU_CONTENT,
  type MenuContent,
} from "@/lib/menu-site-public";
import {
  DEFAULT_SITE_LOGO,
  normalizeSiteLogo,
  type SiteLogoSettings,
} from "@/lib/site-logo";
import {
  DEFAULT_SITE_SPINNER,
  normalizeSiteSpinner,
  type SiteSpinnerSettings,
} from "@/lib/site-spinner";
import {
  DEFAULT_SITE_THEME,
  normalizeSiteTheme,
  type SiteThemeSettings,
} from "@/lib/site-theme";
import {
  DEFAULT_ADMIN_THEME,
  normalizeAdminTheme,
  type AdminThemeSettings,
} from "@/lib/admin-theme";

export const CACHE_TAGS = {
  layout: "site:layout-settings",
  chiffresCles: "site:chiffres-cles",
  particuliers: "site:particuliers",
  entreprises: "site:entreprises",
  formations: "site:formations",
  postsLatest: "site:posts-latest",
} as const;

function normalizeFooterContent(input: unknown): FooterContent {
  if (!input || typeof input !== "object") return DEFAULT_FOOTER_CONTENT;
  const d = input as Partial<FooterContent>;
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim() ? v.trim() : fb);
  return {
    descriptionFr: str(d.descriptionFr, DEFAULT_FOOTER_CONTENT.descriptionFr),
    descriptionEn: str(d.descriptionEn, DEFAULT_FOOTER_CONTENT.descriptionEn),
    descriptionAr: str(d.descriptionAr, DEFAULT_FOOTER_CONTENT.descriptionAr),
    address: str(d.address, DEFAULT_FOOTER_CONTENT.address),
    phone: str(d.phone, DEFAULT_FOOTER_CONTENT.phone),
    email: str(d.email, DEFAULT_FOOTER_CONTENT.email),
    facebook: str(d.facebook, DEFAULT_FOOTER_CONTENT.facebook),
    linkedin: str(d.linkedin, DEFAULT_FOOTER_CONTENT.linkedin),
    twitter: str(d.twitter, DEFAULT_FOOTER_CONTENT.twitter),
    youtube: str(d.youtube, DEFAULT_FOOTER_CONTENT.youtube),
    instagram: str(d.instagram, DEFAULT_FOOTER_CONTENT.instagram),
  };
}

function normalizeMenuContent(input: unknown): MenuContent {
  if (!input || typeof input !== "object") return DEFAULT_MENU_CONTENT;
  const d = input as Partial<MenuContent>;
  if (!Array.isArray(d.items) || d.items.length === 0) return DEFAULT_MENU_CONTENT;
  return d as MenuContent;
}

export type LayoutSiteSettings = {
  footer: FooterContent;
  menu: MenuContent;
  logo: SiteLogoSettings;
  spinner: SiteSpinnerSettings;
  theme: SiteThemeSettings;
  adminTheme: AdminThemeSettings;
};

const LAYOUT_KEYS = [
  DB_KEYS.FOOTER_CONTENT,
  DB_KEYS.MENU_CONTENT,
  DB_KEYS.SITE_LOGO,
  DB_KEYS.SITE_SPINNER,
  DB_KEYS.SITE_THEME,
  DB_KEYS.ADMIN_THEME,
] as const;

export const getLayoutSiteSettings = unstable_cache(
  async (): Promise<LayoutSiteSettings> => {
    try {
      const rows = await prisma.setting.findMany({
        where: { key: { in: [...LAYOUT_KEYS] } },
        select: { key: true, value: true },
      });
      const map = new Map(rows.map((row) => [row.key, row.value]));

      const parse = (key: string) => {
        const raw = map.get(key);
        if (!raw) return null;
        try {
          return JSON.parse(raw) as unknown;
        } catch {
          return null;
        }
      };

      return {
        footer: normalizeFooterContent(parse(DB_KEYS.FOOTER_CONTENT)),
        menu: normalizeMenuContent(parse(DB_KEYS.MENU_CONTENT)),
        logo: normalizeSiteLogo(parse(DB_KEYS.SITE_LOGO) ?? DEFAULT_SITE_LOGO),
        spinner: normalizeSiteSpinner(parse(DB_KEYS.SITE_SPINNER) ?? DEFAULT_SITE_SPINNER),
        theme: normalizeSiteTheme(parse(DB_KEYS.SITE_THEME) ?? DEFAULT_SITE_THEME),
        adminTheme: normalizeAdminTheme(parse(DB_KEYS.ADMIN_THEME) ?? DEFAULT_ADMIN_THEME),
      };
    } catch (error) {
      console.error("[site-settings-cache] getLayoutSiteSettings failed:", error);
      return {
        footer: DEFAULT_FOOTER_CONTENT,
        menu: DEFAULT_MENU_CONTENT,
        logo: DEFAULT_SITE_LOGO,
        spinner: DEFAULT_SITE_SPINNER,
        theme: DEFAULT_SITE_THEME,
        adminTheme: DEFAULT_ADMIN_THEME,
      };
    }
  },
  ["site-layout-settings:v2"],
  { tags: [CACHE_TAGS.layout], revalidate: 300 }
);

export function revalidateLayoutSettings() {
  revalidateTag(CACHE_TAGS.layout);
}

export function revalidateSiteTags(...tags: string[]) {
  for (const tag of tags) revalidateTag(tag);
}

export async function getFooterContent(): Promise<FooterContent> {
  const { footer } = await getLayoutSiteSettings();
  return footer;
}

export async function getMenuContent(): Promise<MenuContent> {
  const { menu } = await getLayoutSiteSettings();
  return menu;
}

export async function getSiteLogo(): Promise<SiteLogoSettings> {
  const { logo } = await getLayoutSiteSettings();
  return logo;
}

export async function getSiteSpinner(): Promise<SiteSpinnerSettings> {
  const { spinner } = await getLayoutSiteSettings();
  return spinner;
}

export async function getSiteTheme(): Promise<SiteThemeSettings> {
  const { theme } = await getLayoutSiteSettings();
  return theme;
}

export async function getAdminTheme(): Promise<AdminThemeSettings> {
  const { adminTheme } = await getLayoutSiteSettings();
  return adminTheme;
}
