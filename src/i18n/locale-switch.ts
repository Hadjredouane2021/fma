import { routing } from "./routing";
import type { Locale } from "@/types";

/** Chemin URL localisé à partir du pathname interne next-intl (ex. `/actualites` → `/news` en EN). */
export function localizedPathForLocale(internalPathname: string, locale: Locale): string {
  const pathnames = routing.pathnames;
  if (!pathnames) return internalPathname;

  for (const [canonical, localized] of Object.entries(pathnames)) {
    if (typeof localized !== "object") continue;

    if (canonical === internalPathname) {
      return localized[locale] ?? internalPathname;
    }

    const dynamicPrefix = canonical.replace(/\[.+?\]/g, "");
    if (dynamicPrefix !== canonical && internalPathname.startsWith(dynamicPrefix)) {
      const suffix = internalPathname.slice(dynamicPrefix.length);
      const base = localized[locale] ?? dynamicPrefix;
      return `${base}${suffix}`;
    }
  }

  return internalPathname;
}

export function buildLocaleSwitchHref(
  locale: Locale,
  internalPathname: string,
  searchParams: URLSearchParams
): string {
  const path = localizedPathForLocale(internalPathname, locale);
  const qs = searchParams.toString();
  return `/${locale}${path}${qs ? `?${qs}` : ""}`;
}
