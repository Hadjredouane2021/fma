import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { PageHeroImage } from "@/components/common/PageHeroImage";
import { FormationCard } from "@/components/common/FormationCard";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import {
  filterActiveFormations,
  sortFormationsByDate,
} from "@/lib/formations-site-public";
import { getFormationsPageData } from "@/lib/formations-cache";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const { content: c } = await getFormationsPageData();
  return { title: `${c.heroTitle[l]} | FMA`, description: c.heroSubtitle[l] };
}

export default async function FormationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const { content: c, heroImage } = await getFormationsPageData();
  const formations = sortFormationsByDate(filterActiveFormations(c.formations));

  return (
    <div>
      <PageHero locale={l}>
        {heroImage ? <PageHeroImage src={heroImage} alt={c.heroTitle[l]} /> : null}
      </PageHero>

      <Section>
        {formations.length === 0 ? (
          <div className="py-20 text-center text-[var(--text-3)]">
            <p>
              {l === "ar" ? "لا توجد تدريبات حالياً" : l === "en" ? "No training available" : "Aucune formation disponible"}
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-8 text-2xl font-bold text-primary gold-accent">
              {c.formationsSectionTitle[l] || c.formationsSectionTitle.fr}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {formations.map((f) => (
                <FormationCard key={f.id} formation={f} locale={l} localePath={locale} />
              ))}
            </div>
          </>
        )}
      </Section>

      <Section containerClassName="max-w-3xl">
        <h2 className="mb-8 text-2xl font-bold text-primary gold-accent">
          {c.faqTitle[l] || c.faqTitle.fr}
        </h2>
        <div className="mt-8 space-y-3">
          {c.faq.map((item) => {
            const question = item.question[l] || item.question.fr;
            const answer = item.answer[l] || item.answer.fr;
            return (
              <details key={item.id} className="glass-liquid card-hover group rounded-2xl">
                <summary className="relative z-10 flex cursor-pointer items-center justify-between p-5 font-semibold text-[var(--text-1)] group-open:text-primary">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 shrink-0 text-gold" />
                    {question}
                  </span>
                  <span className="ml-4 shrink-0 text-2xl text-[var(--text-3)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="relative z-10 border-t border-[var(--border)] px-5 pb-5 pt-4 text-sm leading-relaxed text-[var(--text-2)]">
                  {answer}
                </div>
              </details>
            );
          })}
        </div>
      </Section>

      <Section containerClassName="text-center">
        <h2 className="mb-6 text-2xl font-bold text-primary">{c.ctaTitle[l] || c.ctaTitle.fr}</h2>
        <Link href={`/${locale}/contact`}>
          <Button variant="primary" shape="rounded" size="lg">
            {c.ctaButton[l] || c.ctaButton.fr} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Section>
    </div>
  );
}
