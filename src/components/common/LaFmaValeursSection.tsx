import { EqualHeightGrid } from "@/components/common/EqualHeightGrid";
import { LaFmaPremiumCard } from "@/components/common/LaFmaPremiumCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Section } from "@/components/ui/Section";
import type { LaFmaValeur } from "@/lib/la-fma-site-public";
import type { Locale } from "@/types";

type LaFmaValeursSectionProps = {
  locale: Locale;
  title: string;
  description?: string;
  valeurs: LaFmaValeur[];
};

export function LaFmaValeursSection({ locale, title, description, valeurs }: LaFmaValeursSectionProps) {
  const l = locale;

  return (
    <Section className="la-fma-valeurs">
      <SectionHeader title={title} />
      {description ? (
        <p className="la-fma-valeurs__intro mt-4 max-w-2xl leading-relaxed text-[var(--text-2)]">
          {description}
        </p>
      ) : null}
      <EqualHeightGrid className="la-fma-valeurs__grid mt-10 sm:mt-12">
        {valeurs.map((valeur, idx) => (
          <article
            key={`la-fma-valeur-${idx}`}
            data-equal-height-item
            className="la-fma-team-card la-fma-mission-card"
          >
            <div className="la-fma-org-card__accent" aria-hidden />
            <div className="la-fma-team-card__content flex h-full min-h-0 flex-col">
              <LaFmaPremiumCard
                icon={valeur.icon}
                title={valeur.title[l]}
                description={valeur.description[l]}
                showAccent={false}
              />
            </div>
          </article>
        ))}
      </EqualHeightGrid>
    </Section>
  );
}
