import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const LOCALES = ["fr", "en", "ar"];

const STATIC_PAGES = [
  "", "/la-fma", "/actualites", "/publications", "/decouvrir-le-secteur",
  "/decouvrir-le-secteur/conventions", "/decouvrir-le-secteur/formations",
  "/decouvrir-le-secteur/liens-utiles", "/decouvrir-le-secteur/vocabulaire",
  "/particuliers", "/entreprises", "/contact", "/recherche",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const locale of LOCALES) {
    for (const page of STATIC_PAGES) {
      entries.push({
        url: `${BASE}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}${page}`])),
        },
      });
    }
  }

  // Dynamic posts
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true, updatedAt: true },
  }).catch(() => []);

  for (const post of posts) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/actualites/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
