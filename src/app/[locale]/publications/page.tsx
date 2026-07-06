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
  dbKeyForGallery,
  isGalleryCategory,
  isFolderGalleryCategory,
  parseGalleryData,
} from "@/lib/galleries";
import { localizedText } from "@/lib/localized-content";
import {
  parsePublicationsHeroImagesFromSetting,
  publicationsHeroImageUrl,
} from "@/lib/publications-hero-images";
import type { Locale, Publication } from "@/types";
import type { Metadata } from "next";

const DEFAULT_PUBLICATION_TYPE = "chiffres-cles";

const HERO_KEY = DB_KEYS.PUBLICATIONS_HERO;

function publicationTypeTitle(t: (key: string) => string, type: string): string {
  switch (type) {
    case "chiffres-cles":
      return t("keyFigures");
    case "faits-marquants":
      return t("highlights");
    case "courrier":
      return t("magazine");
    case "interventions-fma":
      return t("interventionsFma");
    case "reseaux-sociaux":
      return t("socialMedia");
    default:
      return type;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { type } = await searchParams;
  const t = await getTranslations({ locale, namespace: "publications" });
  const title = type ? publicationTypeTitle(t, type) : t("keyFigures");
  return { title: `${title} | FMA` };
}

export default async function PublicationsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; year?: string }>;
}) {
  const { locale } = await params;
  const { type: typeParam, year } = await searchParams;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "publications" });

  if (!typeParam) {
    const qs = new URLSearchParams({ type: DEFAULT_PUBLICATION_TYPE });
    if (year) qs.set("year", year);
    redirect(`/${locale}/publications?${qs.toString()}`);
  }

  const type = typeParam;

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
            status: "PUBLISHED",
            deletedAt: null,
            type: publicationType!,
            ...(year ? { year: Number(year) } : {}),
          },
          orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
        }).catch(() => []),
    prisma.setting.findUnique({ where: { key: HERO_KEY } }).catch(() => null),
    galleryCategory
      ? prisma.setting.findUnique({ where: { key: dbKeyForGallery(galleryCategory) } }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const heroImages = parsePublicationsHeroImagesFromSetting(heroRow?.value);
  const activeHeroImage = publicationsHeroImageUrl(heroImages, type, l);

  const gallery = galleryCategory ? parseGalleryData(galleryRow?.value, galleryCategory) : null;

  const heroTitle = gallery
    ? localizedText({ fr: gallery.title.fr, en: gallery.title.en, ar: gallery.title.ar }, l)
    : publicationTypeTitle(t, type);

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
                allLabel={t("allYears")}
                ariaLabel={t("filterByYear")}
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
              <GalleryGrid items={gallery.items} locale={l} />
            )
          ) : (
            <div className="text-center py-20 text-[var(--text-3)]">
              <div className="text-5xl mb-4">🖼️</div>
              <p>{t("noImages")}</p>
            </div>
          )
        ) : (
          <>
            {publications.length === 0 ? (
              <div className="text-center py-20 text-[var(--text-3)]">
                <div className="text-5xl mb-4">📄</div>
                <p>{t("noPublications")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-3 xl:gap-4">
                {publications.map((pub) => <PublicationCard key={pub.id} publication={pub as Publication} locale={l} />)}
              </div>
            )}
          </>
        )}
      </Section>
    </SectionBackground>
  );
}
