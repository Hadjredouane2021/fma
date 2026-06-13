import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en", "ar"],
  defaultLocale: "fr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/la-fma": { fr: "/la-fma", en: "/the-fma", ar: "/la-fma" },
    "/actualites": { fr: "/actualites", en: "/news", ar: "/actualites" },
    "/actualites/[slug]": { fr: "/actualites/[slug]", en: "/news/[slug]", ar: "/actualites/[slug]" },
    "/publications": { fr: "/publications", en: "/publications", ar: "/publications" },
    "/decouvrir-le-secteur": { fr: "/decouvrir-le-secteur", en: "/discover-the-sector", ar: "/decouvrir-le-secteur" },
    "/particuliers": { fr: "/particuliers", en: "/individuals", ar: "/particuliers" },
    "/entreprises": { fr: "/entreprises", en: "/businesses", ar: "/entreprises" },
    "/contact": { fr: "/contact", en: "/contact", ar: "/contact" },
    "/recherche": { fr: "/recherche", en: "/search", ar: "/recherche" },
  },
});
