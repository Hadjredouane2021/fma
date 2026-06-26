import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ArrowUpRight } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { glassCardLg, glassContent } from "@/lib/surface-styles";
import { buttonFilterInactive } from "@/lib/button-styles";
import { SECTION_HEADER_TITLE_CLASSES } from "@/components/common/SectionHeader";
import type { Post, Locale } from "@/types";

function localizedTitle(post: Post, locale: Locale) {
  return locale === "ar" ? (post.titleAr || post.titleFr) : locale === "en" ? (post.titleEn || post.titleFr) : post.titleFr;
}

function localizedCategory(post: Post, locale: Locale) {
  if (!post.category) return null;
  return locale === "ar"
    ? post.category.nameAr || post.category.nameFr
    : locale === "en"
      ? post.category.nameEn || post.category.nameFr
      : post.category.nameFr;
}

export function LatestNewsSection({
  posts,
  locale,
  title,
  subtitle,
  viewAllLabel,
  viewAllHref,
}: {
  posts: Post[];
  locale: Locale;
  title: string;
  subtitle?: string;
  viewAllLabel: string;
  viewAllHref: string;
}) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;
  const sideArticles = rest.slice(0, 4);

  const featuredTitle = localizedTitle(featured, locale);
  const featuredCategory = localizedCategory(featured, locale);
  const featuredHref = `/${locale}/actualites/${featured.slug}`;

  return (
    <section className="container-custom py-10 sm:py-16 lg:py-24">
      <div className="flex flex-col gap-6 sm:gap-8 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-10 lg:mb-14">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand)] mb-2 sm:mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            {locale === "ar" ? "آخر الأخبار" : locale === "en" ? "News" : "Actualités"}
          </span>
          <h2 className={SECTION_HEADER_TITLE_CLASSES}>
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 sm:mt-3 max-w-xl text-[var(--text-2)] text-[11px] sm:text-sm leading-relaxed text-justify">{subtitle}</p>
          )}
        </div>
        <Link
          href={viewAllHref}
          className={cn(buttonFilterInactive, "hidden md:inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm hover:gap-3 hover:text-[var(--brand)]")}
        >
          {viewAllLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Featured article */}
        <Link href={featuredHref} className="group lg:col-span-7 xl:col-span-8 block">
          <article className={cn("relative overflow-hidden h-full flex flex-col", glassCardLg)}>
            <div className={cn("relative aspect-[2/1] sm:aspect-[21/9] overflow-hidden bg-[var(--bg-alt)]", glassContent)}>
              {featured.featuredImage ? (
                <Image
                  src={featured.featuredImage}
                  alt={featuredTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  className="object-cover object-[center_25%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-alt)] to-[var(--bg-surface)]">
                  <span className="font-display text-[var(--text-3)] text-7xl font-bold opacity-[0.12]">FMA</span>
                </div>
              )}

              {featuredCategory && (
                <div className="absolute top-3 left-3 sm:top-5 sm:left-5">
                  <span className="inline-flex items-center rounded-full bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] text-[var(--text-1)] text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-sm">
                    {featuredCategory}
                  </span>
                </div>
              )}
            </div>

            <div className={cn("flex flex-1 flex-col p-3.5 sm:p-6 lg:p-8", glassContent)}>
              <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--text-3)] sm:mb-3 sm:text-[11px]">
                <Calendar className="h-3 w-3 shrink-0 opacity-70 sm:h-3.5 sm:w-3.5" />
                {formatDate(featured.publishedAt || featured.createdAt, locale)}
              </div>
              <h5 className="mb-1.5 line-clamp-2 text-justify font-display text-[17px] font-bold leading-snug tracking-tight text-[var(--text-1)] transition-colors group-hover:text-primary sm:mb-3">
                {featuredTitle}
              </h5>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-accent transition-all group-hover:gap-3 sm:mt-4 sm:text-sm">
                <span>{locale === "ar" ? "اقرأ المزيد" : locale === "en" ? "Read more" : "Lire la suite"}</span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
          </article>
        </Link>

        {/* Side list of articles */}
        {sideArticles.length > 0 && (
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 sm:gap-4">
            {sideArticles.map((post) => {
              const postTitle = localizedTitle(post, locale);
              const postCategory = localizedCategory(post, locale);
              const href = `/${locale}/actualites/${post.slug}`;
              return (
                <Link key={post.id} href={href} className="group block">
                  <article className={cn("relative flex items-center gap-3 overflow-hidden p-2.5 sm:gap-4 sm:p-4", glassCardLg)}>
                    <div className={cn("relative h-16 w-16 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--bg-alt)]", glassContent)}>
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={postTitle}
                          fill
                          sizes="96px"
                          className="object-cover object-[center_25%] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-alt)] to-[var(--bg-surface)]">
                          <span className="font-display text-[var(--text-3)] text-lg font-bold opacity-[0.15]">FMA</span>
                        </div>
                      )}
                    </div>
                    <div className={cn("flex-1 min-w-0", glassContent)}>
                      {postCategory && (
                        <span className="inline-block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--brand)] mb-1 sm:mb-1.5">
                          {postCategory}
                        </span>
                      )}
                      <h4 className="font-display font-bold text-[var(--text-1)] text-[11px] sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {postTitle}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[var(--text-3)] text-[9px] sm:text-[11px] font-semibold mt-1 sm:mt-2">
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-70 shrink-0" />
                        {formatDate(post.publishedAt || post.createdAt, locale)}
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 sm:mt-10 text-center md:hidden">
        <Link
          href={viewAllHref}
          className={cn(buttonFilterInactive, "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold shadow-sm")}
        >
          {viewAllLabel} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
      </div>
    </section>
  );
}
