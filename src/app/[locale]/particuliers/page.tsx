import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { ParticuliersInsuranceCard } from "@/components/common/ParticuliersInsuranceCard";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DB_KEYS } from "@/lib/db-keys";
import {
  DEFAULT_PARTICULIERS_CONTENT,
  normalizeParticuliersContent,
  PARTICULIERS_KEY,
  type ParticuliersContent,
} from "@/lib/particuliers-site-public";
import type { Locale } from "@/types";
import type { Metadata } from "next";

async function getContent(): Promise<ParticuliersContent> {
  const row = await prisma.setting.findUnique({ where: { key: PARTICULIERS_KEY } }).catch(() => null);
  if (!row) return DEFAULT_PARTICULIERS_CONTENT;
  try {
    return normalizeParticuliersContent(JSON.parse(row.value));
  } catch {
    return DEFAULT_PARTICULIERS_CONTENT;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const c = await getContent();
  return { title: `${c.heroTitle[l]} | FMA`, description: c.heroSubtitle[l] };
}

export default async function ParticuliersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const [c, heroRow] = await Promise.all([
    getContent(),
    prisma.setting.findUnique({ where: { key: DB_KEYS.PARTICULIERS_HERO } }).catch(() => null),
  ]);
  const heroImage = heroRow?.value?.trim() || null;

  return (
    <div>
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
    </div>
  );
}
