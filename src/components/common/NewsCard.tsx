import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowUpRight } from "lucide-react";
import { formatDate, truncate, cn } from "@/lib/utils";
import type { Post, Locale } from "@/types";

interface NewsCardProps {
  post: Post;
  locale: Locale;
  className?: string;
  variant?: "default" | "featured";
}

export function NewsCard({ post, locale, className, variant = "default" }: NewsCardProps) {
  const title =
    locale === "ar" ? post.titleAr || post.titleFr : locale === "en" ? post.titleEn || post.titleFr : post.titleFr;
  const excerpt =
    locale === "ar"
      ? post.excerptAr || post.excerptFr || ""
      : locale === "en"
        ? post.excerptEn || post.excerptFr || ""
        : post.excerptFr || "";
  const href = `/${locale}/actualites/${post.slug}`;
  const catName = post.category
    ? locale === "ar"
      ? post.category.nameAr || post.category.nameFr
      : locale === "en"
        ? post.category.nameEn || post.category.nameFr
        : post.category.nameFr
    : null;

  const isFeatured = variant === "featured";
  const readMore = locale === "ar" ? "اقرأ المزيد" : locale === "en" ? "Read more" : "Lire la suite";

  return (
    <Link href={href} className={cn("group block h-full", className)}>
      <article className="news-card-glass relative flex h-full flex-col">
        <div
          className={cn(
            "news-card-glass__media relative overflow-hidden bg-[var(--bg-alt)]",
            isFeatured ? "aspect-[2/1] sm:aspect-[21/9]" : "aspect-[16/10]"
          )}
        >
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={title}
              fill
              sizes={isFeatured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"}
              className="object-cover object-[center_25%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              priority={isFeatured}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-alt)] to-[var(--bg-surface)]">
              <span
                className={cn(
                  "font-display font-bold text-[var(--text-3)] opacity-[0.12]",
                  isFeatured ? "text-7xl" : "text-5xl"
                )}
              >
                FMA
              </span>
            </div>
          )}
          {catName ? (
            <div className="absolute start-4 top-4">
              <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--glass-bg)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--text-1)] shadow-sm backdrop-blur-md sm:text-[11px]">
                {catName}
              </span>
            </div>
          ) : null}
        </div>

        <div className={cn("news-card-glass__body flex flex-1 flex-col", isFeatured ? "p-5 sm:p-7 lg:p-8" : "p-5 sm:p-6")}>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-3)] sm:text-[11px]">
            <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
            {formatDate(post.publishedAt || post.createdAt, locale)}
          </div>
          <h3
            className={cn(
              "mb-3 line-clamp-2 font-display font-bold leading-snug tracking-tight text-[var(--text-1)] transition-colors group-hover:text-primary",
              isFeatured ? "text-xl sm:text-2xl lg:line-clamp-3" : "text-lg"
            )}
          >
            {title}
          </h3>
          {excerpt ? (
            <p
              className={cn(
                "line-clamp-2 flex-1 text-[var(--text-2)] leading-relaxed",
                isFeatured ? "text-sm sm:text-base sm:line-clamp-3" : "text-sm"
              )}
            >
              {truncate(excerpt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), isFeatured ? 200 : 120)}
            </p>
          ) : null}
          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-accent transition-all group-hover:gap-3">
            <span>{readMore}</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}
