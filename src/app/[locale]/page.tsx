import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestPublishedPosts } from "@/lib/posts-cache";
import { getHomePageGalleries } from "@/lib/galleries-cache";
import { getGalleryCarouselItems } from "@/lib/galleries";
import { LatestNewsSection } from "@/components/common/LatestNewsSection";
import { KeyFiguresSection } from "@/components/common/KeyFiguresSection";
import { ConseilFmaCarousel } from "@/components/common/ConseilFmaCarousel";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { HeroBackgroundPhoto } from "@/components/common/HeroBackgroundPhoto";
import { getHomeContent } from "@/lib/site-content";
import { getChiffresClesContent } from "@/lib/chiffres-cles-cache";
import { resolveHomeKeyFigure } from "@/lib/chiffres-cles-site-public";
import { sectionBgClassName } from "@/lib/section-backgrounds";
import type { Locale, Post } from "@/types";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const home = await getHomeContent();
  const l = (locale as Locale) ?? "fr";
  return {
    title: `${home.title[l]} | FMA`,
    description: home.subtitle[l],
    alternates: { canonical: `/${locale}`, languages: { fr: "/fr", en: "/en", ar: "/ar" } },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "home" });

  const [latestPosts, home, homeGalleries, chiffresCles] = await Promise.all([
    getLatestPublishedPosts(),
    getHomeContent(),
    getHomePageGalleries(),
    getChiffresClesContent(),
  ]);

  const KEY_FIGURES = home.keyFigures.map((fig) => {
    const resolved = resolveHomeKeyFigure(fig, chiffresCles, l);
    const stackKey = fig.stackGroup?.fr?.trim() || "";
    const stackTitle =
      fig.stackGroup?.[l]?.trim() || fig.stackGroup?.fr?.trim() || "";
    return {
      ...resolved,
      stackGroup: stackKey || undefined,
      stackGroupTitle: stackKey ? stackTitle : undefined,
    };
  });
  const globalFigureCfg = home.keyFiguresSection.globalFigure;
  const hasGlobalFigure = globalFigureCfg.valueSource !== "manual" || Boolean(globalFigureCfg.value);
  const GLOBAL_FIGURE = hasGlobalFigure ? resolveHomeKeyFigure(globalFigureCfg, chiffresCles, l) : undefined;
  const keyFiguresImageUrl =
    home.keyFiguresSection.imageUrl[l]?.trim() || home.keyFiguresSection.imageUrl.fr?.trim() || "";

  const interventionsFma = homeGalleries.interventionsFma;
  const interventionsFmaItems = getGalleryCarouselItems(interventionsFma).map((item) => ({
    url: item.url,
    link: item.link,
    title: item.photoTitle?.[l]?.trim() || item.photoTitle?.fr?.trim() || "",
  }));
  const reseauxSociaux = homeGalleries.reseauxSociaux;
  const reseauxSociauxItems = getGalleryCarouselItems(reseauxSociaux).map((item) => ({
    url: item.url,
    link: item.link,
    title: item.photoTitle?.[l]?.trim() || item.photoTitle?.fr?.trim() || "",
  }));
  const viewAllLabel = l === "ar" ? "عرض الكل" : l === "en" ? "View all" : "Voir tout";

  const displayFont = l !== "ar";

  // Fallback défensif : si une valeur cachée pré-migration manque `hero`,
  // on retombe sur la configuration par défaut (rendu original).
  const heroBg = home.hero?.background ?? {
    type: "default" as const,
    color: "#ffffff",
    imageUrl: "",
    showOverlays: true,
  };
  const heroStyle: React.CSSProperties = {};
  if (heroBg.type === "color" && heroBg.color) {
    heroStyle.backgroundColor = heroBg.color;
    heroStyle.backgroundImage = "none";
  }
  const heroImageUrl = heroBg.type === "image" ? heroBg.imageUrl : "";

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ── HERO ── */}
      <section
        className={cn(
          sectionBgClassName("hero"),
          "hero-light hero-home relative border-b border-[var(--border)] bg-transparent",
          heroImageUrl && "hero-home--has-photo",
          heroBg.showOverlays && "hero-overlays"
        )}
        style={heroStyle}
      >
        {heroImageUrl ? <HeroBackgroundPhoto src={heroImageUrl} /> : null}
        {heroBg.showOverlays && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-[var(--header-h)] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+1px)] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="hero-home__halo-main" aria-hidden />
            <div className="hero-home__halo-secondary" aria-hidden />
          </>
        )}

        <div className="container-custom hero-home__inner relative z-10">
          <div className="hero-home__content">
            <div className="hero-home__badge inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 glass-panel text-[var(--text-2)] text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 sm:text-[11px] sm:tracking-[0.2em] sm:px-5 sm:py-2.5 rounded-full mb-5 sm:mb-8 animate-fade-in-up shadow-sm">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent shadow-sm" />
              <span className="min-w-0 leading-snug">{home.badge[l]}</span>
            </div>
            <h1
              className={cn(
                "hero-home__title font-bold text-[var(--text-1)] leading-[1.05] mb-4 sm:mb-7 tracking-tight animate-fade-in-up",
                displayFont && "font-display"
              )}
              style={{ animationDelay: "0.08s" }}
            >
              {home.title[l]}
            </h1>
            <p
              className="mb-7 max-w-full text-[0.9375rem] leading-relaxed font-medium text-[var(--text-1)] animate-fade-in-up sm:mb-10 sm:max-w-xl sm:text-lg md:text-xl"
              style={{ animationDelay: "0.15s" }}
            >
              {home.subtitle[l]}
            </p>
            <div className="flex flex-wrap gap-2.5 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "0.22s" }}>
              <Link href={`/${locale}/${home.cta1.href}`}>
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  {home.cta1.label[l]} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href={`/${locale}/${home.cta2.href}`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {home.cta2.label[l]}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY FIGURES ── */}
      <KeyFiguresSection
        eyebrow={home.keyFiguresSection.eyebrow[l] ?? ""}
        figures={KEY_FIGURES}
        locale={locale}
        imageUrl={keyFiguresImageUrl}
        figureCaption={home.keyFiguresSection.figureCaption[l] ?? ""}
        globalFigure={GLOBAL_FIGURE}
      />

      {/* ── INTERVENTIONS FMA ── */}
      {interventionsFmaItems.length > 0 && (
        <Section className={cn(sectionBgClassName("interventions-fma"), "bg-transparent")}>
          <SectionHeader title={interventionsFma.title[l]} />
          <ConseilFmaCarousel
            items={interventionsFmaItems}
            imageAltPrefix={interventionsFma.title[l]}
          />
          <p className="mt-8 text-center">
            <Link
              href={`/${locale}/publications?type=interventions-fma`}
              className="inline-flex items-center gap-2 text-sm font-bold text-accent transition-all hover:gap-3"
            >
              {viewAllLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </Section>
      )}

      {/* ── RÉSEAUX SOCIAUX ── */}
      {reseauxSociauxItems.length > 0 && (
        <Section className={cn(sectionBgClassName("reseaux-sociaux"), "bg-transparent")}>
          <SectionHeader title={reseauxSociaux.title[l]} />
          <ConseilFmaCarousel
            items={reseauxSociauxItems}
            imageAltPrefix={reseauxSociaux.title[l]}
          />
          <p className="mt-8 text-center">
            <Link
              href={`/${locale}/publications?type=reseaux-sociaux`}
              className="inline-flex items-center gap-2 text-sm font-bold text-accent transition-all hover:gap-3"
            >
              {viewAllLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </Section>
      )}

      {/* ── LATEST NEWS ── */}
      <LatestNewsSection
        posts={latestPosts as Post[]}
        locale={l}
        title={t("latestNews.title")}
        subtitle={t("latestNews.subtitle")}
        viewAllLabel={t("latestNews.viewAll")}
        viewAllHref={`/${locale}/actualites`}
      />

      {/* ── NEWSLETTER ── */}
      <Section
        className={cn(sectionBgClassName("newsletter"), "bg-transparent")}
        containerClassName="max-w-2xl mx-auto text-center"
      >
        <div className="glass-liquid mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl card-hover">
          <span className="relative z-10 text-3xl" aria-hidden>
            📧
          </span>
        </div>
        <h2 className={cn("text-3xl font-bold tracking-tight text-[var(--text-1)] sm:text-4xl", displayFont && "font-display")}>
          {t("newsletter.title")}
        </h2>
        <p className="mt-4 text-lg text-[var(--text-2)]">{t("newsletter.subtitle")}</p>
        <div className="mt-10">
          <NewsletterForm locale={locale} />
        </div>
      </Section>
    </div>
  );
}
