import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import type { Post, Locale } from "@/types";
import { cn } from "@/lib/utils";
import { glassCardLg, glassContent } from "@/lib/surface-styles";

interface NewsCardProps {
  post: Post;
  locale: Locale;
  className?: string;
}

export function NewsCard({ post, locale, className }: NewsCardProps) {
  const title =
    locale === "ar" ? (post.titleAr || post.titleFr) : locale === "en" ? (post.titleEn || post.titleFr) : post.titleFr;
  const excerpt =
    locale === "ar"
      ? (post.excerptAr || post.excerptFr || "")
      : locale === "en"
        ? (post.excerptEn || post.excerptFr || "")
        : post.excerptFr || "";
  const href = `/${locale}/actualites/${post.slug}`;
  const catName = post.category
    ? locale === "ar"
      ? post.category.nameAr || post.category.nameFr
      : locale === "en"
        ? post.category.nameEn || post.category.nameFr
        : post.category.nameFr
    : null;

  return (
    <Link href={href} className={cn("group block h-full", className)}>
      <article className={cn("relative overflow-hidden h-full flex flex-col", glassCardLg)}>
        <div className={cn("relative aspect-[16/10] overflow-hidden bg-[var(--bg-alt)]", glassContent)}>
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
              className="object-cover object-[center_25%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-alt)] to-[var(--bg-surface)]">
              <span className="font-display text-[var(--text-3)] text-5xl font-bold opacity-[0.12]">FMA</span>
            </div>
          )}
          {catName && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center rounded-full bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] text-[var(--text-1)] text-[11px] font-bold px-3 py-1.5 shadow-sm">
                {catName}
              </span>
            </div>
          )}
        </div>

        <div className={cn("p-6 flex flex-col flex-1", glassContent)}>
          <div className="flex items-center gap-2 text-[var(--text-3)] text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            {formatDate(post.publishedAt || post.createdAt, locale)}
          </div>
          <h3 className="font-display font-bold text-[var(--text-1)] text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug tracking-tight">
            {title}
          </h3>
          {excerpt && (
            <p className="text-[var(--text-2)] text-sm leading-relaxed line-clamp-2 flex-1">
              {truncate(excerpt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), 120)}
            </p>
          )}
          <div className="flex items-center gap-2 text-accent text-sm font-bold mt-5 group-hover:gap-3 transition-all">
            <span>{locale === "ar" ? "اقرأ المزيد" : locale === "en" ? "Read more" : "Lire la suite"}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}
