import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { BackToHomeLink } from "@/components/common/BackToHomeLink";
import { NewsCard } from "@/components/common/NewsCard";
import { Section } from "@/components/ui/Section";
import type { Locale, Post } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  if (!post) return { title: "Article non trouvé" };
  const title = locale === "ar" ? (post.titleAr || post.titleFr) : locale === "en" ? (post.titleEn || post.titleFr) : post.titleFr;
  return {
    title: `${post.seoTitle || title} | FMA`,
    description: post.seoDescription || undefined,
    openGraph: post.ogImage || post.featuredImage ? { images: [{ url: (post.ogImage || post.featuredImage)! }] } : undefined,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Locale;

  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: { category: true },
  }).catch(() => null);

  if (!post) notFound();

  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const related = await prisma.post.findMany({
    where: { status: "PUBLISHED", deletedAt: null, categoryId: post.categoryId, NOT: { id: post.id } },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  }).catch(() => []);

  const title = l === "ar" ? (post.titleAr || post.titleFr) : l === "en" ? (post.titleEn || post.titleFr) : post.titleFr;
  const content = l === "ar" ? (post.contentAr || post.contentFr) : l === "en" ? (post.contentEn || post.contentFr) : post.contentFr;

  return (
    <div>
      <div className="bg-[var(--bg)] pt-[var(--header-h)]">
        {post.featuredImage && (
          <div className="relative w-full overflow-hidden bg-[var(--bg-alt)] aspect-[3/2] sm:aspect-[16/9] max-h-[min(60vh,28rem)]">
            <Image
              src={post.featuredImage}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_25%]"
              unoptimized={post.featuredImage.startsWith("/uploads")}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/25 to-transparent" />
          </div>
        )}

        <div className="container-custom py-8">
          <BackToHomeLink locale={l} />
          <Link href={`/${locale}/actualites`} className="inline-flex items-center gap-2 text-sm text-[var(--text-3)] hover:text-primary mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {l === "ar" ? "العودة إلى الأخبار" : l === "en" ? "Back to news" : "Retour aux actualités"}
          </Link>

          {post.category && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-full">
                <Tag className="w-3 h-3" />
                {l === "ar" ? (post.category.nameAr || post.category.nameFr) : l === "en" ? (post.category.nameEn || post.category.nameFr) : post.category.nameFr}
              </span>
            </div>
          )}

          <h1 className="text-sm font-extrabold text-left align-bottom text-primary max-w-3xl leading-tight mb-4 font-['Segoe_UI_Symbol']">
            {title}
          </h1>

          <div className="flex items-center gap-5 text-[var(--text-3)] text-xs">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              {formatDate(post.publishedAt || post.createdAt, l)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-gold" />
              {post.views.toLocaleString()} {l === "ar" ? "مشاهدة" : l === "en" ? "views" : "vues"}
            </span>
          </div>
        </div>
      </div>

      <Section containerClassName="text-sm font-['Segoe_UI_Emoji']">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2">
            <div className="prose-fma" dangerouslySetInnerHTML={{ __html: content }} />
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="glass-liquid rounded-2xl p-6 card-hover">
              <h3 className="relative z-10 font-bold text-primary mb-4 text-sm">
                {l === "ar" ? "معلومات المقال" : l === "en" ? "Article info" : "Infos article"}
              </h3>
              <dl className="relative z-10 space-y-3 text-sm">
                <div>
                  <dt className="text-[var(--text-3)] text-xs mb-0.5">{l === "ar" ? "النشر" : l === "en" ? "Published" : "Publié le"}</dt>
                  <dd className="font-semibold text-primary">{formatDate(post.publishedAt || post.createdAt, l)}</dd>
                </div>
                {post.category && (
                  <div>
                    <dt className="text-[var(--text-3)] text-xs mb-0.5">{l === "ar" ? "الفئة" : l === "en" ? "Category" : "Catégorie"}</dt>
                    <dd className="font-semibold text-primary">{l === "ar" ? (post.category.nameAr || post.category.nameFr) : l === "en" ? (post.category.nameEn || post.category.nameFr) : post.category.nameFr}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[var(--text-3)] text-xs mb-0.5">{l === "ar" ? "المشاهدات" : l === "en" ? "Views" : "Vues"}</dt>
                  <dd className="font-semibold text-primary">{post.views.toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            {/* Share */}
            <div className="glass-liquid rounded-2xl p-6 card-hover">
              <h3 className="relative z-10 font-bold text-primary mb-3 text-sm">
                {l === "ar" ? "مشاركة" : l === "en" ? "Share" : "Partager"}
              </h3>
              <div className="relative z-10 flex gap-2">
                {["LinkedIn", "Twitter", "Facebook"].map((s) => (
                  <span key={s} className="glass-panel px-3 py-1.5 rounded-lg text-xs text-[var(--text-2)] cursor-pointer hover:border-primary/30 hover:text-primary transition-colors">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-primary mb-8 gold-accent">
              {l === "ar" ? "مقالات ذات صلة" : l === "en" ? "Related articles" : "Articles connexes"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {related.map((p) => <NewsCard key={p.id} post={p as Post} locale={l} />)}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
