import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localizedText } from "@/lib/localized-content";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/common/PageHero";
import { SectionBackground } from "@/components/common/SectionBackground";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/types";

export default async function RecherchePage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  const l = locale as Locale;

  let posts: { id: string; slug: string; titleFr: string; titleEn?: string | null; titleAr?: string | null; excerptFr?: string | null; publishedAt?: Date | null; createdAt: Date }[] = [];
  let publications: { id: string; slug: string; titleFr: string; titleEn?: string | null; titleAr?: string | null; type: string; year?: number | null }[] = [];

  if (q && q.length >= 2) {
    [posts, publications] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED", deletedAt: null, OR: [{ titleFr: { contains: q } }, { titleEn: { contains: q } }, { titleAr: { contains: q } }, { excerptFr: { contains: q } }] },
        select: { id: true, slug: true, titleFr: true, titleEn: true, titleAr: true, excerptFr: true, publishedAt: true, createdAt: true },
        take: 10,
      }),
      prisma.publication.findMany({
        where: { status: "PUBLISHED", deletedAt: null, OR: [{ titleFr: { contains: q } }, { titleEn: { contains: q } }, { titleAr: { contains: q } }, { descriptionFr: { contains: q } }] },
        select: { id: true, slug: true, titleFr: true, titleEn: true, titleAr: true, type: true, year: true },
        take: 10,
      }),
    ]).catch(() => [[], []]);
  }

  const total = posts.length + publications.length;

  return (
    <SectionBackground id="recherche">
      <PageHero locale={l}>
        <form method="get" className="relative mt-4 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-3)]" />
          <input
            name="q" type="text" defaultValue={q || ""}
            placeholder={l === "ar" ? "ابحث في الموقع..." : l === "en" ? "Search the site..." : "Rechercher sur le site..."}
            className="form-field pl-12 pr-28 py-3.5 rounded-xl shadow-sm"
          />
          <Button type="submit" variant="primary" shape="rounded" size="sm" className="absolute right-3 top-1/2 -translate-y-1/2">
            {l === "ar" ? "بحث" : l === "en" ? "Search" : "Chercher"}
          </Button>
        </form>
      </PageHero>

      <Section containerClassName="max-w-3xl">
          {q && (
            <p className="text-[var(--text-2)] mb-8 text-sm">
              <strong className="text-primary">{total}</strong> {l === "ar" ? "نتيجة لـ" : l === "en" ? "result(s) for" : "résultat(s) pour"} <strong className="text-primary">"{q}"</strong>
            </p>
          )}

          {posts.length > 0 && (
            <div className="mb-10">
              <h2 className="text-base font-bold text-primary mb-4 uppercase tracking-wide text-xs opacity-60">
                {l === "ar" ? "الأخبار" : l === "en" ? "News" : "Actualités"}
              </h2>
              <div className="space-y-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/${locale}/actualites/${post.slug}`} className="block glass-liquid rounded-2xl p-5 card-hover">
                    <h3 className="relative z-10 font-bold text-primary mb-1 hover:text-gold transition-colors">
                      {localizedText({ fr: post.titleFr, en: post.titleEn, ar: post.titleAr }, l)}
                    </h3>
                    {post.excerptFr && <p className="relative z-10 text-sm text-[var(--text-2)] line-clamp-2">{post.excerptFr}</p>}
                    <p className="relative z-10 text-xs text-[var(--text-3)] mt-2">{formatDate(post.publishedAt || post.createdAt, l)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {publications.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-primary mb-4 uppercase tracking-wide text-xs opacity-60">
                {l === "ar" ? "المنشورات" : l === "en" ? "Publications" : "Publications"}
              </h2>
              <div className="space-y-3">
                {publications.map((pub) => (
                  <Link key={pub.id} href={`/${locale}/publications`} className="block glass-liquid rounded-2xl p-5 card-hover">
                    <h3 className="relative z-10 font-bold text-primary mb-1">
                      {localizedText({ fr: pub.titleFr, en: pub.titleEn, ar: pub.titleAr }, l)}
                    </h3>
                    <p className="relative z-10 text-xs text-[var(--text-3)] mt-1">{pub.type} {pub.year ? `• ${pub.year}` : ""}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {q && total === 0 && (
            <div className="text-center py-16 text-[var(--text-3)]">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>{l === "ar" ? "لم يتم العثور على نتائج" : l === "en" ? "No results found" : "Aucun résultat trouvé"}</p>
            </div>
          )}

          {!q && (
            <div className="text-center py-16 text-[var(--text-3)]">
              <Search className="w-14 h-14 mx-auto mb-4 opacity-30" />
              <p className="text-[var(--text-3)]">{l === "ar" ? "أدخل كلمة للبحث" : l === "en" ? "Enter a search term" : "Saisissez un terme de recherche"}</p>
            </div>
          )}
      </Section>
    </SectionBackground>
  );
}
