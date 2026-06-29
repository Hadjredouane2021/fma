import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { PublicationCard } from "@/components/common/PublicationCard";
import { GalleryGrid } from "@/components/common/GalleryGrid";
import { GalleryFolderList } from "@/components/common/GalleryFolderList";
import { PageHero } from "@/components/common/PageHero";
import { SectionBackground } from "@/components/common/SectionBackground";
import { Section } from "@/components/ui/Section";
import { Suspense } from "react";
import { PublicationYearFilter } from "@/components/common/PublicationTypeFilter";
import {
  GALLERY_CATEGORIES,
  GALLERY_CONFIG,
  dbKeyForGallery,
  isGalleryCategory,
  isFolderGalleryCategory,
  parseGalleryData,
} from "@/lib/galleries";
import type { Locale, Publication } from "@/types";
import type { Metadata } from "next";

const DEFAULT_PUBLICATION_TYPE = "chiffres-cles";

const TYPES = [
  { value: "chiffres-cles",   fr: "Chiffres clés",    en: "Key Figures",  ar: "أرقام رئيسية" },
  { value: "faits-marquants", fr: "Faits marquants",  en: "Highlights",   ar: "أبرز الأحداث" },
  { value: "courrier",        fr: "Le Courrier",       en: "Newsletter",   ar: "نشرة التأمين" },
];

const GALLERY_TABS = GALLERY_CATEGORIES.map((value) => ({ value, ...GALLERY_CONFIG[value].title }));

const HERO_KEY = DB_KEYS.PUBLICATIONS_HERO;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { type } = await searchParams;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "publications" });
  const pubType = TYPES.find((t_) => t_.value === type);
  const galleryType = GALLERY_TABS.find((t_) => t_.value === type);
  const title = pubType
    ? (l === "ar" ? pubType.ar : l === "en" ? pubType.en : pubType.fr)
    : galleryType
      ? (l === "ar" ? galleryType.ar : l === "en" ? galleryType.en : galleryType.fr)
      : t("keyFigures");
  return { title: `${title} | FMA` };
}

export default async function PublicationsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; year?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { type: typeParam, year, page: pageStr } = await searchParams;
  const l = locale as Locale;

  if (!typeParam) {
    const qs = new URLSearchParams({ type: DEFAULT_PUBLICATION_TYPE });
    if (year) qs.set("year", year);
    if (pageStr) qs.set("page", pageStr);
    redirect(`/${locale}/publications?${qs.toString()}`);
  }

  const type = typeParam;
  const page = Number(pageStr) || 1;
  const limit = 12;

  const galleryCategory = isGalleryCategory(type) ? type : null;
  const publicationType = galleryCategory ? null : type;

  const [years, publications, heroRow, galleryRow] = await Promise.all([
    galleryCategory
      ? Promise.resolve([])
      : prisma.publication.findMany({
          where: {
            status: "PUBLISHED",
            deletedAt: null,
            type: publicationType!,
          },
          select: { year: true },
          distinct: ["year"],
          orderBy: { year: "desc" },
        }).catch(() => []),
    galleryCategory
      ? Promise.resolve([])
      : prisma.publication.findMany({
          where: {
            status: "PUBLISHED", deletedAt: null,
            type: publicationType!,
            ...(year ? { year: Number(year) } : {}),
          },
          orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
          skip: (page - 1) * limit,
          take: limit,
        }).catch(() => []),
    prisma.setting.findUnique({ where: { key: HERO_KEY } }).catch(() => null),
    galleryCategory
      ? prisma.setting.findUnique({ where: { key: dbKeyForGallery(galleryCategory) } }).catch(() => null)
      : Promise.resolve(null),
  ]);

  // Hero image for the active type
  const heroImages: Record<string, string> = (() => {
    if (!heroRow) return {};
    try { return JSON.parse(heroRow.value); } catch { return {}; }
  })();
  const activeHeroImage = type && heroImages[type] ? heroImages[type] : null;

  const gallery = galleryCategory ? parseGalleryData(galleryRow?.value, galleryCategory) : null;

  // Active type label
  const activeType = TYPES.find((t_) => t_.value === type);
  const activeGalleryTab = GALLERY_TABS.find((t_) => t_.value === type);
  const heroTitle = activeType
    ? (l === "ar" ? activeType.ar : l === "en" ? activeType.en : activeType.fr)
    : activeGalleryTab
      ? (gallery?.title[l] ?? activeGalleryTab[l])
      : TYPES[0][l === "ar" ? "ar" : l === "en" ? "en" : "fr"];
  const yearFilterOptions = years
    .filter((y) => y.year)
    .map((y) => ({ value: String(y.year), label: String(y.year) }));

  const isFolderGallery = galleryCategory !== null && isFolderGalleryCategory(galleryCategory);
  const showYearFilter = !galleryCategory && yearFilterOptions.length > 0;

  return (
    <SectionBackground id="publications">
      <PageHero locale={l}>
        {activeHeroImage && (
          <PageHeroImage src={activeHeroImage} alt={heroTitle} />
        )}
      </PageHero>

      <Section padding={isFolderGallery ? "compact" : "default"}>
        {showYearFilter ? (
          <div
            className={
              isFolderGallery
                ? "mb-6 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-4"
                : "mb-10 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-4"
            }
          >
            <Suspense fallback={null}>
              <PublicationYearFilter
                options={yearFilterOptions}
                allLabel={l === "ar" ? "كل السنوات" : l === "en" ? "All years" : "Toutes les années"}
                ariaLabel={l === "ar" ? "تصفية حسب السنة" : l === "en" ? "Filter by year" : "Filtrer par année"}
                className="w-full sm:min-w-0 sm:flex-1 sm:max-w-md"
              />
            </Suspense>
          </div>
        ) : null}

        {galleryCategory ? (
          gallery && (gallery.folders?.some((f) => f.items.length > 0) || gallery.items.length > 0) ? (
            isFolderGallery && gallery.folders && gallery.folders.length > 0 ? (
              <GalleryFolderList folders={gallery.folders} locale={l} category={galleryCategory} />
            ) : (
              <GalleryGrid items={gallery.items} />
            )
          ) : (
            <div className="text-center py-20 text-[var(--text-3)]">
              <div className="text-5xl mb-4">🖼️</div>
              <p>{l === "ar" ? "لا توجد صور" : l === "en" ? "No images found" : "Aucune image trouvée"}</p>
            </div>
          )
        ) : (
          <>
            {publications.length === 0 ? (
              <div className="text-center py-20 text-[var(--text-3)]">
                <div className="text-5xl mb-4">📄</div>
                <p>{l === "ar" ? "لم يتم العثور على منشورات" : l === "en" ? "No publications found" : "Aucune publication trouvée"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {publications.map((pub) => <PublicationCard key={pub.id} publication={pub as Publication} locale={l} />)}
              </div>
            )}
          </>
        )}
      </Section>
    </SectionBackground>
  );
}
