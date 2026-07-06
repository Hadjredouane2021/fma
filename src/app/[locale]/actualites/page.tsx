import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { NewsCard } from "@/components/common/NewsCard";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Section } from "@/components/ui/Section";
import NewsFilter from "./_components/NewsFilter";
import { ActualitesPagination } from "./_components/ActualitesPagination";
import { SectionBackground } from "@/components/common/SectionBackground";
import {
  actualitesHeroImageUrl,
  parseActualitesHeroImageUrlsFromSetting,
} from "@/lib/actualites-hero-image";
import type { Locale, Post } from "@/types";
import type { Metadata } from "next";

const HERO_KEY = DB_KEYS.ACTUALITES_HERO;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: `${t("title")} | FMA` };
}

function pageSubtitle(locale: Locale) {
  if (locale === "ar") return "تابعوا أخبار قطاع التأمين في المغرب";
  if (locale === "en") return "Follow insurance sector news in Morocco";
  return "Suivez l'actualité du secteur des assurances au Maroc";
}

export default async function ActualitesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { category, q, page: pageStr } = await searchParams;
  const l = locale as Locale;
  const page = Number(pageStr) || 1;
  const limit = 9;

  const where = {
    status: "PUBLISHED" as const,
    deletedAt: null,
    ...(category ? { category: { slug: category } } : {}),
    ...(q ? { OR: [{ titleFr: { contains: q } }, { titleEn: { contains: q } }, { contentFr: { contains: q } }] } : {}),
  };

  const [posts, categories, total, heroRow, t] = await Promise.all([
    prisma.post
      .findMany({
        where,
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      })
      .catch(() => []),
    prisma.category.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.post.count({ where }).catch(() => 0),
    prisma.setting.findUnique({ where: { key: HERO_KEY } }).catch(() => null),
    getTranslations({ locale, namespace: "news" }),
  ]);

  const heroImages = parseActualitesHeroImageUrlsFromSetting(heroRow?.value);
  const heroImage = actualitesHeroImageUrl(heroImages, l);
  const totalPages = Math.ceil(total / limit);
  const showFeatured = page === 1 && !q && posts.length > 0;
  const featuredPost = showFeatured ? posts[0] : null;
  const gridPosts = showFeatured ? posts.slice(1) : posts;

  return (
    <SectionBackground id="actualites">
      <PageHero locale={l}>
        {heroImage ? (
          <PageHeroImage src={heroImage} alt={t("title")} />
        ) : null}
      </PageHero>

      <Section className="actualites-page">
        <SectionHeader title={t("title")} subtitle={pageSubtitle(l)} />

        <div className="mt-8 sm:mt-10">
          <NewsFilter
            categories={categories}
            locale={l}
            currentCategory={category}
            currentQ={q}
            resultCount={total}
          />
        </div>

        {posts.length === 0 ? (
          <div className="actualites-empty mt-10 px-6 py-16 text-center sm:mt-12">
            <div className="mb-4 text-5xl" aria-hidden>
              📰
            </div>
            <p className="text-[var(--text-2)]">{t("noResults")}</p>
          </div>
        ) : (
          <div className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
            {featuredPost ? (
              <NewsCard post={featuredPost as Post} locale={l} variant="featured" />
            ) : null}

            {gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {gridPosts.map((post) => (
                  <NewsCard key={post.id} post={post as Post} locale={l} />
                ))}
              </div>
            ) : null}

            <ActualitesPagination
              page={page}
              totalPages={totalPages}
              category={category}
              q={q}
              locale={locale}
            />
          </div>
        )}
      </Section>
    </SectionBackground>
  );
}
