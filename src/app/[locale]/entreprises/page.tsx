import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { SectionBackground } from "@/components/common/SectionBackground";
import { EntreprisesProductCard } from "@/components/common/EntreprisesProductCard";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import {
  filterEntrepriseProductsByAudience,
} from "@/lib/entreprises-site-public";
import { getEntreprisesPageData } from "@/lib/entreprises-cache";
import { entreprisesHeroImageUrl } from "@/lib/entreprises-hero-image";
import type { EntreprisesContent } from "@/lib/entreprises-site-public";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const { content: c } = await getEntreprisesPageData();
  return { title: `${c.heroTitle[l]} | FMA`, description: c.heroSubtitle[l] };
}

function ProductSection({
  title,
  products,
  locale,
  localePath,
}: {
  title: string;
  products: EntreprisesContent["products"];
  locale: Locale;
  localePath: string;
}) {
  if (products.length === 0) return null;

  return (
    <>
      <h2 className="mb-8 text-2xl font-bold text-primary gold-accent">{title}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {products.map((p) => (
          <EntreprisesProductCard key={p.id} product={p} locale={locale} localePath={localePath} />
        ))}
      </div>
    </>
  );
}

export default async function EntreprisesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const { content: c, heroImages } = await getEntreprisesPageData();
  const heroImage = entreprisesHeroImageUrl(heroImages, l);
  const entreprisesProducts = filterEntrepriseProductsByAudience(c.products, "entreprises");
  const professionnelsProducts = filterEntrepriseProductsByAudience(c.products, "professionnels");

  return (
    <SectionBackground id="entreprises">
      <PageHero locale={l}>
        {heroImage && <PageHeroImage src={heroImage} alt={c.heroTitle[l]} />}
      </PageHero>

      {(entreprisesProducts.length > 0 || professionnelsProducts.length > 0) && (
        <Section className="space-y-16">
          <ProductSection
            title={c.entreprisesSectionTitle[l] || c.entreprisesSectionTitle.fr}
            products={entreprisesProducts}
            locale={l}
            localePath={locale}
          />
          <ProductSection
            title={c.professionnelsSectionTitle[l] || c.professionnelsSectionTitle.fr}
            products={professionnelsProducts}
            locale={l}
            localePath={locale}
          />
        </Section>
      )}

      <Section containerClassName="max-w-3xl">
        <h2 className="text-2xl font-bold text-primary mb-8 gold-accent">
          {c.faqTitle[l] || c.faqTitle.fr}
        </h2>
        <div className="space-y-3 mt-8">
          {c.faq.map((item) => {
            const question = item.question[l] || item.question.fr;
            const answer = item.answer[l] || item.answer.fr;
            return (
              <details key={item.id} className="glass-liquid rounded-2xl card-hover group">
                <summary className="relative z-10 flex items-center justify-between p-5 cursor-pointer font-semibold text-[var(--text-1)] group-open:text-primary">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
                    {question}
                  </span>
                  <span className="text-[var(--text-3)] group-open:rotate-45 transition-transform text-2xl ml-4 flex-shrink-0">+</span>
                </summary>
                <div className="relative z-10 px-5 pb-5 text-[var(--text-2)] text-sm leading-relaxed border-t border-[var(--border)] pt-4">{answer}</div>
              </details>
            );
          })}
        </div>
      </Section>

      <Section containerClassName="text-center">
        <h2 className="text-2xl font-bold text-primary mb-6">{c.ctaTitle[l] || c.ctaTitle.fr}</h2>
        <Link href={`/${locale}/contact`}>
          <Button variant="primary" shape="rounded" size="lg">
            {c.ctaButton[l] || c.ctaButton.fr} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </Section>
    </SectionBackground>
  );
}
