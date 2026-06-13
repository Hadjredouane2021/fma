import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import { NewsCard } from "@/components/common/NewsCard";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { buttonTabActive, buttonTabInactive } from "@/lib/button-styles";
import NewsFilter from "./_components/NewsFilter";
import type { Locale, Post } from "@/types";
import type { Metadata } from "next";

const HERO_KEY = DB_KEYS.ACTUALITES_HERO;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: `${t("title")} | FMA` };
}

export default async function ActualitesPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { category, q, page: pageStr } = await searchParams;
  const l = locale as Locale;
  const page = Number(pageStr) || 1;
  const limit = 9;

  const [posts, categories, total, heroRow] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "PUBLISHED", deletedAt: null,
        ...(category ? { category: { slug: category } } : {}),
        ...(q ? { OR: [{ titleFr: { contains: q } }, { titleEn: { contains: q } }, { contentFr: { contains: q } }] } : {}),
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }).catch(() => []),
    prisma.category.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.post.count({ where: { status: "PUBLISHED", deletedAt: null } }).catch(() => 0),
    prisma.setting.findUnique({ where: { key: HERO_KEY } }).catch(() => null),
  ]);
  const heroImage = heroRow?.value?.trim() || null;

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <PageHero locale={l}>
        {heroImage && <PageHeroImage src={heroImage} alt={l === "ar" ? "الأخبار" : l === "en" ? "News" : "Actualités"} />}
      </PageHero>

      <Section>
          <NewsFilter categories={categories} locale={l} currentCategory={category} currentQ={q} />

          {posts.length === 0 ? (
            <div className="text-center py-20 text-[var(--text-3)]">
              <div className="text-5xl mb-4">📰</div>
              <p>{l === "ar" ? "لم يتم العثور على أخبار" : l === "en" ? "No news found" : "Aucune actualité trouvée"}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {posts.map((post) => <NewsCard key={post.id} post={post as Post} locale={l} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a key={p} href={`?page=${p}${category ? `&category=${category}` : ""}${q ? `&q=${q}` : ""}`}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold",
                        p === page ? buttonTabActive : buttonTabInactive
                      )}>
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
      </Section>
    </div>
  );
}
