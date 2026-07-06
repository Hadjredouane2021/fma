import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { SectionBackground } from "@/components/common/SectionBackground";
import { ParticuliersInsuranceCard } from "@/components/common/ParticuliersInsuranceCard";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getParticuliersPageData } from "@/lib/particuliers-cache";
import { particuliersHeroImageUrl } from "@/lib/particuliers-hero-image";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const { content: c } = await getParticuliersPageData();
  return { title: `${c.heroTitle[l]} | FMA`, description: c.heroSubtitle[l] };
}

export default async function ParticuliersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const { content: c, heroImages } = await getParticuliersPageData();
  const heroImage = particuliersHeroImageUrl(heroImages, l);

  return (
    <SectionBackground id="particuliers">
      <PageHero locale={l}>
        {heroImage && <PageHeroImage src={heroImage} alt={c.heroTitle[l]} />}
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {c.cards.map((ins) => (
            <ParticuliersInsuranceCard key={ins.id} card={ins} locale={l} localePath={locale} />
          ))}
        </div>
      </Section>

      <Section containerClassName="text-center">
        <h2 className="mb-4 text-2xl font-bold text-primary">{c.ctaTitle[l]}</h2>
        <p className="mb-8 text-[var(--text-2)]">{c.ctaSubtitle[l]}</p>
        <Link href={`/${locale}/contact`}>
          <Button variant="primary" shape="rounded" size="lg">
            {c.ctaButton[l]} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Section>
    </SectionBackground>
  );
}
